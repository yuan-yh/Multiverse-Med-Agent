"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";
import { AlertCircleIcon, Loader2, Upload, X, FileImage } from "lucide-react";
import { SuggestAgentCard } from "./SuggestAgentCard";
import type { medicalAgent } from "./MedicalAgentCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { sessionDetail } from "../medical-agent/[sessionId]/page";

function CreateDialogSession() {
    const [step, setStep] = useState<"input" | "suggest">("input");
    const [note, setNote] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [suggestedDoctorList, setSuggestedDoctorList] = useState<medicalAgent[] | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<medicalAgent>();
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const { has } = useAuth();
    const premiumUser = has && has({ plan: 'pro' });
    const [historyList, setHistoryList] = useState<sessionDetail[]>([]);

    useEffect(() => {
        getHistoryList();
    }, []);

    const getHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all');
        setHistoryList(result.data);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/dicom'];
            if (!validTypes.includes(file.type) && !file.name.endsWith('.dcm')) {
                setErrorMsg("Please upload a valid medical image (JPEG, PNG, or DICOM format)");
                return;
            }

            // Validate file size (e.g., 50MB limit)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                setErrorMsg("File size must be less than 50MB");
                return;
            }

            setUploadedImage(file);
            setErrorMsg(null);

            // Create preview for non-DICOM images
            if (file.type.startsWith('image/') && !file.name.endsWith('.dcm')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setImagePreview(null); // DICOM files won't have preview
            }
        }
    };

    const removeImage = () => {
        setUploadedImage(null);
        setImagePreview(null);
    };

    // const handleDoctorSuggest = async () => {
    //     try {
    //         setLoading(true);
    //         setErrorMsg(null);

    //         // Create FormData to send both text and image
    //         const formData = new FormData();
    //         formData.append('note', note);
    //         if (uploadedImage) {
    //             formData.append('medicalImage', uploadedImage);
    //         }

    //         const result = await axios.post("/api/suggest-doctor", formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         const data = result.data;

    //         if (Array.isArray(data)) {
    //             setSuggestedDoctorList(data);
    //             setStep("suggest");
    //         } else if (data?.error?.message) {
    //             setErrorMsg(data.error.message);
    //         } else {
    //             setErrorMsg("Unexpected response from the server.");
    //         }
    //     } catch (error: any) {
    //         setErrorMsg("An error occurred. Please try again later.");
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleDoctorSuggest = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);

            const result = await axios.post("/api/suggest-doctor", { note });
            const data = result.data;
            console.log(data);

            // Check if it's an error
            if (Array.isArray(data)) {
                setSuggestedDoctorList(data);
                setStep("suggest");
            } else if (data?.error?.message) {
                setErrorMsg(data.error.message);
            } else {
                setErrorMsg("Unexpected response from the server.");
            }
        } catch (error: any) {
            setErrorMsg("An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep("input");
        setSuggestedDoctorList(null);
    };

    const handleCall = async () => {
        setLoading(true);
        try {
            let imageBase64 = null;
            let imageFileName = null;
            let imageFileType = null;

            // Convert image to base64 if exists
            if (uploadedImage) {
                const reader = new FileReader();
                imageBase64 = await new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        const base64 = reader.result as string;
                        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
                    };
                    reader.readAsDataURL(uploadedImage);
                });
                imageFileName = uploadedImage.name;
                imageFileType = uploadedImage.type;
            }

            // const result = await axios.post('/api/session-chat', {
            //     notes: note,
            //     selectedDoctor: selectedDoctor,
            // });

            const payload = {
                notes: note,
                selectedDoctor: selectedDoctor,
                imageData: imageBase64,
                imageFileName: imageFileName,
                imageFileType: imageFileType,
            };

            const result = await axios.post('/api/session-chat', payload);

            if (result.data?.sessionId) {
                router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
            } else {
                setErrorMsg("Failed to create session. No session ID received.");
            }
        } catch (error) {
            console.error("Call failed:", error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setErrorMsg("Session endpoint not found. Please try again later.");
                } else {
                    setErrorMsg(error.response?.data?.message || "An error occurred during the call.");
                }
            } else {
                setErrorMsg("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-3" disabled={!premiumUser && historyList?.length >= 1}>+ Start a Consultation</Button>
            </DialogTrigger>

            {step === "input" && (
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Cancer Consultation - Patient Information</DialogTitle>
                        <DialogDescription>
                            Please upload the patient's medical imaging (mammogram, ultrasound, or MRI) and provide relevant clinical background, which will help our AI-powered specialist provide accurate diagnostic support.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        {/* Image Upload Section */}
                        <div className="space-y-2">
                            <Label htmlFor="medical-image">Medical Imaging *</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                {!uploadedImage ? (
                                    <>
                                        <Input
                                            id="medical-image"
                                            type="file"
                                            accept="image/*,.dcm"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <Label
                                            htmlFor="medical-image"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Click to upload scanning
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">
                                                Supported formats: JPEG, PNG, DICOM (max 50MB)
                                            </span>
                                        </Label>
                                    </>
                                ) : (
                                    <div className="relative">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Medical scan preview"
                                                className="max-h-48 mx-auto rounded"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center p-4">
                                                <FileImage className="h-16 w-16 text-gray-400 mr-3" />
                                                <span className="text-sm text-gray-600">
                                                    {uploadedImage.name}
                                                </span>
                                            </div>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={removeImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Patient Background Section */}
                        <div className="space-y-2">
                            <Label htmlFor="patient-background">Patient Clinical Background *</Label>
                            <Textarea
                                id="patient-background"
                                placeholder="Please provide patient information including: name / age / symptoms"
                                aria-label="Patient clinical background"
                                className="h-[200px] mt-1"
                                value={note}
                                onChange={(e) => {
                                    setNote(e.target.value);
                                    setErrorMsg(null);
                                }}
                            />
                        </div>

                        {errorMsg && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>Unable to process consultation</AlertTitle>
                                <AlertDescription>{errorMsg}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            disabled={!note || !uploadedImage || loading}
                            onClick={handleDoctorSuggest}
                        >
                            Find Specialist
                            {loading ? <Loader2 className="animate-spin ml-2" /> : <IconArrowRight className="ml-2" />}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}

            {step === "suggest" && suggestedDoctorList && (
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Select AI Specialist</DialogTitle>
                        <DialogDescription>
                            Based on the patient's imaging and clinical background, here are recommended AI specialists for consultation.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-5">
                        {suggestedDoctorList.map((doctor, index) => (
                            //@ts-ignore
                            <SuggestAgentCard agent={doctor} key={index} selectedDoctor={selectedDoctor} setSelectedDoctor={() => setSelectedDoctor(doctor)} />
                        ))}
                    </div>

                    {errorMsg && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Unable to start consultation</AlertTitle>
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={handleBack}>
                            <IconArrowLeft className="mr-1" />
                            Back
                        </Button>
                        <Button disabled={loading || !selectedDoctor} onClick={handleCall}>
                            Start
                            {loading ? <Loader2 className="animate-spin ml-2" /> : <IconArrowRight className="ml-2" />}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}

export default CreateDialogSession;
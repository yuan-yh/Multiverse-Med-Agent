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
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";
import { AlertCircleIcon, Loader2 } from "lucide-react";
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
    const router = useRouter();
    const { has } = useAuth();
    const premiumUser = has && has({ plan: 'pro' });
    const [historyList, setHistoryList] = useState<sessionDetail[]>([]);

    useEffect(() => {
        getHistoryList();
    }, []);

    const getHistoryList = async () => {
        // console.log('----get history----');
        const result = await axios.get('/api/session-chat?sessionId=all');
        // console.log(result.data);
        setHistoryList(result.data);
    };

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
        setSuggestedDoctorList(null); // Optional: clear results if needed
    };

    // const handleCall = async () => {
    //     setLoading(true);
    //     console.log("Start the call...");
    //     const result = await axios.post('/api/session-chat', {
    //         notes: note,
    //         selectedDoctor: selectedDoctor,
    //     })

    //     console.log(result.data);
    //     if (result.data?.sessionId) {
    //         console.log(result.data.sessionId);
    //         router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
    //     }
    //     setLoading(false);
    // };
    const handleCall = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/session-chat', {
                notes: note,
                selectedDoctor: selectedDoctor,
            });

            console.log(result.data);
            if (result.data?.sessionId) {
                console.log(result.data.sessionId);
                router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
            } else {
                // Handle case where sessionId is missing in successful response
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
            setLoading(false); // This will always run, regardless of success or failure
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-3" disabled={!premiumUser && historyList?.length >= 1}>+ Start a Call</Button>
            </DialogTrigger>

            {step === "input" && (
                // <DialogContent className="sm:max-w-[425px]">
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Add Background Information</DialogTitle>
                        <DialogDescription>
                            How are you feeling today? Please describe your symptoms.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <Textarea
                            placeholder="Write down symptoms here..."
                            aria-label="Symptoms description"
                            className="h-[150px] mt-1"
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setErrorMsg(null);
                            }}
                        />
                        {(errorMsg != null) && (<Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Unable to process your Consultation.</AlertTitle>
                            <AlertDescription>
                                <p>Please verify your billing information and try again.</p>
                                <ul className="list-inside list-disc text-sm">
                                    <li>Deep Breath</li>
                                    <li>Find a Seagull</li>
                                    <li>Try Later</li>
                                </ul>
                            </AlertDescription>
                        </Alert>)}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={!note || loading} onClick={handleDoctorSuggest}>
                            Next
                            {loading ? <Loader2 className="animate-spin ml-2" /> : <IconArrowRight className="ml-2" />}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}

            {step === "suggest" && suggestedDoctorList && (
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Select Consultant</DialogTitle>
                        <DialogDescription>
                            Based on your symptoms, here are some suggested consultants.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-5">
                        {suggestedDoctorList.map((doctor, index) => (
                            //@ts-ignore
                            <SuggestAgentCard agent={doctor} key={index} selectedDoctor={selectedDoctor} setSelectedDoctor={() => setSelectedDoctor(doctor)} />
                        ))}
                    </div>

                    <div>
                        {(errorMsg != null) && (<Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Unable to process your Consultation.</AlertTitle>
                            <AlertDescription>
                                <p>Please verify your SEAGULL information and try again.</p>
                            </AlertDescription>
                        </Alert>)}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleBack}>
                            <IconArrowLeft className="mr-1" />
                            Back
                        </Button>
                        <Button disabled={loading || !selectedDoctor} onClick={handleCall}>
                            Call
                            {loading ? <Loader2 className="animate-spin ml-2" /> : <IconArrowRight className="ml-2" />}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}

export default CreateDialogSession;

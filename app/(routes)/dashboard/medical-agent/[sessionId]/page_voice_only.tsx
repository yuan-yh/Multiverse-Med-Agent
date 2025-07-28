"use client"

import axios from 'axios';
import 'dotenv/config';
import Vapi from '@vapi-ai/web';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { medicalAgent } from '@/app/(routes)/dashboard/_components/MedicalAgentCard';
import { Circle, Languages, Loader, Maximize2, PhoneCall, PhoneOff, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import provider from '@/app/provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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

export type sessionDetail = {
    id: number,
    notes: string,
    sessionId: string,
    report: JSON,
    selectedDoctor: medicalAgent,
    createdOn: string,
    imageData: string,
    imageFileName: string,
    imageFileType: string,
}

type messages = {
    role: string,
    text: string,
}

function MedicalVoiceAgent() {
    const { sessionId } = useParams();
    const [sessionDetail, setSessionDetail] = useState<sessionDetail>();
    const [callStarted, setCallStarted] = useState(false);
    const [vapiInstance, setVapiInstance] = useState<any>();
    const [currentSpeakerRole, setCurrentSpeakerRole] = useState<string | null>();
    const [liveTranscript, setLiveTranscript] = useState<string>();
    const [messages, setMessages] = useState<messages[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageFullscreen, setImageFullscreen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        sessionId && GetSessionDetails();
    }, [sessionId])

    const GetSessionDetails = async () => {
        const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
        console.log(result.data);
        setSessionDetail(result.data);
    }

    const startCall = () => {
        const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
        setVapiInstance(vapi);

        const VapiAgentConfig = {
            name: 'AI Medical Doctor Voice Agent',
            firstMessage: "Hi there, thank you for connecting. I am your AI Medical Assistant and I am here to help you. Can you please tell me full name and age?",
            transcriber: {
                provider: 'assembly-ai',
                Language: 'en',
            },
            voice: {
                provider: 'playht',
                voiceId: sessionDetail?.selectedDoctor?.voiceId,
            },
            model: {
                provider: 'openai',
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: sessionDetail?.selectedDoctor?.agentPrompt,
                    }
                ]
            }
        };

        // Start voice conversation
        // // @ts-ignore
        // vapi.start(VapiAgentConfig);
        vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);
        // Listen for events
        vapi.on('call-start', () => {
            console.log('Call started');
            setCallStarted(true);
        });
        vapi.on('call-end', () => {
            console.log('Call ended');
            setCallStarted(false);
        });

        vapi.on('message', (message) => {
            if (message.type === 'transcript') {
                // setLiveTranscription(prev => [...prev, {
                //     role: message.role,
                //     text: message.liveTranscription
                // }]);
                const { role, transcriptType, transcript } = message;
                console.log(`${message.role}: ${message.transcript}`);
                if (transcriptType == 'partial') {
                    setLiveTranscript(transcript);
                    setCurrentSpeakerRole(role);
                } else if (transcriptType == 'final') {
                    // final liveTranscription
                    setMessages((prev: any) => [...prev, { role: role, text: transcript }]);
                    setLiveTranscript("");
                    setCurrentSpeakerRole(null);
                }
            }
        });
        vapiInstance.on('speech-start', () => {
            console.log('Assistant started speaking');
            setCurrentSpeakerRole('assistant');
        });
        vapiInstance.on('speech-end', () => {
            console.log('Assistant stopped speaking');
            setCurrentSpeakerRole('user');
        });
    }

    const generateReport = async () => {
        console.log('----before generate report----');
        console.log(messages);
        console.log(sessionDetail);
        console.log(sessionId);
        console.log('----ready generate report----');
        const result = await axios.post('/api/medical-report', {
            messages: messages,
            sessionDetail: sessionDetail,
            sessionId: sessionId,
        })
        console.log('----generate report----');
        console.log(result.data);
        return result.data;
    };

    const endCall = async () => {
        if (!vapiInstance) return;

        setLoading(true);
        console.log('Ending call...');
        // End voice conversation
        vapiInstance.stop();
        // Optionally remove listeners for memory management
        try {
            vapiInstance.off?.('call-start');
            vapiInstance.off?.('call-end');
            vapiInstance.off?.('message');
        } catch (err) {
            console.warn('Could not remove listeners:', err);
        }

        // Reset call state
        setCallStarted(false);
        setVapiInstance(null);

        const result = await generateReport();
        setLoading(false);

        toast.success('Your report is generated!');
        router.replace('/dashboard');
    };

    // return (
    //     <div className='h-full'>
    //         <div className='p-5 border rounded-3xl bg-secondary'>
    //             <div className='flex justify-between items-center'>
    //                 <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} /> {callStarted ? 'Connected' : 'Not Connected ...'}</h2>
    //                 <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
    //             </div>

    //             <div className='flex h-[calc(100vh-200px)]'>
    //                 {/* left - image */}
    //                 {sessionDetail && <div className='flex items-center flex-col mt-10'>
    //                     <div className='bg-white rounded-lg p-3 shadow-sm'>
    //                         <img
    //                             src={`data:${sessionDetail.imageFileType};base64,${sessionDetail.imageData}`}
    //                             alt="Medical scan"
    //                             className='w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity'
    //                             onClick={() => setImageFullscreen(true)}
    //                         />
    //                         <p className='text-xs text-gray-500 mt-2'>{sessionDetail.imageFileName}</p>
    //                     </div>

    //                     {/* Patient Notes */}
    //                     <div className='mt-5'>
    //                         <h4 className='font-medium text-gray-700 mb-2'>Patient Background</h4>
    //                         <div className='bg-white rounded-lg p-3 shadow-sm'>
    //                             <p className='text-sm text-gray-600'>{sessionDetail.notes}</p>
    //                         </div>
    //                     </div>
    //                 </div>}
    //                 {/* right - live transcript */}
    //                 {sessionDetail && <div className='flex items-center flex-col mt-10'>
    //                     <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist} width={80} height={80}
    //                         className='h-[100px] w-[100px] object-cover rounded-full' />

    //                     <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
    //                     <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>

    //                     <div className='mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
    //                         {messages?.slice(-4).map((msg: messages, index) => (
    //                             <h2 className='text-gray-400 p-2' key={index}>{msg.role} :{msg.text}</h2>
    //                         ))}
    //                         {liveTranscript && liveTranscript?.length > 0 && <h2 className='text-lg'>{currentSpeakerRole} : {liveTranscript}</h2>}
    //                     </div>

    //                     {!callStarted
    //                         ?
    //                         <Button className='mt-20' onClick={startCall}><PhoneCall />Start Call</Button>
    //                         :
    //                         <Button className='mt-20' variant={'destructive'} onClick={endCall} disabled={loading}>
    //                             {loading ? <Loader className='animate-spin' /> : <PhoneOff />}End Call
    //                         </Button>
    //                     }
    //                 </div>}
    //             </div>
    //         </div>

    //         {/* Fullscreen Image Dialog */}
    //         <Dialog open={imageFullscreen} onOpenChange={setImageFullscreen}>
    //             <DialogContent className='max-w-[90vw] max-h-[90vh] p-0'>
    //                 <div className='relative'>
    //                     <Button
    //                         variant="ghost"
    //                         size="icon"
    //                         className='absolute top-2 right-2 z-10 bg-white/80 hover:bg-white'
    //                         onClick={() => setImageFullscreen(false)}
    //                     >
    //                         <X className='h-4 w-4' />
    //                     </Button>
    //                     {sessionDetail?.imageData && (
    //                         <img
    //                             src={`data:${sessionDetail.imageFileType};base64,${sessionDetail.imageData}`}
    //                             alt="Medical scan"
    //                             className='w-full h-full object-contain'
    //                         />
    //                     )}
    //                 </div>
    //             </DialogContent>
    //         </Dialog>
    //     </div>
    // )

    return (
        <div className='h-screen bg-gray-50'>
            {/* Header Bar */}
            <div className='bg-white border-b shadow-sm'>
                <div className='p-4 flex justify-between items-center'>
                    <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'>
                        <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
                        {callStarted ? 'Connected' : 'Not Connected ...'}
                    </h2>
                    <div className='text-lg font-mono text-gray-700'>
                        {callStarted ? '00:00' : '--:--'}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex h-[calc(100vh-73px)]'>
                {/* Left Panel - Medical Image */}
                <div className='w-2/5 border-r bg-white p-6 flex flex-col'>
                    <div className='flex-1 flex flex-col space-y-6'>
                        {/* Medical Image Section */}
                        {sessionDetail?.imageData && (
                            <div className='bg-gray-900 rounded-lg p-2'>
                                <img
                                    src={`data:${sessionDetail.imageFileType};base64,${sessionDetail.imageData}`}
                                    alt="Medical scan"
                                    className='w-full h-auto rounded cursor-pointer'
                                    onClick={() => setImageFullscreen(true)}
                                />
                                <div className='mt-2 flex justify-between items-center'>
                                    <p className='text-xs text-gray-500'>{sessionDetail.imageFileName}</p>
                                    <button
                                        onClick={() => setImageFullscreen(true)}
                                        className='text-xs text-blue-600 hover:text-blue-700 font-medium'
                                    >
                                        View Full Screen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Consultation */}
                <div className='flex-1 flex flex-col bg-gray-50'>
                    {/* Doctor Info Header */}
                    {sessionDetail && (
                        <div className='bg-white border-b px-6 py-4'>
                            <div className='flex items-center gap-4'>
                                <Image
                                    src={sessionDetail?.selectedDoctor?.image}
                                    alt={sessionDetail?.selectedDoctor?.specialist}
                                    width={60}
                                    height={60}
                                    className='h-[60px] w-[60px] object-cover rounded-full border-2 border-blue-200'
                                />
                                <div>
                                    <h2 className='text-lg font-semibold text-gray-800'>
                                        {sessionDetail?.selectedDoctor?.specialist}
                                    </h2>
                                    <p className='text-sm text-gray-500'>AI Medical Assistant</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transcript Area */}
                    <div className='flex-1 overflow-y-auto p-6'>
                        <div className='max-w-3xl mx-auto space-y-4'>
                            {messages.length === 0 && !callStarted && (
                                <div className='text-center py-12'>
                                    <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4'>
                                        <PhoneCall className='h-8 w-8 text-blue-600' />
                                    </div>
                                    <h3 className='text-lg font-medium text-gray-700 mb-2'>
                                        Ready to Start Consultation
                                    </h3>
                                    <p className='text-sm text-gray-500'>
                                        Click the button below to begin the voice consultation
                                    </p>
                                </div>
                            )}

                            {messages.map((msg: messages, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                                        ${msg.role === 'assistant' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {msg.role === 'assistant' ? 'AI' : 'P'}
                                        </div>
                                        <div className={`px-4 py-2.5 rounded-2xl ${msg.role === 'assistant'
                                            ? 'bg-white border border-gray-200'
                                            : 'bg-blue-500 text-white'
                                            }`}>
                                            <p className='text-sm leading-relaxed'>{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {liveTranscript && liveTranscript.length > 0 && (
                                <div className={`flex ${currentSpeakerRole === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`flex gap-3 max-w-[80%] ${currentSpeakerRole === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                                        ${currentSpeakerRole === 'assistant' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {currentSpeakerRole === 'assistant' ? 'AI' : 'P'}
                                        </div>
                                        <div className={`px-4 py-2.5 rounded-2xl opacity-70 ${currentSpeakerRole === 'assistant'
                                            ? 'bg-white border border-gray-200'
                                            : 'bg-blue-400 text-white'
                                            }`}>
                                            <p className='text-sm leading-relaxed italic'>{liveTranscript}</p>
                                            <div className='flex gap-1 mt-1'>
                                                <span className='w-1 h-1 bg-current rounded-full animate-pulse'></span>
                                                <span className='w-1 h-1 bg-current rounded-full animate-pulse delay-100'></span>
                                                <span className='w-1 h-1 bg-current rounded-full animate-pulse delay-200'></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Call Controls */}
                    <div className='bg-white border-t px-6 py-4'>
                        <div className='flex justify-center'>
                            {!callStarted ? (
                                <Button
                                    size="lg"
                                    className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-lg hover:shadow-xl transition-all'
                                    onClick={startCall}
                                >
                                    <PhoneCall className='h-5 w-5' />
                                    <span className='font-medium'>Start Consultation</span>
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    variant='destructive'
                                    className='bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full flex items-center gap-3 shadow-lg hover:shadow-xl transition-all'
                                    onClick={endCall}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className='h-5 w-5 animate-spin' />
                                            <span className='font-medium'>Generating Report...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PhoneOff className='h-5 w-5' />
                                            <span className='font-medium'>End Consultation</span>
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Dialog */}
            <Dialog open={imageFullscreen} onOpenChange={setImageFullscreen}>
                <DialogContent className='max-w-[95vw] max-h-[95vh] p-0 bg-black'>
                    <div className='relative h-full flex items-center justify-center'>
                        <Button
                            variant="ghost"
                            size="icon"
                            className='absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white'
                            onClick={() => setImageFullscreen(false)}
                        >
                            <X className='h-5 w-5' />
                        </Button>
                        {sessionDetail?.imageData && (
                            <img
                                src={`data:${sessionDetail.imageFileType};base64,${sessionDetail.imageData}`}
                                alt="Medical scan"
                                className='max-w-full max-h-full object-contain'
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MedicalVoiceAgent
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import { IconArrowRight } from '@tabler/icons-react'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export type medicalAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId?: string,
    subscriptionRequired: boolean
}

type props = {
    mAgent: medicalAgent
}

function MedicalAgentCard({ mAgent }: props) {
    const { has } = useAuth();
    const premiumUser = has && has({ plan: 'pro' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCall = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/session-chat', {
                notes: 'New Query',
                selectedDoctor: mAgent,
            });

            console.log(result.data);
            if (result.data?.sessionId) {
                console.log(result.data.sessionId);
                router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
            }
        } catch (error) {
            console.error("Call failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isLocked = mAgent.subscriptionRequired && !premiumUser;

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 dark:bg-zinc-900">
            {/* Premium Badge */}
            {mAgent.subscriptionRequired && (
                <Badge className='absolute top-3 right-3 z-20 bg-gradient-to-r from-blue-500 to-pink-500 text-white border-0 px-2.5 py-0.5 text-xs'>
                    Premium
                </Badge>
            )}

            {/* Image Container with Overlay */}
            <div className="relative h-[240px] overflow-hidden">
                <img
                    src={mAgent.image}
                    alt={mAgent.specialist}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isLocked ? 'filter blur-[2px] grayscale' : 'group-hover:scale-105'
                        }`}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                {/* Specialist Title - Limited to 2 lines */}
                <h3 className={`font-semibold text-base sm:text-lg text-gray-900 dark:text-neutral-200 line-clamp-2 min-h-[2.8rem] ${isLocked ? 'opacity-60' : ''
                    }`}>
                    {mAgent.specialist}
                </h3>

                {/* Description - Limited to 2 lines */}
                <p className={`text-sm text-gray-600 dark:text-neutral-400 line-clamp-2 min-h-[2.5rem] ${isLocked ? 'opacity-50' : ''
                    }`}>
                    {mAgent.description}
                </p>

                {/* Call Button */}
                {/* <Button
                    className={`w-full transition-all duration-200 bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500 text-white ${isLocked
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md hover:-translate-y-0.5'
                        }`}
                    disabled={isLocked || loading}
                    onClick={handleCall}
                    size="sm"
                >
                    <span className="flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <Loader2Icon className='w-4 h-4 animate-spin' />
                                Connecting...
                            </>
                        ) : (
                            <>
                                Start Consultation
                                <IconArrowRight className='w-4 h-4' />
                            </>
                        )}
                    </span>
                </Button> */}
            </div>

            {/* Lock Overlay for Premium Content */}
            {isLocked && (
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-white/95 dark:bg-zinc-900/95 rounded-lg p-6 mx-4 text-center shadow-xl">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Premium Feature</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Unlock this specialist with a premium membership
                        </p>
                        <Button
                            className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-100 hover:to-blue-600 text-white border-0"
                            size="sm"
                            onClick={() => router.push('/dashboard/billing')}
                        >
                            Upgrade Now
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MedicalAgentCard
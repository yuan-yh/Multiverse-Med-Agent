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
            setLoading(false); // This will always run, regardless of success or failure
        }
    };

    return (
        <div className="relative rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            {mAgent.subscriptionRequired && <Badge className='absolute m-2 right-9'>Premium</Badge>}
            <img
                src={mAgent.image}
                alt={mAgent.specialist}
                className="w-full h-[250px] object-cover rounded-xl"
            />

            <p className="font-bold text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 line-clamp-2 h-[3rem]">
                {mAgent.specialist}
            </p>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 h-[3rem]">
                {mAgent.description}
            </p>

            <Button className='w-full mt-2' disabled={mAgent.subscriptionRequired && !premiumUser} onClick={handleCall}>
                Start Call {loading ? <Loader2Icon className='animate-spin' /> : <IconArrowRight />}
            </Button>
        </div>
    );
}

export default MedicalAgentCard
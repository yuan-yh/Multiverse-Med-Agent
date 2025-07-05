import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import React from 'react'

export type medicalAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId: string,
    subscriptionRequired: boolean
}

type props = {
    mAgent: medicalAgent
}

function MedicalAgentCard({ mAgent }: props) {
    return (
        <div className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
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

            <Button className='w-full mt-2'>Start Call <IconArrowRight /> </Button>
        </div>
    );
}

export default MedicalAgentCard
import { MedicalAgents } from '@/shared/list'
import React from 'react'
import MedicalAgentCard from './MedicalAgentCard'

function MedicalAgentList() {
    return (
        <div className='mt-10'>
            <h2 className='font-bold text-xl'>AI Medical Consultant</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
                {
                    MedicalAgents.map((magent, index) => (
                        <div key={index}>
                            <MedicalAgentCard mAgent={magent} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default MedicalAgentList
import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import MedicalAgentList from './_components/MedicalAgentList'

function Dashboard() {
    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>Dashboard</h2>
                <Button>+ Talk With Doctor</Button>
            </div>
            <HistoryList />
            <MedicalAgentList />
        </div>
    )
}

export default Dashboard
import React from 'react'
import HistoryList from './_components/HistoryList'
import MedicalAgentList from './_components/MedicalAgentList'
import CreateDialogSession from './_components/CreateDialogSession'

function Dashboard() {
    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>Dashboard</h2>
                <CreateDialogSession />
            </div>
            <HistoryList />
            <MedicalAgentList />
        </div>
    )
}

export default Dashboard
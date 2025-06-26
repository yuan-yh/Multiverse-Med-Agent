import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'

function Dashboard() {
    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>Dashboard</h2>
                <Button>+ Talk With Doctor</Button>
            </div>
            <HistoryList />
        </div>
    )
}

export default Dashboard
"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import CreateDialogSession from './CreateDialogSession';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import { sessionDetail } from '../medical-agent/[sessionId]/page';

function HistoryList() {
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

    return (
        <div className='mt-10'>
            {
                historyList.length == 0
                    ?
                    <div className='flex items-center flex-col justify-center p-7 border border-2 border-dashed rounded-2xl'>
                        <Image src={'/medieval-plague-doctor.jpg'} alt='consult-doctor' width={150} height={150} />
                        <h2 className='font-bold text-xl mt-5'>No Recent Consultations</h2>
                        <p>It looks like you haven't talked with any doctors yet.</p>
                        <CreateDialogSession />
                    </div>
                    :
                    <div>
                        <HistoryTable historyList={historyList} />
                    </div>
            }
        </div>
    )
}

export default HistoryList
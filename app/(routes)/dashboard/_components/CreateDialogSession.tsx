"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { IconArrowRight } from '@tabler/icons-react'
import axios from 'axios'
import MedicalAgentCard, { medicalAgent } from './MedicalAgentCard'
import { Loader2 } from 'lucide-react'

function CreateDialogSession() {
    const [note, setNote] = useState<String>();
    const [loading, setLoading] = useState(false);
    const [suggestedDoctorList, setSuggestedDoctorList] = useState<medicalAgent>();

    const handleDoctorSuggest = async () => {
        setLoading(true);
        const result = await axios.post('/api/suggest-doctor', {
            note: note
        });
        console.log(result.data);
        setSuggestedDoctorList(result.data);
        setLoading(false);
    };

    const handleCall = () => { };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='mt-3'>+ Start a Call</Button>
            </DialogTrigger>
            {
                !suggestedDoctorList
                    ?
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Background Information</DialogTitle>
                            <DialogDescription>
                                How are you feeling today?
                                Please share your symptoms here.
                                Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <Textarea
                                placeholder='Write down symptoms here...'
                                aria-label='Symptoms description'
                                className='h-[150px] mt-1'
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button disabled={!note || loading} onClick={() => handleDoctorSuggest()}>
                                Next
                                {loading ? <Loader2 className='animate-spin' /> : <IconArrowRight />}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                    :
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Select Consultant</DialogTitle>
                            <DialogDescription>
                                How are you feeling today?
                                Please share your symptoms here.
                                Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-5">
                            {/* <Textarea className='h-[150px] mt-1'/> */}
                            {suggestedDoctorList.map((doctor, index) => (
                                <MedicalAgentCard mAgent={doctor} key={index} />
                            ))}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button disabled={!note || loading} onClick={() => handleCall()}>
                                Call
                                {loading ? <Loader2 className='animate-spin' /> : <IconArrowRight />}
                            </Button>
                        </DialogFooter>
                    </DialogContent>}
        </Dialog>
    )
}

export default CreateDialogSession

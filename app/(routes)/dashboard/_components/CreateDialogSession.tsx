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
import router from 'next/router'

function CreateDialogSession() {
    const [note, setNote] = useState<String>();
    const handleSubmit = async (e) => {
        // e.preventDefault();
        console.log(note);
        // try {
        //     await api.saveSymptoms(note); // Your API call
        //     router.push('/next-step'); // If using navigation
        // } catch (error) {
        //     console.error('Submission failed:', error);
        // }
    };

    return (
        <Dialog>
            <form onSubmit={handleSubmit}>
                <DialogTrigger asChild>
                    <Button className='mt-3'>+ Start a Call</Button>
                </DialogTrigger>
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
                        <Button disabled={!note} type="submit">Next <IconArrowRight /></Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default CreateDialogSession

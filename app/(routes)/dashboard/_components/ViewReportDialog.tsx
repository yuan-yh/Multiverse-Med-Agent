import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { sessionDetail } from '../medical-agent/[sessionId]/page';
import moment from 'moment';

type Props = {
    record: sessionDetail
}

function ViewReportDialog({ record }: Props) {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={'ghost'} size={'sm'}>View Report</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] overflow-y-auto bg-white shadow-lg p-6'>
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className='text-center text-3xl font-bold text-blue-500 mb-6'>Medical AI Consultation Report</h2>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className='space-y-6 text-gray-800 text-sm'>
                            {/* Part 1: Session Info */}
                            <h3 className='text-lg font-semibold text-blue-500'>Session Info: </h3>
                            <hr className="border-blue-500 border-t-2 mt-1" />
                            <div className='grid grid-cols-2'>
                                <h3>
                                    <span className='font-bold'>Doctor: </span>
                                    {record.selectedDoctor?.specialist}
                                </h3>
                                <h3>
                                    <span className='font-bold'>Consult Date: </span>
                                    {moment(new Date(record.createdOn)).format('LLLL')}
                                </h3>
                            </div>
                            {/* Part 2: User Note */}
                            <h3 className='text-lg font-semibold text-blue-500'>Chief Complaint: </h3>
                            <hr className="border-blue-500 border-t-2 mt-1" />
                            <div>
                                {/* {JSON.parse(record.report).chiefComplaint} */}
                            </div>
                            {/* Part 3: Summary */}
                            {/* Part 4: Symptoms */}
                            {/* Part 5: Duration & Severity */}
                            {/* Part 6: Medications Mentioned */}
                            {/* Part 7: Recommendations */}
                            {/* Part 8: Footer: AI generation notice */}
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReportDialog
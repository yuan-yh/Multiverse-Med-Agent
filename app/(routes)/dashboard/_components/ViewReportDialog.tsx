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
// import { sessionDetail } from '../medical-agent/[sessionId]/page';
import moment from 'moment';
import { medicalAgent } from './MedicalAgentCard';

type Props = {
    record: sessionDetail
}
type sessionDetail = {
    id: number,
    notes: string,
    sessionId: string,
    report: {  // Change from JSON to the actual structure
        sessionId: string,
        agent: string,
        user: string,
        timestamp: string,
        chiefComplaint: string,
        summary: string,
        symptoms: string[],
        duration: string,
        severity: string,
        medicationsMentioned: string[],
        recommendations: string[]
    },
    selectedDoctor: medicalAgent,
    createdOn: string,
}

function test(record: sessionDetail) {
    console.log("Raw report:", record.report?.chiefComplaint);
}

function ViewReportDialog({ record }: Props) {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={'ghost'} size={'sm'} onClick={() => test(record)}>View Report</Button>
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
                                {record.report?.chiefComplaint}
                            </div>
                            {/* Part 3: Summary */}
                            <h3 className='text-lg font-semibold text-blue-500'>Summary: </h3>
                            <hr className="border-blue-500 border-t-2 mt-1" />
                            <div>
                                {record.report?.summary}
                            </div>
                            {/* Part 4: Symptoms */}
                            <h3 className='text-lg font-semibold text-blue-500'>Symptoms: </h3>
                            <hr className="border-blue-500 border-t-2 mt-1" />
                            <div>
                                <ul className="list-disc pl-5">
                                    {record.report?.symptoms?.map((symptom, index) => (
                                        <li key={index}>{symptom}</li>
                                    ))}
                                </ul>
                            </div>
                            {/* Part 5: Duration & Severity */}
                            <h3 className='text-lg font-semibold text-blue-500'>Duration & Severity: </h3>
                            <hr className="border-blue-500 border-t-2 mt-1" />
                            <div className='grid grid-cols-2'>
                                <h3>
                                    <span className='font-bold'>Duration: </span>
                                    {record.report?.duration}
                                </h3>
                                <h3>
                                    <span className='font-bold'>Severity: </span>
                                    {record.report?.severity}
                                </h3>
                            </div>
                            {/* Part 6: Medications Mentioned */}
                            <h3 className='text-lg font-semibold text-blue-500'>Medications Mentioned: </h3>
                            <hr className="border-blue-500 border-t-2 mt-1" />
                            <div>
                                {record.report?.medicationsMentioned
                                    ?
                                    <ul className="list-disc pl-5">
                                        {record.report?.medicationsMentioned?.map((medication, index) => (
                                            <li key={index}>{medication}</li>
                                        ))}
                                    </ul>
                                    :
                                    <ul className="list-disc pl-5">
                                        <li>N/A</li>
                                    </ul>}
                            </div>
                            {/* Part 7: Recommendations */}
                            <h3 className='text-lg font-semibold text-blue-500'>Recommendations: </h3>
                            <hr className="border-blue-500 border-t-2 mt-1" />
                            <div>
                                <ul className="list-disc pl-5">
                                    {record.report?.recommendations?.map((recommend, index) => (
                                        <li key={index}>{recommend}</li>
                                    ))}
                                </ul>
                            </div>
                            {/* Part 8: Footer: AI generation notice */}
                            <div className="text-xs text-grey-200 text-center">@AI Report Generation Notice</div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReportDialog
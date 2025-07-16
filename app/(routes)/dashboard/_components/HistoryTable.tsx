import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { sessionDetail } from '../medical-agent/[sessionId]/page';
import { Button } from '@/components/ui/button';
import moment from 'moment';

type Props = {
    historyList: sessionDetail[]
}

function HistoryTable({ historyList }: Props) {
    return (
        <div>
            <Table>
                <TableCaption>Previous Consultation Reports</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>AI Medical Specialist</TableHead>
                        <TableHead>Decription</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {historyList.map((record: sessionDetail, index: number) => (
                        <TableRow>
                            <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
                            <TableCell>{record.notes}</TableCell>
                            <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
                            <TableCell className="text-right">
                                <Button variant={'ghost'} size={'sm'}>View Report</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default HistoryTable
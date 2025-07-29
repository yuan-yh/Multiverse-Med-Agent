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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import moment from 'moment';
import ViewReportDialog from './ViewReportDialog';
import { sessionDetail } from '../medical-agent/[sessionId]/page';

type Props = {
    historyList: sessionDetail[]
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

function HistoryTable({ historyList }: Props) {
    return (
        <div>
            <TooltipProvider>
                <Table>
                    <TableCaption>Previous Consultation Reports</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">AI Medical Specialist</TableHead>
                            <TableHead className="w-[400px]">Description</TableHead>
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead className="text-right w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historyList.map((record: sessionDetail, index: number) => {
                            const specialist = record.selectedDoctor?.specialist || 'No specialist assigned';
                            const notes = record.notes || '-';
                            const shouldTruncateSpecialist = specialist.length > 30;
                            const shouldTruncateNotes = notes.length > 80;

                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {shouldTruncateSpecialist ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="cursor-help">
                                                        {truncateText(specialist, 30)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" className="max-w-[300px]">
                                                    <p>{specialist}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            specialist
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {shouldTruncateNotes ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="cursor-help line-clamp-2">
                                                        {truncateText(notes, 80)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" className="max-w-[400px]">
                                                    <p className="whitespace-pre-wrap">{notes}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <span className="line-clamp-2">{notes}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-help">
                                                    {moment(new Date(record.createdOn)).fromNow()}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{moment(new Date(record.createdOn)).format('MMMM DD, YYYY h:mm A')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ViewReportDialog record={record} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TooltipProvider>
        </div>
    )
}

export default HistoryTable
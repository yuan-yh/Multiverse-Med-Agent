// ViewReportDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from 'lucide-react';
import { sessionDetail } from '../medical-agent/[sessionId]/page';
import jsPDF from 'jspdf';

type Props = {
    record: sessionDetail;
}

function ViewReportDialog({ record }: Props) {
    if (!record.report) {
        return (
            <Button variant="outline" size="sm" disabled>
                <FileText className="h-4 w-4 mr-2" />
                No Report
            </Button>
        );
    }

    const report = record.report as any; // Type this properly based on your report structure

    const handleDownloadPDF = () => {
        try {
            const pdf = new jsPDF();
            let yPosition = 20;
            const lineHeight = 7;
            const margin = 20;
            const pageHeight = pdf.internal.pageSize.height;

            // Helper function to add text with page break handling
            const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
                pdf.setFontSize(fontSize);
                if (isBold) {
                    pdf.setFont(undefined, 'bold');
                } else {
                    pdf.setFont(undefined, 'normal');
                }

                // Split long text into lines
                const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - 2 * margin);

                lines.forEach((line: string) => {
                    if (yPosition + lineHeight > pageHeight - margin) {
                        pdf.addPage();
                        yPosition = margin;
                    }
                    pdf.text(line, margin, yPosition);
                    yPosition += lineHeight;
                });
            };

            // Title
            addText('MEDICAL CONSULTATION REPORT', 18, true);
            yPosition += 5;

            // Session info
            addText(`Session ID: ${record.sessionId}`, 10);
            addText(`Date: ${new Date().toLocaleDateString()}`, 10);
            yPosition += 10;

            // Patient Information
            addText('PATIENT INFORMATION', 14, true);
            addText(`Name: ${report.patientInfo?.name || 'Anonymous'}`);
            addText(`Age: ${report.patientInfo?.age || 'Not specified'}`);
            addText(`Consultation Type: ${report.patientInfo?.consultationType || 'General'}`);
            yPosition += 5;

            // Clinical History
            addText('CLINICAL HISTORY', 14, true);
            addText(`Chief Complaint: ${report.clinicalHistory?.chiefComplaint || 'N/A'}`);
            addText(`Relevant History: ${report.clinicalHistory?.relevantHistory || 'N/A'}`);
            yPosition += 5;

            // Imaging Findings
            if (report.imagingFindings) {
                addText('IMAGING FINDINGS', 14, true);
                addText(`Modality: ${report.imagingFindings.modality || 'N/A'}`);
                addText(`Quality: ${report.imagingFindings.technicalQuality || 'N/A'}`);
                if (report.imagingFindings.primaryFindings) {
                    addText(`Location: ${report.imagingFindings.primaryFindings.location || 'N/A'}`);
                    addText(`Morphology: ${report.imagingFindings.primaryFindings.morphology || 'N/A'}`);
                }
                yPosition += 5;
            }

            // Assessment
            if (report.assessment) {
                addText('ASSESSMENT', 14, true);
                addText(`BI-RADS Category: ${report.assessment.biRadsCategory || 'N/A'}`);
                addText(`Suspicion Level: ${report.assessment.suspicionLevel || 'N/A'}`);
                yPosition += 5;
            }

            // Summary
            if (report.summary) {
                addText('SUMMARY', 14, true);
                addText(report.summary.conciseSummary || 'No summary available');

                if (report.summary.criticalFindings) {
                    yPosition += 5;
                    addText('CRITICAL FINDINGS:', 12, true);
                    addText(report.summary.criticalFindings);
                }
            }

            // Save the PDF
            pdf.save(`medical-report-${record.sessionId}.pdf`);
            toast.success('PDF report downloaded successfully');

        } catch (error) {
            console.error('PDF generation failed:', error);
            toast.error('Failed to generate PDF report');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Medical Consultation Report</DialogTitle>
                    <DialogDescription>
                        Session ID: {record.sessionId}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    {/* Patient Information */}
                    <section>
                        <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Name:</span> {report.patientInfo?.name || 'Anonymous'}
                            </div>
                            <div>
                                <span className="font-medium">Age:</span> {report.patientInfo?.age || 'Not specified'}
                            </div>
                            <div>
                                <span className="font-medium">Date:</span> {report.patientInfo?.consultationDate ? new Date(report.patientInfo.consultationDate).toLocaleString() : 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Type:</span> {report.patientInfo?.consultationType || 'General Consultation'}
                            </div>
                        </div>
                    </section>

                    {/* Imaging Findings */}
                    {report.imagingFindings && (
                        <section>
                            <h3 className="text-lg font-semibold mb-3">Imaging Findings</h3>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                <p><span className="font-medium">Modality:</span> {report.imagingFindings.modality}</p>
                                <p><span className="font-medium">Quality:</span> {report.imagingFindings.technicalQuality}</p>
                                {report.imagingFindings.primaryFindings && (
                                    <div className="mt-3">
                                        <p className="font-medium">Primary Findings:</p>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>Location: {report.imagingFindings.primaryFindings.location}</li>
                                            <li>Morphology: {report.imagingFindings.primaryFindings.morphology}</li>
                                            {report.imagingFindings.primaryFindings.biopsyMarkers && (
                                                <li>Biopsy Markers: {report.imagingFindings.primaryFindings.biopsyMarkers}</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Assessment */}
                    {report.assessment && (
                        <section>
                            <h3 className="text-lg font-semibold mb-3">Assessment</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">BI-RADS Category:</span> {report.assessment.biRadsCategory}</p>
                                <p><span className="font-medium">Suspicion Level:</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${report.assessment.suspicionLevel?.includes('malignancy')
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {report.assessment.suspicionLevel}
                                    </span>
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Summary */}
                    {report.summary && (
                        <section>
                            <h3 className="text-lg font-semibold mb-3">Summary</h3>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm">{report.summary.conciseSummary}</p>
                                {report.summary.criticalFindings && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                        <p className="text-sm font-medium text-red-800">⚠️ Critical Findings:</p>
                                        <p className="text-sm text-red-700 mt-1">{report.summary.criticalFindings}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Download Button */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewReportDialog;
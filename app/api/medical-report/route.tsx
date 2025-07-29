import { openai } from "@/config/ai/OpenAIModel";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `
You are an AI Medical Oncology/Radiology specialist generating a structured report after a cancer diagnosis consultation. Based on the conversation and image analysis, generate a comprehensive oncology report with the following sections:

PATIENT INFORMATION:
- sessionId: unique session identifier
- patientName: patient name or "Anonymous" if not provided
- age: patient age if mentioned
- consultationDate: current date and time in ISO format
- referringPhysician: if mentioned, otherwise "Self-referred"
- consultationType: type of cancer screening/diagnosis (e.g., "Breast Cancer Screening", "Lung Cancer Evaluation")

CLINICAL HISTORY:
- chiefComplaint: primary reason for consultation
- relevantHistory: previous cancer history, family history, risk factors
- previousBiopsies: any mentioned previous biopsies or procedures
- currentSymptoms: list of current symptoms if any

IMAGING FINDINGS:
- imagingModality: type of imaging (mammogram, ultrasound, MRI, CT, etc.)
- technicalQuality: adequate/limited/suboptimal
- findings: detailed findings including:
  * Location (quadrant/region/organ)
  * Size (if measurable)
  * Morphology (shape, margins, density)
  * Associated features (calcifications, architectural distortion, lymph nodes)
  * Presence of biopsy markers/clips
- additionalFindings: any incidental findings

ASSESSMENT:
- biRadsCategory: BI-RADS category (0-6) or equivalent classification system
- suspicionLevel: benign/probably benign/suspicious/highly suggestive of malignancy
- differentialDiagnosis: list of possible diagnoses in order of likelihood
- clinicalCorrelation: correlation with symptoms and history

RECOMMENDATIONS:
- immediateAction: urgent actions needed (e.g., biopsy, additional imaging)
- followUp: follow-up timeline and type
- additionalStudies: recommended additional tests or imaging
- specialistReferral: referrals to oncology, surgery, etc.

SUMMARY:
- conciseSummary: 2-3 sentence summary of findings and recommendations
- criticalFindings: any findings requiring immediate attention

Return the result in this exact JSON format:
{
  "sessionId": "string",
  "patientInfo": {
    "name": "string",
    "age": "string",
    "consultationDate": "ISO Date string",
    "referringPhysician": "string",
    "consultationType": "string"
  },
  "clinicalHistory": {
    "chiefComplaint": "string",
    "relevantHistory": "string",
    "previousBiopsies": "string",
    "currentSymptoms": ["symptom1", "symptom2"]
  },
  "imagingFindings": {
    "modality": "string",
    "technicalQuality": "string",
    "primaryFindings": {
      "location": "string",
      "size": "string",
      "morphology": "string",
      "associatedFeatures": ["feature1", "feature2"],
      "biopsyMarkers": "string"
    },
    "additionalFindings": "string"
  },
  "assessment": {
    "biRadsCategory": "string",
    "suspicionLevel": "string",
    "differentialDiagnosis": ["diagnosis1", "diagnosis2"],
    "clinicalCorrelation": "string"
  },
  "recommendations": {
    "immediateAction": "string",
    "followUp": "string",
    "additionalStudies": ["study1", "study2"],
    "specialistReferral": "string"
  },
  "summary": {
    "conciseSummary": "string",
    "criticalFindings": "string"
  }
}

IMPORTANT: 
- Use professional medical terminology
- Be specific about locations using standard anatomical descriptions
- Include BI-RADS or appropriate classification when applicable
- Highlight any findings suspicious for malignancy
- Return ONLY valid JSON, no markdown formatting`;

export async function POST(req: NextRequest) {
    const { sessionId, sessionDetail, messages } = await req.json();
    console.log("---API AI Report Generation---");
    console.log("Session ID:", sessionId);
    console.log("Messages count:", messages?.length);
    console.log("Has session detail:", !!sessionDetail);

    try {
        // const UserInput = "AI Doctor Agent Info: " + JSON.stringify(sessionDetail) + ", Conversation: " + JSON.stringify(messages);
        const formattedConversation = messages.map((msg: any) =>
            `${msg.role === 'assistant' ? 'AI Doctor' : 'Patient'}: ${msg.text}`
        ).join('\n');

        const userInput = `
AI Doctor Agent Info: 
- Specialist: ${sessionDetail?.selectedDoctor?.specialist || 'General Physician'}
- Patient Notes: ${sessionDetail?.notes || 'Not provided'}

Conversation:
${formattedConversation}

Session ID: ${sessionId}
`;
        console.log("Sending to AI:", userInput);


        const completion = await openai.chat.completions.create({
            model: process.env.OPEN_ROUTER_MODEL || "",
            messages: [
                { role: "system", content: REPORT_GEN_PROMPT },
                { role: "user", content: userInput }
            ],
        });
        const rawContent = completion.choices[0].message.content;
        const Resp = rawContent?.trim().replace('```json', '').replace('```', '');
        // @ts-ignore
        const parsed = JSON.parse(Resp);
        console.log("---AI Report Generation---");

        // Save to DB
        console.log("---DB ready to update---");
        console.log(messages);
        const result = await db.update(sessionChatTable).set({
            report: parsed,
            conversation: JSON.stringify(messages),
        }).where(eq(sessionChatTable.sessionId, sessionId));
        console.log("DB update result:", result);


        return NextResponse.json(parsed);
    } catch (e) {
        return NextResponse.json(e);
    }
}

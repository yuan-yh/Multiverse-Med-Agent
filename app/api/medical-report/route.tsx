import { openai } from "@/config/ai/OpenAIModel";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `
You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the AI doctor agent, generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:
{
"sessionId": "string",
"agent": "string",
"user": "string",
"timestamp": "ISO Date string",
"chiefComplaint": "string",
"summary": "string",
"symptoms": ["symptom1", "symptom2"],
"duration": "string",
"severity": "string",
"medicationsMentioned": ["med1", "med2"],
"recommendations": ["rec1", "rec2"]
}
Only include valid fields. Respond with nothing else.
Depends on doctor AI agent info and Conversation between AI medical agents and user`

export async function POST(req: NextRequest) {
    const { sessionId, sessionDetail, messages } = await req.json();

    try {
        const UserInput = "AI Doctor Agent Info: " + JSON.stringify(sessionDetail) + ", Conversation: " + JSON.stringify(messages);
        const completion = await openai.chat.completions.create({
            model: process.env.OPEN_ROUTER_MODEL || "",
            messages: [
                { role: "system", content: REPORT_GEN_PROMPT },
                { role: "user", content: UserInput }
            ],
        });
        const rawContent = completion.choices[0].message.content;
        const Resp = rawContent?.trim().replace('```json', '').replace('```', '');

        const parsed = JSON.parse(Resp || "[]");

        // Save to DB
        const result = await db.update(sessionChatTable).set({
            report: parsed,
            conversation: messages,
        }).where(eq(sessionChatTable.sessionId, sessionId));
        return NextResponse.json(parsed);
    } catch (e) {
        return NextResponse.json(e);
    }
}
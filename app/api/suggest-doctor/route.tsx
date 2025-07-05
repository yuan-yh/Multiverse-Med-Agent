import { openai } from "@/config/ai/OpenAIModel";
import { MedicalAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { note } = await req.json();

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPEN_ROUTER_MODEL || "",
            messages: [
                { role: "system", content: JSON.stringify(MedicalAgents) },
                { role: "user", content: "User Notes/Symptoms:" + note + ", Depend on user notes and symptoms, Please suggest list of doctors (including title, image, and description), Return Object in JSON only" }
            ],
        })
        const rawContent = completion.choices[0].message.content;
        const Resp = rawContent?.trim().replace('```json', '').replace('```', '');

        const parsed = JSON.parse(Resp || "[]");
        // const doctorList = parsed.map((item: any) => item.specialist);

        return NextResponse.json(parsed);
    }
    catch (e) {
        return NextResponse.json(e);
    }
}
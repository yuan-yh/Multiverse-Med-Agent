import { db } from "@/config/db";
import { sessionChatTable } from "@/config/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    try {
        const sessionId = uuidv4();
        const result = await db.insert(sessionChatTable).values({
            sessionId: sessionId,
            notes: notes,
            selectedDoctor: selectedDoctor,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdOn: (new Date()).toString(),
            //@ts-ignore
        }).returning({ sessionChatTable })

        return NextResponse.json(result[0]?.sessionChatTable);
    } catch (e) {
        return NextResponse.json(e);
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || '';
    const user = await currentUser();
    try {
        if (!user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (sessionId == 'all') {
            const result = await db
                .select()
                .from(sessionChatTable)
                .where(eq(sessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(sessionChatTable.id));

            if (result.length === 0) {
                return NextResponse.json({ message: "Session not found" }, { status: 404 });
            }

            return NextResponse.json(result);
        }
        else {
            const result = await db
                .select()
                .from(sessionChatTable)
                .where(eq(sessionChatTable.sessionId, sessionId));


            if (result.length === 0) {
                return NextResponse.json({ message: "Session not found" }, { status: 404 });
            }

            return NextResponse.json(result[0]);
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

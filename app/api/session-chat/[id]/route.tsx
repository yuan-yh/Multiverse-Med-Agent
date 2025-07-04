import { db } from "@/config/db";
import { SessionChatTable } from "@/config/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const user = await currentUser();
    try {
        const result = await db
            .select()
            .from(SessionChatTable)
            .where(eq(SessionChatTable.sessionId, sessionId));

        if (result.length === 0) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

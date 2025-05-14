import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const interview = await db.interview.create({
            data: {
                ...body,
            },
        });
        return NextResponse.json(interview, { status: 201 });
    } catch (error) {
        console.error("[INTERVIEW_CREATE]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
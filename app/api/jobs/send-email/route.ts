import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email-service";

async function handler(req: Request) {
    try {
        const body = await req.json();
        const { ticket, raffleName } = body;

        if (!ticket || !raffleName) {
            return NextResponse.json({ error: "Missing ticket or raffleName" }, { status: 400 });
        }

        console.log(`[Job] Executing delayed email for ${ticket.email}`);
        await sendConfirmationEmail(ticket, raffleName);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Job] Error processing email job:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Ensure the route verifies the signature from QStash
export const POST = verifySignatureAppRouter(handler);

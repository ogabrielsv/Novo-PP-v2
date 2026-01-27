import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { Ticket } from '@prisma/client';
import { addContactToMailtrap } from '@/lib/mailtrap';
import { sendConfirmationEmail } from '@/lib/email-service';
import { Client } from "@upstash/qstash";
// import { mailClient, SENDER_EMAIL, SENDER_NAME } from '@/lib/mail'; // Not used anymore for this route

// Schema Validation
const participateSchema = z.object({
    raffleId: z.string().uuid(),
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10), // Basic length check
    state: z.string().length(2),
    utmSource: z.string().optional().nullable(),
});



export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = participateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        const { raffleId, name, email, phone, state, utmSource } = result.data;

        // Get IP Address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // Anti-Fraud: Rate Limit (3 per minute per IP or Email)
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

        const recentTickets = await prisma.ticket.count({
            where: {
                raffleId,
                createdAt: { gte: oneMinuteAgo },
                OR: [
                    { ipAddress: ip },
                    { email: email }
                ]
            }
        });

        if (recentTickets >= 3) {
            return NextResponse.json(
                { error: 'Limite de participações excedido (3 por minuto). Tente novamente em breve.' },
                { status: 429 }
            );
        }

        // Verify Raffle Status
        const raffle = await prisma.raffle.findUnique({
            where: { id: raffleId }
        });

        if (!raffle || raffle.status !== 'OPEN') {
            return NextResponse.json({ error: 'Sorteio não encontrado ou encerrado' }, { status: 404 });
        }

        // Create Ticket
        // Generate a simple number (in a real app this might be more complex)
        // Create Ticket with Random Unique Number
        let ticketNumber = 0;
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            // Generate Random Number between 0 and 9999
            ticketNumber = Math.floor(Math.random() * 10000);

            // Check uniqueness for this raffle
            const existing = await prisma.ticket.findFirst({
                where: {
                    raffleId,
                    number: ticketNumber
                }
            });

            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            return NextResponse.json({ error: 'Não foi possível gerar um número da sorte. Tente novamente.' }, { status: 409 });
        }

        const ticket = await prisma.ticket.create({
            data: {
                raffleId,
                name,
                email,
                phone,
                state,
                ipAddress: ip,
                number: ticketNumber,
                utmSource
            }
        });

        // Send Confirmation Email with 1 minute delay via QStash
        const qstashToken = process.env.QSTASH_TOKEN;

        if (qstashToken) {
            const client = new Client({ token: qstashToken });
            // Determine app URL dynamically based on request host
            // This ensures QStash calls back the correct domain (e.g. participe.creatye.com.br)
            const protocol = req.headers.get('x-forwarded-proto') || 'https';
            const host = req.headers.get('host');

            let appUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
            appUrl = appUrl.replace(/\/$/, ''); // Remove trailing slash

            // Check if running explicitly on localhost to force local delay for testing
            // This ensures dev testing works even if valid QStash keys are present
            const isLocalDev = appUrl.includes('localhost') || appUrl.includes('127.0.0.1') || process.env.NODE_ENV === 'development';

            if (isLocalDev) {
                console.log(`[Email Service] Local Dev detected (${appUrl}). Skipping QStash to ensure local testing works.`);
                // Fallback to local 60s delay (Fire-and-forget)
                (async () => {
                    try {
                        console.log(`[Email Service] Local Timer: Waiting 60 seconds before sending to ${ticket.email}...`);
                        await new Promise(resolve => setTimeout(resolve, 60000));
                        await sendConfirmationEmail(ticket, raffle.name);
                        console.log(`[Email Service] Local Timer: Email sent to ${ticket.email}`);
                    } catch (err) {
                        console.error('Local email error:', err);
                    }
                })();
            } else {
                // Production: Use QStash
                console.log(`[Email Service] Scheduling confirmation email for ${ticket.email} in 60 seconds via QStash...`);
                try {
                    await client.publishJSON({
                        url: `${appUrl}/api/jobs/send-email`,
                        body: { ticket, raffleName: raffle.name },
                        delay: 60, // 60 seconds delay (confirmed active)
                    });
                } catch (qError) {
                    console.error('Failed to schedule email with QStash:', qError);
                    // Fallback to local 60s delay (Fire-and-forget)
                    (async () => {
                        console.log(`[Email Service] Fallback: Waiting 60 seconds locally before sending to ${ticket.email}...`);
                        await new Promise(resolve => setTimeout(resolve, 60000));
                        await sendConfirmationEmail(ticket, raffle.name);
                    })().catch(err => console.error('Fallback email error:', err));
                }
            }
        } else {
            console.warn("QSTASH_TOKEN not found. Using local execution with 1 minute delay (Fallback).");
            // Fallback to local 60s delay (Fire-and-forget)
            (async () => {
                try {
                    console.log(`[Email Service] Local Fallback: Waiting 60 seconds before sending to ${ticket.email}...`);
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    await sendConfirmationEmail(ticket, raffle.name);
                    console.log(`[Email Service] Local Fallback: Email sent to ${ticket.email}`);
                } catch (err) {
                    console.error('Local email error:', err);
                }
            })();
        }

        // Add to Mailtrap (Async - Fire and Forget or Await with catch)
        // User requested: "Chamar essa função logo após o cadastro... Usar try/catch... Não quebrar o cadastro"
        try {
            await addContactToMailtrap({
                email: ticket.email,
                name: ticket.name,
                phone: ticket.phone,
                state: ticket.state ?? undefined,
                ticket_number: ticket.number?.toString(),
                raffle_name: raffle.name,
                utm_source: ticket.utmSource ?? undefined
            });
        } catch (mailtrapError) {
            console.error('Mailtrap integration failed:', mailtrapError);
        }

        return NextResponse.json({ success: true, ticket });

    } catch (error) {
        console.error('Participation error:', error);
        return NextResponse.json({ error: 'Erro ao registrar participação' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { Ticket } from '@prisma/client';

// Schema Validation
const participateSchema = z.object({
    raffleId: z.string().uuid(),
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10), // Basic length check
    state: z.string().length(2),
});

const MAILTRAP_TOKEN = '28fe8c1b84b793160321ebc1fb405d2a';
const MAILTRAP_ENDPOINT = 'https://send.api.mailtrap.io/api/send';

async function sendToMailtrap(ticket: Ticket, raffleName: string) {
    try {
        const payload = {
            from: {
                email: "mailtrap@demomailtrap.com", // Default sender for Mailtrap testing/demo if domain not verified
                name: "PlayPrêmios System"
            },
            to: [
                {
                    email: "admin@playpremios.com" // Sending to admin as "Lead Capture"
                    // In a real scenario, this would be the actual admin email or the user's email if capturing FOR them.
                    // Or we send TO the user (Confirmation). 
                    // "Captura dos leads será feita no mailtrap" -> implies storing lead. 
                    // Sending TO the lead puts them in "Suppression lists" or logs?
                    // Usually "Lead Capture" via Email API means emailing the lead data to a CRM or Admin.
                    // I will send the lead data TO the ADMIN.
                }
            ],
            subject: `Novo Lead: ${ticket.name} - ${raffleName}`,
            text: `Novo participante registrado!\n\nNome: ${ticket.name}\nEmail: ${ticket.email}\nTelefone: ${ticket.phone}\nEstado: ${ticket.state}\nCampanha: ${raffleName}\nNúmero: ${ticket.number}`,
            category: "New Participation"
        };

        // Note: For Mailtrap Sending to work, 'from' must be a verified domain. 
        // Using demomailtrap.com might work for testing if the token allows.
        // If not, this might fail, but I can't verify the user's domain here.

        const response = await fetch(MAILTRAP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MAILTRAP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Mailtrap Error:', err);
        }
    } catch (e) {
        console.error('Failed to send email:', e);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = participateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        const { raffleId, name, email, phone, state } = result.data;

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
                number: ticketNumber
            }
        });

        // Send Lead to Mailtrap
        // We don't await this to keep response fast? Or maybe we should to verify?
        // Let's await it to ensure it works during this demo.
        // await sendToMailtrap(ticket, raffle.name);

        return NextResponse.json({ success: true, ticket });

    } catch (error) {
        console.error('Participation error:', error);
        return NextResponse.json({ error: 'Erro ao registrar participação' }, { status: 500 });
    }
}

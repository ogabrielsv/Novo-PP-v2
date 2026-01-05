import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { Ticket } from '@prisma/client';
import { mailClient, SENDER_EMAIL, SENDER_NAME } from '@/lib/mail';

// Schema Validation
const participateSchema = z.object({
    raffleId: z.string().uuid(),
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10), // Basic length check
    state: z.string().length(2),
    utmSource: z.string().optional().nullable(),
});

async function sendConfirmationEmail(ticket: Ticket, raffleName: string) {
    try {
        await mailClient.sendMail({
            from: {
                address: SENDER_EMAIL,
                name: SENDER_NAME,
            },
            to: [ticket.email],
            subject: `Confirmação de Participação - ${raffleName}`,
            text: `Olá ${ticket.name},\n\nSua participação na campanha "${raffleName}" foi confirmada com sucesso!\n\nSeu Número da Sorte: ${ticket.number?.toString().padStart(4, '0')}\n\nBoa sorte!\nEquipe Play Prêmios`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Olá ${ticket.name},</h2>
                    <p>Sua participação na campanha <strong>${raffleName}</strong> foi confirmada com sucesso!</p>
                    <div style="background: #f0fdf4; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; color: #15803d; font-size: 14px;">Seu Número da Sorte</p>
                        <p style="margin: 5px 0 0 0; color: #166534; font-size: 24px; font-weight: bold;">${ticket.number?.toString().padStart(4, '0')}</p>
                    </div>
                    <p>Boa sorte!</p>
                    <p style="color: #666; font-size: 12px;">Equipe Play Prêmios</p>
                </div>
            `,

        });
        console.log(`Confirmation email sent to ${ticket.email}`);
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

        // Send Confirmation Email
        // We don't await this to avoid blocking the response, or we can await to ensure it works.
        // Given this is a critical feedback loop, I'll await it but catch errors inside the function so it doesn't fail the request.
        await sendConfirmationEmail(ticket, raffle.name);

        return NextResponse.json({ success: true, ticket });

    } catch (error) {
        console.error('Participation error:', error);
        return NextResponse.json({ error: 'Erro ao registrar participação' }, { status: 500 });
    }
}

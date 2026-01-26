import { Ticket } from '@prisma/client';
import { sendMail } from '@/lib/mailtrap';

export async function sendConfirmationEmail(ticket: Ticket, raffleName: string) {
    console.log(`[Email Service] Starting confirmation email for ${ticket.email} (Raffle: ${raffleName})`);
    try {
        await sendMail({
            to: ticket.email,
            name: ticket.name,
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
            `
        });
        console.log(`Confirmation email sent via API to ${ticket.email}`);
    } catch (e) {
        console.error('Failed to send email via API:', e);
    }
}

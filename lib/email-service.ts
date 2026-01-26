import "server-only";
import { Ticket } from "@prisma/client";
import { sendMail } from "@/lib/mailtrap";

export async function sendConfirmationEmail(ticket: Ticket, raffleName: string) {
    await sendMail({
        to: ticket.email,
        name: ticket.name,
        subject: `Confirmação de Participação - ${raffleName}`,
        text: `Olá ${ticket.name},

Sua participação na campanha "${raffleName}" foi confirmada com sucesso!

Seu Número da Sorte: ${ticket.number?.toString().padStart(4, "0")}

Boa sorte!
Equipe Play Prêmios`,
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seu Número da Sorte</title>
</head>
<body style="margin:0; padding:0; background-color:#0b0b0b; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:600px; background:#111111; border-radius:16px; overflow:hidden;">
          <tr>
            <td align="center" style="padding:34px 24px; background:linear-gradient(135deg,#1e5bff,#00c2ff);">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">🎉 Cadastro confirmado</h1>
              <p style="margin:12px 0 0; color:#eaf6ff; font-size:16px;">
                Seu número da sorte para o ${raffleName} está registrado.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:34px 28px; color:#eaeaea;">
              <p style="font-size:16px; line-height:1.7; margin-top:0;">Olá ${ticket.name},</p>
              <p style="font-size:16px; line-height:1.7;">
                Seu cadastro foi realizado com sucesso. Guarde o número abaixo, ele será usado no momento do sorteio.
              </p>

              <table width="100%" role="presentation" style="margin:32px 0;">
                <tr>
                  <td align="center" style="background:#000000; border:2px dashed #1e5bff; border-radius:14px; padding:28px;">
                    <p style="margin:0; color:#9ecbff; font-size:13px; letter-spacing:1px;">SEU NÚMERO DA SORTE</p>
                    <p style="margin:14px 0 0; font-size:40px; color:#ffffff; font-weight:bold; letter-spacing:3px;">
                      ${ticket.number?.toString().padStart(4, "0")}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; line-height:1.6; color:#bdbdbd; margin-top:30px; text-align:center;">
                Quanto mais campanhas você participa, maiores são suas chances.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:22px; background:#0b0b0b; color:#7a7a7a; font-size:12px;">
              <p style="margin:0;">© ${raffleName}<br/>Você recebeu este e-mail porque se cadastrou para participar.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
}

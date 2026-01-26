require('dotenv').config();
const { MailtrapClient } = require('mailtrap');

async function sendTestEmail() {
    const token = process.env.MAILTRAP_TOKEN;
    const senderEmail = process.env.SMTP_FROM_EMAIL || "hello@creatye.com";
    const recipientEmail = "jeanads2019@gmail.com";

    console.log(`🚀 Iniciando teste de envio REAL via API para ${recipientEmail}...`);

    if (!token) {
        console.error("❌ Erro: MAILTRAP_TOKEN não encontrado no .env");
        return;
    }

    const client = new MailtrapClient({ token });

    const sender = {
        email: senderEmail,
        name: "Sistema de Sorteio (Teste de Verificação)",
    };

    const recipients = [
        {
            email: recipientEmail,
        }
    ];

    try {
        const result = await client.send({
            from: sender,
            to: recipients,
            subject: "Verificação de Envio - Teste 2",
            text: "Este é o segundo teste de verificação do sistema de sorteio. Se recebeu, o script local está OK.",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2>Teste de Verificação #2</h2>
                    <p>Confirmação de que as credenciais locais estão funcionando.</p>
                    <p><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `,
            category: "Verification Test",
        });

        console.log("✅ E-mail de verificação enviado com SUCESSO!");
        // console.log("Detalhes do envio:", result);
    } catch (error) {
        console.error("❌ Falha no envio:", error);
    }
}

sendTestEmail();

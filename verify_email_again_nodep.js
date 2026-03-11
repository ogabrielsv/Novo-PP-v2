const fs = require('fs');
const path = require('path');
const { MailtrapClient } = require('mailtrap');

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, ...rest] = line.split('=');
            if (key && rest.length > 0) {
                process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
            }
        });
    } catch (e) {
        console.error("Could not read .env file");
    }
}

async function sendTestEmail() {
    loadEnv();

    const token = process.env.MAILTRAP_TOKEN;
    const senderEmail = process.env.SMTP_FROM_EMAIL || "hello@creatye.com";
    const recipientEmail = "jeanads2019@gmail.com";

    console.log(`🚀 (No-dep script) Iniciando teste de envio REAL via API para ${recipientEmail}...`);

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
    } catch (error) {
        console.error("❌ Falha no envio:", error);
    }
}

sendTestEmail();

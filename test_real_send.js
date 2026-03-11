const fs = require('fs');
const path = require('path');
const { MailtrapClient } = require('mailtrap');

// Manual .env loader
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, ...rest] = line.split('=');
            if (key && rest.length > 0) {
                // Remove quotes and whitespace
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
    // Change recipient to something safe or same as sender for test to avoid spamming random people
    // The user's email from file path is 'jeang...', let's try 'jeang@...' or 'hello@creatye.com'
    const recipientEmail = "jeanads2019@gmail.com";

    console.log(`🚀 Iniciando teste de envio REAL via API...`);
    console.log(`🔹 De: ${senderEmail}`);
    console.log(`🔹 Para: ${recipientEmail}`);
    console.log(`🔹 Token: ${token ? token.substring(0, 4) + '...' : 'MISSING'}`);

    if (!token) {
        console.error("❌ Erro: MAILTRAP_TOKEN não encontrado no .env");
        return;
    }

    const client = new MailtrapClient({ token });

    const sender = {
        email: senderEmail,
        name: "Sistema de Sorteio (Teste)",
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
            subject: "Teste de Envio - Número da Sorte",
            text: "Este é um teste de verificação do sistema de sorteio. Seu número da sorte é: 1234.",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2>Teste de Sistema de Sorteio</h2>
                    <p>Se você recebeu este e-mail, a integração via API está funcionando perfeitamente em <strong>PRODUÇÃO</strong>.</p>
                    <div style="background: #f0fdf4; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; color: #15803d; font-size: 14px;">Seu Número da Sorte de Teste</p>
                        <p style="margin: 5px 0 0 0; color: #166534; font-size: 24px; font-weight: bold;">1234</p>
                    </div>
                </div>
            `,
            category: "Integration Test",
        });

        console.log("✅ E-mail enviado com SUCESSO!");
        // console.log("Detalhes do envio:", result);
    } catch (error) {
        console.error("❌ Falha no envio:", error);
    }
}

sendTestEmail();

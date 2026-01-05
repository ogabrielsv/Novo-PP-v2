
const { MailtrapClient } = require("mailtrap");

// Retrieve token from environment or hardcode for testing (not recommended for production commit)
// Run this with: MAILTRAP_API_TOKEN=your_token node test-official-client.js
const TOKEN = process.env.MAILTRAP_API_TOKEN;
const ENDPOINT = "https://send.api.mailtrap.io/";

async function main() {
    if (!TOKEN) {
        console.error("Erro: MAILTRAP_API_TOKEN não definida.");
        console.error("Execute com: set MAILTRAP_API_TOKEN=seu_token && node test-official-client.js (Windows CMD)");
        console.error("Ou no PowerShell: $env:MAILTRAP_API_TOKEN='seu_token'; node test-official-client.js");
        process.exit(1);
    }

    const client = new MailtrapClient({ token: TOKEN });

    const sender = {
        email: "hello@playpremios.com.br",
        name: "Play Prêmios Teste",
    };

    const recipients = [
        {
            email: "teste@example.com", // Substitua pelo seu email para ver o resultado real
        }
    ];

    console.log("Enviando email de teste com Cliente Oficial Mailtrap...");

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Teste Oficial Mailtrap API",
            text: "Isso é um teste usando a biblioteca oficial mailtrap-client.",
            category: "Integration Test",
        });

        console.log("Sucesso!", response);
    } catch (err) {
        console.error("Erro ao enviar:", err);
    }
}

main();

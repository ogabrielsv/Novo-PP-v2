const nodemailer = require('nodemailer');

async function main() {
    console.log("Iniciando teste de envio de e-mail...");

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "ad514ba8ce1461",
            pass: "7f44f1ec3b828a"
        }
    });

    try {
        const info = await transport.sendMail({
            from: '"Play Prêmios" <hello@creatye.com.br>',
            to: "teste@example.com",
            subject: "Teste de Integração Mailtrap",
            text: "Funciona! O envio de e-mails está configurado corretamente.",
            html: "<h1>Funciona!</h1><p>O envio de e-mails está configurado corretamente.</p>"
        });

        console.log("E-mail enviado com sucesso!");
        console.log("Message ID: %s", info.messageId);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}

main().catch(console.error);

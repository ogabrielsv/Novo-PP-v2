import Nodemailer from 'nodemailer';

export const mailClient = Nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT || "2525"),
    auth: {
        user: process.env.SMTP_USER || "ad514ba8ce1461",
        pass: process.env.SMTP_PASS || "7f44f1ec3b828a"
    }
});

export const SENDER_EMAIL = process.env.SMTP_FROM_EMAIL || "hello@creatye.com.br";
export const SENDER_NAME = "Play Prêmios";

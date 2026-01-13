import Nodemailer from 'nodemailer';

export const mailClient = Nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ad514ba8ce1461",
        pass: "7f44f1ec3b828a"
    }
});

export const SENDER_EMAIL = "hello@creatye.com.br";
export const SENDER_NAME = "Play Prêmios";

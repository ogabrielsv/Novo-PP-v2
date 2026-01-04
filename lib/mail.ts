import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

const TOKEN = "e30396b6367d68359d2adf0b1ab156af";

export const mailClient = Nodemailer.createTransport(
    MailtrapTransport({
        token: TOKEN,
    })
);

export const SENDER_EMAIL = "hello@demomailtrap.co";
export const SENDER_NAME = "Play Prêmios";

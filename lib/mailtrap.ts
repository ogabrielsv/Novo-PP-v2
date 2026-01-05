import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_API_TOKEN || "";
const ENDPOINT = process.env.MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io/";

export const mailtrapClient = new MailtrapClient({
    token: TOKEN,
    // testInboxId: 123, // Optional: for testing in sandbox
});

export const defaultSender = {
    email: "hello@playpremios.com.br",
    name: "Play Prêmios",
};

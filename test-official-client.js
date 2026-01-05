const { MailtrapClient } = require('mailtrap');

const TOKEN = '1b9e83e81b926fd93d18b4fb4c614bc7';
const ENDPOINT = 'https://send.api.mailtrap.io/'; // Usually this is default

async function main() {
    const client = new MailtrapClient({ token: TOKEN });

    console.log('Testing Mailtrap Official Client...');

    // 1. Try to list lists to see if we can connect and what lists exist
    // We don't know the method name for sure, so we print available methods if possible or try common ones.
    // Actually, Mailtrap client usually separates Sending and General.
    // Let's try to inspect the client object.

    try {
        // Trying to add a contact using the pattern if it exists on the client
        // Documentation says: client.marketing.contacts.create(...) or similar?
        console.log('Client methods:', Object.keys(client));

        // If there is no specific marketing method, we might need to use the 'general' API client or similar.
        // But let's try a direct request if the client exposes it.

        // Let's try to guess the method or print what we have
    } catch (e) {
        console.error(e);
    }
}

main();

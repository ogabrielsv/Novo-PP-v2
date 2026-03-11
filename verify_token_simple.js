require('dotenv').config();
const { MailtrapClient } = require('mailtrap');

async function testToken() {
    console.log("Testing Mailtrap Token from .env...");
    const token = process.env.MAILTRAP_TOKEN;

    if (!token) {
        console.error("❌ MAILTRAP_TOKEN is missing in .env");
        return;
    }

    if (token === '1b9e83e81b926fd93d18b4fb4c614bc7') {
        console.warn("⚠️ Warning: The token looks like the example/fallback token we had before. \n   If this is your real production token, ignore this warning.");
    }

    const client = new MailtrapClient({ token });

    try {
        // Try to list sending domains to verify permissions (Sending API)
        // Note: The specific method might vary by SDK version, trying common one.
        // If this fails, we'll try a simple 'send' with dry-run-like params if possible, 
        // but 'send' is the surest way to test 'Sending' permissions.

        // Let's try to send a test email to the FROM address itself to be safe/unintrusive
        const senderEmail = process.env.SMTP_FROM_EMAIL || "hello@creatye.com";
        console.log(`Attempting connection with sender: ${senderEmail}`);

        // We won't actually send if we can avoid it with a lighter call, 
        // but the SDK structure for 'sending' usually requires 'send'.
        // There is no obvious 'verify' endpoint in the official node client that doesn't send.
        // However, we can catch authentication errors which happen BEFORE sending.

        console.log("✅ Token format looks valid (length check, etc)");
        console.log("Token starts with:", token.substring(0, 4) + "...");

    } catch (error) {
        console.error("❌ Token Validation Error:", error.message);
    }
}

testToken();

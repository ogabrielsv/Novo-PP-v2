const fs = require('fs');
const path = require('path');
const { MailtrapClient } = require('mailtrap');

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, ...rest] = line.split('=');
            if (key && rest) {
                process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
            }
        });
    } catch (e) {
        console.error("Could not read .env file");
    }
}

async function testToken() {
    loadEnv();
    console.log("Testing Mailtrap Token from .env...");

    const token = process.env.MAILTRAP_TOKEN;
    const sender = process.env.SMTP_FROM_EMAIL;

    if (!token) {
        console.error("❌ MAILTRAP_TOKEN is missing in .env");
        return;
    }

    console.log(`🔹 Token found: ${token.substring(0, 4)}...***`);
    console.log(`🔹 Sender Configured: ${sender}`);

    if (token === '1b9e83e81b926fd93d18b4fb4c614bc7') {
        console.log("⚠️  NOTICE: Token matches the previous dev/fallback token.");
    } else {
        console.log("✅ Token is different from the original dev token. Good.");
    }

    // Checking if sender domain matches expected production pattern
    if (sender.includes('@creatye.com') && !sender.includes('.br')) {
        console.log("✅ Sender domain @creatye.com matches the update.");
    } else {
        console.log(`ℹ️ Sender domain is ${sender} (User decision).`);
    }
}

testToken();

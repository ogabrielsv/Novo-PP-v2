const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');

        const keys = ['MAILTRAP_TOKEN', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_PORT'];
        const found = {};

        keys.forEach(k => found[k] = false);

        lines.forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                if (keys.includes(key) && value.length > 0) {
                    found[key] = true;
                }
            }
        });

        console.log("ENV VARS FOUND:");
        console.log(JSON.stringify(found, null, 2));

    } else {
        console.log(".env file NOT found.");
    }
} catch (e) {
    console.error("Error:", e);
}

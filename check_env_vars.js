const fs = require('fs');
const path = require('path');

// Read .env file directly if possible, or check process.env
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');

        const output = {
            MAILTRAP_TOKEN: false,
            SMTP_HOST: false,
            SMTP_USER: false,
            SMTP_PASS: false,
            SMTP_PORT: false
        };

        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && Object.keys(output).includes(key.trim())) {
                output[key.trim()] = !!value && value.trim() !== '';
            }
        });

        console.log("Environment Variables Check (.env file):");
        console.table(output);
    } else {
        console.log(".env file not found.");
    }
} catch (e) {
    console.error("Error reading .env:", e);
}

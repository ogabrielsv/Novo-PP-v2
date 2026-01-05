export const MAILTRAP_API_TOKEN = process.env.MAILTRAP_TOKEN;

interface MailtrapContact {
    email: string;
    name: string;
    phone: string;
}

export async function addContactToMailtrap({ email, name, phone }: MailtrapContact) {
    if (!MAILTRAP_API_TOKEN) {
        console.warn('MAILTRAP_TOKEN is not defined. Skipping contact creation.');
        return;
    }

    try {
        const response = await fetch("https://send.api.mailtrap.io/api/contacts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                fields: {
                    name,
                    phone
                },
                lists: ["My list"],
                subscribed: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Mailtrap API Error:', response.status, errorData);
            // We don't throw here to ensure the main flow continues
            return;
        }

        console.log(`Contact ${email} added/updated in Mailtrap successfully.`);
    } catch (error) {
        console.error('Failed to add contact to Mailtrap:', error);
        // Ensure strictly non-blocking by catching everything
    }
}

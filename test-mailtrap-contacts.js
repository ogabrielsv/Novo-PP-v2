
const TOKEN = '1b9e83e81b926fd93d18b4fb4c614bc7';
const ACCOUNT_ID = 2570584;
const LIST_ID = 163944;

async function main() {
    const email = `test.user.${Date.now()}@example.com`;
    console.log(`Adding contact ${email}...`);

    // Testing custom_fields vs fields
    const body = {
        contact: {
            email: email,
            list_ids: [LIST_ID],
            // fields: { name: 'Foo', phone: 'Bar' } // This failed
            custom_fields: {  // Let's try this key
                phone: "123456"
            }
        }
    };

    try {
        const res = await fetch(`https://mailtrap.io/api/accounts/${ACCOUNT_ID}/contacts`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        console.log('Status:', res.status);
        console.log('Body:', await res.text());

    } catch (e) {
        console.error(e);
    }
}

main();

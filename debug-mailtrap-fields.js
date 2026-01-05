
// require('dotenv').config({ path: '.env.local' });

const MAILTRAP_API_TOKEN = process.env.MAILTRAP_TOKEN || '1b9e83e81b926fd93d18b4fb4c614bc7';

async function testCustomFields() {
    console.log('--- Testing Mailtrap Custom Fields ---');

    if (!MAILTRAP_API_TOKEN) {
        console.error('Missing token');
        return;
    }

    try {
        // 1. Get Account
        console.log('Fetching Account...');
        const accRes = await fetch("https://mailtrap.io/api/accounts", {
            headers: { "Authorization": `Bearer ${MAILTRAP_API_TOKEN}` }
        });
        const accounts = await accRes.json();
        const accountId = accounts[0].id;
        console.log('Account ID:', accountId);

        // 2. Get Custom Fields Definition
        console.log('Fetching Custom Fields Definitions...');
        const fieldsRes = await fetch(`https://mailtrap.io/api/accounts/${accountId}/contacts/fields`, {
            headers: { "Authorization": `Bearer ${MAILTRAP_API_TOKEN}` }
        });
        const fields = await fieldsRes.json();
        console.log('Existing Custom Fields in Mailtrap:', JSON.stringify(fields, null, 2));

        // 3. Try to add a contact with phone
        const testEmail = `test_phone_${Date.now()}@example.com`;
        console.log(`Attempting to add contact: ${testEmail} with phone field...`);

        const body = {
            contact: {
                email: testEmail,
                first_name: 'Test',
                last_name: 'Phone',
                fields: {
                    phone: '5511999998888',
                    state: 'SP',
                    ticket_number: '1234'
                }
            }
        };

        const res = await fetch(`https://mailtrap.io/api/accounts/${accountId}/contacts`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${MAILTRAP_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const text = await res.text();
        console.log('Add Contact Response Status:', res.status);
        console.log('Add Contact Response Body:', text);

    } catch (e) {
        console.error('Error:', e);
    }
}

testCustomFields();

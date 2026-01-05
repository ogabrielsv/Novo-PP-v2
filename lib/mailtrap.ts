
export const MAILTRAP_API_TOKEN = process.env.MAILTRAP_TOKEN || '1b9e83e81b926fd93d18b4fb4c614bc7';

// In-memory cache for IDs to reduce API calls
let CACHED_ACCOUNT_ID: string | number | null = null;
let CACHED_LIST_ID: number | null = null;

interface MailtrapContact {
    email: string;
    name: string;
    phone: string;
    state?: string;
    ticket_number?: number | string;
    raffle_name?: string;
    utm_source?: string | null;
}

export async function addContactToMailtrap({ email, name, phone, state, ticket_number, raffle_name, utm_source }: MailtrapContact) {
    console.log(`🚀 [Mailtrap] Starting integration for: ${email}`);

    if (!MAILTRAP_API_TOKEN) {
        console.error('❌ [Mailtrap] Token MISSING. Check .env.local');
        return;
    }

    try {
        // 1. Get Account ID if not cached
        if (!CACHED_ACCOUNT_ID) {
            const accRes = await fetch("https://mailtrap.io/api/accounts", {
                headers: {
                    "Authorization": `Bearer ${MAILTRAP_API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });

            if (!accRes.ok) {
                console.error('Mailtrap: Failed to fetch accounts', accRes.status);
                return;
            }

            const accounts = await accRes.json();
            if (Array.isArray(accounts) && accounts.length > 0) {
                CACHED_ACCOUNT_ID = accounts[0].id;
                // console.log('Mailtrap: Found Account ID', CACHED_ACCOUNT_ID);
            } else {
                console.error("Mailtrap: No account found");
                return;
            }
        }

        // 2. Get List ID if not cached
        if (!CACHED_LIST_ID && CACHED_ACCOUNT_ID) {
            const listRes = await fetch(`https://mailtrap.io/api/accounts/${CACHED_ACCOUNT_ID}/contacts/lists`, {
                headers: {
                    "Authorization": `Bearer ${MAILTRAP_API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });

            if (listRes.ok) {
                const lists = await listRes.json();
                // Find "My list" or populate first available
                const myList = lists.find((l: any) => l.name === 'My list') || lists[0];
                if (myList) {
                    CACHED_LIST_ID = myList.id;
                    // console.log('Mailtrap: Found List ID', CACHED_LIST_ID);
                } else {
                    console.warn("Mailtrap: No contact lists found. Contact will be created without list.");
                }
            } else {
                console.error('Mailtrap: Failed to fetch lists', listRes.status);
            }
        }

        // 3. Create Contact
        const firstName = name.split(' ')[0] || '';
        const lastName = name.split(' ').slice(1).join(' ') || '';

        // Prepare custom fields
        // IMPORTANT: These custom fields must be created in the Mailtrap dashboard for them to be saved.
        const customFields: Record<string, any> = {
            phone: phone,
            name: name,
        };

        if (state) customFields.state = state;
        if (ticket_number) customFields.ticket_number = String(ticket_number);
        if (raffle_name) customFields.raffle_name = raffle_name;
        if (utm_source) customFields.utm_source = utm_source;

        const body = {
            contact: {
                email: email,
                first_name: firstName,
                last_name: lastName,
                list_ids: CACHED_LIST_ID ? [CACHED_LIST_ID] : [],
                fields: customFields
            }
        };

        const res = await fetch(`https://mailtrap.io/api/accounts/${CACHED_ACCOUNT_ID}/contacts`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${MAILTRAP_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errText = await res.text();

            // Fallback: If 422 (likely due to custom_fields), try again without custom fields
            if (res.status === 422) {
                console.warn('⚠️ [Mailtrap] 422 Error (likely missing custom fields). Retrying with basic info.', errText);

                const fallbackBody = {
                    contact: {
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                        list_ids: CACHED_LIST_ID ? [CACHED_LIST_ID] : []
                    }
                };

                const retryRes = await fetch(`https://mailtrap.io/api/accounts/${CACHED_ACCOUNT_ID}/contacts`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${MAILTRAP_API_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(fallbackBody)
                });

                if (!retryRes.ok) {
                    console.error("❌ [Mailtrap] Retry Failed:", retryRes.status, await retryRes.text());
                } else {
                    console.log("✅ [Mailtrap] Contact added successfully (Basic Info). Create custom fields in Mailtrap to fix 422.");
                }
            } else {
                console.error("❌ [Mailtrap] Failed:", res.status, errText);
            }
        } else {
            console.log(`✅ [Mailtrap] Contact ${email} added successfully.`);
        }

    } catch (e) {
        console.error("❌ [Mailtrap] Integration Error:", e);
    }
}

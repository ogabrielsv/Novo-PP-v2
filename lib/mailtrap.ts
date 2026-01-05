
export const MAILTRAP_API_TOKEN = process.env.MAILTRAP_TOKEN || '1b9e83e81b926fd93d18b4fb4c614bc7';

// In-memory cache for IDs to reduce API calls
let CACHED_ACCOUNT_ID: string | number | null = null;
let CACHED_LIST_ID: number | null = null;

interface MailtrapContact {
    email: string;
    name: string;
    phone: string;
}

export async function addContactToMailtrap({ email, name, phone }: MailtrapContact) {
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
        // We attempt to map name to first/last name as standard fields.
        // Phone and full name are sent as custom_fields.
        // If custom fields are not defined in Mailtrap, they might be ignored or cause 422.
        // To be safe against 422 blocking the whole subscribe, we will primarily send the basics first.
        // But let's try sending all.

        const firstName = name.split(' ')[0] || '';
        const lastName = name.split(' ').slice(1).join(' ') || '';

        const body = {
            contact: {
                email: email,
                first_name: firstName,
                last_name: lastName,
                list_ids: CACHED_LIST_ID ? [CACHED_LIST_ID] : [],
                // We send phone in custom_fields. 
                // Note: You must create 'phone' custom field in Mailtrap dashboard for this to save.
                custom_fields: {
                    phone: phone,
                    name: name
                }
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
                    console.log("✅ [Mailtrap] Contact added successfully (Basic Info).");
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

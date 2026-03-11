/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const raffle = await prisma.raffle.create({
        data: {
            name: 'Test Campaign Verification',
            description: 'Automated test raffle',
            price: 0.0,
            imageUrl: 'https://via.placeholder.com/500',
            status: 'OPEN'
        }
    });
    console.log('CREATED_RAFFLE_ID:', raffle.id);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

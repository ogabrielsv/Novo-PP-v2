/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const raffleId = 'f8ce466a-22e8-4782-bf0d-4940873ba517';

    const ticketCount = await prisma.ticket.count({
        where: { raffleId }
    });

    console.log('TICKET_COUNT:', ticketCount);

    if (ticketCount > 0) {
        await prisma.ticket.deleteMany({ where: { raffleId } });
        await prisma.raffle.delete({ where: { id: raffleId } });
        console.log('CLEANUP_SUCCESS: Test raffle and tickets deleted.');
    } else {
        console.log('CLEANUP_FAILED: No tickets found or raffle missing.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

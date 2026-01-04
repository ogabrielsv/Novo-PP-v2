import { prisma } from './lib/db';

async function main() {
    const lastTicket = await prisma.ticket.findFirst({
        orderBy: { createdAt: 'desc' }
    });
    console.log('Last ticket:', lastTicket);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

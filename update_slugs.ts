
import { prisma } from './lib/db';

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start
        .replace(/-+$/, ''); // Trim - from end
}

async function main() {
    const raffles = await prisma.raffle.findMany({
        where: { slug: null }
    });

    console.log(`Found ${raffles.length} raffles without slug.`);

    for (const raffle of raffles) {
        let slug = `sorteio-${slugify(raffle.name)}`;

        // Ensure uniqueness roughly
        let existing = await prisma.raffle.findUnique({ where: { slug } });
        let counter = 1;
        while (existing) {
            slug = `sorteio-${slugify(raffle.name)}-${counter}`;
            existing = await prisma.raffle.findUnique({ where: { slug } });
            counter++;
        }

        await prisma.raffle.update({
            where: { id: raffle.id },
            data: { slug }
        });
        console.log(`Updated raffle ${raffle.name} with slug: ${slug}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

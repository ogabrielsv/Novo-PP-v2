import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { RafflePublicView } from '@/app/components/RafflePublicView';

export default async function RafflePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const raffle = await prisma.raffle.findUnique({
        where: { id },
    });

    if (!raffle) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Sorteio não encontrado
            </div>
        );
    }

    return <RafflePublicView raffle={raffle} />;
}

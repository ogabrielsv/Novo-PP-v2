import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { RafflePublicView } from '@/app/components/RafflePublicView';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const raffle = await prisma.raffle.findUnique({
        where: { id },
    });

    if (!raffle) {
        return {
            title: 'Sorteio não encontrado',
        };
    }

    return {
        title: raffle.name,
        description: raffle.description || 'Participe do sorteio!',
        openGraph: {
            title: raffle.name,
            description: raffle.description || 'Participe do sorteio!',
            images: [
                {
                    url: 'https://participe.creatye.com.br/share-image.png',
                    width: 1200,
                    height: 630,
                    alt: 'Sorteio',
                },
            ],
            type: 'website',
        },
    };
}

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

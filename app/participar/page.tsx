import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { RafflePublicView } from '@/app/components/RafflePublicView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
    const params = await searchParams;
    const camp = params?.camp;

    if (!camp || typeof camp !== 'string') {
        return {
            title: 'Participar do Sorteio - Play Prêmios',
        };
    }

    const campaignId = parseInt(camp, 10);
    if (isNaN(campaignId)) return {
        title: 'Sorteio não encontrado - Play Prêmios',
    };

    const raffle = await prisma.raffle.findUnique({
        where: { campaignId },
        select: { name: true, description: true }
    });

    if (!raffle) {
        return {
            title: 'Sorteio não encontrado - Play Prêmios',
        };
    }

    return {
        title: `${raffle.name} - Play Prêmios`,
        description: raffle.description || 'Participe deste sorteio incrível!',
    };
}

export default async function ParticiparPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const camp = params?.camp;

    if (!camp || typeof camp !== 'string') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">Link Incompleto</h1>
                <p className="text-stone-400">O link de participação está incompleto. Verifique se você copiou o link corretamente.</p>
            </div>
        );
    }

    const campaignId = parseInt(camp, 10);
    if (isNaN(campaignId)) {
        return notFound();
    }

    const raffle = await prisma.raffle.findUnique({
        where: { campaignId },
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

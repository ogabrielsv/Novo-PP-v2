import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ParticipationForm } from './components/ParticipationForm';
import { Gift } from 'lucide-react';

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

    return (
        <div className="min-h-screen bg-[#3b82f6] flex items-center justify-center p-4">
            {/* Centered Squeeze Card */}
            <main className="w-full max-w-[480px] bg-black rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">

                {/* Header Icon/Image */}
                <div className="flex flex-col items-center text-center space-y-4 mb-6">
                    {raffle.imageUrl ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-stone-800 mb-2 shadow-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={raffle.imageUrl} alt={raffle.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center border border-stone-800 text-3xl mb-2 shadow-xl">
                            <Gift className="w-10 h-10 text-blue-500" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-white leading-tight">
                            {raffle.name}
                        </h1>
                        <p className="text-stone-400 text-sm px-2 leading-relaxed">
                            {raffle.description || "Participe e concorra a este prêmio incrível."}
                        </p>
                    </div>
                </div>

                {/* Participation Form */}
                <ParticipationForm raffleId={raffle.id} />

            </main>
        </div>
    );
}

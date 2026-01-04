import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ParticipationForm } from './components/ParticipationForm';
import { EmojiRain } from './components/EmojiRain';
import { StepsModal } from './components/StepsModal';
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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Liquid Blue Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#3b82f6_0%,_#1d4ed8_50%,_#1e3a8a_100%)] opacity-80"></div>
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.4)_0%,_transparent_50%)] animate-pulse-slow"></div>
                <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.3)_0%,_transparent_50%)] animate-pulse-slower"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Background Effect */}
            <EmojiRain />

            {/* Steps Modal */}
            <StepsModal
                redirectUrl={(raffle as any).redirectUrl}
                articleUrl={(raffle as any).articleUrl}
            />

            {/* Centered Squeeze Card */}
            <main className="w-full max-w-[480px] bg-black rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden z-10">

                {/* Header Icon/Image */}
                <div className="flex flex-col items-center text-center space-y-4 mb-6">
                    {raffle.imageUrl ? (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-stone-800 mb-4 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={raffle.imageUrl}
                                alt={raffle.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
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
                <ParticipationForm
                    raffleId={raffle.id}
                    whatsappUrl={raffle.whatsappUrl}
                />

            </main>
        </div>
    );
}

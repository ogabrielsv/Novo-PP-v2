import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Plus, Gift, Search } from 'lucide-react';
import { RaffleListItem, Raffle } from './components/RaffleListItem';

export const dynamic = 'force-dynamic';

export default async function RafflesPage() {
    const raffles = await prisma.raffle.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { tickets: true },
            },
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Campanhas</h2>
                        <p className="text-stone-400 text-sm">Gerencie e visualize suas campanhas</p>
                    </div>
                    <Link
                        href="/admin/raffles/new"
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-bold transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Campanha
                    </Link>
                </div>
            </div>

            {/* Search Bar - Visual Only for now */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                <input
                    type="text"
                    placeholder="Buscar campanhas..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-12 pr-4 text-stone-300 focus:outline-none focus:border-stone-700"
                />
            </div>

            <div className="space-y-4">
                {raffles.length === 0 ? (
                    <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800 border-dashed">
                        <Gift className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                        <p className="text-stone-500">Nenhuma campanha encontrada.</p>
                    </div>
                ) : (
                    raffles.map((raffle) => (
                        <RaffleListItem key={raffle.id} raffle={raffle as unknown as Raffle} />
                    ))
                )}
            </div>
        </div>
    );
}

import { prisma } from '@/lib/db';
import { ArrowLeft, Download, Search } from 'lucide-react';
import { ParticipantsTable } from './components/ParticipantsTable';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ParticipantsPage({ params }: { params: { id: string } }) {
    const { id } = await Promise.resolve(params);

    const raffle = await prisma.raffle.findUnique({
        where: { id },
        include: {
            tickets: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!raffle) {
        redirect('/admin/raffles');
    }

    const serializedTickets = raffle.tickets.map(ticket => ({
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/raffles"
                        className="p-2 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Participantes</h1>
                        <p className="text-stone-400 text-sm">Visualizando participantes de: <span className="text-[#4ADE80]">{raffle.name}</span></p>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <ParticipantsTable tickets={serializedTickets} raffleName={raffle.name} />
        </div>
    );
}

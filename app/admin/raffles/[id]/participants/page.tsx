import { prisma } from '@/lib/db';
import { ArrowLeft, Ticket } from 'lucide-react';
import Link from 'next/link';

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
        return <div>Raffle not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/raffles"
                    className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white">Participantes</h2>
                    <p className="text-stone-400 text-sm">Lista de participantes para: {raffle.name}</p>
                </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
                {raffle.tickets.length === 0 ? (
                    <div className="p-12 text-center text-stone-500">
                        Nenhum participante ainda.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-stone-400">
                        <thead className="bg-stone-950 text-stone-300 font-medium">
                            <tr>
                                <th className="p-4">Nome</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Telefone</th>
                                <th className="p-4">Bilhetes</th>
                                <th className="p-4">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800">
                            {raffle.tickets.map((ticket, idx) => (
                                <tr key={ticket.id} className="hover:bg-stone-800/50">
                                    <td className="p-4 font-medium text-white">{ticket.name}</td>
                                    <td className="p-4">{ticket.email || '-'}</td>
                                    <td className="p-4">{ticket.phone}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 bg-stone-800 px-2 py-1 rounded text-stone-300">
                                            <Ticket className="w-3 h-3" />
                                            #{ticket.number}
                                        </span>
                                    </td>
                                    <td className="p-4">{new Date(ticket.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

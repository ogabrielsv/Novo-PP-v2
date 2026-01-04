'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface Ticket {
    id: string;
    name: string;
    email: string;
    phone: string;
    state: string | null;
    ipAddress: string | null;
    number: number | null;
    createdAt: string;
}

interface ParticipantsTableProps {
    tickets: Ticket[];
    raffleName: string;
}

export function ParticipantsTable({ tickets, raffleName }: ParticipantsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTickets = tickets.filter(ticket => {
        const search = searchTerm.toLowerCase();
        const numberString = ticket.number?.toString() || '';

        return (
            ticket.name.toLowerCase().includes(search) ||
            ticket.email.toLowerCase().includes(search) ||
            ticket.phone.includes(search) ||
            numberString.includes(search)
        );
    });

    return (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Search / Filter */}
            <div className="p-4 border-b border-stone-800 bg-stone-950/50 flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email, telefone ou número da sorte..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-10 pr-4 py-2 text-sm text-stone-300 focus:outline-none focus:border-[#4ADE80] transition-colors"
                    />
                </div>
                <div className="text-sm text-stone-500">
                    Total: <span className="text-white font-bold">{filteredTickets.length}</span>
                    {filteredTickets.length !== tickets.length && (
                        <span className="ml-1 text-stone-600">(de {tickets.length})</span>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-400">
                    <thead className="bg-[#111] text-stone-300 font-medium uppercase text-xs tracking-wider border-b border-stone-800">
                        <tr>
                            <th className="p-5 font-bold">Nome</th>
                            <th className="p-5 font-bold">Email</th>
                            <th className="p-5 font-bold">Telefone</th>
                            <th className="p-5 font-bold">Estado</th>
                            <th className="p-5 font-bold">Origem</th>
                            <th className="p-5 font-bold">Campanha</th>
                            <th className="p-5 font-bold">Números da Sorte</th>
                            <th className="p-5 font-bold">Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/50">
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-stone-600">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <p className="text-stone-500 font-medium">Nenhum participante encontrado.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-stone-800/30 transition-colors group">
                                    <td className="p-5 font-medium text-white group-hover:text-[#4ADE80] transition-colors">{ticket.name}</td>
                                    <td className="p-5">{ticket.email}</td>
                                    <td className="p-5 font-mono text-xs">{ticket.phone}</td>
                                    <td className="p-5 text-center">
                                        {ticket.state ? (
                                            <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded text-xs font-bold">
                                                {ticket.state}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="p-5 font-mono text-xs text-stone-500">{ticket.ipAddress || 'N/A'}</td>
                                    <td className="p-5 text-white">{raffleName}</td>
                                    <td className="p-5">
                                        <span className="bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                            {ticket.number?.toString().padStart(4, '0')}
                                        </span>
                                    </td>
                                    <td className="p-5 text-xs text-stone-500 whitespace-nowrap">
                                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')} <span className="opacity-50">às</span> {new Date(ticket.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

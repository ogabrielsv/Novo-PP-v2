'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gift, Users, Edit, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { deleteRaffle } from '@/app/admin/raffles/actions';

export interface Raffle {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    status: string;
    slug: string;
    campaignId: number;
    endDate: Date | string | null;
    startDate?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    _count: {
        tickets: number;
    };
}

interface RaffleListItemProps {
    raffle: Raffle;
}

export function RaffleListItem({ raffle }: RaffleListItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const url = `https://participe.creatye.com.br/raffle/${raffle.id}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copiado!');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteRaffle(raffle.id);

        if (result.success) {
            toast.success('Campanha excluída com sucesso!');
        } else {
            toast.error('Erro ao excluir campanha.');
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 group hover:border-stone-700 transition-colors">
                {/* Image */}
                <div className="w-full md:w-32 h-20 bg-stone-950 rounded-lg overflow-hidden shrink-0 relative">
                    {raffle.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={raffle.imageUrl} alt={raffle.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-700"><Gift /></div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-green-500 font-bold text-lg truncate">{raffle.name}</h3>
                    <p className="text-stone-400 text-sm line-clamp-1 mb-1">{raffle.description || 'Sem descrição'}</p>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span>R$ {raffle.price.toFixed(2)}</span>
                        <span>•</span>
                        <span>ID: {raffle.campaignId}</span>
                        <span>•</span>
                        <span>{raffle._count.tickets} ingressos vendidos</span>
                        {raffle.endDate && (
                            <>
                                <span>•</span>
                                <span>Sorteio: {new Date(raffle.endDate).toLocaleDateString('pt-BR')}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="text-right min-w-[80px]">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${raffle.status === 'OPEN' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                        }`}>
                        {raffle.status === 'OPEN' ? 'Ativo' : 'Encerrado'}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:pl-4 md:border-l border-stone-800">
                    <button
                        onClick={handleCopy}
                        className="p-2 text-stone-400 hover:text-green-500 transition-colors relative group/btn"
                        title="Copiar Link"
                    >
                        <img src="https://i.imgur.com/UhiADKk.png" className="w-4 h-4" alt="Copiar Link" />
                        {copied && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-green-500 text-black text-[10px] font-bold rounded shadow-lg animate-in fade-in zoom-in duration-200 whitespace-nowrap pointer-events-none z-50">
                                Copiado!
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rotate-45"></div>
                            </div>
                        )}
                    </button>
                    <Link href={`/admin/raffles/${raffle.id}/participants`} className="p-2 text-stone-400 hover:text-green-500 transition-colors" title="Participantes">
                        <Users className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/raffles/${raffle.id}/edit`} className="p-2 text-stone-400 hover:text-green-500 transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Excluir"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );
}

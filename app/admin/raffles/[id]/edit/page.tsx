import { prisma } from '@/lib/db';
import { updateRaffle } from '@/app/admin/raffles/actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditRafflePage({ params }: { params: { id: string } }) {
    // Await params as per Next.js 15/16 requirements for async server components
    const { id } = await Promise.resolve(params);

    const raffle = await prisma.raffle.findUnique({
        where: { id },
    });

    if (!raffle) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/raffles"
                    className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white">Editar Sorteio</h2>
                    <p className="text-stone-400 text-sm">Atualize os detalhes da campanha</p>
                </div>
            </div>

            <form action={updateRaffle.bind(null, raffle.id)} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-300">Nome do Sorteio</label>
                    <input
                        name="name"
                        defaultValue={raffle.name}
                        type="text"
                        className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-300">Descrição</label>
                    <textarea
                        name="description"
                        defaultValue={raffle.description || ''}
                        rows={4}
                        className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    />
                </div>

                <select
                    name="status"
                    defaultValue={raffle.status}
                    className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                    <option value="OPEN">Ativo (Open)</option>
                    <option value="CLOSED">Encerrado (Closed)</option>
                </select>
        </div>
                </div >

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">Data de Início</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            defaultValue={raffle.startDate ? new Date(new Date(raffle.startDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent [color-scheme:dark]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">Data do Sorteio</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            defaultValue={raffle.endDate ? new Date(new Date(raffle.endDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent [color-scheme:dark]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-300">URL da Imagem</label>
                    <input
                        name="imageUrl"
                        defaultValue={raffle.imageUrl || ''}
                        type="url"
                        className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="https://exemplo.com/imagem.jpg"
                    />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                    <Link
                        href="/admin/raffles"
                        className="px-6 py-3 rounded-xl font-bold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
                    >
                        <Save className="w-5 h-5" />
                        Salvar Alterações
                    </button>
                </div>
            </form >
        </div >
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function NewRafflePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        responsible: '',
        startDate: '',
        endDate: '',
        whatsappUrl: '',
        articleUrl: '',
        redirectUrl: '',
        // imageUrl is optional and not in the requested form
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name) {
                toast.error('O nome da campanha é obrigatório.');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/raffles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Falha ao criar campanha');

            toast.success('Campanha criada com sucesso!');
            router.push('/admin/raffles');
            router.refresh();
        } catch {
            toast.error('Erro ao criar campanha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/raffles"
                    className="p-2 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white">Nova Campanha</h2>
                    <p className="text-stone-400 mt-1">Crie uma nova campanha</p>
                </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Nome da Campanha */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Nome da Campanha
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder=""
                        />
                    </div>

                    {/* Titulo */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Titulo
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder=""
                        />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder=""
                        />
                    </div>

                    {/* Responsável */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Responsável
                        </label>
                        <input
                            type="text"
                            value={formData.responsible}
                            onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder=""
                        />
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-300">
                                Data de Início
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-300">
                                Data de Expiração
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Link do Grupo */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Link do Grupo
                        </label>
                        <input
                            type="url"
                            value={formData.whatsappUrl}
                            onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder="https://chat.whatsapp.com/..."
                        />
                    </div>

                    {/* Link do Artigo */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Link do Artigo
                        </label>
                        <input
                            type="url"
                            value={formData.articleUrl}
                            onChange={(e) => setFormData({ ...formData, articleUrl: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Link de Redirecionamento */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Link de Redirecionamento
                        </label>
                        <input
                            type="url"
                            value={formData.redirectUrl}
                            onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="pt-8 flex justify-end gap-3">
                        <Link
                            href="/admin/raffles"
                            className="bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

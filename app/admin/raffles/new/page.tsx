'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewRafflePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name) {
                toast.error('Preencha os campos obrigatórios.');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/raffles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Falha ao criar sorteio');

            toast.success('Sorteio criado com sucesso!');
            router.push('/admin/raffles');
            router.refresh();
        } catch {
            toast.error('Erro ao criar sorteio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/raffles"
                    className="p-2 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white">Criar Sorteio</h2>
                    <p className="text-stone-400 mt-1">Configure os detalhes do novo sorteio.</p>
                </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-300">
                                Nome do Sorteio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="Ex: IPhone 15 Pro Max"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-300">
                                URL da Imagem
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-stone-500">
                                Cole o link direto da imagem do prêmio.
                            </p>
                        </div>
                    </div>



                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 px-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder="Descreva os detalhes do prêmio e do sorteio..."
                        />
                    </div>

                    <div className="pt-4 border-t border-stone-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Salvando...' : 'Criar Sorteio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

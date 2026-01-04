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
        imageUrl: '',
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

                    {/* Imagem de Capa */}
                    <div className="space-y-4 bg-stone-950/50 p-6 rounded-xl border border-stone-800">
                        <label className="text-sm font-medium text-stone-300 block">
                            Imagem de Capa
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Preview */}
                            <div className="relative aspect-video bg-stone-900 rounded-lg border border-stone-800 overflow-hidden flex items-center justify-center group">
                                {formData.imageUrl ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Save className="w-6 h-6 text-stone-600" />
                                        </div>
                                        <p className="text-sm text-stone-500">Nenhuma imagem selecionada</p>
                                    </div>
                                )}
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-stone-500 mb-1.5 block">URL da Imagem</label>
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full bg-stone-900 border border-stone-800 text-white rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-stone-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-stone-950/50 px-2 text-stone-500">OU</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-stone-500 mb-1.5 block">Carregar do Dispositivo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                                                    toast.error('A imagem deve ter no máximo 5MB');
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, imageUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-full text-sm text-stone-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                    />
                                    <p className="text-[10px] text-stone-500 mt-1">Recomendado: 1200x630px (Max 5MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>

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

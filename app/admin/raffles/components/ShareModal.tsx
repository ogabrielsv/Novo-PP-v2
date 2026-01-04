'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
    raffleId: string;
    raffleName: string;
    onClose: () => void;
}

export function ShareModal({ raffleId, raffleName, onClose }: ShareModalProps) {
    const [utmSource, setUtmSource] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setBaseUrl(`${window.location.origin}/raffle/${raffleId}`);
    }, [raffleId]);

    const getTrackingUrl = (source?: string) => {
        const finalSource = source || utmSource;
        if (!finalSource) return baseUrl;
        return `${baseUrl}?utm_source=${finalSource.toLowerCase().replace(/\s+/g, '_')}`;
    };

    const handleCopy = (source?: string) => {
        const urlToCopy = getTrackingUrl(source);
        navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        toast.success(`Link ${source ? `para ${source} ` : ''}copiado!`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-stone-800">
                    <h3 className="text-lg font-bold text-white">Compartilhar Campanha</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="p-3 bg-stone-950/50 rounded-lg border border-stone-800">
                        <p className="text-xs text-stone-500 mb-1">Campanha selecionada</p>
                        <p className="text-white font-medium truncate">{raffleName}</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-stone-300 block">Gerar link com rastreio</label>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <button
                                onClick={() => handleCopy('whatsapp')}
                                className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 border border-transparent rounded-xl transition-all group"
                            >
                                <MessageCircle className="w-5 h-5 text-stone-400 group-hover:text-[#25D366]" />
                                <span className="text-xs text-stone-400 group-hover:text-white">WhatsApp</span>
                            </button>
                            <button
                                onClick={() => handleCopy('instagram')}
                                className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-purple-500/20 hover:border-purple-500/50 border border-transparent rounded-xl transition-all group"
                            >
                                <Instagram className="w-5 h-5 text-stone-400 group-hover:text-purple-400" />
                                <span className="text-xs text-stone-400 group-hover:text-white">Instagram</span>
                            </button>
                            <button
                                onClick={() => handleCopy('facebook')}
                                className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-blue-600/20 hover:border-blue-600/50 border border-transparent rounded-xl transition-all group"
                            >
                                <Facebook className="w-5 h-5 text-stone-400 group-hover:text-blue-500" />
                                <span className="text-xs text-stone-400 group-hover:text-white">Facebook</span>
                            </button>
                        </div>

                        {/* Custom Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ou digite uma origem (ex: email, tiktok)..."
                                value={utmSource}
                                onChange={(e) => setUtmSource(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-800 text-white rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                        </div>

                        {/* Preview */}
                        <div className="bg-black/40 rounded-lg p-3 border border-stone-800/50 flex items-center justify-between gap-3 group">
                            <code className="text-xs text-stone-400 truncate flex-1 font-mono">
                                {getTrackingUrl()}
                            </code>
                            <button
                                onClick={() => handleCopy()}
                                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
                                title="Copiar"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

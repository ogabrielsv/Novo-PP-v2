'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
    raffleId: string;
    raffleName: string;
    onClose: () => void;
}

export function ShareModal({ raffleId, raffleName, onClose }: ShareModalProps) {
    const [baseUrl, setBaseUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setBaseUrl(`https://participe.clipfy.me/raffle/${raffleId}`);
    }, [raffleId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(baseUrl);
        setCopied(true);
        toast.success('Link copiado!');
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
                        <label className="text-sm font-medium text-stone-300 block">Link de participação</label>

                        {/* Link Preview and Copy */}
                        <div className="bg-black/40 rounded-lg p-3 border border-stone-800/50 flex items-center justify-between gap-3 group">
                            <code className="text-xs text-stone-400 truncate flex-1 font-mono">
                                {baseUrl}
                            </code>
                            <button
                                onClick={handleCopy}
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

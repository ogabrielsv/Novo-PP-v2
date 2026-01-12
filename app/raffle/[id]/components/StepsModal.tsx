'use client';

import { useState, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';


interface StepsModalProps {
    redirectUrl?: string | null;
    articleUrl?: string | null;
}

export function StepsModal({ redirectUrl, articleUrl }: StepsModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        setShouldRender(true);
        // Small delay to ensure render before animation starts
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), 300);
    };

    const handleAction = () => {
        const url = articleUrl || redirectUrl;
        if (url) {
            window.open(url, '_blank');
        }
        // Optional: Close modal after clicking, or keep it open? 
        // Usually better to close so they can see the underlying page
        handleClose();
    };

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl overflow-hidden transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}
            >
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                {/* Close Button Removed */}

                <div className="relative z-10 text-center space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-stone-950 rounded-full flex items-center justify-center mb-2 shadow-lg border border-stone-800">
                            <PlayCircle className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Só falta um passo!
                        </h2>
                        <p className="text-stone-400 text-sm leading-relaxed max-w-[90%] mx-auto">
                            Nossos patrocinadores que possibilitam a realização dos sorteios gratuitos todos os meses.
                            Por isso, pedimos que você assista a um rápido anúncio deles e desbloqueie a sua inscrição!
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAction}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 group border border-blue-400/20"
                    >
                        <span className="text-lg">Assista ao anúncio agora</span>
                        <PlayCircle className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Footer Warning */}
                    <p className="text-xs text-stone-500 px-4">
                        É bem rapidinho e faz toda a diferença para que nosso site continue gratuito.
                    </p>
                </div>
            </div>
        </div>
    );
}

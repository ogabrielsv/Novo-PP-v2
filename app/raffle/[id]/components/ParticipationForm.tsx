'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ParticipationFormProps {
    raffleId: string;
}

const BRAZIL_STATES = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export function ParticipationForm({ raffleId }: ParticipationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<{ number: string | number } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            raffleId,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            state: formData.get('state'),
        };

        try {
            const res = await fetch('/api/participants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Erro ao participar');
            }

            setSuccess(result.ticket);
            toast.success('Participação confirmada!');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Ocorreu um erro desconhecido');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                    <Check className="w-10 h-10 text-black" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sucesso!</h3>
                    <p className="text-stone-400 text-sm">Boa sorte! Seu número é:</p>
                </div>
                <div className="bg-black border border-stone-800 p-4 rounded-xl">
                    <span className="text-4xl font-mono font-bold text-blue-500 tracking-wider">
                        #{String(success.number).padStart(4, '0')}
                    </span>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 py-3 rounded-xl font-bold transition-colors text-sm"
                >
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                <input
                    name="name"
                    type="text"
                    required
                    placeholder="Digite seu nome completo"
                    className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm"
                />

                <input
                    name="email"
                    type="email"
                    required
                    placeholder="Digite seu melhor e-mail"
                    className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm"
                />

                <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm"
                />

                <select
                    name="state"
                    required
                    className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm appearance-none cursor-pointer"
                >
                    <option value="" disabled selected>Selecione seu estado</option>
                    {BRAZIL_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-3 pt-2">
                <p className="text-xs text-stone-400 font-medium">Aceite obrigatório para participação</p>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input type="checkbox" required className="peer relative appearance-none w-5 h-5 border border-stone-700 rounded bg-transparent checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition-all" />
                        <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-xs text-stone-500 group-hover:text-stone-400 transition-colors leading-relaxed select-none">
                        Aceito os <a href="#" className="text-blue-500 hover:text-blue-400 hover:underline">Termos de Uso</a> *
                    </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input type="checkbox" required className="peer relative appearance-none w-5 h-5 border border-stone-700 rounded bg-transparent checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition-all" />
                        <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-xs text-stone-500 group-hover:text-stone-400 transition-colors leading-relaxed select-none">
                        Aceito a <a href="#" className="text-blue-500 hover:text-blue-400 hover:underline">Política de Privacidade</a> *
                    </span>
                </label>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1b64f2] hover:bg-[#1b64f2]/90 text-white py-3.5 rounded-lg font-bold text-base shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                    </>
                ) : (
                    'Participar do Sorteio!'
                )}
            </button>

            <button type="button" className="w-full bg-white hover:bg-stone-100 text-stone-800 py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-stone-200 mt-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Preencha seus dados com Google
            </button>

            <div className="text-center pt-2">
                <button type="button" className="text-xs text-stone-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors px-4 py-2 rounded hover:bg-stone-900/50">
                    <span className="opacity-70">📜</span> Regras Oficiais do Sorteio
                </button>
            </div>
        </form>
    );
}

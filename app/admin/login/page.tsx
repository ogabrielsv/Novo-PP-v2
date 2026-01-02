'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { createClient } from '@/utils/supabase/client'; // Import Client Creation

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check Config State
    const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (error) {
        toast.error(error);
    }

    // Show visual warning if config is missing
    if (!hasEnvVars) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl text-sm mb-6 max-w-md mx-auto">
                <h3 className="font-bold text-lg mb-2">Configuração Pendente!</h3>
                <p className="mb-4">As variáveis de ambiente do Supabase não foram encontradas.</p>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-2">
                    <p>Adicione estas variáveis no Painel da Vercel:</p>
                    <p className="text-yellow-500">NEXT_PUBLIC_SUPABASE_URL</p>
                    <p className="text-yellow-500">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            // LOGIN 100% CLIENT-SIDE (Sem Server Actions)
            const supabase = createClient();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login Error:", error);
                toast.error(error.message || "Erro ao fazer login");
                setLoading(false);
            } else {
                toast.success('Login realizado com sucesso!');
                // Hard navigation to dashboard
                window.location.href = '/admin/dashboard';
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro inesperado. Verifique o console.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-stone-300 ml-1">
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                    <input
                        name="email"
                        type="email"
                        className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-stone-600"
                        placeholder="admin@example.com"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-stone-300 ml-1">
                    Senha
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                    <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-stone-600"
                        placeholder="••••••••"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
            >
                {loading ? 'Entrando...' : 'Acessar Painel'}
            </button>
        </form>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-stone-900/50 border border-stone-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Painel Admin</h1>
                    <p className="text-stone-400">Entre com suas credenciais de acesso</p>
                </div>

                <Suspense fallback={<div className="text-center text-stone-500">Carregando...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}

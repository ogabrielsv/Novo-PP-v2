import { prisma } from '@/lib/db';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {


    // Safe DB Calls
    const activeCount = 0;
    const pendingCount = 0;
    const dbError = null;

    /* TEMPORARILY DISABLED FOR DEBUGGING VERCEL CONNECTION
    try {
        activeCount = await prisma.raffle.count({
            where: { status: 'OPEN' }
        });

        pendingCount = await prisma.raffle.count({
            where: {
                status: { not: 'OPEN' }
            }
        });
    } catch (e: any) {
        console.error("Dashboard DB Error:", e);
        dbError = e.message || "Erro ao conectar ao banco de dados";
    }
    */

    const expiringTodayCount = 0;

    return (
        <div className="space-y-8">
            {dbError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6">
                    <strong>Erro de Conexão:</strong> {dbError}
                </div>
            )}
            <div>
                <h2 className="text-2xl font-bold text-white">Dashboard Admin</h2>
                <p className="text-stone-400">Visão geral das campanhas</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-green-500">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-stone-400 text-sm font-medium">Campanhas ativas</p>
                        <h3 className="text-3xl font-bold text-white">{activeCount}</h3>
                    </div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 text-yellow-500">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-stone-400 text-sm font-medium">Vencem hoje</p>
                        <h3 className="text-3xl font-bold text-white">{expiringTodayCount}</h3>
                    </div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-stone-400 text-sm font-medium">Aguardando número</p>
                        <p className="text-stone-500 text-xs">Campanhas encerradas sem ganhador</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{pendingCount}</h3>
                    </div>
                </div>
            </div>

            {/* Expiring Soon Section */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Campanhas que Vencem nos Próximos 7 dias</h3>
                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-8 text-center text-stone-500 border-dashed">
                    Nenhuma campanha vencendo em breve.
                </div>
            </div>
        </div>
    );
}

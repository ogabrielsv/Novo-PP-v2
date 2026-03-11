'use client';

import { useState } from 'react';
import {
    LayoutDashboard,
    Shield,
    AlertTriangle,
    CheckCircle,
    Database,
    RefreshCw,
    Calendar,
    Search,
    BarChart3
} from 'lucide-react';

export default function ReportsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data based on user request (functional UI first)
    // In a real implementation, these would come from the server
    const stats = {
        blockedIps: 0,
        suspicious: 0,
        trustedIps: 2, // Matches image
        auditLogs: 0
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        // Simulate data fetch
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Relatórios do Sistema</h1>
                    <p className="text-stone-400 mt-1">Monitoramento e análise completa do sistema</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-black font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Atualizando...' : 'Atualizar'}
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Date Picker (Mock) */}
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-300 min-w-[200px]">
                    <Calendar className="w-5 h-5 text-stone-500" />
                    <span className="text-sm font-medium">Últimos 30 dias</span>
                </div>

                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                    <input
                        type="text"
                        placeholder="Buscar nos relatórios..."
                        className="w-full bg-stone-900 border border-stone-800 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#4ADE80] transition-colors placeholder-stone-600"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-stone-800">
                <div className="flex gap-6 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                        { id: 'antibot', label: 'Anti-Bot', icon: Shield },
                        { id: 'ratelimit', label: 'Rate Limiting', icon: AlertTriangle },
                        { id: 'audit', label: 'Auditoria', icon: Database },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                    ? 'text-[#4ADE80]'
                                    : 'text-stone-500 hover:text-stone-300'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4ADE80] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* IPs Bloqueados */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-red-500/50 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-red-500/10 p-3 rounded-xl group-hover:bg-red-500/20 transition-colors">
                            <Shield className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-stone-400 text-sm font-medium">IPs Bloqueados</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.blockedIps}</h3>
                    </div>
                </div>

                {/* Atividades Suspeitas */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-yellow-500/50 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-yellow-500/10 p-3 rounded-xl group-hover:bg-yellow-500/20 transition-colors">
                            <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-stone-400 text-sm font-medium">Atividades Suspeitas</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.suspicious}</h3>
                    </div>
                </div>

                {/* IPs Confiáveis */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-[#4ADE80]/50 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-[#4ADE80]/10 p-3 rounded-xl group-hover:bg-[#4ADE80]/20 transition-colors">
                            <CheckCircle className="w-6 h-6 text-[#4ADE80]" />
                        </div>
                    </div>
                    <div>
                        <p className="text-stone-400 text-sm font-medium">IPs Confiáveis</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.trustedIps}</h3>
                    </div>
                </div>

                {/* Registros de Auditoria */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-500/10 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <Database className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-stone-400 text-sm font-medium">Registros de Auditoria</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.auditLogs}</h3>
                    </div>
                </div>
            </div>

            {/* Empty State / Placeholder for selected tab content */}
            {activeTab !== 'overview' && (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-500">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum dado encontrado para este período.</p>
                </div>
            )}
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Gift, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { logout } from '@/app/auth/actions';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();


    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        toast.success('Você saiu do sistema.');
        await logout();
    };

    const navSections = [
        {
            title: 'GESTÃO',
            items: [
                { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
                { name: 'Gerenciar Campanhas', href: '/admin/raffles', icon: Gift },
            ]
        },
        {
            title: 'ADMINISTRAÇÃO',
            items: [
                { name: 'Relatórios', href: '/admin/dashboard', icon: LayoutDashboard }, // Placeholder
                { name: 'Configurações', href: '/admin/settings', icon: Settings },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 bg-stone-950 border-r border-stone-800 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-stone-800">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Play <span className="text-blue-600">Prêmios</span>
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                    {navSections.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 px-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                                : 'text-stone-400 hover:text-white hover:bg-stone-900'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <Link
                        href="/admin/raffles/new"
                        className="flex items-center justify-center gap-2 w-full border border-stone-700 hover:border-blue-500 text-stone-300 hover:text-blue-500 px-4 py-3 rounded-xl font-bold transition-all mt-4"
                    >
                        <Gift className="w-4 h-4" />
                        Nova Campanha
                    </Link>
                </div>

                <div className="p-4 border-t border-stone-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-stone-400 hover:text-red-400 hover:bg-red-950/20"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

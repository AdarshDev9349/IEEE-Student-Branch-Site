'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
    Calendar, 
    Users, 
    ClipboardList, 
    LayoutDashboard, 
    LogOut,
    ExternalLink
} from 'lucide-react';

export function AdminNav({ segment }: { segment: string }) {
    const pathname = usePathname();
    const basePath = `/admin/${segment}`;

    const navItems = [
        { label: 'Nexus', path: `${basePath}`, icon: LayoutDashboard },
        { label: 'Protocol', path: `${basePath}/events`, icon: Calendar },
        { label: 'Personnel', path: `${basePath}/execom`, icon: Users },
        { label: 'Auditory', path: `${basePath}/registrations`, icon: ClipboardList },
    ];

    return (
        <>
            {/* Sidebar Desktop - Narrow Icon Rail */}
            <aside className="hidden md:flex flex-col w-[72px] h-screen sticky top-0 bg-[#0A0A0A] border-r border-white/5 py-8 shrink-0 items-center overflow-y-auto no-scrollbar">
                <div className="mb-12">
                    <div className="w-10 h-10 bg-ieee-blue rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,115,174,0.3)]">
                        <span className="text-white font-bold text-lg font-heading">I</span>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col items-center gap-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                title={item.label}
                                className={cn(
                                    "p-3 rounded-2xl transition-all duration-300 group relative",
                                    isActive 
                                        ? "bg-ieee-blue/10 text-ieee-blue border border-ieee-blue/20 shadow-[0_0_20px_rgba(0,115,174,0.1)]" 
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={24} className="transition-transform group-hover:scale-110" />
                                {isActive && (
                                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-ieee-blue rounded-r-full shadow-[0_0_10px_rgba(0,115,174,0.5)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto flex flex-col items-center gap-6 pb-4">
                    <Link 
                        href="/"
                        title="Main Website"
                        className="p-3 rounded-2xl text-white/20 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <ExternalLink size={24} className="group-hover:scale-110 transition-transform" />
                    </Link>
                    <button 
                        title="Log Out"
                        className="p-3 rounded-2xl text-red-400/30 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                    >
                        <LogOut size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </aside>

            {/* Bottom Nav Mobile - Floating Pill */}
            <div className="md:hidden fixed bottom-1.5 left-1.5 right-1.5 z-50">
                <nav className="h-16 bg-[#0F0F0F]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-around px-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center w-12 h-12 transition-all rounded-2xl",
                                    isActive ? "text-ieee-blue bg-ieee-blue/10 border border-ieee-blue/20" : "text-white/40"
                                )}
                            >
                                <Icon size={20} />
                                <span className="text-[10px] mt-0.5 font-bold uppercase tracking-wider">{item.label.substring(0, 4)}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}

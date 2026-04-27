'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
    Calendar, 
    Users, 
    ClipboardList, 
    LayoutDashboard, 
    LogOut,
    ExternalLink
} from 'lucide-react';
import { logoutAdmin } from '@/app/actions/auth';

export function AdminNav({ segment }: { segment: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const basePath = `/admin/${segment}`;

    const handleLogout = async () => {
        if (!confirm('Are you sure you want to log out?')) return;
        await logoutAdmin();
        router.push('/');
        router.refresh();
    };

    const navItems = [
        { label: 'Dashboard', path: `${basePath}`, icon: LayoutDashboard },
        { label: 'Events', path: `${basePath}/events`, icon: Calendar },
        { label: 'Execom', path: `${basePath}/execom`, icon: Users },
        { label: 'Registrations', path: `${basePath}/registrations`, icon: ClipboardList },
    ];

    return (
        <>
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-slate-200 shrink-0 shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-ieee-blue rounded-lg flex items-center justify-center text-white font-bold">
                        I
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">Admin Portal</span>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                                    isActive 
                                        ? "bg-ieee-blue/5 text-ieee-blue shadow-sm" 
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <Link 
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium text-sm"
                    >
                        <ExternalLink size={18} />
                        View Website
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-medium text-sm"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Bottom Nav Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <nav className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center flex-1 h-full transition-all",
                                    isActive ? "text-ieee-blue" : "text-slate-400"
                                )}
                            >
                                <Icon size={20} />
                                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}

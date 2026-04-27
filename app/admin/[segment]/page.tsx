import { cookies } from 'next/headers';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminNav } from '@/components/admin/AdminNav';
import { createClient } from '@/lib/supabase/server';
import { 
    Calendar, 
    Users, 
    ClipboardList, 
    BarChart3 
} from 'lucide-react';

interface PageProps {
    params: Promise<{ segment: string }>;
}

export default async function AdminDashboard({ params }: PageProps) {
    const { segment } = await params;
    const cookieStore = await cookies();
    const isAuth = cookieStore.get('admin_session')?.value === 'true';

    if (!isAuth) {
        return <AdminLogin />;
    }

    const supabase = createClient();
    
    // Fetch stats from all tables
    const [eventsRes, membersRes, soloRes, teamRes] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('execom').select('*', { count: 'exact', head: true }),
        supabase.from('solo_registrations').select('*', { count: 'exact', head: true }),
        supabase.from('team_registrations').select('*', { count: 'exact', head: true })
    ]);

    const stats = [
        { label: 'Active Protocol', value: eventsRes.count || 0, icon: Calendar, color: 'text-ieee-blue' },
        { label: 'Elite Personnel', value: membersRes.count || 0, icon: Users, color: 'text-purple-500' },
        { label: 'Nexus Entries', value: (soloRes.count || 0) + (teamRes.count || 0), icon: ClipboardList, color: 'text-emerald-500' },
    ];

    return (
        <>
            <AdminNav segment={segment} />
            <main className="flex-1 min-h-screen p-8 md:pl-[104px] md:pr-12 md:py-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto pt-20 md:pt-0">
                    <div className="flex items-center gap-6 mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="w-16 h-16 bg-ieee-blue/10 rounded-[2rem] flex items-center justify-center border border-ieee-blue/20 shadow-lg shadow-ieee-blue/5">
                            <BarChart3 className="text-ieee-blue" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight uppercase font-heading">Command Center</h1>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em] mt-1.5">Intelligence Hub • IEEE SB UCEK</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div 
                                key={stat.label} 
                                className="nm-raised p-10 rounded-[2.5rem] bg-black/40 backdrop-blur-xl border border-white/5 hover:border-ieee-blue/20 transition-all group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-ieee-blue/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-ieee-blue/10 transition-colors" />
                                <div className={`${stat.color} mb-8 transition-transform group-hover:scale-110 group-hover:-translate-y-1`}>
                                    <stat.icon size={40} strokeWidth={1.5} />
                                </div>
                                <div className="text-6xl font-black text-white mb-3 tracking-tighter leading-none">{stat.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-ieee-blue transition-colors">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-12 bg-gradient-to-br from-ieee-blue/[0.07] via-ieee-blue/[0.02] to-transparent rounded-[3rem] border border-ieee-blue/10 relative overflow-hidden group animate-in zoom-in-95 duration-700">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-ieee-blue/10 blur-[100px] rounded-full group-hover:bg-ieee-blue/20 transition-colors" />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase font-heading">Protocol Initialization</h2>
                            <p className="text-white/50 text-base max-w-2xl font-medium leading-relaxed">
                                Welcome to the unified administrative interface. This portal serves as the single source 
                                of truth for event coordination and personnel directory. Deployment of changes is immediate 
                                across all production environments.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <div className="h-1 w-20 bg-ieee-blue rounded-full" />
                                <div className="h-1 w-8 bg-white/10 rounded-full" />
                                <div className="h-1 w-4 bg-white/10 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

import { createClient } from '@/lib/supabase/server';
import { 
    Calendar, 
    Users, 
    ClipboardList, 
    LayoutDashboard 
} from 'lucide-react';

interface PageProps {
    params: Promise<{ segment: string }>;
}

export default async function AdminDashboard({ params }: PageProps) {
    const supabase = createClient();
    
    // Fetch stats from all tables
    const [eventsRes, membersRes, soloRes, teamRes] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('execom').select('*', { count: 'exact', head: true }),
        supabase.from('solo_registrations').select('*', { count: 'exact', head: true }),
        supabase.from('team_registrations').select('*', { count: 'exact', head: true })
    ]);

    const stats = [
        { label: 'Total Events', value: eventsRes.count || 0, icon: Calendar, color: 'text-ieee-blue', bg: 'bg-ieee-blue/5' },
        { label: 'Execom Members', value: membersRes.count || 0, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
        { label: 'Total Registrations', value: (soloRes.count || 0) + (teamRes.count || 0), icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto pt-6 md:pt-0">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                        <LayoutDashboard className="text-ieee-blue" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h1>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Overview of your student branch platform</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div 
                            key={stat.label} 
                            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6"
                        >
                            <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                                <stat.icon className={stat.color} size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-slate-900 leading-none mb-1">{stat.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-tight">Getting Started</h2>
                    <p className="text-slate-600 text-sm max-w-2xl font-medium leading-relaxed mb-6">
                        Welcome to the IEEE Student Branch administration portal. Use the sidebar to manage events, 
                        update executive committee members, and track event registrations. All changes you make 
                        here will be reflected on the public website immediately.
                    </p>
                    <div className="flex gap-4">
                        <div className="h-1 w-16 bg-ieee-blue rounded-full" />
                        <div className="h-1 w-8 bg-slate-100 rounded-full" />
                        <div className="h-1 w-4 bg-slate-100 rounded-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}

// Since I'm using cn in the component, I need to import it
import { cn } from '@/lib/utils';

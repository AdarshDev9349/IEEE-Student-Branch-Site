'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/Badge';
import { deleteRegistration } from '@/app/actions/registrations';
import { Database } from '@/types/supabase';
import { 
    Search, 
    FileDown, 
    Trash2, 
    Users, 
    User, 
    Mail, 
    Phone, 
    ChevronDown, 
    ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RegistrationsTableProps {
    soloRegistrations: Database['public']['Tables']['solo_registrations']['Row'][];
    teamRegistrations: Database['public']['Tables']['team_registrations']['Row'][];
}

type JoinEvent = { events: { title: string } | null };
type SoloReg = Database['public']['Tables']['solo_registrations']['Row'] & { type: 'solo' } & JoinEvent;
type TeamReg = Database['public']['Tables']['team_registrations']['Row'] & { type: 'team' } & JoinEvent;
type AugmentedRegistration = SoloReg | TeamReg;

export function RegistrationsTable({ soloRegistrations, teamRegistrations }: RegistrationsTableProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'solo' | 'team'>('all');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const allRegistrations: AugmentedRegistration[] = [
        ...soloRegistrations.map(r => ({ ...r, type: 'solo' } as SoloReg)),
        ...teamRegistrations.map(r => ({ ...r, type: 'team' } as TeamReg))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const filtered = allRegistrations.filter(reg => {
        const matchesType = typeFilter === 'all' || reg.type === typeFilter;
        
        const name = reg.type === 'solo' ? reg.full_name : reg.team_name;
        const email = reg.type === 'solo' ? reg.email : reg.team_lead_email;

        const matchesSearch = (name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                             (email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const toggleRow = (id: string) => {
        const next = new Set(expandedRows);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedRows(next);
    };

    const handleDelete = async (type: 'solo' | 'team', id: string) => {
        if (!confirm('Are you sure you want to delete this registration?')) return;
        const res = await deleteRegistration(type, id);
        if (res.success) {
            router.refresh();
        }
    };

    const exportToCSV = () => {
        const headers = ['Type', 'Name/Team', 'Email', 'WhatsApp', 'College', 'Event'];
        const rows = filtered.map(reg => {
            return [
                reg.type,
                reg.type === 'solo' ? reg.full_name : reg.team_name,
                reg.type === 'solo' ? reg.email : reg.team_lead_email,
                reg.whatsapp,
                reg.college,
                reg.events?.title || 'N/A'
            ].map(val => `"${String(val).replace(/"/g, '""')}"`);
        });
        
        const csvContent = "\uFEFF" + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `registrations_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-center border border-slate-200 shadow-sm">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ieee-blue/20 focus:border-ieee-blue transition-all"
                    />
                </div>
                
                <div className="flex bg-slate-50 p-1.5 rounded-xl w-full lg:w-auto border border-slate-200">
                    {(['all', 'solo', 'team'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={cn(
                                "flex-1 px-8 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                                typeFilter === t ? 'bg-white text-ieee-blue shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={exportToCSV}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 w-full lg:w-auto"
                >
                    <FileDown size={16} />
                    Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Participant</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Event & College</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((reg) => (
                                <tr key={reg.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 group-hover:text-ieee-blue transition-colors shrink-0">
                                                {reg.type === 'solo' ? <User size={18} /> : <Users size={18} />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 mb-1 leading-tight">
                                                    {reg.type === 'solo' ? reg.full_name : reg.team_name}
                                                </div>
                                                <Badge variant="secondary" className="uppercase text-[8px] tracking-widest">{reg.type}</Badge>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-slate-700 mb-1 leading-tight">{reg.events?.title || 'N/A'}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reg.college}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <Mail size={12} className="text-slate-300" />
                                                {reg.type === 'solo' ? reg.email : reg.team_lead_email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <Phone size={12} className="text-slate-300" />
                                                {reg.whatsapp}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => toggleRow(reg.id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all"
                                            >
                                                {expandedRows.has(reg.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(reg.type as 'solo' | 'team', reg.id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Expanded Row Content (Team Members) */}
            <AnimatePresence>
                {Array.from(expandedRows).map(id => {
                    const reg = allRegistrations.find(r => r.id === id);
                    if (!reg || reg.type !== 'team') return null;
                    const members = reg.members as unknown as { name: string; email: string; ieeeId?: string }[];
                    
                    return (
                        <motion.div 
                            key={`expanded-${id}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mt-2 overflow-hidden"
                        >
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Team Members</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {members?.map((member, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-sm font-bold text-slate-900 mb-1">{member.name}</div>
                                        <div className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{member.email}</div>
                                        {member.ieeeId && (
                                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-[9px] font-bold text-slate-300 uppercase">IEEE ID</span>
                                                <span className="text-[10px] font-bold text-ieee-blue">{member.ieeeId}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
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
        if (!confirm('PERMANENTLY PURGE THIS RECORD FROM ARCHIVES?')) return;
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
            <div className="nm-raised rounded-[2.5rem] p-6 flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <Input 
                        placeholder="IDENTIFY ATTENDEE OR TEAM..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-14 nm-inset border-none bg-black/40"
                    />
                </div>
                
                <div className="flex bg-black/40 nm-inset p-1.5 rounded-2xl w-full lg:w-auto">
                    {(['all', 'solo', 'team'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                typeFilter === t ? 'bg-ieee-blue text-white shadow-lg' : 'text-white/20 hover:text-white/40'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <Button variant="secondary" onClick={exportToCSV} className="w-full lg:w-auto">
                    <FileDown size={14} className="mr-2" />
                    EXPORT DATA
                </Button>
            </div>

            {/* Table */}
            <div className="nm-raised rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Entity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Deployment Target</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Credentials</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">Sequence</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filtered.map((reg) => (
                                <tr key={reg.id} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black/40 nm-inset flex items-center justify-center text-ieee-blue/60 group-hover:text-ieee-blue transition-colors">
                                                {reg.type === 'solo' ? <User size={18} /> : <Users size={18} />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white mb-1">
                                                    {reg.type === 'solo' ? reg.full_name : reg.team_name}
                                                </div>
                                                <Badge variant="ghost">{reg.type}</Badge>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-white/60 mb-1">{reg.events?.title || 'N/A'}</div>
                                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{reg.college}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                                                <Mail size={12} />
                                                {reg.type === 'solo' ? reg.email : reg.team_lead_email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                                                <Phone size={12} />
                                                {reg.whatsapp}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => toggleRow(reg.id)}
                                                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/20 hover:text-white transition-all nm-flat"
                                            >
                                                {expandedRows.has(reg.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(reg.type as 'solo' | 'team', reg.id)}
                                                className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
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
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="nm-inset rounded-3xl p-8 bg-black/20 mt-4 mx-8"
                        >
                            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Syndicate Members</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {members?.map((member, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="text-xs font-bold text-white mb-2">{member.name}</div>
                                        <div className="text-[10px] font-bold text-white/30 truncate uppercase tracking-widest">{member.email}</div>
                                        {member.ieeeId && <div className="text-[9px] font-bold text-ieee-blue/60 mt-2">ID: {member.ieeeId}</div>}
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

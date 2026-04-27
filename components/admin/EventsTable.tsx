'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';
import { toggleEventActive, deleteEvent } from '@/app/actions/events';
import { type EventInput } from '@/lib/validations/events';
import { AddEventForm } from './AddEventForm';
import { 
    Edit2, 
    Trash2, 
    Calendar,
    MapPin,
    ExternalLink,
    Plus,
    Eye,
    EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function EventsTable({ initialEvents, adminSecret }: { initialEvents: Database['public']['Tables']['events']['Row'][]; adminSecret: string }) {
    const router = useRouter();
    const [events, setEvents] = useState(initialEvents);
    const [isAdding, setIsAdding] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Database['public']['Tables']['events']['Row'] | null>(null);

    const handleToggle = async (id: string, current: boolean) => {
        const res = await toggleEventActive(adminSecret, id, current);
        if (res.success) {
            setEvents(prev => prev.map(e => e.id === id ? { ...e, is_active: !current } : e));
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event? All registration data will be lost.')) return;
        const res = await deleteEvent(adminSecret, id);
        if (res.success) {
            setEvents(prev => prev.filter(e => e.id !== id));
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#0A0A0A] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Protocol <span className="text-ieee-blue">Repository</span></h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-1">{events.length} Deployments Active</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-ieee-blue text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-ieee-blue/20 hover:bg-ieee-blue/90 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={16} />
                    New Deployment
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {(isAdding || editingEvent) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => { setIsAdding(false); setEditingEvent(null); }} />
                    <div className="relative w-full max-w-2xl bg-[#0F0F0F] rounded-[2.5rem] border border-white/10 p-10 shadow-3xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-tight">{editingEvent ? 'Modify Protocol' : 'Initialize Protocol'}</h3>
                        <AddEventForm 
                            adminSecret={adminSecret} 
                            onComplete={() => { 
                                setIsAdding(false); 
                                setEditingEvent(null); 
                                router.refresh();
                                // We keep the local state sync if needed, but router.refresh handles it for server-side data
                            }} 
                            initialData={editingEvent ? {
                                title: editingEvent.title,
                                date: editingEvent.date,
                                location: editingEvent.location,
                                description: editingEvent.description,
                                is_active: editingEvent.is_active,
                                category: editingEvent.category as EventInput['category'],
                                event_type: editingEvent.event_type as EventInput['event_type'],
                                points: editingEvent.points,
                                poster_url: editingEvent.poster_url || '',
                                whatsapp_link: editingEvent.whatsapp_link || '',
                                min_team_size: editingEvent.min_team_size || 1,
                                max_team_size: editingEvent.max_team_size || 1,
                                id: editingEvent.id
                            } : undefined}
                        />
                    </div>
                </div>
            )}

            <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Live</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Event Specifications</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Logistics</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-white/20 font-medium italic uppercase tracking-widest text-[10px]">No deployment logs found.</td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="px-8 py-8 lg:py-6 align-top">
                                            <button 
                                                onClick={() => handleToggle(event.id, event.is_active)}
                                                className={cn(
                                                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border",
                                                    event.is_active 
                                                        ? "bg-ieee-blue/10 border-ieee-blue/20 text-ieee-blue shadow-[0_0_15px_rgba(0,115,174,0.1)]" 
                                                        : "bg-white/5 border-white/5 text-white/20"
                                                )}
                                            >
                                                {event.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </td>
                                        <td className="px-8 py-8 lg:py-6 align-top">
                                            <div className="font-bold text-white text-base mb-1 group-hover:text-ieee-blue transition-colors font-heading tracking-tight uppercase">{event.title}</div>
                                            <p className="text-white/40 text-xs line-clamp-2 max-w-sm font-medium leading-relaxed">{event.description}</p>
                                        </td>
                                        <td className="px-8 py-8 lg:py-6 align-top space-y-3">
                                            <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-wider">
                                                <Calendar size={14} className="text-ieee-blue" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-wider">
                                                <MapPin size={14} className="text-ieee-blue" />
                                                {event.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 lg:py-6 text-right align-top">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => setEditingEvent(event)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                                                    title="Modify"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <Link 
                                                    href={`/events/${event.id}/register`}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/40 hover:text-ieee-blue hover:bg-ieee-blue/10 transition-all border border-transparent hover:border-ieee-blue/10"
                                                    title="View Form"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(event.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-red-400/5 text-red-400/30 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/10"
                                                    title="Purge"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

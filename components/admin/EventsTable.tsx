'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Calendar, MapPin, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { toggleEventActive, deleteEvent } from '@/app/actions/events';
import { AddEventForm } from './AddEventForm';
import { Database } from '@/types/supabase';
import { EventInput } from '@/lib/validations/events';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function EventsTable({ initialEvents, adminSecret }: { initialEvents: Database['public']['Tables']['events']['Row'][]; adminSecret: string }) {
    const router = useRouter();
    const [events, setEvents] = useState(initialEvents);
    const [isAdding, setIsAdding] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Database['public']['Tables']['events']['Row'] | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const filteredEvents = events.filter(e => 
        categoryFilter === 'all' || e.category === categoryFilter
    );

    const handleToggle = async (id: string, current: boolean) => {
        const res = await toggleEventActive(adminSecret, id, current);
        if (res.success) {
            setEvents(prev => prev.map(e => e.id === id ? { ...e, is_active: !current } : e));
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        const res = await deleteEvent(adminSecret, id);
        if (res.success) {
            setEvents(prev => prev.filter(e => e.id !== id));
            router.refresh();
        }
    };

    const categories = ['all', 'technical', 'workshop', 'session', 'cultural', 'sports', 'esports', 'others'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-6">
                <div className="w-full lg:w-auto">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Active <span className="text-ieee-blue">Events</span></h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{events.length} Total Events</p>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar border border-slate-200">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={cn(
                                "px-5 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shrink-0",
                                categoryFilter === cat ? 'bg-white text-ieee-blue shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-ieee-blue text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-ieee-blue/20 hover:bg-ieee-blue/90 transition-all active:scale-95 w-full lg:w-auto"
                >
                    <Plus size={16} />
                    Add Event
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {(isAdding || editingEvent) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => { setIsAdding(false); setEditingEvent(null); }} />
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                        <AddEventForm 
                            adminSecret={adminSecret} 
                            onComplete={() => { 
                                setIsAdding(false); 
                                setEditingEvent(null);
                                window.location.reload(); 
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

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Visibility</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Event Details</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Location & Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-300 font-medium italic uppercase tracking-widest text-[10px]">No events found.</td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 align-top">
                                            <button 
                                                onClick={() => handleToggle(event.id, event.is_active)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                                                    event.is_active 
                                                        ? "bg-ieee-blue/10 border-ieee-blue/20 text-ieee-blue" 
                                                        : "bg-slate-50 border-slate-200 text-slate-300"
                                                )}
                                            >
                                                {event.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 align-top">
                                            <div className="font-bold text-slate-900 text-base mb-1 group-hover:text-ieee-blue transition-colors tracking-tight uppercase">{event.title}</div>
                                            <p className="text-slate-400 text-xs line-clamp-1 max-w-sm font-medium">{event.description}</p>
                                        </td>
                                        <td className="px-8 py-6 align-top space-y-2">
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                <Calendar size={14} className="text-ieee-blue/60" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                <MapPin size={14} className="text-ieee-blue/60" />
                                                {event.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right align-top">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setEditingEvent(event)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-ieee-blue hover:border-ieee-blue/20 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <Link 
                                                    href={`/events/${event.id}/register`}
                                                    target="_blank"
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-ieee-blue hover:border-ieee-blue/20 transition-all"
                                                    title="View"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(event.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
                                                    title="Delete"
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

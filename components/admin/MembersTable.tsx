'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddMemberForm } from './AddMemberForm';
import { deleteMember } from '@/app/actions/execom';
import { Database } from '@/types/supabase';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    User,
    ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SocialLinks } from '@/app/data/execom';

export function MembersTable({ initialMembers, adminSecret }: { initialMembers: Database['public']['Tables']['execom']['Row'][]; adminSecret: string }) {
    const router = useRouter();
    const [members, setMembers] = useState(initialMembers);
    const [isAdding, setIsAdding] = useState(false);
    const [editingMember, setEditingMember] = useState<Database['public']['Tables']['execom']['Row'] | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        const res = await deleteMember(adminSecret, id);
        if (res.success) {
            setMembers(prev => prev.filter(m => m.id !== id));
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Execom <span className="text-ieee-blue">Members</span></h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{members.length} Active Members</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ieee-blue text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-ieee-blue/20 hover:bg-ieee-blue/90 transition-all active:scale-95"
                >
                    <Plus size={16} />
                    Add Member
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {(isAdding || editingMember) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => { setIsAdding(false); setEditingMember(null); }} />
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight">{editingMember ? 'Edit Profile' : 'Add New Member'}</h3>
                        <AddMemberForm 
                            adminSecret={adminSecret} 
                            onComplete={() => { 
                                setIsAdding(false); 
                                setEditingMember(null); 
                                router.refresh();
                            }} 
                            initialData={editingMember || undefined}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Profile</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Role & Team</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Links</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-300 font-medium italic uppercase tracking-widest text-[10px]">No members found.</td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center relative overflow-hidden shrink-0">
                                                    {member.avatar_url ? (
                                                        <Image src={member.avatar_url} alt={member.name} fill className="object-cover" />
                                                    ) : (
                                                        <User size={18} className="text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-base group-hover:text-ieee-blue transition-colors tracking-tight uppercase leading-tight">{member.name}</div>
                                                    <div className="text-slate-400 text-[10px] font-bold font-mono tracking-tighter uppercase mt-0.5">{member.member_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 align-top">
                                            <div className="font-semibold text-slate-700 text-sm leading-tight uppercase tracking-wide">{member.role}</div>
                                            <div className="text-ieee-blue text-[9px] font-bold uppercase tracking-widest mt-1.5 px-2 py-0.5 bg-ieee-blue/5 border border-ieee-blue/10 rounded-lg inline-block">{member.team}</div>
                                        </td>
                                        <td className="px-8 py-6 align-top">
                                            <div className="flex items-center gap-4 pt-1">
                                                {(member.socials as SocialLinks)?.linkedin && (
                                                    <a href={(member.socials as SocialLinks).linkedin} target="_blank" className="text-slate-300 hover:text-ieee-blue transition-all" title="LinkedIn">
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                                    </a>
                                                )}
                                                {(member.socials as SocialLinks)?.github && (
                                                    <a href={(member.socials as SocialLinks).github} target="_blank" className="text-slate-300 hover:text-slate-900 transition-all" title="GitHub">
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right align-top">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setEditingMember(member)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-ieee-blue hover:border-ieee-blue/20 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <Link 
                                                    href={`/execom/${member.id}`}
                                                    target="_blank"
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-ieee-blue hover:border-ieee-blue/20 transition-all"
                                                    title="View"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(member.id)}
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

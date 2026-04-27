'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddMemberForm } from './AddMemberForm';
import { deleteMember } from '@/app/actions/execom';
import { Database } from '../../types/supabase';
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
        if (!confirm('Are you sure you want to remove this member from the Execom?')) return;
        const res = await deleteMember(adminSecret, id);
        if (res.success) {
            setMembers(prev => prev.filter(m => m.id !== id));
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center nm-raised p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Personnel <span className="text-ieee-blue">Director</span></h2>
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">{members.length} Active Operatives</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-ieee-blue text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-ieee-blue/20 hover:bg-ieee-blue/90 transition-all hover:-translate-y-1 active:scale-95"
                >
                    <Plus size={14} />
                    Enroll Member
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {(isAdding || editingMember) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => { setIsAdding(false); setEditingMember(null); }} />
                    <div className="relative w-full max-w-2xl bg-[#0F0F0F] rounded-[2.5rem] border border-white/10 p-10 shadow-3xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-tight">{editingMember ? 'Update Profile' : 'Enroll Personnel'}</h3>
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

            <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Profile</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Affiliation</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Connectivity</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-white/20 font-medium italic uppercase tracking-widest text-[10px]">No personnel records found.</td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="px-8 py-8 lg:py-6 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-ieee-blue/10 border border-ieee-blue/20 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(0,115,174,0.15)] transition-all">
                                                    {member.avatar_url ? (
                                                        <Image src={member.avatar_url} alt={member.name} fill className="object-cover" />
                                                    ) : (
                                                        <User size={24} className="text-ieee-blue" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-base group-hover:text-ieee-blue transition-colors font-heading tracking-tight uppercase">{member.name}</div>
                                                    <div className="text-white/30 text-[10px] font-bold font-mono tracking-tighter uppercase mt-0.5">{member.member_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 lg:py-6 align-top">
                                            <div className="font-semibold text-white/80 text-sm leading-tight uppercase tracking-wide">{member.role}</div>
                                            <div className="text-ieee-blue/60 text-[10px] font-bold uppercase tracking-widest mt-2 px-2 py-0.5 bg-ieee-blue/5 border border-ieee-blue/10 rounded-full inline-block">{member.team}</div>
                                        </td>
                                        <td className="px-8 py-8 lg:py-6 align-top">
                                            <div className="flex items-center gap-5">
                                                {(member.socials as SocialLinks)?.linkedin && (
                                                    <a 
                                                        href={(member.socials as SocialLinks).linkedin} 
                                                        target="_blank" 
                                                        className="text-white/20 hover:text-ieee-blue transition-all hover:scale-110"
                                                        title="LinkedIn"
                                                    >
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                                    </a>
                                                )}
                                                {(member.socials as SocialLinks)?.github && (
                                                    <a 
                                                        href={(member.socials as SocialLinks).github} 
                                                        target="_blank" 
                                                        className="text-white/20 hover:text-white transition-all hover:scale-110"
                                                        title="GitHub"
                                                    >
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                                    </a>
                                                )}
                                                {(member.socials as SocialLinks)?.instagram && (
                                                    <a 
                                                        href={(member.socials as SocialLinks).instagram} 
                                                        target="_blank" 
                                                        className="text-white/20 hover:text-[#E4405F] transition-all hover:scale-110"
                                                        title="Instagram"
                                                    >
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 lg:py-6 text-right align-top">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => setEditingMember(member)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                                                    title="Modify Profile"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <Link 
                                                    href={`/execom/${member.id}`}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/40 hover:text-ieee-blue hover:bg-ieee-blue/10 transition-all border border-transparent hover:border-ieee-blue/10"
                                                    title="View Profile"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(member.id)}
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

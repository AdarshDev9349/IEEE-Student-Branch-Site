'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema, type MemberInput } from '@/lib/validations/events';
import { Database } from '@/types/supabase';
import { createMember, updateMember } from '@/app/actions/execom';
import { uploadImageAction } from '@/app/actions/upload';
import { cn } from '@/lib/utils';
import { Loader2, UploadCloud, Plus, X, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import Image from 'next/image';

export function AddMemberForm({ 
    adminSecret, 
    onComplete, 
    initialData 
}: { 
    adminSecret: string; 
    onComplete: () => void; 
    initialData?: Database['public']['Tables']['execom']['Row'] 
}) {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.avatar_url || null);
    const isEdit = !!initialData;

    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, setValue } = useForm<MemberInput>({
        resolver: zodResolver(memberSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            member_id: initialData.member_id,
            role: initialData.role,
            team: initialData.team,
            avatar_url: initialData.avatar_url || '',
            socials: (initialData.socials as unknown as MemberInput['socials']) || { linkedin: '', github: '', instagram: '' }
        } : {
            name: '',
            member_id: '',
            role: '',
            team: 'Executive Committee',
            avatar_url: '',
            socials: { linkedin: '', github: '', instagram: '' }
        }
    });

    const avatarUrlField = watch('avatar_url');

    // Handle file selection and preview
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (avatarUrlField) {
            setPreviewUrl(avatarUrlField);
        } else if (!initialData?.avatar_url) {
            setPreviewUrl(null);
        }
    }, [file, avatarUrlField, initialData?.avatar_url]);

    const onSubmit = async (data: MemberInput) => {
        setServerError(null);
        setSuccess(false);
        let finalAvatarUrl = data.avatar_url;

        try {
            if (file) {
                // Validate file size (e.g., 2MB for profile pics)
                if (file.size > 2 * 1024 * 1024) {
                    setServerError('IMAGE TOO LARGE. MAXIMUM SIZE IS 2MB.');
                    return;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('bucket', 'ieee-storage');
                
                const uploadRes = await uploadImageAction(adminSecret, formData);
                if (uploadRes.error) {
                    setServerError(uploadRes.error);
                    return;
                }
                finalAvatarUrl = uploadRes.url;
            }

            const payload = memberSchema.parse({ ...data, avatar_url: finalAvatarUrl });

            const res = isEdit 
                ? await updateMember(adminSecret, initialData.id, payload)
                : await createMember(adminSecret, payload);
            
            if (res?.error) {
                setServerError(res.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    reset();
                    onComplete();
                }, 1500);
            }
        } catch (err) {
            setServerError('AN UNEXPECTED ERROR OCCURRED DURING ENROLLMENT.');
            console.error(err);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-ieee-blue/10 rounded-[2rem] flex items-center justify-center border border-ieee-blue/20 mb-6 shadow-lg shadow-ieee-blue/5">
                    <CheckCircle2 className="text-ieee-blue" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Personnel Updated</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Syncing records...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-white text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <Input 
                    label="Identity Name"
                    placeholder="ADARSH DEV"
                    {...register('name')}
                    error={errors.name?.message}
                    className="uppercase tracking-wide font-heading"
                />

                {/* Member ID */}
                <Input 
                    label="Registry Credential (IEEE ID)"
                    placeholder="IEEE-2024-001"
                    {...register('member_id')}
                    error={errors.member_id?.message}
                    className="font-mono text-ieee-blue/80"
                />

                {/* Role */}
                <Input 
                    label="Administrative Role"
                    placeholder="CHAIRPERSON"
                    {...register('role')}
                    error={errors.role?.message}
                    className="uppercase tracking-widest font-bold"
                />

                {/* Team */}
                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Strategic Department</label>
                    <div className="relative">
                        <select
                            {...register('team')}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-ieee-blue/50 outline-none transition-all appearance-none cursor-pointer font-bold uppercase tracking-[0.1em] text-white/80"
                        >
                            <option value="Executive Committee" className="bg-[#111]">Executive Committee</option>
                            <option value="Technical Team" className="bg-[#111]">Technical Team</option>
                            <option value="Operations Team" className="bg-[#111]">Operations Team</option>
                            <option value="Content Team" className="bg-[#111]">Content Team</option>
                            <option value="Design Team" className="bg-[#111]">Design Team</option>
                            <option value="Publicity Team" className="bg-[#111]">Publicity Team</option>
                            <option value="Social Media Team" className="bg-[#111]">Social Media Team</option>
                            <option value="Link Media Team" className="bg-[#111]">Link Media Team</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                            <Plus size={14} className="rotate-45" />
                        </div>
                    </div>
                </div>

                {/* Socials - LinkedIn */}
                <Input 
                    label="Professional Link (LinkedIn)"
                    placeholder="HTTPS://LINKEDIN.COM/IN/..."
                    {...register('socials.linkedin')}
                    error={errors.socials?.linkedin?.message}
                    className="font-mono text-xs"
                />

                {/* Socials - GitHub */}
                <Input 
                    label="Resource Link (GitHub)"
                    placeholder="HTTPS://GITHUB.COM/..."
                    {...register('socials.github')}
                    error={errors.socials?.github?.message}
                    className="font-mono text-xs"
                />

                {/* Socials - Instagram */}
                <Input 
                    label="Persona Link (Instagram)"
                    placeholder="HTTPS://INSTAGRAM.COM/..."
                    {...register('socials.instagram')}
                    error={errors.socials?.instagram?.message}
                    className="font-mono text-xs"
                />

                {/* Avatar URL / Upload */}
                <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Personnel Avatar Asset</label>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            ) : (
                                <User size={32} className="text-white/10" />
                            )}
                            {previewUrl && (
                                <button 
                                    type="button" 
                                    onClick={() => { setFile(null); setPreviewUrl(null); setValue('avatar_url', ''); }}
                                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <label className="relative w-full group cursor-pointer">
                                <div className={cn(
                                    "w-full bg-white/5 border border-dashed rounded-2xl px-5 py-6 text-sm transition-all flex flex-col items-center justify-center gap-2 font-bold uppercase tracking-[0.2em]",
                                    file 
                                        ? "border-ieee-blue text-ieee-blue bg-ieee-blue/5" 
                                        : "border-white/10 text-white/30 group-hover:border-ieee-blue/50 group-hover:text-ieee-blue/50 group-hover:bg-white/[0.02]"
                                )}>
                                    <UploadCloud size={20} className={cn("transition-transform group-hover:-translate-y-1", file ? "text-ieee-blue" : "text-white/20")} />
                                    <span className="text-[8px]">{file ? file.name : "DEPOSIT IMAGE (MAX 2MB)"}</span>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFile(e.target.files[0]);
                                            setServerError(null);
                                        }
                                    }}
                                />
                            </label>
                            
                            {!file && (
                                <Input 
                                    placeholder="OR HTTPS://EXTERNAL-SOURCE.JPG"
                                    {...register('avatar_url')}
                                    className="font-mono text-[10px]"
                                    error={errors.avatar_url?.message}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {serverError && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] flex items-center gap-3 animate-pulse">
                    <AlertTriangle size={14} />
                    COMMUNICATION ERROR: {serverError}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 pt-6">
                <Button
                    variant="secondary"
                    type="button"
                    onClick={onComplete}
                    className="flex-1 order-2 md:order-1"
                >
                    ABORT
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    isLoading={isSubmitting}
                    className="flex-[2] order-1 md:order-2"
                >
                    {isEdit ? 'COMMIT UPDATES' : 'ENROLL PERSONNEL'}
                </Button>
            </div>
        </form>
    );
}

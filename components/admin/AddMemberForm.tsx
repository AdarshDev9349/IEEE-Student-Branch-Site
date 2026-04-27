'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema, type MemberInput } from '@/lib/validations/events';
import { Database } from '@/types/supabase';
import { createMember, updateMember } from '@/app/actions/execom';
import { uploadImageAction } from '@/app/actions/upload';
import { cn } from '@/lib/utils';
import { UploadCloud, X, CheckCircle2, AlertTriangle, User, ChevronDown } from 'lucide-react';
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
        let finalAvatarUrl = data.avatar_url;

        try {
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    setServerError('IMAGE TOO LARGE (MAX 2MB)');
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
            setServerError('AN UNEXPECTED ERROR OCCURRED');
            console.error(err);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100 mb-6">
                    <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Success</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Personnel Records Updated</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Identity Name"
                    placeholder="e.g. Adarsh Dev"
                    {...register('name')}
                    error={errors.name?.message}
                    className="font-heading"
                />

                <Input 
                    label="IEEE Member ID"
                    placeholder="e.g. IEEE-2024-001"
                    {...register('member_id')}
                    error={errors.member_id?.message}
                    className="font-mono text-ieee-blue/80"
                />

                <Input 
                    label="Administrative Role"
                    placeholder="e.g. Chairperson"
                    {...register('role')}
                    error={errors.role?.message}
                />

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Strategic Department</label>
                    <div className="relative">
                        <select
                            {...register('team')}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-900 focus:border-ieee-blue/50 outline-none transition-all appearance-none cursor-pointer font-bold uppercase tracking-wider"
                        >
                            <option value="Executive Committee">Executive Committee</option>
                            <option value="Technical Team">Technical Team</option>
                            <option value="Operations Team">Operations Team</option>
                            <option value="Content Team">Content Team</option>
                            <option value="Design Team">Design Team</option>
                            <option value="Publicity Team">Publicity Team</option>
                            <option value="Social Media Team">Social Media Team</option>
                            <option value="Link Media Team">Link Media Team</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                <Input 
                    label="LinkedIn Profile"
                    placeholder="https://linkedin.com/in/..."
                    {...register('socials.linkedin')}
                    error={errors.socials?.linkedin?.message}
                    className="text-xs"
                />

                <Input 
                    label="GitHub Profile"
                    placeholder="https://github.com/..."
                    {...register('socials.github')}
                    error={errors.socials?.github?.message}
                    className="text-xs"
                />

                <Input 
                    label="Instagram Profile"
                    placeholder="https://instagram.com/..."
                    {...register('socials.instagram')}
                    error={errors.socials?.instagram?.message}
                    className="text-xs"
                />

                <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Personnel Avatar Asset</label>
                    
                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-white flex items-center justify-center shadow-sm">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            ) : (
                                <User size={28} className="text-slate-200" />
                            )}
                            {previewUrl && (
                                <button 
                                    type="button" 
                                    onClick={() => { setFile(null); setPreviewUrl(null); setValue('avatar_url', ''); }}
                                    className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <label className="relative w-full group cursor-pointer">
                                <div className={cn(
                                    "w-full bg-white border border-dashed rounded-xl px-5 py-4 text-[10px] transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest shadow-sm",
                                    file 
                                        ? "border-ieee-blue text-ieee-blue bg-ieee-blue/5" 
                                        : "border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500"
                                )}>
                                    <UploadCloud size={16} className={cn("transition-transform group-hover:-translate-y-0.5", file ? "text-ieee-blue" : "text-slate-300")} />
                                    <span>{file ? file.name : "Upload Image Asset"}</span>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setFile(e.target.files[0]);
                                        setServerError(null);
                                    }
                                }} />
                            </label>
                            
                            {!file && (
                                <Input 
                                    placeholder="OR HTTPS://EXTERNAL-SOURCE.JPG"
                                    {...register('avatar_url')}
                                    className="text-[10px] h-10"
                                    error={errors.avatar_url?.message}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {serverError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-3">
                    <AlertTriangle size={16} />
                    ERROR: {serverError}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 pt-6">
                <Button variant="outline" type="button" onClick={onComplete} className="flex-1 order-2 md:order-1">Cancel</Button>
                <Button variant="primary" type="submit" isLoading={isSubmitting} className="flex-[2] order-1 md:order-2">
                    {isEdit ? 'Save Changes' : 'Enroll Personnel'}
                </Button>
            </div>
        </form>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventInput } from '@/lib/validations/events';
import { createEvent, updateEvent } from '@/app/actions/events';
import { uploadImageAction } from '@/app/actions/upload';
import { cn } from '@/lib/utils';
import { UploadCloud, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import Image from 'next/image';

import { z } from 'zod';

export function AddEventForm({ 
    adminSecret, 
    onComplete, 
    initialData 
}: { 
    adminSecret: string; 
    onComplete: () => void; 
    initialData?: EventInput & { id?: string };
}) {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.poster_url || null);
    const isEdit = !!initialData?.id;

    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, setValue } = useForm<z.input<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: initialData || {
            title: '',
            date: '',
            location: '',
            description: '',
            is_active: true,
            poster_url: '',
            whatsapp_link: '',
            category: 'technical',
            event_type: 'solo',
            min_team_size: 1,
            max_team_size: 1,
            points: 0,
        }
    });

    const eventType = watch('event_type');
    const description = watch('description') || '';
    const posterUrlField = watch('poster_url');

    // Handle file selection and preview
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (posterUrlField) {
            setPreviewUrl(posterUrlField);
        } else if (!initialData?.poster_url) {
            setPreviewUrl(null);
        }
    }, [file, posterUrlField, initialData?.poster_url]);

    const onSubmit = async (data: z.input<typeof eventSchema>) => {
        setServerError(null);
        setSuccess(false);
        let finalPosterUrl = data.poster_url;

        try {
            if (file) {
                // Validate file size (e.g., 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setServerError('IMAGE TOO LARGE. MAXIMUM SIZE IS 5MB.');
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
                finalPosterUrl = uploadRes.url;
            }

            const payload = { ...data, poster_url: finalPosterUrl };
            const res = isEdit 
                ? await updateEvent(adminSecret, initialData.id!, payload)
                : await createEvent(adminSecret, payload);
            
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
            setServerError('AN UNEXPECTED ERROR OCCURRED DURING DEPLOYMENT.');
            console.error(err);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 mb-6 shadow-lg shadow-emerald-500/5">
                    <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Deployment Successful</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Redirecting to repository...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <Input 
                    label="Event Title"
                    placeholder="ENTER EVENT NAME"
                    error={errors.title?.message as string}
                    {...register('title')}
                    className="md:col-span-2 font-heading uppercase tracking-wide"
                />

                {/* Category & Type */}
                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Event Category</label>
                    <select 
                        {...register('category')}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-ieee-blue/50 outline-none transition-all text-white font-bold uppercase tracking-wider appearance-none cursor-pointer"
                    >
                        <option value="technical" className="bg-[#111]">Technical</option>
                        <option value="workshop" className="bg-[#111]">Workshop</option>
                        <option value="session" className="bg-[#111]">Session</option>
                        <option value="cultural" className="bg-[#111]">Cultural</option>
                        <option value="sports" className="bg-[#111]">Sports</option>
                        <option value="esports" className="bg-[#111]">e-Sports</option>
                        <option value="others" className="bg-[#111]">Others</option>
                    </select>
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Engagement Type</label>
                    <div className="flex bg-black/40 nm-inset p-1.5 rounded-2xl border border-white/5">
                        {(['solo', 'team'] as const).map((t) => (
                            <label key={t} className={cn(
                                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-center cursor-pointer transition-all rounded-xl",
                                eventType === t ? "bg-ieee-blue text-white shadow-lg" : "text-white/20 hover:text-white/40"
                            )}>
                                <input type="radio" value={t} {...register('event_type')} className="hidden" />
                                {t}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Team Sizes (Conditional) */}
                {eventType === 'team' && (
                    <>
                        <Input 
                            label="Min Team Size"
                            type="number"
                            {...register('min_team_size', { valueAsNumber: true })}
                            error={errors.min_team_size?.message as string}
                            className="font-mono"
                        />
                        <Input 
                            label="Max Team Size"
                            type="number"
                            {...register('max_team_size', { valueAsNumber: true })}
                            error={errors.max_team_size?.message as string}
                            className="font-mono"
                        />
                    </>
                )}

                {/* Points */}
                <Input 
                    label="Participation XP (Points)"
                    type="number"
                    placeholder="E.G. 100"
                    {...register('points', { valueAsNumber: true })}
                    error={errors.points?.message as string}
                    className="font-mono text-ieee-blue/80"
                />

                {/* Date */}
                <Input 
                    label="Calendar Date"
                    type="date"
                    {...register('date')}
                    error={errors.date?.message as string}
                    className="uppercase tracking-widest text-xs"
                />

                {/* Location */}
                <Input 
                    label="Physical Location"
                    placeholder="MAIN AUDITORIUM"
                    {...register('location')}
                    error={errors.location?.message as string}
                    className="md:col-span-2 uppercase font-medium"
                />

                {/* Description */}
                <div className="space-y-2.5 md:col-span-2">
                    <div className="flex justify-between items-end ml-1">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Contextual Description</label>
                        <span className={cn(
                            "text-[8px] font-bold tracking-widest uppercase",
                            description.length > 1900 ? "text-red-400" : "text-white/20"
                        )}>
                            {description.length} / 2000
                        </span>
                    </div>
                    <textarea
                        {...register('description')}
                        placeholder="PROVIDE EVENT SPECIFICATIONS..."
                        rows={4}
                        className={cn(
                            "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-ieee-blue/50 outline-none transition-all resize-none placeholder:text-white/10 font-medium leading-relaxed text-white",
                            errors.description && "border-red-500/50"
                        )}
                    />
                    {errors.description?.message && <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-wider ml-1">{errors.description.message as string}</p>}
                </div>

                {/* Poster Asset */}
                <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Visual Asset</label>
                    
                    {previewUrl && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mb-2 group">
                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button" 
                                    onClick={() => { setFile(null); setPreviewUrl(null); setValue('poster_url', ''); }}
                                    className="p-3 bg-red-500 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <label className="relative w-full group cursor-pointer">
                            <div className={cn(
                                "w-full nm-inset rounded-2xl px-5 py-8 text-sm transition-all flex flex-col items-center justify-center gap-3 font-bold uppercase tracking-widest",
                                file ? "text-ieee-blue border border-ieee-blue/30 bg-ieee-blue/5" : "text-white/10 group-hover:text-white/30 group-hover:bg-white/[0.02]"
                            )}>
                                <UploadCloud size={24} className={cn("transition-transform group-hover:-translate-y-1", file ? "text-ieee-blue" : "text-white/20")} />
                                <span className="text-[10px]">{file ? file.name : "DEPOSIT IMAGE FILE (MAX 5MB)"}</span>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                    const selected = e.target.files?.[0];
                                    if (selected) {
                                        setFile(selected);
                                        setServerError(null);
                                    }
                                }}
                            />
                        </label>

                        {!file && (
                            <>
                                <div className="flex items-center gap-4 px-2">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.4em] shrink-0">OR PROVIDE LINK</div>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <Input 
                                    placeholder="HTTPS://EXTERNAL-SOURCE.JPG"
                                    {...register('poster_url')}
                                    className="font-mono text-xs"
                                    error={errors.poster_url?.message as string}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* WhatsApp */}
                <Input 
                    label="Community Gateway (WhatsApp)"
                    placeholder="HTTPS://CHAT.WHATSAPP.COM/..."
                    {...register('whatsapp_link')}
                    className="md:col-span-2 font-mono text-xs"
                    error={errors.whatsapp_link?.message as string}
                />
            </div>

            {serverError && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] flex items-center gap-3 animate-pulse">
                    <AlertTriangle size={14} />
                    SYSTEM BREACH: {serverError}
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
                    {isEdit ? 'COMMIT UPDATES' : 'DEPLOY PROTOCOL'}
                </Button>
            </div>
        </form>
    );
}

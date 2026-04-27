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
        let finalPosterUrl = data.poster_url;

        try {
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    setServerError('IMAGE TOO LARGE (MAX 5MB)');
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

            const payload = eventSchema.parse({ ...data, poster_url: finalPosterUrl });
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
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Data Synchronized Successfully</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Event Title"
                    placeholder="Enter event name"
                    error={errors.title?.message as string}
                    {...register('title')}
                    className="md:col-span-2 font-heading"
                />

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Event Category</label>
                    <select 
                        {...register('category')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-900 focus:border-ieee-blue/50 outline-none transition-all font-bold uppercase tracking-wider appearance-none cursor-pointer"
                    >
                        <option value="technical">Technical</option>
                        <option value="workshop">Workshop</option>
                        <option value="session">Session</option>
                        <option value="cultural">Cultural</option>
                        <option value="sports">Sports</option>
                        <option value="esports">e-Sports</option>
                        <option value="others">Others</option>
                    </select>
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Engagement Type</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {(['solo', 'team'] as const).map((t) => (
                            <label key={t} className={cn(
                                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest text-center cursor-pointer transition-all rounded-lg",
                                eventType === t ? "bg-white text-ieee-blue shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                            )}>
                                <input type="radio" value={t} {...register('event_type')} className="hidden" />
                                {t}
                            </label>
                        ))}
                    </div>
                </div>

                {eventType === 'team' && (
                    <>
                        <Input 
                            label="Min Team Size"
                            type="number"
                            {...register('min_team_size', { valueAsNumber: true })}
                            error={errors.min_team_size?.message as string}
                        />
                        <Input 
                            label="Max Team Size"
                            type="number"
                            {...register('max_team_size', { valueAsNumber: true })}
                            error={errors.max_team_size?.message as string}
                        />
                    </>
                )}

                <Input 
                    label="Participation XP"
                    type="number"
                    placeholder="e.g. 100"
                    {...register('points', { valueAsNumber: true })}
                    error={errors.points?.message as string}
                />

                <Input 
                    label="Calendar Date"
                    type="date"
                    {...register('date')}
                    error={errors.date?.message as string}
                />

                <Input 
                    label="Location"
                    placeholder="e.g. Main Auditorium"
                    {...register('location')}
                    error={errors.location?.message as string}
                    className="md:col-span-2"
                />

                <div className="space-y-2.5 md:col-span-2">
                    <div className="flex justify-between items-end ml-1">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Contextual Description</label>
                        <span className="text-[8px] font-bold tracking-widest uppercase text-slate-300">
                            {description.length} / 2000
                        </span>
                    </div>
                    <textarea
                        {...register('description')}
                        placeholder="Provide event specifications..."
                        rows={4}
                        className={cn(
                            "w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-900 focus:border-ieee-blue/50 outline-none transition-all resize-none placeholder:text-slate-300 font-medium leading-relaxed",
                            errors.description && "border-red-300"
                        )}
                    />
                    {errors.description?.message && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.description.message as string}</p>}
                </div>

                <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Visual Asset</label>
                    
                    {previewUrl && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 mb-2 group">
                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button" 
                                    onClick={() => { setFile(null); setPreviewUrl(null); setValue('poster_url', ''); }}
                                    className="p-3 bg-red-500 rounded-xl text-white shadow-xl hover:scale-110 transition-transform"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <label className="relative w-full group cursor-pointer">
                            <div className={cn(
                                "w-full bg-slate-50 border-2 border-dashed rounded-xl px-5 py-10 text-sm transition-all flex flex-col items-center justify-center gap-3 font-bold uppercase tracking-widest",
                                file ? "text-ieee-blue border-ieee-blue/30 bg-ieee-blue/5" : "text-slate-300 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-400 group-hover:bg-slate-100"
                            )}>
                                <UploadCloud size={32} className={cn("transition-transform group-hover:-translate-y-1", file ? "text-ieee-blue" : "text-slate-300")} />
                                <span className="text-[10px]">{file ? file.name : "Upload Image Asset (Max 5MB)"}</span>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const selected = e.target.files?.[0];
                                if (selected) {
                                    setFile(selected);
                                    setServerError(null);
                                }
                            }} />
                        </label>

                        {!file && (
                            <>
                                <div className="flex items-center gap-4 px-2">
                                    <div className="h-px flex-1 bg-slate-100" />
                                    <div className="text-slate-200 text-[9px] font-black uppercase tracking-[0.3em] shrink-0">OR PROVIDE LINK</div>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>
                                <Input 
                                    placeholder="https://external-source.jpg"
                                    {...register('poster_url')}
                                    className="text-xs"
                                    error={errors.poster_url?.message as string}
                                />
                            </>
                        )}
                    </div>
                </div>

                <Input 
                    label="WhatsApp Community Link"
                    placeholder="https://chat.whatsapp.com/..."
                    {...register('whatsapp_link')}
                    className="md:col-span-2 text-xs"
                    error={errors.whatsapp_link?.message as string}
                />
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
                    {isEdit ? 'Save Changes' : 'Initialize Protocol'}
                </Button>
            </div>
        </form>
    );
}

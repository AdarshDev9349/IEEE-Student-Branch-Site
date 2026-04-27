'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationInput } from '@/lib/validations/registration';
import { registerForEvent } from '@/app/actions/registrations';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function RegistrationForm({ event }: { event: { id: string, title: string } }) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegistrationInput>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            eventId: event.id,
            yearOfStudy: '1'
        }
    });

    const onSubmit = async (data: RegistrationInput) => {
        setStatus('submitting');
        const result = await registerForEvent(data);
        
        if (result.error) {
            setStatus('error');
            setMessage(result.error);
        } else {
            setStatus('success');
            setMessage(`Successfully registered for ${event.title}! See you there.`);
        }
    };

    if (status === 'success') {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-green-50 rounded-3xl border border-green-100"
            >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-ieee-black mb-2">Registration Confirmed!</h2>
                <p className="text-ieee-black/70 mb-8">{message}</p>
                <Link href="/events" className="text-ieee-blue font-semibold hover:underline">
                    Back to Events
                </Link>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ieee-black/50 ml-1">Full Name</label>
                    <input
                        {...register('fullName')}
                        placeholder="John Doe"
                        className={cn(
                            "w-full px-5 py-3.5 rounded-2xl border bg-white/50 focus:ring-2 focus:ring-ieee-blue/20 outline-none transition-all",
                            errors.fullName ? "border-red-300 bg-red-50/10" : "border-ieee-black/10 focus:border-ieee-blue"
                        )}
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ieee-black/50 ml-1">Email Address</label>
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="john@example.com"
                        className={cn(
                            "w-full px-5 py-3.5 rounded-2xl border bg-white/50 focus:ring-2 focus:ring-ieee-blue/20 outline-none transition-all",
                            errors.email ? "border-red-300 bg-red-50/10" : "border-ieee-black/10 focus:border-ieee-blue"
                        )}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.email.message}</p>}
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ieee-black/50 ml-1">WhatsApp Number</label>
                    <input
                        {...register('whatsapp')}
                        placeholder="+91 9876543210"
                        className={cn(
                            "w-full px-5 py-3.5 rounded-2xl border bg-white/50 focus:ring-2 focus:ring-ieee-blue/20 outline-none transition-all",
                            errors.whatsapp ? "border-red-300 bg-red-50/10" : "border-ieee-black/10 focus:border-ieee-blue"
                        )}
                    />
                    {errors.whatsapp && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.whatsapp.message}</p>}
                </div>

                {/* College */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ieee-black/50 ml-1">College</label>
                    <input
                        {...register('college')}
                        placeholder="University College of Engineering Kariavattom"
                        className={cn(
                            "w-full px-5 py-3.5 rounded-2xl border bg-white/50 focus:ring-2 focus:ring-ieee-blue/20 outline-none transition-all",
                            errors.college ? "border-red-300 bg-red-50/10" : "border-ieee-black/10 focus:border-ieee-blue"
                        )}
                    />
                    {errors.college && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.college.message}</p>}
                </div>

                {/* Department */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ieee-black/50 ml-1">Department</label>
                    <input
                        {...register('department')}
                        placeholder="Information Technology"
                        className={cn(
                            "w-full px-5 py-3.5 rounded-2xl border bg-white/50 focus:ring-2 focus:ring-ieee-blue/20 outline-none transition-all",
                            errors.department ? "border-red-300 bg-red-50/10" : "border-ieee-black/10 focus:border-ieee-blue"
                        )}
                    />
                    {errors.department && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.department.message}</p>}
                </div>

                {/* Year */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ieee-black/50 ml-1">Year of Study</label>
                    <select
                        {...register('yearOfStudy')}
                        className="w-full px-5 py-3.5 rounded-2xl border border-ieee-black/10 bg-white/50 focus:border-ieee-blue focus:ring-2 focus:ring-ieee-blue/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                    </select>
                </div>

                {/* IEEE ID */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ieee-black/50 ml-1">IEEE Member ID (Optional)</label>
                    <input
                        {...register('ieeeId')}
                        placeholder="98765432"
                        className="w-full px-5 py-3.5 rounded-2xl border border-ieee-black/10 bg-white/50 focus:border-ieee-blue focus:ring-2 focus:ring-ieee-blue/20 outline-none transition-all"
                    />
                </div>
            </div>

            {status === 'error' && (
                <p className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                    {message}
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className={cn(
                    "w-full py-4 rounded-2xl bg-ieee-blue text-white font-bold text-lg shadow-xl shadow-ieee-blue/20 transition-all active:scale-[0.98]",
                    status === 'submitting' ? "opacity-70 cursor-not-allowed" : "hover:bg-ieee-blue/90 hover:-translate-y-1"
                )}
            >
                {status === 'submitting' ? 'Processing...' : 'Complete Registration'}
            </button>
        </form>
    );
}

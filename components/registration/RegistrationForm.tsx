'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationInput } from '@/lib/validations/registration';
import { registerAction } from '@/app/actions/registrations';
import { SoloFields } from './SoloFields';
import { TeamFields } from './TeamFields';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    ArrowRight, 
    ChevronLeft, 
    Sparkles, 
    School
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegistrationFormProps {
    event: {
        id: string;
        title: string;
        event_type: 'solo' | 'team';
        category: string;
        min_team_size?: number;
        max_team_size?: number;
    };
}

export function RegistrationForm({ event }: RegistrationFormProps) {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const methods = useForm<RegistrationInput>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            registrationType: event.event_type,
            eventId: event.id,
            members: event.event_type === 'team' ? [{ name: '', email: '', ieeeId: '' }] : [],
            yearOfStudy: '1',
            college: '',
            department: '',
        }
    });

    const { handleSubmit, trigger, watch, formState: { isSubmitting } } = methods;
    const registrationType = watch('registrationType');

    const nextStep = async () => {
        // We cast these to a union of keys that exist in BOTH members of the RegistrationInput union
        const fieldsToValidate = ['college', 'department', 'yearOfStudy'] as const;
        
        const isValid = await trigger(fieldsToValidate as unknown as Parameters<typeof trigger>[0]);
        if (isValid) setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const onSubmit = async (data: RegistrationInput) => {
        setStatus('idle');
        const res = await registerAction(data);
        if (res.success) {
            setStatus('success');
        } else {
            setStatus('error');
            setErrorMessage(res.error || 'Registration sequence failure.');
        }
    };

    if (status === 'success') {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-emerald-500/5 nm-inset rounded-[3rem] border border-emerald-500/20"
            >
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                    <CheckCircle2 size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Registration <span className="text-emerald-400">Locked</span></h2>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                    Your entry has been synchronized with our records. Ensure you join the command group for upcoming directives.
                </p>
            </motion.div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 group">
                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-4 mb-2">
                    {[1, 2].map((s) => (
                        <div 
                            key={s} 
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                step === s ? "w-12 bg-ieee-blue shadow-lg shadow-ieee-blue/30" : "w-4 bg-white/10"
                            )}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-[10px] font-black text-ieee-blue uppercase tracking-[0.4em] mb-2 flex items-center justify-center gap-2">
                                    <School size={14} /> Phase 01/02
                                </h3>
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Base <span className="opacity-40">Intelligence</span></h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input 
                                    label="Institution Information"
                                    placeholder="COLLEGE / UNIVERSITY NAME"
                                    {...methods.register('college')}
                                    error={methods.formState.errors.college?.message as string}
                                    className="md:col-span-2"
                                />
                                <Input 
                                    label="Faculty / Department"
                                    placeholder="E.G. DATA SCIENCE"
                                    {...methods.register('department')}
                                    error={methods.formState.errors.department?.message as string}
                                />
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Current Year</label>
                                    <select 
                                        {...methods.register('yearOfStudy')}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-ieee-blue/50 outline-none transition-all text-white font-medium appearance-none"
                                    >
                                        <option value="1">First Year</option>
                                        <option value="2">Second Year</option>
                                        <option value="3">Third Year</option>
                                        <option value="4">Fourth Year</option>
                                    </select>
                                </div>
                            </div>

                            <Button onClick={nextStep} type="button" className="w-full py-5 text-xs">
                                CONTINUE TO ATTENDEE DATA
                                <ArrowRight size={14} className="ml-3" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <button type="button" onClick={prevStep} className="p-3 bg-white/5 nm-raised-sm rounded-xl text-white/30 hover:text-white transition-all">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="text-right">
                                    <h3 className="text-[10px] font-black text-ieee-blue uppercase tracking-[0.4em] mb-1">Phase 02/02</h3>
                                    <h2 className="text-xl font-black text-white tracking-tight uppercase">
                                        Attendee <span className="opacity-40">Matrix</span>
                                    </h2>
                                </div>
                            </div>

                            {registrationType === 'solo' ? <SoloFields /> : <TeamFields />}

                            {status === 'error' && (
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                                    INTERRUPTION: {errorMessage}
                                </p>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full py-5 text-xs" 
                                isLoading={isSubmitting}
                            >
                                <Sparkles size={14} className="mr-3" />
                                CONFIRM REGISTRATION
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </FormProvider>
    );
}

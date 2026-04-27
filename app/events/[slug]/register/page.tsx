import { fetchLatestEvents } from '@/app/data/events';
import { RegistrationForm } from '@/components/registration/RegistrationForm';
import { notFound } from 'next/navigation';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const allEvents = await fetchLatestEvents();
    const event = allEvents.find(e => e.id === slug || e.title.toLowerCase().replace(/\s+/g, '-') === slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-ieee-blue/5 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-ieee-blue/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ieee-blue/10 border border-ieee-blue/20 text-ieee-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        <ShieldCheck size={12} /> Secure Entry Portal
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6">
                        Nexus <span className="text-ieee-blue">Registration</span>
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">
                        <span className="flex items-center gap-2">
                             Target: <span className="text-white">{event.title}</span>
                        </span>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
                        <span className="flex items-center gap-2">
                             Type: <span className="text-white">{event.event_type}</span>
                        </span>
                    </div>
                </div>

                <div className="nm-raised rounded-[3rem] p-8 md:p-16 border border-white/5 bg-black/40 backdrop-blur-xl">
                    <RegistrationForm event={event} />
                </div>

                <div className="mt-12 text-center">
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        <Sparkles size={14} className="text-ieee-blue" />
                        By proceeding, you agree to the IEEE Protocol and Code of Conduct
                    </p>
                </div>
            </div>
        </div>
    );
}

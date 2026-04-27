'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/actions/auth';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

export function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const res = await loginAdmin(password);
        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else {
            window.location.reload(); // Refresh to trigger server-side auth check
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6 selection:bg-ieee-blue/30">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-[#0A0A0A] p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
            >
                {/* Dynamic Ambient Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-ieee-blue/5 blur-[80px] rounded-full group-hover:bg-ieee-blue/10 transition-colors duration-1000" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-ieee-blue/5 blur-[80px] rounded-full group-hover:bg-ieee-blue/10 transition-colors duration-1000" />
                
                <div className="text-center mb-12 relative z-10">
                    <div className="w-20 h-20 bg-ieee-blue/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:border-ieee-blue/20 transition-all duration-500 shadow-inner">
                        <Lock className="text-ieee-blue/40 group-hover:text-ieee-blue transition-colors duration-500" size={32} strokeWidth={1} />
                    </div>
                    <h1 className="text-[10px] font-black text-ieee-blue uppercase tracking-[0.5em] mb-4">Secure Terminal</h1>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed px-8">Authorization required for administrative deployment</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                    <div className="space-y-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="PROTOCOL KEY"
                            className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-5 text-white placeholder:text-white/5 focus:border-ieee-blue/30 focus:bg-white/[0.04] outline-none transition-all text-center tracking-[0.5em] font-mono text-sm"
                            autoFocus
                        />
                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] text-red-500 font-black text-center uppercase tracking-widest"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full py-5 rounded-3xl bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] transition-all relative overflow-hidden group/btn active:scale-[0.97]",
                            loading ? "opacity-50 cursor-wait" : "hover:bg-ieee-blue hover:text-white hover:shadow-[0_20px_40px_rgba(0,115,174,0.15)] shadow-xl"
                        )}
                    >
                        <span className="relative z-10">
                            {loading ? 'Verifying Context...' : 'Initialize Session'}
                        </span>
                    </button>
                </form>

                <div className="mt-12 text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-20">
                        <div className="h-[1px] w-8 bg-white" />
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <div className="h-[1px] w-8 bg-white" />
                    </div>
                    <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.4em]">
                        IEEE SB UCEK Repository
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

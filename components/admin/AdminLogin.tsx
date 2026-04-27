'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/actions/auth';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

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
            window.location.reload(); 
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-6 selection:bg-ieee-blue/10">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden"
            >
                <div className="text-center mb-10 relative z-10">
                    <div className="w-16 h-16 bg-ieee-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-ieee-blue/20">
                        <ShieldCheck className="text-ieee-blue" size={28} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">Admin Login</h1>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Restricted Access Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div className="space-y-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Password"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:border-ieee-blue/30 focus:ring-4 focus:ring-ieee-blue/5 outline-none transition-all text-center font-medium"
                            autoFocus
                        />
                        {error && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-red-500 font-bold text-center"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full py-4 rounded-2xl bg-ieee-blue text-white font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden active:scale-95 shadow-lg shadow-ieee-blue/20",
                            loading ? "opacity-50 cursor-wait" : "hover:bg-ieee-blue/90"
                        )}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 text-center relative z-10">
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        IEEE SB UCEK • Secure Gateway
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

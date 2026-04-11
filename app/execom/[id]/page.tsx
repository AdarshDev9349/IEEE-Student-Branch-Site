"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchMemberById, ExecomMember } from "../../data/execom";

export default function DigitalIdCard() {
  const params = useParams();
  const id = params?.id as string;

  const [member, setMember] = useState<ExecomMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadMember = async () => {
      const data = await fetchMemberById(id);
      setMember(data);
      setLoading(false);
    };
    loadMember();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ieee-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ieee-white"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-ieee-black flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl text-ieee-white font-bold mb-4">ID Card Invalid</h1>
        <p className="text-ieee-white/60 mb-8">The digital credential you are looking for does not exist or has expired.</p>
        <Link href="/execom" className="px-6 py-2 bg-ieee-blue text-ieee-white rounded-full font-bold">
          Return to Directory
        </Link>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const socialVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 0.8 + (i * 0.1), duration: 0.4, type: "spring", stiffness: 200 }
    })
  };

  return (
  
  <div className="min-h-screen bg-ieee-black pt-24 pb-20 px-4 md:px-8 flex items-center justify-center overflow-hidden relative">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-ieee-blue rounded-full blur-[150px] opacity-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-ieee-blue rounded-full blur-[120px] opacity-10" />
    </div>

    <div className="max-w-sm w-full relative z-10 flex flex-col items-center">
      {/* Back link */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="self-start mb-8">
        <Link href="/execom" className="inline-flex items-center text-ieee-white/60 hover:text-ieee-white transition-colors text-sm font-medium">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Directory Search
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 40, scale: 0.92 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } } }}
        initial="hidden"
        animate="visible"
        className="w-full relative"
        style={{ paddingTop: "52px" }}
      >
        {/* Floating avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 20 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-[104px] h-[104px] rounded-full border-[5px] border-ieee-white bg-ieee-black shadow-xl overflow-hidden flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-ieee-blue/30 to-ieee-blue/60 flex items-center justify-center">
              <span className="text-4xl font-black text-ieee-white drop-shadow">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* White top section */}
        <div className="bg-ieee-white rounded-t-[2rem] pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-ieee-black leading-tight font-heading">
                {member.name.split(' ')[0]}<br />
                {member.name.split(' ').slice(1).join(' ')}
              </h1>
              <p className="text-ieee-black/40 text-[10px] font-bold mt-2 uppercase tracking-[0.18em]">
                {member.team}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="w-9 h-9 rounded-full bg-ieee-black/6 flex items-center justify-center">
                <svg className="w-5 h-5 text-ieee-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-ieee-black/40 text-[9px] font-black uppercase tracking-tight">IEEE SB 2024</span>
            </div>
          </div>
        </div>

        {/* Blue bottom section */}
        <div className="bg-ieee-blue rounded-b-[2rem] px-6 pt-4 pb-7">
          {/* Avatars + actions row */}
          <div className="flex items-center gap-2 mb-5">
            {Object.keys(member.socials).slice(0, 3).map((key, i) => (
              <motion.a
                key={key}
                href={(member.socials as any)[key]} target="_blank" rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.08, type: "spring", stiffness: 220 }}
                className="w-9 h-9 rounded-full bg-ieee-white/20 border-2 border-ieee-white/40 flex items-center justify-center text-ieee-white text-xs font-bold hover:bg-ieee-white/30 transition-colors"
              >
                {key.slice(0, 1).toUpperCase()}
              </motion.a>
            ))}
            <div className="w-9 h-9 rounded-full bg-ieee-white/10 border-2 border-dashed border-ieee-white/30 flex items-center justify-center text-ieee-white/60 text-lg leading-none">
              +
            </div>
            {/* Spacer + action buttons */}
            <div className="ml-auto flex gap-2">
              <button className="w-9 h-9 rounded-full bg-ieee-white/12 hover:bg-ieee-white/20 flex items-center justify-center text-ieee-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.101 1.101" />
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-ieee-black flex items-center justify-center text-ieee-white hover:scale-105 transition-transform shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-ieee-white/12 hover:bg-ieee-white/20 flex items-center justify-center text-ieee-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Label + heading */}
          <p className="text-ieee-white/50 text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5">Personality Data</p>
          <h2 className="text-ieee-white text-xl font-black font-heading mb-5">Digital ID</h2>

          {/* QR + details */}
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="bg-ieee-white rounded-2xl p-3 aspect-square flex items-center justify-center">
              <svg className="w-full h-full text-ieee-black" viewBox="0 0 100 100">
                <path fill="currentColor" d="M10,10 h30 v30 h-30 z M15,15 h20 v20 h-20 z M22,22 h6 v6 h-6 z M60,10 h30 v30 h-30 z M65,15 h20 v20 h-20 z M72,22 h6 v6 h-6 z M10,60 h30 v30 h-30 z M15,65 h20 v20 h-20 z M22,72 h6 v6 h-6 z M45,10 h10 v10 h-10 z M45,30 h10 v10 h-10 z M60,45 h10 v10 h-10 z M10,45 h10 v10 h-10 z M75,45 h15 v10 h-15 z M45,60 h10 v30 h-10 z M60,60 h10 v10 h-10 z M75,60 h15 v15 h-15 z M60,80 h30 v10 h-30 z" />
                <rect x="42" y="42" width="16" height="16" fill="#00629B" rx="2" />
              </svg>
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <div>
                <p className="text-ieee-white/50 text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5">ID Number</p>
                <p className="text-ieee-white font-bold text-base font-mono">{member.memberId.split('-').join('')}</p>
              </div>
              <div>
                <p className="text-ieee-white/50 text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5">Reference</p>
                <p className="text-ieee-white font-bold text-base">{member.role.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-ieee-white/50 text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5">Location</p>
                <p className="text-ieee-white font-bold text-base">Kerala, IN</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-ieee-white/10 flex justify-between items-center">
            <p className="text-ieee-white/30 text-[8px] font-black uppercase tracking-[0.3em]">IEEE SB UCEK 2024</p>
            <div className="flex items-center gap-1.5 bg-ieee-white/10 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-ieee-white/70 text-[8px] font-bold uppercase tracking-wide">Verified</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>

);}
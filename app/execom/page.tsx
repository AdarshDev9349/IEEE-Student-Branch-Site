"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { fetchAllExecomMembers, ExecomMember } from "../data/execom";

export default function ExecomDirectory() {
  const [members, setMembers] = useState<ExecomMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      const data = await fetchAllExecomMembers();
      setMembers(data);
      setLoading(false);
    };
    loadMembers();
  }, []);

  const teams = ['Core Committee', 'Technical Team', 'Operations Team', 'Content Team'];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-ieee-white pt-24 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-16 border-b border-ieee-black/10 pb-8 pt-4"
        >
          <Link href="/" className="inline-flex items-center text-ieee-blue hover:text-ieee-black transition-colors font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-ieee-black mb-4">
            Our <span className="text-ieee-blue">Executive Committee</span>
          </h1>
          <p className="text-lg text-ieee-black/70 font-medium max-w-2xl">
            Meet the dedicated leaders and talented teams driving our IEEE Student Branch forward.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ieee-blue"></div>
          </div>
        ) : (
          /* Grouped Members Directory */
          <div className="space-y-16">
            {members.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 uppercase tracking-tight">No members found</h3>
                <p className="text-slate-400 text-sm font-medium">The executive committee directory is currently being updated.</p>
              </div>
            ) : (
              teams.map((teamName) => {
                const teamMembers = members.filter(m => m.team === teamName);
                if (teamMembers.length === 0) return null;

                return (
                  <motion.section 
                    key={teamName}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-2xl font-bold text-ieee-black mb-8 border-l-4 border-ieee-blue pl-4">
                      {teamName}
                    </h2>
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                      {teamMembers.map(member => (
                        <Link href={`/execom/${member.id}`} key={member.id} className="group">
                          <motion.div 
                            variants={itemVariants}
                            className="relative bg-ieee-white border border-ieee-black/10 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center hover:-translate-y-2 overflow-hidden group"
                          >
                            
                            {/* Background Watermark */}
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                              <span className="text-6xl font-black font-heading">IEEE</span>
                            </div>

                            {/* Image Placeholder with ring effect */}
                            <div className="relative mb-8">
                              <div className="w-28 h-28 rounded-full bg-ieee-white border-2 border-ieee-black/5 shadow-inner flex items-center justify-center relative z-10 group-hover:border-ieee-blue/20 transition-colors">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ieee-blue/5 to-ieee-blue/20 flex items-center justify-center">
                                  <span className="text-3xl font-bold text-ieee-blue tracking-tighter">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              {/* Decorative ring */}
                              <div className="absolute inset-0 rounded-full border border-ieee-blue/20 scale-110 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </div>

                            <div className="relative z-10 w-full">
                              <h3 className="text-xl font-bold font-heading text-ieee-black mb-1 group-hover:text-ieee-blue transition-colors duration-300">
                                {member.name}
                              </h3>
                              <p className="text-sm font-semibold text-ieee-blue/80 uppercase tracking-widest mb-6">
                                {member.role}
                              </p>
                              
                              <div className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-ieee-black/5 text-[10px] uppercase tracking-[0.2em] font-black text-ieee-black/40 group-hover:bg-ieee-blue group-hover:text-ieee-white transition-all duration-300">
                                Digital Identity
                                <svg className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  </motion.section>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

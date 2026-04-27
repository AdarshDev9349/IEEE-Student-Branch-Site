"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { fetchLatestEvents, IeeeEvent } from "../data/events";

export default function EventsPage() {
  const [events, setEvents] = useState<IeeeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchLatestEvents();
        // Since we want ALL events here, we just use the entire array 
        // In the future this will be await supabase.from('events').select()
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

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
    <div className="w-full min-h-screen bg-ieee-white pt-24 pb-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 border-b border-ieee-black/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="inline-flex items-center text-ieee-blue hover:text-ieee-black transition-colors font-medium mb-6 mt-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-ieee-black mb-4">
              All IEEE <span className="text-ieee-blue">Events</span>
            </h1>
            <p className="text-base text-ieee-black/70 font-medium max-w-2xl">
              Browse our complete archive of upcoming workshops, hackathons, seminars, and networking symposiums.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="w-full flex items-center justify-center min-h-[400px]">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ieee-blue"></div>
          </div>
        ) : (
          /* Grid View */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 uppercase tracking-tight">No events found</h3>
                <p className="text-slate-400 text-sm font-medium">Check back later for new updates and opportunities.</p>
              </div>
            ) : (
              events.map((event) => (
                <motion.div 
                  key={event.id} 
                  variants={itemVariants}
                  className="group relative flex flex-col bg-ieee-white border border-ieee-black/10 rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full"
                >
                  
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden shrink-0 bg-ieee-black/5">
                    <Image 
                      src={event.posterSrc} 
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-ieee-white/95 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold text-ieee-blue shadow-lg">
                      {event.date}
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col flex-1 p-6 z-10 bg-ieee-white">
                    <h3 className="text-xl font-bold font-heading text-ieee-black mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-ieee-black/70 mb-6 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="mt-auto flex items-center text-ieee-black/60 text-sm font-medium pt-4 border-t border-ieee-black/5">
                      <svg className="w-4 h-4 mr-2 text-ieee-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}

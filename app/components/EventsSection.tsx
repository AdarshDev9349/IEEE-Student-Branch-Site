"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fetchLatestEvents, IeeeEvent } from "../data/events";

export default function EventsSection() {
  const [events, setEvents] = useState<IeeeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchLatestEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-ieee-white w-full border-t border-ieee-black/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-ieee-blue font-semibold animate-pulse">Loading latest events...</p>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-ieee-white w-full border-t border-ieee-black/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-ieee-black mb-4">
              Our Latest <span className="text-ieee-blue">Events</span>
            </h2>
            <p className="text-base text-ieee-black/70 font-medium">
              Discover the workshops, hackathons, and symposiums driving technological excellence at our Student Branch.
            </p>
          </div>
          <div>
            <Link 
              href="/events" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-ieee-blue text-ieee-white font-semibold transition-all hover:shadow-lg hover:shadow-ieee-blue/30 active:scale-95 whitespace-nowrap"
            >
              View All Events
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Variety Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          
          {/* Featured Event (Index 0) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 group relative overflow-hidden rounded-[2rem] bg-ieee-white border border-ieee-black/10 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[400px] md:min-h-[500px]"
          >
            <div className="absolute inset-0">
              <Image 
                src={events[0].posterSrc} 
                alt={events[0].title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ieee-black/90 via-ieee-black/40 to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end h-full">
              <div className="inline-block px-4 py-1.5 bg-ieee-blue text-ieee-white text-sm font-semibold rounded-full w-fit mb-4">
                {events[0].date}
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-ieee-white mb-3">
                {events[0].title}
              </h3>
              <p className="text-ieee-white/80 line-clamp-2 mb-4 md:mb-6 max-w-xl">
                {events[0].description}
              </p>
              <div className="flex items-center text-ieee-white/90 text-sm font-medium">
                <svg className="w-5 h-5 mr-2 text-ieee-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {events[0].location}
              </div>
            </div>
          </motion.div>

          {/* Secondary Events Stack (Index 1 & 2) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {events.slice(1, 3).map((event: IeeeEvent) => (
              <motion.div 
                key={event.id} 
                variants={itemVariants}
                className="group relative flex flex-col sm:flex-row bg-ieee-white border border-ieee-black/10 rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full"
              >
                
                {/* Image Container */}
                <div className="relative w-full h-[250px] sm:h-auto sm:w-2/5 overflow-hidden shrink-0">
                  <Image 
                    src={event.posterSrc} 
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ieee-black/60 to-transparent sm:hidden" />
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-1 p-6 z-10 bg-ieee-white">
                  <div className="text-sm font-semibold text-ieee-blue mb-2">
                    {event.date}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-ieee-black mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="mt-auto flex items-center text-ieee-black/60 text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}

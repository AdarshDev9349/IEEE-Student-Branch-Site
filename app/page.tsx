"use client"

import { motion } from "framer-motion"
import AboutSection from './components/AboutSection'
import EventsSection from './components/EventsSection'

const Page = () => {
  return (
    <main>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="sticky top-0 w-full h-screen overflow-hidden bg-ieee-black font-sans -z-10"
      >
          
          {/* Background Decorative Layer */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">

            {/* Ring 3 — outer, clockwise */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 animate-[spin_80s_linear_infinite]"
            >
              <div className="absolute top-1/2 left-1/2 w-[250vw] md:w-[150vw] xl:w-[1800px] aspect-square -translate-x-1/2 -translate-y-1/2 rotate-[279deg] z-0">
                <img
                  src="/rings/ring-outer.png"
                  alt=""
                  className="w-full h-full object-contain opacity-50"
                />
              </div>
            </motion.div>

            {/* Ring 2 — middle, counter-clockwise */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
              className="absolute inset-0 animate-[spin_65s_linear_infinite_reverse]"
            >
              <div className="absolute top-1/2 left-1/2 w-[166vw] md:w-[100vw] xl:w-[1200px] aspect-square -translate-x-1/2 -translate-y-1/2 rotate-[304deg] z-10">
                <img
                  src="/rings/ring-mid.png"
                  alt=""
                  className="w-full h-full object-contain opacity-60"
                />
              </div>
            </motion.div>

            {/* Ring 1 — inner, clockwise */}
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
              className="absolute inset-0 animate-[spin_40s_linear_infinite]"
            >
              <div className="absolute top-1/2 left-1/2 w-[83vw] md:w-[50vw] xl:w-[600px] aspect-square -translate-x-1/2 -translate-y-1/2 rotate-[48deg] z-20">
                <img
                  src="/rings/ring-inner.png"
                  alt=""
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
            </motion.div>
          </div>

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.8)_100%),linear-gradient(to_top,var(--ieee-black)_10%,rgba(0,0,0,0.4)_40%,transparent_100%)]" />

          {/* Content Container */}
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center  gap-6 px-4">
            
            {/* Title */}
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl md:text-7xl font-bold font-heading text-center tracking-tight text-ieee-white"
            >
              IEEE Student Branch
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl md:text-2xl font-semibold text-center text-ieee-white/90"
            >
              University College of Engineering Kariavattom
            </motion.p>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-sm md:text-lg text-center max-w-2xl mt-2 font-medium text-ieee-white/60"
            >
              Empowering students to innovate, collaborate, and excel. Joining hands to shape a better future for humanity through technological excellence.
            </motion.p>

            {/* Relatable Call to action rather than form */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8 flex flex-wrap gap-4 justify-center"
            >
              <button 
                className="px-8 py-3.5 rounded-full font-semibold text-ieee-white transition-all active:scale-95 hover:brightness-110 shadow-lg shadow-ieee-blue/20 bg-ieee-blue cursor-pointer"
              >
                Join the Community
              </button>
              <button 
                className="px-8 py-3.5 rounded-full font-semibold text-ieee-white transition-all active:scale-95 hover:bg-ieee-white/10 border border-ieee-white/20 cursor-pointer"
              >
                Discover Events
              </button>
            </motion.div>

          </div>
        </motion.div>
      

      {/* Wrapping the rest of the page in a relative overlapping context to glide over the sticky hero */}
      <div className="relative z-10 w-full bg-ieee-white">
        <AboutSection />
        <EventsSection />
      </div>
    </main>
  )
}

export default Page
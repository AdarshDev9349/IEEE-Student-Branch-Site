import { motion, Variants } from 'framer-motion';

const missions = [
  { id: '01', title: 'Advancing Technology', desc: 'Foster technological innovation and excellence in the advancement of humanity.' },
  { id: '02', title: 'Contribution to Science', desc: 'Contribute expanding scientific knowledge through continuous research and development.' },
  { id: '03', title: 'Humanitarian Activities', desc: 'Empower society through impactful humanitarian initiatives and community support.' },
  { id: '04', title: 'Women in Engineering', desc: 'Inspire women to pursue their academic interests and excel in their technology careers.' },
  { id: '05', title: 'Happiness of Volunteering', desc: 'Promote engaging and fulfilling volunteering activities within our community groups.' },
  { id: '06', title: 'Ethics & Social Implications', desc: 'Advocate for ethical behavior and the responsible, sustainable use of technology.' },
  { id: '07', title: 'Skill Development', desc: 'Equip individuals with versatile, practical skills to ensure they are job-ready.' },
];

export default function AboutSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <section className="bg-ieee-white py-24 lg:py-32 relative text-ieee-black z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Intro & Vision Split */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-stretch overflow-hidden">
          {/* Intro Text */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 flex flex-col justify-center"
          >
            <h2 className="text-sm font-bold text-ieee-blue tracking-widest uppercase mb-4">
              About Us
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              A vibrant community of creators, innovators, and future leaders.
            </h3>
            <div className="text-base md:text-lg text-ieee-black/80 leading-relaxed font-sans space-y-5">
              <p>
                IEEE SB UCEK is one of the most active IEEE communities in the Trivandrum Hub. Founded in 2022 by a dedicated team, we have cultivated a lively environment that has come a long way, repeatedly organizing remarkable events that shape our future.
              </p>
              <p>
                Around 50-100 new members join our hardworking family with immense dedication and enthusiasm every year. We inspire students to embark on their journey into the world of technology, with the unwavering potential to overcome obstacles, produce prominent professionals, and achieve many more monumental milestones.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:w-1/2 w-full bg-ieee-blue text-ieee-white p-10 md:p-14 rounded-[2rem] shadow-2xl shadow-ieee-blue/30 relative overflow-hidden flex flex-col justify-center"
          >
            {/* Background elements */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-ieee-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-ieee-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h4 className="text-2xl md:text-3xl font-bold font-heading mb-6 flex items-center gap-4">
                <span className="w-10 h-1.5 bg-ieee-white rounded-full block" /> 
                Our Vision
              </h4>
              <p className="leading-relaxed text-ieee-white/95 text-base md:text-lg font-sans space-y-4">
                <span className="block">
                  To lead the way in technological advancement and positively impact society for the betterment of humanity. We strive to cultivate individuals into successful professionals with outstanding skills, building a global innovative community.
                </span>
                <span className="block mt-4">
                  We recognize the true significance of diversity in STEM. By seamlessly integrating different perspectives, we inspire, enable, and empower student members to pioneer true innovation and problem-solving.
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bento Focus Grid */}
        <div className="mt-32">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-left max-w-3xl"
          >
            <h2 className="text-sm font-bold text-ieee-blue tracking-widest uppercase mb-4">
              Our Mission
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-ieee-black">
              Driving positive change through 7 core pillars
            </h3>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 group/bento"
          >
            {missions.map((mission, index) => {
              const bentoClasses = (() => {
                switch(index) {
                  case 0: return "col-span-2 lg:col-span-2 lg:row-span-2 bg-ieee-blue text-ieee-white";
                  case 1: return "col-span-1 lg:col-span-2 bg-ieee-white text-ieee-black border border-ieee-blue/20";
                  case 2: return "col-span-1 bg-ieee-blue text-ieee-white";
                  case 3: return "col-span-2 lg:col-span-1 bg-ieee-white text-ieee-black border border-ieee-blue/20";
                  case 4: return "col-span-1 lg:col-span-2 bg-ieee-blue text-ieee-white";
                  case 5: return "col-span-1 lg:col-span-2 bg-ieee-white text-ieee-black border border-ieee-blue/20";
                  case 6: return "col-span-2 lg:col-span-4 bg-ieee-blue text-ieee-white flex-col lg:flex-row items-start lg:items-center justify-between";
                  default: return "bg-ieee-white border border-ieee-blue/20 text-ieee-black";
                }
              })();

              const isDark = index % 2 === 0;
              const titleColor = isDark ? "text-ieee-white" : "text-ieee-black";
              const descColor = isDark ? "text-ieee-white/90" : "text-ieee-black/70";
              const numberColor = isDark ? "text-ieee-white/20" : "text-ieee-blue/10";
              const focusClasses = "transition-all duration-500 ease-out md:group-hover/bento:blur-[2px] md:group-hover/bento:opacity-50 md:group-hover/bento:scale-[0.98] hover:!blur-none hover:!opacity-100 hover:!scale-[1.02] md:hover:!scale-100 hover:z-10 md:hover:shadow-2xl";

              return (
                <motion.div
                  key={mission.id}
                  variants={itemVariants}
                  className={`p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] relative flex flex-col justify-end overflow-hidden cursor-pointer ${bentoClasses} ${focusClasses}`}
                >
                  <div className={`text-6xl md:text-7xl font-black ${numberColor} ${index === 6 ? 'lg:mb-0 mb-6 lg:mr-8' : 'mb-6 md:mb-12 relative lg:absolute lg:top-8 lg:right-10'}`}>
                    {mission.id}
                  </div>
                  
                  <div className={`relative z-10 mt-auto ${index === 6 ? 'max-w-4xl' : ''}`}>
                    <h4 className={`text-lg md:text-2xl font-bold font-heading mb-2 md:mb-4 leading-tight ${titleColor}`}>
                      {mission.title}
                    </h4>
                    <p className={`font-sans leading-snug text-xs md:text-base lg:text-lg ${descColor}`}>
                      {mission.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

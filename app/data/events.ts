export interface IeeeEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  posterSrc: string;
}

// Mock Database Service
// Easily swappable with Supabase, Firebase, or a custom API later.
export const fetchLatestEvents = async (): Promise<IeeeEvent[]> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      id: "evt-1",
      title: "Tech Innovation Summit 2026",
      date: "April 20, 2026",
      location: "Main Auditorium, UCEK",
      description: "Join us for a day of groundbreaking technology seminars, hands-on workshops, and networking with top engineers.",
      posterSrc: "/posters/IMG-20260405-WA0083.jpg"
    },
    {
      id: "evt-2",
      title: "AI & Machine Learning Bootcamp",
      date: "March 15, 2026",
      location: "Computer Lab 1",
      description: "A comprehensive bootcamp covering the fundamentals of Machine Learning algorithms and practical Neural Networks implementation.",
      posterSrc: "/posters/IMG-20260321-WA0188.jpg"
    },
    {
      id: "evt-3",
      title: "Code To Compile Hackathon",
      date: "February 28, 2026",
      location: "ECE Seminar Hall",
      description: "A 24-hour intense coding hackathon focusing on building practical technological solutions for sustainable development goals.",
      posterSrc: "/posters/IMG-20260310-WA0212.jpg"
    },
    {
      id: "evt-4",
      title: "Cyber Resilience Workshop",
      date: "January 14, 2026",
      location: "IT Block Labs",
      description: "Hands-on workshop focusing on modern cybersecurity threats, penetrating testing methodologies, and defensive network architecture.",
      posterSrc: "/posters/IMG-20260405-WA0089.jpg"
    },
    {
      id: "evt-5",
      title: "Women in Engineering Symposium",
      date: "November 10, 2025",
      location: "Main Auditorium, UCEK",
      description: "A panel discussion and networking event featuring prominent female leaders accelerating innovation in the tech industry.",
      posterSrc: "/posters/IMG-20260405-WA0087.jpg"
    },
    {
      id: "evt-6",
      title: "Web Development Masterclass",
      date: "October 05, 2025",
      location: "Virtual (Teams)",
      description: "Deep dive into full-stack modern web orchestration, covering Next.js, Postgres data architectures, and deploying heavily scaled apps.",
      posterSrc: "/posters/IMG-20250720-WA0037(1).jpg"
    }
  ];
};

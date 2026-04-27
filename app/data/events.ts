import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

export interface IeeeEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  posterSrc: string;
  category: 'technical' | 'cultural' | 'sports' | 'esports' | 'others';
  event_type: 'solo' | 'team';
  min_team_size?: number;
  max_team_size?: number;
  points: number;
}

type EventRow = Database['public']['Tables']['events']['Row'];

/**
 * Fetches the latest events from Supabase.
 * Falls back to mock data if environment variables are missing or DB is empty.
 */
export const fetchLatestEvents = async (): Promise<IeeeEvent[]> => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Falling back to mock events data");
      return MOCK_EVENTS;
    }

    return (data as EventRow[]).map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      description: e.description,
      posterSrc: e.poster_url || "/posters/placeholder.jpg",
      category: (e.category as IeeeEvent['category']) || 'others',
      event_type: e.event_type as 'solo' | 'team',
      min_team_size: e.min_team_size ?? undefined,
      max_team_size: e.max_team_size ?? undefined,
      points: e.points || 0
    }));
  } catch {
    return MOCK_EVENTS;
  }
};

const MOCK_EVENTS: IeeeEvent[] = [
  {
    id: "evt-1",
    title: "Tech Innovation Summit 2026",
    date: "April 20, 2026",
    location: "Main Auditorium, UCEK",
    description: "Join us for a day of groundbreaking technology seminars, hands-on workshops, and networking with top engineers.",
    posterSrc: "/posters/IMG-20260405-WA0083.jpg",
    category: 'technical',
    event_type: 'solo',
    points: 100
  },
  {
    id: "evt-2",
    title: "AI & Machine Learning Bootcamp",
    date: "March 15, 2026",
    location: "Computer Lab 1",
    description: "A comprehensive bootcamp covering the fundamentals of Machine Learning algorithms and practical Neural Networks implementation.",
    posterSrc: "/posters/IMG-20260321-WA0188.jpg",
    category: 'technical',
    event_type: 'solo',
    points: 150
  },
  {
    id: "evt-3",
    title: "Code To Compile Hackathon",
    date: "February 28, 2026",
    location: "ECE Seminar Hall",
    description: "A 24-hour intense coding hackathon focusing on building practical technological solutions for sustainable development goals.",
    posterSrc: "/posters/IMG-20260310-WA0212.jpg",
    category: 'technical',
    event_type: 'team',
    min_team_size: 2,
    max_team_size: 4,
    points: 200
  }
];

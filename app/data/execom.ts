import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  email?: string;
}

export interface ExecomMember {
  id: string;
  name: string;
  role: string;
  team: string;
  memberId: string;
  imageUrl?: string | null;
  socials: SocialLinks;
}

type ExecomRow = Database['public']['Tables']['execom']['Row'];

/**
 * Fetches all Execom members from Supabase.
 * Falls back to mock data if DB is empty or unconfigured.
 */
export const fetchAllExecomMembers = async (): Promise<ExecomMember[]> => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('execom')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_EXECOM;
    }

    return (data as ExecomRow[]).map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      team: m.team,
      memberId: m.member_id,
      imageUrl: m.avatar_url || null,
      socials: (m.socials as unknown as SocialLinks) || {}
    }));
  } catch {
    return MOCK_EXECOM;
  }
};

/**
 * Fetches a specific member for their Digital ID.
 */
export const fetchMemberById = async (id: string): Promise<ExecomMember | null> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('execom')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      // Fallback check in mock data
      return MOCK_EXECOM.find(m => m.id === id) || null;
    }

    const m = data as ExecomRow;
    return {
      id: m.id,
      name: m.name,
      role: m.role,
      team: m.team,
      memberId: m.member_id,
      imageUrl: m.avatar_url || null,
      socials: (m.socials as unknown as SocialLinks) || {}
    };
  } catch {
    return MOCK_EXECOM.find(m => m.id === id) || null;
  }
};

const MOCK_EXECOM: ExecomMember[] = [
  {
    id: "ex-chair-01",
    name: "Alex Varghese",
    role: "Chairperson",
    team: "Executive Committee",
    memberId: "IEEE-9021-X",
    socials: { linkedin: "https://linkedin.com", email: "alex@ieee.org" }
  },
  {
    id: "ex-sec-02",
    name: "Sarah Philip",
    role: "Secretary",
    team: "Executive Committee",
    memberId: "IEEE-9022-X",
    socials: { linkedin: "https://linkedin.com" }
  },
  {
    id: "ex-vce-03",
    name: "David Menon",
    role: "Vice Chair",
    team: "Executive Committee",
    memberId: "IEEE-9023-X",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" }
  }
];

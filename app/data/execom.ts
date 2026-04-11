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
  team: 'Core Committee' | 'Technical Team' | 'Operations Team' | 'Content Team';
  memberId: string;
  imageUrl?: string;
  socials: SocialLinks;
}

// Mock initial database
const EXECOM_MOCK_DATA: ExecomMember[] = [
  // Core Committee
  {
    id: "ex-chair-01",
    name: "Alex Varghese",
    role: "Chairperson",
    team: "Core Committee",
    memberId: "IEEE-9021-X",
    socials: { linkedin: "https://linkedin.com", email: "alex@ieee.org" }
  },
  {
    id: "ex-sec-02",
    name: "Sarah Philip",
    role: "Secretary",
    team: "Core Committee",
    memberId: "IEEE-9022-X",
    socials: { linkedin: "https://linkedin.com" }
  },
  {
    id: "ex-vce-03",
    name: "David Menon",
    role: "Vice Chair",
    team: "Core Committee",
    memberId: "IEEE-9023-X",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" }
  },
  // Tech Team
  {
    id: "ex-tech-01",
    name: "Maya Ramesh",
    role: "Tech Team Head",
    team: "Technical Team",
    memberId: "IEEE-8011-T",
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "ex-tech-02",
    name: "Kiran Thomas",
    role: "Lead Developer",
    team: "Technical Team",
    memberId: "IEEE-8012-T",
    socials: { github: "https://github.com" }
  },
  // Operations Team
  {
    id: "ex-ops-01",
    name: "Rahul Nair",
    role: "Operations Head",
    team: "Operations Team",
    memberId: "IEEE-7011-O",
    socials: { linkedin: "https://linkedin.com", instagram: "https://instagram.com" }
  },
  // Content Team
  {
    id: "ex-content-01",
    name: "Sneha Krishnan",
    role: "Content Lead",
    team: "Content Team",
    memberId: "IEEE-6011-C",
    socials: { instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
  }
];

export const fetchAllExecomMembers = async (): Promise<ExecomMember[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return EXECOM_MOCK_DATA;
};

export const fetchMemberById = async (id: string): Promise<ExecomMember | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const member = EXECOM_MOCK_DATA.find(m => m.id === id);
  return member || null;
};

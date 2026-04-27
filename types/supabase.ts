export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          date: string
          location: string
          description: string
          poster_url: string | null
          whatsapp_link: string | null
          is_active: boolean
          category: string
          event_type: 'solo' | 'team'
          min_team_size: number | null
          max_team_size: number | null
          points: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          date: string
          location: string
          description: string
          poster_url?: string | null
          whatsapp_link?: string | null
          is_active?: boolean
          category: string
          event_type: 'solo' | 'team'
          min_team_size?: number | null
          max_team_size?: number | null
          points: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          date?: string
          location?: string
          description?: string
          poster_url?: string | null
          whatsapp_link?: string | null
          is_active?: boolean
          category?: string
          event_type?: 'solo' | 'team'
          min_team_size?: number | null
          max_team_size?: number | null
          points?: number
        }
      }
      execom: {
        Row: {
          id: string
          created_at: string
          name: string
          member_id: string
          role: string
          team: string
          avatar_url: string | null
          socials: Json
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          member_id: string
          role: string
          team: string
          avatar_url?: string | null
          socials?: Json
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          member_id?: string
          role?: string
          team?: string
          avatar_url?: string | null
          socials?: Json
        }
      }
      solo_registrations: {
        Row: {
          id: string
          created_at: string
          event_id: string
          full_name: string
          email: string
          whatsapp: string
          college: string
          department: string
          year_of_study: string
          ieee_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          full_name: string
          email: string
          whatsapp: string
          college: string
          department: string
          year_of_study: string
          ieee_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          full_name?: string
          email?: string
          whatsapp?: string
          college?: string
          department?: string
          year_of_study?: string
          ieee_id?: string | null
        }
      }
      team_registrations: {
        Row: {
          id: string
          created_at: string
          event_id: string
          team_name: string
          team_lead_email: string
          whatsapp: string
          college: string
          department: string
          year_of_study: string
          members: Json
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          team_name: string
          team_lead_email: string
          whatsapp: string
          college: string
          department: string
          year_of_study: string
          members: Json
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          team_name?: string
          team_lead_email?: string
          whatsapp?: string
          college?: string
          department?: string
          year_of_study?: string
          members?: Json
        }
      }
    }
  }
}

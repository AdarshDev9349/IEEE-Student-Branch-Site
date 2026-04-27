import { createServerClient, type CookieOptions, type SupabaseClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export const createClient = (): SupabaseClient<Database> => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore;
          return cookie.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookie = await cookieStore;
            cookie.set({ name, value, ...options });
          } catch {
            // Handle server component limitations
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookie = await cookieStore;
            cookie.set({ name, value: '', ...options });
          } catch {
            // Handle server component limitations
          }
        },
      },
    }
  );
};

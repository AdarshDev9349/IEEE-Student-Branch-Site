import { createClient } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin/AdminNav';
import { cookies } from 'next/headers';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { RegistrationsTable } from '@/components/admin/RegistrationsTable';

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage({ params }: { params: Promise<{ segment: string }> }) {
    const { segment } = await params;
    const cookieStore = await cookies();
    const isAuth = cookieStore.get('admin_session')?.value === 'true';

    if (!isAuth) {
        return <AdminLogin />;
    }

    const supabase = createClient();
    
    // Fetch both types of registrations
    const [soloRes, teamRes] = await Promise.all([
        supabase.from('solo_registrations').select(`*, events ( title ) `).order('created_at', { ascending: false }),
        supabase.from('team_registrations').select(`*, events ( title ) `).order('created_at', { ascending: false })
    ]);

    if (soloRes.error) console.error('[SoloFetch] Error:', soloRes.error);
    if (teamRes.error) console.error('[TeamFetch] Error:', teamRes.error);

    return (
        <>
            <AdminNav segment={segment} />
            <main className="flex-1 p-6 md:p-10 md:ml-0 overflow-y-auto">
                <div className="max-w-7xl mx-auto pt-20 md:pt-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                            Nexus <span className="text-ieee-blue">Tracker</span>
                        </h1>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
                            Global auditory of individual and syndicate signups
                        </p>
                    </div>

                    <RegistrationsTable 
                        soloRegistrations={soloRes.data || []} 
                        teamRegistrations={teamRes.data || []} 
                    />
                </div>
            </main>
        </>
    );
}

import { createClient } from '@/lib/supabase/server';
import { RegistrationsTable } from '@/components/admin/RegistrationsTable';

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage({ params }: { params: Promise<{ segment: string }> }) {
    const { segment } = await params;
    const supabase = createClient();
    
    // Fetch both types of registrations
    const [soloRes, teamRes] = await Promise.all([
        supabase.from('solo_registrations').select(`*, events ( title ) `).order('created_at', { ascending: false }),
        supabase.from('team_registrations').select(`*, events ( title ) `).order('created_at', { ascending: false })
    ]);

    if (soloRes.error) console.error('[SoloFetch] Error:', soloRes.error.message);
    if (teamRes.error) console.error('[TeamFetch] Error:', teamRes.error.message);

    return (
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto pt-6 md:pt-0">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Event <span className="text-ieee-blue">Registrations</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        Track and export participant data for all events.
                    </p>
                </div>

                <RegistrationsTable 
                    soloRegistrations={soloRes.data || []} 
                    teamRegistrations={teamRes.data || []} 
                />
            </div>
        </main>
    );
}

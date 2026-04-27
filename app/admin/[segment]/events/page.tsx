import { createClient } from '@/lib/supabase/server';
import { EventsTable } from '@/components/admin/EventsTable';
import { AdminNav } from '@/components/admin/AdminNav';
import { cookies } from 'next/headers';
import { AdminLogin } from '@/components/admin/AdminLogin';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage({ params }: { params: Promise<{ segment: string }> }) {
    const { segment } = await params;
    const cookieStore = await cookies();
    const isAuth = cookieStore.get('admin_session')?.value === 'true';

    if (!isAuth) {
        return <AdminLogin />;
    }

    const supabase = createClient();
    
    // Fetch all events sorted by date
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[AdminEventsPage] Error:', error);
    }

    return (
        <>
            <AdminNav segment={segment} />
            <main className="flex-1 p-6 md:p-10 md:ml-0 overflow-y-auto">
                <div className="max-w-6xl mx-auto pt-20 md:pt-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Event <span className="text-ieee-blue">Protocol</span></h1>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Command center for all student branch deployments</p>
                    </div>

                    <EventsTable initialEvents={events || []} adminSecret={segment} />
                </div>
            </main>
        </>
    );
}

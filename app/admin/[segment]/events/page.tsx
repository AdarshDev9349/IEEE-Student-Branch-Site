import { createClient } from '@/lib/supabase/server';
import { EventsTable } from '@/components/admin/EventsTable';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage({ params }: { params: Promise<{ segment: string }> }) {
    const { segment } = await params;
    const supabase = createClient();
    
    // Fetch all events sorted by creation date
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[AdminEventsPage] Supabase Error Details:', {
            message: error.message,
            code: error.code,
            hint: error.hint,
            details: error.details
        });
    }

    return (
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-6xl mx-auto pt-6 md:pt-0">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Events <span className="text-ieee-blue">Management</span></h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Create and manage events for the student branch website.</p>
                </div>

                <EventsTable initialEvents={events || []} adminSecret={segment} />
            </div>
        </main>
    );
}

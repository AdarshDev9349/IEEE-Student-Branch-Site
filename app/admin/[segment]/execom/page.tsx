import { createClient } from '@/lib/supabase/server';
import { MembersTable } from '@/components/admin/MembersTable';

export const dynamic = 'force-dynamic';

export default async function AdminExecomPage({ params }: { params: Promise<{ segment: string }> }) {
    const { segment } = await params;
    const supabase = createClient();
    
    // Fetch all members
    const { data: members, error } = await supabase
        .from('execom')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('[AdminExecomPage] Supabase Error:', error.message);
    }

    return (
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-6xl mx-auto pt-6 md:pt-0">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Execom <span className="text-ieee-blue">Management</span></h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Manage executive committee members and their roles.</p>
                </div>

                <MembersTable initialMembers={members || []} adminSecret={segment} />
            </div>
        </main>
    );
}

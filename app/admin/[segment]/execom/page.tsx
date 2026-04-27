import { createClient } from '@/lib/supabase/server';
import { MembersTable } from '@/components/admin/MembersTable';
import { AdminNav } from '@/components/admin/AdminNav';
import { cookies } from 'next/headers';
import { AdminLogin } from '@/components/admin/AdminLogin';

export const dynamic = 'force-dynamic';

export default async function AdminExecomPage({ params }: { params: Promise<{ segment: string }> }) {
    const { segment } = await params;
    const cookieStore = await cookies();
    const isAuth = cookieStore.get('admin_session')?.value === 'true';

    if (!isAuth) {
        return <AdminLogin />;
    }

    const supabase = createClient();
    
    // Fetch all members
    const { data: members, error } = await supabase
        .from('execom')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('[AdminExecomPage] Error:', error);
    }

    return (
        <>
            <AdminNav segment={segment} />
            <main className="flex-1 p-6 md:p-10 md:ml-0 overflow-y-auto">
                <div className="max-w-6xl mx-auto pt-20 md:pt-10">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Execom <span className="text-ieee-blue">Director</span></h1>
                        <p className="text-white/40 text-sm mt-2 font-medium">Manage the personnel and leadership roles for the Student Branch.</p>
                    </div>

                    <MembersTable initialMembers={members || []} adminSecret={segment} />
                </div>
            </main>
        </>
    );
}

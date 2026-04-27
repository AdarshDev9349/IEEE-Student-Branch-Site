import { ReactNode } from 'react';
import { verifyAdminSegment } from '@/lib/admin-auth';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata = {
    title: 'Admin Dashboard | IEEE SB UCEK',
    robots: { index: false, follow: false },
};

interface LayoutProps {
    children: ReactNode;
    params: Promise<{ segment: string }>;
}

export default async function AdminLayout({
    children,
    params,
}: LayoutProps) {
    const { segment } = await params;
    const cookieStore = await cookies();
    const isAuth = cookieStore.get('admin_session')?.value === 'true';

    // Verify secret URL segment
    if (!verifyAdminSegment(segment)) {
        notFound();
    }

    // Handle authentication globally for the admin segment
    if (!isAuth) {
        return <AdminLogin />;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-ieee-blue/10 overflow-x-hidden">
            <div className="flex flex-row relative min-h-screen">
                <AdminNav segment={segment} />
                <div className="flex-1 min-w-0 flex flex-col">
                    {children}
                </div>
            </div>
        </div>
    );
}

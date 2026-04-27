import { ReactNode } from 'react';
import { verifyAdminSegment } from '@/lib/admin-auth';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Management Portal',
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

    // Layer 1: Secret URL Segment
    console.log("DEBUG [AUTH]: Attempting to verify segment:", segment);
    console.log("DEBUG [AUTH]: Expected segment from ENV:", process.env.ADMIN_PATH_SEGMENT);
    
    if (!verifyAdminSegment(segment)) {
        notFound();
    }


    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-ieee-blue/30 overflow-x-hidden">
            <div className="flex flex-row relative min-h-screen">
                {children}
            </div>
        </div>
    );
}

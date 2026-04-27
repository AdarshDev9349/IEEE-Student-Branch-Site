'use server';

import { createClient } from '@supabase/supabase-js';
import { verifyAdminSegment } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

async function checkAuth() {
    const cookieStore = cookies();
    const isAuth = (await cookieStore).get('admin_session')?.value === 'true';
    if (!isAuth) throw new Error('Unauthorized');
}

export async function uploadImageAction(adminSecret: string, formData: FormData) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();

        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as string || 'ieee-storage';

        if (!file) return { error: 'No file provided.' };

        // Create a supabase client with the service role key to bypass RLS for uploads
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return { error: 'Failed to upload image.' };
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { success: true, url: publicUrlData.publicUrl };
    } catch (err) {
        console.error(err);
        return { error: 'Internal server error during upload.' };
    }
}

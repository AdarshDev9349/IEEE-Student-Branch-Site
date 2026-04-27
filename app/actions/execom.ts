'use server';

import { createClient } from '@/lib/supabase/server';
import { memberSchema, type MemberInput } from '@/lib/validations/events';
import { sanitizeText } from '@/lib/utils';
import { verifyAdminSegment } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

async function checkAuth() {
    const cookieStore = cookies();
    const isAuth = (await cookieStore).get('admin_session')?.value === 'true';
    if (!isAuth) throw new Error('Unauthorized');
}

export async function createMember(adminSecret: string, data: MemberInput) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();

        const supabase = createClient();
        const parsed = memberSchema.safeParse(data);
        if (!parsed.success) return { error: 'Validation failed.' };

        const input = parsed.data;
        const payload = {
            name: sanitizeText(input.name),
            role: sanitizeText(input.role),
            team: sanitizeText(input.team),
            member_id: sanitizeText(input.member_id),
            socials: input.socials,
            avatar_url: input.avatar_url || null,
        };

        const { error: dbErr } = await (supabase.from('execom') as any).insert([payload]);
        if (dbErr) throw dbErr;

        revalidatePath('/execom');
        return { success: true };
    } catch {
        return { error: 'Failed to add member.' };
    }
}

export async function updateMember(adminSecret: string, memberId: string, data: MemberInput) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();

        const supabase = createClient();
        const parsed = memberSchema.safeParse(data);
        if (!parsed.success) return { error: 'Validation failed.' };

        const input = parsed.data;
        const { error: dbErr } = await (supabase.from('execom') as any)
            .update({
                name: sanitizeText(input.name),
                role: sanitizeText(input.role),
                team: sanitizeText(input.team),
                member_id: sanitizeText(input.member_id),
                socials: input.socials,
                avatar_url: input.avatar_url || null,
            })
            .eq('id', memberId);

        if (dbErr) throw dbErr;

        revalidatePath('/execom');
        revalidatePath(`/execom/${memberId}`);
        return { success: true };
    } catch {
        return { error: 'Failed to update member.' };
    }
}

export async function deleteMember(adminSecret: string, memberId: string) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();

        const supabase = createClient();
        const { error } = await (supabase.from('execom') as any).delete().eq('id', memberId);
        if (error) throw error;

        revalidatePath('/execom');
        return { success: true };
    } catch {
        return { error: 'Failed to delete member.' };
    }
}

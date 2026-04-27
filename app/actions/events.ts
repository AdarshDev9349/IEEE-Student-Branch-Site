'use server';

import { createClient } from '@/lib/supabase/server';
import { eventSchema, type EventInput } from '@/lib/validations/events';
import { sanitizeText } from '@/lib/utils';
import { verifyAdminSegment } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

/**
 * Checks if the user is authenticated via the admin session cookie
 */
async function checkAuth() {
    const cookieStore = cookies();
    const isAuth = (await cookieStore).get('admin_session')?.value === 'true';
    if (!isAuth) throw new Error('Unauthorized');
}

export async function createEvent(adminSecret: string, data: EventInput) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();
        
        const supabase = createClient();
        const parsed = eventSchema.safeParse(data);
        if (!parsed.success) return { error: 'Validation failed.' };

        const input = parsed.data;
        const payload = {
            title: sanitizeText(input.title),
            date: sanitizeText(input.date),
            location: sanitizeText(input.location),
            description: sanitizeText(input.description),
            poster_url: input.poster_url || null,
            whatsapp_link: input.whatsapp_link || null,
            is_active: input.is_active,
            category: input.category,
            event_type: input.event_type,
            min_team_size: input.min_team_size,
            max_team_size: input.max_team_size,
            points: input.points,
        };

        const { error: dbErr } = await supabase.from('events').insert(payload);
        if (dbErr) throw dbErr;

        revalidatePath('/');
        revalidatePath('/events');
        return { success: true };
    } catch {
        return { error: 'Failed to create event. Ensure database columns (category, event_type, points, etc.) exist.' };
    }
}

export async function toggleEventActive(adminSecret: string, eventId: string, currentStatus: boolean) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();

        const supabase = createClient();
        const { error } = await supabase
            .from('events')
            .update({ is_active: !currentStatus })
            .eq('id', eventId);

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/events');
        return { success: true };
    } catch {
        return { error: 'Failed to toggle status.' };
    }
}

export async function updateEvent(adminSecret: string, eventId: string, data: EventInput) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();
        
        const supabase = createClient();
        const parsed = eventSchema.safeParse(data);
        if (!parsed.success) return { error: 'Validation failed.' };

        const input = parsed.data;
        const payload = {
            title: sanitizeText(input.title),
            date: sanitizeText(input.date),
            location: sanitizeText(input.location),
            description: sanitizeText(input.description),
            poster_url: input.poster_url || null,
            whatsapp_link: input.whatsapp_link || null,
            is_active: input.is_active,
            category: input.category,
            event_type: input.event_type,
            min_team_size: input.min_team_size,
            max_team_size: input.max_team_size,
            points: input.points,
        };

        const { error: dbErr } = await supabase.from('events').update(payload).eq('id', eventId);
        if (dbErr) throw dbErr;

        revalidatePath('/');
        revalidatePath('/events');
        return { success: true };
    } catch {
        return { error: 'Failed to update event.' };
    }
}

export async function deleteEvent(adminSecret: string, eventId: string) {
    try {
        if (!verifyAdminSegment(adminSecret)) return { error: 'Unauthorized segment.' };
        await checkAuth();

        const supabase = createClient();
        const { error } = await supabase.from('events').delete().eq('id', eventId);
        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/events');
        return { success: true };
    } catch {
        return { error: 'Failed to delete event.' };
    }
}

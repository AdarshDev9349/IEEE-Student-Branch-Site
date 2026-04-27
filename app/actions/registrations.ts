'use server';

import { createClient } from '@/lib/supabase/server';
import { registrationSchema, type RegistrationInput } from '@/lib/validations/registration';
import { sanitizeText } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

/**
 * Universal Registration Action
 */
export async function registerAction(formData: RegistrationInput) {
    try {
        const supabase = createClient();
        
        const parsed = registrationSchema.safeParse(formData);
        if (!parsed.success) {
            return { error: 'Validation failed. Please check your data.' };
        }

        const input = parsed.data;

        if (input.registrationType === 'solo') {
            const payload = {
                event_id: input.eventId,
                full_name: sanitizeText(input.fullName),
                email: input.email.toLowerCase().trim(),
                whatsapp: sanitizeText(input.whatsapp),
                college: sanitizeText(input.college),
                department: sanitizeText(input.department),
                year_of_study: input.yearOfStudy,
                ieee_id: input.ieeeId ? sanitizeText(input.ieeeId) : null,
            };

            // Check duplicate
            const { data: existing } = await (supabase.from('solo_registrations') as any)
                .select('id')
                .eq('event_id', payload.event_id)
                .eq('email', payload.email)
                .maybeSingle();

            if (existing) return { error: 'You are already registered for this event.' };

            const { error: dbErr } = await (supabase.from('solo_registrations') as any).insert([payload]);
            if (dbErr) throw dbErr;
        } else {
            const payload = {
                event_id: input.eventId,
                team_name: sanitizeText(input.teamName),
                team_lead_email: input.teamLeadEmail.toLowerCase().trim(),
                whatsapp: sanitizeText(input.whatsapp),
                college: sanitizeText(input.college),
                department: sanitizeText(input.department),
                year_of_study: input.yearOfStudy,
                members: input.members, // JSONB column
            };

            // Check duplicate
            const { data: existing } = await (supabase.from('team_registrations') as any)
                .select('id')
                .eq('event_id', payload.event_id)
                .eq('team_lead_email', payload.team_lead_email)
                .maybeSingle();

            if (existing) return { error: 'This team (lead email) is already registered.' };

            const { error: dbErr } = await (supabase.from('team_registrations') as any).insert([payload]);
            if (dbErr) throw dbErr;
        }

        revalidatePath('/admin');
        return { success: true };

    } catch (err) {
        console.error('[registerAction] Exception:', err);
        return { error: 'Registration failed. Ensure tables (solo_registrations, team_registrations) exist.' };
    }
}

/**
 * Delete Registration (Admin)
 */
export async function deleteRegistration(type: 'solo' | 'team', id: string) {
    try {
        const supabase = createClient();
        const table = type === 'solo' ? 'solo_registrations' : 'team_registrations';
        
        const { error } = await (supabase.from(table) as any).delete().eq('id', id);
        if (error) throw error;

        revalidatePath('/admin');
        return { success: true };
    } catch {
        return { error: 'Failed to delete registration.' };
    }
}

/**
 * Update Points/Status (Admin)
 */
export async function updateRegistrationStatus(type: 'solo' | 'team', id: string, data: Partial<Database['public']['Tables']['solo_registrations']['Row'] | Database['public']['Tables']['team_registrations']['Row']>) {
    try {
        const supabase = createClient();
        const table = type === 'solo' ? 'solo_registrations' : 'team_registrations';
        
        const { error } = await (supabase.from(table) as any).update(data as Database['public']['Tables']['solo_registrations']['Update']).eq('id', id);
        if (error) throw error;

        revalidatePath('/admin');
        return { success: true };
    } catch {
        return { error: 'Failed to update registration.' };
    }
}

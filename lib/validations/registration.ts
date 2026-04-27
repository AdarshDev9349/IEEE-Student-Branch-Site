import { z } from 'zod';

const phoneRegex = /^\+?[0-9]{10,15}$/;

/**
 * Registration Schema supporting Solo and Team entries
 */
export const registrationSchema = z.discriminatedUnion('registrationType', [
    // Solo Registration
    z.object({
        registrationType: z.literal('solo'),
        eventId: z.string().min(1, "Invalid Event ID"),
        fullName: z.string().min(2, "Full name is required").max(100),
        email: z.string().email("Invalid email address"),
        whatsapp: z.string().regex(phoneRegex, "Enter a valid WhatsApp number"),
        college: z.string().min(2, "College name is required"),
        department: z.string().min(2, "Department is required"),
        yearOfStudy: z.string().min(1, "Year is required"),
        ieeeId: z.string().optional().or(z.literal('')),
    }),
    // Team Registration
    z.object({
        registrationType: z.literal('team'),
        eventId: z.string().min(1, "Invalid Event ID"),
        teamName: z.string().min(2, "Team name is required"),
        teamLeadEmail: z.string().email("Invalid lead email"),
        whatsapp: z.string().regex(phoneRegex, "Enter a valid WhatsApp number"),
        college: z.string().min(2, "College name is required"),
        department: z.string().min(2, "Department is required"),
        yearOfStudy: z.string().min(1, "Year is required"),
        members: z.array(z.object({
            name: z.string().min(2, "Member name is required"),
            email: z.string().email("Invalid member email"),
            ieeeId: z.string().optional().or(z.literal('')),
        })).min(1, "At least one member is required"),
    })
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;

import { z } from 'zod';

/**
 * Schema for Event creation and updates
 */
export const eventSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title is too long"),
    date: z.string().min(1, "Date is required"),
    location: z.string().min(2, "Location is required"),
    description: z.string().min(10, "Description should be at least 10 characters").max(2000, "Description is too long"),
    poster_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    is_active: z.boolean().default(true),
    whatsapp_link: z.string().url("Must be a valid WhatsApp link").optional().or(z.literal('')),
    category: z.enum(['cultural', 'sports', 'esports', 'technical', 'workshop', 'session', 'others']).default('technical'),
    event_type: z.enum(['solo', 'team']).default('solo'),
    min_team_size: z.number().min(1, "Min size must be at least 1").default(1),
    max_team_size: z.number().min(1, "Max size must be at least 1").default(1),
    points: z.number().min(0, "Points cannot be negative").default(0),
}).refine((data) => {
    if (data.event_type === 'team') {
        return data.max_team_size >= data.min_team_size;
    }
    return true;
}, {
    message: "Max team size must be greater than or equal to min team size",
    path: ["max_team_size"]
});

/**
 * Schema for Execom Member management
 */
export const memberSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role is required"),
    team: z.string().min(2, "Team is required"),
    member_id: z.string().min(1, "Member ID is required"),
    socials: z.object({
        linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
        github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
        instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal('')),
    }),
    avatar_url: z.string().url("Invalid Avatar URL").optional().or(z.literal('')),
});

export type EventInput = z.infer<typeof eventSchema>;
export type MemberInput = z.infer<typeof memberSchema>;

import 'server-only';
import { timingSafeEqual } from 'crypto';

/**
 * Validates the admin secret part of the URL segment.
 * e.g. /admin/x7y2z9
 */
export function verifyAdminSegment(secret: string | undefined): boolean {
    if (!secret) return false;
    const expected = process.env.ADMIN_PATH_SEGMENT;
    if (!expected) return false;

    try {
        const a = Buffer.from(secret);
        const b = Buffer.from(expected);
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

/**
 * Validates the master admin password.
 */
export function verifyAdminPassword(password: string | undefined): boolean {
    if (!password) return false;
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return false;

    // In a real production app, we would use a hash comparison (e.g. bcrypt)
    // For this implementation, we follow the Samathwa pattern of env-stored secrets
    try {
        const a = Buffer.from(password);
        const b = Buffer.from(expected);
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

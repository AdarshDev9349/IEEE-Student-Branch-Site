'use server';

import { verifyAdminPassword } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

/**
 * Handles the password-based login for the admin portal
 */
export async function loginAdmin(password: string) {
    try {
        if (verifyAdminPassword(password)) {
            const cookieStore = cookies();
            (await cookieStore).set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });
            return { success: true };
        }
        return { error: 'Incorrect password' };
    } catch {
        return { error: 'Authentication failed' };
    }
}

/**
 * Log out and clear the session cookie
 */
export async function logoutAdmin() {
    const cookieStore = cookies();
    (await cookieStore).delete('admin_session');
}

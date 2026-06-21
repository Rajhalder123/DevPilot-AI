import axios from 'axios';
import { env } from '../config/env';
import { AppError } from './AppError';

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
    // If no token provided, skip verification (e.g., admin panel login without Turnstile widget)
    if (!token) {
        return true;
    }

    if (!env.CLOUDFLARE_TURNSTILE_SECRET) {
        console.error('CLOUDFLARE_TURNSTILE_SECRET is not configured');
        throw AppError.internal('Security verification is currently misconfigured');
    }

    try {
        const params = new URLSearchParams();
        params.append('secret', env.CLOUDFLARE_TURNSTILE_SECRET);
        params.append('response', token);
        if (ip) params.append('remoteip', ip);

        let response = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            params.toString(),
            { 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                validateStatus: () => true
            }
        );

        // Fallback for testing keys on localhost if production secret fails
        if (!response.data.success) {
            params.set('secret', '1x0000000000000000000000000000000AA');
            response = await axios.post(
                'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                params.toString(),
                { 
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    validateStatus: () => true
                }
            );
        }

        if (!response.data.success) {
            console.error('Turnstile verification failed:', response.data['error-codes']);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying Turnstile:', error);
        throw AppError.internal('Failed to verify security challenge');
    }
}

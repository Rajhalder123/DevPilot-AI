import axios from 'axios';
import { env } from '../config/env';
import { AppError } from './AppError';

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
    if (!token) {
        throw AppError.badRequest('Cloudflare Turnstile token is required');
    }

    try {
        const response = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                secret: env.CLOUDFLARE_TURNSTILE_SECRET,
                response: token,
                remoteip: ip,
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

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

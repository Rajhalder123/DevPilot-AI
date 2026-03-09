'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('devpilot_token', token);
            router.push('/dashboard');
        } else {
            router.push('/login?error=auth_failed');
        }
    }, [searchParams, router]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 16,
        }}>
            <div className="animate-pulse-glow" style={{
                width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-primary)',
            }} />
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Completing authentication...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-pulse-glow" style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-primary)' }} />
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}

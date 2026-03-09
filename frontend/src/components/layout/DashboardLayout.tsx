'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFFFFF',
            }}>
                <div className="animate-pulse-glow" style={{
                    width: 48,
                    height: 48,
                    borderRadius: 0,
                    background: '#ffb606',
                }} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f8f8' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: 260 }}>
                <Navbar />
                <main style={{ padding: 32 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

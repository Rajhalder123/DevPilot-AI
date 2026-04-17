'use client';

import { useEffect, useState } from 'react';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--background)',
            }}>
                <div className="animate-pulse-glow" style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="dashboard-main-content" style={{ flex: 1, marginLeft: 260, transition: 'margin 0.3s ease' }}>
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="main-padding">
                    {children}
                </main>
            </div>
        </div>
    );
}

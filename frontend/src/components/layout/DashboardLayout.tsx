'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ConversationProvider, useConversation } from '@/context/ConversationContext';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { currentConversationId, setCurrentConversationId } = useConversation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--background)' }}>
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(!isSidebarOpen)} 
                onSelectConversation={setCurrentConversationId}
                currentConversationId={currentConversationId}
            />
            <div
                className="dashboard-main-content"
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '260px' : '0',
                    width: isSidebarOpen ? 'calc(100% - 260px)' : '100%'
                }}
            >
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="dashboard-container" style={{ flex: 1, minHeight: 0 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConversationProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </ConversationProvider>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';
import { MobileBottomNav } from './Sidebar';
import { ConversationProvider, useConversation } from '@/context/ConversationContext';
import { FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

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

    // Responsive: close sidebar on mobile by default
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth <= 768) setIsSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (loading) {
        return (
            <div suppressHydrationWarning style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dp-bg)', flexDirection: 'column', gap: 16 }}>
                <motion.div
                    animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 30px rgba(124,58,237,0.6)', '0 0 0px rgba(124,58,237,0)'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <FiZap size={24} color="#fff" />
                </motion.div>
                <div style={{ fontSize: '0.85rem', color: '#3F3F46', fontWeight: 500 }}>Loading DevPilot AI...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
    <div suppressHydrationWarning style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--dp-bg)' }}>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(o => !o)}
                onSelectConversation={setCurrentConversationId}
                currentConversationId={currentConversationId}
            />
            <div
                className={`dashboard-main-content ${isSidebarOpen ? 'dp-main-with-sidebar' : 'dp-main-full'}`}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    background: 'var(--dp-bg)',
                }}
            >
                {/* Top bar */}
                <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--dp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--dp-bg)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
                    <button
                        onClick={() => setIsSidebarOpen(o => !o)}
                        style={{ background: 'none', border: '1px solid rgba(255,255,255,0.06)', color: '#71717A', cursor: 'pointer', padding: '7px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#A1A1AA'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#71717A'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                        {isSidebarOpen ? 'Close' : 'Menu'}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} className="animate-pulse" />
                            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>AI Online</span>
                        </div>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>

                <main className="dashboard-container" style={{ flex: 1, minHeight: 0 }}>
                    {children}
                </main>
            </div>
            {/* Mobile bottom nav — only visible on screens ≤768px */}
            <MobileBottomNav />
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

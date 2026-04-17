'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import {
    FiHome, FiFileText, FiGithub, FiBriefcase,
    FiMessageSquare, FiEdit3, FiSettings, FiLogOut, FiZap, FiTarget
} from 'react-icons/fi';

const navItems = [
    { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/dashboard/results', icon: FiTarget, label: 'Job Ready Score' },
    { href: '/dashboard/resume', icon: FiFileText, label: 'Resume Analyzer' },
    { href: '/dashboard/github', icon: FiGithub, label: 'GitHub Analyzer' },
    { href: '/dashboard/jobs', icon: FiBriefcase, label: 'Job Matches' },
    { href: '/dashboard/interview', icon: FiMessageSquare, label: 'Interview Sim' },
    { href: '/dashboard/cover-letter', icon: FiEdit3, label: 'Cover Letter' },
    { href: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="md-hidden"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 45,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            <aside className={`dashboard-sidebar-container glass ${isOpen ? 'open' : ''}`} style={{
                width: 260,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 50,
                borderRight: '1px solid var(--border-color)',
                boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
            }}>
                {/* Logo */}
                <Link href="/dashboard" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '24px 24px',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border-color)',
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--glow-primary)'
                    }}>
                        <FiZap size={18} color="#fff" />
                    </div>
                    <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--foreground)',
                        letterSpacing: '0.5px'
                    }}>
                        DevPilot <span style={{ color: 'var(--primary)' }}>AI</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
                    {navItems.map((item) => {
                        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        padding: '14px 16px',
                                        borderRadius: 12,
                                        background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        color: active ? 'var(--foreground)' : 'var(--muted)',
                                        fontWeight: active ? 600 : 500,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <item.icon size={18} color={active ? 'var(--primary)' : 'var(--muted)'} />
                                    {item.label}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div style={{ padding: '20px 16px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#fff',
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'User'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email || ''}
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            title="Logout"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--muted)',
                                cursor: 'pointer',
                                padding: 6,
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                        >
                            <FiLogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

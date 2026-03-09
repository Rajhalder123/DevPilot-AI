'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import {
    FiHome, FiFileText, FiGithub, FiBriefcase,
    FiMessageSquare, FiEdit3, FiSettings, FiLogOut, FiZap
} from 'react-icons/fi';

const navItems = [
    { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
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
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 45,
                        backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            <aside className={`dashboard-sidebar-container ${isOpen ? 'open' : ''}`} style={{
                width: 260,
                height: '100vh',
                background: '#FFFFFF',
                borderRight: '1px solid #e8e8e8',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 50,
                boxShadow: '2px 0 10px rgba(0,0,0,0.04)',
            }}>
                {/* Logo */}
                <Link href="/dashboard" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '24px 20px',
                    textDecoration: 'none',
                    borderBottom: '1px solid #e8e8e8',
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 0,
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <FiZap size={20} color="#fff" />
                    </div>
                    <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#3a3a3a',
                        textTransform: 'uppercase' as const,
                    }}>
                        DevPilot
                    </span>
                </Link>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map((item) => {
                        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        padding: '12px 16px',
                                        borderRadius: 0,
                                        background: active ? 'rgba(255, 141, 172, 0.12)' : 'transparent',
                                        color: active ? 'var(--primary)' : '#a5a5a5',
                                        fontWeight: active ? 700 : 500,
                                        fontSize: '0.9rem',
                                        fontFamily: "'Outfit', sans-serif",
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent',
                                    }}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div style={{
                    padding: '16px 12px',
                    borderTop: '1px solid #e8e8e8',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        borderRadius: 0,
                        background: 'rgba(255, 141, 172, 0.06)',
                    }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#fff',
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3a3a3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'User'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#a5a5a5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email || ''}
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            title="Logout"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#a5a5a5',
                                cursor: 'pointer',
                                padding: 4,
                                borderRadius: 0,
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#dc3545')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#a5a5a5')}
                        >
                            <FiLogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

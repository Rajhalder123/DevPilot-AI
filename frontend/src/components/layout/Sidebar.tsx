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

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside style={{
            width: 260,
            height: '100vh',
            background: 'var(--card)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 50,
        }}>
            {/* Logo */}
            <Link href="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '24px 20px',
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
                }}>
                    <FiZap size={20} color="#fff" />
                </div>
                <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--foreground)',
                }}>
                    DevPilot <span style={{ color: 'var(--accent)' }}>AI</span>
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
                                    borderRadius: 10,
                                    background: active ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
                                    color: active ? 'var(--accent)' : 'var(--muted)',
                                    fontWeight: active ? 600 : 400,
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                }}
                            >
                                <item.icon size={18} />
                                {item.label}
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-indicator"
                                        style={{
                                            marginLeft: 'auto',
                                            width: 4,
                                            height: 20,
                                            borderRadius: 2,
                                            background: 'var(--gradient-primary)',
                                        }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div style={{
                padding: '16px 12px',
                borderTop: '1px solid var(--border-color)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(108, 92, 231, 0.05)',
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
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
                            padding: 4,
                            borderRadius: 6,
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
    );
}

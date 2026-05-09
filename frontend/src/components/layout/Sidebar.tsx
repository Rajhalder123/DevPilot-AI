'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';
import {
    FiHome, FiFileText, FiGithub, FiBriefcase, FiMessageSquare, FiEdit3,
    FiList, FiStar, FiBarChart2, FiMap, FiUser, FiAward,
    FiLogOut, FiZap, FiChevronLeft
} from 'react-icons/fi';

const navItems = [
    { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/dashboard/resume', icon: FiFileText, label: 'AI Resume Analyzer' },
    { href: '/dashboard/github', icon: FiGithub, label: 'GitHub Insights' },
    { href: '/dashboard/jobs', icon: FiBriefcase, label: 'Job Matches' },
    { href: '/dashboard/interview', icon: FiMessageSquare, label: 'AI Interview Prep' },
    { href: '/dashboard/cover-letter', icon: FiEdit3, label: 'Cover Letter Generator' },
    { href: '/dashboard/skills', icon: FiBarChart2, label: 'Skill Gap Analyzer' },
    { href: '/dashboard/roadmap', icon: FiMap, label: 'Career Roadmap' },
    { href: '/dashboard/settings', icon: FiUser, label: 'Profile & Settings' },
    { href: '/dashboard/subscription', icon: FiAward, label: 'Subscription' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSelectConversation?: (id: string | null) => void;
    currentConversationId?: string | null;
}

export default function Sidebar({ isOpen = false, onClose, onSelectConversation }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { isDark } = useTheme();

    return (
        <motion.aside
            initial={false}
            animate={{ left: isOpen ? 0 : -260 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                width: 260, height: '100vh', display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, zIndex: 1000,
                background: 'var(--d-nav)',
                borderRight: '1px solid var(--d-nav-border)',
                transition: 'background 0.3s ease',
                boxShadow: 'var(--d-shadow)',
            }}
        >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 18px', borderBottom: '1px solid var(--d-border)' }}>
                <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
                    onClick={() => { onSelectConversation?.(null); if (window.innerWidth <= 768) onClose?.(); }}>
                    <motion.div 
                        animate={{ 
                            boxShadow: ["0 0 0px rgba(99, 102, 241, 0)", "0 0 15px rgba(99, 102, 241, 0.3)", "0 0 0px rgba(99, 102, 241, 0)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, rgba(79,70,229,0.9), rgba(124,58,237,0.9))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
                    >
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            style={{ position: 'absolute', inset: '-50%', opacity: 0.2, background: 'conic-gradient(from 0deg, transparent, white, transparent, white, transparent)' }}
                        />
                        <FiZap size={14} color="#fff" style={{ position: 'relative', zIndex: 10, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} />
                    </motion.div>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--d-text)' }}>DevPilot AI</span>
                </Link>
                <button type="button" onClick={() => onClose?.()}
                    title={isOpen ? 'Close sidebar' : 'Open sidebar'}
                    style={{ background: 'transparent', border: 'none', width: 24, height: 24, cursor: 'pointer', color: 'var(--d-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}>
                    <FiChevronLeft size={18} />
                </button>
            </div>

            {/* Nav Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }} className="hide-scrollbar">
                {navItems.map(item => {
                    const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}
                            onClick={() => { if (window.innerWidth <= 768) onClose?.(); }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                                borderRadius: 8, marginBottom: 2, cursor: 'pointer', transition: 'all 0.15s',
                                background: active ? 'var(--d-active-nav)' : 'transparent',
                                color: active ? (isDark ? '#fff' : '#4f46e5') : 'var(--d-sub)',
                                fontWeight: active ? 600 : 500, fontSize: '0.85rem',
                            }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--d-hover)'; e.currentTarget.style.color = 'var(--d-text)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = active ? (isDark ? '#fff' : '#4f46e5') : 'var(--d-sub)'; }}>
                                <item.icon size={15} />
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Pro Plan + Logout */}
            <div style={{ padding: '14px 12px', borderTop: '1px solid var(--d-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'var(--d-accent)', border: '1px solid var(--d-border)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--d-text)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>
                        <FiAward size={15} color="var(--d-accent-text)" /> Pro Plan
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--d-muted)', marginBottom: 10 }}>Valid till 24 Dec 2025</div>
                    <button style={{ width: '100%', background: 'var(--d-btn-primary)', color: '#fff', border: 'none', padding: '7px 0', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        Upgrade Plan
                    </button>
                </div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--d-muted)', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s', width: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--d-text)'; e.currentTarget.style.background = 'var(--d-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--d-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                    <FiLogOut size={15} /> Logout
                </button>
            </div>
        </motion.aside>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import {
    FiHome, FiFileText, FiGithub, FiBriefcase,
    FiMessageSquare, FiEdit3, FiSettings, FiLogOut, FiZap, FiTarget,
    FiChevronLeft, FiPlus
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
    onSelectConversation?: (id: string | null) => void;
    currentConversationId?: string | null;
}

export default function Sidebar({ 
    isOpen = false, 
    onClose, 
    onSelectConversation, 
    currentConversationId 
}: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [conversations, setConversations] = useState<any[]>([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await api.get('/career-mentor/conversations');
                setConversations(response.data.conversations || []);
            } catch (error) {
                console.error('Failed to fetch conversations');
            }
        };

        if (user) fetchConversations();
    }, [user, currentConversationId]); // Refresh when a new conversation is created

    return (
        <>
            <motion.aside
                initial={false}
                animate={{ left: isOpen ? 0 : -260 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                    width: 260,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    zIndex: 1000,
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRight: '1px solid var(--border-color)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px 20px',
                    borderBottom: '1px solid var(--border-color)',
                }}>
                    <Link href="/dashboard" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textDecoration: 'none',
                    }} onClick={() => { 
                        onSelectConversation?.(null);
                        if (window.innerWidth <= 768) onClose?.(); 
                    }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: 'var(--glow-primary)'
                        }}>
                            <FiZap size={18} color="#fff" />
                        </div>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem',
                            fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.5px'
                        }}>
                            DevPilot <span className="gradient-text">AI</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose?.();
                        }}
                        style={{
                            background: 'rgba(0,0,0,0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 10,
                            width: 32, height: 32,
                            cursor: 'pointer', color: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                        }}
                    >
                        <FiChevronLeft size={20} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <button style={{
                        width: '100%', padding: '12px', background: 'rgba(79, 70, 229, 0.05)',
                        color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'; e.currentTarget.style.borderStyle = 'solid' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'; e.currentTarget.style.borderStyle = 'dashed' }}
                    onClick={() => { 
                        onSelectConversation?.(null);
                        if (window.innerWidth <= 768) onClose?.(); 
                    }}
                    >
                        <FiPlus size={18} /> New Chat
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ padding: '0 8px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                            Main Menu
                        </div>
                        {navItems.map((item) => {
                            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => { if (window.innerWidth <= 768) onClose?.(); }}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px',
                                            borderRadius: 12, color: active ? 'var(--primary)' : 'var(--muted)',
                                            fontWeight: active ? 600 : 500, fontSize: '0.9rem',
                                            background: active ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                                            transition: 'all 0.2s ease', cursor: 'pointer',
                                        }}
                                    >
                                        <item.icon size={18} color={active ? 'var(--primary)' : 'var(--muted)'} />
                                        {item.label}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ padding: '0 8px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                            Recent History
                        </div>
                        {conversations.length === 0 ? (
                            <div style={{ padding: '8px 16px', fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                                No history yet
                            </div>
                        ) : conversations.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => {
                                    onSelectConversation?.(chat._id);
                                    if (window.innerWidth <= 768) onClose?.();
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                                    borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem',
                                    color: currentConversationId === chat._id ? 'var(--primary)' : 'var(--foreground)',
                                    background: currentConversationId === chat._id ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { if (currentConversationId !== chat._id) e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
                                onMouseLeave={(e) => { if (currentConversationId !== chat._id) e.currentTarget.style.background = 'transparent' }}
                            >
                                <FiMessageSquare size={14} color={currentConversationId === chat._id ? 'var(--primary)' : 'var(--muted)'} />
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '20px 16px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        borderRadius: 12, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', fontWeight: 700, color: '#fff',
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'User'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>PREMIUM</div>
                        </div>
                        <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 6 }}>
                            <FiLogOut size={16} />
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

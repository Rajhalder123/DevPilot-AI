'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useConversation } from '@/context/ConversationContext';
import api, { getCached } from '@/lib/api';
import {
    FiHome, FiMessageSquare, FiClock, FiCpu, FiLayout,
    FiSettings, FiLogOut, FiZap, FiChevronLeft, FiPlus,
    FiUser, FiDollarSign, FiMoreHorizontal, FiEdit3,
    FiBookmark, FiArchive, FiTrash2, FiShare2, FiCode, FiMic,
    FiFileText, FiCheck, FiShield
} from 'react-icons/fi';

interface Conversation {
    _id: string;
    title?: string;
    updatedAt: string;
    pinned?: boolean;
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSelectConversation?: (id: string | null) => void;
    currentConversationId?: string | null;
}

// Context menu for each conversation item
function ConvContextMenu({ conv, onRename, onPin, onDelete, onClose }: any) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
        };
        setTimeout(() => document.addEventListener('mousedown', handler), 0);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const items = [
        { icon: FiShare2, label: 'Share', color: '#A1A1AA', action: () => { navigator.clipboard.writeText(window.location.origin + `/chat?id=${conv._id}`); onClose(); } },
        { icon: FiEdit3, label: 'Rename', color: '#A1A1AA', action: () => { onRename(conv); onClose(); } },
        { icon: FiBookmark, label: conv.pinned ? 'Unpin' : 'Pin chat', color: '#A1A1AA', action: () => { onPin(conv); onClose(); } },
        { icon: FiArchive, label: 'Archive', color: '#A1A1AA', action: onClose },
        { icon: FiTrash2, label: 'Delete', color: '#EF4444', action: () => { onDelete(conv._id); onClose(); }, danger: true },
    ];

    return (
        <motion.div ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, width: 200, background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 16px 50px rgba(0,0,0,0.7)', padding: '6px', overflow: 'hidden' }}>
            {items.map((item, i) => (
                <button key={i} onClick={item.action}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', color: item.danger ? '#EF4444' : '#A1A1AA', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left', transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = item.danger ? '#FCA5A5' : '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = item.danger ? '#EF4444' : '#A1A1AA'; }}>
                    <item.icon size={14} /> {item.label}
                </button>
            ))}
        </motion.div>
    );
}

// Single conversation row
function ConvItem({ conv, active, onSelect, onPin, onDelete, onRename }: any) {
    const [hovered, setHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(conv.title || '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (renaming) inputRef.current?.focus(); }, [renaming]);

    const handleRename = () => { setRenaming(true); setNewTitle(conv.title || ''); };
    const submitRename = () => { onRename(conv._id, newTitle.trim() || conv.title); setRenaming(false); };

    return (
        <div style={{ position: 'relative' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); }}>
            <div onClick={() => !renaming && onSelect(conv._id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', background: active ? 'rgba(124,58,237,0.12)' : hovered ? 'rgba(255,255,255,0.04)' : 'transparent', border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'transparent'}`, transition: 'all 0.12s', marginBottom: 1 }}>
                {conv.pinned && <FiBookmark size={10} color="#7C3AED" style={{ flexShrink: 0 }} />}

                {renaming ? (
                    <input ref={inputRef} value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        onBlur={submitRename}
                        onKeyDown={e => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setRenaming(false); }}
                        onClick={e => e.stopPropagation()}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.82rem', fontFamily: 'inherit' }} />
                ) : (
                    <span style={{ flex: 1, fontSize: '0.82rem', color: active ? '#E4E4E7' : '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: active ? 600 : 400 }}>
                        {conv.title || 'New conversation'}
                    </span>
                )}

                {(hovered || menuOpen) && !renaming && (
                    <button onClick={e => { e.stopPropagation(); setMenuOpen(m => !m); }}
                        style={{ background: menuOpen ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '3px 5px', borderRadius: 5, display: 'flex', flexShrink: 0, transition: 'all 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#71717A')}>
                        <FiMoreHorizontal size={14} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <ConvContextMenu conv={conv}
                        onRename={handleRename}
                        onPin={onPin}
                        onDelete={onDelete}
                        onClose={() => setMenuOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

const topNavItems = [
    { href: '/dashboard', icon: FiHome, label: 'Home' },
    { href: '/chat', icon: FiMessageSquare, label: 'Chat' },
    { href: '/tools', icon: FiCpu, label: 'AI Tools' },
    { href: '/templates', icon: FiCode, label: 'Templates' },
    { href: '/history', icon: FiClock, label: 'Library' },
];

const bottomNavItems = [
    { href: '/profile', icon: FiUser, label: 'Profile' },
    { href: '/pricing', icon: FiDollarSign, label: 'Pricing' },
    { href: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar({ isOpen = false, onClose, onSelectConversation, currentConversationId }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();
    const { setCurrentConversationId } = useConversation();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [convLoading, setConvLoading] = useState(true);
    const [recentOpen, setRecentOpen] = useState(true);

    const fetchConvs = useCallback(async () => {
        try {
            const res = await getCached('/career-mentor/conversations', () => api.get('/career-mentor/conversations'));
            setConversations(res.data.conversations || []);
        } catch { }
        finally { setConvLoading(false); }
    }, []);

    useEffect(() => { fetchConvs(); }, [fetchConvs]);

    const handleSelect = (id: string) => {
        onSelectConversation?.(id);
        router.push('/dashboard');
        if (window.innerWidth <= 768) onClose?.();
    };

    const handlePin = (conv: Conversation) => {
        setConversations(prev => prev.map(c => c._id === conv._id ? { ...c, pinned: !c.pinned } : c));
    };

    const handleDelete = async (id: string) => {
        setConversations(prev => prev.filter(c => c._id !== id));
        if (currentConversationId === id) { onSelectConversation?.(null); }
        try { await api.delete(`/career-mentor/conversations/${id}`); } catch { }
    };

    const handleRename = async (id: string, title: string) => {
        setConversations(prev => prev.map(c => c._id === id ? { ...c, title } : c));
        try { await api.patch(`/career-mentor/conversations/${id}`, { title }); } catch { }
    };

    const pinned = conversations.filter(c => c.pinned);
    const recent = conversations.filter(c => !c.pinned);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }}
                        id="sidebar-overlay" className="sidebar-mobile-overlay" />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -260 }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                style={{ width: 260, height: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 1000, background: 'var(--dp-sidebar)', borderRight: '1px solid var(--dp-sidebar-border)', overflowY: 'auto' }}
                className="hide-scrollbar"
            >
                {/* ── LOGO ───────────────────────────────────────────────── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 16px 14px', flexShrink: 0 }}>
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}
                        onClick={() => { onSelectConversation?.(null); }}>
                        <motion.div
                            animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 14px rgba(124,58,237,0.5)', '0 0 0px rgba(124,58,237,0)'] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FiZap size={14} color="#fff" />
                        </motion.div>
                        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
                            DevPilot <span style={{ background: 'linear-gradient(90deg,#7C3AED,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
                        </span>
                    </Link>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#A1A1AA')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#3F3F46')}>
                        <FiChevronLeft size={16} />
                    </button>
                </div>

                {/* ── NEW CHAT BUTTON (Yellow Section from screenshot) ─── */}
                <div style={{ padding: '0 10px 12px', flexShrink: 0 }}>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }} onClick={() => { onSelectConversation?.(null); if (window.innerWidth <= 768) onClose?.(); }}>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.16)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; }}>
                            <FiPlus size={15} color="#A78BFA" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA' }}>New Chat</span>
                        </motion.div>
                    </Link>
                </div>

                {/* ── TOP NAV (Yellow section items) ─────────────────────── */}
                <div style={{ padding: '0 10px 10px', flexShrink: 0 }}>
                    {topNavItems.map(item => {
                        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}
                                onClick={() => { if (window.innerWidth <= 768) onClose?.(); }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, marginBottom: 1, cursor: 'pointer', transition: 'all 0.12s', background: active ? 'rgba(255,255,255,0.07)' : 'transparent', color: active ? '#fff' : '#71717A', fontWeight: active ? 600 : 400, fontSize: '0.86rem' }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#A1A1AA'; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717A'; } }}>
                                    <item.icon size={15} />
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* ── DIVIDER ─────────────────────────────────────────────── */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 12px 10px', flexShrink: 0 }} />

                {/* ── PINNED CHATS ─────────────────────────────────────────── */}
                {pinned.length > 0 && (
                    <div style={{ padding: '0 10px 8px', flexShrink: 0 }}>
                        <div style={{ padding: '2px 10px 6px', fontSize: '0.67rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <FiBookmark size={9} /> Pinned
                        </div>
                        {pinned.map(conv => (
                            <ConvItem key={conv._id} conv={conv} active={currentConversationId === conv._id}
                                onSelect={handleSelect} onPin={handlePin} onDelete={handleDelete} onRename={handleRename} />
                        ))}
                    </div>
                )}


                {/* ── BOTTOM NAV + USER ───────────────────────────────────── */}
                <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                    {/* Bottom nav items */}
                    {bottomNavItems.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 8, marginBottom: 1, cursor: 'pointer', transition: 'all 0.12s', background: active ? 'rgba(255,255,255,0.06)' : 'transparent', color: active ? '#fff' : '#71717A', fontSize: '0.84rem', fontWeight: active ? 600 : 400 }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#A1A1AA'; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717A'; } }}>
                                    <item.icon size={14} /> {item.label}
                                </div>
                            </Link>
                        );
                    })}

                    {/* Admin Panel link (only for admins) */}
                    {user?.role === 'admin' && (
                        <a href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 8, marginBottom: 1, cursor: 'pointer', transition: 'all 0.12s', background: 'rgba(220,38,38,0.06)', color: '#EF4444', fontSize: '0.84rem', fontWeight: 600, border: '1px solid rgba(220,38,38,0.12)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.25)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.12)'; }}>
                                <FiShield size={14} /> Admin Panel
                            </div>
                        </a>
                    )}

                    {/* Upgrade banner */}
                    <div style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, padding: '10px 12px', margin: '8px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                            <FiZap size={12} color="#A78BFA" />
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A78BFA' }}>Free Plan</span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#3F3F46', marginBottom: 8, lineHeight: 1.4 }}>Upgrade for unlimited AI + voice assistant</div>
                        <Link href="/pricing" style={{ textDecoration: 'none' }}>
                            <button style={{ width: '100%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff', border: 'none', padding: '5px 0', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                                Upgrade to Pro
                            </button>
                        </Link>
                    </div>

                    {/* User row */}
                    {user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                                <div style={{ fontSize: '0.66rem', color: '#3F3F46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                            </div>
                            <button onClick={logout} title="Sign out"
                                style={{ background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 5, transition: 'all 0.15s', flexShrink: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#3F3F46'; e.currentTarget.style.background = 'transparent'; }}>
                                <FiLogOut size={13} />
                            </button>
                        </div>
                    )}
                </div>
            </motion.aside>

            <style>{`
                @media (max-width: 768px) {
                    .sidebar-mobile-overlay { display: block; }
                }
                @media (min-width: 769px) {
                    .sidebar-mobile-overlay { display: none; }
                }
            `}</style>
        </>
    );
}

// ── Mobile Bottom Tab Bar ─────────────────────────────────────────────────────
// Only visible on mobile (≤768px), provides thumb-friendly navigation
function MobileBottomNav() {
    const pathname = usePathname();

    const tabs = [
        { href: '/dashboard', icon: FiHome, label: 'Home' },
        { href: '/chat', icon: FiMessageSquare, label: 'Chat' },
        { href: '/tools', icon: FiCpu, label: 'Tools' },
        { href: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
    ];

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100,
            background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', height: 60,
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            paddingBottom: 'env(safe-area-inset-bottom)',
        }} className="mobile-bottom-nav">
            {tabs.map(tab => {
                const active = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));
                return (
                    <Link key={tab.href} href={tab.href} style={{ flex: 1, textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: 3, padding: '8px 0',
                            color: active ? '#A78BFA' : '#52525B',
                            transition: 'color 0.15s',
                        }}>
                            <div style={{
                                position: 'relative',
                                width: 36, height: 28,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 10,
                                background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                                transition: 'background 0.2s',
                            }}>
                                <tab.icon size={18} />
                                {active && (
                                    <div style={{
                                        position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                                        width: 4, height: 4, borderRadius: '50%',
                                        background: '#A78BFA',
                                    }} />
                                )}
                            </div>
                            <span style={{ fontSize: '0.6rem', fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}

// Re-export with mobile nav injected
export { MobileBottomNav };

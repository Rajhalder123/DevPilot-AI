'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiMessageSquare, FiSearch, FiTrash2, FiClock, FiChevronRight } from 'react-icons/fi';

const mockHistory = [
    { id: '1', title: 'Fix useEffect infinite loop in React', preview: 'The issue is that you have an object in your dependency array...', time: '2 hours ago', messages: 12 },
    { id: '2', title: 'Build REST API with JWT authentication', preview: 'Here is the complete Express.js setup with middleware...', time: '5 hours ago', messages: 24 },
    { id: '3', title: 'MongoDB aggregation pipeline for analytics', preview: 'Use $group and $project stages to compute the required metrics...', time: 'Yesterday', messages: 8 },
    { id: '4', title: 'TypeScript generics explained with examples', preview: 'Generics allow you to write type-safe, reusable code...', time: 'Yesterday', messages: 16 },
    { id: '5', title: 'Optimize React component performance', preview: 'Use React.memo, useMemo, and useCallback strategically...', time: '2 days ago', messages: 20 },
    { id: '6', title: 'Docker container setup for Node.js app', preview: 'Your Dockerfile should use multi-stage builds to reduce image size...', time: '3 days ago', messages: 9 },
];

export default function HistoryPage() {
    const [search, setSearch] = useState('');
    const filtered = mockHistory.filter(h =>
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.preview.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '32px 36px', maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff', marginBottom: 4, fontFamily: 'var(--font-outfit)' }}>Chat History</h1>
                        <p style={{ color: '#71717A', fontSize: '0.9rem' }}>All your past conversations with DevPilot AI</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, color: '#A78BFA' }}>
                        <FiClock size={13} /> {mockHistory.length} conversations
                    </div>
                </div>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                    <input
                        type="text" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px 12px 42px', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-inter)', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.4)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
                    />
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#3F3F46' }}>
                        <FiMessageSquare size={32} style={{ marginBottom: 12 }} />
                        <div style={{ fontSize: '0.9rem' }}>No conversations found</div>
                    </div>
                ) : (
                    filtered.map((h, i) => (
                        <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Link href={`/chat?id=${h.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.background = 'rgba(124,58,237,0.04)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = '#111'; }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FiMessageSquare size={18} color="#A78BFA" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E4E4E7', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                                        <div style={{ fontSize: '0.82rem', color: '#71717A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.preview}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#3F3F46', marginBottom: 4 }}>{h.time}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#3F3F46' }}>{h.messages} messages</div>
                                    </div>
                                    <FiChevronRight size={16} color="#3F3F46" />
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

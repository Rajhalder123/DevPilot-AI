'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiMessageSquare, FiCpu, FiChevronLeft, FiChevronRight, FiTrash2, FiEye, FiX, FiAlertTriangle } from 'react-icons/fi';
import api from '@/lib/api';

type Tab = 'resumes' | 'conversations' | 'interviews';

function ConfirmModal({ title, message, confirmText, onConfirm, onCancel }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={onCancel}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px', maxWidth: 420, width: '100%', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiAlertTriangle size={18} color="#EF4444" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
                </div>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={onCancel} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#A1A1AA', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={onConfirm} style={{ padding: '10px 20px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, color: '#FCA5A5', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>{confirmText}</button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function DetailModal({ title, onClose, children }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px', maxWidth: 700, width: '100%', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#71717A', display: 'flex' }}><FiX size={16} /></button>
                </div>
                {children}
            </motion.div>
        </motion.div>
    );
}

export default function AdminContentPage() {
    const [tab, setTab] = useState<Tab>('resumes');
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState<any>(null);
    const [detail, setDetail] = useState<any>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchContent = async (t: Tab, page = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/content/${t}`, { params: { page, limit: 15 } });
            const key = t === 'resumes' ? 'resumes' : t === 'conversations' ? 'conversations' : 'interviews';
            setData(res.data[key] || []);
            setPagination(res.data.pagination);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchContent(tab, 1); }, [tab]);

    const handleView = async (id: string) => {
        setDetailLoading(true);
        try {
            const res = await api.get(`/admin/content/${tab}/${id}`);
            const key = tab === 'resumes' ? 'resume' : tab === 'conversations' ? 'conversation' : 'interview';
            setDetail({ type: tab, data: res.data[key] });
        } catch (err) { console.error(err); alert('Failed to load details'); }
        finally { setDetailLoading(false); }
    };

    const handleDelete = (id: string, name: string) => {
        setConfirm({
            title: `Delete ${tab.slice(0, -1)}`,
            message: `Permanently delete "${name}"? This cannot be undone.`,
            confirmText: 'Delete Forever',
            onConfirm: async () => {
                try {
                    await api.delete(`/admin/content/${tab}/${id}`);
                    setData(prev => prev.filter(item => item._id !== id));
                    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
                } catch (err: any) { alert(err.response?.data?.error || 'Failed to delete'); }
                setConfirm(null);
            },
        });
    };

    const tabs: { key: Tab; icon: any; label: string }[] = [
        { key: 'resumes', icon: FiFileText, label: 'Resumes' },
        { key: 'conversations', icon: FiMessageSquare, label: 'Conversations' },
        { key: 'interviews', icon: FiCpu, label: 'Interviews' },
    ];

    const renderDetail = () => {
        if (!detail) return null;
        const { type, data: d } = detail;

        if (type === 'conversations') {
            return (
                <DetailModal title={d.title || 'Conversation'} onClose={() => setDetail(null)}>
                    <div style={{ fontSize: '0.82rem', color: '#71717A', marginBottom: 16 }}>
                        By: {d.userId?.name || 'Unknown'} • {d.messages?.length || 0} messages
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {(d.messages || []).map((msg: any, i: number) => (
                            <div key={i} style={{
                                padding: '12px 16px', borderRadius: 12,
                                background: msg.role === 'user' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${msg.role === 'user' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)'}`,
                            }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: msg.role === 'user' ? '#A78BFA' : '#71717A', textTransform: 'uppercase', marginBottom: 6 }}>
                                    {msg.role}
                                </div>
                                <div style={{ fontSize: '0.88rem', color: '#D4D4D8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </DetailModal>
            );
        }

        if (type === 'resumes') {
            const analysis = d.analysis || {};
            return (
                <DetailModal title={d.fileName || 'Resume'} onClose={() => setDetail(null)}>
                    <div style={{ fontSize: '0.82rem', color: '#71717A', marginBottom: 16 }}>
                        By: {d.userId?.name || 'Unknown'} • Status: {d.status}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#A78BFA' }}>{analysis.overallScore ?? '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717A' }}>Overall Score</div>
                        </div>
                        <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#06B6D4' }}>{analysis.atsScore ?? '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717A' }}>ATS Score</div>
                        </div>
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10B981' }}>{analysis.experienceLevel ?? '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717A' }}>Experience</div>
                        </div>
                    </div>
                    {analysis.summary && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#52525B', textTransform: 'uppercase', marginBottom: 8 }}>Summary</div>
                            <div style={{ fontSize: '0.88rem', color: '#D4D4D8', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>{analysis.summary}</div>
                        </div>
                    )}
                    {analysis.strengths?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: 8 }}>Strengths</div>
                            <ul style={{ paddingLeft: 20, color: '#A1A1AA', fontSize: '0.85rem', lineHeight: 1.8 }}>
                                {analysis.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                    {analysis.improvements?.length > 0 && (
                        <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: 8 }}>Improvements</div>
                            <ul style={{ paddingLeft: 20, color: '#A1A1AA', fontSize: '0.85rem', lineHeight: 1.8 }}>
                                {analysis.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                </DetailModal>
            );
        }

        if (type === 'interviews') {
            return (
                <DetailModal title={`Interview: ${d.topic}`} onClose={() => setDetail(null)}>
                    <div style={{ fontSize: '0.82rem', color: '#71717A', marginBottom: 16 }}>
                        By: {d.userId?.name || 'Unknown'} • Difficulty: {d.difficulty} • Status: {d.status}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10B981' }}>{d.score ?? '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717A' }}>Score</div>
                        </div>
                        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#A78BFA' }}>{d.questionsAsked ?? '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717A' }}>Questions Asked</div>
                        </div>
                        <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#06B6D4' }}>{d.questionsAnswered ?? '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717A' }}>Answered</div>
                        </div>
                    </div>
                    {d.feedback && (
                        <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#52525B', textTransform: 'uppercase', marginBottom: 8 }}>Feedback</div>
                            <div style={{ fontSize: '0.88rem', color: '#D4D4D8', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'pre-wrap' }}>{d.feedback}</div>
                        </div>
                    )}
                    {d.questions?.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#52525B', textTransform: 'uppercase', marginBottom: 12 }}>Questions & Answers</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {d.questions.map((q: any, i: number) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#A78BFA', marginBottom: 6 }}>Q{i + 1}: {q.question}</div>
                                        {q.answer && <div style={{ fontSize: '0.85rem', color: '#A1A1AA', lineHeight: 1.6 }}>A: {q.answer}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DetailModal>
            );
        }

        return null;
    };

    return (
        <div>
            <AnimatePresence>
                {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
                {detail && renderDetail()}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-outfit)', marginBottom: 6 }}>Content Browser</h1>
                <p style={{ color: '#71717A', fontSize: '0.95rem' }}>View and manage all platform content — full admin access</p>
            </motion.div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10,
                            fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                            background: tab === t.key ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${tab === t.key ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            color: tab === t.key ? '#A78BFA' : '#71717A', transition: 'all 0.2s',
                        }}>
                        <t.icon size={14} /> {t.label}
                        {!loading && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#52525B' }}>{pagination.total}</span>}
                    </button>
                ))}
            </div>

            {/* Content Table */}
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
                {tab === 'resumes' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 80px 110px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 12 }}>
                            {['File Name', 'User', 'Score', 'ATS', 'Created', 'Actions'].map(h => (
                                <div key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                            ))}
                        </div>
                        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 50, borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="animate-pulse" />) :
                            data.map((item: any) => (
                                <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 80px 110px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', gap: 12 }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.fileName}</div>
                                    <div style={{ fontSize: '0.82rem', color: '#71717A' }}>{item.userId?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA' }}>{item.analysis?.overallScore ?? '—'}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06B6D4' }}>{item.analysis?.atsScore ?? '—'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#52525B' }}>{new Date(item.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={() => handleView(item._id)} style={{ padding: '5px 7px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, color: '#A78BFA', cursor: 'pointer', display: 'flex' }}><FiEye size={13} /></button>
                                        <button onClick={() => handleDelete(item._id, item.fileName)} style={{ padding: '5px 7px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#EF4444', cursor: 'pointer', display: 'flex' }}><FiTrash2 size={13} /></button>
                                    </div>
                                </div>
                            ))}
                    </>
                )}

                {tab === 'conversations' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 110px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 12 }}>
                            {['Title', 'User', 'Messages', 'Last Active', 'Actions'].map(h => (
                                <div key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                            ))}
                        </div>
                        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 50, borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="animate-pulse" />) :
                            data.map((item: any) => (
                                <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 110px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', gap: 12 }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'Untitled'}</div>
                                    <div style={{ fontSize: '0.82rem', color: '#71717A' }}>{item.userId?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8B5CF6' }}>{item.messageCount}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#52525B' }}>{new Date(item.lastMessageAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={() => handleView(item._id)} style={{ padding: '5px 7px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, color: '#A78BFA', cursor: 'pointer', display: 'flex' }}><FiEye size={13} /></button>
                                        <button onClick={() => handleDelete(item._id, item.title || 'conversation')} style={{ padding: '5px 7px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#EF4444', cursor: 'pointer', display: 'flex' }}><FiTrash2 size={13} /></button>
                                    </div>
                                </div>
                            ))}
                    </>
                )}

                {tab === 'interviews' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 90px 70px 80px 100px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 12 }}>
                            {['Topic', 'User', 'Difficulty', 'Score', 'Status', 'Created', 'Actions'].map(h => (
                                <div key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                            ))}
                        </div>
                        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 50, borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="animate-pulse" />) :
                            data.map((item: any) => (
                                <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 90px 70px 80px 100px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', gap: 12 }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.topic}</div>
                                    <div style={{ fontSize: '0.82rem', color: '#71717A' }}>{item.userId?.name || 'Unknown'}</div>
                                    <div><span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B' }}>{item.difficulty}</span></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>{item.score ?? '—'}</div>
                                    <div><span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: item.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(124,58,237,0.1)', border: `1px solid ${item.status === 'completed' ? 'rgba(16,185,129,0.25)' : 'rgba(124,58,237,0.25)'}`, color: item.status === 'completed' ? '#10B981' : '#A78BFA' }}>{item.status}</span></div>
                                    <div style={{ fontSize: '0.8rem', color: '#52525B' }}>{new Date(item.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={() => handleView(item._id)} style={{ padding: '5px 7px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, color: '#A78BFA', cursor: 'pointer', display: 'flex' }}><FiEye size={13} /></button>
                                        <button onClick={() => handleDelete(item._id, item.topic)} style={{ padding: '5px 7px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#EF4444', cursor: 'pointer', display: 'flex' }}><FiTrash2 size={13} /></button>
                                    </div>
                                </div>
                            ))}
                    </>
                )}

                {!loading && data.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#3F3F46' }}>No content found</div>}
            </div>

            {pagination.pages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                    <button onClick={() => fetchContent(tab, pagination.page - 1)} disabled={pagination.page <= 1}
                        style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#71717A', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', display: 'flex', opacity: pagination.page <= 1 ? 0.4 : 1 }}><FiChevronLeft size={16} /></button>
                    <span style={{ fontSize: '0.85rem', color: '#71717A' }}>Page {pagination.page} of {pagination.pages}</span>
                    <button onClick={() => fetchContent(tab, pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                        style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#71717A', cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer', display: 'flex', opacity: pagination.page >= pagination.pages ? 0.4 : 1 }}><FiChevronRight size={16} /></button>
                </div>
            )}
        </div>
    );
}

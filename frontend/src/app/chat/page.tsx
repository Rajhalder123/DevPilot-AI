'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMic, FiPaperclip, FiX, FiZap, FiCopy, FiCheck, FiCode, FiTerminal, FiPlus,
    FiMoreHorizontal, FiEdit3, FiBookmark, FiTrash2, FiClock, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useConversation } from '@/context/ConversationContext';

interface Conversation { _id: string; title?: string; updatedAt: string; pinned?: boolean; }

// ── Conversation context menu ─────────────────────────────────────────────────
function ConvContextMenu({ conv, onRename, onPin, onDelete, onClose }: any) {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose(); };
        setTimeout(() => document.addEventListener('mousedown', h), 0);
        return () => document.removeEventListener('mousedown', h);
    }, [onClose]);
    const items = [
        { icon: FiEdit3,    label: 'Rename', action: () => { onRename(conv); onClose(); } },
        { icon: FiBookmark, label: conv.pinned ? 'Unpin' : 'Pin', action: () => { onPin(conv); onClose(); } },
        { icon: FiTrash2,   label: 'Delete', danger: true, action: () => { onDelete(conv._id); onClose(); } },
    ];
    return (
        <motion.div ref={menuRef} initial={{ opacity: 0, scale: 0.92, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.12 }}
            style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, width: 190, background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 16px 50px rgba(0,0,0,0.7)', padding: '6px' }}>
            {items.map((item, i) => (
                <button key={i} onClick={item.action}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', color: item.danger ? '#EF4444' : '#A1A1AA', fontSize: '0.83rem', fontWeight: 500, textAlign: 'left', transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = item.danger ? '#FCA5A5' : '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = item.danger ? '#EF4444' : '#A1A1AA'; }}>
                    <item.icon size={13} /> {item.label}
                </button>
            ))}
        </motion.div>
    );
}

// ── Single conversation row ───────────────────────────────────────────────────
function ConvItem({ conv, active, onSelect, onPin, onDelete, onRename }: any) {
    const [hovered, setHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(conv.title || '');
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { if (renaming) inputRef.current?.focus(); }, [renaming]);
    const submitRename = () => { onRename(conv._id, newTitle.trim() || conv.title); setRenaming(false); };
    return (
        <div style={{ position: 'relative' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div onClick={() => !renaming && onSelect(conv._id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, cursor: 'pointer', background: active ? 'rgba(124,58,237,0.12)' : hovered ? 'rgba(255,255,255,0.04)' : 'transparent', border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'transparent'}`, transition: 'all 0.12s', marginBottom: 2 }}>
                {conv.pinned && <FiBookmark size={10} color="#7C3AED" style={{ flexShrink: 0 }} />}
                {renaming ? (
                    <input ref={inputRef} value={newTitle} onChange={e => setNewTitle(e.target.value)} onBlur={submitRename}
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
                        style={{ background: menuOpen ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '3px 4px', borderRadius: 5, display: 'flex', flexShrink: 0 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#71717A'}>
                        <FiMoreHorizontal size={13} />
                    </button>
                )}
            </div>
            <AnimatePresence>
                {menuOpen && <ConvContextMenu conv={conv} onRename={() => setRenaming(true)} onPin={onPin} onDelete={onDelete} onClose={() => setMenuOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}

// CodeBlock with copy button
const CodeBlock = ({ children, className }: any) => {
    const [copied, setCopied] = useState(false);
    const lang = className?.replace('language-', '') || 'code';
    const handleCopy = () => { navigator.clipboard.writeText(String(children)); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (
        <div style={{ position: 'relative', marginBottom: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ padding: '8px 14px', background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiTerminal size={11} color="#7C3AED" />
                    <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase' }}>{lang}</span>
                </div>
                <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: copied ? '#10B981' : '#71717A', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                    {copied ? <FiCheck size={11} /> : <FiCopy size={11} />} {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre style={{ padding: '14px', background: '#050505', margin: 0, overflowX: 'auto', fontSize: 13, lineHeight: 1.7, color: '#A78BFA' }}>
                <code>{children}</code>
            </pre>
        </div>
    );
};

const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
        if (inline) return <code style={{ background: 'rgba(124,58,237,0.15)', padding: '1px 6px', borderRadius: 4, fontSize: '0.88em', color: '#A78BFA', fontFamily: 'monospace' }} {...props}>{children}</code>;
        return <CodeBlock className={className}>{children}</CodeBlock>;
    },
};

const quickPrompts = [
    { icon: FiCode, label: 'Generate React Component', prompt: 'Generate a reusable React component for a modal dialog with TypeScript props and dark theme styling.' },
    { icon: FiTerminal, label: 'Fix This Bug', prompt: 'Help me fix this bug: ' },
    { icon: FiZap, label: 'Explain Code', prompt: 'Explain this code in simple terms: ' },
    { icon: FiPlus, label: 'Create API Route', prompt: 'Create a REST API endpoint in Node.js/Express for user authentication with JWT.' },
];

export default function ChatPage() {
    const { user } = useAuth();
    const { currentConversationId, setCurrentConversationId } = useConversation();
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    // Real conversations state (replaces static mock)
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [convLoading, setConvLoading] = useState(true);



    const bottomRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recRef = useRef<any>(null);

    useEffect(() => {
        if (!currentConversationId) { setMessages([]); return; }
        api.get(`/career-mentor/history/${currentConversationId}`)
            .then(r => setMessages(r.data.messages || []))
            .catch(() => { });
    }, [currentConversationId]);

    // Fetch real conversations for the sidebar
    const fetchConvs = useCallback(async () => {
        try {
            const res = await api.get('/career-mentor/conversations');
            setConversations(res.data.conversations || []);
        } catch { }
        finally { setConvLoading(false); }
    }, []);
    useEffect(() => { fetchConvs(); }, [fetchConvs]);

    const handleConvSelect = (id: string) => { setCurrentConversationId(id); };
    const handleConvPin = (conv: Conversation) => setConversations(p => p.map(c => c._id === conv._id ? { ...c, pinned: !c.pinned } : c));
    const handleConvDelete = async (id: string) => {
        setConversations(p => p.filter(c => c._id !== id));
        if (currentConversationId === id) { setCurrentConversationId(null); setMessages([]); }
        try { await api.delete(`/career-mentor/conversations/${id}`); } catch { }
    };
    const handleConvRename = async (id: string, title: string) => {
        setConversations(p => p.map(c => c._id === id ? { ...c, title } : c));
        try { await api.patch(`/career-mentor/conversations/${id}`, { title }); } catch { }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;
        recRef.current = new SR();
        recRef.current.continuous = false;
        recRef.current.interimResults = false;
        recRef.current.onstart = () => setIsListening(true);
        recRef.current.onresult = (e: any) => { setInput(p => p + ' ' + e.results[0][0].transcript); setIsListening(false); };
        recRef.current.onerror = () => setIsListening(false);
        recRef.current.onend = () => setIsListening(false);
    }, []);

    const toggleListen = () => {
        if (!recRef.current) return;
        try { isListening ? recRef.current.stop() : recRef.current.start(); }
        catch { setIsListening(false); }
    };

    const handleSend = async (e?: React.FormEvent, overrideMsg?: string) => {
        if (e) e.preventDefault();
        const content = overrideMsg || (attachedFile ? `[File: ${attachedFile.name}]\n${input.trim()}` : input.trim());
        if (!content) return;
        setMessages(prev => [...prev, { role: 'user', content }]);
        setInput(''); setAttachedFile(null); setIsTyping(true);
        try {
            const res = await api.post('/career-mentor/chat', { message: content, conversationId: currentConversationId, history: messages.map(m => ({ role: m.role, content: m.content })) });
            if (!currentConversationId && res.data.conversationId) setCurrentConversationId(res.data.conversationId);
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response || 'How can I help?' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please try again.' }]);
        } finally { setIsTyping(false); }
    };

    // Edit a user message: truncate history after that index and re-send
    const handleEditSubmit = async (idx: number) => {
        const newText = editText.trim();
        if (!newText) return;
        setEditingIdx(null);
        // Keep messages up to (but not including) the edited message, then re-add the edited one
        const historyBefore = messages.slice(0, idx);
        setMessages([...historyBefore, { role: 'user', content: newText }]);
        setIsTyping(true);
        try {
            const res = await api.post('/career-mentor/chat', {
                message: newText,
                conversationId: currentConversationId,
                history: historyBefore.map(m => ({ role: m.role, content: m.content }))
            });
            if (!currentConversationId && res.data.conversationId) setCurrentConversationId(res.data.conversationId);
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response || 'How can I help?' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please try again.' }]);
        } finally { setIsTyping(false); }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    return (
        <div style={{ height: '100%', display: 'flex', overflow: 'hidden', background: '#050505' }}>

            {/* ── History Sidebar (real conversations) ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 250, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ borderRight: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Panel header */}
                        <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiClock size={11} color="#3F3F46" />
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Chats</span>
                                </div>
                                <button onClick={() => { setMessages([]); setCurrentConversationId(null); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 7, color: '#A78BFA', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}>
                                    <FiPlus size={11} /> New
                                </button>
                            </div>
                        </div>

                        {/* Conversation list */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }} className="hide-scrollbar">
                            {convLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} style={{ height: 40, background: 'rgba(255,255,255,0.03)', borderRadius: 9, marginBottom: 3 }} className="animate-pulse" />
                                ))
                            ) : conversations.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '30px 12px', textAlign: 'center' }}>
                                    <FiMessageSquare size={22} color="#3F3F46" />
                                    <p style={{ fontSize: '0.78rem', color: '#3F3F46', margin: 0 }}>No conversations yet</p>
                                    <p style={{ fontSize: '0.7rem', color: '#27272A', margin: 0 }}>Start chatting to see history here</p>
                                </div>
                            ) : (
                                conversations.map(conv => (
                                    <ConvItem key={conv._id} conv={conv}
                                        active={currentConversationId === conv._id}
                                        onSelect={handleConvSelect}
                                        onPin={handleConvPin}
                                        onDelete={handleConvDelete}
                                        onRename={handleConvRename}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Chat Area ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Chat Header */}
                <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.06)', color: '#71717A', cursor: 'pointer', padding: '5px 9px', borderRadius: 7, fontSize: '0.78rem', transition: 'all 0.2s' }}>
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <motion.div
                                animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 12px rgba(124,58,237,0.5)', '0 0 0px rgba(124,58,237,0)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FiZap size={14} color="#fff" />
                            </motion.div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>DevPilot AI</div>
                                <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>● Online</div>
                            </div>
                        </div>
                    </div>
                    {messages.length > 0 && (
                        <button onClick={() => { setMessages([]); setCurrentConversationId(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#71717A', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}>
                            <FiX size={13} /> New Chat
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }} className="hide-scrollbar">

                    {/* Empty state */}
                    {messages.length === 0 && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24, paddingBottom: 80 }}>
                            <motion.div
                                animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 40px rgba(124,58,237,0.4)', '0 0 0px rgba(124,58,237,0)'] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                                style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FiZap size={28} color="#fff" />
                            </motion.div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: 'var(--font-outfit)' }}>
                                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Developer'} 
                                </h2>
                                <p style={{ color: '#71717A', fontSize: '1rem' }}>What do you want to build today?</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 520 }}>
                                {quickPrompts.map(q => (
                                    <motion.button
                                        key={q.label}
                                        onClick={() => handleSend(undefined, q.prompt)}
                                        whileHover={{ scale: 1.02, borderColor: 'rgba(124,58,237,0.4)' }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ padding: '14px 16px', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                                    >
                                        <q.icon size={16} color="#7C3AED" style={{ marginBottom: 8 }} />
                                        <div style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>{q.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages list */}
                    {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', gap: 14, maxWidth: msg.role === 'user' ? '80%' : '100%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: msg.role === 'assistant' ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 800, border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                {msg.role === 'assistant' ? <FiZap size={14} /> : (user?.name?.charAt(0) || 'U')}
                            </div>

                            {/* User message — editable on hover */}
                            {msg.role === 'user' ? (
                                <div style={{ position: 'relative' }} className="group">
                                    {editingIdx === i ? (
                                        /* ── Inline edit textarea ── */
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220, maxWidth: 480 }}>
                                            <textarea
                                                autoFocus
                                                value={editText}
                                                onChange={e => setEditText(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSubmit(i); }
                                                    if (e.key === 'Escape') { setEditingIdx(null); }
                                                }}
                                                rows={Math.min(6, editText.split('\n').length + 1)}
                                                style={{ width: '100%', padding: '12px 14px', background: '#1A1A2E', border: '2px solid rgba(124,58,237,0.5)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', lineHeight: 1.6, resize: 'none', outline: 'none', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                            />
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button onClick={() => setEditingIdx(null)}
                                                    style={{ padding: '5px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#71717A', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                                                    Cancel
                                                </button>
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleEditSubmit(i)}
                                                    disabled={!editText.trim()}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 16px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.78rem', cursor: editText.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, opacity: editText.trim() ? 1 : 0.5 }}>
                                                    <FiSend size={12} /> Send
                                                </motion.button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── Normal user bubble with hover edit pencil ── */
                                        <div style={{ position: 'relative' }}
                                            onMouseEnter={e => { const btn = e.currentTarget.querySelector('.edit-btn') as HTMLElement; if (btn) btn.style.opacity = '1'; }}
                                            onMouseLeave={e => { const btn = e.currentTarget.querySelector('.edit-btn') as HTMLElement; if (btn) btn.style.opacity = '0'; }}>
                                            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', borderRadius: '16px 4px 16px 16px', padding: '12px 16px', maxWidth: '100%' }}>
                                                <p style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                                            </div>
                                            {/* Edit pencil — visible on hover */}
                                            <button
                                                className="edit-btn"
                                                onClick={() => { setEditingIdx(i); setEditText(msg.content); }}
                                                title="Edit message"
                                                style={{ position: 'absolute', top: -8, left: -8, width: 26, height: 26, background: '#1A1A2E', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.18s', zIndex: 10 }}>
                                                <FiEdit3 size={11} color="#A78BFA" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* ── AI assistant bubble (unchanged) ── */
                                <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', maxWidth: '100%' }}>
                                    <div className="markdown-content" style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#E4E4E7' }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FiZap size={14} color="#fff" />
                            </div>
                            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                                {[0, 0.2, 0.4].map((d, i) => (
                                    <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, delay: d, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C3AED' }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* ── Input Bar ── */}
                <div style={{ padding: '16px 24px 20px', flexShrink: 0, background: 'linear-gradient(to top, #050505 70%, transparent)' }}>
                    {attachedFile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, marginBottom: 10, width: 'fit-content' }}>
                            <FiPaperclip size={12} color="#A78BFA" />
                            <span style={{ fontSize: '0.78rem', color: '#A78BFA' }}>{attachedFile.name}</span>
                            <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', padding: 0, display: 'flex' }}><FiX size={12} /></button>
                        </div>
                    )}
                    <form onSubmit={handleSend} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'flex-end', gap: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.4)', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                    >
                        <button type="button" onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s', flexShrink: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#A1A1AA')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#3F3F46')}>
                            <FiPaperclip size={18} />
                        </button>
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask DevPilot anything..."
                            rows={1}
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-inter)', maxHeight: 120, lineHeight: 1.6, padding: '4px 0' }}
                        />
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                            <button type="button" onClick={toggleListen} style={{ background: isListening ? 'rgba(239,68,68,0.15)' : 'none', border: 'none', color: isListening ? '#EF4444' : '#3F3F46', cursor: 'pointer', padding: '6px', borderRadius: 8, display: 'flex', transition: 'all 0.2s' }}>
                                <FiMic size={18} className={isListening ? 'animate-pulse' : ''} />
                            </button>
                            <motion.button
                                type="submit" disabled={!input.trim() && !attachedFile}
                                whileHover={input.trim() ? { scale: 1.05 } : {}}
                                whileTap={input.trim() ? { scale: 0.95 } : {}}
                                style={{ width: 38, height: 38, background: input.trim() ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s', opacity: input.trim() ? 1 : 0.4 }}
                            >
                                <FiSend size={16} color="#fff" />
                            </motion.button>
                        </div>
                    </form>
                    <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={e => e.target.files?.[0] && setAttachedFile(e.target.files[0])} />
                    <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#3F3F46', marginTop: 10 }}>DevPilot AI · Press Shift+Enter for new line</p>
                </div>
            </div>
        </div>
    );
}

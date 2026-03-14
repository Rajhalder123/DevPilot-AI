'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCompass, FiSend, FiRefreshCw, FiCpu } from 'react-icons/fi';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const QUICK_PROMPTS = [
    'How should I prepare for a FAANG interview?',
    'What skills should I learn for React developer role?',
    'Create a 6-month study plan for DSA',
    'How to improve my GitHub profile for recruiters?',
    'What salary should I expect as a fresher?',
    'How to negotiate salary effectively?',
];

export default function CareerMentorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm your AI Career Mentor \n\nI'm here to help you navigate your developer career. Ask me anything about:\n• Interview preparation strategies\n• Career roadmaps for your goals\n• Salary negotiation & market insights\n• Skills you should learn next\n• Resume & portfolio advice\n\nWhat's on your mind today?",
        }
    ]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg || sending) return;
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setInput('');
        setSending(true);
        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const res = await api.post('/career-mentor/chat', { message: msg, history });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply || res.data.message }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 124px)' }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
                <div className="section-label"><FiCompass size={11} /> AI Career Mentor</div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                    Career <span className="gradient-text">Mentor</span>
                </h1>
            </motion.div>

            {/* Chat Container */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0', paddingRight: 4, marginBottom: 16 }}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end', gap: 10,
                            }}
                        >
                            {msg.role === 'assistant' && (
                                <div style={{
                                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                                }}>
                                    <FiCpu size={15} color="#fff" />
                                </div>
                            )}
                            <div
                                style={{
                                    maxWidth: '75%',
                                    padding: '14px 18px',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: msg.role === 'user'
                                        ? 'var(--primary)'
                                        : '#F1F5F9',
                                    color: msg.role === 'user' ? '#FFFFFF' : '#334155',
                                    border: msg.role === 'assistant' ? '1px solid rgba(15, 23, 42, 0.05)' : 'none',
                                    fontSize: '0.88rem', lineHeight: 1.75,
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {sending && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: 10,
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FiCpu size={15} color="#fff" />
                            </div>
                            <div style={{
                                padding: '14px 18px', borderRadius: '16px 16px 16px 4px',
                                background: '#F1F5F9', border: '1px solid rgba(15, 23, 42, 0.05)',
                                display: 'flex', gap: 5, alignItems: 'center',
                            }}>
                                {[0, 1, 2].map(j => (
                                    <motion.span key={j}
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.7, delay: j * 0.15 }}
                                        style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                <AnimatePresence>
                    {messages.length <= 1 && (
                        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 8, fontWeight: 600 }}>✨ Try asking:</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {QUICK_PROMPTS.map((p, i) => (
                                    <button key={i} onClick={() => sendMessage(p)} style={{
                                        background: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.2)',
                                        borderRadius: 10, padding: '6px 12px', color: 'var(--primary)',
                                        fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                        transition: 'all 0.2s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)'; }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input */}
                <div style={{
                    display: 'flex', gap: 10, padding: '12px 14px',
                    background: '#F1F5F9', borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.1)',
                }}>
                    <input
                        className="input"
                        placeholder="Ask about your career, interviews, skills, salary..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                        style={{ border: 'none', background: 'transparent', flex: 1 }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage()}
                        disabled={sending || !input.trim()}
                        style={{
                            width: 40, height: 40, borderRadius: 10, border: 'none',
                            background: sending || !input.trim() ? 'rgba(249, 115, 22, 0.2)' : 'var(--primary)',
                            color: '#FFFFFF', cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'all 0.2s',
                        }}
                    >
                        {sending ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><FiRefreshCw size={16} /></motion.div> : <FiSend size={16} />}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

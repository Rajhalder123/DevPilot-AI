'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMic, FiPaperclip, FiX, FiZap, FiRefreshCw, FiPlus, FiActivity, FiImage, FiEdit3, FiGlobe, FiFileText, FiGithub, FiTarget } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useConversation } from '@/context/ConversationContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import DashboardGithub from '@/components/dashboard/DashboardGithub';
import { CareerScore, InterviewWidget } from '@/components/dashboard/DashboardBottomWidgets';

export default function DashboardPage() {
    const { user } = useAuth();
    const { currentConversationId, setCurrentConversationId } = useConversation();
    const { stats, recentResumes, recentInterviews, githubProjects, loading, error, refetch } = useDashboardData();

    const [prompt, setPrompt] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    // Load chat history when conversation changes
    useEffect(() => {
        if (!currentConversationId) { setChatHistory([]); return; }
        api.get(`/career-mentor/history/${currentConversationId}`)
            .then(r => setChatHistory(r.data.messages || []))
            .catch(() => { });
    }, [currentConversationId]);

    // Speech recognition
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;
        recognitionRef.current = new SR();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onresult = (e: any) => { 
            setPrompt(p => p + ' ' + e.results[0][0].transcript); 
            setIsListening(false); 
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        
        try {
            if (isListening) {
                recognitionRef.current.stop();
            } else {
                recognitionRef.current.start();
            }
        } catch (err) {
            console.error("Speech recognition error:", err);
            setIsListening(false);
        }
    };

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!prompt.trim() && !attachedFile) return;
        const content = attachedFile ? `[File: ${attachedFile.name}]\n${prompt.trim()}` : prompt.trim();
        setChatHistory(prev => [...prev, { role: 'user', content }]);
        setPrompt(''); setAttachedFile(null); setIsTyping(true);
        try {
            const res = await api.post('/career-mentor/chat', { message: content, conversationId: currentConversationId, history: chatHistory.map(m => ({ role: m.role, content: m.content })) });
            if (!currentConversationId && res.data.conversationId) setCurrentConversationId(res.data.conversationId);
            setChatHistory(prev => [...prev, { role: 'assistant', content: res.data.response || "How can I help?" }]);
        } catch {
            setChatHistory(prev => [...prev, { role: 'assistant', content: "My connection is unstable. Please try again!" }]);
        } finally { setIsTyping(false); }
    };

    // ── CHAT VIEW ──────────────────────────────────────────────────────────────
    if (chatHistory.length > 0) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Chat Header */}
                <div style={{ padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--d-border)', background: 'var(--d-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <motion.div 
                            animate={{ boxShadow: ["0 0 0px rgba(99, 102, 241, 0)", "0 0 15px rgba(99, 102, 241, 0.4)", "0 0 0px rgba(99, 102, 241, 0)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: '-50%', opacity: 0.2, background: 'conic-gradient(from 0deg, transparent, white, transparent, white, transparent)' }} />
                            <FiZap size={16} color="#fff" style={{ position: 'relative', zIndex: 10, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} />
                        </motion.div>
                        <span style={{ fontWeight: 600, color: 'var(--d-text)' }}>DevPilot AI Conversation</span>
                    </div>
                    <button 
                        onClick={() => { setCurrentConversationId(null); setChatHistory([]); }} 
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--d-card)', border: '1px solid var(--d-border)', color: 'var(--d-muted)', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }} 
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--d-text)'; e.currentTarget.style.borderColor = 'var(--d-border-hover)'; }} 
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--d-muted)'; e.currentTarget.style.borderColor = 'var(--d-border)'; }}>
                        <FiX size={14} /> Close Chat
                    </button>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 120px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {chatHistory.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', gap: 16, padding: 20, borderRadius: 16, background: msg.role === 'assistant' ? 'var(--d-hover)' : 'transparent', border: msg.role === 'assistant' ? '1px solid var(--d-border)' : 'none' }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: msg.role === 'assistant' ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'var(--d-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.role === 'assistant' ? '#fff' : 'var(--d-text)', flexShrink: 0, fontWeight: 800, fontSize: '0.85rem', border: '1px solid var(--d-border)' }}>
                                {msg.role === 'assistant' ? <FiZap size={16} /> : (user?.name?.charAt(0) || 'U')}
                            </div>
                            <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--d-text)', paddingTop: 4, width: '100%' }} className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: 8, padding: '0 20px', alignItems: 'center' }}>
                            {[0, 0.2, 0.4].map((d, i) => <div key={i} className="animate-pulse" style={{ width: 8, height: 8, background: 'var(--d-accent-text)', borderRadius: '50%', animationDelay: `${d}s` }} />)}
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <CopilotBar prompt={prompt} setPrompt={setPrompt} attachedFile={attachedFile} setAttachedFile={setAttachedFile} isTyping={isTyping} isListening={isListening} onToggleListen={toggleListening} onSend={handleSend} fileInputRef={fileInputRef} />
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => e.target.files?.[0] && setAttachedFile(e.target.files[0])} />
            </div>
        );
    }

    // ── DASHBOARD VIEW ─────────────────────────────────────────────────────
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => e.target.files?.[0] && setAttachedFile(e.target.files[0])} />
            <div style={{ flex: 1, padding: '28px 36px 120px 36px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto' }} className="hide-scrollbar">

                {/* Error Banner */}
                {error && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                        <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', padding: '8px 16px', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
                            <FiRefreshCw size={14} /> Retry Failed Data
                        </button>
                    </div>
                )}

                {/* Top Copilot Bar */}
                <CopilotBar variant="top" prompt={prompt} setPrompt={setPrompt} attachedFile={attachedFile} setAttachedFile={setAttachedFile} isTyping={isTyping} isListening={isListening} onToggleListen={toggleListening} onSend={handleSend} fileInputRef={fileInputRef} />


                {/* Stats Row */}
                <DashboardStatsCards stats={stats} loading={loading} />

                {/* Middle: GitHub */}
                <DashboardGithub projects={githubProjects} loading={loading} />

                {/* Bottom: Career Score + Interviews */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 22 }}>
                    <CareerScore stats={stats} loading={loading} />
                    <InterviewWidget sessions={recentInterviews} loading={loading} />
                </div>
            </div>
        </div>
    );
}

// ── Siri 3D Animated Orb ───────────────────────────────────────────────────
const SiriOrb = ({ isListening }: { isListening: boolean }) => {
    return (
        <div style={{
            position: 'relative',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
        }}>
            {/* Outer ambient glow */}
            <motion.div
                animate={{ scale: isListening ? [1, 1.3, 1] : [1, 1.1, 1], opacity: isListening ? [0.6, 0.9, 0.6] : [0.4, 0.6, 0.4] }}
                transition={{ duration: isListening ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    width: '120%', height: '120%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,0,128,0.4), rgba(121,40,202,0.4), rgba(0,112,243,0.4))',
                    filter: 'blur(20px)',
                }}
            />

            {/* Sphere Container */}
            <div style={{
                position: 'relative',
                width: '100%', height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                boxShadow: 'inset 0 0 15px rgba(255,255,255,0.3), 0 0 10px rgba(121, 40, 202, 0.4)',
                backgroundColor: '#111'
            }}>
                {/* Rotating Gradient Ribbon 1 */}
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                    style={{
                        position: 'absolute',
                        top: '-30%', left: '-30%', right: '-30%', bottom: '-30%',
                        background: 'conic-gradient(from 0deg, transparent, #ff0080, #00dfd8, transparent, #7928ca)',
                        filter: 'blur(10px)',
                        mixBlendMode: 'screen',
                    }}
                />
                
                {/* Rotating Gradient Ribbon 2 */}
                <motion.div
                    animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
                    transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                    style={{
                        position: 'absolute',
                        top: '-30%', left: '-30%', right: '-30%', bottom: '-30%',
                        background: 'conic-gradient(from 180deg, transparent, #0070f3, #ff0080, transparent)',
                        filter: 'blur(10px)',
                        mixBlendMode: 'screen',
                    }}
                />

                {/* Inner bright core */}
                <div style={{
                    position: 'absolute',
                    top: '25%', left: '25%', right: '25%', bottom: '25%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 80%)',
                    filter: 'blur(3px)',
                }} />
            </div>
            
            {/* Glass highlight overlay for 3D effect */}
            <div style={{
                position: 'absolute',
                top: '5%', left: '15%', right: '15%', height: '30%',
                borderRadius: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
                zIndex: 10,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

// ── Shared Copilot Input Bar ───────────────────────────────────────────────
function CopilotBar({ prompt, setPrompt, attachedFile, setAttachedFile, isTyping, isListening, onToggleListen, onSend, fileInputRef, variant = 'bottom' }: any) {
    const isTop = variant === 'top';

    if (isTop) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 50, marginTop: 10 }}>
                <SiriOrb isListening={isListening} />
                
                <div style={{ textAlign: 'center', marginBottom: 24, padding: '0 20px' }}>
                    <p style={{ fontSize: '1.25rem', color: 'var(--d-sub)', lineHeight: 1.6, maxWidth: 600 }}>
                        I am <strong style={{ color: 'var(--d-text)' }}>DevPilot AI</strong>. Ask me to analyze your resume, scan your GitHub, or simulate an interview.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { icon: FiFileText, text: "Analyze Resume" },
                        { icon: FiGithub, text: "Scan GitHub" },
                        { icon: FiActivity, text: "Interview Prep" },
                        { icon: FiTarget, text: "Career Roadmap" }
                    ].map((btn, i) => (
                        <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--d-card)', border: '1px solid var(--d-border)', color: 'var(--d-text)', padding: '10px 20px', borderRadius: 24, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--d-shadow)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--d-border-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--d-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            onClick={() => { setPrompt(btn.text); setTimeout(() => onSend({ preventDefault: () => {} } as any), 50); }}
                        >
                            <btn.icon size={15} color="var(--d-accent-text)" /> {btn.text}
                        </button>
                    ))}
                </div>

                <form onSubmit={onSend} style={{ width: '100%', maxWidth: 750, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {attachedFile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'var(--d-accent)', border: '1px solid var(--d-border-hover)', borderRadius: 8, marginBottom: 8, alignSelf: 'flex-start' }}>
                            <FiPaperclip size={12} color="var(--d-accent-text)" />
                            <span style={{ color: 'var(--d-accent-text)', fontSize: '0.75rem' }}>{attachedFile.name}</span>
                            <button onClick={() => setAttachedFile(null)} type="button" style={{ background: 'none', border: 'none', color: 'var(--d-accent-text)', cursor: 'pointer', lineHeight: 1 }}><FiX size={12} /></button>
                        </div>
                    )}
                    
                    <div style={{ width: '100%', background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 30, padding: '10px 14px 10px 24px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.06)', transition: 'background 0.3s, border-color 0.3s' }}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: 'var(--d-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--d-accent-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--d-text)'}>
                            <FiPlus size={22} />
                        </button>
                        
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                            placeholder="Ask DevPilot AI anything..."
                            rows={1}
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--d-text)', fontSize: '1rem', fontFamily: 'inherit', maxHeight: 80, padding: '6px 0' }}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
                        />
                        
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                            <button type="button" onClick={onToggleListen}
                                style={{ background: 'var(--d-bg)', border: '1px solid var(--d-border)', color: isListening ? '#f43f5e' : 'var(--d-text)', cursor: 'pointer', padding: 8, borderRadius: '50%', width: 42, height: 42, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiMic size={18} className={isListening ? 'animate-pulse' : ''} />
                            </button>
                            <button type="submit" disabled={(!prompt.trim() && !attachedFile) || isTyping}
                                style={{ background: 'var(--d-bg)', color: 'var(--d-text)', border: '1px solid var(--d-border)', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (prompt.trim() || attachedFile) ? 'pointer' : 'default', opacity: (prompt.trim() || attachedFile) ? 1 : 0.5, transition: 'all 0.2s' }}>
                                <FiSend size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Bottom Input Links */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, padding: '0 16px' }}>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: 'var(--d-sub)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'color 0.2s', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color='var(--d-text)'} onMouseLeave={e => e.currentTarget.style.color='var(--d-sub)'}>
                                <FiFileText size={14} /> Upload Resume (PDF)
                            </button>
                            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: 'var(--d-sub)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'color 0.2s', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color='var(--d-text)'} onMouseLeave={e => e.currentTarget.style.color='var(--d-sub)'}>
                                <FiPaperclip size={14} /> Attach File
                            </button>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--d-muted)', fontWeight: 600 }}>DevPilot AI v1.0</span>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 36px', background: 'linear-gradient(to top, var(--d-bg) 75%, transparent)', zIndex: 10 }}>
            {attachedFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'var(--d-accent)', border: '1px solid var(--d-border-hover)', borderRadius: 8, marginBottom: 8, width: 'fit-content' }}>
                    <FiPaperclip size={12} color="var(--d-accent-text)" />
                    <span style={{ color: 'var(--d-accent-text)', fontSize: '0.75rem' }}>{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--d-accent-text)', cursor: 'pointer', lineHeight: 1 }}><FiX size={12} /></button>
                </div>
            )}
            <form onSubmit={onSend} style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--d-shadow)', transition: 'background 0.3s, border-color 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRight: '1px solid var(--d-border)', paddingRight: 14 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--d-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiZap size={13} color="var(--d-accent-text)" />
                    </div>
                    <span style={{ color: 'var(--d-sub)', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>DevPilot AI Copilot</span>
                    <span style={{ background: 'var(--d-tag-bg)', color: 'var(--d-muted)', fontSize: '0.58rem', padding: '2px 5px', borderRadius: 4, fontWeight: 700 }}>BETA</span>
                </div>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                    placeholder="Ask about your career, resume, tech skills or interviews…"
                    rows={1}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--d-text)', fontSize: '0.88rem', fontFamily: 'inherit', maxHeight: 80 }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
                />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                        style={{ background: 'none', border: 'none', color: 'var(--d-muted)', cursor: 'pointer', padding: 6, transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--d-text)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--d-muted)')}>
                        <FiPaperclip size={17} />
                    </button>
                    <button type="button" onClick={onToggleListen}
                        style={{ background: isListening ? 'rgba(244,63,94,0.15)' : 'none', border: 'none', color: isListening ? '#f43f5e' : 'var(--d-muted)', cursor: 'pointer', padding: 6, borderRadius: 6, transition: 'all 0.2s' }}>
                        <FiMic size={17} className={isListening ? 'animate-pulse' : ''} />
                    </button>
                    <button type="submit" disabled={(!prompt.trim() && !attachedFile) || isTyping}
                        style={{ background: (prompt.trim() || attachedFile) ? 'var(--d-btn-primary)' : 'var(--d-accent)', color: (prompt.trim() || attachedFile) ? '#fff' : 'var(--d-accent-text)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (prompt.trim() || attachedFile) ? 'pointer' : 'default', opacity: (prompt.trim() || attachedFile) ? 1 : 0.5, transition: 'all 0.2s' }}>
                        <FiSend size={15} />
                    </button>
                </div>
            </form>
        </div>
    );
}

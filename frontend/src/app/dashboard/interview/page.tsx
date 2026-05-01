'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMessageSquare, FiSend, FiPlay, FiStopCircle,
    FiAward, FiMic, FiMicOff, FiVolume2, FiVolumeX, FiCpu, FiSettings
} from 'react-icons/fi';
import { useSocket } from '@/hooks/useSocket';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// ── Female voice selector ──────────────────────────────────────────────────
const getFemaleVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    const femaleNames = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', 'Victoria',
        'Zira', 'Susan', 'Hazel', 'Serena', 'Google UK English Female',
        'Google US English Female', 'Microsoft Zira', 'female'];
    for (const name of femaleNames) {
        const v = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
        if (v) return v;
    }
    // fallback: pick any female or first available
    return voices.find(v => v.name.toLowerCase().includes('female')) || voices[0] || null;
};

const TABS = [
    { id: 'text', label: '💬 Text Interview', icon: FiMessageSquare },
    { id: 'voice', label: '🎤 Voice Assistant', icon: FiMic },
];

export default function InterviewPage() {
    const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');

    // ── Text interview state ──────────────────────────────────────────────
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [type, setType] = useState('technical');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [starting, setStarting] = useState(false);
    const [sending, setSending] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ── Voice assistant state ─────────────────────────────────────────────
    const [vaActive, setVaActive] = useState(false);
    const [vaListening, setVaListening] = useState(false);
    const [vaSpeaking, setVaSpeaking] = useState(false);
    const [vaTranscript, setVaTranscript] = useState('');
    const [vaMessages, setVaMessages] = useState<Message[]>([]);
    const [vaSending, setVaSending] = useState(false);
    const vaRecRef = useRef<any>(null);
    const vaMessagesEndRef = useRef<HTMLDivElement>(null);

    const [voiceSupported, setVoiceSupported] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const recognitionRef = useRef<any>(null);

    const { socket, connected } = useSocket();

    useEffect(() => {
        setVoiceSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
        // Load voices (needed for some browsers)
        window.speechSynthesis?.getVoices();
        window.speechSynthesis?.addEventListener('voiceschanged', () => { });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
            recognitionRef.current?.stop();
            vaRecRef.current?.stop();
        };
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => { vaMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [vaMessages]);

    // ── TTS (always female) ───────────────────────────────────────────────
    const speak = useCallback((text: string, onEnd?: () => void) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.93;
        utt.pitch = 1.1;
        utt.volume = 1;
        const tryVoice = () => {
            const v = getFemaleVoice();
            if (v) utt.voice = v;
        };
        tryVoice();
        utt.onstart = () => { setVaSpeaking(true); };
        utt.onend = () => { setVaSpeaking(false); onEnd?.(); };
        utt.onerror = () => { setVaSpeaking(false); onEnd?.(); };
        window.speechSynthesis.speak(utt);
    }, []);

    // ── Socket listeners (text interview) ────────────────────────────────
    useEffect(() => {
        if (!socket) return;
        socket.on('interview:response', (data: { message: string; status: string; score: number | null }) => {
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            setSending(false);
            if (ttsEnabled) speak(data.message);
            if (data.status === 'completed') { setCompleted(true); if (data.score) setScore(data.score); }
        });
        socket.on('interview:error', (data: { error: string }) => {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
            setSending(false);
        });
        return () => { socket.off('interview:response'); socket.off('interview:error'); };
    }, [socket, speak, ttsEnabled]);

    // ── Text interview actions ────────────────────────────────────────────
    const startInterview = async () => {
        if (!topic.trim()) return;
        setStarting(true);
        try {
            const res = await api.post('/interview/start', { topic, difficulty, type });
            const first = res.data.session.messages[0]?.content || "Let's begin! Tell me about yourself.";
            setSessionId(res.data.session._id);
            setMessages([{ role: 'assistant', content: first }]);
            setCompleted(false); setScore(null);
            if (ttsEnabled) speak(first);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to start interview');
        } finally { setStarting(false); }
    };

    const sendMessage = (text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg || !sessionId || !socket || sending) return;
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setInput(''); setSending(true);
        socket.emit('interview:message', { sessionId, message: msg });
    };

    const resetInterview = () => {
        window.speechSynthesis?.cancel(); recognitionRef.current?.stop();
        setSessionId(null); setMessages([]); setCompleted(false);
        setScore(null); setInput('');
    };

    // ── Voice Assistant STT ───────────────────────────────────────────────
    const startVaListening = useCallback(() => {
        if (vaSpeaking) window.speechSynthesis?.cancel();
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        const rec = new SR();
        rec.continuous = false; rec.interimResults = true; rec.lang = 'en-US';
        rec.onresult = (e: any) => {
            let interim = '', final = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) final += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            setVaTranscript(final || interim);
            if (final) {
                setVaTranscript('');
                sendVaMessage(final.trim());
            }
        };
        rec.onend = () => setVaListening(false);
        rec.onerror = () => { setVaListening(false); setVaTranscript(''); };
        vaRecRef.current = rec;
        rec.start();
        setVaListening(true);
    }, [vaSpeaking]);

    const stopVaListening = () => { vaRecRef.current?.stop(); setVaListening(false); };

    const sendVaMessage = async (text: string) => {
        if (!text || vaSending) return;
        setVaMessages(prev => [...prev, { role: 'user', content: text }]);
        setVaSending(true);
        try {
            const res = await api.post('/interview/message', {
                sessionId: null,
                message: text,
                topic: 'General AI Interview Practice',
                type: 'voice-assistant',
            });
            const reply = res.data?.message || "I didn't catch that. Could you repeat?";
            setVaMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            speak(reply);
        } catch {
            const fallback = "I'm sorry, I couldn't process that. Please try again.";
            setVaMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
            speak(fallback);
        } finally { setVaSending(false); }
    };

    // Activate voice assistant
    const activateVoiceAssistant = () => {
        setVaActive(true);
        setVaMessages([]);
        const greeting = "Hello! I'm Raj's AI, currently under training. How can I help you today? Feel free to ask me anything about your interview preparation.";
        setVaMessages([{ role: 'assistant', content: greeting }]);
        setTimeout(() => speak(greeting), 300);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <FiCpu size={28} color="var(--primary)" />
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', margin: 0 }}>
                        Interview <span className="gradient-text">Simulator</span>
                    </h1>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                    Choose text practice with AI scoring, or talk live with <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>DevPilot AI Voice Assistant</span>.
                </p>
            </motion.div>

            {/* Premium Tab switcher */}
            <div style={{ 
                display: 'flex', 
                gap: 8, 
                marginBottom: 32, 
                padding: '6px', 
                background: 'rgba(0,0,0,0.03)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 16, 
                width: 'fit-content' 
            }}>
                {TABS.map(tab => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setActiveTab(tab.id as any); window.speechSynthesis?.cancel(); }}
                        style={{
                            padding: '10px 24px', 
                            borderRadius: 12, 
                            cursor: 'pointer',
                            fontSize: '0.9rem', 
                            fontWeight: 700, 
                            transition: 'all 0.2s',
                            background: activeTab === tab.id ? '#fff' : 'transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted)',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                            border: 'none',
                        } as any}
                    >
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ── TAB 1: TEXT INTERVIEW ─────────────────────────────── */}
                {activeTab === 'text' && (
                    <motion.div key="text" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                        {!sessionId ? (
                            <motion.div 
                                style={{ 
                                    maxWidth: 600, 
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid var(--border-color)', 
                                    borderRadius: 24,
                                    padding: 32,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FiSettings size={20} color="var(--primary)" />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Configure Your Interview</h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Interview Topic
                                        </label>
                                        <input
                                            style={{
                                                width: '100%',
                                                padding: '14px 18px',
                                                borderRadius: 14,
                                                border: '1px solid var(--border-color)',
                                                background: '#fff',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                transition: 'all 0.2s',
                                            }}
                                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                                            placeholder="e.g. React, System Design, Data Structures..." 
                                            value={topic} onChange={e => setTopic(e.target.value)} 
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Difficulty
                                            </label>
                                            <select 
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 18px',
                                                    borderRadius: 14,
                                                    border: '1px solid var(--border-color)',
                                                    background: '#fff',
                                                    fontSize: '0.95rem',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                                value={difficulty} onChange={e => setDifficulty(e.target.value)}
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Type
                                            </label>
                                            <select 
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 18px',
                                                    borderRadius: 14,
                                                    border: '1px solid var(--border-color)',
                                                    background: '#fff',
                                                    fontSize: '0.95rem',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                                value={type} onChange={e => setType(e.target.value)}
                                            >
                                                <option value="technical">Technical</option>
                                                <option value="behavioral">Behavioral</option>
                                                <option value="system-design">System Design</option>
                                                <option value="coding">Coding</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* TTS toggle */}
                                    <div 
                                        onClick={() => setTtsEnabled(p => !p)} 
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '16px 20px',
                                            background: 'rgba(79, 70, 229, 0.04)',
                                            borderRadius: 16,
                                            border: '1px solid rgba(79, 70, 229, 0.1)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <FiVolume2 size={18} color="var(--primary)" />
                                            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>AI reads responses aloud</span>
                                        </div>
                                        <div style={{ width: 44, height: 24, borderRadius: 20, background: ttsEnabled ? 'var(--primary)' : 'rgba(0,0,0,0.1)', position: 'relative', transition: 'background 0.2s' }}>
                                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: ttsEnabled ? 22 : 2, transition: 'left 0.2s' }} />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={startInterview}
                                        disabled={starting || !topic.trim()}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: 14,
                                            border: 'none',
                                            background: 'var(--gradient-primary)',
                                            color: '#fff',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 12,
                                            cursor: 'pointer',
                                            boxShadow: 'var(--glow-primary)',
                                            opacity: starting || !topic.trim() ? 0.7 : 1
                                        }}
                                    >
                                        <FiPlay size={18} />
                                        {starting ? 'Preparing Session...' : 'Start Virtual Interview'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                                {/* Status bar */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '10px 16px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem' }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? 'var(--success)' : 'var(--danger)' }} />
                                        <span style={{ color: 'var(--muted)' }}>{completed ? 'Complete' : topic} · {difficulty} · {type}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        {score !== null && <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 4 }}><FiAward size={14} /> {score}/100</span>}
                                        <button onClick={() => { setTtsEnabled(p => !p); window.speechSynthesis?.cancel(); }}
                                            style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {ttsEnabled ? <FiVolume2 size={12} /> : <FiVolumeX size={12} />}
                                        </button>
                                        <button onClick={resetInterview} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.75rem' }}>
                                            <FiStopCircle size={12} /> End
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 6 }}>
                                    {messages.map((msg, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                                            {msg.role === 'assistant' && (
                                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <FiCpu size={13} color="#fff" />
                                                </div>
                                            )}
                                            <div style={{
                                                maxWidth: '72%', padding: '13px 17px',
                                                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                background: msg.role === 'user' ? 'var(--primary)' : 'var(--card)',
                                                color: msg.role === 'user' ? '#fff' : 'var(--foreground)',
                                                border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                                                fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                                            }}>
                                                {msg.content}
                                                {msg.role === 'assistant' && ttsEnabled && (
                                                    <button onClick={() => speak(msg.content)} style={{ display: 'block', marginTop: 6, background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.72rem', padding: 0 }}>
                                                        <FiVolume2 size={11} style={{ marginRight: 3 }} />Read aloud
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {sending && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiCpu size={13} color="#fff" />
                                            </div>
                                            <div style={{ padding: '13px 17px', borderRadius: '16px 16px 16px 4px', background: 'var(--card)', border: '1px solid var(--border-color)', display: 'flex', gap: 4 }}>
                                                {[0, 1, 2].map(i => (
                                                    <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                                        style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)' }} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                {!completed ? (
                                    <div style={{ marginTop: 14, display: 'flex', gap: 10, padding: '12px', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                                        <input className="input" placeholder="Type your answer... (Enter to send)"
                                            value={input} onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                            style={{ border: 'none', background: 'transparent', flex: 1 }} />
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => sendMessage()}
                                            disabled={sending || !input.trim()}
                                            style={{ background: 'var(--gradient-primary)', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', color: '#fff', opacity: sending || !input.trim() ? 0.5 : 1 }}>
                                            <FiSend size={17} />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="btn-primary" onClick={resetInterview} style={{ marginTop: 14 }}>
                                        Start New Interview
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── TAB 2: VOICE ASSISTANT ────────────────────────────── */}
                {activeTab === 'voice' && (
                    <motion.div key="voice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, alignItems: 'center' }}>

                        {!vaActive ? (
                            /* Premium Activation screen */
                            <motion.div animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: 60, maxWidth: 500 }}>
                                {/* Siri-style Neural Animation */}
                                <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Rotating Outer Ring */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        style={{
                                            position: 'absolute', inset: 0,
                                            borderRadius: '50%',
                                            border: '2px dashed rgba(79, 70, 229, 0.2)',
                                        }}
                                    />
                                    {/* Pulsating Middle Ring */}
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            position: 'absolute', inset: 20,
                                            borderRadius: '50%',
                                            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
                                            border: '1px solid rgba(124, 58, 237, 0.2)',
                                        }}
                                    />
                                    {/* Central Energy Core */}
                                    <motion.div
                                        animate={{ 
                                            scale: [1, 1.1, 1], 
                                            boxShadow: [
                                                '0 0 40px rgba(79, 70, 229, 0.3)', 
                                                '0 0 80px rgba(124, 58, 237, 0.6)', 
                                                '0 0 40px rgba(79, 70, 229, 0.3)'
                                            ] 
                                        }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                        style={{ 
                                            width: 100, height: 100, borderRadius: '50%', 
                                            background: 'var(--gradient-primary)', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            position: 'relative', zIndex: 2,
                                            boxShadow: '0 0 40px rgba(79, 70, 229, 0.4)'
                                        }}>
                                        <FiMic size={40} color="#fff" style={{ 
                                            position: 'relative', 
                                            zIndex: 3,
                                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                                        }} />
                                    </motion.div>
                                    
                                    {/* Orbiting Particles */}
                                    {[0, 72, 144, 216, 288].map((angle, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
                                            style={{
                                                position: 'absolute', inset: 0,
                                                display: 'flex', justifyContent: 'center', alignItems: 'flex-start'
                                            }}
                                        >
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)', marginTop: -3 }} />
                                        </motion.div>
                                    ))}
                                </div>
                                
                                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: 12 }}>
                                    DevPilot <span className="gradient-text">Voice Intelligence</span>
                                </h2>
                                <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 32 }}>
                                    Experience a natural, AI-driven conversation. Get real-time feedback on your tone, content, and confidence.
                                </p>
                                
                                {voiceSupported ? (
                                    <motion.button 
                                        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)' }} 
                                        whileTap={{ scale: 0.95 }} 
                                        className="btn-primary"
                                        onClick={activateVoiceAssistant}
                                        style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: 12, 
                                            padding: '16px 40px', fontSize: '1.1rem', borderRadius: 100 
                                        }}>
                                        <FiMic size={20} /> Initialize Neural Link
                                    </motion.button>
                                ) : (
                                    <div style={{ padding: '16px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: 12, border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                                        <p style={{ color: 'var(--danger)', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>
                                            ⚠️ Voice features require a modern browser (Chrome/Edge).
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            /* Active voice assistant UI */
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%', maxWidth: 700 }}>
                                {/* AI Avatar + speaking indicator */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 40 }}>
                                    <motion.div
                                        animate={vaSpeaking ? {
                                            scale: [1, 1.15, 1],
                                            boxShadow: ['0 0 30px rgba(79, 70, 229, 0.4)', '0 0 60px rgba(79, 70, 229, 0.7)', '0 0 30px rgba(79, 70, 229, 0.4)'],
                                        } : vaListening ? {
                                            scale: [1, 1.08, 1],
                                            boxShadow: ['0 0 25px rgba(244, 63, 94, 0.4)', '0 0 50px rgba(244, 63, 94, 0.6)', '0 0 25px rgba(244, 63, 94, 0.4)'],
                                        } : {}}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        style={{ 
                                            width: 88, height: 88, borderRadius: '50%', 
                                            background: vaListening ? 'linear-gradient(135deg, #F43F5E, #E11D48)' : 'var(--gradient-primary)', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                            marginBottom: 16, border: '4px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                                        }}>
                                        {vaListening ? (
                                            <FiMicOff size={32} color="#fff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                                        ) : (
                                            <FiMic size={32} color="#fff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                                        )}
                                    </motion.div>
                                    <div style={{ 
                                        fontSize: '0.95rem', 
                                        fontWeight: 700, 
                                        color: vaListening ? '#F43F5E' : 'var(--primary)',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {vaSpeaking ? '🔊 AI Speaking...' : vaListening ? '🔴 Listening...' : vaSending ? '⏳ Analyzing...' : "Voice Active"}
                                    </div>
                                </div>

                                {/* Voice Transcription area */}
                                <div style={{ 
                                    flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 20, 
                                    padding: '24px', background: 'rgba(0,0,0,0.02)', borderRadius: 24, border: '1px solid var(--border-color)' 
                                }}>
                                    {vaMessages.map((msg, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                                            {msg.role === 'assistant' && (
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <FiMic size={14} color="#fff" />
                                                </div>
                                            )}
                                            <div style={{
                                                maxWidth: '75%', padding: '13px 17px',
                                                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                background: msg.role === 'user' ? 'var(--primary)' : 'var(--card)',
                                                color: msg.role === 'user' ? '#fff' : 'var(--foreground)',
                                                border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                                                fontSize: '0.9rem', lineHeight: 1.7,
                                            }}>
                                                {msg.content}
                                                {msg.role === 'assistant' && (
                                                    <button onClick={() => speak(msg.content)} style={{ display: 'block', marginTop: 6, background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.72rem', padding: 0 }}>
                                                        <FiVolume2 size={11} style={{ marginRight: 3 }} />Replay
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {vaSending && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiMic size={14} color="#fff" />
                                            </div>
                                            <div style={{ padding: '13px 17px', borderRadius: '16px 16px 16px 4px', background: 'var(--card)', border: '1px solid var(--border-color)', display: 'flex', gap: 4 }}>
                                                {[0, 1, 2].map(i => (
                                                    <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                                        style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)' }} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={vaMessagesEndRef} />
                                </div>

                                {/* Live transcript */}
                                <AnimatePresence>
                                    {(vaListening || vaTranscript) && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            style={{ margin: '10px 0', padding: '8px 14px', borderRadius: 10, background: 'rgba(231,76,60,0.08)', border: '1px dashed #e74c3c', fontSize: '0.85rem', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
                                                style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', flexShrink: 0 }} />
                                            {vaTranscript || 'Listening... speak now'}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Controls */}
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', paddingTop: 8 }}>
                                    <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                                        onClick={vaListening ? stopVaListening : startVaListening}
                                        disabled={vaSpeaking || vaSending}
                                        animate={vaListening ? { boxShadow: ['0 0 0 0 rgba(231,76,60,0)', '0 0 0 14px rgba(231,76,60,0.15)', '0 0 0 0 rgba(231,76,60,0)'] } : {}}
                                        transition={{ repeat: Infinity, duration: 1.2 }}
                                        style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer', background: vaListening ? '#e74c3c' : 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (vaSpeaking || vaSending) ? 0.6 : 1 }}
                                        title={vaListening ? 'Stop listening' : 'Start speaking'}>
                                        {vaListening ? <FiMicOff size={26} /> : <FiMic size={26} />}
                                    </motion.button>

                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        onClick={() => { window.speechSynthesis?.cancel(); vaRecRef.current?.stop(); setVaActive(false); setVaMessages([]); }}
                                        style={{ padding: '0 20px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.82rem' }}>
                                        End Session
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

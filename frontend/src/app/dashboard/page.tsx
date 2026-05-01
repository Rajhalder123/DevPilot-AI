'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSend, FiPlus, FiEdit3, FiSearch, 
    FiZap, FiFileText, FiGithub, FiMic, FiPaperclip,
    FiTrendingUp, FiTarget, FiActivity, FiX
} from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useConversation } from '@/context/ConversationContext';

const ActionChip = ({ icon: Icon, label, color, onClick }: { icon: React.ElementType; label: string; color: string; onClick: () => void }) => (
    <motion.button
        whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 1)', borderColor: color }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid var(--border-color)',
            borderRadius: '100px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--foreground)',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            transition: 'all 0.2s'
        }}
    >
        <Icon size={14} color={color} />
        {label}
    </motion.button>
);

export default function DashboardPage() {
    const { user } = useAuth();
    const { currentConversationId, setCurrentConversationId } = useConversation();
    const [prompt, setPrompt] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
    
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    // Fetch history when conversation ID changes
    useEffect(() => {
        const fetchHistory = async () => {
            if (!currentConversationId) {
                setChatHistory([]);
                return;
            }

            try {
                const response = await api.get(`/career-mentor/history/${currentConversationId}`);
                setChatHistory(response.data.messages || []);
            } catch (error) {
                console.error('Failed to fetch history');
            }
        };

        fetchHistory();
    }, [currentConversationId]);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setPrompt(prev => prev + ' ' + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!prompt.trim() && !attachedFile) return;

        const currentPrompt = prompt.trim();
        let displayContent = currentPrompt;
        
        if (attachedFile) {
            displayContent = `[Attached File: ${attachedFile.name}]\n${currentPrompt}`;
        }

        const userMsg = { role: 'user', content: displayContent };
        setChatHistory(prev => [...prev, userMsg]);
        setPrompt('');
        setAttachedFile(null);
        setIsTyping(true);

        try {
            const response = await api.post('/career-mentor/chat', { 
                message: displayContent,
                conversationId: currentConversationId,
                history: chatHistory.map(msg => ({ role: msg.role, content: msg.content }))
            });
            
            if (!currentConversationId && response.data.conversationId) {
                setCurrentConversationId(response.data.conversationId);
            }

            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: response.data.response || "I'm DevPilot AI. How can I help you today?" 
            }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: "I apologize, my neural link is a bit unstable. Please try again!" 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <div style={{ 
            height: 'calc(100vh - 120px)', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            maxWidth: 850,
            margin: '0 auto',
            width: '100%'
        }}>
            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

            {/* Persistent Header */}
            <motion.div 
                animate={{ 
                    paddingTop: chatHistory.length > 0 ? '20px' : '60px',
                    paddingBottom: chatHistory.length > 0 ? '10px' : '40px'
                }}
                style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', background: chatHistory.length > 0 ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                    backdropFilter: chatHistory.length > 0 ? 'blur(8px)' : 'none', zIndex: 10,
                    position: chatHistory.length > 0 ? 'sticky' : 'relative', top: 0,
                    borderBottom: chatHistory.length > 0 ? '1px solid var(--border-color)' : 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: chatHistory.length > 0 ? 8 : 20 }}>
                    <div style={{ 
                        width: chatHistory.length > 0 ? 32 : 48, height: chatHistory.length > 0 ? 32 : 48, borderRadius: 12, 
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(79, 70, 229, 0.2)', transition: 'all 0.3s'
                    }}>
                        <FiZap size={chatHistory.length > 0 ? 18 : 24} color="#fff" />
                    </div>
                    <h1 style={{ 
                        fontFamily: 'var(--font-display)', fontSize: chatHistory.length > 0 ? '1.2rem' : '2.2rem', 
                        fontWeight: 800, margin: 0, transition: 'all 0.3s'
                    }}>
                        What can I help with, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Raj'}</span>?
                    </h1>
                </div>
                
                {chatHistory.length === 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 500, lineHeight: 1.6, margin: 0 }}>
                        I am <span style={{ fontWeight: 700, color: 'var(--primary)' }}>DevPilot AI</span>. Ask me to analyze your resume, scan your GitHub, or simulate an interview.
                    </motion.p>
                )}

                <div style={{ 
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, 
                    marginTop: chatHistory.length > 0 ? 12 : 32, opacity: chatHistory.length > 0 ? 0.8 : 1,
                    transform: chatHistory.length > 0 ? 'scale(0.9)' : 'scale(1)', transition: 'all 0.3s'
                }}>
                    <ActionChip icon={FiFileText} label="Analyze Resume" color="#3B82F6" onClick={() => setPrompt("Can you analyze my resume for a Senior Frontend role?")} />
                    <ActionChip icon={FiGithub} label="Scan GitHub" color="#8B5CF6" onClick={() => setPrompt("Check my latest repository for best practices.")} />
                    <ActionChip icon={FiActivity} label="Interview Prep" color="#10B981" onClick={() => setPrompt("Let's do a mock interview for System Design.")} />
                    <ActionChip icon={FiTarget} label="Career Roadmap" color="#F59E0B" onClick={() => setPrompt("What skills should I learn next for DevOps?")} />
                </div>
            </motion.div>

            {/* Chat History Section */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {chatHistory.map((msg, i) => (
                    <motion.div 
                        key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'flex', gap: 20, padding: '24px', borderRadius: '24px',
                            background: msg.role === 'assistant' ? 'rgba(15, 23, 42, 0.03)' : 'transparent',
                            alignSelf: 'stretch', border: msg.role === 'assistant' ? '1px solid rgba(0,0,0,0.02)' : 'none'
                        }}
                    >
                        <div style={{ 
                            width: 36, height: 36, borderRadius: '50%', background: msg.role === 'assistant' ? 'var(--gradient-primary)' : '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.role === 'assistant' ? '#fff' : 'var(--muted)', 
                            flexShrink: 0, fontWeight: 800, fontSize: '0.9rem', boxShadow: msg.role === 'assistant' ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none',
                            border: msg.role === 'assistant' ? 'none' : '1px solid var(--border-color)'
                        }}>
                            {msg.role === 'assistant' ? <FiZap size={18} /> : (user?.name?.charAt(0) || 'R')}
                        </div>
                        <div style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--foreground)', paddingTop: 2, width: '100%', overflowX: 'auto' }} className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', gap: 12, padding: '0 24px', alignItems: 'center' }}>
                        <div className="animate-pulse" style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }} />
                        <div className="animate-pulse" style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.2s' }} />
                        <div className="animate-pulse" style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.4s' }} />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{ padding: '20px 0' }}>
                {attachedFile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '12px', marginBottom: 12, width: 'fit-content' }}>
                        <FiPaperclip size={14} color="var(--primary)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{attachedFile.name}</span>
                        <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><FiX size={14} /></button>
                    </div>
                )}
                <form onSubmit={handleSend} style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.04)', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '8px' }}>
                            <FiPlus size={20} />
                        </button>
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask DevPilot AI anything..." rows={1} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', padding: '8px 0', fontSize: '1.05rem', color: 'var(--foreground)', fontFamily: 'inherit', maxHeight: 200 }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button type="button" onClick={toggleListening} style={{ background: isListening ? 'rgba(244, 63, 94, 0.1)' : 'none', border: 'none', color: isListening ? '#F43F5E' : 'var(--muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                                <FiMic size={20} className={isListening ? 'animate-pulse' : ''} />
                            </button>
                            <button type="submit" disabled={(!prompt.trim() && !attachedFile) || isTyping} style={{ background: (prompt.trim() || attachedFile) ? 'var(--foreground)' : 'rgba(0,0,0,0.05)', color: (prompt.trim() || attachedFile) ? '#fff' : 'var(--muted)', border: 'none', borderRadius: '12px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (prompt.trim() || attachedFile) ? 'pointer' : 'default' }}>
                                <FiSend size={18} />
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <button type="button" onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = ".pdf"; fileInputRef.current.click(); } }} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--muted)', cursor: 'pointer' }}>
                                <FiFileText size={14} /> Upload Resume (PDF)
                            </button>
                            <button type="button" onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "*"; fileInputRef.current.click(); } }} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--muted)', cursor: 'pointer' }}>
                                <FiPaperclip size={14} /> Attach File
                            </button>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 500 }}>DevPilot AI v1.0</span>
                    </div>
                </form>
            </div>
        </div>
    );
}

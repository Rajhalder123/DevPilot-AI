'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiZap, FiArrowRight, FiFileText, FiGithub,
    FiTarget, FiCodesandbox, FiMenu, FiX, FiCheck,
    FiTerminal, FiActivity, FiCode, FiCpu, FiSun, FiMoon,
    FiPlay, FiShield, FiUsers, FiTrendingUp, FiCheckCircle, FiBriefcase, FiMic, FiSend, FiPlus, FiMap, FiSearch, FiMessageCircle, FiGlobe, FiClock, FiMail
} from 'react-icons/fi';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// --- Siri 3D Animated Orb (Matching Dashboard) ---
const SiriOrb = () => {
    return (
        <div className="relative w-20 h-20 flex items-center justify-center mb-5 mx-auto">
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[120%] h-[120%] rounded-full bg-radial-gradient blur-[20px]"
                style={{ background: 'radial-gradient(circle, rgba(255,0,128,0.4), rgba(121,40,202,0.4), rgba(0,112,243,0.4))' }}
            />
            <div className="relative w-full h-full rounded-full overflow-hidden bg-black/40 border border-white/10 shadow-lg">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute inset-[-30%] blur-[10px] mix-blend-screen opacity-70"
                    style={{ background: 'conic-gradient(from 0deg, transparent, #ff0080, #00dfd8, transparent, #7928ca)' }}
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
                    transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute inset-[-30%] blur-[10px] mix-blend-screen opacity-50"
                    style={{ background: 'conic-gradient(from 180deg, transparent, #0070f3, #ff0080, transparent)' }}
                />
                <div className="absolute inset-[25%] rounded-full bg-white/20 blur-[3px]" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 80%)' }} />
            </div>
            <div className="absolute top-[5%] left-[15%] right-[15%] h-[30%] rounded-full bg-gradient-to-b from-white/70 to-transparent z-10 pointer-events-none" />
        </div>
    );
};

// --- Premium Crystal Logo Component ---
const PremiumLogo = ({ size = "md" }: { size?: "sm" | "md" }) => {
    const isSm = size === "sm";
    return (
        <div className="relative group">
            <motion.div 
                animate={{ 
                    boxShadow: [
                        "0 0 0px rgba(99, 102, 241, 0)", 
                        "0 0 25px rgba(99, 102, 241, 0.4)", 
                        "0 0 0px rgba(99, 102, 241, 0)"
                    ],
                    scale: [1, 1.02, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`${isSm ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-xl'} bg-gradient-to-br from-indigo-500/80 via-purple-600/80 to-indigo-700/80 backdrop-blur-md border border-white/20 flex items-center justify-center relative overflow-hidden`}
            >
                {/* Rotating Energy Ring */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-50%] opacity-20 bg-[conic-gradient(from_0deg,transparent,white,transparent,white,transparent)]"
                />
                
                {/* Diagonal Shimmer Sweep */}
                <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                />

                <FiZap size={isSm ? 15 : 20} className="text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </motion.div>
        </div>
    );
};

// --- Interactive Demo Modal ---


const ContactForm = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'service_ye0haeh',
                    template_id: 'template_epnisen',
                    user_id: 'qJFwvqwQMWU1_cny1',
                    template_params: {
                        name: formData.name,
                        email: formData.email,
                        title: 'General Contact Inquiry',
                        message: formData.message,
                        time: new Date().toLocaleString()
                    }
                })
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <FiCheck size={32} />
                </div>
                <div className="text-2xl font-black">Message Sent!</div>
                <p className="opacity-60">We've received your inquiry and will respond shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none transition-all" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Message</label>
                <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none transition-all h-32 resize-none" placeholder="How can we help you?" />
            </div>
            <button disabled={status === 'loading'} type="submit" className="mt-4 w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3">
                {status === 'loading' ? 'Sending Message...' : 'Send Message'} <FiArrowRight />
            </button>
            {status === 'error' && <p className="text-center text-red-500 text-xs font-bold">Failed to send message. Please try again.</p>}
        </form>
    );
};

const InterestModal = ({ isOpen, onClose, planName }: { isOpen: boolean; onClose: () => void; planName: string }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const { isDark } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Using EmailJS REST API to avoid additional dependencies
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'service_ye0haeh',
                    template_id: 'template_epnisen', // User provided
                    user_id: 'qJFwvqwQMWU1_cny1', // User provided Public Key
                    template_params: {
                        name: formData.name,
                        email: formData.email,
                        title: planName,
                        message: formData.message || `Interest in ${planName} plan`,
                        time: new Date().toLocaleString()
                    }
                })
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md p-8 rounded-[2.5rem] border overflow-hidden shadow-2xl flex flex-col gap-6"
                        style={{ background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}
                    >
                        <div className="text-center">
                            <h3 className="text-2xl font-black mb-2">Interest in {planName}</h3>
                            <p className="text-xs opacity-50 font-bold uppercase tracking-widest">We'll contact you to confirm your subscription.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="py-10 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                    <FiCheck size={32} />
                                </div>
                                <div className="font-black text-xl">Interest Received!</div>
                                <p className="opacity-60 text-sm">We'll reach out to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all" placeholder="Enter your name" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all" placeholder="your@email.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Message (Optional)</label>
                                    <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all h-24 resize-none" placeholder="Anything else?" />
                                </div>
                                <button disabled={status === 'loading'} type="submit" className="mt-4 w-full py-4 rounded-xl bg-indigo-500 text-white font-black text-sm shadow-lg hover:bg-indigo-400 transition-all flex items-center justify-center gap-2">
                                    {status === 'loading' ? 'Sending...' : 'Confirm Interest'} <FiArrowRight />
                                </button>
                                {status === 'error' && <p className="text-center text-red-500 text-[10px] font-bold">Failed to send. Please try again.</p>}
                            </form>
                        )}
                        <button onClick={onClose} className="absolute top-6 right-6 opacity-30 hover:opacity-100 transition-opacity"><FiX size={20} /></button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const DemoModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm DevPilot AI. I've pre-loaded a sample Senior Backend Engineer resume. Ask me anything about it!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        // --- DYNAMIC RAG MOCK LOGIC ---
        setTimeout(() => {
            let fullResponse = "I've analyzed the sample resume. Overall, it's a strong profile with 4+ years in React. However, the 'Projects' section lacks specific metrics (like 'improved performance by 30%'). Would you like a detailed breakdown?";
            
            const low = userMsg.toLowerCase();
            if (low.includes('gap') || low.includes('skill')) {
                fullResponse = "### 🚨 Skill Gap Analysis\n1. **System Design:** No mention of Load Balancing or Microservices.\n2. **Cloud Infrastructure:** Missing AWS/GCP certification or hands-on VPC experience.\n3. **Testing:** Unit testing coverage is not mentioned. I recommend adding Jest or Vitest.";
            } else if (low.includes('audit') || low.includes('resume')) {
                fullResponse = "### 📄 Resume Audit Results\n**Score: 68/100**\n- **Impact:** You use passive verbs. Change 'Was responsible for' to 'Engineered' or 'Architected'.\n- **ATS:** Your layout is multi-column, which can confuse older ATS systems. Switch to a single-column format.";
            } else if (low.includes('interview') || low.includes('mock')) {
                fullResponse = "### 🎙️ Mock Interview Simulation\n'Let's start. You mentioned you used Redis in your last project. Can you explain how you handled cache invalidation when the primary database was updated?'";
            }
            
            // --- STREAMING EFFECT ---
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
            setLoading(false);
            
            let i = 0;
            const interval = setInterval(() => {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'assistant') {
                        lastMsg.content = fullResponse.slice(0, i + 1);
                    }
                    return newMessages;
                });
                i++;
                if (i >= fullResponse.length) clearInterval(interval);
            }, 15);
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl h-[80vh] rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl"
                        style={{ background: 'var(--d-bg)' }}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <PremiumLogo size="sm" />
                                <div>
                                    <h3 className="font-bold">DevPilot Live Demo</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase text-slate-500">{loading ? 'AI is Thinking...' : 'RAG Engine Online'}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><FiX size={24} /></button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {messages.map((m, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div 
                                        className={`max-w-[85%] p-5 rounded-2xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'border'}`}
                                        style={{ 
                                            background: m.role === 'user' ? undefined : 'var(--d-card)',
                                            borderColor: m.role === 'user' ? undefined : 'var(--d-border)',
                                            color: m.role === 'user' ? '#fff' : 'var(--d-text)'
                                        }}
                                    >
                                        <div className="whitespace-pre-line">
                                            {m.content}
                                            {m.role === 'assistant' && m.content.length < 5 && m.content.length > 0 && <span className="animate-pulse">|</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 border-t border-white/5 bg-white/[0.03]">
                            <form onSubmit={handleSend} className="relative max-w-2xl mx-auto mb-6">
                                <input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about skill gaps or resume improvements..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-500"
                                    style={{ color: 'var(--d-text)' }}
                                />
                                <button type="submit" className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center">
                                    <FiSend size={18} />
                                </button>
                            </form>
                            <div className="flex flex-wrap justify-center gap-3">
                                {[
                                    { label: "Resume Audit", query: "Give me a Resume Audit for this sample." },
                                    { label: "Skill Gaps", query: "What are the skill gaps for this profile?" },
                                    { label: "Mock Interview", query: "Start a mock interview based on this tech stack." }
                                ].map(t => (
                                    <button key={t.label} onClick={() => { setInput(t.query); }} className="text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">{t.label}</button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- Feature Card Component ---
const FeatureCard = ({ 
    icon: Icon, 
    title, 
    desc, 
    span = "col-span-1", 
    color = "indigo",
    children
}: { 
    icon: any, 
    title: string, 
    desc: string, 
    span?: string, 
    color?: "indigo" | "purple" | "emerald" | "pink",
    children?: React.ReactNode
}) => {
    const colorClasses = {
        indigo: "from-indigo-500/20 text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
        purple: "from-purple-500/20 text-purple-500 border-purple-500/20 bg-purple-500/5",
        emerald: "from-emerald-500/20 text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
        pink: "from-pink-500/20 text-pink-500 border-pink-500/20 bg-pink-500/5"
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`${span} relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border bg-white/[0.02] backdrop-blur-md p-6 md:p-10 group transition-all duration-500`}
            style={{ borderColor: 'var(--d-border)' }}
        >
            {/* Background Glow */}
            <div className={`absolute -inset-24 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700`} />
            
            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none" style={{ backgroundImage: `radial-gradient(var(--d-text) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

            <div className="relative z-10 h-full flex flex-col">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${colorClasses[color].split(' ')[3]} border ${colorClasses[color].split(' ')[2]} flex items-center justify-center mb-6 md:mb-8 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={24} className={colorClasses[color].split(' ')[1]} />
                </div>
                
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 tracking-tight" style={{ color: 'var(--d-text)' }}>{title}</h3>
                <p className="text-sm md:text-lg leading-relaxed opacity-60 mb-6 md:mb-8 font-medium" style={{ color: 'var(--d-sub)' }}>{desc}</p>
                
                <div className="mt-auto">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

const ScanningEffect = () => (
    <div className="relative w-full h-32 rounded-2xl bg-black/20 border border-white/5 overflow-hidden">
        <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] z-10"
        />
        <div className="p-6 space-y-3 opacity-30">
            <div className="h-2 w-3/4 bg-white/20 rounded-full" />
            <div className="h-2 w-1/2 bg-white/20 rounded-full" />
            <div className="h-2 w-2/3 bg-white/20 rounded-full" />
            <div className="h-2 w-1/3 bg-white/20 rounded-full" />
        </div>
    </div>
);

// --- Interactive Nav Items Component ---
const NavItems = () => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Dashboard', href: '#dashboard' },
        { name: 'Jobs', href: '#jobs' },
        { name: 'Pricing', href: '#pricing' },
    ];

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/5">
            {navLinks.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative px-5 py-2 text-[13px] font-bold tracking-tight transition-colors duration-300 cursor-pointer"
                    style={{ color: hoveredItem === item.name ? 'var(--d-text)' : 'var(--d-sub)' }}
                >
                    <AnimatePresence>
                        {hoveredItem === item.name && (
                            <motion.div
                                layoutId="nav-pill-background"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-full border border-indigo-500/20 z-0"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </AnimatePresence>
                    <span className="relative z-10">{item.name}</span>
                </a>
            ))}
        </nav>
    );
};

function LandingPageContent() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [demoOpen, setDemoOpen] = useState(false);
    const [interestOpen, setInterestOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("");
    const { isDark, toggleTheme } = useTheme();
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} data-theme={isDark ? 'dark' : 'light'} className="min-h-screen font-sans overflow-x-hidden selection:bg-indigo-500/30 transition-colors duration-500" style={{ background: 'var(--d-bg)', color: 'var(--d-text)' }}>
            
            {/* --- GRAIN OVERLAY --- */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* --- NAVBAR (AlgoBuilder Style) --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'py-4 shadow-sm' : 'py-6'}`} style={{ backgroundColor: scrolled ? (isDark ? 'rgba(11, 15, 25, 0.9)' : 'rgba(255, 255, 255, 0.9)') : 'transparent', borderColor: 'var(--d-border)', backdropFilter: scrolled ? 'blur(12px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none' }}>
                <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <PremiumLogo size="sm" />
                        <span className="font-sans text-xl font-bold tracking-tight" style={{ color: 'var(--d-text)' }}>
                            DevPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex items-center gap-8 font-medium">
                            <li><a href="#features" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Features</a></li>
                            <li><a href="#pricing" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Pricing</a></li>
                            <li><a href="#contact" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Contact</a></li>
                            <li><Link href="/login" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Login</Link></li>
                        </ul>
                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--d-sub)' }}>
                                {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </button>
                            <Link href="/signup">
                                <button className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2 group" style={{ background: 'var(--d-text)', color: 'var(--d-bg)' }}>
                                    Get Started
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full transition-colors" style={{ color: 'var(--d-sub)' }}>
                            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                        <button className="transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: 'var(--d-text)' }}>
                            {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu (AlgoBuilder Style Dropdown) */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t mt-4 px-6 py-8 flex flex-col gap-6"
                            style={{ background: isDark ? 'var(--d-bg)' : '#fff', borderColor: 'var(--d-border)' }}
                        >
                            <ul className="flex flex-col gap-6 p-10 font-bold text-xl">
                                <li><a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--d-text)' }}>Features</a></li>
                                <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--d-text)' }}>Pricing</a></li>
                                <li><a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--d-text)' }}>Contact</a></li>
                                <li><Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--d-text)' }}>Login</Link></li>
                            </ul>
                            <div className="flex flex-col gap-4 pt-4 border-t" style={{ borderColor: 'var(--d-border)' }}>
                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full py-4 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2" style={{ background: 'var(--d-text)', color: 'var(--d-bg)' }}>
                                        Get Started <FiArrowRight />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

                    <main className="relative">
                        {/* --- HERO SECTION (AlgoBuilder Style) --- */}
                <section className="relative pt-32 pb-16 md:pt-56 md:pb-32 overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                    </div>
 
                    <div className="max-w-7xl mx-auto px-6 z-10 relative">
                        <div className="text-left lg:text-center max-w-5xl mx-auto mb-16 md:mb-20">
                            {/* Badge */}
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border transition-all bg-white/5 backdrop-blur-md" 
                                style={{ borderColor: 'var(--d-border)' }}
                            >
                                <FiCpu className="text-indigo-500 animate-pulse" />
                                <span className="text-[10px] md:text-sm font-black uppercase tracking-widest opacity-70">AI-Powered Career Platform</span>
                            </motion.div>
 
                            {/* Heading */}
                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8" style={{ color: 'var(--d-text)' }}>
                                Build your <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500" style={{ backgroundImage: isDark ? 'linear-gradient(to bottom, #fff 70%, #666 100%)' : 'linear-gradient(to bottom, #000 70%, #444 100%)' }}>
                                    developer career <br className="hidden md:block" />
                                    with AI
                                </span>
                            </h1>
 
                            {/* Subtext */}
                            <p className="text-base md:text-xl opacity-60 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                No more manual searching — just describe your career goals and watch DevPilot AI analyze resumes, scan GitHub, and prepare you for interviews.
                            </p>
 
                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-start lg:justify-center items-center mb-16">
                                <Link href="/signup" className="w-full sm:w-auto">
                                    <button className="w-full px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-2xl active:scale-95" style={{ background: 'var(--d-text)', color: 'var(--d-bg)' }}>
                                        Get Started Free <FiArrowRight size={20} />
                                    </button>
                                </Link>
                                <button onClick={() => setDemoOpen(true)} className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 border hover:bg-white/5 transition-all backdrop-blur-sm" style={{ borderColor: 'var(--d-border)', color: 'var(--d-text)' }}>
                                    Live Dashboard Demo <FiPlay size={20} />
                                </button>
                            </div>
 
                            {/* Realistic Dashboard Preview (Mobile Optimized) */}
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="relative max-w-5xl mx-auto group mb-12 md:mb-24"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000" />
                                <div className="relative rounded-[2rem] border overflow-hidden shadow-2xl flex flex-col md:flex-row h-[400px] md:h-[600px] backdrop-blur-xl transition-colors duration-500" style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}>
                                    
                                    {/* Mock Sidebar (Hidden on mobile) */}
                                    <div className="hidden md:flex w-56 border-r p-6 flex-col gap-8 transition-colors duration-500" style={{ borderColor: 'var(--d-border)', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <PremiumLogo size="sm" />
                                            <span className="text-[10px] font-black tracking-widest opacity-80">DEVPILOT_CORE</span>
                                        </div>
                                        <div className="space-y-2">
                                            {['Insights', 'Resume', 'GitHub', 'Interviews', 'Settings'].map((item, i) => (
                                                <div key={i} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${i === 0 ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner' : 'opacity-40 hover:opacity-100 cursor-pointer'}`}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/5">
                                            <div className="text-[8px] font-black mb-2 opacity-40 uppercase tracking-widest">Usage Limits</div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: '75%' }}
                                                    transition={{ duration: 1.5 }}
                                                    className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" 
                                                />
                                            </div>
                                        </div>
                                    </div>
 
                                    {/* Main Content Area */}
                                    <div className="flex-1 flex flex-col min-w-0" style={{ background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.01)' }}>
                                        {/* Fake Header */}
                                        <div className="h-14 md:h-16 border-b flex items-center justify-between px-6 md:px-8" style={{ borderColor: 'var(--d-border)' }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">System_Status: OK</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:block w-24 h-2 bg-white/5 rounded-full" />
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                                    <div className="w-4 h-4 rounded-full bg-indigo-500/40" />
                                                </div>
                                            </div>
                                        </div>
 
                                        {/* Dashboard Body */}
                                        <div className="flex-1 p-5 md:p-10 flex flex-col overflow-hidden relative">
                                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
                                                <div className="flex-1 p-5 md:p-6 rounded-2xl md:rounded-3xl border transition-colors" style={{ borderColor: 'var(--d-border)', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)' }}>
                                                    <div className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-3 md:mb-4">AI Talent Score</div>
                                                    <div className="text-3xl md:text-4xl font-black mb-2">94.2 <span className="text-xs text-emerald-500 font-bold ml-1">+2.4%</span></div>
                                                    <div className="text-[9px] opacity-40 font-bold uppercase tracking-wide">Top 5% Globally</div>
                                                </div>
                                                <div className="hidden sm:block flex-1 p-6 rounded-3xl border transition-colors" style={{ borderColor: 'var(--d-border)', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)' }}>
                                                    <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-4">Market Readiness</div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 2 }} className="h-full bg-indigo-500" />
                                                        </div>
                                                        <span className="text-xs font-black">85%</span>
                                                    </div>
                                                </div>
                                            </div>
 
                                            {/* AI Interaction Center */}
                                            <div className="flex-1 flex flex-col items-center justify-center text-center relative py-4 md:py-0">
                                                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                                    <div className="w-64 md:w-96 h-64 md:h-96 bg-indigo-500/20 blur-[80px] md:blur-[100px] rounded-full animate-pulse" />
                                                </div>
                                                <div className="relative z-10 space-y-4 md:space-y-6 max-w-md mx-auto">
                                                    <div className="scale-60 md:scale-100 flex justify-center -mb-4 md:mb-0">
                                                        <SiriOrb />
                                                    </div>
                                                    <p className="text-xs md:text-sm font-bold opacity-60 leading-relaxed px-4">
                                                        "I've identified <span className="text-indigo-400">3 architectural patterns</span> in your latest commit that could be optimized."
                                                    </p>
                                                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                                                        {['Apply Fix', 'Review'].map((btn, i) => (
                                                            <div key={i} className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-[8px] md:text-[9px] font-black hover:bg-white/5 transition-all cursor-pointer uppercase tracking-widest shadow-sm" style={{ borderColor: 'var(--d-border)', background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.9)' }}>
                                                                {btn}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
 
                                            {/* Chat Input Bar */}
                                            <div className="mt-4 md:mt-8 p-2 md:p-3 rounded-xl md:rounded-2xl border flex items-center gap-3 md:gap-4 transition-colors" style={{ borderColor: 'var(--d-border)', background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.9)' }}>
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-20"><FiPlus size={14} /></div>
                                                <div className="flex-1 text-[9px] md:text-[10px] opacity-20 font-bold uppercase tracking-widest truncate">Ask anything to DevPilot...</div>
                                                <div className="flex gap-2">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-full bg-white/5 flex items-center justify-center opacity-40"><FiMic size={14} /></div>
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.4)]"><FiSend size={14} className="text-white" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                        </div>
 
                        {/* Visual Mockup (AlgoBuilder Grid Layout) */}
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
                                {[
                                    { title: "1. AI Resume Analysis", icon: FiFileText, color: "indigo", rgb: "99, 102, 241", lines: ["Analyzing syntax...", "ATS Score: 92/100", "Keywords synced."] },
                                    { title: "2. GitHub Pattern Scan", icon: FiGithub, color: "purple", rgb: "139, 92, 246", lines: ["Repo audit in progress...", "Logic flaws: 0", "Patterns: clean."] },
                                    { title: "3. Mock Technical Screen", icon: FiTerminal, color: "emerald", rgb: "16, 185, 129", lines: ["Voice session active", "Speed: optimal", "Accuracy: 95%"] }
                                ].map((step, i) => (
                                    <div key={i} className="flex flex-col gap-4 md:gap-6">
                                        <div className="text-center">
                                            <div className="text-[9px] md:text-[10px] font-black opacity-40 mb-2 uppercase tracking-[0.3em]">{step.title}</div>
                                            <div className="w-px h-6 md:h-8 mx-auto" style={{ background: 'var(--d-border)' }} />
                                        </div>
                                        <div className="relative group rounded-[2rem] md:rounded-[2.5rem] border overflow-hidden p-6 md:p-8 shadow-2xl transition-all hover:-translate-y-2 h-[240px] md:h-[280px] flex flex-col justify-between" style={{ background: isDark ? 'var(--d-card)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}>
                                            <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br from-${step.color}-500 to-transparent`} />
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-${step.color}-500/20 bg-${step.color}-500/10 text-${step.color}-500 shadow-inner`}>
                                                        <step.icon size={22} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-[10px] uppercase tracking-widest">Scanner</span>
                                                        <span className={`text-[8px] md:text-[9px] font-bold text-${step.color}-500/60 animate-pulse`}>ACTIVE_CONNECTION</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 font-mono text-[9px] md:text-[10px] opacity-40 uppercase tracking-tight">
                                                    {step.lines.map((line, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className={`w-1 h-1 rounded-full bg-${step.color}-500`} />
                                                            {line}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative z-10 w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    animate={{ x: ['-100%', '100%'] }} 
                                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                                                    className={`w-1/2 h-full bg-${step.color}-500/40`} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
 
                {/* --- CAPABILITIES (Alternating Sections) --- */}
                <section id="features" className="py-16 md:py-24 border-t" style={{ borderColor: 'var(--d-border)' }}>
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section 1: Intelligent Auditing */}
                        <div className="mb-16 md:mb-24">
                            <div className="text-center mb-16 md:mb-24">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-6"
                                >
                                    <FiZap size={12} className="animate-pulse" />
                                    Intelligent Auditing
                                </motion.div>
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]" 
                                    style={{ color: 'var(--d-text)' }}
                                >
                                    You build the code, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-sans italic font-normal text-4xl md:text-6xl">DevPilot audits</span> the patterns
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-base md:text-xl opacity-60 max-w-2xl mx-auto font-medium"
                                >
                                    From memory leaks to architectural flaws, just sync your repo and our AI handles the pattern recognition. Gain institutional-grade feedback on every commit.
                                </motion.p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16 items-start">
                                {/* Left Column: The Visual (Audit Engine Console) */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative order-2 lg:order-1"
                                >
                                    <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />
                                    <div className="p-8 md:p-12 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col transition-colors duration-500" style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}>
                                        <div className="flex items-center justify-between mb-8 border-b pb-6" style={{ borderColor: 'var(--d-border)' }}>
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Audit_Engine_v2.4</div>
                                        </div>

                                        <div className="space-y-6 font-mono text-[11px] md:text-xs">
                                            <div className="flex gap-4">
                                                <span className="opacity-30">01</span>
                                                <span className="text-indigo-400">Scanning repository: <span className="text-white dark:text-indigo-200">devpilot-core...</span></span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="opacity-30">02</span>
                                                <span className="text-emerald-500">Success: <span className="text-white dark:text-emerald-200 font-bold">Pattern verification complete.</span></span>
                                            </div>

                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="p-6 rounded-2xl border relative overflow-hidden"
                                                style={{ 
                                                    background: isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)',
                                                    borderColor: 'rgba(99, 102, 241, 0.2)'
                                                }}
                                            >
                                                <div className="flex gap-4 relative z-10">
                                                    <FiShield size={20} className="text-indigo-500 shrink-0 mt-1" />
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--d-text)' }}>Structural Insight:</span>
                                                        <span className="text-sm leading-relaxed opacity-70" style={{ color: 'var(--d-text)' }}>
                                                            Recommended <span className="text-indigo-500 font-bold">singleton pattern</span> for <span className="font-bold underline decoration-indigo-500/30">AuthService</span> to optimize memory footprint by <span className="text-emerald-500 font-bold">14%</span>.
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            <div className="flex gap-4 items-center">
                                                <span className="opacity-30">03</span>
                                                <motion.div 
                                                    animate={{ opacity: [0, 1, 0] }} 
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className="w-2 h-4 bg-indigo-500" 
                                                />
                                            </div>
                                        </div>

                                        {/* Floating Repo Badge */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.2 }}
                                            className="mt-10 px-5 py-3 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3 w-fit"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Main_Branch_Synced: 2m ago</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Right Column: Feature Cards */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="order-1 lg:order-2"
                                >
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { title: "Architectural Audit", desc: "Institutional-grade analysis of system design patterns and scalability.", icon: FiZap, rgb: "99, 102, 241" },
                                            { title: "Real-time Pattern Sync", desc: "Continuous monitoring of your codebase for design pattern violations.", icon: FiSearch, rgb: "139, 92, 246" },
                                            { title: "Risk Mitigation", desc: "Early detection of security vulnerabilities and logic flaws.", icon: FiShield, rgb: "16, 185, 129" },
                                            { title: "System Logic Prep", desc: "Automated test case generation based on functional logic flows.", icon: FiTerminal, rgb: "236, 72, 153" }
                                        ].map((f, i) => (
                                            <motion.div 
                                                key={i} 
                                                whileHover={{ x: 5 }}
                                                className="p-5 md:p-6 rounded-[2rem] border backdrop-blur-sm transition-all group/feat"
                                                style={{ 
                                                    borderColor: isDark ? `rgba(${f.rgb}, 0.1)` : `rgba(${f.rgb}, 0.15)`,
                                                    background: isDark 
                                                        ? `linear-gradient(135deg, rgba(${f.rgb}, 0.05) 0%, transparent 100%)`
                                                        : `linear-gradient(135deg, rgba(${f.rgb}, 0.03) 0%, transparent 100%)`,
                                                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
                                                }}
                                            >
                                                <div className="flex gap-5">
                                                    <div 
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover/feat:scale-110"
                                                        style={{ 
                                                            background: `rgba(${f.rgb}, 0.1)`,
                                                            color: `rgb(${f.rgb})`,
                                                            border: `1px solid rgba(${f.rgb}, 0.2)`
                                                        }}
                                                    >
                                                        <f.icon size={22} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--d-text)' }}>{f.title}</h4>
                                                        <p className="text-sm opacity-50 leading-relaxed" style={{ color: 'var(--d-text)' }}>{f.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                        <Link href="/signup" className="flex-1">
                                            <button className="w-full px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-3 bg-indigo-600 text-white hover:scale-105 hover:shadow-indigo-500/20">
                                                Start Repository Scan <FiArrowRight />
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                         {/* Section 2: DevPilot Voice Intelligence (Neural Link) */}
                        <div id="voice" className="mb-16 md:mb-24">
                            <div className="text-center mb-16 md:mb-24">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-widest mb-6"
                                >
                                    <FiMic size={12} className="animate-pulse" />
                                    Neural Voice Intelligence
                                </motion.div>
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]" 
                                    style={{ color: 'var(--d-text)' }}
                                >
                                    Natural AI conversation <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-sans italic font-normal text-4xl md:text-6xl">Real-time feedback</span>
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-base md:text-xl opacity-60 max-w-2xl mx-auto font-medium"
                                >
                                    Experience natural, human-like dialogue with DevPilot. Get instant feedback on your tone, technical accuracy, and filler-word usage during mock interviews.
                                </motion.p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16 items-start">
                                {/* Left Column: Neural Link Orb Dashboard */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative order-2 lg:order-1"
                                >
                                    <div className="absolute -inset-10 bg-purple-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />
                                    <div className="p-8 md:p-12 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center transition-colors duration-500 min-h-[400px] md:min-h-[500px]" style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}>
                                        {/* Orbital Rings Background */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                                                    className="absolute border rounded-full"
                                                    style={{ 
                                                        width: 200 + i * 80, 
                                                        height: 200 + i * 80,
                                                        borderColor: 'var(--d-border)'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <div className="mb-12 text-center w-full">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-2">Interface_Active</div>
                                            <h3 className="text-xl font-black" style={{ color: 'var(--d-text)' }}>Neural Link Session</h3>
                                        </div>

                                        {/* Main Animated Mic Orb */}
                                        <div className="relative flex items-center justify-center mb-16">
                                            <motion.div 
                                                animate={{ 
                                                    scale: [1, 1.12, 1],
                                                    boxShadow: [
                                                        "0 0 40px rgba(168, 85, 247, 0.2)",
                                                        "0 0 100px rgba(168, 85, 247, 0.4)",
                                                        "0 0 40px rgba(168, 85, 247, 0.2)"
                                                    ]
                                                }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="relative w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 flex items-center justify-center z-10 border border-white/20 shadow-2xl"
                                            >
                                                <FiMic className="text-white drop-shadow-xl text-4xl md:text-6xl" />
                                                
                                                {/* Pulse Rings */}
                                                <motion.div 
                                                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="absolute inset-0 rounded-full border-2 border-purple-400"
                                                />
                                                <motion.div 
                                                    animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                                    className="absolute inset-0 rounded-full border border-indigo-400"
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Audio Spectrum Visualizer (Faked with motion) */}
                                        <div className="flex gap-1.5 h-12 items-end mb-10">
                                            {[...Array(12)].map((_, i) => (
                                                <motion.div 
                                                    key={i}
                                                    animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                                                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                                                    className="w-1.5 rounded-full bg-purple-500/50"
                                                />
                                            ))}
                                        </div>

                                        <div className="mt-auto flex flex-wrap justify-center gap-3">
                                            {['Low Latency', '95% Accuracy', 'Biometric Tone'].map((tag, i) => (
                                                <div key={i} className="px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-[9px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right Column: Feature Cards */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="order-1 lg:order-2"
                                >
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { title: "Neural Audio Synthesis", desc: "Ultra-low latency audio engine delivering human-like responses in under 200ms.", icon: FiMic, rgb: "168, 85, 247" },
                                            { title: "Tone & Sentiment Audit", desc: "AI-driven analysis of your speaking rhythm, confidence levels, and emotional resonance.", icon: FiActivity, rgb: "99, 102, 241" },
                                            { title: "Filler-Word Elimination", desc: "Automatically tracks and flags filler words like 'um', 'like', and 'actually' in real-time.", icon: FiX, rgb: "236, 72, 153" },
                                            { title: "Behavioral Coaching", desc: "Personalized suggestions on how to structure your answers for maximum impact.", icon: FiTarget, rgb: "16, 185, 129" }
                                        ].map((f, i) => (
                                            <motion.div 
                                                key={i} 
                                                whileHover={{ x: 5 }}
                                                className="p-5 md:p-6 rounded-[2rem] border backdrop-blur-sm transition-all group/feat"
                                                style={{ 
                                                    borderColor: isDark ? `rgba(${f.rgb}, 0.1)` : `rgba(${f.rgb}, 0.15)`,
                                                    background: isDark 
                                                        ? `linear-gradient(135deg, rgba(${f.rgb}, 0.05) 0%, transparent 100%)`
                                                        : `linear-gradient(135deg, rgba(${f.rgb}, 0.03) 0%, transparent 100%)`,
                                                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
                                                }}
                                            >
                                                <div className="flex gap-5">
                                                    <div 
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover/feat:scale-110"
                                                        style={{ 
                                                            background: `rgba(${f.rgb}, 0.1)`,
                                                            color: `rgb(${f.rgb})`,
                                                            border: `1px solid rgba(${f.rgb}, 0.2)`
                                                        }}
                                                    >
                                                        <f.icon size={22} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--d-text)' }}>{f.title}</h4>
                                                        <p className="text-sm opacity-50 leading-relaxed" style={{ color: 'var(--d-text)' }}>{f.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-12">
                                        <Link href="/signup">
                                            <button className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-sm md:text-base transition-all shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:scale-105 hover:shadow-purple-500/20">
                                                Initialize Neural Link <FiArrowRight />
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Section 3: ATS Benchmarking (The Audit) */}
                        <div id="benchmarking" className="mb-16 md:mb-24">
                            <div className="text-center mb-16 md:mb-24">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-6"
                                >
                                    <FiZap size={12} className="animate-pulse" />
                                    Institutional Data Benchmarking
                                </motion.div>
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]" 
                                    style={{ color: 'var(--d-text)' }}
                                >
                                    Real-time <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-sans italic font-normal text-4xl md:text-6xl">ATS Match Results</span>
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-base md:text-xl opacity-60 max-w-2xl mx-auto font-medium"
                                >
                                    Analysis complete. Your profile has been cross-referenced with 40k+ successful hires at Tier-1 companies.
                                </motion.p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                {/* Left Column: Audit Log & CTA */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col gap-8"
                                >
                                    <div className="p-6 md:p-10 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl relative overflow-hidden transition-colors duration-500" style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}>
                                        <div className="absolute top-0 right-0 p-4 flex gap-1.5 opacity-30">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Deep_Pattern_Audit</div>
                                        
                                        <div className="space-y-4 font-mono text-[11px] md:text-xs">
                                            <div className="flex gap-4">
                                                <span className="opacity-30">01</span>
                                                <span className="text-indigo-400">Initializing deep-scan... <span className="text-emerald-500">[OK]</span></span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="opacity-30">02</span>
                                                <span style={{ color: 'var(--d-text)' }} className="opacity-80">Comparing architecture patterns vs FAANG standard...</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="opacity-30">03</span>
                                                <span className="text-emerald-500 font-bold">94% structural alignment detected.</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="opacity-30">04</span>
                                                <span style={{ color: 'var(--d-text)' }} className="opacity-40">Identifying 2 critical skill gaps in "System Design".</span>
                                            </div>
                                            <motion.div 
                                                animate={{ opacity: [0, 1, 0] }} 
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className="w-2 h-4 bg-indigo-500 ml-8" 
                                            />
                                        </div>
                                    </div>

                                    <Link href="/signup">
                                        <button className="w-full px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-3 bg-indigo-600 text-white hover:scale-105 hover:shadow-indigo-500/20">
                                            View Detailed Audit Report <FiArrowRight />
                                        </button>
                                    </Link>
                                </motion.div>

                                {/* Right Column: Visual Dashboard */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />
                                    
                                    <div className="p-8 md:p-12 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center text-center transition-colors duration-500" style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}>
                                        {/* Overall Score Radial Gauge */}
                                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-8">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle 
                                                    cx="50%" cy="50%" r="45%" 
                                                    fill="none" stroke="currentColor" strokeWidth="12" 
                                                    className={isDark ? "text-white/5" : "text-black/5"} 
                                                />
                                                <motion.circle 
                                                    cx="50%" cy="50%" r="45%" 
                                                    fill="none" stroke="url(#gradient-score-ats)" strokeWidth="12" 
                                                    strokeDasharray="283" 
                                                    initial={{ strokeDashoffset: 283 }}
                                                    whileInView={{ strokeDashoffset: 283 * (1 - 0.94) }}
                                                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                                                    strokeLinecap="round"
                                                    viewport={{ once: true }}
                                                />
                                                <defs>
                                                    <linearGradient id="gradient-score-ats" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#818cf8" />
                                                        <stop offset="100%" stopColor="#c084fc" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <motion.span 
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 1, delay: 1 }}
                                                    className="text-5xl md:text-7xl font-black text-transparent bg-clip-text"
                                                    style={{ backgroundImage: isDark ? 'linear-gradient(to bottom, #fff, #888)' : 'linear-gradient(to bottom, #000, #555)' }}
                                                >
                                                    94
                                                </motion.span>
                                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-40" style={{ color: 'var(--d-text)' }}>ATS Score</span>
                                            </div>
                                        </div>

                                        {/* Skill Gaps Grid */}
                                        <div className="w-full grid grid-cols-1 gap-4">
                                            {[
                                                { label: "Cloud Infra", status: "Optimal", val: 98, color: "emerald", rgb: "16, 185, 129" },
                                                { label: "System Design", status: "Critical Gap", val: 42, color: "red", rgb: "239, 68, 68" },
                                                { label: "Backend Auth", status: "Optimal", val: 91, color: "emerald", rgb: "16, 185, 129" }
                                            ].map((skill, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1.5 + i * 0.1 }}
                                                    className="p-5 rounded-2xl border backdrop-blur-sm group/skill transition-all"
                                                    style={{ 
                                                        borderColor: isDark ? `rgba(${skill.rgb}, 0.1)` : `rgba(${skill.rgb}, 0.15)`,
                                                        background: isDark 
                                                            ? `linear-gradient(135deg, rgba(${skill.rgb}, 0.05) 0%, transparent 100%)`
                                                            : `linear-gradient(135deg, rgba(${skill.rgb}, 0.03) 0%, transparent 100%)`,
                                                        boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--d-text)' }}>{skill.label}</span>
                                                            <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: `rgb(${skill.rgb})` }}>{skill.status}</span>
                                                        </div>
                                                        <span className="text-[10px] font-black opacity-40" style={{ color: 'var(--d-text)' }}>{skill.val}%</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${skill.val}%` }}
                                                            transition={{ duration: 1.5, delay: 1.8 }}
                                                            className="h-full rounded-full"
                                                            style={{ background: `rgb(${skill.rgb})` }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Info Badge */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 2.2 }}
                                            className="mt-8 px-5 py-2.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Live_Sync: Google SRE Benchmarking</span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Section 4: Global Job Intelligence (The Opportunity) */}
                        <div id="jobs" className="mb-16 md:mb-24">
                            {/* Section Header */}
                            <div className="text-center mb-16 md:mb-24">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex flex-wrap justify-center gap-2 mb-8"
                                >
                                    {[
                                        "AI Match Engine", "Multi-Platform Sync", "Real-Time Hiring Signals", 
                                        "Smart Resume Scanner", "Global Remote Jobs", "Instant Skill Analysis"
                                    ].map(badge => (
                                        <span key={badge} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">{badge}</span>
                                    ))}
                                </motion.div>
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]" 
                                    style={{ color: 'var(--d-text)' }}
                                >
                                    AI-Powered Global <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-sans italic text-4xl md:text-6xl">Job Intelligence</span>
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-base md:text-xl opacity-60 max-w-2xl mx-auto font-medium"
                                >
                                    Search jobs from every major platform in one place — powered by DevPilot AI. No more switching between LinkedIn, Indeed, Upwork, or Wellfound.
                                </motion.p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24">
                                {/* Interactive Job Search Visual */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-6 md:-inset-10 bg-indigo-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />
                                    <div className={`relative p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border shadow-2xl overflow-hidden backdrop-blur-xl transition-colors duration-500`} style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}>
                                        <div className="mb-10">
                                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4">
                                                <div className={`flex-1 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border text-xs md:text-sm font-bold flex items-center gap-3 transition-colors`} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', color: 'var(--d-sub)' }}>
                                                    <FiSearch size={16} className="opacity-40" />
                                                    Fullstack MERN Engineer
                                                </div>
                                                <div className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-indigo-600 text-white font-black text-xs md:text-sm flex items-center justify-center gap-3 shadow-lg hover:bg-indigo-500 transition-all cursor-pointer group/btn">
                                                    <FiSearch size={18} className="group-hover:scale-110 transition-transform" /> 
                                                    <span>Search</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {["Remote", "Full-time", "$150k+", "Senior", "United States"].map(tag => (
                                                    <span key={tag} className={`px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-wider transition-colors`} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', color: 'var(--d-sub)' }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { company: "Anthropic", role: "AI Research Engineer", stack: ["Claude", "Python", "Rust"], salary: "$250k", match: 98, time: "2h ago", color: "amber", hex: "#f59e0b", rgb: "245, 158, 11" },
                                                { company: "Supabase", role: "Senior Backend Engineer", stack: ["Go", "Postgres", "Elixir"], salary: "$170k", match: 96, time: "5h ago", color: "emerald", hex: "#10b981", rgb: "16, 185, 129" },
                                                { company: "Scale AI", role: "Fullstack Product Engineer", stack: ["React", "Node", "MongoDB"], salary: "$190k", match: 94, time: "1d ago", color: "indigo", hex: "#6366f1", rgb: "99, 102, 241" },
                                                { company: "Stripe", role: "Payments Infrastructure Lead", stack: ["Ruby", "AWS", "K8s"], salary: "$220k", match: 89, time: "2d ago", color: "purple", hex: "#8b5cf6", rgb: "139, 92, 246" }
                                            ].map((job, i) => (
                                                <motion.div 
                                                    key={i} 
                                                    whileHover={{ y: -8, scale: 1.02 }}
                                                    className={`p-5 md:p-6 rounded-2xl border transition-all cursor-pointer group/card relative overflow-hidden backdrop-blur-sm`} 
                                                    style={{ 
                                                        borderColor: isDark ? `rgba(${job.rgb}, 0.15)` : `rgba(${job.rgb}, 0.2)`,
                                                        background: isDark 
                                                            ? `linear-gradient(135deg, rgba(${job.rgb}, 0.08) 0%, rgba(${job.rgb}, 0.02) 50%, transparent 100%)`
                                                            : `linear-gradient(135deg, rgba(${job.rgb}, 0.12) 0%, rgba(${job.rgb}, 0.04) 50%, transparent 100%)`,
                                                        boxShadow: isDark
                                                            ? `inset 0 0 20px rgba(${job.rgb}, 0.03), 0 10px 30px -10px rgba(0,0,0,0.5)`
                                                            : `inset 0 0 20px rgba(${job.rgb}, 0.05), 0 10px 30px -10px rgba(0,0,0,0.1)`
                                                    }}
                                                >
                                                    {/* Dynamic Hover Glow */}
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        whileHover={{ opacity: 1 }}
                                                        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                                                        style={{
                                                            background: `radial-gradient(circle at top right, rgba(${job.rgb}, ${isDark ? '0.15' : '0.1'}), transparent 70%)`
                                                        }}
                                                    />
                                                    
                                                    <div className="flex justify-between items-start mb-5 relative z-10">
                                                        <div 
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-lg group-hover/card:rotate-6 transition-transform"
                                                            style={{ 
                                                                background: `rgba(${job.rgb}, ${isDark ? '0.1' : '0.15'})`,
                                                                border: `1px solid rgba(${job.rgb}, 0.2)`,
                                                                color: job.hex
                                                            }}
                                                        >
                                                            {job.company[0]}
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <span 
                                                                    className="px-2 py-0.5 rounded-md text-[8px] font-black tracking-wider uppercase border"
                                                                    style={{
                                                                        background: `rgba(16, 185, 129, ${isDark ? '0.1' : '0.1'})`,
                                                                        borderColor: 'rgba(16, 185, 129, 0.2)',
                                                                        color: '#10b981'
                                                                    }}
                                                                >
                                                                    {job.match}% MATCH
                                                                </span>
                                                                {job.match > 95 && (
                                                                    <div 
                                                                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                                                                        style={{ 
                                                                            backgroundColor: job.hex,
                                                                            boxShadow: `0 0 8px ${job.hex}`
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <span className="text-[8px] font-bold opacity-30 uppercase tracking-tighter" style={{ color: 'var(--d-text)' }}>{job.time}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="relative z-10">
                                                        <div className="text-xs font-black mb-1.5 flex items-center gap-2" style={{ color: 'var(--d-text)' }}>
                                                            {job.company}
                                                            <FiCheckCircle size={10} className="text-indigo-500 opacity-60" />
                                                        </div>
                                                        <div className="text-[10px] font-bold opacity-60 mb-4 truncate" style={{ color: 'var(--d-text)' }}>{job.role}</div>
                                                        
                                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                                            {job.stack.map(s => (
                                                                <span 
                                                                    key={s} 
                                                                    className="px-2 py-0.5 rounded-md text-[8px] font-bold border transition-colors"
                                                                    style={{
                                                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                                                                        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                                                        color: 'var(--d-sub)'
                                                                    }}
                                                                >
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.1em] pt-4 border-t" style={{ borderColor: 'var(--d-border)' }}>
                                                            <div className="flex items-center gap-2 opacity-40">
                                                                <FiMap size={10} />
                                                                <span>Remote</span>
                                                            </div>
                                                            <div style={{ color: job.hex }}>{job.salary}</div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                    <motion.div 
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="text-left"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-12">
                                        {[
                                            { title: "Unified job discovery", desc: "No more switching between LinkedIn, Indeed, Upwork, Wellfound, or RemoteOK.", icon: FiGlobe, color: "blue", rgb: "59, 130, 246" },
                                            { title: "AI skill matching", desc: "Instantly matches roles to your real skills, experience, and tech stack.", icon: FiCpu, color: "indigo", rgb: "99, 102, 241" },
                                            { title: "Smart recommendations", desc: "Personalized suggestions based on your portfolio and GitHub activity.", icon: FiZap, color: "emerald", rgb: "16, 185, 129" },
                                            { title: "Instant market trends", desc: "Stay ahead with real-time analysis of what companies are hiring for.", icon: FiTrendingUp, color: "amber", rgb: "245, 158, 11" }
                                        ].map((f, i) => (
                                            <motion.div 
                                                key={i} 
                                                whileHover={{ x: 5 }}
                                                className="p-5 rounded-[1.5rem] border backdrop-blur-sm transition-all group/feat"
                                                style={{ 
                                                    borderColor: isDark ? `rgba(${f.rgb}, 0.1)` : `rgba(${f.rgb}, 0.15)`,
                                                    background: isDark 
                                                        ? `linear-gradient(135deg, rgba(${f.rgb}, 0.05) 0%, transparent 100%)`
                                                        : `linear-gradient(135deg, rgba(${f.rgb}, 0.03) 0%, transparent 100%)`,
                                                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
                                                }}
                                            >
                                                <div className="flex gap-4">
                                                    <div 
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/feat:scale-110"
                                                        style={{ 
                                                            background: `rgba(${f.rgb}, 0.1)`,
                                                            color: `rgb(${f.rgb})`,
                                                            border: `1px solid rgba(${f.rgb}, 0.2)`
                                                        }}
                                                    >
                                                        <f.icon size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-base mb-1" style={{ color: 'var(--d-text)' }}>{f.title}</h4>
                                                        <p className="text-xs opacity-50 leading-relaxed" style={{ color: 'var(--d-text)' }}>{f.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                        <Link href="/signup" className="flex-1">
                                            <button className="w-full px-8 py-4 rounded-xl font-black text-sm bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3">
                                                Start AI Job Search <FiArrowRight />
                                            </button>
                                        </Link>
                                        <button onClick={() => setDemoOpen(true)} className="flex-1 px-8 py-4 rounded-xl font-bold text-sm border transition-all" style={{ borderColor: 'var(--d-border)', color: 'var(--d-text)', background: 'var(--d-bg)' }}>
                                            See AI Demo
                                        </button>
                                    </div>

                                    {/* Stats Dashboard - Standardized to Match Features */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { label: "Active Jobs", val: "50K+", desc: "Real-time developer roles tracked daily.", icon: FiBriefcase, rgb: "99, 102, 241" },
                                            { label: "Platforms", val: "120+", desc: "Global boards and career portals synced.", icon: FiGlobe, rgb: "139, 92, 246" },
                                            { label: "Match Accuracy", val: "92%", desc: "Precision matching for niche tech stacks.", icon: FiTarget, rgb: "16, 185, 129" },
                                            { label: "Faster Invites", val: "84%", desc: "Increase in response rates via AI assist.", icon: FiZap, rgb: "245, 158, 11" }
                                        ].map((stat, i) => (
                                            <motion.div 
                                                key={i} 
                                                whileHover={{ y: -5 }}
                                                className="p-5 rounded-[1.5rem] border backdrop-blur-sm transition-all group/stat"
                                                style={{ 
                                                    borderColor: isDark ? `rgba(${stat.rgb}, 0.1)` : `rgba(${stat.rgb}, 0.15)`,
                                                    background: isDark 
                                                        ? `linear-gradient(135deg, rgba(${stat.rgb}, 0.05) 0%, transparent 100%)`
                                                        : `linear-gradient(135deg, rgba(${stat.rgb}, 0.03) 0%, transparent 100%)`,
                                                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
                                                }}
                                            >
                                                <div className="flex gap-4 items-center">
                                                    <div 
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/stat:scale-110"
                                                        style={{ 
                                                            background: `rgba(${stat.rgb}, 0.1)`,
                                                            color: `rgb(${stat.rgb})`,
                                                            border: `1px solid rgba(${stat.rgb}, 0.2)`
                                                        }}
                                                    >
                                                        <stat.icon size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-black" style={{ color: `rgb(${stat.rgb})` }}>{stat.val}</div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1" style={{ color: 'var(--d-text)' }}>{stat.label}</div>
                                                        <p className="text-[9px] opacity-40 leading-tight font-medium" style={{ color: 'var(--d-text)' }}>{stat.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                            {/* --- HOW IT WORKS: STEP GUIDE --- */}
                            <div className="mb-20">
                                <div className="text-center mb-16">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-4"
                                    >
                                        <FiActivity size={12} />
                                        The Workflow
                                    </motion.div>
                                    <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: 'var(--d-text)' }}>How DevPilot AI Works</h3>
                                    <p className="opacity-60 max-w-xl mx-auto font-medium">A streamlined workflow from discovery to deployment.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                                    {[
                                        { step: "Search once", desc: "Scan 120+ boards instantly.", icon: FiSearch, rgb: "99, 102, 241" },
                                        { step: "AI analyzes skills", desc: "Profile-based alignment.", icon: FiCpu, rgb: "139, 92, 246" },
                                        { step: "Scan platforms", desc: "Global repository audit.", icon: FiGlobe, rgb: "59, 130, 246" },
                                        { step: "Rank opportunities", desc: "Smart matching logic.", icon: FiTarget, rgb: "16, 185, 129" },
                                        { step: "Apply faster", desc: "Automated prep assist.", icon: FiZap, rgb: "245, 158, 11" }
                                    ].map((f, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative flex flex-col items-center text-center p-8 rounded-[2.5rem] border shadow-xl backdrop-blur-md transition-all group/step"
                                            style={{ 
                                                background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)',
                                                borderColor: 'var(--d-border)' 
                                            }}
                                        >
                                            <div 
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover/step:scale-110 transition-transform"
                                                style={{ 
                                                    background: `rgba(${f.rgb}, 0.1)`,
                                                    color: `rgb(${f.rgb})`,
                                                    border: `1px solid rgba(${f.rgb}, 0.2)`
                                                }}
                                            >
                                                <f.icon size={24} />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Step 0{i + 1}</div>
                                            <div className="text-sm font-black mb-2" style={{ color: 'var(--d-text)' }}>{f.step}</div>
                                            <p className="text-[10px] opacity-40 font-bold leading-relaxed">{f.desc}</p>
                                            
                                            {i < 4 && (
                                                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                                                    <FiArrowRight className="opacity-20" size={16} />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* --- BENTO GRID: WHY DEVELOPERS LOVE IT --- */}
                            <div className="mb-32">
                                <div className="text-center mb-16">
                                    <h3 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight" style={{ color: 'var(--d-text)' }}>Why Devs <span className="text-indigo-500">Love</span> DevPilot</h3>
                                    <p className="opacity-60 max-w-xl mx-auto font-medium">Built by senior engineers for the next generation of talent.</p>
                                </div>
                                
                                <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                                    {[
                                        { title: "Privacy First", desc: "Your repo scans stay encrypted and local. We never store your raw code.", icon: FiShield, size: "md:col-span-2", rgb: "16, 185, 129" },
                                        { title: "24/7 Coach", desc: "Never wait for human feedback again. Instant technical audits.", icon: FiClock, size: "md:col-span-1", rgb: "99, 102, 241" },
                                        { title: "Global Scale", desc: "Direct access to Tier-1 roles across 120+ platforms.", icon: FiGlobe, size: "md:col-span-1", rgb: "139, 92, 246" },
                                        { title: "Smart Matching", desc: "92% accuracy on niche tech stacks from Rust to Elixir.", icon: FiTarget, size: "md:col-span-1", rgb: "245, 158, 11" },
                                        { title: "Deep Insights", desc: "Institutional-grade analysis on every commit. Understand the 'why' behind your code patterns.", icon: FiZap, size: "md:col-span-2", rgb: "236, 72, 153" },
                                        { title: "Open Source", desc: "Built with transparency at its core. Join the growing community.", icon: FiGithub, size: "md:col-span-1", rgb: "100, 116, 139" }
                                    ].map((item, i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ y: -5 }}
                                            className={`${item.size} p-8 rounded-[2.5rem] border backdrop-blur-xl flex flex-col justify-between transition-all group/bento`}
                                            style={{ 
                                                background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', 
                                                borderColor: 'var(--d-border)' 
                                            }}
                                        >
                                            <div 
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-12 shadow-lg group-hover/bento:scale-110 transition-transform"
                                                style={{ 
                                                    background: `rgba(${item.rgb}, 0.1)`,
                                                    color: `rgb(${item.rgb})`,
                                                    border: `1px solid rgba(${item.rgb}, 0.2)`
                                                }}
                                            >
                                                <item.icon size={22} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black mb-2" style={{ color: 'var(--d-text)' }}>{item.title}</h4>
                                                <p className="text-sm opacity-50 font-medium leading-relaxed" style={{ color: 'var(--d-text)' }}>{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* --- PRICING SECTION --- */}
                            <div id="pricing" className="mb-20 pt-16 border-t" style={{ borderColor: 'var(--d-border)' }}>
                                <div className="text-center mb-20">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-6"
                                    >
                                        <FiTrendingUp size={12} />
                                        Simple Tiered Pricing
                                    </motion.div>
                                    <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]" style={{ color: 'var(--d-text)' }}>
                                        Ready to scale <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-sans italic font-normal text-4xl md:text-6xl">your career?</span>
                                    </h2>
                                    <p className="text-base md:text-xl opacity-60 max-w-2xl mx-auto font-medium">
                                        Choose the plan that fits your current growth stage. No hidden fees, cancel anytime.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                    {[
                                        { 
                                            name: "Starter", 
                                            price: "0", 
                                            currency: "$",
                                            desc: "Perfect for exploring the platform.", 
                                            features: ["5 AI Resume Scans / mo", "Basic Job Search", "Public Portfolio", "Community Access"],
                                            color: "slate",
                                            rgb: "100, 116, 139"
                                        },
                                        { 
                                            name: "Pro", 
                                            price: "199", 
                                            currency: "₹",
                                            popular: true,
                                            desc: "The complete career acceleration toolkit.", 
                                            features: ["Unlimited Resume Scans", "Advanced AI Skill Matching", "GitHub Pattern Audit", "Voice Mock Interviews", "Priority Support"],
                                            color: "indigo",
                                            rgb: "99, 102, 241"
                                        },
                                        { 
                                            name: "Elite", 
                                            price: "499", 
                                            currency: "₹",
                                            desc: "For senior engineers eyeing top-tier roles.", 
                                            features: ["Everything in Pro", "Institutional Data Benchmarking", "Dedicated Career Coach", "Resume Rewrite Assist", "1-on-1 Strategy Session"],
                                            color: "purple",
                                            rgb: "139, 92, 246"
                                        }
                                    ].map((plan, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`relative p-8 md:p-10 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl flex flex-col transition-all hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-indigo-500 lg:scale-105 z-10' : ''}`}
                                            style={{ 
                                                background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)', 
                                                borderColor: plan.popular ? 'rgba(99, 102, 241, 0.5)' : 'var(--d-border)' 
                                            }}
                                        >
                                            {plan.popular && (
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                                    Most Popular
                                                </div>
                                            )}
                                            
                                            <div className="mb-8">
                                                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: `rgb(${plan.rgb})` }}>{plan.name}</div>
                                                <div className="flex items-baseline gap-1 mb-4">
                                                    <span className="text-4xl md:text-5xl font-black" style={{ color: 'var(--d-text)' }}>{plan.currency}{plan.price}</span>
                                                    <span className="text-sm font-bold opacity-40">/mo</span>
                                                </div>
                                                <p className="text-sm opacity-50 font-medium leading-relaxed">{plan.desc}</p>
                                            </div>

                                            <div className="space-y-4 mb-10 flex-1">
                                                {plan.features.map((f, idx) => (
                                                    <div key={idx} className="flex gap-3 items-center">
                                                        <FiCheck className="text-emerald-500 shrink-0" />
                                                        <span className="text-sm font-bold opacity-70" style={{ color: 'var(--d-text)' }}>{f}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                onClick={() => {
                                                    if (plan.price === "0") {
                                                        // Redirect to signup
                                                        window.location.href = "/signup";
                                                    } else {
                                                        setSelectedPlan(plan.name);
                                                        setInterestOpen(true);
                                                    }
                                                }}
                                                className="w-full py-5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                                                style={{ 
                                                    background: plan.popular ? 'var(--d-text)' : 'transparent',
                                                    color: plan.popular ? 'var(--d-bg)' : 'var(--d-text)',
                                                    border: plan.popular ? 'none' : '1px solid var(--d-border)'
                                                }}
                                            >
                                                {plan.price === "0" ? "Get Started Free" : "Subscribe Now"} <FiArrowRight />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                {/* --- FINAL CTA SECTION --- */}
                <section className="py-20 md:py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto rounded-[3rem] md:rounded-[4rem] border p-10 md:p-20 relative overflow-hidden shadow-2xl backdrop-blur-xl" 
                            style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.95)', borderColor: 'var(--d-border)' }}
                        >
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--d-text)_1px,_transparent_1px)]" style={{ backgroundSize: '40px 40px' }} />
                            <div className="absolute -inset-40 bg-indigo-500/20 blur-[140px] rounded-full pointer-events-none" />
                            
                            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 tracking-tight leading-[1.1]" style={{ color: 'var(--d-text)' }}>
                                Harness the world's most <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-4xl md:text-6xl">advanced AI</span>. Land <br />
                                your dream role.
                            </h2>
                            <p className="text-base md:text-lg opacity-60 mb-10 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
                                Join 50,000+ developers who are building their future with DevPilot AI. Your next breakthrough is one scan away.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
                                <Link href="/signup" className="w-full sm:w-auto">
                                    <button className="w-full px-12 py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/40">
                                        Join DevPilot Free
                                    </button>
                                </Link>
                                <button onClick={() => setDemoOpen(true)} className="w-full sm:w-auto px-12 py-6 rounded-[2rem] font-black text-xl border transition-all backdrop-blur-sm hover:bg-white/5 shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3" style={{ borderColor: 'var(--d-border)', color: 'var(--d-text)' }}>
                                    Live Demo <FiPlay size={24} />
                                </button>
                            </div>

                            {/* --- COMPACT INSIGHT CARDS (Requested) --- */}
                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto relative z-10">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-6 rounded-[2rem] border backdrop-blur-md text-left transition-all hover:border-indigo-500/30 group"
                                    style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: 'var(--d-border)' }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">ATS Score</div>
                                        <div className="text-3xl font-black text-indigo-500">94</div>
                                    </div>
                                    <div className="pt-4 border-t" style={{ borderColor: 'var(--d-border)' }}>
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="opacity-30">Cloud Infra</span>
                                            <span className="text-emerald-500">Optimal // 98%</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="p-6 rounded-[2rem] border backdrop-blur-md text-left transition-all hover:border-red-500/30 group"
                                    style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: 'var(--d-border)' }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">System Design</div>
                                        <div className="text-3xl font-black text-red-500">42%</div>
                                    </div>
                                    <div className="pt-4 border-t" style={{ borderColor: 'var(--d-border)' }}>
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="opacity-30">Backend Auth</span>
                                            <span className="text-amber-500">Critical Gap // 91%</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                        
                        <p className="text-2xl md:text-4xl font-black mt-20 opacity-20 tracking-widest uppercase">Start with your future.</p>
                    </div>
                </section>
            </main>

            {/* --- FOOTER (AlgoBuilder Style) --- */}
            <footer className="py-20 border-t" style={{ borderColor: 'var(--d-border)', background: 'var(--d-bg)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
                        <Link href="/" className="flex items-center gap-3">
                            <PremiumLogo size="sm" />
                            <span className="text-xl font-bold">DevPilot AI</span>
                        </Link>
                        <ul className="flex flex-wrap justify-center gap-8 text-sm font-medium opacity-60">
                            <li><Link href="/contact" className="hover:opacity-100">Contact Us</Link></li>
                            <li><Link href="/login" className="hover:opacity-100">Login</Link></li>
                            <li><Link href="/signup" className="hover:opacity-100">Register</Link></li>
                            <li><Link href="/terms" className="hover:opacity-100">Terms</Link></li>
                            <li><Link href="/privacy" className="hover:opacity-100">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <hr className="mb-12" style={{ borderColor: 'var(--d-border)' }} />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-xs font-bold uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-4">
                            <span>Strategic Partner</span>
                            <FiZap size={16} />
                            <span>Systems Integrated</span>
                        </div>
                        <div className="text-center md:text-right">
                            <p>© {new Date().getFullYear()} DEVPILOT_AI // GLOBAL_CAREER_NETWORK</p>
                        </div>
                    </div>
                </div>
                <section id="contact" className="py-20 border-t relative overflow-hidden" style={{ borderColor: 'var(--d-border)' }}>
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,_var(--d-text)_1px,_transparent_1px)]" style={{ backgroundSize: '40px 40px' }} />
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-2xl mx-auto text-center mb-16">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-6"
                            >
                                <FiMail size={12} />
                                Get In Touch
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Contact Us</h2>
                            <p className="opacity-50 font-medium">Have a specific question or custom requirement? Send us a message and we'll get back to you within 24 hours.</p>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="max-w-xl mx-auto p-8 md:p-12 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl"
                            style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)', borderColor: 'var(--d-border)' }}
                        >
                            <ContactForm />
                        </motion.div>
                    </div>
                </section>

            </footer>
            <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
            <InterestModal isOpen={interestOpen} onClose={() => setInterestOpen(false)} planName={selectedPlan} />
        </div>
    );
}

export default function LandingPage() {
    return (
        <ThemeProvider>
            <LandingPageContent />
        </ThemeProvider>
    );
}

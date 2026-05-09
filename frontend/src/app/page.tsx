'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiZap, FiArrowRight, FiFileText, FiGithub,
    FiTarget, FiCodesandbox, FiMenu, FiX, FiCheck,
    FiTerminal, FiActivity, FiCode, FiCpu, FiSun, FiMoon,
    FiPlay, FiShield, FiUsers, FiTrendingUp, FiCheckCircle, FiBriefcase, FiMic, FiSend, FiPlus, FiMap, FiSearch, FiMessageCircle
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
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

function LandingPageContent() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [demoOpen, setDemoOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } } };

    return (
        <div ref={containerRef} data-theme={isDark ? 'dark' : 'light'} className="min-h-screen font-sans overflow-x-hidden transition-colors duration-500 selection:bg-indigo-500/30" style={{ background: 'var(--d-bg)', color: 'var(--d-text)' }}>
            
            {/* --- GRAIN OVERLAY --- */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* --- NAVBAR --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl border-b py-4 shadow-sm' : 'bg-transparent py-6'}`} style={{ backgroundColor: scrolled ? (isDark ? 'rgba(11, 15, 25, 0.8)' : 'rgba(255, 255, 255, 0.8)') : 'transparent', borderColor: 'var(--d-border)' }}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <PremiumLogo />
                        <span className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--d-text)' }}>
                            DevPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {['Features', 'Dashboard', 'Jobs', 'Pricing'].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium transition-colors hover:text-indigo-500" style={{ color: 'var(--d-sub)' }}>
                                {item}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--d-sub)' }}>
                            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                        <Link href="/login" className="text-sm font-semibold transition-colors px-4 py-2" style={{ color: 'var(--d-text)' }}>
                            Log in
                        </Link>
                        <Link href="/signup">
                            <button className="px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:opacity-90" style={{ background: 'var(--d-btn-primary)', color: '#fff' }}>
                                Get Started
                            </button>
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full transition-colors" style={{ color: 'var(--d-sub)' }}>
                            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                        <button className="transition-colors" onClick={() => setMobileMenuOpen(true)} style={{ color: 'var(--d-text)' }}>
                            <FiMenu size={28} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[60] backdrop-blur-3xl p-6 flex flex-col border-b"
                        style={{ background: isDark ? 'rgba(11, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)', borderColor: 'var(--d-border)' }}
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-display text-xl font-bold" style={{ color: 'var(--d-text)' }}>Navigation</span>
                            <button onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--d-sub)' }}><FiX size={28} /></button>
                        </div>
                        <div className="flex flex-col gap-6 text-2xl font-display font-semibold">
                            {['Features', 'Dashboard', 'Jobs', 'Pricing'].map((item) => (
                                <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="transition-colors hover:text-indigo-400" style={{ color: 'var(--d-text)' }}>
                                    {item}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-col gap-4">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full border rounded-xl justify-center text-lg py-4 font-semibold transition-colors" style={{ borderColor: 'var(--d-border)', color: 'var(--d-text)', background: 'var(--d-card)' }}>Log in</button>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full rounded-xl justify-center text-lg py-4 font-bold transition-colors hover:opacity-90" style={{ background: 'var(--d-btn-primary)', color: '#fff' }}>Get Started</button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-indigo-500 text-[11px] font-bold uppercase tracking-widest mb-8 border" style={{ background: 'var(--d-badge-bg)', borderColor: 'var(--d-border)' }}>
                                <FiCpu className="animate-pulse" /> AI-Powered Career Platform for Developers
                            </div>
                            
                            <h1 className="font-display text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6" style={{ color: 'var(--d-text)' }}>
                                Build Your <br />
                                Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Career <br />with AI</span>
                            </h1>
                            
                            <p className="text-lg lg:text-xl leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--d-sub)' }}>
                                Analyze resumes, improve ATS scores, prepare for interviews, discover AI-powered job matches, and grow your software career faster.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mb-10">
                                <Link href="/signup">
                                    <button className="px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-xl flex items-center gap-3 hover:scale-105" style={{ background: 'var(--d-btn-primary)', color: '#fff' }}>
                                        Get Started Free <FiArrowRight size={20} />
                                    </button>
                                </Link>
                                <button onClick={() => setDemoOpen(true)} className="border px-8 py-4 rounded-2xl text-base font-bold transition-all flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--d-border)', color: 'var(--d-text)' }}>
                                    Try Live Demo <FiPlay size={20} className="fill-current" />
                                </button>
                            </div>

                            <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />

                            <div className="flex flex-wrap gap-6 text-[12px] font-bold" style={{ color: 'var(--d-muted)' }}>
                                <div className="flex items-center gap-2"><FiCheckCircle className="text-indigo-500" /> No credit card required</div>
                                <div className="flex items-center gap-2"><FiCheckCircle className="text-indigo-500" /> Built for Developers</div>
                                <div className="flex items-center gap-2"><FiCheckCircle className="text-indigo-500" /> AI-Driven Insights</div>
                            </div>
                        </motion.div>

                        {/* --- DASHBOARD CARD (REPLICATING REAL DASHBOARD EMPTY STATE) --- */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl flex min-h-[580px] border" style={{ background: 'var(--d-bg)', borderColor: 'var(--d-border)' }}>
                                
                                {/* --- SIDEBAR MOCKUP (REPLICATING IMAGE 1) --- */}
                                <div className="w-48 border-r p-5 flex flex-col gap-6 hidden sm:flex" style={{ borderColor: 'var(--d-border)', background: 'var(--d-card2)' }}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <PremiumLogo size="sm" />
                                        <span className="text-[10px] font-black tracking-tight" style={{ color: 'var(--d-text)' }}>DevPilot AI</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        {[
                                            { icon: FiZap, label: 'Dashboard', active: true },
                                            { icon: FiFileText, label: 'AI Resume' },
                                            { icon: FiGithub, label: 'GitHub Insights' },
                                            { icon: FiBriefcase, label: 'Job Matches' },
                                            { icon: FiTerminal, label: 'Interview Prep' },
                                            { icon: FiMap, label: 'Roadmap' },
                                            { icon: FiUsers, label: 'Profile' }
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[9px] font-bold transition-all ${item.active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 opacity-60'}`}>
                                                <item.icon size={12} /> {item.label}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                        <div className="text-[8px] font-black text-indigo-500 uppercase mb-2">PRO PLAN</div>
                                        <div className="w-full h-1.5 bg-indigo-500/20 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-indigo-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* --- MAIN CONTENT MOCKUP --- */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    {/* Header Bar Mockup */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--d-border)', background: 'var(--d-card)' }}>
                                        <div className="w-48 h-2 rounded-full bg-white/5" />
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 rounded-full bg-white/5" />
                                            <div className="w-8 h-8 rounded-full bg-white/10" />
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 p-6 flex flex-col items-center text-center overflow-hidden">
                                        <div className="scale-90 origin-top">
                                            <SiriOrb />
                                        </div>
                                        
                                        <div className="mb-6 max-w-xs mx-auto">
                                            <p className="text-[11px] md:text-xs font-bold leading-relaxed" style={{ color: 'var(--d-sub)' }}>
                                                I am <strong style={{ color: 'var(--d-text)' }}>DevPilot AI</strong>. Ask me to analyze your resume, scan your GitHub, or simulate an interview.
                                            </p>
                                        </div>

                                        {/* Pill Action Buttons */}
                                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                                            {[
                                                { icon: FiFileText, label: 'Analyze Resume' },
                                                { icon: FiGithub, label: 'Scan GitHub' },
                                                { icon: FiActivity, label: 'Interview Prep' },
                                                { icon: FiMap, label: 'Career Roadmap' }
                                            ].map((btn, i) => (
                                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black shadow-sm" style={{ background: 'var(--d-card)', borderColor: 'var(--d-border)', color: 'var(--d-text)' }}>
                                                    <btn.icon className="text-indigo-500" size={10} /> {btn.label}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Fake Chat Input */}
                                        <div className="w-full max-w-md bg-white/[0.03] border rounded-[1.5rem] p-2 flex items-center gap-3 mb-8 shadow-sm" style={{ background: 'var(--d-card)', borderColor: 'var(--d-border)' }}>
                                            <div className="p-1.5 text-slate-500"><FiPlus size={16} /></div>
                                            <div className="flex-1 text-left text-[10px] text-slate-500 font-bold tracking-tight">Ask DevPilot AI anything...</div>
                                            <div className="flex gap-2 pr-1">
                                                <div className="w-7 h-7 rounded-full border flex items-center justify-center text-slate-500" style={{ borderColor: 'var(--d-border)', background: 'var(--d-bg)' }}><FiMic size={14} /></div>
                                                <div className="w-7 h-7 rounded-full border flex items-center justify-center text-slate-500" style={{ borderColor: 'var(--d-border)', background: 'var(--d-bg)' }}><FiSend size={14} /></div>
                                            </div>
                                        </div>

                                        {/* Bottom Stats Cards (from Image 1) */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full mt-auto">
                                            {[
                                                { label: 'Profile Strength', val: '100%', color: 'text-indigo-500' },
                                                { label: 'AI Match Score', val: '72%', color: 'text-emerald-500' },
                                                { label: 'Job Matches', val: '6', color: 'text-slate-400' },
                                                { label: 'Interviews', val: '7', color: 'text-slate-400' }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/[0.02] border p-2.5 rounded-xl text-left" style={{ borderColor: 'var(--d-border)', background: 'var(--d-card)' }}>
                                                    <div className="text-[7px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</div>
                                                    <div className={`text-[10px] font-black ${stat.color}`}>{stat.val}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- STATS SECTION --- */}
                <section className="py-20 relative border-y" style={{ borderColor: 'var(--d-border)', background: 'var(--d-card2)' }}>
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { icon: FiUsers, label: '10K+', sub: 'Resume Analyses' },
                                { icon: FiShield, label: '95%', sub: 'ATS Accuracy' },
                                { icon: FiZap, label: 'AI-Powered', sub: 'Smart Insights' },
                                { icon: FiTarget, label: 'Developers', sub: 'By Developers' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-white mb-1" style={{ color: 'var(--d-text)' }}>{item.label}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- BENTO GRID FEATURES --- */}
                <section id="features" className="py-32 relative border-b" style={{ borderColor: 'var(--d-border)' }}>
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-20 text-center">
                            <div className="inline-block px-3 py-1 rounded bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest mb-4">The Engine</div>
                            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight" style={{ color: 'var(--d-text)' }}>Intelligence at every stage.</h2>
                        </div>

                        <div className="grid md:grid-cols-4 md:grid-rows-2 gap-4">
                            {/* Large Feature 1 */}
                            <motion.div variants={fadeUp} className="md:col-span-2 md:row-span-2 border rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative" style={{ background: 'var(--d-card)', borderColor: 'var(--d-border)' }}>
                                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20">
                                        <FiFileText size={28} className="text-indigo-500" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 tracking-tight">AI Resume Intelligence</h3>
                                    <p className="text-lg leading-relaxed max-w-sm" style={{ color: 'var(--d-sub)' }}>Our proprietary engine reverse-engineers enterprise ATS logic to score your resume against real-world job descriptions.</p>
                                </div>
                            </motion.div>

                            {/* Small Feature 1 */}
                            <motion.div variants={fadeUp} className="md:col-span-2 border rounded-3xl p-8 flex items-center gap-8 group" style={{ background: 'var(--d-card2)', borderColor: 'var(--d-border)' }}>
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <FiGithub size={24} className="text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Architecture Scanner</h3>
                                    <p className="text-sm" style={{ color: 'var(--d-sub)' }}>AI analyzes your repository patterns and suggests architectural improvements.</p>
                                </div>
                            </motion.div>

                            {/* Medium Feature 2 */}
                            <motion.div variants={fadeUp} className="md:col-span-1 border rounded-3xl p-8 flex flex-col justify-between group" style={{ background: 'var(--d-card2)', borderColor: 'var(--d-border)' }}>
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <FiTerminal size={24} className="text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Mock Prep</h3>
                                    <p className="text-xs" style={{ color: 'var(--d-sub)' }}>Practice technical screens with AI interviewers.</p>
                                </div>
                            </motion.div>

                            {/* Medium Feature 3 */}
                            <motion.div variants={fadeUp} className="md:col-span-1 border rounded-3xl p-8 flex flex-col justify-between group" style={{ background: 'var(--d-card2)', borderColor: 'var(--d-border)' }}>
                                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                    <FiTarget size={24} className="text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Smart Match</h3>
                                    <p className="text-xs" style={{ color: 'var(--d-sub)' }}>Find roles that actually fit your verified skill set.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- TESTIMONIALS --- */}
                <section className="py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { text: "The ATS scanner is a game changer. I went from zero callbacks to three interviews in one week.", author: "Rahul P.", role: "B.Tech Grad" },
                                { text: "GitHub analysis revealed my Node.js repos lacked testing. Adding Vitest changed everything.", author: "Sneha M.", role: "Backend Engineer" },
                                { text: "DevPilot didn't just find me jobs, it prepared me for them. The AI Prep is incredibly realistic.", author: "Karan S.", role: "Frontend Dev" }
                            ].map((t, i) => (
                                <div key={i} className="p-8 rounded-2xl border" style={{ background: 'var(--d-card)', borderColor: 'var(--d-border)' }}>
                                    <p className="text-sm font-medium leading-relaxed mb-6 italic" style={{ color: 'var(--d-text)' }}>"{t.text}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xs">{t.author[0]}</div>
                                        <div>
                                            <div className="text-xs font-bold">{t.author}</div>
                                            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- PRICING --- */}
                <section id="pricing" className="py-32 border-t" style={{ borderColor: 'var(--d-border)', background: 'var(--d-card2)' }}>
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="mb-20 text-center max-w-3xl mx-auto">
                            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight" style={{ color: 'var(--d-text)' }}>Simple, transparent pricing.</h2>
                            <p style={{ color: 'var(--d-sub)' }}>Start analyzing for free. Upgrade when you need deep analytics and unlimited AI mock interviews.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-stretch">
                            {/* Free Tier */}
                            <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                                <div className="border rounded-3xl p-8 h-full flex flex-col" style={{ background: 'var(--d-bg)', borderColor: 'var(--d-border)' }}>
                                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--d-text)' }}>Basic Access</h3>
                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-5xl font-display font-extrabold" style={{ color: 'var(--d-text)' }}>₹0</span>
                                        <span className="font-medium" style={{ color: 'var(--d-muted)' }}>/mo</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-1 text-left">
                                        {['AI Resume Scans', '1 GitHub Scan', 'App Tracker'].map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm" style={{ color: 'var(--d-sub)' }}>
                                                <FiCheck className="text-indigo-500" size={14} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/signup" className="mt-auto">
                                        <button className="w-full border rounded-xl py-4 font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--d-border)', color: 'var(--d-text)' }}>Create Free Account</button>
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Pro Tier */}
                            <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur opacity-30" />
                                <div className="relative border rounded-3xl p-8 h-full flex flex-col" style={{ background: 'var(--d-bg)', borderColor: 'var(--d-border)' }}>
                                    <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Pro License</h3>
                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-5xl font-display font-extrabold" style={{ color: 'var(--d-text)' }}>₹149</span>
                                        <span className="font-medium" style={{ color: 'var(--d-muted)' }}>/mo</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-1 text-left">
                                        {['Unlimited AI Scans', 'Deep Repo Scans', 'AI Mock Prep', 'Priority Matching'].map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm font-medium" style={{ color: 'var(--d-text)' }}>
                                                <FiCheck className="text-purple-500" size={14} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/signup" className="mt-auto">
                                        <button className="w-full rounded-xl py-4 font-bold transition-all shadow-lg hover:opacity-90" style={{ background: 'var(--d-btn-primary)', color: '#fff' }}>Upgrade to Pro</button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- THE CAREER INTELLIGENCE PIPELINE --- */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-6" style={{ color: 'var(--d-text)' }}>
                                The AI Career <span className="text-indigo-500">Pipeline.</span>
                            </h2>
                            <p className="text-lg max-w-2xl mx-auto opacity-60">From first-year student to senior engineer, DevPilot orchestrates your growth.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-12 relative">
                            {/* Connection Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 z-0" />
                            
                            {[
                                { step: "01", title: "Intelligent Audit", desc: "Our AI scans your GitHub and Resume for hidden strengths and architectural flaws.", icon: FiSearch },
                                { step: "02", title: "Skill-Gap Solving", desc: "Identify the exact libraries and patterns you're missing compared to top-tier job descriptions.", icon: FiTarget },
                                { step: "03", title: "Stress Simulation", desc: "Practice high-stakes technical screens with AI that knows your specific tech stack.", icon: FiTerminal },
                                { step: "04", title: "Strategic Match", desc: "Get priority matched with companies looking for your specific verified expertise.", icon: FiTrendingUp }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ y: -10 }}
                                    className="relative z-10 flex flex-col items-center text-center group"
                                >
                                    <div className="w-24 h-24 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-8 shadow-lg group-hover:shadow-indigo-500/20 transition-all">
                                        <item.icon size={32} className="text-indigo-500" />
                                    </div>
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">{item.step} // PHASE</div>
                                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--d-text)' }}>{item.title}</h3>
                                    <p className="text-sm leading-relaxed opacity-50">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- REFINED CTA SECTION --- */}
                <section className="py-32 relative">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-24 border border-white/5 shadow-2xl" style={{ background: 'var(--d-card2)' }}>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
                            <div className="relative z-10 text-center max-w-2xl mx-auto">
                                <h2 className="font-display text-4xl md:text-6xl font-black mb-8 tracking-tighter" style={{ color: 'var(--d-text)' }}>
                                    Stop applying. <br /> Start <span className="text-indigo-500">Engineering.</span>
                                </h2>
                                <p className="text-lg mb-12 opacity-60">Join 10,000+ developers who are building their future with AI career intelligence.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link href="/signup">
                                        <button className="px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95" style={{ background: 'var(--d-btn-primary)', color: '#fff' }}>
                                            Join DevPilot Free
                                        </button>
                                    </Link>
                                    <div className="flex items-center gap-2 text-xs font-bold opacity-40">
                                        <FiCheckCircle /> Verified Placements
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer className="border-t pt-20 pb-12" style={{ borderColor: 'var(--d-border)', background: 'var(--d-card)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-left">
                                <PremiumLogo size="sm" />
                                <span className="font-display text-lg font-bold">DevPilot AI</span>
                            </div>
                            <p className="text-xs font-medium max-w-xs opacity-50">The intelligent operating system for the modern developer career.</p>
                        </div>
                        <div className="flex gap-6">
                            {[
                                { label: 'Privacy', href: '/privacy' },
                                { label: 'Terms', href: '/terms' },
                                { label: 'Contact', href: '/contact' }
                            ].map(item => (
                                <Link key={item.label} href={item.href} className="text-xs font-bold opacity-30 hover:opacity-100 transition-opacity">{item.label}</Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t" style={{ borderColor: 'var(--d-border)' }}>
                        <div className="text-[10px] font-bold opacity-30">© {new Date().getFullYear()} DEVPILOT_AI // SYSTEMS_INTEGRATED</div>
                        <div className="flex gap-4 mt-4 md:mt-0 opacity-30">
                            <FiGithub size={16} />
                            <FiActivity size={16} />
                        </div>
                    </div>
                </div>
            </footer>
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

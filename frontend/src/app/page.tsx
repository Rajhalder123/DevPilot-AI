'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiZap, FiArrowRight, FiFileText, FiGithub,
    FiTarget, FiCodesandbox, FiMenu, FiX, FiCheck,
    FiTerminal, FiActivity, FiCode, FiCpu, FiSun, FiMoon,
    FiPlay, FiShield, FiUsers, FiTrendingUp, FiCheckCircle, FiBriefcase, FiMic, FiSend, FiPlus, FiMap, FiSearch, FiMessageCircle, FiGlobe
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
            className={`${span} relative overflow-hidden rounded-[2.5rem] border bg-white/[0.02] backdrop-blur-md p-8 md:p-10 group transition-all duration-500`}
            style={{ borderColor: 'var(--d-border)' }}
        >
            {/* Background Glow */}
            <div className={`absolute -inset-24 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700`} />
            
            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none" style={{ backgroundImage: `radial-gradient(var(--d-text) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

            <div className="relative z-10 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-2xl ${colorClasses[color].split(' ')[3]} border ${colorClasses[color].split(' ')[2]} flex items-center justify-center mb-8 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={28} className={colorClasses[color].split(' ')[1]} />
                </div>
                
                <h3 className="text-2xl font-black mb-4 tracking-tight" style={{ color: 'var(--d-text)' }}>{title}</h3>
                <p className="text-lg leading-relaxed opacity-60 mb-8" style={{ color: 'var(--d-sub)' }}>{desc}</p>
                
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
                            <ul className="flex flex-col gap-6 text-lg font-bold">
                                <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
                                <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
                                <li><Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
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

            <main>
                {/* --- HERO SECTION (AlgoBuilder Style) --- */}
                <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 z-10 relative">
                        <div className="text-left lg:text-center max-w-5xl mx-auto mb-20">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border transition-all" style={{ background: 'var(--d-card)', borderColor: 'var(--d-border)' }}>
                                <FiCpu className="text-indigo-500 animate-pulse" />
                                <span className="text-sm font-medium opacity-70">AI-Powered Career Platform for Developers</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8" style={{ color: 'var(--d-text)' }}>
                                Build your <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500" style={{ backgroundImage: isDark ? 'linear-gradient(to bottom, #fff 70%, #666 100%)' : 'linear-gradient(to bottom, #000 70%, #444 100%)' }}>
                                    developer career <br className="hidden md:block" />
                                    with AI
                                </span>
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg md:text-xl opacity-60 mb-12 max-w-2xl mx-auto leading-relaxed">
                                No more manual searching — just describe your career goals and watch DevPilot AI analyze resumes, scan GitHub, and prepare you for interviews.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-start lg:justify-center items-center mb-16">
                                <Link href="/signup">
                                    <button className="px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-2xl" style={{ background: 'var(--d-text)', color: 'var(--d-bg)' }}>
                                        Get Started Free <FiArrowRight size={20} />
                                    </button>
                                </Link>
                                <button onClick={() => setDemoOpen(true)} className="px-8 py-4 rounded-xl font-bold flex items-center gap-3 border hover:bg-white/5 transition-all" style={{ borderColor: 'var(--d-border)', color: 'var(--d-text)' }}>
                                    Live Dashboard Demo <FiPlay size={20} />
                                </button>
                            </div>

                            {/* Realistic Dashboard Preview (Mobile Optimized) */}
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative max-w-5xl mx-auto group mb-24"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000" />
                                <div className="relative rounded-[2rem] border overflow-hidden shadow-2xl flex flex-col md:flex-row h-[500px] md:h-[600px]" style={{ background: 'var(--d-bg)', borderColor: 'var(--d-border)' }}>
                                    
                                    {/* Mock Sidebar (Hidden on mobile) */}
                                    <div className="hidden md:flex w-56 border-r p-6 flex-col gap-8 bg-black/20" style={{ borderColor: 'var(--d-border)' }}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <PremiumLogo size="sm" />
                                            <span className="text-xs font-black tracking-tight">DEVPILOT_CORE</span>
                                        </div>
                                        <div className="space-y-2">
                                            {['Insights', 'Resume', 'GitHub', 'Interviews', 'Settings'].map((item, i) => (
                                                <div key={i} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${i === 0 ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'opacity-40 hover:opacity-100 cursor-pointer'}`}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/5">
                                            <div className="text-[8px] font-black mb-2 opacity-40 uppercase">Usage Limits</div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-indigo-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="flex-1 flex flex-col min-w-0 bg-black/10">
                                        {/* Fake Header */}
                                        <div className="h-16 border-b flex items-center justify-between px-8" style={{ borderColor: 'var(--d-border)' }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-mono opacity-40">SYSTEM_STATUS: OK</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-2 bg-white/5 rounded-full" />
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30" />
                                            </div>
                                        </div>

                                        {/* Dashboard Body */}
                                        <div className="flex-1 p-6 md:p-10 flex flex-col overflow-hidden relative">
                                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                                <div className="flex-1 p-6 rounded-3xl border bg-black/20" style={{ borderColor: 'var(--d-border)' }}>
                                                    <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-4">AI Talent Score</div>
                                                    <div className="text-4xl font-black mb-2">94.2 <span className="text-sm text-emerald-500 font-bold">+2.4%</span></div>
                                                    <div className="text-[10px] opacity-40 font-medium">Top 5% of React Developers globally.</div>
                                                </div>
                                                <div className="flex-1 p-6 rounded-3xl border bg-black/20" style={{ borderColor: 'var(--d-border)' }}>
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
                                            <div className="flex-1 flex flex-col items-center justify-center text-center relative">
                                                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                                    <div className="w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />
                                                </div>
                                                <div className="relative z-10 space-y-6 max-w-md mx-auto">
                                                    <div className="scale-75 md:scale-100 flex justify-center">
                                                        <SiriOrb />
                                                    </div>
                                                    <p className="text-sm font-bold opacity-60 leading-relaxed">
                                                        "I've identified 3 architectural patterns in your <span className="text-indigo-400">auth-service</span> that could be optimized for high-concurrency."
                                                    </p>
                                                    <div className="flex flex-wrap justify-center gap-3">
                                                        {['Apply Optimization', 'Review Patterns', 'Scan New Repo'].map((btn, i) => (
                                                            <div key={i} className="px-4 py-2 rounded-full border text-[9px] font-black bg-black/40 hover:bg-white/5 transition-colors cursor-pointer" style={{ borderColor: 'var(--d-border)' }}>
                                                                {btn}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chat Input Bar */}
                                            <div className="mt-8 p-3 rounded-2xl border bg-black/40 flex items-center gap-4" style={{ borderColor: 'var(--d-border)' }}>
                                                <FiPlus className="opacity-20" />
                                                <div className="flex-1 text-[10px] opacity-20 font-bold">Analyze my latest commit for security flaws...</div>
                                                <div className="flex gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-40"><FiMic size={14} /></div>
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center"><FiSend size={14} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
                        </div>

                        {/* Visual Mockup (AlgoBuilder Grid Layout) */}
                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {[
                                    { title: "1. AI Resume Analysis", icon: FiFileText, color: "indigo", lines: ["Analyzing syntax...", "ATS Score: 92/100", "Keywords synced."] },
                                    { title: "2. GitHub Pattern Scan", icon: FiGithub, color: "purple", lines: ["Repo audit in progress...", "Logic flaws: 0", "Patterns: clean."] },
                                    { title: "3. Mock Technical Screen", icon: FiTerminal, color: "emerald", lines: ["Voice session active", "Speed: optimal", "Accuracy: 95%"] }
                                ].map((step, i) => (
                                    <div key={i} className="flex flex-col gap-6">
                                        <div className="text-center">
                                            <div className="text-[10px] font-black opacity-40 mb-2 uppercase tracking-[0.3em]">{step.title}</div>
                                            <div className="w-px h-8 mx-auto" style={{ background: 'var(--d-border)' }} />
                                        </div>
                                        <div className="relative group rounded-3xl border overflow-hidden p-8 shadow-2xl transition-all hover:-translate-y-2 h-[280px] flex flex-col justify-between" style={{ background: 'var(--d-card)', borderColor: 'var(--d-border)' }}>
                                            <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br from-${step.color}-500 to-transparent`} />
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-${step.color}-500/20 bg-${step.color}-500/10 text-${step.color}-500 shadow-inner`}>
                                                        <step.icon size={24} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-xs uppercase tracking-widest">Scanner</span>
                                                        <span className={`text-[9px] font-bold text-${step.color}-500/60 animate-pulse`}>ACTIVE_CONNECTION</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 font-mono text-[10px] opacity-40">
                                                    {step.lines.map((line, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className={`w-1 h-1 rounded-full bg-${step.color}-500`} />
                                                            {line}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative z-10 w-full h-1 bg-white/5 rounded-full overflow-hidden">
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

                {/* --- CAPABILITIES (Alternating Sections like AlgoBuilder) --- */}
                <section id="features" className="py-24 md:py-32 border-t" style={{ borderColor: 'var(--d-border)' }}>
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section 1 */}
                        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                            <div>
                                <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Intelligent Auditing</span>
                                <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">You build the code, <br />DevPilot audits the patterns</h2>
                                <p className="text-lg opacity-60 mb-10 leading-relaxed">From memory leaks to architectural flaws, just sync your repo and our AI handles the pattern recognition. Gain institutional-grade feedback on every commit.</p>
                                
                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    {[
                                        { label: "Arch Audit", icon: FiZap },
                                        { label: "Pattern Sync", icon: FiSearch },
                                        { label: "Risk Scan", icon: FiShield },
                                        { label: "Logic Prep", icon: FiTerminal }
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 opacity-80">
                                            <f.icon className="text-indigo-500" />
                                            <span className="text-sm font-bold">{f.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/signup">
                                    <button className="px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg flex items-center gap-2" style={{ background: 'var(--d-text)', color: 'var(--d-bg)' }}>
                                        Explore Repository Scan <FiArrowRight />
                                    </button>
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative rounded-[2.5rem] border overflow-hidden shadow-2xl p-2 bg-black/40" style={{ borderColor: 'var(--d-border)' }}>
                                    <div className="w-full h-96 rounded-[2rem] bg-slate-900 flex flex-col p-6 font-mono text-[10px] relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            </div>
                                            <div className="text-indigo-400 font-bold uppercase tracking-widest">Audit Engine // v2.4</div>
                                        </div>
                                        <div className="space-y-4 opacity-80">
                                            <div className="flex gap-4">
                                                <span className="text-slate-600">01</span>
                                                <span className="text-indigo-300">Scanning repository: <span className="text-white">devpilot-core...</span></span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-slate-600">02</span>
                                                <span className="text-emerald-400">Success: <span className="text-white">Pattern verification complete.</span></span>
                                            </div>
                                            <div className="flex gap-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                                <FiShield size={16} className="text-indigo-500" />
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-white font-bold">Structural Insight:</span>
                                                    <span className="text-indigo-200">Recommended singleton pattern for AuthService to optimize memory footprint by 14%.</span>
                                                </div>
                                            </div>
                                            <motion.div 
                                                animate={{ opacity: [0.2, 0.5, 0.2] }} 
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-1 h-4 bg-indigo-500" 
                                            />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: DevPilot Voice Intelligence (Neural Link) */}
                        <div className="text-center max-w-7xl mx-auto mb-32 px-6">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative mb-24"
                            >
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[var(--d-text)] to-[var(--d-text)]/40">
                                        DevPilot Voice Intelligence
                                    </h2>
                                    <p className="text-xl opacity-60 max-w-2xl mx-auto font-medium" style={{ color: 'var(--d-text)' }}>
                                        Experience a natural, AI-driven conversation. Get real-time feedback on your tone, content, and confidence.
                                    </p>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-20 items-center">
                                    {/* Neural Link Orb Visual (Left on Desktop) */}
                                    <div className="relative flex items-center justify-center h-[350px]">
                                        {/* Orbital Dots */}
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                                                className="absolute border rounded-full"
                                                style={{ 
                                                    width: 180 + i * 60, 
                                                    height: 180 + i * 60,
                                                    borderColor: 'var(--d-border)',
                                                    opacity: 0.2
                                                }}
                                            >
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full blur-[1px]" style={{ background: 'var(--d-text)', opacity: 0.4 }} />
                                            </motion.div>
                                        ))}

                                        {/* Main Mic Orb */}
                                        <motion.div 
                                            animate={{ 
                                                scale: [1, 1.05, 1],
                                                boxShadow: [
                                                    "0 0 30px rgba(79, 70, 229, 0.2)",
                                                    "0 0 60px rgba(79, 70, 229, 0.4)",
                                                    "0 0 30px rgba(79, 70, 229, 0.2)"
                                                ]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center z-10"
                                        >
                                            <FiMic size={48} className="text-white drop-shadow-xl" />
                                        </motion.div>

                                        {/* Ambient Glow */}
                                        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
                                    </div>

                                    {/* Detailed Voice Features (Right on Desktop) */}
                                    <div className="text-left space-y-10">
                                        {[
                                            { 
                                                title: "Neural Audio Synthesis", 
                                                desc: "Our ultra-low latency audio engine delivers human-like responses in under 200ms.",
                                                icon: FiZap,
                                                color: "indigo"
                                            },
                                            { 
                                                title: "Tone & Sentiment Audit", 
                                                desc: "AI-driven analysis of your speaking rhythm, confidence levels, and emotional resonance.",
                                                icon: FiActivity,
                                                color: "purple"
                                            },
                                            { 
                                                title: "Filler-Word Elimination", 
                                                desc: "Automatically tracks and flags filler words like 'um', 'like', and 'actually' in real-time.",
                                                icon: FiTarget,
                                                color: "emerald"
                                            }
                                        ].map((feature, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.2 }}
                                                className="flex gap-6 group"
                                            >
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-${feature.color}-500/20 bg-${feature.color}-500/5 text-${feature.color}-500 shadow-inner group-hover:scale-110 transition-transform`}>
                                                    <feature.icon size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--d-text)' }}>{feature.title}</h4>
                                                    <p className="text-sm opacity-60 leading-relaxed" style={{ color: 'var(--d-text)' }}>{feature.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}

                                        <Link href="/signup">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mt-6 px-10 py-4 rounded-2xl font-black text-md transition-all shadow-xl flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white"
                                            >
                                                Initialize Neural Link <FiArrowRight />
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Section 3: ATS Benchmarking (The Audit) - Full Width */}
                        <div className="max-w-7xl mx-auto mb-32 px-6">
                            <div className="relative group rounded-[3rem] border overflow-hidden p-12 bg-black/40 shadow-2xl" style={{ borderColor: 'var(--d-border)' }}>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                                <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                                    <div className="text-left">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-8">
                                            Institutional Data Benchmarking
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]" style={{ color: 'var(--d-text)' }}>
                                            Real-time <br />ATS benchmarking
                                        </h2>
                                        <p className="text-lg opacity-60 leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--d-text)' }}>
                                            We compare your profile against 3.8TB of historical hiring data from FAANG and top-tier startups. No guesswork, just pure mathematical alignment.
                                        </p>
                                        <div className="space-y-4">
                                            {[
                                                "99.8% ATS Bypass Probability",
                                                "Direct Skill-Gap Identification",
                                                "FAANG-Level Content Optimization"
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 text-sm font-bold opacity-80" style={{ color: 'var(--d-text)' }}>
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><FiArrowRight size={12} /></div>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Detailed ATS Visual */}
                                    <div className="p-8 md:p-12 rounded-[2.5rem] border bg-black/40 shadow-2xl backdrop-blur-md" style={{ borderColor: 'var(--d-border)' }}>
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Target Profile</div>
                                                <div className="text-xl font-black" style={{ color: 'var(--d-text)' }}>SRE_ROLE // GOOGLE</div>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                                <FiActivity className="text-indigo-500" size={24} />
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            {[
                                                { label: "Cloud Architecture", score: 92, target: 88 },
                                                { label: "Distributed Systems", score: 85, target: 94 },
                                                { label: "Performance Tuning", score: 94, target: 82 }
                                            ].map((stat, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-widest">
                                                        <span style={{ color: 'var(--d-text)' }}>{stat.label}</span>
                                                        <span className={stat.score >= stat.target ? "text-emerald-500" : "text-amber-500"}>{stat.score}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-white/5 rounded-full relative overflow-hidden">
                                                        <div className="absolute top-0 bottom-0 border-r-2 border-white/40 z-10" style={{ left: `${stat.target}%` }} />
                                                        <motion.div 
                                                            initial={{ width: 0 }} 
                                                            whileInView={{ width: `${stat.score}%` }} 
                                                            transition={{ duration: 1.5 }}
                                                            className={`h-full rounded-full ${stat.score >= stat.target ? "bg-emerald-500" : "bg-amber-500"}`} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Global Job Intelligence (The Opportunity) - Full Width */}
                        <div className="max-w-7xl mx-auto mb-32 px-6">
                            <div className="grid lg:grid-cols-2 gap-20 items-center">
                                {/* Interactive Job Search Visual */}
                                <div className="order-2 lg:order-1 relative group">
                                    <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full opacity-30" />
                                    <div className="relative p-8 md:p-12 rounded-[3rem] border bg-black/40 shadow-2xl overflow-hidden" style={{ borderColor: 'var(--d-border)' }}>
                                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                            <div className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white/30 flex items-center">
                                                React Developer
                                            </div>
                                            <div className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center gap-3 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                                                <FiSearch size={20} /> Search Jobs
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { company: "Vercel", location: "Remote", match: 98, role: "Senior Frontend" },
                                                { company: "Linear", location: "London", match: 96, role: "Staff Engineer" },
                                                { company: "Replicate", location: "SF", match: 92, role: "AI Engineer" },
                                                { company: "Railway", location: "Remote", match: 89, role: "Backend Lead" }
                                            ].map((job, i) => (
                                                <div key={i} className="p-6 rounded-2xl border bg-black/40 hover:bg-white/5 transition-all cursor-pointer group/card" style={{ borderColor: 'var(--d-border)' }}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">{job.company[0]}</div>
                                                        <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-500 text-[10px] font-black">{job.match}%</span>
                                                    </div>
                                                    <div className="text-sm font-black mb-1" style={{ color: 'var(--d-text)' }}>{job.company}</div>
                                                    <div className="text-xs font-bold opacity-60 mb-2" style={{ color: 'var(--d-text)' }}>{job.role}</div>
                                                    <div className="text-[10px] opacity-40">{job.location}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="order-1 lg:order-2 text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-widest mb-8">
                                        Market Opportunity Engine
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]" style={{ color: 'var(--d-text)' }}>
                                        Global Job <br />Intelligence
                                    </h2>
                                    <p className="text-lg opacity-60 leading-relaxed mb-10" style={{ color: 'var(--d-text)' }}>
                                        From London to San Francisco, our AI maps your skills to the specific tech stacks companies are hiring for right now. We find the roles you're already qualified for.
                                    </p>
                                    <div className="p-6 rounded-3xl border bg-indigo-500/5 border-indigo-500/10 inline-block">
                                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Success Rate</div>
                                        <div className="text-4xl font-black" style={{ color: 'var(--d-text)' }}>84% faster <span className="text-sm opacity-40 font-bold">interview invites</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FINAL CTA (AlgoBuilder Style) --- */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                        <div className="max-w-5xl mx-auto rounded-[3rem] border p-16 md:p-24 relative overflow-hidden shadow-2xl" style={{ background: 'var(--d-card)', borderColor: 'var(--d-border)' }}>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--d-text)_1px,_transparent_1px)]" style={{ backgroundSize: '40px 40px' }} />
                            <div className="absolute -inset-20 bg-indigo-500/10 blur-[120px] rounded-full" />
                            
                            <h2 className="text-5xl md:text-7xl font-bold mb-8 relative z-10 tracking-tight leading-tight">
                                Harness the world's most <br />
                                <span className="text-indigo-500">advanced AI</span>. Land your <br />
                                dream role now.
                            </h2>
                            <p className="text-lg opacity-70 mb-12 max-w-xl mx-auto relative z-10">You don't need a perfect plan — just an idea worth testing. DevPilot AI helps you shape it, stress-test it, and get sharper with every step.</p>
                            
                            <Link href="/signup">
                                <button className="px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 relative z-10" style={{ background: 'var(--d-text)', color: 'var(--d-bg)' }}>
                                    Join DevPilot AI Free
                                </button>
                            </Link>
                        </div>
                        <p className="text-3xl font-bold mt-12 opacity-30 tracking-tight">Start with your future.</p>
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

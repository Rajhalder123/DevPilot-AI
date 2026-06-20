'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    FiZap, FiArrowRight, FiMenu, FiX, FiCheck,
    FiCode, FiCpu, FiMessageCircle, FiPackage,
    FiSend, FiCopy, FiTerminal
} from 'react-icons/fi';
import { SiReact, SiNodedotjs, SiMongodb, SiOpenai, SiFirebase, SiTypescript, SiNextdotjs, SiTailwindcss } from 'react-icons/si';

// ── AI Chat Window Demo ─────────────────────────────────────────────────────
const AIChatDemo = () => {
    const [step, setStep] = useState(0);
    const [typing, setTyping] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [copied, setCopied] = useState(false);

    const messages = [
        { role: 'user', content: 'Fix this React error: Cannot read properties of undefined' },
        { role: 'ai', content: "I found the issue. Your `useEffect` dependency array is missing `userId`. Here's the fix:" },
        { role: 'code', content: `useEffect(() => {
  fetchUser(userId);
}, [userId]); // ← add dependency` },
    ];

    const aiText = messages[1].content;

    useEffect(() => {
        const t1 = setTimeout(() => {
            setStep(1); // Show user message
        }, 800);
        const t2 = setTimeout(() => {
            setStep(2); setTyping(true); // Show typing
        }, 1600);
        const t3 = setTimeout(() => {
            setTyping(false);
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(aiText.slice(0, i + 1));
                i++;
                if (i >= aiText.length) { clearInterval(interval); setStep(3); }
            }, 18);
        }, 2800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            background: '#0A0A0A',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
            maxWidth: 480,
            width: '100%',
        }}>
            {/* Window Chrome */}
            <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
                <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#555', fontWeight: 500 }}>DevPilot AI</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} className="animate-pulse" />
            </div>

            {/* Chat Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 280 }}>

                {/* AI greeting */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiZap size={13} color="#fff" />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', fontSize: 13, color: '#A1A1AA', lineHeight: 1.6 }}>
                        Ask me anything about your code.
                    </div>
                </motion.div>

                {/* User message */}
                <AnimatePresence>
                    {step >= 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', borderRadius: '16px 4px 16px 16px', padding: '10px 14px', fontSize: 13, color: '#fff', maxWidth: '80%', lineHeight: 1.6 }}>
                                {messages[0].content}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {typing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FiZap size={13} color="#fff" />
                            </div>
                            <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px' }}>
                                {[0, 0.2, 0.4].map((d, i) => (
                                    <div key={i} className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', animationDelay: `${d}s` }} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI response */}
                <AnimatePresence>
                    {step >= 2 && !typing && displayedText && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FiZap size={13} color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', fontSize: 13, color: '#E4E4E7', lineHeight: 1.6, marginBottom: 10 }}>
                                    {displayedText}
                                    {displayedText.length < aiText.length && <span className="animate-blink" style={{ color: '#7C3AED' }}>|</span>}
                                </div>

                                {/* Code block */}
                                {step >= 3 && (
                                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                        style={{ background: '#050505', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, overflow: 'hidden' }}>
                                        <div style={{ padding: '8px 14px', background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <FiTerminal size={11} color="#7C3AED" />
                                                <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>JavaScript</span>
                                            </div>
                                            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: copied ? '#10B981' : '#71717A', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                                                <FiCopy size={11} /> {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                        <pre style={{ padding: '12px 14px', fontSize: 12, color: '#A78BFA', margin: 0, lineHeight: 1.8, overflow: 'auto' }}>
                                            <code>{messages[2].content}</code>
                                        </pre>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input bar */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#555' }}>
                    Ask DevPilot anything...
                </div>
                <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiSend size={14} color="#fff" />
                </div>
            </div>
        </div>
    );
};

// ── Floating Particles ──────────────────────────────────────────────────────
// Fixed: generate random values only on client to avoid SSR hydration mismatch
const Particles = () => {
    const [mounted, setMounted] = useState(false);
    const particles = useRef(
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: 5 + (i * 4.76) % 90,
            y: 5 + (i * 7.31) % 90,
            size: 1.5 + (i % 3) * 0.8,
            duration: 6 + (i % 5) * 1.5,
            delay: (i % 5) * 0.8,
            purple: i % 2 === 0,
        }))
    );

    useEffect(() => {
        // Randomise positions only on client after mount
        particles.current = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 4,
            purple: Math.random() > 0.5,
        }));
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {particles.current.map(p => (
                <motion.div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: p.purple ? 'rgba(124,58,237,0.6)' : 'rgba(6,182,212,0.6)',
                    }}
                    animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
};

// ── Feature Card ────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, gradient, delay = 0 }: any) => {
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            style={{
                background: '#111111',
                border: `1px solid ${hovered ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 20,
                padding: '32px',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
            }}
        >
            <div style={{ position: 'absolute', top: -60, right: -60, width: 150, height: 150, borderRadius: '50%', background: gradient, filter: 'blur(60px)', opacity: 0.15, pointerEvents: 'none' }} />
            <div style={{ width: 48, height: 48, borderRadius: 14, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: `0 8px 20px rgba(0,0,0,0.4)` }}>
                <Icon size={22} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.3px' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#A1A1AA', lineHeight: 1.65 }}>{desc}</p>
        </motion.div>
    );
};

// ── Step Card ───────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}
    >
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: '#fff', boxShadow: '0 8px 30px rgba(124,58,237,0.35)' }}>
            {num}
        </div>
        <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>{title}</h3>
            <p style={{ fontSize: '0.88rem', color: '#71717A', lineHeight: 1.6 }}>{desc}</p>
        </div>
    </motion.div>
);

// ── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 400], [0, -60]);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Solutions', href: '#how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'About', href: '#tech' },
    ];

    const features = [
        { icon: FiCode, title: 'AI Coding Assistant', desc: 'Generate, explain and improve code instantly with context-aware AI assistance.', gradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)', delay: 0 },
        { icon: FiCpu, title: 'Debug Assistant', desc: 'Find and fix bugs instantly. AI analyzes your stack trace and suggests precise solutions.', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', delay: 0.1 },
        { icon: FiMessageCircle, title: 'Smart Chat', desc: 'Talk with your AI developer. Ask questions, get explanations, and learn on the fly.', gradient: 'linear-gradient(135deg, #7C3AED, #06B6D4)', delay: 0.2 },
        { icon: FiPackage, title: 'Project Assistant', desc: 'Plan architecture, generate boilerplate, and ship apps faster with AI-powered scaffolding.', gradient: 'linear-gradient(135deg, #EC4899, #7C3AED)', delay: 0.3 },
    ];

    const techStack = [
        { icon: SiNextdotjs, label: 'Next.js', color: '#FFFFFF' },
        { icon: SiReact, label: 'React', color: '#61DAFB' },
        { icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
        { icon: SiNodedotjs, label: 'Node.js', color: '#8CC84B' },
        { icon: SiMongodb, label: 'MongoDB', color: '#47A248' },
        { icon: SiTailwindcss, label: 'Tailwind', color: '#06B6D4' },
        { icon: SiOpenai, label: 'OpenAI', color: '#FFFFFF' },
        { icon: SiFirebase, label: 'Firebase', color: '#FFCA28' },
    ];

    return (
        <div style={{ background: '#050505', color: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'var(--font-inter)' }}>

            {/* ── NAVBAR ── */}
            <motion.header
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                    padding: scrolled ? '14px 0' : '22px 0',
                    background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
                    transition: 'all 0.3s ease',
                }}
            >
                <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <motion.div
                            animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 20px rgba(124,58,237,0.5)', '0 0 0px rgba(124,58,237,0)'] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FiZap size={18} color="#fff" />
                        </motion.div>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)' }}>
                            DevPilot <span style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <ul style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0 }} className="md-hidden" id="desktop-nav">
                        {navLinks.map(link => (
                            <li key={link.label}>
                                <a href={link.href} style={{ padding: '8px 16px', borderRadius: 8, fontSize: '0.9rem', color: '#A1A1AA', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', display: 'block' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="md-hidden" id="desktop-cta">
                        <Link href="/login" style={{ padding: '8px 18px', fontSize: '0.9rem', color: '#A1A1AA', textDecoration: 'none', fontWeight: 500, borderRadius: 8, transition: 'color 0.2s' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#A1A1AA')}>
                            Login
                        </Link>
                        <Link href="/signup" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ padding: '9px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                Get Started <FiArrowRight size={14} />
                            </motion.button>
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button onClick={() => setMobileOpen(o => !o)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} id="mobile-toggle">
                        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', background: 'rgba(5,5,5,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {navLinks.map(link => (
                                    <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                                        style={{ padding: '12px 16px', color: '#A1A1AA', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, borderRadius: 10 }}>
                                        {link.label}
                                    </a>
                                ))}
                                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <Link href="/login" style={{ textDecoration: 'none' }}>
                                        <button style={{ width: '100%', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>Login</button>
                                    </Link>
                                    <Link href="/signup" style={{ textDecoration: 'none' }}>
                                        <button style={{ width: '100%', padding: '12px', border: 'none', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>Get Started</button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* ── HERO SECTION ── */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 90 }}>
                {/* Background glows */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Particles />

                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center', width: '100%' }}>
                    {/* Left */}
                    <motion.div style={{ y: heroY }}>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, color: '#A78BFA', marginBottom: 28, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                        >
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} className="animate-pulse" />
                            AI Developer Copilot
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24, fontFamily: 'var(--font-outfit)' }}
                        >
                            Build Faster.<br />
                            <span style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Code Smarter.
                            </span><br />
                            With AI.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            style={{ fontSize: '1.1rem', color: '#A1A1AA', lineHeight: 1.75, marginBottom: 40, maxWidth: 460 }}
                        >
                            DevPilot AI helps developers write code, debug problems, understand technology, and ship projects faster.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}
                        >
                            <Link href="/signup" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                                >
                                    Start Building Free <FiArrowRight size={16} />
                                </motion.button>
                            </Link>
                            <a href="#features" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ padding: '14px 28px', background: 'transparent', color: '#A1A1AA', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
                                >
                                    See Features
                                </motion.button>
                            </a>
                        </motion.div>

                        {/* Social proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 16 }}
                        >
                            <div style={{ display: 'flex' }}>
                                {['#7C3AED', '#06B6D4', '#EC4899', '#10B981'].map((c, i) => (
                                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid #050505', marginLeft: i ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                                        {['R', 'A', 'S', 'P'][i]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>500+ developers</div>
                                <div style={{ display: 'flex', gap: 2 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: '#F59E0B', fontSize: 13 }}>★</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: AI Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <AIChatDemo />
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURES SECTION ── */}
            <section id="features" style={{ padding: '120px 24px', position: 'relative' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: 64 }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, color: '#A78BFA', marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Features
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, fontFamily: 'var(--font-outfit)', marginBottom: 16 }}>
                            Everything you need to build
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#71717A', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                            One AI assistant that covers your entire development workflow — from idea to production.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                        {features.map((f) => (
                            <FeatureCard key={f.title} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how-it-works" style={{ padding: '120px 24px', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: 72 }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, color: '#67E8F9', marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            How It Works
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-outfit)', marginBottom: 16 }}>
                            Three steps to faster code
                        </h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, alignItems: 'start' }}>
                        <StepCard num="1" title="Ask your problem" desc="Type your question, paste your code, or describe what you want to build." delay={0} />
                        <StepCard num="2" title="AI analyzes" desc="DevPilot AI processes context, understands your stack, and reasons through solutions." delay={0.15} />
                        <StepCard num="3" title="Get solution" desc="Receive precise code, explanations, and next steps — ready to copy and ship." delay={0.3} />
                    </div>
                </div>
            </section>

            {/* ── TECH STACK ── */}
            <section id="tech" style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p style={{ fontSize: '0.8rem', color: '#3F3F46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>
                            Built with modern developer stack
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                            {techStack.map(({ icon: Icon, label, color }) => (
                                <motion.div
                                    key={label}
                                    whileHover={{ scale: 1.05, borderColor: 'rgba(124,58,237,0.4)' }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, cursor: 'default', transition: 'border-color 0.2s' }}
                                >
                                    <Icon size={18} color={color} />
                                    <span style={{ fontSize: '0.88rem', color: '#A1A1AA', fontWeight: 600 }}>{label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))',
                            border: '1px solid rgba(124,58,237,0.2)',
                            borderRadius: 28,
                            padding: 'clamp(48px, 6vw, 80px)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
                        <motion.div
                            animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 60px rgba(124,58,237,0.2)', '0 0 0px rgba(124,58,237,0)'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}
                        >
                            <FiZap size={28} color="#fff" />
                        </motion.div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, fontFamily: 'var(--font-outfit)' }}>
                            Ready to build smarter?
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#71717A', marginBottom: 40, lineHeight: 1.7 }}>
                            Start using DevPilot AI today. Free forever for solo developers.
                        </p>
                        <Link href="/signup" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(124,58,237,0.5)' }}
                                whileTap={{ scale: 0.97 }}
                                style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}
                            >
                                Create Free Account <FiArrowRight size={18} />
                            </motion.button>
                        </Link>
                        <p style={{ marginTop: 20, fontSize: '0.8rem', color: '#3F3F46' }}>
                            No credit card required · Free tier forever
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiZap size={14} color="#fff" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-outfit)' }}>DevPilot AI</span>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy', 'Terms', 'Contact'].map(link => (
                            <a key={link} href={`/${link.toLowerCase()}`} style={{ fontSize: '0.85rem', color: '#3F3F46', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#A1A1AA')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#3F3F46')}>
                                {link}
                            </a>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#3F3F46' }}>© 2025 DevPilot AI. All rights reserved.</p>
                </div>
            </footer>

            {/* Mobile nav fix */}
            <style>{`
                @media (max-width: 768px) {
                    #desktop-nav, #desktop-cta { display: none !important; }
                    #mobile-toggle { display: flex !important; }
                }
            `}</style>
        </div>
    );
}

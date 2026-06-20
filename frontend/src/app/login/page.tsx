'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { FiMail, FiLock, FiZap, FiArrowRight, FiEye, FiEyeOff, FiCode, FiCpu, FiTerminal } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

// ── Animated AI Illustration for Left Panel ─────────────────────────────────
const AIIllustration = () => {
    const [line, setLine] = useState(0);
    const codeLines = [
        { text: 'const pilot = new DevPilot();', color: '#A78BFA' },
        { text: 'await pilot.analyze(codebase);', color: '#67E8F9' },
        { text: '// Bug found: null reference', color: '#4ADE80' },
        { text: 'pilot.fix({ auto: true });', color: '#F9A8D4' },
        { text: '✓ 3 issues resolved', color: '#10B981' },
    ];

    useEffect(() => {
        const id = setInterval(() => setLine(l => (l + 1) % codeLines.length), 1800);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{ width: '100%', maxWidth: 380 }}>
            {/* Terminal window */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: '#0A0A0A', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
            >
                <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
                    <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiTerminal size={12} color="#7C3AED" />
                        <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700 }}>devpilot ~ ai</span>
                    </div>
                </div>
                <div style={{ padding: '20px', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13, lineHeight: 2.2 }}>
                    {codeLines.map((l, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: i <= line ? 1 : 0.15, x: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ color: i <= line ? l.color : '#2D2D2D', display: 'flex', alignItems: 'center', gap: 10 }}
                        >
                            {i === line && (
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    style={{ color: '#7C3AED' }}
                                >▊</motion.span>
                            )}
                            {i !== line && <span style={{ color: '#2D2D2D', opacity: 0.3 }}>›</span>}
                            <span>{l.text}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Status pills */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }}>
                {[
                    { icon: FiCode, label: 'Code Gen', active: true },
                    { icon: FiCpu, label: 'Debug AI', active: line >= 2 },
                    { icon: FiZap, label: 'Auto-Fix', active: line >= 3 },
                ].map(({ icon: Icon, label, active }) => (
                    <motion.div
                        key={label}
                        animate={{ borderColor: active ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)' }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: active ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 20, transition: 'all 0.4s ease' }}
                    >
                        <Icon size={12} color={active ? '#A78BFA' : '#3F3F46'} />
                        <span style={{ fontSize: 11, color: active ? '#A78BFA' : '#3F3F46', fontWeight: 600 }}>{label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [rateLimitCooldown, setRateLimitCooldown] = useState(0); // seconds remaining
    const widgetRef = useRef<HTMLDivElement>(null);
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { login } = useAuth();
    const router = useRouter();

    // Countdown timer for rate limit cooldown
    useEffect(() => {
        if (rateLimitCooldown <= 0) return;
        cooldownRef.current = setInterval(() => {
            setRateLimitCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current!);
                    setError('Cooldown over. You can try again now.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(cooldownRef.current!);
    }, [rateLimitCooldown > 0]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((window as any).turnstile && widgetRef.current && !widgetRef.current.hasChildNodes()) {
                try {
                    (window as any).turnstile.render(widgetRef.current, {
                        sitekey: (['localhost', '127.0.0.1'].includes(window.location.hostname))
                            ? '1x00000000000000000000AA'
                            : (process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '0x4AAAAAADMb1zCLT3bNq0zz'),
                        callback: (token: string) => setTurnstileToken(token),
                        theme: 'dark',
                    });
                } catch (e) { console.error('Turnstile error:', e); }
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rateLimitCooldown > 0) return; // blocked during cooldown
        if (!turnstileToken) { setError('Please complete the security challenge.'); return; }
        setError(''); setLoading(true);
        try {
            await login(email, password, turnstileToken);
            router.push('/dashboard');
        } catch (err: any) {
            // 429 Rate Limit — show countdown
            if (err.isRateLimit && err.retryAfterSec) {
                const secs = Math.min(err.retryAfterSec, 300); // cap display at 5 min
                setRateLimitCooldown(secs);
                setError(``);
            } else {
                const errorData = err.response?.data?.error;
                setError(typeof errorData === 'string' ? errorData : errorData?.message || err.message || 'Login failed. Please try again.');
            }
            if ((window as any).turnstile) (window as any).turnstile.reset();
            setTurnstileToken(null);
        } finally { setLoading(false); }
    };

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://devpilot-backend-d4dv.onrender.com/api';

    return (
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', fontFamily: 'var(--font-inter)' }}>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />

            {/* ── LEFT PANEL ── */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, #0A0A0A 0%, #0D0A1A 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 60px', position: 'relative', overflow: 'hidden' }}
                className="md-hidden"
            >
                {/* Background glow */}
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiZap size={18} color="#fff" />
                    </div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)' }}>
                        DevPilot <span style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
                    </span>
                </Link>

                {/* Center content */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                    <AIIllustration />
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 10, fontFamily: 'var(--font-outfit)' }}>
                            Your AI Copilot
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#71717A', lineHeight: 1.7 }}>
                            Build faster, debug smarter, and ship better software with the power of AI.
                        </p>
                    </div>
                </div>

                {/* Bottom quote */}
                <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px 20px' }}>
                    <p style={{ fontSize: '0.88rem', color: '#A1A1AA', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10 }}>
                        "DevPilot AI cut my debug time in half. It's like pair programming with a senior engineer 24/7."
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>R</div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Raj H.</div>
                            <div style={{ fontSize: '0.72rem', color: '#71717A' }}>Full Stack Developer</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL (Form) ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
                >
                    {/* Mobile logo */}
                    <div style={{ display: 'none', marginBottom: 32 }} id="mobile-logo-login">
                        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiZap size={16} color="#fff" />
                            </div>
                            <span style={{ fontWeight: 800, color: '#fff', fontFamily: 'var(--font-outfit)' }}>DevPilot AI</span>
                        </Link>
                    </div>

                    <div style={{ marginBottom: 36 }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8, fontFamily: 'var(--font-outfit)' }}>
                            Welcome Back
                        </h1>
                        <p style={{ color: '#71717A', fontSize: '0.95rem' }}>Sign in to your DevPilot workspace</p>
                    </div>

                    {/* GitHub / Google OAuth */}
                    <div style={{ marginBottom: 28 }}>
                        <a href={`${API_URL}/auth/github`} style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.05)' }}
                                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', marginBottom: 10 }}
                            >
                                <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                                Continue with GitHub
                            </motion.button>
                        </a>
                    </div>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                        <span style={{ fontSize: '0.72rem', color: '#3F3F46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>or email</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <AnimatePresence>
                            {rateLimitCooldown > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '14px 16px', fontSize: '0.88rem', color: '#FCD34D', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}
                                >
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        style={{ width: 16, height: 16, border: '2px solid rgba(252,211,77,0.3)', borderTopColor: '#FCD34D', borderRadius: '50%', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: 2 }}>Too many attempts — rate limited</div>
                                        <div style={{ fontSize: '0.8rem', color: '#F59E0B' }}>
                                            Try again in{' '}
                                            <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.95rem' }}>
                                                {Math.floor(rateLimitCooldown / 60)}:{String(rateLimitCooldown % 60).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {error && rateLimitCooldown === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ background: error.includes('try again') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${error.includes('try again') ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10, padding: '12px 16px', fontSize: '0.88rem', color: error.includes('try again') ? '#6EE7B7' : '#FCA5A5', fontWeight: 500 }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600, display: 'block', marginBottom: 8 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                <input
                                    type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required
                                    style={{ width: '100%', padding: '13px 14px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.05)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600 }}>Password</label>
                                <Link href="/forgot-password" style={{ fontSize: '0.78rem', color: '#7C3AED', textDecoration: 'none', fontWeight: 600 }}>Forgot?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                <input
                                    type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                                    style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.05)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: 0, display: 'flex', zIndex: 10 }}>
                                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Turnstile */}
                        <div ref={widgetRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 65 }} />

                        {/* Submit */}
                        <motion.button
                            type="submit" disabled={loading || rateLimitCooldown > 0}
                            whileHover={(!loading && rateLimitCooldown === 0) ? { scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' } : {}}
                            whileTap={(!loading && rateLimitCooldown === 0) ? { scale: 0.98 } : {}}
                            style={{ marginTop: 4, padding: '14px', background: rateLimitCooldown > 0 ? 'rgba(245,158,11,0.15)' : 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: rateLimitCooldown > 0 ? '#F59E0B' : '#fff', border: rateLimitCooldown > 0 ? '1px solid rgba(245,158,11,0.3)' : 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: (loading || rateLimitCooldown > 0) ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}
                        >
                            {loading ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%' }} />
                                    Authenticating...
                                </>
                            ) : rateLimitCooldown > 0 ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        style={{ width: 14, height: 14, border: '2px solid rgba(245,158,11,0.3)', borderTopColor: '#F59E0B', borderRadius: '50%' }} />
                                    Wait {Math.floor(rateLimitCooldown / 60)}:{String(rateLimitCooldown % 60).padStart(2, '0')}
                                </>
                            ) : (
                                <><FiZap size={16} /> Login</>
                            )}
                        </motion.button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.9rem', color: '#71717A' }}>
                        Don't have an account?{' '}
                        <Link href="/signup" style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: 700 }}>
                            Create account <FiArrowRight size={12} style={{ verticalAlign: 'middle' }} />
                        </Link>
                    </p>
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    #mobile-logo-login { display: block !important; }
                }
            `}</style>
        </div>
    );
}

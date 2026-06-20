'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { FiUser, FiMail, FiLock, FiZap, FiArrowRight, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const widgetRef = useRef<HTMLDivElement>(null);
    const { signup } = useAuth();
    const router = useRouter();

    const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthColors = ['', '#EF4444', '#F59E0B', '#10B981'];
    const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

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
        if (!turnstileToken) { setError('Please complete the security challenge.'); return; }
        setError('');
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            await signup(name, email, password, turnstileToken);
            router.push('/dashboard');
        } catch (err: any) {
            const errorData = err.response?.data?.error;
            setError(typeof errorData === 'string' ? errorData : errorData?.message || 'Registration failed. Please try again.');
            if ((window as any).turnstile) (window as any).turnstile.reset();
            setTurnstileToken(null);
        } finally { setLoading(false); }
    };

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://devpilot-backend-d4dv.onrender.com/api';

    const perks = ['Free forever for solo developers', 'AI coding & debug assistant', 'Smart chat + code generation', 'No credit card required'];

    return (
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', fontFamily: 'var(--font-inter)' }}>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />

            {/* ── LEFT PANEL ── */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                style={{ flex: '0 0 50%', background: '#0A0A0A', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 60px', position: 'relative', overflow: 'hidden' }}
                className="md-hidden"
            >
                {/* Background effects */}
                <div style={{ position: 'absolute', top: '-15%', right: '-15%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-15%', left: '-15%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

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
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7C3AED' }} className="animate-pulse" />
                        Join 500+ developers
                    </div>

                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, fontFamily: 'var(--font-outfit)' }}>
                        Your AI workspace<br />
                        <span style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>starts here.</span>
                    </h2>

                    <p style={{ fontSize: '0.95rem', color: '#71717A', lineHeight: 1.7, marginBottom: 40, maxWidth: 340 }}>
                        Set up in under 2 minutes. No configuration required. Start asking your AI copilot immediately.
                    </p>

                    {/* Perks list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {perks.map((perk, i) => (
                            <motion.div
                                key={perk}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                            >
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FiCheck size={12} color="#10B981" />
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#A1A1AA', fontWeight: 500 }}>{perk}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom stats */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 24 }}>
                    {[{ val: '500+', label: 'Developers' }, { val: '10K+', label: 'AI Queries' }, { val: '99%', label: 'Satisfaction' }].map(s => (
                        <div key={s.label}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)' }}>{s.val}</div>
                            <div style={{ fontSize: '0.78rem', color: '#3F3F46', fontWeight: 600 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── RIGHT PANEL (Form) ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
                >
                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8, fontFamily: 'var(--font-outfit)' }}>
                            Create your workspace
                        </h1>
                        <p style={{ color: '#71717A', fontSize: '0.95rem' }}>Set up your AI developer account in seconds.</p>
                    </div>

                    {/* GitHub OAuth */}
                    <a href={`${API_URL}/auth/github`} style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
                        <motion.button
                            whileHover={{ borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.05)' }}
                            style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
                        >
                            <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            Continue with GitHub
                        </motion.button>
                    </a>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                        <span style={{ fontSize: '0.72rem', color: '#3F3F46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>or register</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '11px 14px', fontSize: '0.88rem', color: '#FCA5A5' }}>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Name */}
                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600, display: 'block', marginBottom: 8 }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                <input
                                    type="text" placeholder="Raj Halder" value={name} onChange={e => setName(e.target.value)} required
                                    style={{ width: '100%', padding: '13px 14px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.04)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600, display: 'block', marginBottom: 8 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                <input
                                    type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required
                                    style={{ width: '100%', padding: '13px 14px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.04)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600, display: 'block', marginBottom: 8 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                <input
                                    type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required
                                    style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.04)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            {/* Password strength meter */}
                            {password.length > 0 && (
                                <div style={{ marginTop: 8, display: 'flex', gap: 4, alignItems: 'center' }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= passwordStrength ? strengthColors[passwordStrength] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                                    ))}
                                    <span style={{ fontSize: '0.72rem', color: strengthColors[passwordStrength], fontWeight: 700, marginLeft: 4 }}>{strengthLabels[passwordStrength]}</span>
                                </div>
                            )}
                        </div>

                        {/* Turnstile */}
                        <div ref={widgetRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 65 }} />

                        {/* Submit */}
                        <motion.button
                            type="submit" disabled={loading}
                            whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            style={{ marginTop: 4, padding: '14px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                            {loading ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%' }} />
                                    Creating Account...
                                </>
                            ) : (
                                <>Create Account <FiArrowRight size={16} /></>
                            )}
                        </motion.button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: '#71717A' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: 700 }}>Log in</Link>
                    </p>

                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.75rem', color: '#3F3F46', lineHeight: 1.6 }}>
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" style={{ color: '#71717A', textDecoration: 'underline' }}>Terms</Link> and{' '}
                        <Link href="/privacy" style={{ color: '#71717A', textDecoration: 'underline' }}>Privacy Policy</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

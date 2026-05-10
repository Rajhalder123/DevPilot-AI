'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { FiUser, FiMail, FiLock, FiZap, FiGithub } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const widgetRef = useRef<HTMLDivElement>(null);
    const { signup } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const renderTurnstile = () => {
            if ((window as any).turnstile && widgetRef.current && !widgetRef.current.hasChildNodes()) {
                try {
                    (window as any).turnstile.render(widgetRef.current, {
                        sitekey: (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) 
                            ? '1x00000000000000000000AA' 
                            : (process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '0x4AAAAAADMb1zCLT3bNq0zz'),
                        callback: (token: string) => setTurnstileToken(token),
                        theme: 'light',
                    });
                } catch (e) {
                    console.error('Turnstile render error:', e);
                }
            }
        };

        const timer = setTimeout(() => {
            renderTurnstile();
        }, 1500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!turnstileToken) {
            setError('Please complete the security challenge.');
            return;
        }
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await signup(name, email, password, turnstileToken);
            router.push('/dashboard');
        } catch (err: any) {
            const errorData = err.response?.data?.error;
            setError(typeof errorData === 'string' ? errorData : errorData?.message || 'Registration failed');
            if ((window as any).turnstile) (window as any).turnstile.reset();
            setTurnstileToken(null);
        } finally {
            setLoading(false);
        }
    };

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://devpilot-backend-d4dv.onrender.com/api';

    return (
        <div style={{
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 24, 
            background: '#fff', 
            color: '#1e293b', 
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />
            {/* Background Glows (Matching Landing Page) */}
            <div style={{ position: 'absolute', bottom: '10%', right: '50%', transform: 'translateX(50%)', width: 600, height: 600, background: 'rgba(124, 58, 237, 0.08)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%', 
                    maxWidth: 440, 
                    background: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(16px)',
                    padding: '48px', 
                    borderRadius: '32px', 
                    border: '1px solid rgba(79, 70, 229, 0.1)', 
                    boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.1)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
                            <FiZap size={22} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                            DevPilot <span className="gradient-text">AI</span>
                        </span>
                    </Link>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Join the next generation of career intelligence.</p>
                </div>

                <div>
                    {/* GitHub Signup Button */}
                    <a href={`${API_URL}/auth/github`} style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20,
                            background: '#fff', color: '#1e293b', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                        >
                            <FiGithub size={20} /> Sign up with GitHub
                        </button>
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.05)' }} />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>or register manually</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.05)' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {error && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: 12, padding: '12px', fontSize: '0.9rem', color: '#EF4444', fontWeight: 500 }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 700 }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '12px 12px 12px 48px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 14, color: '#1e293b', outline: 'none', fontSize: 15, transition: 'all 0.2s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)' }}
                                    onBlur={(e) => { e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 700 }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '12px 12px 12px 48px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 14, color: '#1e293b', outline: 'none', fontSize: 15, transition: 'all 0.2s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)' }}
                                    onBlur={(e) => { e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 700 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="password" 
                                    placeholder="Min. 6 characters" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '12px 12px 12px 48px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 14, color: '#1e293b', outline: 'none', fontSize: 15, transition: 'all 0.2s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)' }}
                                    onBlur={(e) => { e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                        </div>

                        {/* Cloudflare Turnstile Widget */}
                        <div 
                            ref={widgetRef}
                            style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', minHeight: '65px' }}
                        ></div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                marginTop: 8, 
                                padding: '16px', 
                                background: 'linear-gradient(to right, #7c3aed, #3b82f6)', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: 100, 
                                fontSize: 16, 
                                fontWeight: 700, 
                                cursor: 'pointer', 
                                opacity: loading ? 0.7 : 1,
                                boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10
                            }}
                        >
                            {loading ? 'Creating Account...' : <><FiZap /> Get Started Free</>}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.95rem', color: '#64748b' }}>
                    Already have an account? <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 700 }}>Log in here</Link>
                </p>
            </motion.div>
        </div>
    );
}

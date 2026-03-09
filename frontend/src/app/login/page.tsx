'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiZap, FiGithub } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            position: 'relative',
        }}>
            {/* Background */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(108,92,231,0.06)', filter: 'blur(100px)' }} />
                <div style={{ position: 'absolute', bottom: '30%', right: '20%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(0,210,255,0.06)', filter: 'blur(100px)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiZap size={22} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)' }}>
                            DevPilot <span style={{ color: 'var(--accent)' }}>AI</span>
                        </span>
                    </Link>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Welcome back</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Sign in to your account to continue</p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    {/* GitHub OAuth */}
                    <a href={`${API_URL}/auth/github`} style={{ textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{
                            width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24,
                        }}>
                            <FiGithub size={20} /> Continue with GitHub
                        </button>
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>OR</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {error && (
                            <div style={{
                                background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
                                borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: 'var(--danger)',
                            }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ paddingLeft: 40 }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input
                                    className="input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingLeft: 40 }}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--muted)' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
}

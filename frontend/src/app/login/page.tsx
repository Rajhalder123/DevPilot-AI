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
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, background: '#0F172A', color: '#F8FAFC', fontFamily: "'Inter', sans-serif"
        }}>
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%', maxWidth: 400, background: '#1E293B', padding: '40px', borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiZap size={18} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
                            DevPilot <span style={{ color: '#38BDF8' }}>AI</span>
                        </span>
                    </Link>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: '#F8FAFC' }}>Initiate Session</h1>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Authenticate to access the terminal.</p>
                </div>

                <div>
                    {/* GitHub OAuth */}
                    <a href={`${API_URL}/auth/github`} style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24,
                            background: '#0F172A', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer'
                        }}>
                            <FiGithub size={18} /> Authenticate via GitHub
                        </button>
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>OR EMAIL</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {error && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 4, padding: '12px', fontSize: '0.85rem', color: '#EF4444' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: 8, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Identifier</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                                <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required 
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: '#F8FAFC', outline: 'none', fontSize: 14 }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: 8, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Access Key</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required 
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: '#F8FAFC', outline: 'none', fontSize: 14 }}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ marginTop: 8, padding: '12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Authenticating...' : 'Execute Login'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.85rem', color: '#94A3B8' }}>
                    Unregistered user? <Link href="/signup" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
                </p>
            </motion.div>
        </div>
    );
}

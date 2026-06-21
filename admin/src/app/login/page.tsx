'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) router.push('/dashboard');
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.error;
            setError(typeof msg === 'string' ? msg : msg?.message || err.message || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-inter)' }}>
            <div style={{ position: 'absolute', top: '15%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #7C3AED, #DC2626)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
                        <FiShield size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8, fontFamily: 'var(--font-outfit)' }}>
                        Admin Panel
                    </h1>
                    <p style={{ color: '#52525B', fontSize: '0.92rem' }}>DevPilot AI — Restricted Access</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: '0.88rem', color: '#FCA5A5', fontWeight: 500 }}>
                            {error}
                        </motion.div>
                    )}

                    <div>
                        <label style={{ fontSize: '0.82rem', color: '#71717A', fontWeight: 600, display: 'block', marginBottom: 8 }}>Admin Email</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                            <input type="email" placeholder="admin@devpilot.ai" value={email} onChange={e => setEmail(e.target.value)} required
                                style={{ width: '100%', padding: '13px 14px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(220,38,38,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.82rem', color: '#71717A', fontWeight: 600, display: 'block', marginBottom: 8 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                            <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                                style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(220,38,38,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                            <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: 0, display: 'flex', zIndex: 10 }}>
                                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <motion.button type="submit" disabled={loading}
                        whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(220,38,38,0.3)' } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        style={{ marginTop: 8, padding: '14px', background: 'linear-gradient(135deg, #7C3AED, #DC2626)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}
                    >
                        {loading ? (
                            <>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%' }} />
                                Authenticating...
                            </>
                        ) : (
                            <><FiShield size={16} /> Access Admin Panel</>
                        )}
                    </motion.button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 32, padding: '16px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                    <p style={{ fontSize: '0.78rem', color: '#92400E' }}>⚠ This panel is restricted to admin accounts only. Regular users will be denied access.</p>
                </div>
            </motion.div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLock, FiCheckCircle, FiZap, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '@/lib/api';

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await api.post(`/auth/reset-password/${token}`, { password });
            
            // Auto login logic: Save token and redirect directly to dashboard
            if (res.data.token) {
                localStorage.setItem('devpilot_token', res.data.token);
            }
            setStatus('success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } catch (err: any) {
            setStatus('error');
            const errorData = err.response?.data?.error;
            setMessage(typeof errorData === 'string' ? errorData : errorData?.message || 'Invalid or expired token.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-inter)' }}>
            <div style={{ position: 'absolute', top: '20%', left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
            >
                <div style={{ marginBottom: 36 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <FiZap size={24} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8, fontFamily: 'var(--font-outfit)', color: '#fff' }}>
                        Set New Password
                    </h1>
                    <p style={{ color: '#71717A', fontSize: '0.95rem' }}>
                        Please enter your new password below.
                    </p>
                </div>

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '24px', textAlign: 'center' }}
                    >
                        <FiCheckCircle size={32} color="#10B981" style={{ marginBottom: 16 }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>Password Reset!</h3>
                        <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.6 }}>Logging you in securely...</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: '0.88rem', color: '#FCA5A5', fontWeight: 500 }}
                            >
                                {message}
                            </motion.div>
                        )}

                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600, display: 'block', marginBottom: 8 }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                <input
                                    type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                                    style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.05)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: 0, display: 'flex', zIndex: 10 }}>
                                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600, display: 'block', marginBottom: 8 }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                <input
                                    type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6}
                                    style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.05)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                                <button type="button" onClick={() => setShowConfirmPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: 0, display: 'flex', zIndex: 10 }}>
                                    {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit" disabled={status === 'loading' || !password || !confirmPassword}
                            whileHover={status !== 'loading' ? { scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' } : {}}
                            whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                            style={{ marginTop: 8, padding: '14px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: status === 'loading' || !password || !confirmPassword ? 'not-allowed' : 'pointer', opacity: status === 'loading' || !password || !confirmPassword ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}
                        >
                            {status === 'loading' ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%' }} />
                                    Updating...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}

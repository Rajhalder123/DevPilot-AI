'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiGithub, FiBriefcase, FiMic, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
    resumeCount: number;
    githubCount: number;
    jobCount: number;
    interviewCount: number;
    avgInterviewScore: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data.stats);
            } catch {
                // Stats may fail for new users, that's ok
                setStats({ resumeCount: 0, githubCount: 0, jobCount: 0, interviewCount: 0, avgInterviewScore: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Resumes Analyzed', value: stats?.resumeCount || 0, icon: FiFileText, color: '#6c5ce7', href: '/dashboard/resume' },
        { label: 'Repos Reviewed', value: stats?.githubCount || 0, icon: FiGithub, color: '#00d2ff', href: '/dashboard/github' },
        { label: 'Jobs Matched', value: stats?.jobCount || 0, icon: FiBriefcase, color: '#00b894', href: '/dashboard/jobs' },
        { label: 'Interviews Done', value: stats?.interviewCount || 0, icon: FiMic, color: '#fdcb6e', href: '/dashboard/interview' },
    ];

    const quickActions = [
        { title: 'Analyze Resume', desc: 'Get AI-powered resume scoring and optimization tips', icon: FiFileText, href: '/dashboard/resume', color: '#6c5ce7' },
        { title: 'Review GitHub Repo', desc: 'AI code review and architecture analysis', icon: FiGithub, href: '/dashboard/github', color: '#00d2ff' },
        { title: 'Find Jobs', desc: 'Get personalized AI job recommendations', icon: FiBriefcase, href: '/dashboard/jobs', color: '#00b894' },
        { title: 'Practice Interview', desc: 'Real-time AI interview with feedback', icon: FiMic, href: '/dashboard/interview', color: '#fdcb6e' },
    ];

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                    Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Developer'}</span>
                </h1>
                <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.95rem' }}>
                    Here&apos;s your career progress overview
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link href={card.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <card.icon size={20} color={card.color} />
                                    </div>
                                    <FiTrendingUp size={14} color="var(--success)" />
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                                    {loading ? '—' : card.value}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>{card.label}</div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>
                    Quick Actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {quickActions.map((action, i) => (
                        <Link key={i} href={action.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s' }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                    background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <action.icon size={22} color={action.color} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{action.title}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{action.desc}</p>
                                </div>
                                <FiArrowRight size={16} color="var(--muted)" />
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

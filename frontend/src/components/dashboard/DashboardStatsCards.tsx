'use client';
import Link from 'next/link';
import { FiBriefcase, FiMessageSquare } from 'react-icons/fi';
import { DashboardStats } from '@/hooks/useDashboardData';

const card: React.CSSProperties = {
    background: 'var(--d-card)', borderRadius: 16, padding: 20,
    border: '1px solid var(--d-border)', display: 'flex', alignItems: 'center', gap: 16,
    transition: 'background 0.3s, border-color 0.3s', boxShadow: 'var(--d-shadow)',
};

function CircleScore({ value, color }: { value: number; color: string }) {
    const r = 26, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ;
    return (
        <svg width={64} height={64} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
            <circle cx={32} cy={32} r={r} fill="none" stroke="var(--d-border)" strokeWidth={5} />
            <circle cx={32} cy={32} r={r} fill="none" stroke={color} strokeWidth={5}
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 32 32)" />
            <text x={32} y={37} textAnchor="middle" fill="var(--d-text)" fontSize={13} fontWeight={700}>{value}%</text>
        </svg>
    );
}

function MiniStat({ icon: Icon, iconColor, label, value, sub, href }: any) {
    return (
        <div style={{ background: 'var(--d-card)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--d-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'background 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={14} color={iconColor} />
                <span style={{ color: 'var(--d-text)', fontSize: '0.82rem', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--d-text)' }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--d-muted)', marginBottom: 8 }}>{sub}</div>
            <Link href={href} style={{ color: 'var(--d-accent-text)', fontSize: '0.78rem', fontWeight: 600 }}>View →</Link>
        </div>
    );
}

export default function DashboardStatsCards({ stats, loading }: { stats: DashboardStats | null; loading: boolean }) {
    const profileScore = stats ? Math.min(100, (stats.resumeCount > 0 ? 40 : 0) + (stats.githubCount > 0 ? 30 : 0) + (stats.interviewCount > 0 ? 20 : 0) + 10) : 0;
    const matchScore = stats ? Math.min(100, Math.round(stats.avgInterviewScore || 72)) : 0;

    if (loading) return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 100, background: 'var(--d-card)', borderRadius: 16, opacity: 0.4, border: '1px solid var(--d-border)' }} />)}
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            <div style={card}>
                <CircleScore value={profileScore} color="#4f46e5" />
                <div>
                    <h3 style={{ color: 'var(--d-text)', fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>Profile Strength</h3>
                    <p style={{ color: 'var(--d-muted)', fontSize: '0.8rem', marginBottom: 8 }}>{profileScore >= 80 ? 'Great job! Keep it up' : 'Complete your profile'}</p>
                    <Link href="/dashboard/resume" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600 }}>Improve Now →</Link>
                </div>
            </div>
            <div style={card}>
                <CircleScore value={matchScore} color="var(--d-stat-green)" />
                <div>
                    <h3 style={{ color: 'var(--d-text)', fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>AI Match Score</h3>
                    <p style={{ color: 'var(--d-muted)', fontSize: '0.8rem', marginBottom: 8 }}>{stats?.avgInterviewScore ? `Avg interview: ${Math.round(stats.avgInterviewScore)}%` : 'Start interviews to score'}</p>
                    <Link href="/dashboard/results" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600 }}>View Details →</Link>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <MiniStat icon={FiBriefcase} iconColor="#10b981" label="Job Matches" value={stats?.jobCount ?? 0} sub="From live boards" href="/dashboard/jobs" />
                <MiniStat icon={FiMessageSquare} iconColor="#f59e0b" label="Interviews" value={stats?.interviewCount ?? 0} sub={`${stats?.resumeCount ?? 0} resumes`} href="/dashboard/interview" />
            </div>
        </div>
    );
}

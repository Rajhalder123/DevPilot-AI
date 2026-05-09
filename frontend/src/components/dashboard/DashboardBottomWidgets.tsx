'use client';
import Link from 'next/link';
import { RecentInterview, DashboardStats } from '@/hooks/useDashboardData';

function RadarChart({ score }: { score: number }) {
    const cx = 100, cy = 100, r = 70;
    const labels = ['Skills', 'Experience', 'Projects', 'GitHub', 'Interview'];
    const angles = labels.map((_, i) => ((i * 360) / labels.length - 90) * (Math.PI / 180));
    const vals = [0.82, 0.75, 0.88, 0.68, Math.min(1, (score || 70) / 100)];
    const outer = angles.map(a => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }));
    const inner = angles.map((a, i) => ({ x: cx + r * vals[i] * Math.cos(a), y: cy + r * vals[i] * Math.sin(a) }));
    const toPath = (pts: {x:number;y:number}[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';

    return (
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: 170 }}>
            {[0.25, 0.5, 0.75, 1].map((s, i) => (
                <polygon key={i} points={outer.map(p => `${(cx + (p.x-cx)*s).toFixed(1)},${(cy + (p.y-cy)*s).toFixed(1)}`).join(' ')} fill="none" stroke="var(--d-border)" strokeWidth={1} />
            ))}
            {outer.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--d-border)" strokeWidth={1} />)}
            <path d={toPath(inner)} fill="var(--d-accent)" stroke="var(--d-accent-text)" strokeWidth={2} />
            {outer.map((p, i) => (
                <text key={i} x={(cx + (p.x-cx)*1.24).toFixed(1)} y={(cy + (p.y-cy)*1.24).toFixed(1)} fill="var(--d-muted)" fontSize={9} textAnchor="middle" dominantBaseline="middle">{labels[i]}</text>
            ))}
        </svg>
    );
}

export function CareerScore({ stats, loading }: { stats: DashboardStats | null; loading: boolean }) {
    const score = stats ? Math.round(((stats.resumeCount > 0 ? 40 : 0) + (stats.githubCount > 0 ? 30 : 0) + (stats.interviewCount > 0 ? 30 : 0)) * 0.86) : 0;
    return (
        <div style={{ background: 'var(--d-card)', borderRadius: 16, padding: 24, border: '1px solid var(--d-border)', transition: 'background 0.3s', boxShadow: 'var(--d-shadow)' }}>
            <h3 style={{ color: 'var(--d-text)', fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>AI Career Score</h3>
            <RadarChart score={loading ? 0 : (stats?.avgInterviewScore || 70)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
                <div>
                    <div style={{ color: 'var(--d-muted)', fontSize: '0.72rem' }}>Overall Score</div>
                    <div style={{ color: 'var(--d-text)', fontSize: '1.4rem', fontWeight: 700 }}>{loading ? '–' : score} <span style={{ color: 'var(--d-muted)', fontSize: '1rem' }}>/ 100</span></div>
                </div>
                <Link href="/dashboard/results" style={{ color: 'var(--d-accent-text)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>Full Report →</Link>
            </div>
        </div>
    );
}

export function InterviewWidget({ sessions, loading }: { sessions: RecentInterview[]; loading: boolean }) {
    return (
        <div style={{ background: 'var(--d-card)', borderRadius: 16, padding: 24, border: '1px solid var(--d-border)', transition: 'background 0.3s', boxShadow: 'var(--d-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--d-text)', fontSize: '1rem', fontWeight: 600 }}>Interview Sessions</h3>
                <a href="/dashboard/interview" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>View all</a>
            </div>
            {loading ? (
                [1,2,3].map(i => <div key={i} style={{ height: 52, background: 'var(--d-hover)', borderRadius: 10, marginBottom: 12, border: '1px solid var(--d-border)' }} />)
            ) : sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--d-muted)' }}>
                    <p style={{ fontSize: '0.85rem', marginBottom: 14 }}>No sessions yet</p>
                    <a href="/dashboard/interview" style={{ background: 'var(--d-btn-primary)', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>Start First Session</a>
                </div>
            ) : (
                <>
                    {sessions.slice(0, 3).map(s => (
                        <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--d-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--d-accent-text)', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                                    {s.topic.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ color: 'var(--d-text)', fontSize: '0.85rem', fontWeight: 600 }}>{s.topic}</div>
                                    <div style={{ color: 'var(--d-muted)', fontSize: '0.7rem' }}>{s.difficulty} · {s.status}{s.score ? ` · ${s.score}pts` : ''}</div>
                                </div>
                            </div>
                            <a href="/dashboard/interview" style={{ background: 'var(--d-accent)', border: '1px solid var(--d-border)', color: 'var(--d-accent-text)', padding: '6px 12px', borderRadius: 6, fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600 }}>
                                {s.status === 'completed' ? 'Review' : 'Continue'}
                            </a>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export function AppTracker({ stats, loading }: { stats: DashboardStats | null; loading: boolean }) {
    const cols = [
        { title: 'Applied', count: stats?.jobCount ?? 0, color: '#a855f7' },
        { title: 'Interview', count: stats?.interviewCount ?? 0, color: '#3b82f6' },
        { title: 'Offers', count: stats?.resumeCount ?? 0, color: '#22c55e' },
        { title: 'Reviewed', count: stats?.githubCount ?? 0, color: '#f59e0b' },
    ];
    return (
        <div style={{ background: 'var(--d-card)', borderRadius: 16, padding: 24, border: '1px solid var(--d-border)', transition: 'background 0.3s', boxShadow: 'var(--d-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--d-text)', fontSize: '1rem', fontWeight: 600 }}>Application Tracker</h3>
                <a href="/dashboard/tracker" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>View all</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {cols.map(col => (
                    <div key={col.title} style={{ background: 'var(--d-hover)', borderRadius: 12, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--d-border)' }}>
                        <div style={{ color: col.color, fontSize: '0.68rem', fontWeight: 700, marginBottom: 8 }}>{col.title}</div>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${col.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col.color, fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>
                            {loading ? '–' : col.count}
                        </div>
                        <div style={{ width: '80%', height: 3, background: `${col.color}25`, borderRadius: 2 }}>
                            <div style={{ width: loading ? '0%' : `${Math.min(100, col.count * 10)}%`, height: '100%', background: col.color, borderRadius: 2, transition: 'width 1s ease' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

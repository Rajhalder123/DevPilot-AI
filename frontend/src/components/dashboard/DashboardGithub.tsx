'use client';
import { FiGithub, FiStar, FiGitBranch } from 'react-icons/fi';
import { GitHubProject } from '@/hooks/useDashboardData';

function HeatmapMock() {
    const weeks = 26, days = 7;
    return (
        <div>
            <div style={{ display: 'flex', gap: 3 }} className="hide-scrollbar">
                {Array.from({ length: weeks }).map((_, w) => (
                    <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Array.from({ length: days }).map((_, d) => {
                            const lvl = Math.floor(Math.random() * 5);
                            const colors = ['var(--d-border)', '#166534', '#16a34a', '#22c55e', '#4ade80'];
                            return <div key={d} style={{ width: 9, height: 9, borderRadius: 2, background: colors[lvl] }} />;
                        })}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
                <span style={{ color: 'var(--d-muted)', fontSize: '0.65rem' }}>Less</span>
                {['var(--d-border)','#166534','#16a34a','#22c55e','#4ade80'].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: c }} />)}
                <span style={{ color: 'var(--d-muted)', fontSize: '0.65rem' }}>More</span>
            </div>
        </div>
    );
}

export default function DashboardGithub({ projects, loading }: { projects: GitHubProject[]; loading: boolean }) {
    const latest = projects[0];
    const totalStars = projects.reduce((s, p) => s + (p.stars || 0), 0);
    const topLang = projects.find(p => p.language)?.language || 'TypeScript';

    return (
        <div style={{ background: 'var(--d-card)', borderRadius: 16, padding: 24, border: '1px solid var(--d-border)', transition: 'background 0.3s', boxShadow: 'var(--d-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--d-text)', fontSize: '1rem', fontWeight: 600 }}>GitHub Insights</h3>
                <a href="/dashboard/github" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>View details</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--d-tag-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--d-border)' }}>
                    <FiGithub size={22} color="var(--d-text)" />
                </div>
                <div>
                    <div style={{ color: 'var(--d-text)', fontWeight: 600, fontSize: '0.9rem' }}>{loading ? '...' : (latest?.owner || 'Your GitHub')}</div>
                    <div style={{ color: 'var(--d-muted)', fontSize: '0.75rem' }}>{projects.length} {projects.length === 1 ? 'repo' : 'repos'} analyzed</div>
                </div>
            </div>

            <div style={{ marginBottom: 24 }}><HeatmapMock /></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
                {[
                    { label: 'Repositories', value: loading ? '–' : projects.length, sub: 'Analyzed by AI', sub_color: 'var(--d-stat-green)' },
                    { label: 'Total Stars', value: loading ? '–' : totalStars, sub: 'across repos', sub_color: 'var(--d-muted)', icon: <FiStar size={10} style={{ verticalAlign: 'middle' }} /> },
                    { label: 'Top Language', value: loading ? '–' : topLang, sub: 'Most used', sub_color: 'var(--d-muted)' },
                    { label: 'AI Score', value: loading ? '–' : (latest?.analysis?.overallScore ? `${latest.analysis.overallScore}/100` : 'Pending'), sub: 'latest repo', sub_color: 'var(--d-muted)', icon: <FiGitBranch size={10} style={{ verticalAlign: 'middle' }} /> },
                ].map(s => (
                    <div key={s.label}>
                        <div style={{ color: 'var(--d-muted)', fontSize: '0.72rem', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ color: 'var(--d-text)', fontSize: '1.2rem', fontWeight: 700 }}>{s.value}</div>
                        <div style={{ color: s.sub_color, fontSize: '0.7rem' }}>{s.icon} {s.sub}</div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && !loading && (
                <div style={{ marginTop: 16, padding: 12, background: 'var(--d-accent)', borderRadius: 10, border: '1px dashed var(--d-border-hover)', textAlign: 'center' }}>
                    <a href="/dashboard/github" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>+ Analyze your first GitHub repo →</a>
                </div>
            )}
        </div>
    );
}

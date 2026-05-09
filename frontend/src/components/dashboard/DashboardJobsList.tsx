'use client';
import { FiStar, FiMapPin, FiClock, FiBriefcase, FiExternalLink } from 'react-icons/fi';
import { Job } from '@/hooks/useDashboardData';

function matchScore(tags: any[]) {
    const devTags = ['react','next','typescript','node','python','aws','docker','kubernetes'];
    const matched = tags.filter(t => typeof t === 'string' && devTags.includes(t.toLowerCase())).length;
    return Math.min(99, 75 + matched * 4 + Math.floor(Math.random() * 5));
}

function LogoPlaceholder({ company }: { company: string }) {
    const colors = ['#4f46e5','#7c3aed','#0891b2','#059669','#d97706','#dc2626'];
    const color = colors[company.charCodeAt(0) % colors.length];
    return <div style={{ width: 40, height: 40, borderRadius: 10, background: color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{company.charAt(0).toUpperCase()}</div>;
}

function JobCard({ job }: { job: Job }) {
    const score = matchScore(job.tags);
    return (
        <div style={{ padding: 16, border: '1px solid var(--d-border)', borderRadius: 12, background: 'var(--d-hover)', transition: 'border-color 0.2s, background 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--d-border-hover)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--d-border)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 14, flex: 1, minWidth: 0 }}>
                    {job.companyLogo
                        ? <img src={job.companyLogo} alt={job.company} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'contain', background: '#fff', padding: 4, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        : <LogoPlaceholder company={job.company} />}
                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                            <h4 style={{ color: 'var(--d-text)', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</h4>
                            <span style={{ background: 'var(--d-badge-bg)', color: 'var(--d-badge-text)', fontSize: '0.68rem', padding: '2px 8px', borderRadius: 12, fontWeight: 700, flexShrink: 0 }}>{score}% Match</span>
                        </div>
                        <p style={{ color: 'var(--d-muted)', fontSize: '0.78rem', marginBottom: 10 }}>{job.company} · {job.location}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                            {job.tags.slice(0, 4).map((t, idx) => {
                                const label = typeof t === 'string' ? t : (t as any)?.name || String(t);
                                return <span key={idx} style={{ background: 'var(--d-tag-bg)', color: 'var(--d-tag-text)', fontSize: '0.68rem', padding: '3px 9px', borderRadius: 4 }}>{label}</span>;
                            })}
                        </div>
                        <div style={{ display: 'flex', gap: 12, color: 'var(--d-muted)', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                            {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiBriefcase size={11} />{job.salary}</span>}
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiMapPin size={11} />{job.type}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={11} />Full-time</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0, marginLeft: 12 }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--d-muted)', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', cursor: 'pointer' }}><FiStar size={13} />Save</button>
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                        style={{ background: 'var(--d-btn-primary)', color: '#fff', padding: '7px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                        Apply <FiExternalLink size={12} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function DashboardJobsList({ jobs, loading }: { jobs: Job[]; loading: boolean }) {
    return (
        <div style={{ background: 'var(--d-card)', borderRadius: 16, padding: 24, border: '1px solid var(--d-border)', transition: 'background 0.3s', boxShadow: 'var(--d-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--d-text)', fontSize: '1rem', fontWeight: 600 }}>AI Matched Jobs for You</h3>
                <a href="/dashboard/jobs" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>View all</a>
            </div>
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1,2,3].map(i => <div key={i} style={{ height: 90, background: 'var(--d-hover)', borderRadius: 12, border: '1px solid var(--d-border)' }} />)}
                </div>
            ) : jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--d-muted)' }}>
                    <FiBriefcase size={32} style={{ margin: '0 auto 12px', opacity: 0.4, display: 'block' }} />
                    <p>No jobs loaded. Check your connection.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <a href="/dashboard/jobs" style={{ color: 'var(--d-accent-text)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>View all matched jobs →</a>
            </div>
        </div>
    );
}

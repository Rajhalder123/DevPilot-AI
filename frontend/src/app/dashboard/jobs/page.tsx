'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiBriefcase, FiMapPin, FiExternalLink,
    FiTag, FiClock, FiFilter, FiGlobe, FiTrendingUp
} from 'react-icons/fi';
import api from '@/lib/api';

interface Job {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    tags: string[];
    applyUrl: string;
    source: string;
    postedAt: string;
}

const experienceLevels = ['Any', 'Junior', 'Mid', 'Senior', 'Lead'];
const jobTypes = ['All', 'Remote', 'Hybrid', 'Onsite'];

const SUGGESTIONS = [
    'React Developer', 'Node.js Developer', 'Full Stack Developer', 'Frontend Developer',
    'Backend Developer', 'Python Developer', 'DevOps Engineer', 'Data Scientist',
    'Machine Learning Engineer', 'TypeScript Developer', 'Next.js Developer',
    'Cloud Engineer', 'AWS Engineer', 'Software Engineer', 'UI/UX Designer',
    'Product Manager', 'Android Developer', 'iOS Developer', 'Flutter Developer',
    'Java Developer', 'Go Developer', 'Rust Developer', 'Blockchain Developer',
    'Cybersecurity Engineer', 'QA Engineer', 'Site Reliability Engineer',
    'Mobile Developer', 'React Native Developer', 'Angular Developer', 'Vue.js Developer',
];

const PLATFORMS = [
    {
        name: 'LinkedIn',
        color: '#0A66C2',
        logo: 'https://cdn.simpleicons.org/linkedin/0A66C2',
        url: (q: string) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&f_WT=2`,
    },
    {
        name: 'Indeed',
        color: '#2557A7',
        logo: 'https://cdn.simpleicons.org/indeed/2557A7',
        url: (q: string) => `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}`,
    },
    {
        name: 'Glassdoor',
        color: '#0CAA41',
        logo: 'https://cdn.simpleicons.org/glassdoor/0CAA41',
        url: (q: string) => `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(q)}`,
    },
    {
        name: 'Naukri',
        color: '#FF7555',
        logo: 'https://www.naukri.com/favicon.ico',
        url: (q: string) => `https://www.naukri.com/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}-jobs`,
    },
    {
        name: 'Wellfound',
        color: '#F74040',
        logo: 'https://cdn.simpleicons.org/wellfound/F74040',
        url: (q: string) => `https://wellfound.com/jobs?q=${encodeURIComponent(q)}`,
    },
    {
        name: 'Internshala',
        color: '#00AEEF',
        logo: 'https://internshala.com/favicon.ico',
        url: (q: string) => `https://internshala.com/jobs/keyword/${encodeURIComponent(q)}`,
    },
];

export default function JobsPage() {
    const [query, setQuery] = useState('');
    const [experience, setExperience] = useState('Any');
    const [jobType, setJobType] = useState('All');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close suggestions on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filteredSuggestions = query
        ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()) && s.toLowerCase() !== query.toLowerCase()).slice(0, 8)
        : SUGGESTIONS.slice(0, 10);

    const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
        e?.preventDefault();
        setShowSuggestions(false);
        const finalQuery = overrideQuery ?? query;
        setLoading(true);
        setError('');
        setSearched(true);
        try {
            const searchQuery = [finalQuery, experience !== 'Any' ? experience : ''].filter(Boolean).join(' ');
            const res = await api.get('/jobs/search', {
                params: { query: searchQuery || 'developer', location: 'remote' },
            });
            let results: Job[] = res.data.jobs || [];
            if (jobType !== 'All') {
                results = results.filter(j => j.type === jobType.toLowerCase());
            }
            setJobs(results);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        handleSearch(undefined, suggestion);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return `${Math.floor(diffDays / 30)}mo ago`;
    };

    const typeColor: Record<string, string> = {
        remote: '#F97316', // Orange
        hybrid: '#F59E0B', // Amber
        onsite: 'var(--primary)', // Blue (keep one contrasting color, or use Slate #475569)
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                    Job <span className="gradient-text">Search</span>
                </h1>
                <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: '0.95rem' }}>
                    Search thousands of real jobs — click to apply directly on the employer's site.
                </p>
            </motion.div>

            {/* Search Form */}
            <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSearch}
            >
                <div className="card" style={{ marginBottom: 20 }}>
                    {/* Main search bar with autocomplete */}
                    <div ref={searchRef} style={{ position: 'relative', marginBottom: 16 }}>
                        <FiSearch size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 2 }} />
                        <input
                            className="input"
                            placeholder="Job title, skill, or keyword  (e.g. React Developer, Python, DevOps)"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={(e) => { if (e.key === 'Escape') setShowSuggestions(false); }}
                            style={{ paddingLeft: 44, fontSize: '1rem' }}
                            autoComplete="off"
                        />

                        {/* Autocomplete dropdown */}
                        <AnimatePresence>
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                    exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                        position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                                        background: 'var(--card)', border: '1px solid var(--border-color)',
                                        borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        zIndex: 100, overflow: 'hidden',
                                    }}
                                >
                                    <div style={{ padding: '8px 12px 4px', fontSize: '0.72rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, borderBottom: '1px solid var(--border-color)' }}>
                                        <FiTrendingUp size={11} /> {query ? 'Matching searches' : 'Popular searches'}
                                    </div>
                                    {filteredSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                                            style={{
                                                width: '100%', textAlign: 'left', padding: '10px 16px',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--foreground)', fontSize: '0.875rem',
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                transition: 'background 0.15s',
                                                borderBottom: i < filteredSuggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,92,231,0.1)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                        >
                                            <FiSearch size={13} color="var(--muted)" style={{ flexShrink: 0 }} />
                                            <span>
                                                {query ? (
                                                    <>
                                                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{s.substring(0, s.toLowerCase().indexOf(query.toLowerCase()))}<mark style={{ background: 'rgba(108,92,231,0.25)', color: 'var(--accent)', borderRadius: 3, padding: '0 2px' }}>{s.substring(s.toLowerCase().indexOf(query.toLowerCase()), s.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</mark>{s.substring(s.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                                                    </>
                                                ) : s}
                                            </span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Filters row */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiFilter size={14} color="var(--muted)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Filters:</span>
                        </div>

                        {/* Experience */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {experienceLevels.map(level => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setExperience(level)}
                                    style={{
                                        padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem',
                                        border: `1px solid ${experience === level ? 'var(--primary)' : 'var(--border-color)'}`,
                                        background: experience === level ? 'rgba(108,92,231,0.15)' : 'transparent',
                                        color: experience === level ? 'var(--accent)' : 'var(--muted)',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >{level}</button>
                            ))}
                        </div>

                        <div style={{ width: 1, height: 20, background: 'var(--border-color)' }} />

                        {/* Job type */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {jobTypes.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setJobType(type)}
                                    style={{
                                        padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem',
                                        border: `1px solid ${jobType === type ? '#00d2ff' : 'var(--border-color)'}`,
                                        background: jobType === type ? 'rgba(0,210,255,0.1)' : 'transparent',
                                        color: jobType === type ? '#00d2ff' : 'var(--muted)',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >{type}</button>
                            ))}
                        </div>

                        {/* Search button */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}
                        >
                            <FiSearch size={15} />
                            {loading ? 'Searching...' : 'Search Jobs'}
                        </motion.button>
                    </div>
                </div>
            </motion.form>

            {/* Error */}
            {error && (
                <div style={{
                    background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
                    borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: 'var(--danger)', marginBottom: 20,
                }}>{error}</div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card" style={{ height: 120, opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            )}

            {/* Results */}
            {!loading && searched && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
                            {jobs.length > 0 ? (
                                <><span className="gradient-text">{jobs.length}</span> jobs found</>
                            ) : 'No jobs found — try different keywords'}
                        </h2>
                        {jobs.length > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FiGlobe size={12} /> Remotive · Arbeitnow · The Muse · Jobicy · RemoteOK · Himalayas
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <AnimatePresence>
                            {jobs.map((job, i) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                        {/* Company logo */}
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                                            background: 'rgba(108,92,231,0.1)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                        }}>
                                            {job.companyLogo ? (
                                                <img src={job.companyLogo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            ) : (
                                                <FiBriefcase size={20} color="var(--primary)" />
                                            )}
                                        </div>

                                        {/* Job info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                                                <div>
                                                    <h3 style={{ fontSize: '0.97rem', fontWeight: 700, marginBottom: 2 }}>{job.title}</h3>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <FiBriefcase size={12} /> {job.company}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <FiMapPin size={12} /> {job.location}
                                                        </span>
                                                        {job.postedAt && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <FiClock size={12} /> {formatDate(job.postedAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Apply button */}
                                                <motion.a
                                                    href={job.applyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                        background: 'var(--gradient-primary)',
                                                        color: '#fff', textDecoration: 'none',
                                                        padding: '8px 16px', borderRadius: 8,
                                                        fontSize: '0.82rem', fontWeight: 600,
                                                        whiteSpace: 'nowrap', flexShrink: 0,
                                                    }}
                                                >
                                                    Apply Now <FiExternalLink size={13} />
                                                </motion.a>
                                            </div>

                                            {/* Description */}
                                            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>
                                                {job.description}
                                            </p>

                                            {/* Tags + type badge */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.72rem', padding: '3px 8px', borderRadius: 20,
                                                    background: `${typeColor[job.type] || '#6c5ce7'}20`,
                                                    color: typeColor[job.type] || '#6c5ce7',
                                                    border: `1px solid ${typeColor[job.type] || '#6c5ce7'}40`,
                                                    fontWeight: 600, textTransform: 'capitalize',
                                                }}>{job.type}</span>

                                                {job.salary && job.salary !== 'Not specified' && (
                                                    <span style={{
                                                        fontSize: '0.72rem', padding: '3px 8px', borderRadius: 20,
                                                        background: 'rgba(0,184,148,0.1)', color: 'var(--success)',
                                                        border: '1px solid rgba(0,184,148,0.3)',
                                                    }}>{job.salary}</span>
                                                )}

                                                {job.tags.slice(0, 5).map((tag: string, ti: number) => (
                                                    <span key={ti} style={{
                                                        fontSize: '0.72rem', padding: '3px 8px', borderRadius: 20,
                                                        background: 'rgba(108,92,231,0.08)',
                                                        color: 'var(--muted)',
                                                        border: '1px solid var(--border-color)',
                                                        display: 'flex', alignItems: 'center', gap: 3,
                                                    }}>
                                                        <FiTag size={10} />{tag}
                                                    </span>
                                                ))}

                                                <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--muted)', opacity: 0.6 }}>
                                                    via {job.source}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}

            {/* Also search on major platforms */}
            {searched && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                    style={{ marginTop: 24 }}
                >
                    <div style={{ marginBottom: 14 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>Also search on major platforms</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Click to open with your query pre-filled — apply directly on their site.</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {PLATFORMS.map(platform => (
                            <motion.a
                                key={platform.name}
                                href={platform.url(query || 'developer')}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '9px 16px', borderRadius: 10,
                                    border: `1px solid ${platform.color}40`,
                                    background: `${platform.color}12`,
                                    color: platform.color, textDecoration: 'none',
                                    fontSize: '0.83rem', fontWeight: 600,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <img
                                    src={platform.logo}
                                    alt={platform.name}
                                    width={16} height={16}
                                    style={{ borderRadius: 3, objectFit: 'contain' }}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                {platform.name} <FiExternalLink size={11} />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Empty state before search */}
            {!loading && !searched && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ textAlign: 'center', padding: '60px 20px' }}
                >
                    <div style={{
                        width: 80, height: 80, borderRadius: 20, margin: '0 auto 20px',
                        background: 'rgba(108,92,231,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <FiBriefcase size={36} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>
                        Search Real Jobs
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto' }}>
                        Enter your skills or job title and click Search. Results link directly to the job listing so you can apply instantly.
                    </p>
                </motion.div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    FiZap, FiArrowRight, FiCheckCircle, FiFileText, FiGithub, 
    FiTrendingUp, FiTarget, FiCodesandbox, FiMenu, FiX, FiCheck,
    FiTerminal, FiActivity, FiCode
} from 'react-icons/fi';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

    return (
        <div style={{ background: '#0F172A', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
            
            {/* 1. NAVBAR (sticky) */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: scrolled ? 'rgba(15, 23, 42, 0.95)' : '#0F172A',
                backdropFilter: 'blur(12px)',
                transition: 'background-color 0.3s ease',
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiZap size={18} color="#fff" />
                        </div>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
                            DevPilot <span style={{ color: '#38BDF8' }}>AI</span>
                        </span>
                    </Link>

                    <nav className="nav-link-desktop" style={{ display: 'flex', gap: 40 }}>
                        {['Features', 'Terminal', 'Pricing'].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#F8FAFC'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>
                                {item}
                            </Link>
                        ))}
                    </nav>

                    <div className="nav-link-desktop" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Link href="/login" style={{ color: '#F8FAFC', fontSize: 14, fontWeight: 600, textDecoration: 'none', padding: '8px 16px', border: '1px solid transparent' }}>Log in</Link>
                        <Link href="/signup" style={{ background: '#2563EB', color: '#fff', padding: '8px 20px', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.background='#1D4ED8')} onMouseLeave={e=>(e.currentTarget.style.background='#2563EB')}>Sign Up</Link>
                    </div>

                    <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#F8FAFC', cursor: 'pointer' }}>
                        <FiMenu size={24} />
                    </button>
                </div>
            </header>

            {/* Mobile Menu logic */}
            {mobileMenuOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 110, padding: 24, display: 'flex', flexDirection: 'column', background: '#0F172A' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Navigation</span>
                        <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#F8FAFC' }}><FiX size={24} /></button>
                    </div>
                    {['Features', 'Terminal', 'Pricing'].map((item) => (
                        <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)} style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 700, marginBottom: 20, textDecoration: 'none' }}>{item}</Link>
                    ))}
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#F8FAFC', fontSize: 16, fontWeight: 600, textDecoration: 'none', textAlign: 'center', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>Log in</Link>
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)} style={{ background: '#2563EB', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: 4, fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
                    </div>
                </div>
            )}

            <main style={{ paddingTop: 80 }}>
                {/* 2. HERO SECTION */}
                <section style={{ maxWidth: 1400, margin: '80px auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 60, alignItems: 'center' }}>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 4, border: '1px solid rgba(56, 189, 248, 0.2)', background: 'rgba(56, 189, 248, 0.05)', color: '#38BDF8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 32 }}>
                            <FiActivity /> The Career Intelligence Terminal
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-1px' }}>
                            Data-Driven <br/><span style={{ color: '#38BDF8' }}>Career Strategy.</span>
                        </h1>
                        <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 40, maxWidth: 480 }}>
                            Stop guessing why you're not getting hired. DevPilot AI analyzes your resume, GitHub architecture, and skill matrices to generate your definitive Job Ready Score.
                        </p>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <Link href="/signup" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4, background: '#2563EB', color: '#fff', padding: '14px 28px', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.background='#1D4ED8')} onMouseLeave={e=>(e.currentTarget.style.background='#2563EB')}>
                                Start Analysis <FiArrowRight />
                            </Link>
                            <Link href="#terminal" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4, padding: '14px 28px', fontSize: 14, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', textDecoration: 'none', background: 'rgba(255,255,255,0.02)' }}>
                                View Terminal
                            </Link>
                        </div>
                    </motion.div>

                    {/* TRADINGVIEW STYLE MOCK DASHBOARD */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#1E293B', borderRadius: 6, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    >
                        {/* Fake Header */}
                        <div style={{ height: 36, background: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#334155' }} />
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#334155' }} />
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#334155' }} />
                            </div>
                            <div style={{ color: '#64748B', fontSize: 12, fontFamily: 'monospace' }}>terminal - devpilot/analysis-stream</div>
                        </div>
                        {/* Grid Body */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', padding: 1, gap: 1, background: 'rgba(255,255,255,0.05)' }}>
                            {/* Left Side */}
                            <div style={{ background: '#0F172A', padding: 32 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                                    <div style={{ color: '#94A3B8', fontSize: 13, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>JRS_INDEX</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981', fontSize: 13, fontWeight: 700 }}><FiTrendingUp /> +2.4%</div>
                                </div>
                                <div style={{ fontSize: '5rem', fontWeight: 700, fontFamily: 'monospace', color: '#F8FAFC', lineHeight: 1 }}>
                                    72<span style={{ fontSize: '2rem', color: '#64748B' }}>.4</span>
                                </div>
                                <div style={{ display: 'flex', gap: 4, height: 60, alignItems: 'flex-end', marginTop: 40 }}>
                                    {[30, 45, 25, 60, 40, 75, 50, 72].map((h, i) => (
                                        <div key={i} style={{ flex: 1, backgroundColor: i === 7 ? '#38BDF8' : 'rgba(56, 189, 248, 0.15)', height: `${h}%`, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
                                    ))}
                                </div>
                            </div>
                            {/* Right Side */}
                            <div style={{ background: '#0F172A', display: 'flex', flexDirection: 'column' }}>
                                {[
                                    { label: 'RESUME_ATS', val: '75.0', icon: FiFileText, color: '#F59E0B' },
                                    { label: 'GITHUB_ARCH', val: '68.2', icon: FiCode, color: '#EC4899' },
                                    { label: 'SKILL_NODE', val: '82.1', icon: FiTerminal, color: '#3B82F6' }
                                ].map((item, i) => (
                                    <div key={i} style={{ flex: 1, padding: '24px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 12, fontWeight: 600, letterSpacing: '1px', marginBottom: 8 }}>
                                            <item.icon size={14} color={item.color} /> {item.label}
                                        </div>
                                        <div style={{ fontSize: 24, fontFamily: 'monospace', color: '#E2E8F0', fontWeight: 600 }}>{item.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 3. PROBLEM SECTION */}
                <section style={{ padding: '100px 32px', background: '#0B1120', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: 60, letterSpacing: '-0.5px' }}>
                            Why Candidates Get Filtered Out
                        </motion.h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1 }}>
                            {[
                                { title: 'ATS Keyword Misses', desc: 'Over 70% of resumes are dropped by enterprise ATS logic due to missing semantic keyword mappings.' },
                                { title: 'Shallow GitHub Repos', desc: 'No complex architecture, missing CI/CD pipelines, or poor commit consistency flags you as unready.' },
                                { title: 'Zero Feedback Loop', desc: 'Applying to 500+ jobs sequentially without intercepting and fixing the exact drop-off point.' },
                                { title: 'Misaligned Skill Maps', desc: 'Learning irrelevant tech stacks instead of the exact frameworks demanded by the specific target roles.' }
                            ].map((p, i) => (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }} 
                                    style={{ padding: 40, border: '1px solid rgba(255,255,255,0.05)', background: '#0F172A', borderRadius: 6 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 4, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                        <FiX size={18} />
                                    </div>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#E2E8F0' }}>{p.title}</h3>
                                    <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6 }}>{p.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. SOLUTION SECTION */}
                <section style={{ padding: '100px 32px' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 80 }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.5px' }}>
                                The Career Analytics Protocol
                            </h2>
                            <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
                                DevPilot AI operates identically to a strict technical recruiting suite. It intercepts your application assets and provides algorithmic feedback to secure the interview.
                            </p>
                        </motion.div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                            {[
                                { title: 'Resume ATS Parser', icon: FiFileText, color: '#38BDF8', desc: 'Parses PDFs leveraging OCR and semantic matching against actual job requirement matrices.' },
                                { title: 'GitHub Static Analysis', icon: FiGithub, color: '#A78BFA', desc: 'Clones and scans your public repositories for code smells, architectural depth, and best practices.' },
                                { title: 'Job Ready Scoring', icon: FiTarget, color: '#34D399', desc: 'Proprietary weighting algorithm combining your output variables into a single predictive readiness metric.' }
                            ].map((s, i) => (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }} 
                                    style={{ padding: 40, border: '1px solid rgba(255,255,255,0.08)', background: '#1E293B', borderRadius: 6 }}>
                                    <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <s.icon size={20} />
                                        </div>
                                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F8FAFC' }}>{s.title}</h3>
                                    </div>
                                    <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. FEATURES SECTION (GRID) */}
                <section id="features" style={{ padding: '100px 32px', background: '#0B1120', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                        <div style={{ marginBottom: 60 }}>
                            <div style={{ color: '#38BDF8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Feature Matrix</div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Comprehensive Tooling</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1 }}>
                            {[
                                { title: 'Keyword Mapping', icon: FiFileText, desc: 'Correlate your CV directly against JD requirements.' },
                                { title: 'Code Refactoring', icon: FiCode, desc: 'Get automated PR-style reviews on your public repos.' },
                                { title: 'Action-Verb AI', icon: FiZap, desc: 'Rewrites weak bullets into XYZ-format achievements.' },
                                { title: 'Tech Stack Gap Analysis', icon: FiCodesandbox, desc: 'Identifies missing frameworks holding you back.' },
                                { title: 'Progression Tracking', icon: FiActivity, desc: 'Visualize your Job Ready Score metrics over time.' },
                                { title: 'Role Matching', icon: FiTarget, desc: 'Data-driven correlation to open market positions.' }
                            ].map((f, i) => (
                                <motion.div key={i} whileHover={{ background: 'rgba(255,255,255,0.02)' }} 
                                    style={{ padding: 40, background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', display: 'flex', gap: 20 }}>
                                    <f.icon size={20} color="#38BDF8" style={{ flexShrink: 0, marginTop: 4 }} />
                                    <div>
                                        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#E2E8F0' }}>{f.title}</h3>
                                        <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. TERMINAL PREVIEW */}
                <section id="terminal" style={{ padding: '120px 32px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ marginBottom: 60, textAlign: 'center' }}>
                            <div style={{ color: '#10B981', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Data Execution</div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Actionable Diagnostics</h2>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} 
                            style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: '#1E293B', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                            <div style={{ height: 36, background: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16 }}>
                                <div style={{ fontSize: 12, color: '#64748B', fontFamily: 'monospace' }}>Action Required / Diagnostics</div>
                            </div>
                            
                            <div style={{ padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ padding: 40, background: '#0F172A', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Current Yield</div>
                                    <div style={{ fontSize: '4.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#10B981', lineHeight: 1 }}>72<span style={{ fontSize: '2rem', color: '#64748B' }}>.0</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, marginTop: 32 }}>
                                        <div style={{ textAlign: 'left' }}><div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>RESUME</div> <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>75.0</div></div>
                                        <div style={{ textAlign: 'left' }}><div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>GITHUB</div> <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>68.0</div></div>
                                    </div>
                                </div>
                                
                                <div style={{ padding: 40, background: '#0F172A' }}>
                                    <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                                        <FiZap /> Critical Fixes Required
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 20, color: '#E2E8F0', fontSize: 14 }}>
                                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#F59E0B', fontFamily: 'monospace' }}>[WARN]</span> <span style={{ lineHeight: 1.5 }}>Add comprehensive README files containing actual deployment links logically.</span></li>
                                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#F59E0B', fontFamily: 'monospace' }}>[WARN]</span> <span style={{ lineHeight: 1.5 }}>Inject "TypeScript" and "REST APIs" into resume core competencies.</span></li>
                                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#F59E0B', fontFamily: 'monospace' }}>[WARN]</span> <span style={{ lineHeight: 1.5 }}>Refactor monolith Next.js project into discrete structural components.</span></li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 8. TESTIMONIALS */}
                <section style={{ padding: '100px 32px', background: '#0B1120', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                        <div style={{ marginBottom: 60, textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Verified Placements</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                            {[
                                { text: "I didn't realize how brutally my resume was filtered out by enterprise ATS. The DevPilot parse log instructed me to format keywords. Got 3 interviews immediately.", author: "Arjun P.", role: "Frontend Dev // Placed" },
                                { text: "My GitHub code rating was 45. After optimizing the architecture and adopting proper commit patterns based on the terminal scanner, I passed technicals.", author: "Sneha R.", role: "Backend Eng // Placed" },
                                { text: "Having a concrete metric like the JRS gamified my preparation. I knew exactly when I was statistically ready to transition to senior level operations.", author: "Karan S.", role: "Senior Eng // Promoted" }
                            ].map((t, i) => (
                                <div key={i} style={{ padding: 32, border: '1px solid rgba(255,255,255,0.05)', background: '#0F172A', borderRadius: 6, display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, flex: 1, marginBottom: 32 }}>"{t.text}"</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 4, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#E2E8F0' }}>
                                            {t.author[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13, color: '#E2E8F0' }}>{t.author}</div>
                                            <div style={{ color: '#10B981', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 9. PRICING SECTION */}
                <section id="pricing" style={{ padding: '120px 32px' }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.5px' }}>Access Tiers</h2>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                            {/* Free Plan */}
                            <div style={{ padding: 40, borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: '#0F172A' }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Basic Access</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: 'monospace', marginBottom: 32, lineHeight: 1 }}>₹0</div>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                                    <li style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#E2E8F0', fontSize: 14 }}><FiCheck size={12} color="#38BDF8" style={{ transform: 'translateY(2px)' }} /> Primary ATS Testing</li>
                                    <li style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#E2E8F0', fontSize: 14 }}><FiCheck size={12} color="#38BDF8" style={{ transform: 'translateY(2px)' }} /> GitHub Health Score</li>
                                </ul>
                                <Link href="/signup" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '12px', borderRadius: 4, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', fontSize: 14, fontWeight: 600 }}>Create Free Account</Link>
                            </div>

                            {/* Pro Plan */}
                            <div style={{ padding: 40, borderRadius: 6, border: '1px solid #38BDF8', background: '#0F172A', position: 'relative', boxShadow: '0 0 40px rgba(56, 189, 248, 0.05)' }}>
                                <div style={{ position: 'absolute', top: -12, left: 32, background: '#38BDF8', color: '#0F172A', padding: '4px 12px', borderRadius: 2, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Pro License</div>
                                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Analytics Suite</h3>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 32 }}>
                                    <span style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#F8FAFC', lineHeight: 1 }}>₹99</span>
                                    <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500, marginTop: 8 }}>/mo</span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                                    <li style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#E2E8F0', fontSize: 14 }}><FiCheck size={12} color="#38BDF8" style={{ transform: 'translateY(2px)' }} /> Comprehensive Data Reports</li>
                                    <li style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#E2E8F0', fontSize: 14 }}><FiCheck size={12} color="#38BDF8" style={{ transform: 'translateY(2px)' }} /> Automated Semantic Rewriting</li>
                                    <li style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#E2E8F0', fontSize: 14 }}><FiCheck size={12} color="#38BDF8" style={{ transform: 'translateY(2px)' }} /> Prioritized Processing Threads</li>
                                </ul>
                                <Link href="/signup" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '12px', borderRadius: 4, textDecoration: 'none', background: '#2563EB', color: '#fff', fontSize: 14, fontWeight: 600 }}>Upgrade to Pro</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                {/* 10. FINAL CTA */}
                <section style={{ padding: '120px 32px', textAlign: 'center', background: '#0B1120' }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.1, letterSpacing: '-1px' }}>
                            Careers driven by algorithms.<br/><span style={{ color: '#38BDF8' }}>Not by luck.</span>
                        </h2>
                        <p style={{ color: '#94A3B8', fontSize: '1.05rem', marginBottom: 40, lineHeight: 1.6 }}>Deploy the DevPilot analytics protocol on your applications today. Uncover the exact metrics required to pass recruiter filters consistently.</p>
                        <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', padding: '16px 36px', fontSize: 14, fontWeight: 600, borderRadius: 4, textDecoration: 'none' }}>
                            Initialize Job Ready Scan <FiArrowRight />
                        </Link>
                    </div>
                </section>
            </main>

            {/* 11. FOOTER */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 32px 40px', background: '#0F172A' }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 4, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiZap size={12} color="#fff" />
                        </div>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px' }}>DevPilot AI</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['Privacy Policy', 'Terms of Service', 'API Reference', 'Status'].map((link) => (
                            <Link key={link} href="#" style={{ color: '#64748B', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='#E2E8F0'} onMouseLeave={e=>e.currentTarget.style.color='#64748B'}>{link}</Link>
                        ))}
                    </div>

                    <div style={{ color: '#334155', fontSize: 12, marginTop: 20, fontFamily: 'monospace' }}>
                        © 2026 DEVPILOT_AI // BUILD_REV_2.4.1
                    </div>
                </div>
            </footer>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiZap, FiArrowRight, FiCheckCircle, FiFileText, FiGithub,
    FiTrendingUp, FiTarget, FiCodesandbox, FiMenu, FiX, FiCheck,
    FiTerminal, FiActivity, FiCode, FiBriefcase
} from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
    const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-blue-500/30">

            {/* --- NAVBAR --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-indigo-100 py-4 shadow-sm shadow-indigo-100' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                            <FiZap size={20} className="text-slate-900" />
                        </div>
                        <span className="font-display text-xl font-bold tracking-tight">
                            DevPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {['Features', 'Dashboard', 'Jobs', 'Pricing'].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                {item}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2">
                            Log in
                        </Link>
                        <Link href="/signup">
                            <Button variant="primary" size="sm" className="rounded-full shadow-blue-500/20">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    <button className="md:hidden text-slate-700" onClick={() => setMobileMenuOpen(true)}>
                        <FiMenu size={28} />
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-3xl p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-display text-xl font-bold">Navigation</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-slate-900"><FiX size={28} /></button>
                        </div>
                        <div className="flex flex-col gap-6 text-2xl font-display font-semibold">
                            {['Features', 'Dashboard', 'Jobs', 'Pricing'].map((item) => (
                                <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-col gap-4">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-center text-lg py-4">Log in</Button>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="primary" className="w-full justify-center text-lg py-4">Get Started</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* --- HERO SECTION --- */}
                <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-md">
                                <FiActivity className="animate-pulse" /> The AI Career Intelligence Platform
                            </div>
                            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                                Engineer your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 animate-gradient">
                                    career trajectory.
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
                                DevPilot analyzes your codebase, parses your resume against enterprise ATS algorithms, and provides actionable metrics to secure top-tier tech roles.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/signup">
                                    <Button variant="primary" size="lg" className="w-full sm:w-auto rounded-full gap-2 text-base">
                                        Start Analysis <FiArrowRight />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button variant="secondary" size="lg" className="w-full sm:w-auto rounded-full text-base">
                                        Explore Platform
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-900 flex items-center justify-center text-xs font-bold ${i === 1 ? 'text-blue-400' : i === 2 ? 'text-purple-400' : 'text-emerald-400'}`}>
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <span>Trusted by 10,000+ developers</span>
                            </div>
                        </motion.div>

                        {/* Hero Visual Mockup */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative animate-float"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl" />
                            <Card glass glow className="p-2 border-slate-200 shadow-2xl overflow-hidden relative z-10 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img src="/images/mnc_office.png" alt="Enterprise engineering team collaborating" className="rounded-xl w-full h-[400px] object-cover shadow-inner" />
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* --- FEATURES GRID --- */}
                <section id="features" className="py-32 relative z-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <SectionHeading
                            badge="Platform Capabilities"
                            title="Everything you need to"
                            titleHighlight="land the offer."
                            description="A comprehensive suite of tools designed to optimize every facet of your application process, from code quality to interview readiness."
                            className="mb-20"
                        />

                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[
                                { title: 'ATS Resume Parsing', icon: FiFileText, color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Reverse-engineer enterprise ATS algorithms. Map your keywords directly to job descriptions.' },
                                { title: 'GitHub Static Analysis', icon: FiGithub, color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'Get PR-style reviews on public repos. Identify code smells and architecture gaps instantly.' },
                                { title: 'AI Mock Interviews', icon: FiTerminal, color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Practice technical screens with our conversational AI trained on real FAANG interview data.' },
                                { title: 'Skill Matrix Analytics', icon: FiCodesandbox, color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Identify missing frameworks and technologies required for your target engineering roles.' },
                                { title: 'Action-Verb Rewriting', icon: FiZap, color: 'text-rose-400', bg: 'bg-rose-500/10', desc: 'Automatically rewrite weak bullet points into impactful, metrics-driven achievements.' },
                                { title: 'Job Matching Engine', icon: FiTarget, color: 'text-cyan-400', bg: 'bg-cyan-500/10', desc: 'Data-driven correlation to open market positions based on your verified Job Ready Score.' }
                            ].map((f, i) => (
                                <motion.div key={i} variants={fadeUp}>
                                    <Card glow glass className="h-full group hover:border-slate-700/50">
                                        <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <f.icon size={24} className={f.color} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* --- JOBS & OFFERS SECTION --- */}
                <section id="jobs" className="py-32 bg-slate-50 border-y border-slate-200 relative overflow-hidden">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-purple-500/5 blur-[150px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className="text-purple-400 text-sm font-bold tracking-widest uppercase mb-4">Smart Placement</div>
                            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6">Stop searching.<br />Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">matching.</span></h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Our recommendation engine cross-references your analyzed capabilities with live market data to surface high-probability job matches. Don't apply into the void.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {['Direct ATS integrations', 'Salary trajectory forecasting', 'Missing skill alerts for specific roles'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><FiCheck size={12} /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/jobs">
                                <Button variant="secondary" className="rounded-full gap-2">View Live Board <FiArrowRight /></Button>
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <div className="flex flex-col gap-4 relative">
                                {[
                                    { role: 'Senior Frontend Engineer', company: 'TechCorp Inc.', match: '94%', salary: '$140k - $180k', tags: ['React', 'TypeScript', 'Next.js'] },
                                    { role: 'Full Stack Developer', company: 'FinTech Global', match: '88%', salary: '$120k - $150k', tags: ['Node.js', 'PostgreSQL'], offset: 'ml-8' },
                                ].map((job, i) => (
                                    <Card key={i} glass className={`p-5 ${job.offset || ''} hover:-translate-y-1 transition-transform border-slate-200`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg">{job.role}</h4>
                                                <div className="text-slate-600 text-sm flex items-center gap-2 mt-1">
                                                    <FiBriefcase size={14} /> {job.company}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded text-xs">{job.match} Match</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {job.tags.map(tag => (
                                                <span key={tag} className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{tag}</span>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                                <div className="absolute -inset-4 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none z-10" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- TESTIMONIALS --- */}
                <section className="py-32 relative z-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <SectionHeading title="Built for developers by developers." className="mb-20" />

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { text: "The GitHub analysis told me exactly why my projects looked 'junior'. Refactored based on the feedback and landed a mid-level role in 3 weeks.", author: "Arjun P.", role: "Frontend Dev" },
                                { text: "ATS parsing is no joke. DevPilot highlighted that my resume was missing critical semantic keywords. Fixed it and interview rates tripled.", author: "Sneha R.", role: "Backend Engineer" },
                                { text: "The Job Ready Score gave me a concrete metric to track. It gamified my interview prep and gave me the confidence to apply to FAANG.", author: "Karan S.", role: "SDE II" }
                            ].map((t, i) => (
                                <Card key={i} glass className="flex flex-col border-slate-200">
                                    <div className="text-blue-400 mb-4 opacity-50">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed mb-8 flex-1">"{t.text}"</p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-sm">
                                            {t.author[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{t.author}</div>
                                            <div className="text-xs text-slate-500">{t.role}</div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- COMMUNITY IMAGE --- */}
                <section className="py-32 relative z-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionHeading
                                badge="Community"
                                title="Join thousands of"
                                titleHighlight="driven engineers."
                                description="DevPilot isn't just an AI. It's a community of ambitious students and professionals pushing each other to land the best roles in tech. Study, code, and succeed together."
                            />
                            <div className="mt-8 flex gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[var(--background)] bg-slate-100 flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-80" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="font-bold text-lg">10k+</span>
                                    <span className="text-slate-500 text-xs uppercase tracking-wider">Active Users</span>
                                </div>
                            </div>
                        </div>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                            <Card glass glow className="p-2 border-slate-200 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img src="/images/students_coding.png" alt="Students coding at night" className="rounded-xl w-full h-[400px] object-cover shadow-2xl" />
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* --- PRICING --- */}
                <section id="pricing" className="py-32 bg-slate-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <SectionHeading title="Simple, transparent pricing." description="Start analyzing for free. Upgrade when you need deep analytics and automated rewriting." className="mb-20" />

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Free Tier */}
                            <Card glass className="p-8 border-slate-200">
                                <h3 className="text-xl font-bold mb-2">Basic Access</h3>
                                <div className="text-slate-600 text-sm mb-6">Perfect for students starting out.</div>
                                <div className="text-5xl font-display font-extrabold mb-8">₹0<span className="text-lg text-slate-500 font-sans font-normal">/mo</span></div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-slate-700"><FiCheck className="text-blue-400" /> Basic Resume ATS Check</li>
                                    <li className="flex items-center gap-3 text-slate-700"><FiCheck className="text-blue-400" /> GitHub Repository Scan (1 Repo)</li>
                                    <li className="flex items-center gap-3 text-slate-700"><FiCheck className="text-blue-400" /> Limited Job Matches</li>
                                </ul>
                                <Link href="/signup">
                                    <Button variant="outline" className="w-full">Create Free Account</Button>
                                </Link>
                            </Card>

                            {/* Pro Tier */}
                            <Card gradientBorder glow className="p-8 relative">
                                <div className="absolute top-0 right-8 -translate-y-1/2">
                                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">Recommended</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pro License</h3>
                                <div className="text-slate-600 text-sm mb-6">For serious job seekers.</div>
                                <div className="text-5xl font-display font-extrabold mb-8">₹99<span className="text-lg text-slate-500 font-sans font-normal">/mo</span></div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-slate-900"><FiCheck className="text-blue-400" /> Deep Architectural GitHub Scans</li>
                                    <li className="flex items-center gap-3 text-slate-900"><FiCheck className="text-blue-400" /> Automated Resume Rewriting</li>
                                    <li className="flex items-center gap-3 text-slate-900"><FiCheck className="text-blue-400" /> Unlimited Mock Interviews</li>
                                    <li className="flex items-center gap-3 text-slate-900"><FiCheck className="text-blue-400" /> Priority Application Routing</li>
                                </ul>
                                <Link href="/signup">
                                    <Button variant="primary" className="w-full">Upgrade to Pro</Button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* --- CTA SECTION --- */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />

                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                        <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                            Ready to upgrade your career?
                        </h2>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                            Join thousands of developers who have cracked the code to securing high-paying tech roles.
                        </p>
                        <Link href="/signup">
                            <Button variant="primary" size="lg" className="rounded-full px-8 gap-2 text-lg shadow-xl shadow-blue-500/20">
                                Initialize Your Profile <FiArrowRight />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer className="border-t border-indigo-100 bg-indigo-50 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <FiZap size={14} className="text-slate-900" />
                            </div>
                            <span className="font-display text-lg font-bold text-slate-900">DevPilot AI</span>
                        </div>
                        <div className="flex gap-6">
                            {['Privacy Policy', 'Terms of Service', 'Security', 'Contact'].map((link) => (
                                <Link key={link} href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="text-center md:text-left text-xs text-slate-500 font-mono flex flex-col md:flex-row justify-between items-center">
                        <span>© {new Date().getFullYear()} DEVPILOT_AI // ALL RIGHTS RESERVED</span>
                        <span className="mt-2 md:mt-0">SYSTEM_STATUS: ONLINE</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

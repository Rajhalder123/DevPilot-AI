'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  FiZap, FiArrowRight, FiCheck,
  FiMenu, FiX, FiMapPin, FiPhone, FiMail
} from 'react-icons/fi';
import { FaPinterest, FaLinkedinIn, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';
import Marquee from 'react-fast-marquee';

/* ─── Animated Counter ─── */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { count, ref };
}

/* ─── Data ─── */
const features = [
  { icon: '/images/earth-globe.svg', title: 'Resume Analyzer', desc: 'AI-powered resume scoring with ATS optimization, keyword gap analysis, and personalized improvement tips.' },
  { icon: '/images/exam.svg', title: 'GitHub Reviewer', desc: 'Deep-dive code quality analysis, architecture review, and actionable suggestions for your repositories.' },
  { icon: '/images/books.svg', title: 'Smart Job Matching', desc: 'Search real jobs from 6+ platforms with AI-powered matching based on your skills and experience.' },
  { icon: '/images/professor.svg', title: 'Interview Simulator', desc: 'Practice with AI interviewers using text or voice — get real-time feedback and scoring.' },
  { icon: '/images/blackboard.svg', title: 'Cover Letter Writer', desc: 'Generate compelling, personalized cover letters tailored to any job posting in seconds.' },
  { icon: '/images/mortarboard.svg', title: 'Skill Roadmap', desc: 'Get a personalized career roadmap with learning paths to reach your dream role.' },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Resumes Analyzed' },
  { value: 5000, suffix: '+', label: 'Interviews Conducted' },
  { value: 2500, suffix: '+', label: 'Students Helped' },
  { value: 95, suffix: '%', label: 'Satisfaction Rate' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at TCS', text: 'DevPilot AI bridged the gap between my tier-3 college education and the real IT industry. The mock interviews were a game-changer.', rating: 5 },
  { name: 'Arjun Patel', role: 'Self-taught Developer', text: 'Coming from a small village, I had no career guidance. The roadmap and GitHub analyzer gave me the exact steps to land my first remote dev job.', rating: 5 },
  { name: 'Sneha Reddy', role: 'Frontend Developer', text: 'The resume analyzer transformed my generic CV into a professional, ATS-friendly document. I got 3 MNC interview calls in a week!', rating: 5 },
];

const pricingPlans = [
  {
    name: 'Free', price: '₹0', period: '/forever', desc: 'Perfect for getting started',
    features: ['3 Resume Analyses / month', '1 GitHub Review / month', 'Basic Job Search', '2 Interview Sessions / month', 'Community Support'],
    cta: 'Get Started Free', img: '/images/course_1.jpg',
  },
  {
    name: 'Pro Student', price: '₹99', period: '/month', desc: 'Best value for students',
    features: ['Unlimited Resume Analyses', 'Unlimited GitHub Reviews', 'AI Job Matching + Alerts', 'Unlimited Interview Sessions', 'Cover Letter Generator', 'Voice Interview Mode', 'Priority Support'],
    cta: 'Start 7-Day Free Trial', popular: true, img: '/images/course_2.jpg',
  },
  {
    name: 'Pro Plus', price: '₹249', period: '/month', desc: 'For serious job seekers',
    features: ['Everything in Pro Student', 'Advanced AI Coaching', 'Custom Interview Topics', 'Resume Templates Library', 'LinkedIn Profile Review', '1-on-1 Chat Support'],
    cta: 'Start Free Trial', img: '/images/course_3.jpg',
  },
];

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: FaPinterest, href: '#' },
  { icon: FaLinkedinIn, href: '#' },
  { icon: FaInstagram, href: '#' },
  { icon: FaFacebookF, href: '#' },
  { icon: FaTwitter, href: '#' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const slideInLeft = { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } };
const slideInRight = { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── Stat Card Component ─── */
function StatCard({ stat, i }: { stat: typeof stats[0], i: number }) {
  const { count, ref } = useCounter(stat.value);
  return (
    <motion.div ref={ref} initial="hidden" whileInView="visible" viewport={{ once: true }}
      variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: i * 0.1 } } }}
      style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.8rem', fontWeight: 800, color: '#3a3a3a', lineHeight: 1 }}>
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div style={{ color: '#a5a5a5', fontSize: 14, marginTop: 12, fontWeight: 500 }}>{stat.label}</div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden', background: '#FFFFFF' }}>

      {/* ═══════ HEADER ═══════ */}
      <header style={{
        position: 'fixed', top: scrolled ? 20 : 40, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)', maxWidth: 1200, height: 80,
        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)', zIndex: 100,
        display: 'flex', transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: scrolled ? '0px 10px 40px rgba(0,0,0,0.08)' : '0px 8px 32px rgba(0,0,0,0.04)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: 100,
      }}>
        {/* Left: Logo + Nav */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%', paddingLeft: 32 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <FiZap size={26} color="var(--primary)" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 900, color: '#3a3a3a', textTransform: 'uppercase' as const }}>
              DevPilot
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ marginLeft: 48, display: 'flex', gap: 8 }} className="nav-link-desktop">
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 14, textTransform: 'uppercase' as const,
                fontWeight: 600, color: '#3a3a3a', padding: '8px 16px', borderRadius: 100, transition: 'all 200ms ease', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,141,172,0.1)'; e.currentTarget.style.color = '#FF5C8A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3a3a3a'; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Modern Auth Buttons */}
        <div style={{
          height: '100%', display: 'flex', alignItems: 'center', gap: 16, paddingRight: 16,
        }} className="nav-link-desktop">
          <Link href="/login" style={{
            color: '#3a3a3a', fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '8px 16px',
            fontFamily: "'Outfit', sans-serif", transition: 'color 200ms'
          }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={e => (e.currentTarget.style.color = '#3a3a3a')}>
            Log In
          </Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
            Sign Up
          </Link>
        </div>

        {/* Hamburger button for mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 10 }}
          className="hamburger-btn"
        >
          {mobileMenuOpen ? <FiX size={24} color="#3a3a3a" /> : <FiMenu size={24} color="#3a3a3a" />}
        </button>
      </header>

      {/* ═══════ MOBILE MENU ═══════ */}
      <div style={{
        position: 'fixed', top: 0, right: mobileMenuOpen ? 0 : '-100vw', width: '80vw', maxWidth: 400,
        height: '100vh', background: '#FFFFFF', zIndex: 120, transition: 'all 0.5s ease',
        padding: '100px 40px 40px', boxShadow: mobileMenuOpen ? '-10px 0 40px rgba(0,0,0,0.1)' : 'none',
      }}>
        <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: 30, right: 30, background: 'none', border: 'none', cursor: 'pointer' }}>
          <FiX size={24} color="#3a3a3a" />
        </button>
        {navLinks.map(link => (
          <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700,
            color: '#3a3a3a', marginBottom: 16, textDecoration: 'none', transition: 'color 200ms ease',
          }}>
            {link.label}
          </Link>
        ))}
        <div style={{ marginTop: 40, display: 'flex', gap: 20 }}>
          <Link href="/login" className="btn-primary" style={{ padding: '12px 24px', textDecoration: 'none', textAlign: 'center' }}>Log In</Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '12px 24px', textDecoration: 'none', textAlign: 'center' }}>Sign Up</Link>
        </div>
        <div style={{ marginTop: 50, display: 'flex', gap: 24 }}>
          {socialLinks.map((s, i) => (
            <a key={i} href={s.href} style={{ color: '#3a3a3a', transition: 'color 200ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FF8DAC')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3a3a3a')}>
              <s.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* ═══════ HERO SECTION (EDU THEME) ═══════ */}
      <section className="edu-bg" id="home" style={{
        width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', paddingTop: 120,
      }}>
        <div style={{ maxWidth: 1200, width: '100%', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap', padding: '0 24px' }}>

          {/* Left Text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}
            style={{ flex: '1 1 400px', minWidth: 320, zIndex: 10 }}>

            <div style={{ display: 'flex', padding: '6px 16px', }}>

            </div>

            <h1 style={{ fontSize: 'clamp(3.5rem, 7vw, 84px)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, textShadow: '0 15px 45px rgba(0,0,0,0.4)', letterSpacing: '-2px' }}>
              Stop Dreaming.<br />
              <span style={{ color: 'var(--primary)' }}>Get Hired by MNCs.</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.25rem', marginTop: 24, lineHeight: 1.5, maxWidth: 520, fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              The AI career accelerator used by elite candidates to ace interviews, optimize profiles, and land global offers from top-tier firms.
            </p>

            <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="btn-primary"
                  style={{ padding: '16px 36px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 0 20px rgba(249,115,22,0.4)', borderRadius: 50 }}>
                  START BUILDING CAREER <FiArrowRight size={18} />
                </motion.button>
              </Link>

              {/* Social Proof Avatars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
                <div style={{ display: 'flex' }}>
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} style={{
                      width: 36, height: 36, borderRadius: '50%', background: `hsl(${num * 40}, 70%, 60%)`,
                      border: '2px solid #FFFFFF', marginLeft: num === 1 ? 0 : -12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold'
                    }}>
                      {String.fromCharCode(64 + num)}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', color: '#FFB74D', gap: 2, fontSize: 12 }}>
                    {'★★★★★'}
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500 }}>Join 12,000+ developers</span>
                </div>
              </div>
            </div>
          </motion.div>


        </div>

        {/* Marquee Logos */}
        <div style={{ width: '100%', marginTop: 'auto', padding: '40px 0', borderTop: '1px solid var(--border-color)', background: 'transparent' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 24, fontWeight: 800 }}>MNCs HIRE OUR BEST CANDIDATES</p>
          <Marquee gradient={false} speed={30} style={{ opacity: 0.8 }}>
            {['ACCENTURE', 'TCS', 'GOOGLE', 'INFOSYS', 'MICROSOFT', 'WIPRO', 'AMAZON', 'IBM', 'HCL', 'CAPGEMINI'].map((company, i) => (
              <div key={i} style={{
                margin: '0 50px', fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Outfit', sans-serif", letterSpacing: 4, transition: 'color 300ms'
              }}>
                {company}
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ═══════ HERO BOXES ═══════ */}
      <div style={{ width: '100%', position: 'relative', zIndex: 9, marginTop: -80 }}>
        <div style={{ maxWidth: 1170, margin: '0 auto', padding: '0 15px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0,
            borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)'
          }}>
            {[
              { icon: '/images/earth-globe.svg', title: 'AI Resume Analysis', link: '/dashboard/resume', linkText: 'analyze now' },
              { icon: '/images/books.svg', title: 'GitHub Code Review', link: '/dashboard/github', linkText: 'review code' },
              { icon: '/images/professor.svg', title: 'Interview Simulator', link: '/dashboard/interview', linkText: 'practice now' },
            ].map((box, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: i * 0.15 } } }}
                style={{
                  height: 161, background: 'var(--card)', display: 'flex', alignItems: 'center',
                  paddingLeft: 50, gap: 20, cursor: 'pointer', transition: 'all 200ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--card)')}
              >
                <img src={box.icon} alt="" style={{ width: 62, height: 62, filter: 'brightness(0)' }} />
                <div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>{box.title}</h2>
                  <Link href={box.link} style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', transition: 'color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--primary)')}
                  >
                    {box.linkText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ BENTO BOX FEATURES / SERVICES ═══════ */}
      <section id="features" style={{ padding: '100px 15px 80px', background: 'var(--background)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100, color: 'var(--primary)', fontSize: 13, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
              POWERFUL FEATURES
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 48px)', fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>Unlocking Your <span style={{ color: 'var(--primary)' }}>Career Potential</span></h1>
            <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>Everything you need to land your dream job, packaged in an intelligent AI-driven ecosystem.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.05} scale={1.02} style={{ height: '100%' }}>
                <motion.div variants={fadeUp} className="glass-panel" style={{
                  height: '100%', padding: '40px 32px', borderRadius: 24, textAlign: 'left', cursor: 'default',
                  background: 'var(--card)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                }}>
                  {/* Subtle Background Glow for each card */}
                  <div style={{ position: 'absolute', top: -50, right: -50, width: 100, height: 100, background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.15 }} />

                  <div style={{ marginBottom: 24, height: 64, width: 64, borderRadius: 16, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={f.icon} alt="" style={{ width: 32, height: 32, filter: 'brightness(0) invert(40%) sepia(85%) saturate(830%) hue-rotate(210deg)' }} />
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>{f.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, flex: 1 }}>{f.desc}</p>
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ REGISTER + SEARCH SPLIT ═══════ */}
      <section id="about" style={{ width: '100%', padding: '0 15px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)' }}>
          {/* Left: Register CTA */}
          <div style={{
            background: '#0F172A', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '80px 60px', textAlign: 'center',
            minHeight: 400,
          }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 36px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 20, lineHeight: 1.4 }}>
              Start your IT journey — <span style={{ fontSize: '120%' }}>Free</span> for students
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 2, maxWidth: 450, marginBottom: 30 }}>
              Join thousands of students who are already using DevPilot AI to analyze resumes, prepare for interviews, and land their dream jobs. No credit card required.
            </p>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} className="btn-primary"
                style={{ background: '#1a1a1a', padding: '15px 40px', fontSize: 14 }}>
                REGISTER NOW
              </motion.button>
            </Link>
          </div>

          {/* Right: Search / Feature Finder */}
          <div style={{
            position: 'relative', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '80px 60px', textAlign: 'center',
            minHeight: 400,
          }}>
            <div style={{
              position: 'absolute', inset: 0, backgroundImage: 'url(/images/search_background.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2,
            }} />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
              <h1 style={{ fontSize: 36, fontWeight: 700, color: '#3a3a3a', marginBottom: 30 }}>
                Find Your Perfect Tool
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Link href="/dashboard/resume" className="input" style={{ textAlign: 'left', padding: '14px 0', color: '#a5a5a5', borderBottom: '2px solid #e0e0e0', textDecoration: 'none', display: 'block' }}>
                  → Resume Analyzer
                </Link>
                <Link href="/dashboard/github" className="input" style={{ textAlign: 'left', padding: '14px 0', color: '#a5a5a5', borderBottom: '2px solid #e0e0e0', textDecoration: 'none', display: 'block' }}>
                  → GitHub Reviewer
                </Link>
                <Link href="/dashboard/interview" className="input" style={{ textAlign: 'left', padding: '14px 0', color: '#a5a5a5', borderBottom: '2px solid #e0e0e0', textDecoration: 'none', display: 'block' }}>
                  → Interview Simulator
                </Link>
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', padding: '15px 0', marginTop: 8 }}>
                    EXPLORE ALL TOOLS
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section style={{ padding: '80px 15px', background: 'var(--section-bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>

          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} i={i} />
          ))}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section style={{ position: 'relative', padding: '100px 15px', overflow: 'hidden' }}>
        {/* Parallax background */}
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: 'url(/images/testimonials_background.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(244, 247, 251, 0.9)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--foreground)' }}>What our students say</h1>
            <div style={{ width: 37, height: 6, background: 'var(--primary)', margin: '15px auto 0' }} />
          </motion.div>

          {/* Testimonial Slider */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, color: 'var(--primary)', fontFamily: 'Georgia, serif', lineHeight: 0.5, marginBottom: 30 }}>&ldquo;</div>
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 2, maxWidth: 600, margin: '0 auto 35px', minHeight: 96, transition: 'all 300ms' }}>
              {testimonials[activeTestimonial].text}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{
                width: 70, height: 70, borderRadius: '50%', background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 700, color: '#fff',
              }}>
                {testimonials[activeTestimonial].name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', textTransform: 'capitalize' as const }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)' }}>{testimonials[activeTestimonial].role}</div>
              </div>
            </div>
            {/* Dots */}
            <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 8 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                  width: i === activeTestimonial ? 24 : 10, height: 10, borderRadius: 5,
                  background: i === activeTestimonial ? 'var(--primary)' : 'rgba(15, 23, 42, 0.1)',
                  border: 'none', cursor: 'pointer', transition: 'all 300ms',
                }} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" style={{ padding: '100px 15px 80px', background: 'var(--background)' }}>
        <div style={{ maxWidth: 1170, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--foreground)' }}>Popular Plans</h1>
            <div style={{ width: 37, height: 6, background: 'var(--primary)', margin: '15px auto 0' }} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
            {pricingPlans.map((plan, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -8 }}
                style={{
                  background: 'var(--card)', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)',
                  transition: 'all 300ms', overflow: 'hidden', position: 'relative', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)'
                }}>
                {/* Card image */}
                <div style={{ width: '100%', height: 200, overflow: 'hidden' }}>
                  <img src={plan.img} alt={plan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Card body */}
                <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>{plan.desc}</p>
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--foreground)' }}>{plan.price}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 14 }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 24, padding: '0 8px' }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--foreground)' }}>
                        <FiCheck size={14} color="var(--primary)" style={{ flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Price box (footer) */}
                <div style={{
                  display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border-color)',
                  padding: '0 24px', height: 60,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                      {plan.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{plan.name}</span>
                  </div>
                  <Link href="/signup" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--primary)', width: 60, height: 60, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', transition: 'all 200ms',
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>GO</span>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ EVENTS / HOW IT WORKS ═══════ */}
      <section style={{ padding: '100px 15px 80px', background: 'var(--section-bg)' }}>
        <div style={{ maxWidth: 1170, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--foreground)' }}>How It Works</h1>
            <div style={{ width: 37, height: 6, background: 'var(--primary)', margin: '15px auto 0' }} />
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 30
          }}>
            {[
              {
                step: '01', title: 'Sign Up Free',
                desc: '“My journey started here.” Create your account in seconds. Zero fees, endless possibilities.',
                bullets: ['Instant account creation', 'Access to premium AI tools', 'Personalized tech dashboard'],
                img: '/images/event_1_new.png'
              },
              {
                step: '02', title: 'Upload & Analyze',
                desc: '“I finally saw what recruiters see.” Upload your resume or paste a GitHub link.',
                bullets: ['ATS Compatibility Scoring', 'Code Quality & Architecture Review', 'Actionable Improvement Tips'],
                img: '/images/event_2_new.png'
              },
              {
                step: '03', title: 'Practice Interviews',
                desc: '“I stopped freezing on technical questions.” Simulate real HR and coding interviews.',
                bullets: ['AI-driven Technical Rounds', 'Behavioral HR Questions', 'Real-time Confidence Feedback'],
                img: '/images/event_3_new.png'
              },
              {
                step: '04', title: 'Land Your Dream Job',
                desc: '“From a small town to a global team.” Just enter your tech stack and get matched with roles.',
                bullets: ['Precision International Matching', 'Salary Market Insights', 'Direct Profile Submissions'],
                img: '/images/event_4_new.png'
              },
            ].map((item, i) => (
              <motion.div key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                style={{
                  background: 'var(--card)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(15, 23, 42, 0.08)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                {/* Image Top */}
                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                  <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', top: 15, left: 15,
                    background: 'var(--primary)', color: '#fff',
                    width: 36, height: 36, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800,
                    boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)'
                  }}>
                    {item.step}
                  </div>
                </div>

                {/* Content Bottom */}
                <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>{item.desc}</p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {item.bullets.map((point, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--foreground)', fontWeight: 500 }}>
                        <FiCheck size={14} color="var(--primary)" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" style={{ background: 'var(--card)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1170, margin: '0 auto', padding: '0 15px' }}>

          {/* Newsletter */}
          <div style={{ padding: '80px 0 60px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--foreground)', marginBottom: 15 }}>Subscribe to newsletter</h1>
            <div style={{ width: 37, height: 6, background: 'var(--primary)', margin: '0 auto 40px' }} />
            <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input type="email" placeholder="Email Address" style={{
                flex: 1, minWidth: 250, padding: '0 24px', height: 56, background: 'var(--background)',
                border: '1px solid var(--border-color)', outline: 'none', fontSize: 14, fontWeight: 500, color: 'var(--foreground)', borderRadius: 100
              }} />
              <button className="btn-primary" style={{ height: 56, padding: '0 40px', borderRadius: 100 }}>SUBSCRIBE</button>
            </div>
          </div>

          {/* Footer columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 50 }}>
            {/* About */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <FiZap size={24} color="var(--primary)" />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 900, color: 'var(--foreground)', textTransform: 'uppercase' as const }}>DevPilot</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 2 }}>
                AI-powered career platform built for students and developers. Analyze resumes, review code, practice interviews, and find your dream job.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginBottom: 24, textTransform: 'uppercase' as const }}>Menu</h4>
              {['Home', 'About Us', 'Features', 'Pricing', 'Contact'].map(link => (
                <div key={link} style={{ marginBottom: 8 }}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} style={{ color: 'var(--muted)', fontSize: 14, transition: 'color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                    {link}
                  </a>
                </div>
              ))}
            </div>

            {/* Useful Links */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginBottom: 24, textTransform: 'uppercase' as const }}>Useful Links</h4>
              {['Dashboard', 'Resume Analyzer', 'GitHub Reviewer', 'Interview Prep', 'Job Matching'].map(link => (
                <div key={link} style={{ marginBottom: 8 }}>
                  <Link href={link === 'Dashboard' ? '/dashboard' : `/dashboard/${link.toLowerCase().replace(' ', '-').replace(' ', '-')}`}
                    style={{ color: 'var(--muted)', fontSize: 14, transition: 'color 200ms', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                    {link}
                  </Link>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginBottom: 24, textTransform: 'uppercase' as const }}>Contact</h4>
              {[
                { icon: FiMapPin, text: 'India, Remote First' },
                { icon: FiPhone, text: '+91 98765 43210' },
                { icon: FiMail, text: 'hello@devpilot.ai' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, color: 'var(--muted)', fontSize: 14 }}>
                  <item.icon size={16} color="var(--primary)" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Copyright bar */}
          <div style={{
            borderTop: '1px solid var(--border-color)', padding: '24px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              Copyright © {new Date().getFullYear()} DevPilot AI. Built with ❤️ for students who dream big.
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} style={{ color: 'var(--foreground)', transition: 'color 200ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground)')}>
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

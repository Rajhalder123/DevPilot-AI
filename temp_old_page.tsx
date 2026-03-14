'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  FiZap, FiFileText, FiGithub, FiBriefcase, FiMessageSquare,
  FiCode, FiArrowRight, FiCheck, FiStar, FiUsers, FiAward,
  FiTrendingUp, FiShield, FiCpu, FiTarget, FiUploadCloud,
  FiBarChart2, FiSmile, FiMenu, FiX, FiMapPin, FiPhone, FiMail
} from 'react-icons/fi';
import { FaPinterest, FaLinkedinIn, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

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
  { name: 'Priya Sharma', role: 'Final Year CSE Student', text: 'DevPilot AI helped me improve my resume score from 45 to 92. I got 3 interview calls within a week!', rating: 5 },
  { name: 'Arjun Patel', role: 'Self-taught Developer', text: 'The interview simulator is incredible. Practicing with AI gave me the confidence to ace my first tech interview.', rating: 5 },
  { name: 'Sneha Reddy', role: 'BCA Graduate', text: 'As a student with no money for career coaching, DevPilot AI was a lifesaver. The GitHub reviewer improved my projects significantly.', rating: 5 },
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
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

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
        position: 'fixed', top: scrolled ? 15 : 45, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 1318, height: 104, background: '#FFFFFF', zIndex: 100,
        display: 'flex', transition: 'all 200ms ease',
        boxShadow: scrolled ? '0px 20px 49px rgba(0,0,0,0.17)' : '0px 20px 49px rgba(0,0,0,0.07)',
      }}>
        {/* Left: Logo + Nav */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%', paddingLeft: 40 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <FiZap size={28} color="#ffb606" />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 26, fontWeight: 900, color: '#3a3a3a', textTransform: 'uppercase' as const }}>
              DevPilot
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ marginLeft: 'auto', paddingRight: 40, display: 'flex', gap: 0 }} className="nav-link-desktop">
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} style={{
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, textTransform: 'uppercase' as const,
                fontWeight: 700, color: '#3a3a3a', padding: '8px 20px', transition: 'color 200ms ease', textDecoration: 'none',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffb606')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3a3a3a')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Yellow CTA box */}
        <div style={{
          width: 279, height: '100%', background: '#ffb606',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }} className="nav-link-desktop">
          <Link href="/login" style={{ color: '#fff', fontWeight: 600, fontSize: 16, textDecoration: 'none', marginRight: 8 }}>Log In</Link>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
          <Link href="/signup" style={{ color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', marginLeft: 8 }}>Sign Up</Link>
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
            display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700,
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
              onMouseEnter={e => (e.currentTarget.style.color = '#ffb606')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3a3a3a')}>
              <s.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* ═══════ HERO SECTION ═══════ */}
      <section style={{
        width: '100%', height: '100vh', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: 'url(/images/slider_background.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900, padding: '0 24px' }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 72px)', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.2,
          }}>
            Launch Your <span style={{
              background: '#ffb606', paddingLeft: 13, paddingRight: 13, marginLeft: -4, marginRight: -4,
              display: 'inline', fontWeight: 700,
            }}>Developer Career</span> Today!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginTop: 24, lineHeight: 1.8, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            AI-powered resume analysis, GitHub reviews, interview prep, and job matching — built for students who dream big.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="btn-primary"
                style={{ padding: '18px 48px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                GET STARTED FREE <FiArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="#features" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary"
                style={{ padding: '18px 48px', fontSize: 16, borderColor: '#fff', color: '#fff' }}>
                EXPLORE FEATURES
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Slider nav decorations */}
        <div style={{
          position: 'absolute', left: '4%', top: '50%', transform: 'translateY(-50%)',
          width: 58, height: 58, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 200ms', zIndex: 2,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ffb606'; (e.currentTarget.querySelector('span') as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; (e.currentTarget.querySelector('span') as HTMLElement).style.color = '#121212'; }}
        >
          <span style={{ textTransform: 'uppercase' as const, fontSize: 12, fontWeight: 700, color: '#121212', transition: 'color 200ms' }}>prev</span>
        </div>
        <div style={{
          position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)',
          width: 58, height: 58, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 200ms', zIndex: 2,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ffb606'; (e.currentTarget.querySelector('span') as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; (e.currentTarget.querySelector('span') as HTMLElement).style.color = '#121212'; }}
        >
          <span style={{ textTransform: 'uppercase' as const, fontSize: 12, fontWeight: 700, color: '#121212', transition: 'color 200ms' }}>next</span>
        </div>
      </section>

      {/* ═══════ HERO BOXES ═══════ */}
      <div style={{ width: '100%', position: 'relative', zIndex: 9, marginTop: -80 }}>
        <div style={{ maxWidth: 1170, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0 }}>
            {[
              { icon: '/images/earth-globe.svg', title: 'AI Resume Analysis', link: '/dashboard/resume', linkText: 'analyze now' },
              { icon: '/images/books.svg', title: 'GitHub Code Review', link: '/dashboard/github', linkText: 'review code' },
              { icon: '/images/professor.svg', title: 'Interview Simulator', link: '/dashboard/interview', linkText: 'practice now' },
            ].map((box, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: i * 0.15 } } }}
                style={{
                  height: 161, background: '#1a1a1a', display: 'flex', alignItems: 'center',
                  paddingLeft: 50, gap: 20, cursor: 'pointer', transition: 'all 200ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#ffb606')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}
              >
                <img src={box.icon} alt="" style={{ width: 62, height: 62, filter: 'brightness(0) invert(1)' }} />
                <div>
                  <h2 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>{box.title}</h2>
                  <Link href={box.link} style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {box.linkText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ FEATURES / SERVICES ═══════ */}
      <section id="features" style={{ padding: '100px 15px 80px' }}>
        <div style={{ maxWidth: 1170, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#3a3a3a' }}>Our Services</h1>
            <div style={{ width: 37, height: 6, background: '#ffb606', margin: '15px auto 0' }} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 50 }}>
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} style={{ textAlign: 'left', cursor: 'default' }}>
                <div style={{ marginBottom: 20, height: 60, display: 'flex', alignItems: 'flex-end' }}>
                  <img src={f.icon} alt="" style={{ width: 50, height: 50 }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#3a3a3a', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: '#a5a5a5', fontSize: 14, lineHeight: 2.29 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ REGISTER + SEARCH SPLIT ═══════ */}
      <section id="about" style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Left: Register CTA */}
          <div style={{
            background: '#ffb606', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '80px 60px', textAlign: 'center',
            minHeight: 400,
          }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 36px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 20, lineHeight: 1.4 }}>
              Start your AI career journey — <span style={{ fontSize: '120%' }}>Free</span> for students
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
      <section style={{ padding: '80px 15px', background: '#f8f8f8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {stats.map((stat, i) => {
            const { count, ref } = useCounter(stat.value);
            return (
              <motion.div key={i} ref={ref} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: i * 0.1 } } }}
                style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '2.8rem', fontWeight: 800, color: '#3a3a3a', lineHeight: 1 }}>
                  {count.toLocaleString()}{stat.suffix}
                </div>
                <div style={{ color: '#a5a5a5', fontSize: 14, marginTop: 12, fontWeight: 500 }}>{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section style={{ position: 'relative', padding: '100px 15px', overflow: 'hidden' }}>
        {/* Parallax background */}
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: 'url(/images/testimonials_background.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#FFFFFF' }}>What our students say</h1>
            <div style={{ width: 37, height: 6, background: '#ffb606', margin: '15px auto 0' }} />
          </motion.div>

          {/* Testimonial Slider */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, color: '#ffb606', fontFamily: 'Georgia, serif', lineHeight: 0.5, marginBottom: 30 }}>&ldquo;</div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 2, maxWidth: 600, margin: '0 auto 35px', minHeight: 96, transition: 'all 300ms' }}>
              {testimonials[activeTestimonial].text}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{
                width: 70, height: 70, borderRadius: '50%', background: '#ffb606',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 700, color: '#fff',
              }}>
                {testimonials[activeTestimonial].name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', textTransform: 'capitalize' as const }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{testimonials[activeTestimonial].role}</div>
              </div>
            </div>
            {/* Dots */}
            <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 8 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                  width: i === activeTestimonial ? 24 : 10, height: 10, borderRadius: 5,
                  background: i === activeTestimonial ? '#ffb606' : 'rgba(255,255,255,0.3)',
                  border: 'none', cursor: 'pointer', transition: 'all 300ms',
                }} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" style={{ padding: '100px 15px 80px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1170, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#3a3a3a' }}>Popular Plans</h1>
            <div style={{ width: 37, height: 6, background: '#ffb606', margin: '15px auto 0' }} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
            {pricingPlans.map((plan, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -8 }}
                style={{
                  background: '#fff', boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                  transition: 'all 300ms', overflow: 'hidden', position: 'relative',
                }}>
                {/* Card image */}
                <div style={{ width: '100%', height: 200, overflow: 'hidden' }}>
                  <img src={plan.img} alt={plan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Card body */}
                <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#3a3a3a', marginBottom: 4 }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: '#a5a5a5', fontSize: 14, marginBottom: 16 }}>{plan.desc}</p>
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color: '#3a3a3a' }}>{plan.price}</span>
                    <span style={{ color: '#a5a5a5', fontSize: 14 }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 24, padding: '0 8px' }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#3a3a3a' }}>
                        <FiCheck size={14} color="#28a745" style={{ flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Price box (footer) */}
                <div style={{
                  display: 'flex', alignItems: 'center', borderTop: '1px solid #f0f0f0',
                  padding: '0 24px', height: 60,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffb606', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                      {plan.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, color: '#3a3a3a' }}>{plan.name}</span>
                  </div>
                  <Link href="/signup" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#ffb606', width: 60, height: 60, display: 'flex',
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
      <section style={{ padding: '100px 15px 80px', background: '#f8f8f8' }}>
        <div style={{ maxWidth: 1170, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#3a3a3a' }}>How It Works</h1>
            <div style={{ width: 37, height: 6, background: '#ffb606', margin: '15px auto 0' }} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your account in seconds. No credit card required. Start exploring all AI-powered tools right away.', img: '/images/event_1.jpg' },
              { step: '02', title: 'Upload & Analyze', desc: 'Upload your resume, paste a GitHub URL, or start an interview session. Our AI processes everything instantly.', img: '/images/event_2.jpg' },
              { step: '03', title: 'Land Your Dream Job', desc: 'Use AI insights to improve your profile, ace interviews, and get matched with perfect job opportunities.', img: '/images/event_3.jpg' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: i * 0.15 } } }}
                style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 0, background: '#FFFFFF', marginBottom: 30,
                  boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
                }}>
                {/* Left: Step badge + content */}
                <div style={{ display: 'flex', gap: 30, padding: '40px 40px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 70, height: 70, background: '#ffb606', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{item.step}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' as const }}>Step</div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: '#3a3a3a', marginBottom: 8, transition: 'color 200ms' }}>{item.title}</h3>
                    <p style={{ color: '#a5a5a5', fontSize: 14, lineHeight: 2 }}>{item.desc}</p>
                  </div>
                </div>
                {/* Right: Image */}
                <div style={{ overflow: 'hidden', minHeight: 180 }}>
                  <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" style={{ background: '#FFFFFF', borderTop: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: 1170, margin: '0 auto', padding: '0 15px' }}>

          {/* Newsletter */}
          <div style={{ padding: '80px 0 60px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#3a3a3a', marginBottom: 15 }}>Subscribe to newsletter</h1>
            <div style={{ width: 37, height: 6, background: '#ffb606', margin: '0 auto 40px' }} />
            <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input type="email" placeholder="Email Address" style={{
                flex: 1, minWidth: 250, padding: '0 20px', height: 56, background: '#f1f1f1',
                border: 'none', outline: 'none', fontSize: 14, fontWeight: 500, color: '#3a3a3a',
              }} />
              <button className="btn-primary" style={{ height: 56, padding: '0 40px' }}>SUBSCRIBE</button>
            </div>
          </div>

          {/* Footer columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 50 }}>
            {/* About */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <FiZap size={24} color="#ffb606" />
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 22, fontWeight: 900, color: '#3a3a3a', textTransform: 'uppercase' as const }}>DevPilot</span>
              </div>
              <p style={{ color: '#a5a5a5', fontSize: 14, lineHeight: 2 }}>
                AI-powered career platform built for students and developers. Analyze resumes, review code, practice interviews, and find your dream job.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#3a3a3a', marginBottom: 24, textTransform: 'uppercase' as const }}>Menu</h4>
              {['Home', 'About Us', 'Features', 'Pricing', 'Contact'].map(link => (
                <div key={link} style={{ marginBottom: 8 }}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} style={{ color: '#a5a5a5', fontSize: 14, transition: 'color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffb606')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#a5a5a5')}>
                    {link}
                  </a>
                </div>
              ))}
            </div>

            {/* Useful Links */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#3a3a3a', marginBottom: 24, textTransform: 'uppercase' as const }}>Useful Links</h4>
              {['Dashboard', 'Resume Analyzer', 'GitHub Reviewer', 'Interview Prep', 'Job Matching'].map(link => (
                <div key={link} style={{ marginBottom: 8 }}>
                  <Link href={link === 'Dashboard' ? '/dashboard' : `/dashboard/${link.toLowerCase().replace(' ', '-').replace(' ', '-')}`}
                    style={{ color: '#a5a5a5', fontSize: 14, transition: 'color 200ms', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffb606')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#a5a5a5')}>
                    {link}
                  </Link>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#3a3a3a', marginBottom: 24, textTransform: 'uppercase' as const }}>Contact</h4>
              {[
                { icon: FiMapPin, text: 'India, Remote First' },
                { icon: FiPhone, text: '+91 98765 43210' },
                { icon: FiMail, text: 'hello@devpilot.ai' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, color: '#a5a5a5', fontSize: 14 }}>
                  <item.icon size={16} color="#ffb606" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Copyright bar */}
          <div style={{
            borderTop: '1px solid #e8e8e8', padding: '24px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <span style={{ color: '#a5a5a5', fontSize: 13 }}>
              Copyright © {new Date().getFullYear()} DevPilot AI. Built with ❤️ for students who dream big.
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} style={{ color: '#3a3a3a', transition: 'color 200ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffb606')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3a3a3a')}>
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ RESPONSIVE STYLES ═══════ */}
      <style jsx global>{`
        @media (max-width: 1000px) {
          .nav-link-desktop { display: none !important; }
          .hamburger-btn { display: block !important; }
          header { width: calc(100% - 30px) !important; padding: 0 !important; }
        }
        @media (min-width: 1001px) {
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}

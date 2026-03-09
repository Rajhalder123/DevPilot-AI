'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiZap, FiFileText, FiGithub, FiBriefcase, FiMessageSquare, FiCode, FiArrowRight, FiCheck } from 'react-icons/fi';

const features = [
  { icon: FiFileText, title: 'Resume Analyzer', desc: 'AI-powered resume scoring, keyword gap analysis, and ATS optimization tips.', color: '#6c5ce7' },
  { icon: FiGithub, title: 'GitHub Analyzer', desc: 'Evaluate your repositories for code quality, architecture, and industry standards.', color: '#00d2ff' },
  { icon: FiBriefcase, title: 'Smart Job Matching', desc: 'Get personalized job recommendations based on your skills and experience.', color: '#00c853' },
  { icon: FiMessageSquare, title: 'Interview Simulator', desc: 'Practice with AI interviewers tailored to your target role and level.', color: '#ffc107' },
  { icon: FiCode, title: 'Cover Letter Generator', desc: 'Generate compelling, personalized cover letters for any job posting.', color: '#ff5252' },
  { icon: FiZap, title: 'Skill Roadmap', desc: 'Get a personalized learning path to reach your career goals.', color: '#6c5ce7' },
];

const pricingPlans = [
  { name: 'Free', price: '$0', period: '/month', features: ['3 Resume Analyses', '1 GitHub Review', 'Basic Job Matches', 'Community Support'], cta: 'Get Started' },
  { name: 'Pro', price: '$19', period: '/month', features: ['Unlimited Resume Analyses', 'Unlimited GitHub Reviews', 'AI Job Matching', 'Interview Simulator', 'Cover Letter Generator', 'Priority Support'], cta: 'Start Free Trial', popular: true },
  { name: 'Team', price: '$49', period: '/month', features: ['Everything in Pro', 'Team Dashboard', 'API Access', 'Custom Integrations', 'Dedicated Support', 'Analytics'], cta: 'Contact Sales' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        padding: '16px 0',
        background: 'rgba(11, 15, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiZap size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--foreground)' }}>
              DevPilot <span style={{ color: 'var(--accent)' }}>AI</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '10px 24px' }}>Log In</button>
            </Link>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '10px 24px' }}>Sign Up Free</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
      }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '20%', left: '10%', width: 400, height: 400,
            borderRadius: '50%', background: 'rgba(108, 92, 231, 0.08)', filter: 'blur(100px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '20%', right: '10%', width: 350, height: 350,
            borderRadius: '50%', background: 'rgba(0, 210, 255, 0.08)', filter: 'blur(100px)',
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(108, 92, 231, 0.1)', border: '1px solid rgba(108, 92, 231, 0.3)',
            borderRadius: 50, padding: '8px 20px', marginBottom: 32, fontSize: '0.85rem', color: 'var(--accent)',
          }}>
            <FiZap size={14} /> Powered by GPT-4o
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 24,
          }}>
            Your AI Career Copilot for{' '}
            <span className="gradient-text">Developer Success</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--muted)',
            lineHeight: 1.7,
            maxWidth: 600,
            margin: '0 auto 40px',
          }}>
            Analyze resumes, review GitHub repos, ace interviews, and land your dream job — all powered by cutting-edge AI.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ padding: '16px 36px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Get Started Free <FiArrowRight />
              </motion.button>
            </Link>
            <Link href="#features" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn-secondary"
                style={{ padding: '16px 36px', fontSize: '1.05rem' }}
              >
                See Features
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: '100px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, marginBottom: 16 }}>
            Everything You Need to{' '}
            <span className="gradient-text">Level Up</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
            Six powerful AI tools designed specifically for developers.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340, 1fr))',
          gap: 24,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: 32 }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${f.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <f.icon size={24} color={f.color} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)' }}>{f.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{
        padding: '100px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, marginBottom: 16 }}>
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Start free. Upgrade when you need more.</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          maxWidth: 1000,
          margin: '0 auto',
        }}>
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card"
              style={{
                padding: 36,
                position: 'relative',
                border: plan.popular ? '1px solid rgba(108, 92, 231, 0.5)' : undefined,
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gradient-primary)', padding: '4px 20px', borderRadius: 50,
                  fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                }}>MOST POPULAR</div>
              )}
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{plan.price}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--muted)' }}>
                    <FiCheck size={16} color="var(--success)" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button
                  className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', padding: '14px 0' }}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        padding: '40px 24px',
        color: 'var(--muted)',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <FiZap size={16} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--foreground)' }}>DevPilot AI</span>
        </div>
        <p>© {new Date().getFullYear()} DevPilot AI. Built with ❤️ for developers.</p>
      </footer>
    </div>
  );
}

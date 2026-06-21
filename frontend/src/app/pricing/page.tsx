'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheck, FiZap, FiArrowRight } from 'react-icons/fi';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: '/month',
        desc: 'Perfect for solo developers getting started.',
        features: ['50 AI queries/month', 'Code Generator', 'Bug Finder', 'Smart Chat', 'Basic templates'],
        cta: 'Current Plan',
        active: true,
        gradient: null,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$12',
        period: '/month',
        desc: 'For developers who want unlimited AI power.',
        features: ['Unlimited AI queries', 'All AI Tools', 'Priority AI responses', 'API access', 'Advanced templates', 'File upload & analysis', 'Voice input'],
        cta: 'Upgrade to Pro',
        active: false,
        gradient: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
        badge: 'Most Popular',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        desc: 'For teams and organizations with custom needs.',
        features: ['Everything in Pro', 'Team workspace', 'Custom AI training', 'SSO & SAML', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
        cta: 'Contact Sales',
        active: false,
        gradient: null,
    },
];

export default function PricingPage() {
    const [annual, setAnnual] = useState(false);

    return (
        <div style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    <FiZap size={11} /> Simple Pricing
                </div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', color: '#fff', marginBottom: 12, fontFamily: 'var(--font-outfit)' }}>
                    Choose your plan
                </h1>
                <p style={{ color: '#71717A', fontSize: '1rem', marginBottom: 24 }}>Start free. Scale as you grow. Cancel anytime.</p>

                {/* Annual toggle */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '6px 8px' }}>
                    <button onClick={() => setAnnual(false)}
                        style={{ padding: '7px 18px', borderRadius: 100, border: 'none', background: !annual ? '#fff' : 'transparent', color: !annual ? '#050505' : '#71717A', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        Monthly
                    </button>
                    <button onClick={() => setAnnual(true)}
                        style={{ padding: '7px 18px', borderRadius: 100, border: 'none', background: annual ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'transparent', color: annual ? '#fff' : '#71717A', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                        Annual <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '1px 6px', borderRadius: 4, fontSize: '0.7rem' }}>-20%</span>
                    </button>
                </div>
            </div>

            {/* Plans */}
            <div className="dp-grid-3">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            background: plan.badge ? 'rgba(124,58,237,0.06)' : '#111',
                            border: plan.badge ? '2px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 20,
                            padding: '28px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {plan.badge && (
                            <div style={{ position: 'absolute', top: 18, right: 18, padding: '4px 12px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', borderRadius: 100, fontSize: '0.7rem', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>
                                {plan.badge}
                            </div>
                        )}

                        <div style={{ marginBottom: 20 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: plan.badge ? '#A78BFA' : '#fff', marginBottom: 6 }}>{plan.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px', fontFamily: 'var(--font-outfit)' }}>
                                    {annual && plan.price !== '$0' && plan.price !== 'Custom' ? `$${Math.round(parseInt(plan.price.slice(1)) * 12 * 0.8)}` : plan.price}
                                </span>
                                <span style={{ fontSize: '0.88rem', color: '#71717A' }}>{annual && plan.period === '/month' ? '/year' : plan.period}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#71717A', lineHeight: 1.6 }}>{plan.desc}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                            {plan.features.map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: plan.badge ? 'rgba(124,58,237,0.15)' : 'rgba(16,185,129,0.1)', border: `1px solid ${plan.badge ? 'rgba(124,58,237,0.3)' : 'rgba(16,185,129,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FiCheck size={10} color={plan.badge ? '#A78BFA' : '#10B981'} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: '#A1A1AA' }}>{f}</span>
                                </div>
                            ))}
                        </div>

                        <Link href={plan.id === 'enterprise' ? '/contact' : plan.active ? '#' : '/signup'} style={{ textDecoration: 'none', display: 'block' }}>
                            <motion.button
                                whileHover={!plan.active ? { scale: 1.02 } : {}}
                                whileTap={!plan.active ? { scale: 0.97 } : {}}
                                style={{ width: '100%', padding: '13px', background: plan.active ? 'rgba(255,255,255,0.05)' : plan.gradient || 'rgba(255,255,255,0.08)', border: plan.active ? '1px solid rgba(255,255,255,0.08)' : 'none', borderRadius: 12, color: plan.active ? '#71717A' : '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: plan.active ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            >
                                {plan.cta} {!plan.active && <FiArrowRight size={15} />}
                            </motion.button>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Bottom note */}
            <p style={{ textAlign: 'center', marginTop: 40, fontSize: '0.85rem', color: '#3F3F46' }}>
                All plans include SSL, 99.9% uptime SLA, and data privacy compliance.
            </p>
        </div>
    );
}

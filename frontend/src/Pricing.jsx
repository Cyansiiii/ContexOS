import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderBeam } from "@/components/ui/border-beam"
import './Pricing.css';

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.34, 1.3, 0.64, 1] }
        }
    };

    const popularCardVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: {
            opacity: 1,
            y: -12,
            transition: { duration: 0.6, ease: [0.34, 1.3, 0.64, 1] }
        },
        hover: {
            y: -18,
            boxShadow: "0 0 0 1px rgba(124,58,237,0.4), 0 40px 100px rgba(124,58,237,0.35)",
            transition: { duration: 0.3 }
        }
    };

    const normalCardHover = {
        hover: {
            y: -6,
            boxShadow: "0 24px 64px rgba(0,0,0,0.10)",
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const priceVariants = {
        initial: { opacity: 0, y: -6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 6 }
    };

    const CheckIcon = () => (
        <span className="feature-check">
            <svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
    );

    const CrossIcon = () => (
        <span className="feature-x">
            <svg viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </span>
    );

    const handleSelect = (plan) => {
        setSelectedPlan(plan);
        setTimeout(() => setSelectedPlan(null), 2000);
    };

    return (
        <section className="pricing-section relative z-20" id="pricing">
            {/* ── HEADER ── */}
            <div className="pricing-header">
                <div className="pricing-chip">
                    <svg width="8" height="8" viewBox="0 0 8 8" className="mr-1.5"><circle cx="4" cy="4" r="4" fill="#7c3aed" /></svg>
                    Pricing
                </div>
                <h2 className="pricing-title">Simple pricing.<br /><em>Powerful memory.</em></h2>
                <p className="pricing-sub">Start free, scale as your company&apos;s knowledge grows. Every plan runs 100% on-device — no cloud bills, ever.</p>
            </div>

            {/* ── BILLING TOGGLE ── */}
            <div className="toggle-wrap">
                <span className={`toggle-label ${!isYearly ? 'active' : ''}`} onClick={() => setIsYearly(false)}>Monthly</span>
                <button
                    className={`toggle-switch ${isYearly ? 'yearly' : ''}`}
                    onClick={() => setIsYearly(!isYearly)}
                    aria-label="Toggle billing period"
                ></button>
                <span className={`toggle-label ${isYearly ? 'active' : ''}`} onClick={() => setIsYearly(true)}>
                    Yearly <span className="save-badge">Save 25%</span>
                </span>
            </div>

            {/* ── CARDS ── */}
            <motion.div
                className="pricing-cards-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >

                {/* STARTER */}
                <motion.div
                    className="plan-card starter-card group overflow-hidden"
                    variants={cardVariants}
                    whileHover="hover"
                    {...normalCardHover}
                >
                    <BorderBeam duration={8} size={200} className="from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="plan-icon starter">🌱</div>
                    <div className="plan-name">Starter</div>
                    <div className="plan-desc">Perfect for freelancers and solo founders capturing personal work knowledge.</div>

                    <div className="price-block">
                        <div className="price-amount" style={{ minHeight: '48px', alignItems: 'center' }}>
                            <span className="price-currency">₹</span>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={isYearly ? 'y' : 'm'}
                                    variants={priceVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.2 }}
                                >
                                    {isYearly ? '3,749' : '4,999'}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <div className="price-period">per month · up to 15 users</div>
                        <AnimatePresence>
                            {isYearly && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="price-saving"
                                >
                                    You save ₹15,000/yr
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="card-divider"></div>

                    <ul className="features-list">
                        <li><CheckIcon /> Up to <strong>5,000 memories</strong> stored</li>
                        <li><CheckIcon /> Gmail + Google Drive sync</li>
                        <li><CheckIcon /> Basic Decision DNA</li>
                        <li><CheckIcon /> AMD Ryzen AI — on-device only</li>
                        <li><CheckIcon /> Community support</li>
                        <li><CrossIcon /> <span style={{ opacity: .45 }}>Slack integration</span></li>
                        <li><CrossIcon /> <span style={{ opacity: .45 }}>Onboarding Co-Pilot</span></li>
                    </ul>

                    <button
                        className="plan-cta outline mt-auto"
                        onClick={() => handleSelect('starter')}
                    >
                        {selectedPlan === 'starter' ? '✓ Selected!' : 'Get started free \u2192'}
                    </button>
                    <div className="users-tag">
                        <div className="users-avatars">
                            <div className="user-dot" style={{ background: '#a78bfa' }}>A</div>
                            <div className="user-dot" style={{ background: '#34d399' }}>B</div>
                            <div className="user-dot" style={{ background: '#fb923c' }}>C</div>
                        </div>
                        Up to 15 team members
                    </div>
                </motion.div>


                {/* GROWTH (POPULAR) */}
                <motion.div
                    className="plan-card popular group overflow-hidden"
                    variants={popularCardVariants}
                    whileHover="hover"
                >
                    <BorderBeam duration={8} size={300} reverse className="from-transparent via-purple-500 to-transparent" />
                    <div className="plan-badge">⚡ Most Popular</div>
                    <div className="plan-icon growth">🧠</div>
                    <div className="plan-name">Growth</div>
                    <div className="plan-desc">For growing teams that need shared memory, auto-capture, and smart onboarding.</div>

                    <div className="price-block">
                        <div className="price-amount" style={{ minHeight: '48px', alignItems: 'center' }}>
                            <span className="price-currency">₹</span>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={isYearly ? 'y' : 'm'}
                                    variants={priceVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.2 }}
                                >
                                    {isYearly ? '14,999' : '19,999'}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <div className="price-period">per month · up to 100 users</div>
                        <AnimatePresence>
                            {isYearly && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="price-saving"
                                >
                                    You save ₹60,000/yr
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="card-divider"></div>

                    <ul className="features-list">
                        <li><CheckIcon /> <strong>Unlimited memories</strong> stored</li>
                        <li><CheckIcon /> Gmail, Slack, Drive, Notion, Jira</li>
                        <li><CheckIcon /> Full Decision DNA + Expert Finder</li>
                        <li><CheckIcon /> Onboarding Co-Pilot (AI buddy)</li>
                        <li><CheckIcon /> AMD Ryzen AI NPU — full acceleration</li>
                        <li><CheckIcon /> DPDP Act 2023 compliance report</li>
                        <li><CheckIcon /> Priority email support</li>
                    </ul>

                    <button
                        className="plan-cta filled mt-auto"
                        onClick={() => handleSelect('growth')}
                        style={selectedPlan === 'growth' ? { background: 'linear-gradient(135deg,#059669,#10b981)' } : {}}
                    >
                        {selectedPlan === 'growth' ? '✓ Selected!' : 'Start 14-day free trial \u2192'}
                    </button>
                    <div className="users-tag">
                        <div className="users-avatars">
                            <div className="user-dot" style={{ background: '#a78bfa' }}>A</div>
                            <div className="user-dot" style={{ background: '#34d399' }}>B</div>
                            <div className="user-dot" style={{ background: '#fb923c' }}>C</div>
                            <div className="user-dot" style={{ background: '#60a5fa' }}>+</div>
                        </div>
                        Up to 100 team members
                    </div>
                </motion.div>

                {/* ENTERPRISE */}
                <motion.div
                    className="plan-card enterprise-card group overflow-hidden"
                    variants={cardVariants}
                    whileHover="hover"
                    {...normalCardHover}
                >
                    <BorderBeam duration={8} size={200} className="from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="plan-icon enterprise">🏢</div>
                    <div className="plan-name">Enterprise</div>
                    <div className="plan-desc">For large organisations needing total control, custom SLAs, and hardware bundles.</div>

                    <div className="price-block">
                        <div className="price-amount" style={{ fontSize: '42px', minHeight: '48px', alignItems: 'center' }}>Custom</div>
                        <div className="price-period">Contact us for a quote · unlimited users</div>
                    </div>

                    <div className="enterprise-highlight">
                        <span>🤝</span>
                        <span>Includes AMD Ryzen AI hardware bundle + dedicated onboarding engineer</span>
                    </div>

                    <div className="card-divider"></div>

                    <ul className="features-list">
                        <li><CheckIcon /> Everything in Growth</li>
                        <li><CheckIcon /> Dedicated AMD hardware bundle</li>
                        <li><CheckIcon /> SSO + Active Directory + RBAC</li>
                        <li><CheckIcon /> 99.9% SLA + 24/7 dedicated support</li>
                        <li><CheckIcon /> Custom integrations (SAP, Salesforce)</li>
                        <li><CheckIcon /> On-site implementation + training</li>
                        <li><CheckIcon /> Audit logs + compliance dashboard</li>
                    </ul>

                    <button
                        className="plan-cta outline mt-auto"
                        onClick={() => handleSelect('enterprise')}
                    >
                        {selectedPlan === 'enterprise' ? 'Connecting...' : 'Talk to sales \u2192'}
                    </button>
                    <div className="users-tag">Unlimited team members · custom SLA</div>
                </motion.div>

            </motion.div>

            {/* ── BOTTOM TRUST STRIP ── */}
            <motion.div
                className="bottom-strip"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <div className="trust-item">
                    <div className="trust-icon">🔒</div>
                    100% On-Device — Your data never leaves your machine
                </div>
                <div className="trust-item">
                    <div className="trust-icon">🇮🇳</div>
                    DPDP Act 2023 compliant by design
                </div>
                <div className="trust-item">
                    <div className="trust-icon">💳</div>
                    No credit card for free trial
                </div>
                <div className="amd-badge">
                    <svg width="16" height="10" viewBox="0 0 32 20" fill="none">
                        <rect width="32" height="20" rx="3" fill="white" opacity=".15" />
                        <text x="4" y="14" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial">AMD</text>
                    </svg>
                    Powered by AMD Ryzen AI
                </div>
            </motion.div>
        </section>
    );
}

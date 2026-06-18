import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import ParticleBackground from '../components/ui/ParticleBackground';

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger = (s = 0.1) => ({ hidden: {}, show: { transition: { staggerChildren: s } } });

function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

const VALUES = [
  {
    icon: 'balance',
    title: 'Honesty over hype',
    desc: "We'll tell you if your asking price is unrealistic. We'll tell a buyer if a business isn't what they think it is. Short-term discomfort beats a deal that collapses or worse, one that completes badly.",
  },
  {
    icon: 'lock',
    title: 'Privacy, always',
    desc: "Selling a business is sensitive. Staff don't always know. Competitors are watching. We take confidentiality seriously at every stage, for both sides.",
  },
  {
    icon: 'location_on',
    title: 'Local first',
    desc: "We know Abu Dhabi. We know what a Mussafah workshop trades at versus a Khalidiyah service business. We know how DED licensing works and what landlords typically require. That context matters when you're making a six-figure decision.",
  },
  {
    icon: 'task_alt',
    title: 'We see it through',
    desc: "Our job isn't done when a listing goes live or when an offer is accepted. We stay involved until the deal is closed and both parties are happy. That's just how we work.",
  },
];

const EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ras Al Khaimah', 'Ajman', 'Fujairah', 'Al Ain',
];

export default function AboutPage() {
  return (
    <div className="bg-background">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-primary-container">
        <ParticleBackground className="opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-container/80" />
        <div className="max-w-site mx-auto px-5 md:px-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-gold-leaf text-label-sm uppercase tracking-[0.2em] font-bold mb-4">About SellMyBusiness.ae</p>
              <h1 className="text-4xl md:text-display-lg font-bold text-white mb-6 leading-[1.1]">
                We Built This Because We Knew It Was Needed
              </h1>
              <p className="text-on-primary-container text-body-lg leading-relaxed">
                SellMyBusiness.ae is a UAE based business marketplace run by people who have spent years buying, selling, and brokering businesses in this region. We're not a global platform with a UAE filter this is all we do, and we do it properly.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Businesses Listed', icon: 'storefront' },
                { value: '7', label: 'Emirates Covered', icon: 'location_on' },
                { value: 'Free', label: 'For All Buyers', icon: 'verified' },
                { value: '24–48h', label: 'Listing Review', icon: 'schedule' },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex flex-col gap-3">
                  <span className="material-symbols-outlined text-gold-leaf text-[22px]">{stat.icon}</span>
                  <div>
                    <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
                    <p className="text-[13px] text-on-primary-container/70 mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-24">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Section>
              <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-4">Our Story</p>
              <h2 className="text-2xl md:text-headline-lg font-bold mb-8">
                Honest answer: we built SellMyBusiness.ae out of frustration.
              </h2>
              <div className="space-y-5 text-on-surface-variant text-body-lg leading-relaxed">
                <p>
                  After years of working in the UAE business landscape across brokerage, real estate, and commercial operations the same problems kept coming up. Sellers couldn't find serious buyers. Buyers couldn't find listings with honest numbers. Deals fell apart because nobody was managing the process properly. And everyone was paying fees to platforms that didn't understand the local market.
                </p>
                <p>
                  We decided to build something better.
                </p>
                <p>
                  SellMyBusiness.ae isn't trying to be everything to everyone. We focus on the UAE, we maintain quality over volume, and we stay involved in transactions rather than just listing and disappearing. It's a simple model but it's one that actually works for the people using it.
                </p>
              </div>
            </Section>

            <Section className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden" style={{ minHeight: '480px' }}>
                <img
                  src="https://cdn.pixabay.com/photo/2023/03/09/20/41/ai-generated-7840859_640.jpg"
                  alt="Our story"
                  className="w-full h-full object-cover"
                  style={{ minHeight: '480px' }}
                />
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <Section className="text-center mb-14">
            <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-3">What We Stand For</p>
            <h2 className="text-2xl md:text-headline-lg font-bold">A few things we won't compromise on</h2>
          </Section>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(0.1)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <motion.div key={v.title} variants={fadeUp}
                className="bg-white p-8 rounded-2xl border border-surface-variant/20"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-xl bg-investment-blue/10 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-investment-blue text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
                </div>
                <h3 className="font-bold text-[17px] text-primary mb-3">{v.title}</h3>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Section>
              <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-4">The Team</p>
              <h2 className="text-2xl md:text-headline-lg font-bold mb-6">Who's Behind SellMyBusiness.ae</h2>
              <p className="text-on-surface-variant text-body-lg leading-relaxed mb-6">
                Between us, our team has managed businesses, structured commercial transactions, and navigated UAE trade licensing for many years. We've been on both sides of the table as buyers and sellers which means we understand the experience from the inside.
              </p>
              <p className="text-on-surface-variant text-body-md leading-relaxed">
                We're not consultants who've read about buying businesses. We've done it in this market, under UAE law, dealing with the same landlords, licensing offices, and banks that you will.
              </p>
            </Section>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.08)}
              className="grid grid-cols-2 gap-4">
              {[
                { label: 'Years in UAE market', value: '15+' },
                { label: 'Deals completed', value: '300+' },
                { label: 'Active buyers registered', value: '1,200+' },
                { label: 'Emirates covered', value: 'All 7' },
              ].map(stat => (
                <motion.div key={stat.label} variants={fadeUp}
                  className="bg-white p-6 rounded-2xl border border-surface-variant/20 text-center"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-[12px] text-on-surface-variant uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <div className="max-w-2xl mx-auto text-center">
            <Section>
              <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-4">Coverage</p>
              <h2 className="text-2xl md:text-headline-lg font-bold mb-6">Based in Abu Dhabi. Operating Across the UAE.</h2>
              <p className="text-on-surface-variant text-body-lg leading-relaxed mb-10">
                Abu Dhabi is home base. It's where the business started, where our network is deepest, and where we know the market best. But we actively list and support businesses across all seven emirates.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-10">
                {EMIRATES.map(e => (
                  <span key={e} className="px-5 py-2.5 bg-white border border-surface-variant/30 rounded-full text-[13px] font-semibold text-primary"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    {e}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <Section className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-headline-lg font-bold mb-4">Want to Have a Conversation?</h2>
            <p className="text-on-surface-variant text-body-lg mb-8">
              No pitch, no pressure. If you're thinking about buying or selling and want to talk it through with someone who knows this market, we're happy to chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-primary text-on-primary px-10 py-4 rounded-xl text-label-sm font-bold hover:scale-[1.02] transition-transform text-center">
                Get in Touch
              </Link>
              <Link to="/listings" className="border border-outline px-10 py-4 rounded-xl text-label-sm font-bold hover:bg-surface-container transition-colors text-center">
                Browse Listings
              </Link>
            </div>
          </Section>
        </div>
      </section>
    </div>
  );
}

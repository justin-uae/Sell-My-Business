import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import ParticleBackground from '../components/ui/ParticleBackground';

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger = (s = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: s } } });

function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

const FAQ_SECTIONS = [
  {
    heading: 'General',
    items: [
      { q: 'What exactly is SellMyBusiness.ae?', a: "We're a UAE-focused marketplace for buying and selling businesses. We list verified businesses for sale, connect buyers and sellers, and provide support throughout the transaction from valuation to handover." },
      { q: 'What industries do you cover?', a: 'All of them, really. Food and beverage, retail, services, health and beauty, construction, tech, education, hospitality, automotive if it\'s a legitimate UAE business, we can list it.' },
      { q: 'Do you cover all emirates or just Abu Dhabi?', a: "All seven emirates. We're headquartered in Abu Dhabi, but we list and support businesses across the entire country." },
    ],
  },
  {
    heading: 'For Buyers',
    items: [
      { q: 'How do I find businesses for sale?', a: "Use the search tool on our listings page you can filter by category, emirate, asking price, and revenue. You can also register as a buyer and we'll send you alerts when something matching your criteria comes up." },
      { q: 'Is there any charge for buyers?', a: 'No. Browsing, saving listings, and sending enquiries are all free.' },
      { q: "How do I know a listing is genuine?", a: "Our team reviews every listing before it goes live. We verify the seller and request basic supporting documentation. That said, we always encourage buyers to carry out their own due diligence." },
      { q: 'Can I get help from your team during the process?', a: "Yes, and it won't cost you anything extra. Our advisors can walk you through valuations, help you interpret financials, and support you through negotiation and the legal transfer." },
      { q: 'Can I buy a business in the UAE as a foreign national?', a: "In most cases, yes. UAE law now permits 100% foreign ownership across a wide range of business types. It depends on the sector and sometimes the emirate, so we'd recommend checking with a local legal advisor." },
    ],
  },
  {
    heading: 'For Sellers',
    items: [
      { q: 'How do I list my business?', a: 'Hit "List My Business" from any page, fill in the form, and we\'ll review and publish your listing within 24 to 48 hours.' },
      { q: 'What does it cost?', a: "A basic listing is free. We also have premium options with more visibility and hands-on brokerage support. Drop us a message and we'll explain what makes sense for your situation." },
      { q: 'Will anyone know my business is for sale?', a: 'Only the people you choose to tell. Your business name, location, and personal details stay off the listing. We share that information with buyers only after they\'ve signed a confidentiality agreement.' },
      { q: "I'm not sure what price to ask. Can you help?", a: "Yes and it's free. We offer a business valuation based on your revenue, overheads, assets, and what comparable businesses are selling for in the current market." },
      { q: 'How long before I find a buyer?', a: "It depends on the business, the price, and the sector. Most listings get their first genuine enquiry within one to two weeks. From offer to completed handover, expect anywhere from four weeks to three months." },
    ],
  },
  {
    heading: 'Legal & Process',
    items: [
      { q: 'How does a business transfer work in the UAE?', a: 'Generally, it involves updating the trade licence with the DED (or the relevant free zone authority), getting a No Objection Certificate from the landlord, and sometimes engaging a notary or legal counsel. We can connect you with experienced licensing consultants.' },
      { q: 'Can a non-UAE national buy a business here?', a: "Often, yes. The UAE has significantly opened up foreign ownership in recent years 100% ownership is now allowed in many sectors. It does vary by industry and emirate, so we'd always suggest getting advice from a qualified UAE legal advisor." },
      { q: 'Do you give legal or financial advice?', a: "We don't, and we're upfront about that. What we do is connect you with professionals who can accountants, lawyers, and licensing consultants we've worked with and trust." },
    ],
  },
];

function FaqSection({ section }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <h3 className="font-bold text-[15px] text-primary uppercase tracking-wider mb-4 pb-3 border-b border-surface-variant/40">
        {section.heading}
      </h3>
      <div className="space-y-2">
        {section.items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-surface-variant/20 overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-surface-container-low transition-colors"
            >
              <span className="font-semibold text-[14px] text-primary leading-snug">{item.q}</span>
              <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform duration-200" style={{ transform: open === i ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>
            {open === i && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }} className="px-5 pb-5">
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-background">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-10 md:pt-36 md:pb-16 overflow-hidden bg-primary-container">
        <ParticleBackground className="opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-container/80" />
        <div className="max-w-site mx-auto px-5 md:px-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-gold-leaf text-label-sm uppercase tracking-[0.2em] font-bold mb-3 md:mb-4">FAQ</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-display-lg font-bold text-white mb-3 md:mb-4 leading-tight">
                Questions We Get<br className="hidden md:block" /> Asked a Lot
              </h1>
              <p className="text-on-primary-container text-sm md:text-body-lg leading-relaxed">
                Answers to the most common questions from buyers and sellers. If you don't find what you're looking for, just reach out we're happy to help.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 mt-6 text-gold-leaf font-semibold text-[14px] hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Still have questions? Contact us
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:grid grid-cols-2 gap-3">
              {[
                { icon: 'storefront', label: 'All Industries', sub: 'Any UAE business sector' },
                { icon: 'verified', label: 'Verified Listings', sub: 'Reviewed before going live' },
                { icon: 'lock', label: 'Confidential', sub: 'Seller identity protected' },
                { icon: 'support_agent', label: 'Expert Support', sub: 'Advisors with local knowledge' },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/15">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-gold-leaf text-[18px]">{item.icon}</span>
                  </div>
                  <p className="font-bold text-[13px] text-white leading-tight">{item.label}</p>
                  <p className="text-[12px] text-white/55 mt-0.5">{item.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ GRID ── */}
      <section className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(0.1)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <motion.div variants={fadeUp} className="space-y-10">
              {FAQ_SECTIONS.slice(0, 2).map(section => (
                <FaqSection key={section.heading} section={section} />
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-10">
              {FAQ_SECTIONS.slice(2).map(section => (
                <FaqSection key={section.heading} section={section} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 md:py-16 bg-surface-container-low border-t border-surface-variant/20">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <Section className="text-center max-w-xl mx-auto">
            <h2 className="text-xl md:text-headline-lg font-bold mb-3">Didn't Find Your Answer?</h2>
            <p className="text-on-surface-variant text-sm md:text-body-lg mb-6 leading-relaxed">
              Our team is available Sunday to Thursday during business hours. Message us on WhatsApp or send an email and we'll get back to you quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/971" className="bg-success-green text-white px-6 py-3 rounded-xl text-label-sm font-bold hover:brightness-110 transition-all text-center">
                WhatsApp Us
              </a>
              <Link to="/contact" className="border border-outline px-6 py-3 rounded-xl text-label-sm font-bold hover:bg-surface-container transition-colors text-center">
                Contact Page
              </Link>
            </div>
          </Section>
        </div>
      </section>
    </div>
  );
}

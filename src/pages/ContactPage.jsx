import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import ParticleBackground from '../components/ui/ParticleBackground';

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Buyer', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-background">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-10 md:pt-36 md:pb-16 overflow-hidden bg-primary-container">
        <ParticleBackground className="opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-container/80" />
        <div className="max-w-site mx-auto px-5 md:px-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-gold-leaf text-label-sm uppercase tracking-[0.2em] font-bold mb-3 md:mb-4">Get in Touch</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-display-lg font-bold text-white mb-3 md:mb-4 leading-tight">
                We're Easy to Reach<br className="hidden md:block" /> and We Actually Reply
              </h1>
              <p className="text-on-primary-container text-sm md:text-body-lg leading-relaxed">
                Whether you have a quick question or want to talk through a potential listing or purchase in detail, reach out. We respond to every message during business hours, usually within a few hours.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex flex-col gap-3">
              {[
                { icon: 'schedule', label: 'Response Time', value: 'Within a few hours on business days' },
                { icon: 'lock', label: 'Fully Confidential', value: 'Your details are never shared without consent' },
                { icon: 'chat', label: 'WhatsApp Preferred', value: 'Message us for the fastest reply' },
                { icon: 'person_check', label: 'Real People', value: 'No bots you speak to our advisors directly' },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-gold-leaf text-[20px]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="font-semibold text-[13px] text-white leading-snug">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTACT GRID ── */}
      <section className="py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left info */}
            <Section className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-bold text-xl text-primary mb-6">Contact Details</h2>
                <div className="space-y-5">
                  {[
                    { icon: 'chat', label: 'WhatsApp / Phone', value: '+971 XX XXX XXXX', href: 'https://wa.me/971' },
                    { icon: 'mail', label: 'Email', value: 'hello@businessex.ae', href: 'mailto:hello@businessex.ae' },
                    { icon: 'location_on', label: 'Office', value: 'Abu Dhabi, UAE', href: null },
                    { icon: 'schedule', label: 'Hours', value: 'Sunday – Thursday, 9am – 6pm', href: null },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-investment-blue/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-investment-blue text-[20px]">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-outline uppercase tracking-wider mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="font-semibold text-[14px] text-primary hover:text-investment-blue transition-colors">{item.value}</a>
                        ) : (
                          <p className="font-semibold text-[14px] text-primary">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-investment-blue/5 border border-investment-blue/15 rounded-2xl p-6">
                <p className="font-bold text-[14px] text-primary mb-2">Prefer WhatsApp?</p>
                <p className="text-[13px] text-on-surface-variant mb-4 leading-relaxed">Most people reach us on WhatsApp for a faster response. Message us any time and we'll get back to you during business hours.</p>
                <a href="https://wa.me/971" className="inline-flex items-center gap-2 bg-success-green text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  WhatsApp Us
                </a>
              </div>
            </Section>

            {/* Right form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <Section className="text-center py-16 bg-white rounded-2xl border border-surface-variant/20" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div className="w-16 h-16 rounded-full bg-success-green/10 flex items-center justify-center mx-auto mb-5">
                    <span className="material-symbols-outlined text-success-green text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h3 className="font-bold text-xl text-primary mb-3">Message Sent</h3>
                  <p className="text-on-surface-variant text-[14px] leading-relaxed max-w-sm mx-auto">
                    We'll get back to you within a few hours. If it's urgent, WhatsApp us directly.
                  </p>
                </Section>
              ) : (
                <Section>
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-variant/20 p-8 space-y-5" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                    <h2 className="font-bold text-xl text-primary mb-6">Send a Message</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">Your Name *</label>
                        <input required value={form.name} onChange={e => set('name', e.target.value)}
                          className="form-input" placeholder="e.g. Mohammed Al Rashid" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">Email Address *</label>
                        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                          className="form-input" placeholder="you@email.com" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">Phone Number (WhatsApp preferred)</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)}
                        className="form-input" placeholder="+971 XX XXX XXXX" />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">I'm a</label>
                      <div className="flex flex-wrap gap-2">
                        {['Buyer', 'Seller', 'Just Exploring'].map(r => (
                          <button key={r} type="button" onClick={() => set('role', r)}
                            className={`px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-[12px] md:text-[13px] font-semibold border transition-all ${form.role === r ? 'bg-primary text-white border-primary' : 'border-surface-variant/40 text-on-surface-variant hover:border-primary/30'}`}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">Message *</label>
                      <textarea required value={form.message} onChange={e => set('message', e.target.value)}
                        className="form-input resize-none" rows={5}
                        placeholder="Tell us what you're looking for, or what you're looking to sell..." />
                    </div>

                    <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-label-sm hover:scale-[1.01] transition-transform shadow-md">
                      Send Message
                    </button>
                  </form>
                </Section>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

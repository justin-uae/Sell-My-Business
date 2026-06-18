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

const BASE_URL = import.meta.env.VITE_PHP_API_BASE || '';
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;
const PHONE = import.meta.env.VITE_CONTACT_PHONE;
const PHONE_DISPLAY = import.meta.env.VITE_CONTACT_PHONE_DISPLAY;

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Buyer', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to send message');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
                { icon: 'whatsapp', label: 'WhatsApp Preferred', value: 'Message us for the fastest reply' },
                { icon: 'person_check', label: 'Real People', value: 'No bots you speak to our advisors directly' },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    {item.icon === 'whatsapp' ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gold-leaf"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    ) : (
                      <span className="material-symbols-outlined text-gold-leaf text-[20px]">{item.icon}</span>
                    )}
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
                    { icon: 'whatsapp', label: 'WhatsApp / Phone', value: PHONE_DISPLAY, href: `https://wa.me/${PHONE}` },
                    { icon: 'mail', label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
                    { icon: 'location_on', label: 'Office', value: 'M Floor, Khalidiya Towers A, Khalidiya, Abu Dhabi', href: null },
                    { icon: 'schedule', label: 'Hours', value: 'Sunday – Thursday, 9am – 6pm', href: null },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-investment-blue/10 flex items-center justify-center flex-shrink-0">
                        {item.icon === 'whatsapp' ? (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-investment-blue"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        ) : (
                          <span className="material-symbols-outlined text-investment-blue text-[20px]">{item.icon}</span>
                        )}
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
                <a href="https://wa.me/971562229196" className="inline-flex items-center gap-2 bg-success-green text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:brightness-110 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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

                    {error && (
                      <div className="flex items-start gap-2 bg-error/10 border border-error/30 rounded-xl px-4 py-3 text-[13px] text-error">
                        <span className="material-symbols-outlined text-[18px] mt-px shrink-0">error</span>
                        {error}
                      </div>
                    )}

                    <button type="submit" disabled={submitting}
                      className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-label-sm hover:scale-[1.01] transition-transform shadow-md disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2">
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : 'Send Message'}
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

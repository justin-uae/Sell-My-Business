import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getAllProducts } from '../services/shopify';
import FeaturedCard from '../components/listings/FeaturedCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ThreeHeroBg from '../components/ui/ThreeHeroBg';
import ParticleBackground from '../components/ui/ParticleBackground';

const STATS = [
  { value: '500+', label: 'Live Listings' },
  { value: 'AED 2M+', label: 'In Business Value Listed' },
  { value: '300+', label: 'Deals Completed' },
  { value: 'UAE-Wide', label: 'Coverage Across All Emirates' },
];

const CATEGORIES = [
  { label: 'Restaurants & Cafés', icon: 'restaurant', to: '/listings?industry=F%26B' },
  { label: 'Retail & E-Commerce', icon: 'storefront', to: '/listings?industry=Retail' },
  { label: 'Health & Beauty', icon: 'spa', to: '/listings?industry=Health' },
  { label: 'Professional Services', icon: 'work', to: '/listings?industry=Services' },
  { label: 'Technology & IT', icon: 'devices', to: '/listings?industry=Technology' },
  { label: 'Construction', icon: 'construction', to: '/listings?industry=Construction' },
  { label: 'Education & Training', icon: 'school', to: '/listings?industry=Education' },
  { label: 'Hospitality & Tourism', icon: 'hotel', to: '/listings?industry=Hospitality' },
  { label: 'Automotive', icon: 'directions_car', to: '/listings?industry=Automotive' },
  { label: 'Manufacturing', icon: 'factory', to: '/listings?industry=Manufacturing' },
];

const BUYER_STEPS = [
  { icon: 'search', color: 'bg-investment-blue/10 text-investment-blue', title: 'Search with real filters', desc: 'Every listing includes the asking price, annual revenue, number of staff, and lease details. Filter by industry, location, and budget.' },
  { icon: 'handshake', color: 'bg-gold-leaf/10 text-gold-leaf', title: 'We make the introduction', desc: "When you find something worth pursuing, let us know. We'll verify your details and connect you with the seller, no cold calls, no awkward first contact." },
  { icon: 'analytics', color: 'bg-success-green/10 text-success-green', title: 'Take your time with due diligence', desc: "We don't rush you. Review the numbers, visit the business, ask every question you need. Our team is available throughout to help." },
  { icon: 'verified', color: 'bg-investment-blue/10 text-investment-blue', title: 'Close and move forward', desc: "Once you're happy, we'll support you through handover licensing, paperwork, and all the admin that comes with it." },
];

const SELLER_STEPS = [
  { icon: 'edit_note', color: 'bg-gold-leaf/10 text-gold-leaf', title: 'List it properly', desc: 'Most business listings online are terrible no numbers, blurry photos, no context. We help you create a listing that actually attracts serious buyers.' },
  { icon: 'group', color: 'bg-investment-blue/10 text-investment-blue', title: 'Get in front of the right people', desc: 'Your listing goes out to our network of active buyers people who are already searching, already have capital, and are ready to move.' },
  { icon: 'filter_alt', color: 'bg-success-green/10 text-success-green', title: 'We filter the noise for you', desc: "Not every enquiry is worth your time. We screen buyers before they reach you, so the people you speak to are genuinely interested." },
  { icon: 'task_alt', color: 'bg-investment-blue/10 text-investment-blue', title: 'Sell on your terms', desc: "We don't pressure you into a deal that doesn't feel right. Our job is to find you the right buyer at the right price, then support you through handover." },
];

const TESTIMONIALS = [
  { quote: "I'd tried two other platforms before Sell My Business and got nowhere. Within ten days of listing here, I had a proper offer on the table. The team actually kept me updated which sounds basic but made a huge difference.", name: 'Sarah M.', role: 'Business Seller, Abu Dhabi' },
  { quote: "I didn't really know how to value a business or what to look for. The advisor I worked with was patient and honest he told me one business I was interested in was overpriced and explained why. That kind of advice is rare.", name: 'Khalid R.', role: 'First-Time Buyer, Dubai' },
  { quote: "The leads I get here are in a different league compared to other platforms. These are people with real money looking to make real investments.", name: 'Ahmed T.', role: 'Investor, Abu Dhabi' },
];

const WHY_US = [
  { icon: 'verified', text: 'Every listing is reviewed before it goes live we don\'t just accept anything.' },
  { icon: 'lock', text: 'Sellers stay anonymous until a buyer is properly qualified.' },
  { icon: 'location_on', text: 'We\'re UAE-specific, so everything we do is built around how business works here.' },
  { icon: 'payments', text: 'Buyers can browse and enquire for free no catches.' },
  { icon: 'schedule', text: 'Most listings get their first serious enquiry within a week.' },
  { icon: 'groups', text: 'Our team has actually bought, sold, and run businesses in the UAE.' },
];

// DEMO: sample listings for UI testing remove DEMO_FORCE below to re-enable Shopify
const DEMO_LISTINGS = [
  {
    handle: 'enterprise-fintech-platform',
    title: 'Enterprise Fintech Platform',
    industry: 'SaaS',
    location: 'Dubai, UAE',
    price: '$4.2M',
    revenue: '$1.8M',
    profit: '$620k',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  },
  {
    handle: 'prime-downtown-bistro',
    title: 'Prime Downtown Bistro',
    industry: 'F&B',
    location: 'Abu Dhabi, UAE',
    price: '$1.5M',
    revenue: '$950k',
    profit: '$280k',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
  {
    handle: 'regional-logistics-fleet',
    title: 'Regional Logistics Fleet',
    industry: 'Logistics',
    location: 'Sharjah, UAE',
    price: '$8.7M',
    revenue: '$12M',
    profit: '$2.1M',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
  },
  {
    handle: 'luxury-fashion-boutique',
    title: 'Luxury Fashion Boutique',
    industry: 'Retail',
    location: 'Dubai Mall, UAE',
    price: '$3.2M',
    revenue: '$4.8M',
    profit: '$890k',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
  },
  {
    handle: 'cloud-saas-platform',
    title: 'Cloud SaaS Platform',
    industry: 'Software',
    location: 'Dubai Internet City, UAE',
    price: '$6.5M',
    revenue: '$3.2M',
    profit: '$1.4M',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  },
  {
    handle: 'hotel-spa-resort',
    title: 'Hotel & Spa Resort',
    industry: 'Hospitality',
    location: 'Ras Al Khaimah, UAE',
    price: '$12M',
    revenue: '$8.6M',
    profit: '$2.8M',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  },
];
const DEMO_FORCE = true; // set false to fetch live Shopify data

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
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

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(!DEMO_FORCE);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('buyer');
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (DEMO_FORCE) return;
    getAllProducts(8)
      .then(({ products }) => setFeatured(products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector('[class*="snap-start"]');
      const cardWidth = card ? card.offsetWidth + 20 : 320;
      carouselRef.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/listings?q=${encodeURIComponent(search.trim())}` : '/listings');
  };

  return (
    <div className="bg-background">

      {/* ── HERO ── */}
      <header className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#060c14]">
          <ThreeHeroBg className="opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
        </div>

        <div className="max-w-site mx-auto px-5 md:px-20 relative z-[2] w-full">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20 mx-auto lg:mx-0"
                style={{ width: 'fit-content' }}
              >
                <span className="text-xs text-white/80 font-medium">Since 2020</span>
              </motion.div> */}

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.2] md:leading-[1.15] text-white"
              >
                Buy or Sell a Business in the UAE{' '}
                <span className="text-investment-blue block lg:inline">
                  Without the Headache
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed max-w-2xl lg:mx-0 mx-auto"
              >
                Sell My Business connects real buyers with real sellers across Abu Dhabi and the UAE.
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onSubmit={handleSearch}
                className="flex gap-2 mb-5 max-w-xl lg:mx-0 mx-auto"
              >
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search businesses for sale…"
                  className="flex-1 min-w-0 px-4 py-3 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-investment-blue outline-none text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="bg-investment-blue text-white px-5 py-3 rounded-xl font-semibold hover:bg-investment-blue/80 transition-colors whitespace-nowrap text-sm sm:text-base shrink-0"
                >
                  Search
                </button>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center lg:justify-start"
              >
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  Looking to sell? List your business
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Column - Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 lg:mt-0"
            >
              {[
                { value: "500+", label: "Active Listings" },
                { value: "AED 2.5B+", label: "Transaction Value" },
                { value: "48h", label: "Avg. Response Time" },
                { value: "95%", label: "Success Rate" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── FEATURED LISTINGS ── */}
      <section className="pt-4 px-6 pb-16 md:pt-20 md:pb-28">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(0.08)}
          className="max-w-site mx-auto px-5 md:px-20 mb-8">
          <div className="flex justify-between items-start">
            <motion.div variants={fadeUp}>
              <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-2">Active Listings</p>
              <h2 className="text-2xl md:text-headline-lg font-bold mb-1">Featured Businesses</h2>
              <p className="text-on-surface-variant text-body-md mb-4">Businesses worth looking at with the numbers to back them up.</p>
              <Link to="/listings" className="inline-flex md:hidden items-center gap-1.5 text-label-sm font-semibold text-investment-blue hover:underline transition-colors">
                View all listings <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="flex-shrink-0 flex flex-col items-end gap-3 ml-4">
              <Link to="/listings" className="hidden md:inline-flex items-center gap-1.5 text-label-sm font-semibold text-investment-blue hover:underline transition-colors">
                View all listings <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <div className="hidden md:flex gap-2">
                <button onClick={() => scroll(-1)} className="w-11 h-11 rounded-full border border-outline-variant/40 flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button onClick={() => scroll(1)} className="w-11 h-11 rounded-full border border-outline-variant/40 flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : (
          <div ref={carouselRef} className="flex items-start gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pl-5 md:pl-20 pr-5 md:pr-20" style={{ paddingBottom: '24px' }}>
            {(featured.length > 0 ? featured : DEMO_LISTINGS).map((item, i) => (
              <FeaturedCard key={item.id || item.title} product={featured.length > 0 ? item : null} demo={featured.length > 0 ? null : item} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── INTRO ── */}
      <section className="py-12 md:py-20 bg-surface-container-lowest">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <Section>
              <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-4">Our Mission</p>
              <h2 className="text-2xl md:text-headline-lg font-bold mb-6 leading-snug">
                Buying or selling a business here shouldn't be this hard. We're fixing that.
              </h2>
              <p className="text-on-surface-variant text-sm md:text-body-lg leading-relaxed mb-4 md:mb-6">
                Anyone who's tried to buy or sell a business in the UAE knows the drill listings with zero financial detail, buyers who disappear after the first call, sellers who don't know what their business is actually worth. It's frustrating.
              </p>
              <p className="text-on-surface-variant text-sm md:text-body-lg leading-relaxed mb-6 md:mb-10">
                Sell My Business was built because that experience needed to change. We focus exclusively on the UAE market, which means we understand how businesses here actually operate, what buyers are genuinely looking for, and how to get deals across the line without months of back and forth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-start">
                <Link to="/about" className="inline-flex items-center gap-2 text-label-sm font-semibold text-investment-blue hover:underline">
                  Our story <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link to="/listings" className="inline-flex items-center gap-2 text-label-sm font-semibold text-on-surface-variant hover:text-primary">
                  Browse listings <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </section>



      {/* ── CATEGORIES ── */}
      <section className="py-12 md:py-20 bg-surface-container-low">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <Section className="text-center mb-6 md:mb-12">
            <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-3">Industries</p>
            <h2 className="text-xl md:text-headline-lg font-bold">What Are You Looking For?</h2>
          </Section>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(0.06)}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {CATEGORIES.map(cat => (
              <motion.div key={cat.label} variants={fadeUp}>
                <Link to={cat.to}
                  className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-surface-variant/20 hover:border-investment-blue/30 hover:shadow-md transition-all group text-center"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div className="w-12 h-12 rounded-xl bg-investment-blue/8 flex items-center justify-center group-hover:bg-investment-blue/15 transition-colors">
                    <span className="material-symbols-outlined text-investment-blue text-[22px]">{cat.icon}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-primary leading-tight">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <Section className="text-center">
            <Link to="/listings" className="inline-flex items-center gap-2 text-label-sm font-semibold text-investment-blue hover:underline">
              View All Categories <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </Section>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 md:py-20 bg-primary-container">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <Section className="text-center mb-6 md:mb-12">
            <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-3">Process</p>
            <h2 className="text-xl md:text-headline-lg font-bold mb-5 md:mb-8 text-white">How It Works</h2>
            <div className="inline-flex bg-white/10 rounded-2xl p-1 gap-1">
              <button onClick={() => setActiveTab('buyer')}
                className={`px-8 py-2.5 rounded-xl text-label-sm font-semibold transition-all ${activeTab === 'buyer' ? 'bg-white text-primary shadow-sm' : 'text-white/60 hover:text-white'}`}>
                For Buyers
              </button>
              <button onClick={() => setActiveTab('seller')}
                className={`px-8 py-2.5 rounded-xl text-label-sm font-semibold transition-all ${activeTab === 'seller' ? 'bg-white text-primary shadow-sm' : 'text-white/60 hover:text-white'}`}>
                For Sellers
              </button>
            </div>
          </Section>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="text-center mb-10">
              <h3 className="text-xl font-bold text-white">
                {activeTab === 'buyer' ? 'How Buying a Business Works on Sell My Business' : 'How Selling Your Business Works'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(activeTab === 'buyer' ? BUYER_STEPS : SELLER_STEPS).map((step, i) => (
                <div key={step.title} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-surface-variant/20 h-full" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                    <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-5`}>
                      <span className="material-symbols-outlined text-[22px]">{step.icon}</span>
                    </div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-widest mb-2">Step {i + 1}</div>
                    <h4 className="font-bold text-[15px] text-primary mb-3 leading-snug">{step.title}</h4>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                  {i < 3 && <div className="hidden lg:block absolute top-10 -right-3 w-6 h-[2px] bg-white/20" />}
                </div>
              ))}
            </div>
          </motion.div>

          <Section className="mt-10 text-center">
            <Link to={activeTab === 'buyer' ? '/listings' : '/sell'}
              className="inline-block bg-investment-blue text-white px-10 py-4 rounded-xl text-label-sm font-bold hover:scale-[1.02] transition-transform shadow-md">
              {activeTab === 'buyer' ? 'Browse Businesses' : 'List Your Business'}
            </Link>
          </Section>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-12 md:py-20 bg-surface-container-low">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <Section className="text-center mb-8 md:mb-14">
            <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-3">Social Proof</p>
            <h2 className="text-xl md:text-headline-lg font-bold">What People Say About Working With Us</h2>
          </Section>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(0.12)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-white p-8 rounded-2xl border border-surface-variant/20 flex flex-col"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="material-symbols-outlined text-gold-leaf text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-[14px] text-on-surface-variant leading-relaxed flex-1 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-variant/30">
                  <div className="w-10 h-10 rounded-full bg-investment-blue/10 flex items-center justify-center font-bold text-investment-blue text-label-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[13px] text-primary">{t.name}</p>
                    <p className="text-[12px] text-on-surface-variant">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY BUSINESSEX ── */}
      <section className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Section>
              <p className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold mb-4">Why Us</p>
              <h2 className="text-2xl md:text-headline-lg font-bold mb-6">Why Use Sell My Business?</h2>
              <p className="text-on-surface-variant text-body-md leading-relaxed mb-10">
                We're not a global platform with a UAE filter. We were built specifically for this market by people who have spent years in it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/listings" className="bg-primary text-on-primary px-8 py-3.5 rounded-xl text-label-sm font-bold hover:scale-[1.02] transition-transform text-center">
                  Browse Businesses
                </Link>
                <Link to="/about" className="border border-outline px-8 py-3.5 rounded-xl text-label-sm font-bold hover:bg-surface-container transition-colors text-center">
                  Our Story
                </Link>
              </div>
            </Section>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(0.08)}
              className="grid grid-cols-1 gap-4">
              {WHY_US.map((item, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-surface-variant/20"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl bg-success-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-success-green text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <p className="text-[14px] text-on-surface-variant leading-relaxed pt-2">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <Section className="mx-4 md:mx-8 mb-12 md:mb-20">
        <section className="py-20 bg-primary-container rounded-3xl relative overflow-hidden">
          <ParticleBackground className="opacity-25" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-investment-blue/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 text-center px-5 md:px-20 max-w-2xl mx-auto">
            <p className="text-gold-leaf text-label-xs uppercase tracking-[0.25em] font-bold mb-4">No Commitment. No Pressure.</p>
            <h2 className="text-2xl md:text-headline-lg font-bold text-white mb-4">Let's Get Started</h2>
            <p className="text-on-primary-container text-body-lg mb-8">
              Whether you're looking to buy or sell, the first step is the same just get in touch or browse what's available. There's no commitment, no pressure, and no fee to explore.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/listings" className="bg-white text-primary px-6 py-3 md:px-10 md:py-4 rounded-xl text-label-sm font-bold hover:brightness-105 transition-all active:scale-95 text-center">
                Browse Businesses
              </Link>
              <Link to="/sell" className="bg-gold-leaf text-on-secondary-fixed px-6 py-3 md:px-10 md:py-4 rounded-xl text-label-sm font-bold hover:brightness-110 transition-all active:scale-95 text-center">
                List My Business
              </Link>
            </div>
          </div>
        </section>
      </Section>
    </div>
  );
}

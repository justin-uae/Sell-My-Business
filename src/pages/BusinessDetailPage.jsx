import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductByHandle, getAllProducts } from '../services/shopify';
import ListingCard from '../components/listings/ListingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function formatCurrency(amount) {
  if (!amount) return '—';
  const n = parseFloat(amount);
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}k`;
  return `AED ${n.toLocaleString()}`;
}

export default function BusinessDetailPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      getProductByHandle(handle),
      getAllProducts(4),
    ])
      .then(([p, { products }]) => {
        if (!p) { setError('Listing not found'); return; }
        setProduct(p);
        setRelated(products.filter(r => r.handle !== handle).slice(0, 3));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [handle]);

  function buildWhatsAppUrl(type = 'contact') {
    const number = product?.whatsapp?.replace(/\D/g, '');
    if (!number) return null;
    const price = product.price ? formatCurrency(product.price) : 'N/A';
    const text = type === 'nda'
      ? `Hi, I'd like to request an NDA / information pack for:\n*${product.title}*\nAsking Price: ${price}\nListing: ${window.location.href}`
      : `Hi, I'm interested in purchasing:\n*${product.title}*\nIndustry: ${product.industry || 'N/A'}\nLocation: ${product.location || 'N/A'}\nAsking Price: ${price}\nListing: ${window.location.href}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-margin-mobile">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">business_center</span>
        <h2 className="text-headline-lg-mobile font-bold text-primary mb-2">{error || 'Listing not found'}</h2>
        <p className="text-on-surface-variant mb-6">This listing may no longer be available.</p>
        <Link to="/listings" className="bg-primary text-on-primary px-8 py-3 rounded-xl text-label-sm font-bold">
          Browse All Listings
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="bg-background pt-20">
      {/* Back */}
      <div className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-sm font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Listings
        </button>
      </div>

      {/* Hero Gallery */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop py-4"
      >
        {/* Main gallery row */}
        <div className="flex gap-3" style={{ height: '480px' }}>

          {/* Main image */}
          <div className="relative rounded-2xl overflow-hidden flex-1 min-w-0 group">
            {images[activeImage] ? (
              <img
                key={activeImage}
                src={images[activeImage].url}
                alt={images[activeImage].altText || product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline">business</span>
              </div>
            )}
            {/* Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
            {/* Overlay text — bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
              <div className="flex gap-2 mb-3 flex-wrap">
                {product.industry && (
                  <span className="bg-investment-blue/30 text-white border border-investment-blue/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {product.industry}
                  </span>
                )}
                {product.tags?.includes('premium') && (
                  <span className="bg-gold-leaf/30 text-white border border-gold-leaf/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Premium Listing
                  </span>
                )}
              </div>
              <h1 className="font-bold text-2xl md:text-3xl text-white leading-tight mb-2">{product.title}</h1>
              {product.location && (
                <p className="text-white/80 flex items-center gap-1.5 text-sm font-medium">
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                  {product.location}
                </p>
              )}
            </div>
          </div>

          {/* Side thumbnail column — desktop only */}
          {hasMultipleImages && (
            <div className="hidden md:flex flex-col gap-3 w-56 flex-shrink-0">
              {images.slice(1, 3).map((img, i) => {
                const idx = i + 1;
                const isActive = activeImage === idx;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImage(idx)}
                    className="relative flex-1 rounded-2xl overflow-hidden focus:outline-none group/thumb"
                    style={{
                      boxShadow: isActive
                        ? '0 0 0 3px #197FE3'
                        : '0 0 0 2px transparent',
                      transition: 'box-shadow 0.2s ease',
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.altText || product.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                    />
                    {/* Dark overlay on inactive thumbnails */}
                    <div className={`absolute inset-0 transition-opacity duration-200 ${isActive ? 'opacity-0' : 'bg-black/30 group-hover/thumb:opacity-0'}`} />
                    {/* Active check mark */}
                    {isActive && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-investment-blue rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    )}
                    {/* Photo count overlay on last thumb when more exist */}
                    {i === 1 && images.length > 3 && (
                      <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-white text-3xl mb-1">photo_library</span>
                        <span className="text-white text-sm font-bold">+{images.length - 3} more</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Thumbnail strip — visible on all sizes, shows image count */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden transition-all duration-200 focus:outline-none"
                style={{
                  boxShadow: activeImage === i
                    ? '0 0 0 2px #197FE3'
                    : '0 0 0 2px transparent',
                  opacity: activeImage === i ? 1 : 0.55,
                }}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <span className="ml-2 self-center text-on-surface-variant text-xs font-medium flex-shrink-0">
              {activeImage + 1} / {images.length}
            </span>
          </div>
        )}
      </motion.section>

      {/* Financial Bento Grid */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop py-4 mt-2 md:mt-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-gutter">
          {[
            { label: 'Asking Price', value: formatCurrency(product.price), sub: 'Contact for NDA', subColor: 'text-success-green' },
            { label: 'Annual Revenue', value: product.revenue ? formatCurrency(product.revenue) : '—', sub: 'TTM', subColor: 'text-on-surface-variant' },
            { label: 'Net Profit', value: product.profit ? formatCurrency(product.profit) : '—', sub: 'Verified Figures', subColor: 'text-investment-blue' },
            { label: 'EBITDA', value: product.ebitda ? formatCurrency(product.ebitda) : '—', sub: product.multiplier ? `${product.multiplier}x Multiple` : 'Market Rate', subColor: 'text-on-surface-variant' },
          ].map(metric => (
            <motion.div key={metric.label} variants={fadeUp} className="bg-white p-4 md:p-8 rounded-2xl shadow-layers border border-surface-variant/10 flex flex-col justify-between">
              <span className="text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5 block">{metric.label}</span>
              <div className="font-bold text-base md:text-2xl text-primary tabular-nums mb-1">{metric.value}</div>
              <div className={`text-[11px] md:text-label-sm flex items-center gap-1 ${metric.subColor}`}>
                {metric.label === 'Asking Price' && <span className="material-symbols-outlined text-[12px]">trending_up</span>}
                {metric.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Content + Sidebar */}
      <section className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        <div className="lg:col-span-8 space-y-10 md:space-y-14">
          {/* Description */}
          <div>
            <h2 className="font-bold text-lg md:text-headline-lg mb-4 md:mb-6 border-l-4 border-investment-blue pl-4 md:pl-5">
              Business Description
            </h2>
            {product.descriptionHtml ? (
              <div
                className="text-on-surface-variant text-sm md:text-body-lg leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="text-on-surface-variant text-sm md:text-body-lg leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            )}
          </div>

          {/* Tags / Details */}
          {product.tags.length > 0 && (
            <div>
              <h2 className="font-bold text-lg md:text-headline-lg mb-4 md:mb-6 border-l-4 border-investment-blue pl-4 md:pl-5">
                Business Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.filter(t => !t.startsWith('owner_')).map(tag => (
                  <span
                    key={tag}
                    className="bg-investment-blue/10 text-investment-blue border border-investment-blue/20 px-4 py-1.5 rounded-full text-label-sm font-medium capitalize"
                  >
                    {tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Facts */}
          <div>
            <h3 className="font-bold text-headline-lg-mobile mb-5">Quick Facts</h3>
            <div className="space-y-3">
              {[
                { label: 'Industry', value: product.industry || '—' },
                { label: 'Location', value: product.location || '—' },
                { label: 'Year Established', value: product.yearEstablished || '—' },
              ].map(f => (
                <div key={f.label} className="flex justify-between items-center pb-2 border-b border-surface-variant/50">
                  <span className="text-on-surface-variant font-medium text-label-sm">{f.label}</span>
                  <span className="font-bold text-label-sm">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-5 md:p-8 rounded-3xl shadow-layers border border-outline-variant/20 sticky top-24">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">business</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Verified Listing</h4>
                <p className="text-on-surface-variant text-label-sm">BusinessEx Certified</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {[
                { icon: 'verified', color: 'text-success-green', bg: 'bg-success-green/5 border-success-green/10', label: 'Identity Verified' },
                { icon: 'account_balance', color: 'text-investment-blue', bg: 'bg-investment-blue/5 border-investment-blue/10', label: 'Financials Audited' },
                { icon: 'contract', color: 'text-gold-leaf', bg: 'bg-gold-leaf/5 border-gold-leaf/10', label: 'Legal Review Passed' },
              ].map(item => (
                <div key={item.label} className={`flex items-center gap-3 p-3 ${item.bg} rounded-xl border ${item.color}`}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  <span className="text-label-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {buildWhatsAppUrl('contact') ? (
                <a
                  href={buildWhatsAppUrl('contact')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold text-label-sm hover:scale-[1.02] transition-transform shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Contact Seller on WhatsApp
                </a>
              ) : (
                <button disabled className="w-full bg-primary/40 text-on-primary/60 py-4 rounded-2xl font-bold text-label-sm cursor-not-allowed">
                  Contact Seller
                </button>
              )}
              {buildWhatsAppUrl('nda') ? (
                <a
                  href={buildWhatsAppUrl('nda')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border-2 border-primary py-4 rounded-2xl font-bold text-label-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  Request NDA / Information
                </a>
              ) : (
                <button disabled className="w-full border-2 border-primary/40 text-primary/40 py-4 rounded-2xl font-bold text-label-sm cursor-not-allowed">
                  Request NDA / Information
                </button>
              )}
              <p className="text-center text-on-surface-variant text-label-xs pt-1">
                Typical response time: &lt; 4 hours
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Similar Listings */}
      {related.length > 0 && (
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex items-end justify-between mb-6 md:mb-10">
              <div>
                <span className="text-investment-blue text-label-sm uppercase tracking-[0.2em] font-bold block mb-1 md:mb-2">Discovery</span>
                <h2 className="font-bold text-lg md:text-headline-lg">Similar Listings</h2>
              </div>
              <Link to="/listings" className="text-investment-blue text-label-sm font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {related.map(p => (
                <ListingCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

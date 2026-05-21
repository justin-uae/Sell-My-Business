import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const INDUSTRY_COLORS = {
  'SaaS':          { bg: 'bg-investment-blue',  dot: '#197FE3' },
  'Software':      { bg: 'bg-investment-blue',  dot: '#197FE3' },
  'Hospitality':   { bg: 'bg-gold-leaf',        dot: '#D4AF37' },
  'Tourism':       { bg: 'bg-gold-leaf',        dot: '#D4AF37' },
  'F&B':           { bg: 'bg-gold-leaf',        dot: '#D4AF37' },
  'Retail':        { bg: 'bg-purple-500',       dot: '#8B5CF6' },
  'Logistics':     { bg: 'bg-success-green',    dot: '#22CB22' },
  'Industrial':    { bg: 'bg-slate-500',        dot: '#64748B' },
  'Manufacturing': { bg: 'bg-slate-500',        dot: '#64748B' },
  'Healthcare':    { bg: 'bg-rose-500',         dot: '#F43F5E' },
};

function getIndustry(industry = '') {
  const key = Object.keys(INDUSTRY_COLORS).find(k =>
    industry.toLowerCase().includes(k.toLowerCase())
  );
  return INDUSTRY_COLORS[key] || { bg: 'bg-investment-blue', dot: '#197FE3' };
}

function formatCurrency(amount) {
  if (!amount) return null;
  const n = parseFloat(amount);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

export default function ListingCard({ product, view = 'grid', index = 0 }) {
  const { bg: colorBg, dot: colorDot } = getIndustry(product.industry || '');
  const price = formatCurrency(product.price);
  const revenue = formatCurrency(product.revenue);
  const profit = formatCurrency(product.profit);

  /* LIST VIEW */
  if (view === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative bg-white rounded-2xl overflow-hidden flex shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300"
      >
        {/* Accent left bar */}
        <div className="absolute left-0 inset-y-0 w-1 rounded-l-2xl" style={{ background: colorDot }} />

        {/* Image */}
        <div className="relative w-48 flex-shrink-0 overflow-hidden ml-1">
          {product.coverImage ? (
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center min-h-[130px]">
              <span className="material-symbols-outlined text-4xl text-slate-300">business</span>
            </div>
          )}
          {product.industry && (
            <div className="absolute top-3 left-3">
              <span className={`${colorBg} text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide`}>
                {product.industry}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[13px]" style={{ color: colorDot, fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: colorDot }}>{product.location || 'UAE'}</p>
              <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-success-green bg-success-green/8 px-2 py-0.5 rounded-full border border-success-green/20">
                <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Verified
              </span>
            </div>
            <h3 className="font-bold text-[17px] leading-snug text-primary mb-2 line-clamp-1">{product.title}</h3>
            <p className="text-on-surface-variant text-[13px] line-clamp-2 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-end gap-6 mt-4 flex-wrap">
            {price && (
              <div>
                <p className="text-[9px] text-outline uppercase tracking-wider mb-0.5">Asking Price</p>
                <p className="font-bold text-primary text-lg tabular-nums leading-none">{price}</p>
              </div>
            )}
            {revenue && (
              <div>
                <p className="text-[9px] text-outline uppercase tracking-wider mb-0.5">Revenue</p>
                <p className="font-bold text-[15px] tabular-nums leading-none" style={{ color: colorDot }}>{revenue}</p>
              </div>
            )}
            {profit && (
              <div>
                <p className="text-[9px] text-outline uppercase tracking-wider mb-0.5">Net Profit</p>
                <p className="font-bold text-[15px] text-success-green tabular-nums leading-none">{profit}</p>
              </div>
            )}
            <Link
              to={`/listings/${product.handle}`}
              className="ml-auto flex items-center gap-2 py-2.5 px-5 bg-primary text-on-primary rounded-xl font-bold text-[12px] hover:bg-slate-800 transition-colors shadow-sm flex-shrink-0"
            >
              View Details
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </motion.article>
    );
  }

  /*  GRID VIEW */
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden flex flex-col border border-slate-100 hover:border-slate-200 transition-all duration-300"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        {product.coverImage ? (
          <img
            src={product.coverImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">business</span>
          </div>
        )}

        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex gap-1.5 flex-wrap">
            <span className="bg-black/35 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Verified
            </span>
            {product.industry && (
              <span className={`${colorBg} text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide`}>
                {product.industry}
              </span>
            )}
          </div>
          <button
            aria-label="Save listing"
            className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-200 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">bookmark</span>
          </button>
        </div>

        {/* Price bottom-left */}
        {price && (
          <div className="absolute bottom-3 left-4">
            <p className="text-[9px] text-white/65 uppercase tracking-widest font-medium mb-0.5">Asking Price</p>
            <p className="text-white font-bold text-xl tabular-nums drop-shadow-md">{price}</p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="material-symbols-outlined text-[13px]" style={{ color: colorDot, fontVariationSettings: "'FILL' 1" }}>location_on</span>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: colorDot }}>{product.location || 'UAE'}</p>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[16px] leading-snug text-primary line-clamp-2 mb-4">{product.title}</h3>

        {/* Stats */}
        {(revenue || profit) && (
          <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100">
            {revenue && (
              <div className="flex-1">
                <p className="text-[9px] text-outline uppercase tracking-wider mb-1">Revenue</p>
                <p className="font-bold text-[14px] text-primary tabular-nums">{revenue}</p>
              </div>
            )}
            {profit && (
              <div className="flex-1">
                <p className="text-[9px] text-outline uppercase tracking-wider mb-1">Net Profit</p>
                <p className="font-bold text-[14px] text-success-green tabular-nums">{profit}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/listings/${product.handle}`}
          className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-[13px] text-white transition-all duration-200 group/btn"
          style={{ background: `linear-gradient(135deg, #111 0%, #333 100%)` }}
        >
          View Details
          <span className="material-symbols-outlined text-[15px] transition-transform duration-200 group-hover/btn:translate-x-0.5">arrow_forward</span>
        </Link>
      </div>
    </motion.article>
  );
}

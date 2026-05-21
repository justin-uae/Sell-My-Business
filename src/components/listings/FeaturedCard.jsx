import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const INDUSTRY_COLORS = {
  saas: '#197FE3', software: '#197FE3',
  hospitality: '#D4AF37', tourism: '#D4AF37', 'f&b': '#D4AF37',
  retail: '#8B5CF6', logistics: '#22CB22', manufacturing: '#64748B',
};

function getColor(industry = '') {
  const key = Object.keys(INDUSTRY_COLORS).find(k => industry.toLowerCase().includes(k));
  return INDUSTRY_COLORS[key] || '#197FE3';
}

function fmt(v) {
  if (!v) return null;
  const n = parseFloat(v);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

export default function FeaturedCard({ product = null, demo = null, index = 0 }) {
  const data = product
    ? {
        handle: product.handle,
        img: product.coverImage,
        title: product.title,
        industry: product.industry,
        location: product.location,
        price: fmt(product.price),
        revenue: fmt(product.revenue),
        profit: fmt(product.profit),
      }
    : demo;

  const { handle, img, title, industry, location, price, revenue, profit } = data || {};
  const color = getColor(industry);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="flex-shrink-0 snap-start w-[calc(100vw-60px)] md:w-[calc(25vw-55px)] h-[460px] rounded-2xl overflow-hidden bg-white flex flex-col group"
      style={{ boxShadow: '0 8px 32px -4px rgba(0,0,0,0.14)' }}
    >
      {/* Image */}
      <div className="relative h-[200px] flex-shrink-0 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">business</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[11px] text-success-green" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Verified
          </span>
          {industry && (
            <span
              className="text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full backdrop-blur-md"
              style={{ background: `${color}cc` }}
            >
              {industry}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        {location && (
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color }}>
            {location}
          </p>
        )}
        <h3 className="font-bold text-[16px] leading-snug text-primary line-clamp-2 mb-1">{title}</h3>

        {price && (
          <p className="text-on-surface-variant text-[11px] mb-3">
            Asking <span className="font-bold text-primary text-[13px]">{price}</span>
          </p>
        )}

        {(revenue || profit) && (
          <div className="flex gap-5 mb-4 pb-3 border-b border-slate-100">
            {revenue && (
              <div>
                <p className="text-[10px] text-outline uppercase tracking-wider mb-0.5">Revenue</p>
                <p className="font-bold text-[13px] text-primary tabular-nums">{revenue}</p>
              </div>
            )}
            {profit && (
              <div>
                <p className="text-[10px] text-outline uppercase tracking-wider mb-0.5">Net Profit</p>
                <p className="font-bold text-[13px] text-success-green tabular-nums">{profit}</p>
              </div>
            )}
          </div>
        )}

        <Link
          to={handle ? `/listings/${handle}` : '/listings'}
          className="mt-auto block w-full py-3 bg-primary text-white rounded-xl font-bold text-[13px] text-center hover:bg-slate-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

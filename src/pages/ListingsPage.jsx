import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllProductsFull, searchProducts } from '../services/shopify';
import ListingCard from '../components/listings/ListingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const INDUSTRIES = [
  'Technology & SaaS',
  'Hospitality & Tourism',
  'E-commerce',
  'Manufacturing',
  'Retail',
  'F&B',
  'Logistics',
  'Industrial',
  'Healthcare',
  'Finance',
];

const LOCATIONS = [
  'All Emirates',
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ras Al Khaimah',
  'Ajman',
  'Fujairah',
  'Umm Al Quwain',
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Recently Added' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const PAGE_SIZE = 25;

function formatPrice(n) {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}k`;
  return `AED ${n.toLocaleString()}`;
}

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    industries: searchParams.get('industry') ? [searchParams.get('industry')] : [],
    location: searchParams.get('location') || 'All Emirates',
    maxPrice: 10_000_000,
    sort: 'default',
    verifiedOnly: false,
  });

  const [searchInput, setSearchInput] = useState(filters.q);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let results;
      if (filters.q) {
        results = await searchProducts(filters.q);
      } else {
        results = await getAllProductsFull();
      }

      // Client-side filter + sort
      let filtered = results.filter(p => {
        if (filters.verifiedOnly && !p.tags?.includes('verified')) return false;
        if (filters.industries.length > 0) {
          const match = filters.industries.some(ind =>
            p.industry?.toLowerCase().includes(ind.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(ind.toLowerCase()))
          );
          if (!match) return false;
        }
        if (filters.location && filters.location !== 'All Emirates') {
          if (!p.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
        }
        if (p.price > filters.maxPrice) return false;
        return true;
      });

      if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

      setProducts(filtered);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => { setPage(1); }, [filters]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p) => {
    const clamped = Math.min(Math.max(p, 1), totalPages);
    setPage(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleIndustry = (ind) => {
    setFilters(f => ({
      ...f,
      industries: f.industries.includes(ind)
        ? f.industries.filter(i => i !== ind)
        : [...f.industries, ind],
    }));
  };

  const resetFilters = () => {
    setFilters({ q: '', industries: [], location: 'All Emirates', maxPrice: 10_000_000, sort: 'default', verifiedOnly: false });
    setSearchInput('');
    setSearchParams({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, q: searchInput }));
    if (searchInput) setSearchParams({ q: searchInput });
    else setSearchParams({});
  };

  const Filters = () => (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-variant/20">
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary flex items-center gap-2 text-label-sm">
            <span className="material-symbols-outlined text-investment-blue text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Verified Only
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={e => setFilters(f => ({ ...f, verifiedOnly: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-investment-blue" />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-primary text-label-xs uppercase tracking-wider">Industry</h3>
        <div className="space-y-2.5">
          {INDUSTRIES.map(ind => (
            <label key={ind} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.industries.includes(ind)}
                onChange={() => toggleIndustry(ind)}
                className="w-4 h-4 rounded border-outline-variant text-investment-blue focus:ring-investment-blue/20 cursor-pointer"
              />
              <span className="text-on-surface-variant group-hover:text-primary transition-colors text-label-sm">{ind}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-primary text-label-xs uppercase tracking-wider">Location (UAE)</h3>
        <select
          value={filters.location}
          onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
          className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-investment-blue/20 outline-none"
        >
          {LOCATIONS.map(loc => <option key={loc}>{loc}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-primary text-label-xs uppercase tracking-wider">Max Asking Price</h3>
          <span className="text-investment-blue font-bold text-label-sm">{formatPrice(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min={100_000}
          max={10_000_000}
          step={100_000}
          value={filters.maxPrice}
          onChange={e => setFilters(f => ({ ...f, maxPrice: parseInt(e.target.value) }))}
          className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-label-xs text-outline">
          <span>AED 100k</span>
          <span>AED 10M+</span>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-3.5 bg-surface-container-high text-primary font-bold rounded-xl hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 text-label-sm"
      >
        <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="bg-background mt-4 pt-20 md:pt-24 pb-16 md:pb-24 min-h-screen">
      <div className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop">
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-headline-lg font-bold text-primary mb-2">Premium Business Listings</h1>
          <p className="text-on-surface-variant text-sm md:text-body-md max-w-2xl">
            Access exclusive, vetted opportunities across the UAE. Our marketplace specialises in high-value acquisitions and institutional grade investments.
          </p>
        </header>

        {/* Sticky Search Bar */}
        <div className="sticky top-[72px] z-40 bg-surface-bright py-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:max-w-xl group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-investment-blue transition-colors">search</span>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-0 shadow-sm rounded-xl focus:ring-2 focus:ring-investment-blue/20 outline-none transition-all"
              placeholder="Search by industry, keyword, or location..."
              type="text"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden md:flex bg-surface-container p-1 rounded-xl">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-investment-blue' : 'text-on-surface-variant hover:text-investment-blue'}`}
              >
                <span className="material-symbols-outlined text-[20px] block">grid_view</span>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-investment-blue' : 'text-on-surface-variant hover:text-investment-blue'}`}
              >
                <span className="material-symbols-outlined text-[20px] block">view_list</span>
              </button>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(o => !o)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white shadow-sm rounded-xl font-medium text-label-sm"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              Filters {filters.industries.length > 0 && `(${filters.industries.length})`}
            </button>

            <div className="hidden md:block">
              <select
                value={filters.sort}
                onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
                className="bg-white border-0 shadow-sm rounded-xl px-5 py-3 font-medium text-label-sm focus:ring-2 focus:ring-investment-blue/20 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="md:hidden mb-6 bg-white rounded-2xl p-6 shadow-luxury border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-primary">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <Filters />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-gutter">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-40">
              <Filters />
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1 min-w-0">
            {error && (
              <div className="bg-error-container text-on-error-container rounded-xl p-4 mb-6 text-label-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-24">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
                <h3 className="text-headline-lg-mobile font-bold text-primary mb-2">No listings found</h3>
                <p className="text-on-surface-variant text-body-md mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={resetFilters} className="bg-primary text-on-primary px-8 py-3 rounded-xl text-label-sm font-bold">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  key={`${view}-${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-gutter' : 'flex flex-col gap-4'}
                >
                  {paginatedProducts.map((product, i) => (
                    <ListingCard key={product.id} product={product} view={view} index={i} />
                  ))}
                </motion.div>

                <div className="mt-12 flex flex-col items-center gap-4">
                  <p className="text-label-xs text-outline font-medium">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, products.length)} of {products.length} listing{products.length !== 1 ? 's' : ''}
                  </p>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-white shadow-sm text-on-surface-variant hover:text-investment-blue disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-on-surface-variant transition-colors"
                        aria-label="Previous page"
                      >
                        <span className="material-symbols-outlined text-[20px] block">chevron_left</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) acc.push('ellipsis-' + p);
                          acc.push(p);
                          return acc;
                        }, [])
                        .map(p =>
                          typeof p === 'string' ? (
                            <span key={p} className="px-2 text-outline text-label-sm">…</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => goToPage(p)}
                              className={`min-w-[36px] h-9 px-2 rounded-lg text-label-sm font-bold transition-colors ${
                                p === page
                                  ? 'bg-investment-blue text-white'
                                  : 'bg-white shadow-sm text-on-surface-variant hover:text-investment-blue'
                              }`}
                            >
                              {p}
                            </button>
                          )
                        )}

                      <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg bg-white shadow-sm text-on-surface-variant hover:text-investment-blue disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-on-surface-variant transition-colors"
                        aria-label="Next page"
                      >
                        <span className="material-symbols-outlined text-[20px] block">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllProducts, extractOwnerId, getShopifyCustomerId } from '../services/shopify';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const STATUS_STYLES = {
  Published: 'bg-success-green/10 text-success-green',
  Pending: 'bg-warning-amber/10 text-warning-amber',
  Draft: 'bg-surface-variant text-on-surface-variant',
};

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', id: 'overview' },
  { icon: 'list_alt', label: 'My Listings', id: 'listings' },
  { icon: 'settings', label: 'Settings', id: 'settings' },
];

function formatCurrency(amount) {
  if (!amount) return '—';
  const n = parseFloat(amount);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('overview');
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { customer, customerId, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) {
      navigate('/');
      return;
    }
    getAllProducts(100)
      .then(({ products }) => {
        const mine = products.filter(p => {
          const ownerId = extractOwnerId(p.tags);
          return ownerId && ownerId === customerId;
        });
        setMyListings(mine);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [customer, customerId, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!customer) return null;


  const Sidebar = () => (
    <aside className="h-full w-64 bg-surface border-r border-outline-variant/30 flex flex-col gap-base p-base shadow-md">
      <div className="px-4 py-6">
        <Link to="/" className="font-bold text-2xl tracking-tight text-primary block">Sell My Business</Link>
        <p className="text-label-xs text-on-surface-variant mt-1 uppercase tracking-widest">Investor Portal</p>
      </div>

      <nav className="flex flex-col gap-1 px-2 flex-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
            className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left ${
              activeNav === item.id
                ? 'bg-tertiary-fixed text-on-tertiary-fixed font-bold'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-label-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed text-label-sm">
            {customer.firstName?.[0] || customer.email?.[0] || 'U'}
          </div>
          <div>
            <p className="text-label-sm font-bold">{customer.firstName} {customer.lastName}</p>
            <p className="text-label-xs text-on-surface-variant">Premium Account</p>
          </div>
        </div>
        <Link
          to="/sell"
          className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-label-sm font-semibold hover:scale-[1.02] active:scale-95 transition-transform block text-center"
        >
          List New Business
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex pt-0">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 z-40 flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass-nav flex items-center justify-between px-4 py-3 shadow-sm">
        <button onClick={() => setSidebarOpen(true)}>
          <span className="material-symbols-outlined text-white">menu</span>
        </button>
        <Link to="/" className="font-bold text-lg tracking-tight text-white">Sell My Business</Link>
        <button onClick={handleLogout} className="text-label-sm text-white/70">Sign out</button>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 min-h-screen px-margin-mobile md:px-margin-desktop py-10 pt-20 md:pt-20 bg-background">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-display-lg font-bold text-primary tracking-tight">
              {activeNav === 'overview' ? 'Overview' :
               activeNav === 'listings' ? 'My Listings' : 'Settings'}
            </h2>
            <p className="text-body-lg text-on-surface-variant mt-2">
              Welcome back, {customer.firstName || customer.email}. Your portfolio is active.
            </p>
          </div>
          <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-secondary-fixed/20 rounded-full">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            </div>
            <div>
              <p className="text-label-xs text-on-surface-variant uppercase tracking-wider">Plan Status</p>
              <p className="text-label-sm font-bold">Premium Investor</p>
            </div>
          </div>
        </header>

        {/* My Listings Table */}
        {(activeNav === 'overview' || activeNav === 'listings') && (
          <section>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-headline-lg-mobile font-bold text-primary">My Listings</h3>
                <Link to="/sell" className="text-investment-blue text-label-sm font-semibold hover:underline">
                  + Add New
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : myListings.length > 0 ? (
                <>
                  {/* Mobile cards */}
                  <div className="md:hidden space-y-3">
                    {myListings.map(listing => (
                      <div key={listing.id} className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-variant flex-shrink-0 overflow-hidden">
                          {listing.coverImage ? (
                            <img src={listing.coverImage} alt={listing.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-outline">business</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-label-sm font-bold truncate">{listing.title}</p>
                          <p className="text-label-xs text-on-surface-variant truncate">{listing.industry} · {listing.location || 'UAE'}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="px-2 py-0.5 bg-success-green/10 text-success-green text-label-xs font-bold rounded-full">Published</span>
                            <span className="text-label-xs font-bold tabular-nums">{formatCurrency(listing.price)}</span>
                          </div>
                        </div>
                        <Link
                          to={`/listings/${listing.handle}`}
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
                        >
                          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30 text-left">
                          {['Business Name', 'Status', 'Price', 'Actions'].map(h => (
                            <th key={h} className={`pb-4 text-label-xs text-on-surface-variant uppercase tracking-wider font-semibold ${h === 'Actions' ? 'text-right' : ''}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {myListings.map(listing => (
                          <tr key={listing.id} className="hover:bg-surface-container-low transition-colors group">
                            <td className="py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-surface-variant flex-shrink-0 overflow-hidden">
                                  {listing.coverImage ? (
                                    <img src={listing.coverImage} alt={listing.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="material-symbols-outlined text-outline">business</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-label-sm font-bold">{listing.title}</p>
                                  <p className="text-label-xs text-on-surface-variant">{listing.industry} · {listing.location || 'UAE'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-5">
                              <span className="px-3 py-1 bg-success-green/10 text-success-green text-label-xs font-bold rounded-full">Published</span>
                            </td>
                            <td className="py-5 text-label-sm font-bold tabular-nums">{formatCurrency(listing.price)}</td>
                            <td className="py-5 text-right">
                              <Link
                                to={`/listings/${listing.handle}`}
                                className="inline-flex items-center gap-1 p-2 text-on-surface-variant hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
                  <span className="material-symbols-outlined text-5xl text-outline block mb-4">business_center</span>
                  <h4 className="font-bold text-primary mb-2">No listings yet</h4>
                  <p className="text-on-surface-variant text-label-sm mb-6">
                    You have no active listings yet. Submit a business to get started.
                  </p>
                  <Link to="/sell" className="bg-primary text-on-primary px-8 py-3 rounded-xl text-label-sm font-bold inline-block">
                    Submit a Business
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Settings Tab */}
        {activeNav === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-layers border border-outline-variant/10">
              <h3 className="font-bold text-lg mb-6">Account Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">First Name</label>
                    <p className="font-medium">{customer.firstName || '—'}</p>
                  </div>
                  <div>
                    <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">Last Name</label>
                    <p className="font-medium">{customer.lastName || '—'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">Email</label>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 border border-error text-error rounded-xl text-label-sm font-medium hover:bg-error-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

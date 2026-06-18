import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import { Logo, Wordmark } from '../ui/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { customer, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Browse Businesses', to: '/listings' },
    { label: 'Sell a Business', to: '/sell' },
    { label: 'FAQ', to: '/faq' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openAuth = (tab = 'login') => setAuthModal({ open: true, tab });

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 glass-nav ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 max-w-site mx-auto">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 select-none min-w-0">
            <Logo className="h-9 w-9 sm:h-10 sm:w-10" badge />
            <Wordmark className="font-bold text-base sm:text-lg md:text-xl tracking-tight text-white" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive(l.to)
                    ? 'text-investment-blue border-b-2 border-investment-blue pb-0.5'
                    : 'text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop: user dropdown or auth buttons */}
            {customer ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {customer.firstName?.[0] || customer.email?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {customer.firstName || customer.email}
                  </span>
                  <span className="material-symbols-outlined text-base text-white">
                    {userMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/5 py-2 z-10">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <span className="material-symbols-outlined text-base">dashboard</span>
                      My Dashboard
                    </Link>
                    <Link to="/sell" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <span className="material-symbols-outlined text-base">add_business</span>
                      List a Business
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="hidden md:block text-sm font-medium text-white transition-colors px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="hidden md:block bg-investment-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile hamburger only */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-white"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#060c14]/98 backdrop-blur-xl">
            <div className="px-margin-mobile py-4 space-y-1">

              {/* Profile block at top when logged in */}
              {customer && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    {customer.firstName?.[0] || customer.email?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{customer.firstName || 'Account'}</p>
                    <p className="text-white text-xs truncate">{customer.email}</p>
                  </div>
                </div>
              )}

              {navLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(l.to)
                      ? 'bg-investment-blue/20 text-investment-blue'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              {customer ? (
                <div className="pt-2 border-t border-white/10 space-y-1 mt-2">
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-base">dashboard</span>
                    My Dashboard
                  </Link>
                  <Link to="/sell" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-base">add_business</span>
                    List a Business
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => { openAuth('login'); setMobileOpen(false); }}
                    className="flex-1 py-2.5 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { openAuth('signup'); setMobileOpen(false); }}
                    className="flex-1 py-2.5 bg-investment-blue text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={authModal.open}
        defaultTab={authModal.tab}
        onClose={() => setAuthModal({ open: false, tab: 'login' })}
      />
    </>
  );
}

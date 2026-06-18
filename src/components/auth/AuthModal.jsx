import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo, Wordmark } from '../ui/Logo';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.firstName, form.lastName, form.email, form.password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="text-center mb-8">
          <Logo className="h-12 w-12 mx-auto mb-2" />
          <Wordmark className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary mb-1" />
          <p className="text-on-surface-variant text-label-sm">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="flex bg-surface-container-low rounded-xl p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg text-label-sm font-medium transition-all ${tab === 'login' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-label-sm font-medium transition-all ${tab === 'signup' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container border-none rounded-xl p-3 text-body-md focus:ring-2 focus:ring-investment-blue/20 outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container border-none rounded-xl p-3 text-body-md focus:ring-2 focus:ring-investment-blue/20 outline-none transition-all"
                  placeholder="Smith"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-surface-container border-none rounded-xl p-3 text-body-md focus:ring-2 focus:ring-investment-blue/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full bg-surface-container border-none rounded-xl p-3 text-body-md focus:ring-2 focus:ring-investment-blue/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl p-3 text-label-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-label-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-label-xs text-on-surface-variant mt-6">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
            className="text-investment-blue font-semibold hover:underline"
          >
            {tab === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

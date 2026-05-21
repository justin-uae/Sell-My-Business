import { Link } from 'react-router-dom';

const links = [
  { label: 'Browse Businesses', to: '/listings' },
  { label: 'Sell a Business', to: '/sell' },
  { label: 'FAQ', to: '/faq' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-white/10">
      <div className="max-w-site mx-auto px-5 md:px-20 py-4">

        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <Link to="/" className="font-bold text-base tracking-tight text-white shrink-0">
            Sell My Business
          </Link>

          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} className="text-[12px] text-white/55 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <a href="https://wa.me/971" className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-investment-blue hover:text-white transition-all">
              <span className="material-symbols-outlined text-[15px]">chat</span>
            </a>
            <a href="mailto:hello@businessex.ae" className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-investment-blue hover:text-white transition-all">
              <span className="material-symbols-outlined text-[15px]">mail</span>
            </a>
          </div>
        </div>

        {/* Address + copyright bar */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
          <p className="text-[11px] text-white/35">
            Abu Dhabi, UAE · Sun – Thu, 9am – 6pm · © {new Date().getFullYear()} Sell My Business
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-[11px] text-white/35 hover:text-white/70 transition-colors">Terms</Link>
            <Link to="#" className="text-[11px] text-white/35 hover:text-white/70 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

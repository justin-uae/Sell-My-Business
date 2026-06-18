import logoImg from '../../assets/Logo.png';

export function Logo({ className = 'h-10 w-10', badge = false }) {
  const img = <img src={logoImg} alt="SellMyBusiness.ae" className={`object-contain ${badge ? 'h-full w-full' : className}`} />;
  if (!badge) return img;
  return (
    <span className={`inline-flex items-center justify-center shrink-0 bg-white rounded-lg p-1 ${className}`}>
      {img}
    </span>
  );
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`whitespace-nowrap ${className}`}>
      Sell<span className="text-investment-blue">My</span>Business.ae
    </span>
  );
}

import { useEffect, useRef } from 'react';

const CONFIG = {
  count: 70,
  maxDist: 150,
  speed: 0.45,
  dotRadiusMin: 1.5,
  dotRadiusMax: 3.2,
  dotOpacity: 0.75,
  lineOpacity: 0.35,
  color: '25, 127, 227',      // investment-blue
  accentColor: '212, 175, 55', // gold-leaf
  accentRatio: 0.2,
};

function rand(min, max) { return Math.random() * (max - min) + min; }

export default function ParticleBackground({ className = '' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const pts = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      pts.current = Array.from({ length: CONFIG.count }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-CONFIG.speed, CONFIG.speed) || CONFIG.speed * 0.5,
        vy: rand(-CONFIG.speed, CONFIG.speed) || CONFIG.speed * 0.5,
        r: rand(CONFIG.dotRadiusMin, CONFIG.dotRadiusMax),
        isAccent: Math.random() < CONFIG.accentRatio,
      }));
    };

    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    init();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const p = pts.current;
      const W = canvas.width, H = canvas.height;

      p.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0 || pt.x > W) { pt.vx *= -1; pt.x = Math.max(0, Math.min(W, pt.x)); }
        if (pt.y < 0 || pt.y > H) { pt.vy *= -1; pt.y = Math.max(0, Math.min(H, pt.y)); }
      });

      // Lines
      for (let i = 0; i < p.length; i++) {
        for (let j = i + 1; j < p.length; j++) {
          const dx = p[i].x - p[j].x, dy = p[i].y - p[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.maxDist) {
            const alpha = CONFIG.lineOpacity * (1 - dist / CONFIG.maxDist);
            const col = (p[i].isAccent && p[j].isAccent) ? CONFIG.accentColor : CONFIG.color;
            ctx.beginPath();
            ctx.moveTo(p[i].x, p[i].y);
            ctx.lineTo(p[j].x, p[j].y);
            ctx.strokeStyle = `rgba(${col}, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Dots
      p.forEach(pt => {
        const col = pt.isAccent ? CONFIG.accentColor : CONFIG.color;
        // Glow
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.r * 3);
        grd.addColorStop(0, `rgba(${col}, 0.25)`);
        grd.addColorStop(1, `rgba(${col}, 0)`);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col}, ${CONFIG.dotOpacity})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}

import { useEffect, useRef } from 'react';

function generateData(points, start = 110, volatility = 6) {
  const d = [start];
  for (let i = 1; i < points; i++) {
    d.push(Math.max(60, Math.min(180, d[i - 1] + (Math.random() - 0.47) * volatility)));
  }
  return d;
}

export default function StockChartHero() {
  const canvasRef = useRef(null);
  const dataRef = useRef(generateData(90, 110, 7));
  const data2Ref = useRef(generateData(90, 90, 5));
  const rafRef = useRef(null);
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      const dpr = window.devicePixelRatio;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = parent.clientWidth + 'px';
      canvas.style.height = parent.clientHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const d1 = dataRef.current;
      const d2 = data2Ref.current;
      const t = tickRef.current;

      ctx.clearRect(0, 0, W, H);

      const allVals = [...d1, ...d2];
      const minV = Math.min(...allVals) - 12;
      const maxV = Math.max(...allVals) + 12;
      const range = maxV - minV || 1;

      const pad = { top: H * 0.12, bottom: H * 0.12, left: W * 0.01, right: W * 0.01 };
      const chartH = H - pad.top - pad.bottom;
      const chartW = W - pad.left - pad.right;

      const toY = v => pad.top + chartH - ((v - minV) / range) * chartH;
      const toX = i => pad.left + (i / (d1.length - 1)) * chartW;

      // Blue line (SMB)
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(d1[0]));
      for (let i = 1; i < d1.length; i++) ctx.lineTo(toX(i), toY(d1[i]));
      ctx.strokeStyle = '#197FE3';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = '#197FE3';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Gold line (IDX)
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(d2[0]));
      for (let i = 1; i < d2.length; i++) ctx.lineTo(toX(i), toY(d2[i]));
      ctx.strokeStyle = 'rgba(212,175,55,0.75)';
      ctx.lineWidth = 1.8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = '#D4AF37';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Live dot — blue line
      const lx1 = toX(d1.length - 1);
      const ly1 = toY(d1[d1.length - 1]);
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.09);
      const pr = 10 + pulse * 7;
      const ring1 = ctx.createRadialGradient(lx1, ly1, 0, lx1, ly1, pr);
      ring1.addColorStop(0, `rgba(25,127,227,${0.4 * pulse})`);
      ring1.addColorStop(1, 'rgba(25,127,227,0)');
      ctx.beginPath();
      ctx.arc(lx1, ly1, pr, 0, Math.PI * 2);
      ctx.fillStyle = ring1;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx1, ly1, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#197FE3';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx1, ly1, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Live dot — gold line
      const lx2 = toX(d2.length - 1);
      const ly2 = toY(d2[d2.length - 1]);
      const ring2 = ctx.createRadialGradient(lx2, ly2, 0, lx2, ly2, pr * 0.7);
      ring2.addColorStop(0, `rgba(212,175,55,${0.35 * pulse})`);
      ring2.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.beginPath();
      ctx.arc(lx2, ly2, pr * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = ring2;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx2, ly2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
    };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      tickRef.current++;

      if (tickRef.current % 7 === 0) {
        const last1 = dataRef.current[dataRef.current.length - 1];
        dataRef.current = [...dataRef.current.slice(1),
          Math.max(60, Math.min(180, last1 + (Math.random() - 0.47) * 3.5))];

        const last2 = data2Ref.current[data2Ref.current.length - 1];
        data2Ref.current = [...data2Ref.current.slice(1),
          Math.max(60, Math.min(180, last2 + (Math.random() - 0.48) * 3))];
      }

      draw();
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: 120 }}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* LIVE indicator */}
      <div className="absolute top-2 right-3 flex items-center gap-1.5 pointer-events-none">
        <span
          className="w-1.5 h-1.5 rounded-full bg-success-green"
          style={{ boxShadow: '0 0 6px rgba(34,203,34,0.9)', animation: 'pulse 1.8s ease-in-out infinite' }}
        />
        <span className="text-[9px] text-white/40 font-mono tracking-wider">LIVE</span>
      </div>
    </div>
  );
}

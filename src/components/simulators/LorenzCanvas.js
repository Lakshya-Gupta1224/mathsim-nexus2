import React, { useRef, useEffect } from 'react';

function lorenzStep(x, y, z, sigma, rho, beta, dt = 0.005) {
  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;
  return [x + dx * dt, y + dy * dt, z + dz * dt];
}

export default function LorenzCanvas({ values, accent }) {
  const { sigma, rho, beta } = values;
  const canvasRef = useRef(null);
  const stateRef = useRef({ x: 0.1, y: 0, z: 0, trail: [], animId: null, params: { sigma, rho, beta } });

  useEffect(() => {
    // Reset trail when params change
    stateRef.current.x = 0.1; stateRef.current.y = 0; stateRef.current.z = 0;
    stateRef.current.trail = [];
    stateRef.current.params = { sigma, rho, beta };
  }, [sigma, rho, beta]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;

    const MAX_TRAIL = 2000;
    let running = true;

    const render = () => {
      if (!running) return;
      const st = stateRef.current;
      const { sigma: s, rho: r, beta: b } = st.params;

      // Advance several steps per frame
      for (let i = 0; i < 8; i++) {
        const [nx, ny, nz] = lorenzStep(st.x, st.y, st.z, s, r, b);
        st.x = nx; st.y = ny; st.z = nz;
        st.trail.push([nx, ny, nz]);
      }
      if (st.trail.length > MAX_TRAIL) st.trail = st.trail.slice(-MAX_TRAIL);

      // Project XZ plane
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const lx = (i / 8) * W;
        ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
        const ly = (i / 8) * H;
        ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
      }

      const scaleX = W / 60, scaleZ = H / 60;
      const offX = W / 2, offZ = H * 0.9;

      // Draw trail with color gradient
      const trail = st.trail;
      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        const alpha = t * 0.8;
        // Color shift from blue to accent
        ctx.strokeStyle = `rgba(${Math.round(34 + t * 200)}, ${Math.round(211 * (1 - t) + 50 * t)}, ${Math.round(238 * (1 - t))}, ${alpha})`;
        ctx.lineWidth = t * 1.5 + 0.3;
        ctx.beginPath();
        ctx.moveTo(offX + trail[i - 1][0] * scaleX, offZ - trail[i - 1][2] * scaleZ);
        ctx.lineTo(offX + trail[i][0] * scaleX, offZ - trail[i][2] * scaleZ);
        ctx.stroke();
      }

      // Current point
      const cx = offX + st.x * scaleX, cy = offZ - st.z * scaleZ;
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();

      // Labels
      ctx.fillStyle = accent; ctx.font = '13px monospace';
      ctx.fillText(`σ=${s.toFixed(1)}  ρ=${r.toFixed(1)}  β=${b.toFixed(2)}`, 10, 22);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px monospace';
      ctx.fillText(`XZ projection  |trail=${trail.length}`, 10, 40);

      stateRef.current.animId = requestAnimationFrame(render);
    };

    stateRef.current.animId = requestAnimationFrame(render);
    return () => {
      running = false;
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

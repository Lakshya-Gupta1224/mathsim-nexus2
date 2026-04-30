import React, { useRef, useEffect, useState, useCallback } from 'react';
import ZoomControls from './ZoomControls';

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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    stateRef.current.x = 0.1; stateRef.current.y = 0; stateRef.current.z = 0;
    stateRef.current.trail = [];
    stateRef.current.params = { sigma, rho, beta };
  }, [sigma, rho, beta]);

  // Zoom/pan handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e) => { e.preventDefault(); setZoom(z => Math.min(10, Math.max(0.2, z * (e.deltaY < 0 ? 1.12 : 1/1.12)))); };
    const onDown = (e) => { dragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY }; canvas.style.cursor = 'grabbing'; };
    const onMove = (e) => { if (!dragging.current) return; setPan(p => ({ x: p.x + e.clientX - lastMouse.current.x, y: p.y + e.clientY - lastMouse.current.y })); lastMouse.current = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { dragging.current = false; canvas.style.cursor = 'grab'; };
    const onDbl = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
    canvas.style.cursor = 'grab';
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('dblclick', onDbl);
    return () => { canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); canvas.removeEventListener('dblclick', onDbl); };
  }, []);

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
      const zm = zoom;
      const px = pan.x;
      const py = pan.y;

      for (let i = 0; i < 8; i++) {
        const [nx, ny, nz] = lorenzStep(st.x, st.y, st.z, s, r, b);
        st.x = nx; st.y = ny; st.z = nz;
        st.trail.push([nx, ny, nz]);
      }
      if (st.trail.length > MAX_TRAIL) st.trail = st.trail.slice(-MAX_TRAIL);

      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const lx = (i / 8) * W;
        ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
        const ly = (i / 8) * H;
        ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
      }

      const scaleX = (W / 60) * zm, scaleZ = (H / 60) * zm;
      const offX = W / 2 + px, offZ = H * 0.9 + py;

      const trail = st.trail;
      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        const alpha = t * 0.8;
        ctx.strokeStyle = `rgba(${Math.round(34 + t * 200)}, ${Math.round(211 * (1 - t) + 50 * t)}, ${Math.round(238 * (1 - t))}, ${alpha})`;
        ctx.lineWidth = t * 1.5 + 0.3;
        ctx.beginPath();
        ctx.moveTo(offX + trail[i - 1][0] * scaleX, offZ - trail[i - 1][2] * scaleZ);
        ctx.lineTo(offX + trail[i][0] * scaleX, offZ - trail[i][2] * scaleZ);
        ctx.stroke();
      }

      const cx = offX + st.x * scaleX, cy = offZ - st.z * scaleZ;
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();

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
  }, [accent, zoom, pan]);

  const resetView = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);
  const zoomIn = useCallback(() => { setZoom(z => Math.min(10, z * 1.3)); }, []);
  const zoomOut = useCallback(() => { setZoom(z => Math.max(0.2, z / 1.3)); }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

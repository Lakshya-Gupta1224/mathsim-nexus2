import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function RiemannCanvas({ values, accent }) {
  const { n } = values;
  const a = 0, b = Math.PI;
  const f = x => Math.sin(x);
  const exact = 2; // ∫₀^π sin(x)dx = 2

  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w * 0.1, oy = h * 0.85, sx = (w * 0.8) / (b - a + 2), sy = h * 0.6;
    clearCanvas(ctx, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = -1; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(ox + i*sx, 0); ctx.lineTo(ox + i*sx, h); ctx.stroke();
    }
    for (let j = -1; j <= 2; j++) {
      ctx.beginPath(); ctx.moveTo(0, oy - j*sy*0.5); ctx.lineTo(w, oy - j*sy*0.5); ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    const dx = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const xi = a + i * dx;
      const fxi = f(xi + dx / 2); // midpoint
      sum += fxi * dx;
      const rectX = ox + xi * sx;
      const rectH = fxi * sy;
      ctx.fillStyle = `${accent}30`;
      ctx.fillRect(rectX, oy - rectH, dx * sx, rectH);
      ctx.strokeStyle = `${accent}80`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(rectX, oy - rectH, dx * sx, rectH);
    }

    // Curve
    plotFunction(ctx, f, a, b, 400, ox, oy, sx, sy, accent, 2.5);

    const error = Math.abs(exact - sum);
    labelAt(ctx, `n = ${n} rectangles`, 10, 20, accent, 13);
    labelAt(ctx, `Riemann Sum ≈ ${sum.toFixed(5)}`, 10, 38, 'rgba(255,255,255,0.6)', 12);
    labelAt(ctx, `Exact = 2.00000  Error = ${error.toFixed(5)}`, 10, 56, 'rgba(255,255,255,0.4)', 11);
  }, [n, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function NormalDistCanvas({ values, accent }) {
  const { mu, sigma } = values;
  const f = x => (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);

  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w * 0.5, oy = h * 0.85, sx = 35, sy = h * 1.5;
    clearCanvas(ctx, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      const px = ox + i * sx;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }
    drawAxes(ctx, w, h, ox, oy);

    // Shade ±1σ
    const shade = (lo, hi, color) => {
      ctx.beginPath();
      ctx.moveTo(ox + lo * sx, oy);
      for (let s = 0; s <= 200; s++) {
        const x = lo + (s / 200) * (hi - lo);
        ctx.lineTo(ox + x * sx, oy - f(x) * sy);
      }
      ctx.lineTo(ox + hi * sx, oy);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
    shade(mu - 3 * sigma, mu + 3 * sigma, `${accent}10`);
    shade(mu - 2 * sigma, mu + 2 * sigma, `${accent}18`);
    shade(mu - sigma, mu + sigma, `${accent}30`);

    plotFunction(ctx, f, mu - 4 * sigma, mu + 4 * sigma, 500, ox, oy, sx, sy, accent, 2.5);

    // μ line
    ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
    const mux = ox + mu * sx;
    ctx.beginPath(); ctx.moveTo(mux, 0); ctx.lineTo(mux, h); ctx.stroke();
    ctx.setLineDash([]);

    // Sigma markers
    [-1, 1, -2, 2].forEach(k => {
      const lx = ox + (mu + k * sigma) * sx;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, h); ctx.stroke();
      labelAt(ctx, `${k}σ`, lx - 6, oy + 14, 'rgba(255,255,255,0.3)', 9);
    });

    labelAt(ctx, `μ = ${mu.toFixed(2)},  σ = ${sigma.toFixed(2)}`, 10, 20, accent, 13);
    labelAt(ctx, `Peak = ${f(mu).toFixed(4)}`, 10, 38, 'rgba(255,255,255,0.5)', 11);
    labelAt(ctx, `68% within ±1σ   95% within ±2σ`, 10, 54, 'rgba(255,255,255,0.3)', 10);
  }, [mu, sigma, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

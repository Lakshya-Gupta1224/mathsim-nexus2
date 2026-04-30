import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function NormalDistCanvas({ values, accent }) {
  const { mu, sigma } = values;
  const f = x => (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = 35 * zm, sy = h * 1.5 * zm;
    const ox = w * 0.5 + panX, oy = h * 0.85 + panY;
    clearCanvas(ctx, w, h);

    drawGrid(ctx, w, h, sx, sy * 0.1, ox, oy, 1);
    drawAxes(ctx, w, h, ox, oy);

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

    ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
    const mux = ox + mu * sx;
    ctx.beginPath(); ctx.moveTo(mux, 0); ctx.lineTo(mux, h); ctx.stroke();
    ctx.setLineDash([]);

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

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

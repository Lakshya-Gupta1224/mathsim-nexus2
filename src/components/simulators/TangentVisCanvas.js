import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawDot, labelAt } from './canvasUtils';

export default function TangentVisCanvas({ values, accent }) {
  const { theta } = values;
  const rad = (theta * Math.PI) / 180;
  const tanV = Math.tan(rad);

  const canvasRef = useCanvas((ctx, w, h) => {
    clearCanvas(ctx, w, h);
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.34;

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Unit circle
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5; ctx.stroke();

    // Point on circle
    const px = cx + r * Math.cos(rad), py = cy - r * Math.sin(rad);

    // Radius line
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py);
    ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke();

    // Tangent line at point (x=r for vertical tangent at circle)
    const tx = cx + r; // tangent from (1,0)
    const tanPy = cy - tanV * r; // tangent intercept on x=1 line
    if (Math.abs(tanV) < 20) {
      // Draw tangent segment: from point on circle perpendicular to (1, tan)
      ctx.beginPath(); ctx.moveTo(tx, cy); ctx.lineTo(tx, tanPy);
      ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5; ctx.stroke();

      // Extend radius to tangent line
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tx, tanPy);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();

      // Vertical line at x=1
      ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke();

      drawDot(ctx, tx, tanPy, 5, '#f97316');
    }
    drawDot(ctx, px, py, 5, accent);
    drawDot(ctx, cx, cy, 3, 'rgba(255,255,255,0.3)');

    labelAt(ctx, `θ = ${theta}°`, 10, 20, 'rgba(255,200,0,0.9)', 13);
    labelAt(ctx, `tan(θ) = ${Math.abs(tanV) < 20 ? tanV.toFixed(4) : '±∞'}`, 10, 38, '#f97316', 12);
    labelAt(ctx, `Orange segment = geometric tangent`, 10, 56, 'rgba(255,255,255,0.3)', 10);
  }, [theta, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

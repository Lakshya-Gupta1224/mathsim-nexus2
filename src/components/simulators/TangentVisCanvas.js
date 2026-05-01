import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawDot, labelAt, drawGrid, drawAxes } from './canvasUtils';

export default function TangentVisCanvas({ values, accent }) {
  const { theta } = values;
  const rad = (theta * Math.PI) / 180;
  const tanV = Math.tan(rad);

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    clearCanvas(ctx, w, h);
    const cx = w / 2 + panX, cy = h / 2 + panY, r = Math.min(w, h) * 0.34 * zm;

    drawGrid(ctx, w, h, r / 2, r / 2, cx, cy, 1);
    drawAxes(ctx, w, h, cx, cy);

    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(28,28,28,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();

    const px = cx + r * Math.cos(rad), py = cy - r * Math.sin(rad);

    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py);
    ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke();

    const tx = cx + r;
    const tanPy = cy - tanV * r;
    if (Math.abs(tanV) < 20) {
      ctx.beginPath(); ctx.moveTo(tx, cy); ctx.lineTo(tx, tanPy);
      ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5; ctx.stroke();

      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tx, tanPy);
      ctx.strokeStyle = 'rgba(28,28,28,0.3)'; ctx.lineWidth = 1; ctx.stroke();

      ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, h);
      ctx.strokeStyle = 'rgba(28,28,28,0.2)'; ctx.lineWidth = 1; ctx.stroke();

      drawDot(ctx, tx, tanPy, 5, '#f97316');
    }
    drawDot(ctx, px, py, 5, accent);
    drawDot(ctx, cx, cy, 3, 'rgba(28,28,28,0.4)');

    labelAt(ctx, `θ = ${theta}°`, 10, 20, 'rgba(255,200,0,0.9)', 13);
    labelAt(ctx, `tan(θ) = ${Math.abs(tanV) < 20 ? tanV.toFixed(4) : '±∞'}`, 10, 38, '#f97316', 12);
    labelAt(ctx, `Orange segment = geometric tangent`, 10, 56, 'rgba(28,28,28,0.6)', 10);
  }, [theta, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

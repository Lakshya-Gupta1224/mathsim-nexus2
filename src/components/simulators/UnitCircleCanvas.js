import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawDot, labelAt } from './canvasUtils';

export default function UnitCircleCanvas({ values, accent }) {
  const { theta } = values;
  const rad = (theta * Math.PI) / 180;
  const cosV = Math.cos(rad);
  const sinV = Math.sin(rad);

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    clearCanvas(ctx, w, h);
    const cx = w / 2 + panX, cy = h / 2 + panY, r = Math.min(w, h) * 0.38 * zm;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(0, cy + i * r / 2); ctx.lineTo(w, cy + i * r / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + i * r / 2, 0); ctx.lineTo(cx + i * r / 2, h); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Unit circle
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5; ctx.stroke();

    const px = cx + cosV * r, py = cy - sinV * r;

    // Angle arc
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.25, 0, -rad, rad < 0);
    ctx.strokeStyle = 'rgba(255,200,0,0.5)'; ctx.lineWidth = 2; ctx.stroke();

    // cos projection (horizontal dashed)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
    // sin projection (vertical dashed)
    ctx.strokeStyle = '#f97316';
    ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(px, py); ctx.stroke();
    ctx.setLineDash([]);

    // Radius line
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py);
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke();

    // Point
    drawDot(ctx, px, py, 6, accent);
    drawDot(ctx, cx, cy, 4, 'rgba(255,255,255,0.3)');

    // Labels
    labelAt(ctx, `θ = ${theta}°`, 10, 20, 'rgba(255,200,0,0.9)', 13);
    labelAt(ctx, `cos(θ) = ${cosV.toFixed(3)}`, 10, 38, '#22d3ee', 12);
    labelAt(ctx, `sin(θ) = ${sinV.toFixed(3)}`, 10, 54, '#f97316', 12);
    labelAt(ctx, `tan(θ) = ${Math.abs(cosV) > 0.01 ? (sinV / cosV).toFixed(3) : '±∞'}`, 10, 70, accent, 12);

    ctx.fillStyle = '#22d3ee'; ctx.font = '10px monospace';
    ctx.fillText(`cos=${cosV.toFixed(2)}`, px - 20, cy + 14);
    ctx.fillStyle = '#f97316';
    ctx.fillText(`sin=${sinV.toFixed(2)}`, cx + 6, py - 5);
  }, [theta, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

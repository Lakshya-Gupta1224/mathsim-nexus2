import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawDot, labelAt, drawGrid, drawAxes } from './canvasUtils';

export default function UnitCircleCanvas({ values, accent }) {
  const { theta } = values;
  const rad = (theta * Math.PI) / 180;
  const cosV = Math.cos(rad);
  const sinV = Math.sin(rad);

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    clearCanvas(ctx, w, h);
    const cx = w / 2 + panX, cy = h / 2 + panY, r = Math.min(w, h) * 0.38 * zm;

    // Grid & Axes
    drawGrid(ctx, w, h, r / 2, r / 2, cx, cy, 1);
    drawAxes(ctx, w, h, cx, cy);

    // Unit circle
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(28,28,28,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();

    const px = cx + cosV * r, py = cy - sinV * r;

    // Angle arc
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.25, 0, -rad, rad < 0);
    ctx.strokeStyle = '#F59D8A'; ctx.lineWidth = 2; ctx.stroke();

    // cos projection (horizontal dashed)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#A8D5D2'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
    // sin projection (vertical dashed)
    ctx.strokeStyle = '#F59D8A';
    ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(px, py); ctx.stroke();
    ctx.setLineDash([]);

    // Radius line
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py);
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke();

    // Point
    drawDot(ctx, px, py, 6, accent);
    drawDot(ctx, cx, cy, 4, 'rgba(28,28,28,0.3)');

    // Labels
    labelAt(ctx, `θ = ${theta}°`, 10, 20, '#F59D8A', 13);
    labelAt(ctx, `cos(θ) = ${cosV.toFixed(3)}`, 10, 38, '#A8D5D2', 12);
    labelAt(ctx, `sin(θ) = ${sinV.toFixed(3)}`, 10, 54, '#F59D8A', 12);
    labelAt(ctx, `tan(θ) = ${Math.abs(cosV) > 0.01 ? (sinV / cosV).toFixed(3) : '±∞'}`, 10, 70, accent, 12);

    ctx.fillStyle = '#A8D5D2'; ctx.font = '10px monospace';
    ctx.fillText(`cos=${cosV.toFixed(2)}`, px - 20, cy + 14);
    ctx.fillStyle = '#F59D8A';
    ctx.fillText(`sin=${sinV.toFixed(2)}`, cx + 6, py - 5);
  }, [theta, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

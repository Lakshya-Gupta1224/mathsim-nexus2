import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, labelAt, drawGrid, drawAxes } from './canvasUtils';

export default function PolygonCanvas({ values, accent }) {
  const { n } = Math.round(values.n) ? { n: Math.round(values.n) } : values;
  const sides = Math.max(3, Math.round(n));
  const interiorAngle = ((sides - 2) * 180) / sides;
  const exteriorAngle = 360 / sides;
  const sumInterior = (sides - 2) * 180;

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    clearCanvas(ctx, w, h);
    const cx = w / 2 + panX, cy = h / 2 + panY, r = Math.min(w, h) * 0.38 * zm;

    // Grid and Axes
    drawGrid(ctx, w, h, r / 2, r / 2, cx, cy, 1);
    drawAxes(ctx, w, h, cx, cy);

    const angleStep = (2 * Math.PI) / sides;
    const startAngle = -Math.PI / 2;
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = startAngle + i * angleStep;
      const px = cx + r * Math.cos(angle), py = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = `${accent}15`; ctx.fill();

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const px = cx + r * Math.cos(angle), py = cy + r * Math.sin(angle);
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, 18, angle + Math.PI / 2, angle + Math.PI / 2 + ((sides - 2) * Math.PI) / sides);
      ctx.strokeStyle = 'rgba(255,200,0,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    }

    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(28,28,28,0.3)'; ctx.fill();

    labelAt(ctx, `${sides}-sided polygon`, 10, 20, accent, 14);
    labelAt(ctx, `Sum of interior angles = ${sumInterior}°`, 10, 40, 'rgba(255,200,0,0.8)', 12);
    labelAt(ctx, `Each interior angle = ${interiorAngle.toFixed(2)}°`, 10, 58, 'rgba(28,28,28,0.7)', 11);
    labelAt(ctx, `Each exterior angle = ${exteriorAngle.toFixed(2)}°`, 10, 74, 'rgba(28,28,28,0.6)', 11);
    labelAt(ctx, `Formula: (n−2)×180°`, 10, 90, 'rgba(28,28,28,0.5)', 10);
  }, [sides, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

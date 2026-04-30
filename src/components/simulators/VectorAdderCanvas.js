import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawDot, labelAt } from './canvasUtils';

function arrow(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = 10;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - len * Math.cos(angle - 0.4), y2 - len * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - len * Math.cos(angle + 0.4), y2 - len * Math.sin(angle + 0.4));
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
}

export default function VectorAdderCanvas({ values, accent }) {
  const { m1, a1, m2, a2 } = values;
  const r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
  const v1x = m1 * Math.cos(r1), v1y = m1 * Math.sin(r1);
  const v2x = m2 * Math.cos(r2), v2y = m2 * Math.sin(r2);
  const rx = v1x + v2x, ry = v1y + v2y;
  const rm = Math.sqrt(rx * rx + ry * ry);
  const ra = (Math.atan2(ry, rx) * 180) / Math.PI;

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    clearCanvas(ctx, w, h);
    const scale = 25 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;

    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(ox + i * scale, 0); ctx.lineTo(ox + i * scale, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, oy + i * scale); ctx.lineTo(w, oy + i * scale); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    arrow(ctx, ox, oy, ox + v1x * scale, oy - v1y * scale, '#22d3ee', 2.5);
    arrow(ctx, ox + v1x * scale, oy - v1y * scale,
      ox + (v1x + v2x) * scale, oy - (v1y + v2y) * scale, '#f97316', 2.5);
    arrow(ctx, ox, oy, ox + rx * scale, oy - ry * scale, accent, 3);

    drawDot(ctx, ox, oy, 4, 'rgba(255,255,255,0.3)');
    drawDot(ctx, ox + rx * scale, oy - ry * scale, 5, accent);

    labelAt(ctx, `V1: |${m1.toFixed(1)}| ∠${a1}°`, 10, 20, '#22d3ee', 12);
    labelAt(ctx, `V2: |${m2.toFixed(1)}| ∠${a2}°`, 10, 38, '#f97316', 12);
    labelAt(ctx, `R: |${rm.toFixed(3)}| ∠${ra.toFixed(1)}°`, 10, 56, accent, 13);
    labelAt(ctx, `Rx=${rx.toFixed(2)}  Ry=${ry.toFixed(2)}`, 10, 74, 'rgba(255,255,255,0.35)', 11);
  }, [m1, a1, m2, a2, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

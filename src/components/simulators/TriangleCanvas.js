import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, labelAt } from './canvasUtils';

export default function TriangleCanvas({ values, accent }) {
  const { a, b, C } = values;
  const Crad = (C * Math.PI) / 180;
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(Crad));
  const A = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
  const B = 180 - A - C;

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    clearCanvas(ctx, w, h);
    const scale = Math.min(w, h) * 0.28 * zm / Math.max(a, b, c);
    const cx = w / 2 + panX, cy = h * 0.6 + panY;

    const vC = { x: cx - (b * scale) / 2, y: cy };
    const vB = { x: vC.x + b * scale, y: cy };
    const vA = {
      x: vC.x + a * scale * Math.cos(Crad),
      y: vC.y - a * scale * Math.sin(Crad),
    };

    ctx.beginPath();
    ctx.moveTo(vC.x, vC.y);
    ctx.lineTo(vB.x, vB.y);
    ctx.lineTo(vA.x, vA.y);
    ctx.closePath();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = `${accent}15`;
    ctx.fill();

    [vA, vB, vC].forEach(v => {
      ctx.beginPath(); ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();
    });

    const mid = (p1, p2) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
    const mBC = mid(vB, vC), mAC = mid(vA, vC), mAB = mid(vA, vB);
    ctx.fillStyle = '#22d3ee'; ctx.font = '12px monospace';
    ctx.fillText(`a=${a.toFixed(1)}`, mBC.x - 15, mBC.y + 18);
    ctx.fillText(`b=${b.toFixed(1)}`, mAC.x - 30, mAC.y);
    ctx.fillStyle = accent;
    ctx.fillText(`c=${c.toFixed(2)}`, mAB.x + 5, mAB.y - 8);

    ctx.fillStyle = 'rgba(255,200,0,0.8)'; ctx.font = '11px monospace';
    ctx.fillText(`A=${A.toFixed(1)}°`, vA.x - 10, vA.y - 12);
    ctx.fillText(`B=${B.toFixed(1)}°`, vB.x + 6, vB.y + 14);
    ctx.fillText(`C=${C}°`, vC.x - 30, vC.y + 14);

    labelAt(ctx, `Side c = ${c.toFixed(3)}`, 10, 20, accent, 13);
    labelAt(ctx, `Law of Cosines: c² = a²+b²−2ab·cos(C)`, 10, 38, 'rgba(255,255,255,0.35)', 10);
  }, [a, b, C, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

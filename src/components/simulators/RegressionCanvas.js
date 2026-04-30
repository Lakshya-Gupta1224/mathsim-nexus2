import React, { useMemo } from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes, drawDot, labelAt } from './canvasUtils';

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function RegressionCanvas({ values, accent }) {
  const { corr, noise } = values;

  const points = useMemo(() => {
    const rand = seededRand(42);
    return Array.from({ length: 30 }, (_, i) => {
      const x = (i / 29) * 10 - 5;
      const y = corr * x + noise * (rand() * 2 - 1) * 3;
      return { x, y };
    });
  }, [corr, noise]);

  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const mReg = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const bReg = (sumY - mReg * sumX) / n;
  const meanY = sumY / n;
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (mReg * p.x + bReg)) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = 30 * zm, sy = 20 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = -8; i <= 8; i++) {
      ctx.beginPath(); ctx.moveTo(ox + i * sx, 0); ctx.lineTo(ox + i * sx, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, oy + i * sy); ctx.lineTo(w, oy + i * sy); ctx.stroke();
    }
    drawAxes(ctx, w, h, ox, oy);

    points.forEach(p => drawDot(ctx, ox + p.x * sx, oy - p.y * sy, 4, `${accent}90`));

    ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
    ctx.beginPath();
    const x0 = -w / (2 * sx), x1 = w / (2 * sx);
    ctx.moveTo(ox + x0 * sx, oy - (mReg * x0 + bReg) * sy);
    ctx.lineTo(ox + x1 * sx, oy - (mReg * x1 + bReg) * sy);
    ctx.stroke();

    labelAt(ctx, `ŷ = ${mReg.toFixed(3)}x + ${bReg.toFixed(3)}`, 10, 20, accent, 13);
    labelAt(ctx, `R² = ${r2.toFixed(4)}`, 10, 38, 'rgba(255,200,0,0.9)', 12);
    labelAt(ctx, `r (set) = ${corr.toFixed(2)}  noise = ${noise.toFixed(2)}`, 10, 56, 'rgba(255,255,255,0.35)', 11);
  }, [points, mReg, bReg, r2, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

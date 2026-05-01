import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function AreaCurveCanvas({ values, accent }) {
  const { a, b } = values;
  const lo = Math.min(a, b), hi = Math.max(a, b);
  const f = x => x * x;
  const exact = (hi ** 3 / 3) - (lo ** 3 / 3);

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = 40 * zm, sy = 30 * zm;
    const ox = w / 2 + panX, oy = h * 0.75 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);

    const steps = 200;
    ctx.beginPath();
    ctx.moveTo(ox + lo * sx, oy);
    for (let i = 0; i <= steps; i++) {
      const x = lo + (i / steps) * (hi - lo);
      ctx.lineTo(ox + x * sx, oy - f(x) * sy);
    }
    ctx.lineTo(ox + hi * sx, oy);
    ctx.closePath();
    ctx.fillStyle = `${accent}30`;
    ctx.fill();
    ctx.strokeStyle = `${accent}60`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(28,28,28,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox + lo * sx, 0); ctx.lineTo(ox + lo * sx, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + hi * sx, 0); ctx.lineTo(ox + hi * sx, oy); ctx.stroke();
    ctx.setLineDash([]);

    labelAt(ctx, 'a', ox + lo * sx - 5, oy + 14, '#22d3ee', 12);
    labelAt(ctx, 'b', ox + hi * sx - 5, oy + 14, '#f97316', 12);

    const xMin = (0 - ox) / sx;
    const xMax = (w - ox) / sx;
    plotFunction(ctx, f, xMin, xMax, 400, ox, oy, sx, sy, accent, 2.5);

    labelAt(ctx, `∫ₐᵇ x² dx`, 10, 20, accent, 14);
    labelAt(ctx, `a = ${a.toFixed(1)},  b = ${b.toFixed(1)}`, 10, 40, 'rgba(28,28,28,0.7)', 12);
    labelAt(ctx, `Area = ${exact.toFixed(4)}`, 10, 58, accent, 13);
    labelAt(ctx, `= b³/3 − a³/3`, 10, 76, 'rgba(28,28,28,0.6)', 11);
  }, [a, b, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

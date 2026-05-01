import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export default function TangentSlopeCanvas({ values, accent }) {
  const { x } = values;
  const f = t => t * t;
  const df = t => 2 * t;
  const slope = df(x);
  const yAt = f(x);

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const s = 40 * zm;
    const ox = w / 2 + panX, oy = h * 0.7 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);

    const xMin = (0 - ox) / s;
    const xMax = (w - ox) / s;
    plotFunction(ctx, f, xMin, xMax, 400, ox, oy, s, s, 'rgba(28,28,28,0.4)', 1.5);
    plotFunction(ctx, t => slope * (t - x) + yAt, xMin, xMax, 200, ox, oy, s, s, accent, 2.5);

    const px = ox + x * s, py = oy - yAt * s;
    drawDot(ctx, px, py, 6, accent);

    ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(28,28,28,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ox, py); ctx.stroke();
    ctx.setLineDash([]);

    labelAt(ctx, `f(x) = x²`, 10, 20, 'rgba(28,28,28,0.6)', 12);
    labelAt(ctx, `x = ${x.toFixed(2)}`, 10, 38, accent, 13);
    labelAt(ctx, `f(x) = ${yAt.toFixed(3)}`, 10, 56, 'rgba(28,28,28,0.7)', 12);
    labelAt(ctx, `f'(x) = 2x = ${slope.toFixed(3)}`, 10, 74, accent, 13);
  }, [x, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

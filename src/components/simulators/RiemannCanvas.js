import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function RiemannCanvas({ values, accent }) {
  const { n } = values;
  const a = 0, b = Math.PI;
  const f = x => Math.sin(x);
  const exact = 2;

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = (w * 0.8) / (b - a + 2) * zm, sy = h * 0.6 * zm;
    const ox = w * 0.1 + panX, oy = h * 0.85 + panY;
    clearCanvas(ctx, w, h);

    drawGrid(ctx, w, h, sx, sy * 0.5, ox, oy, 1);
    drawAxes(ctx, w, h, ox, oy);

    const dx = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const xi = a + i * dx;
      const fxi = f(xi + dx / 2);
      sum += fxi * dx;
      const rectX = ox + xi * sx;
      const rectH = fxi * sy;
      ctx.fillStyle = `${accent}30`;
      ctx.fillRect(rectX, oy - rectH, dx * sx, rectH);
      ctx.strokeStyle = `${accent}80`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(rectX, oy - rectH, dx * sx, rectH);
    }

    const xMin = (0 - ox) / sx;
    const xMax = (w - ox) / sx;
    plotFunction(ctx, f, xMin, xMax, 400, ox, oy, sx, sy, accent, 2.5);

    const error = Math.abs(exact - sum);
    labelAt(ctx, `n = ${n} rectangles`, 10, 20, accent, 13);
    labelAt(ctx, `Riemann Sum ≈ ${sum.toFixed(5)}`, 10, 38, 'rgba(255,255,255,0.6)', 12);
    labelAt(ctx, `Exact = 2.00000  Error = ${error.toFixed(5)}`, 10, 56, 'rgba(255,255,255,0.4)', 11);
  }, [n, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

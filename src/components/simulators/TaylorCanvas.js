import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

function factorial(n) {
  if (n <= 1) return 1;
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
}
function taylorSin(x, terms) {
  let sum = 0;
  for (let k = 0; k < terms; k++) {
    sum += (Math.pow(-1, k) * Math.pow(x, 2 * k + 1)) / factorial(2 * k + 1);
  }
  return sum;
}

export default function TaylorCanvas({ values, accent }) {
  const { n } = values;
  const terms = Math.floor((n + 1) / 2);

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = 40 * zm, sy = 60 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);

    const xMin = (0 - ox) / sx;
    const xMax = (w - ox) / sx;
    plotFunction(ctx, Math.sin, xMin, xMax, 600, ox, oy, sx, sy, 'rgba(28,28,28,0.3)', 1.5);
    plotFunction(ctx, x => taylorSin(x, terms), xMin, xMax, 600, ox, oy, sx, sy, accent, 2.5);

    labelAt(ctx, `Degree n = ${n}  (${terms} terms)`, 10, 20, accent, 13);
    labelAt(ctx, `sin(x) ≈ x − x³/3! + x⁵/5! − ...`, 10, 38, 'rgba(28,28,28,0.6)', 11);
    labelAt(ctx, `Dark: true sin(x)`, 10, 54, 'rgba(28,28,28,0.6)', 11);
  }, [n, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

// PolynomialCanvas.js
import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export function PolynomialCanvas({ values, accent }) {
  const { r1, r2, r3, r4 } = values;
  const fn = x => (x - r1) * (x - r2) * (x - r3) * (x - r4) / 10;
  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = 35;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    plotFunction(ctx, fn, -w / (2 * s) - 1, w / (2 * s) + 1, 500, ox, oy, s, s, accent, 2.5);
    [r1, r2, r3, r4].forEach(r => drawDot(ctx, ox + r * s, oy, 5, accent));
    labelAt(ctx, `Roots: ${[r1,r2,r3,r4].map(r=>r.toFixed(1)).join(', ')}`, 10, 20, accent, 12);
  }, [r1, r2, r3, r4, accent]);
  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}
export default PolynomialCanvas;

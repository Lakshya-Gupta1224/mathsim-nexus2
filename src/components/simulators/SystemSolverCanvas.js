import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export default function SystemSolverCanvas({ values, accent }) {
  const { a1, b1, a2, b2 } = values;
  // Line 1: y = a1*x + b1, Line 2: y = a2*x + b2
  // Intersection: a1*x + b1 = a2*x + b2 => x = (b2-b1)/(a1-a2)
  const denom = a1 - a2;
  let ix = null, iy = null;
  if (Math.abs(denom) > 0.001) {
    ix = (b2 - b1) / denom;
    iy = a1 * ix + b1;
  }

  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = 35;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    plotFunction(ctx, x => a1 * x + b1, -w / (2 * s) - 1, w / (2 * s) + 1, 300, ox, oy, s, s, accent, 2.5);
    plotFunction(ctx, x => a2 * x + b2, -w / (2 * s) - 1, w / (2 * s) + 1, 300, ox, oy, s, s, '#f97316', 2.5);
    if (ix !== null) {
      const px = ox + ix * s, py = oy - iy * s;
      drawDot(ctx, px, py, 6, '#ffffff');
      labelAt(ctx, `(${ix.toFixed(2)}, ${iy.toFixed(2)})`, px + 8, py - 8, '#ffffff', 11);
    } else {
      labelAt(ctx, 'Parallel — no intersection', w / 2 - 60, 20, '#ef4444', 12);
    }
    labelAt(ctx, `L1: y=${a1.toFixed(1)}x+${b1.toFixed(1)}`, 10, 20, accent, 12);
    labelAt(ctx, `L2: y=${a2.toFixed(1)}x+${b2.toFixed(1)}`, 10, 36, '#f97316', 12);
  }, [a1, b1, a2, b2, accent]);
  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

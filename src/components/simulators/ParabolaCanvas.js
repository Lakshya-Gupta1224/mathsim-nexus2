import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export default function ParabolaCanvas({ values, accent }) {
  const { a, h, k } = values;
  const canvasRef = useCanvas((ctx, w, cv) => {
    const ox = w / 2, oy = cv / 2, s = 35;
    clearCanvas(ctx, w, cv);
    drawGrid(ctx, w, cv, s, s, ox, oy);
    drawAxes(ctx, w, cv, ox, oy);
    plotFunction(ctx, x => a * (x - h) ** 2 + k, -w / (2 * s) - 1, w / (2 * s) + 1, 400, ox, oy, s, s, accent, 2.5);
    // Vertex dot
    drawDot(ctx, ox + h * s, oy - k * s, 5, accent);
    labelAt(ctx, `Vertex (${h.toFixed(1)}, ${k.toFixed(1)})`, ox + h * s + 8, oy - k * s - 8, accent, 11);
    labelAt(ctx, `y = ${a.toFixed(2)}(x − ${h.toFixed(1)})² + ${k.toFixed(1)}`, 10, 20, accent, 12);
  }, [a, h, k, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

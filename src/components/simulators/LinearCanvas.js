import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function LinearCanvas({ values, accent }) {
  const { m, c } = values;
  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = 35;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    plotFunction(ctx, x => m * x + c, -w / (2 * s) - 1, w / (2 * s) + 1, 300, ox, oy, s, s, accent, 2.5);
    // Info
    labelAt(ctx, `y = ${m.toFixed(2)}x + ${c.toFixed(2)}`, 10, 20, accent, 13);
    labelAt(ctx, `slope = ${m.toFixed(2)}`, 10, 38, 'rgba(255,255,255,0.5)', 11);
    labelAt(ctx, `y-int = ${c.toFixed(2)}`, 10, 54, 'rgba(255,255,255,0.5)', 11);
  }, [m, c, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

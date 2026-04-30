import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function FourierCanvas({ values, accent }) {
  const { h1, h2, h3 } = values;
  const fn = x => h1 * Math.sin(x) + h2 * Math.sin(3 * x) + h3 * Math.sin(5 * x);
  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, sx = 40, sy = 40;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    // Individual harmonics (dim)
    plotFunction(ctx, x => h1 * Math.sin(x), -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, 'rgba(99,102,241,0.4)', 1.5);
    plotFunction(ctx, x => h2 * Math.sin(3*x), -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, 'rgba(236,72,153,0.4)', 1.5);
    plotFunction(ctx, x => h3 * Math.sin(5*x), -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, 'rgba(245,158,11,0.4)', 1.5);
    // Sum
    plotFunction(ctx, fn, -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, accent, 2.5);
    labelAt(ctx, `f(x) = ${h1.toFixed(2)}·sin(x) + ${h2.toFixed(2)}·sin(3x) + ${h3.toFixed(2)}·sin(5x)`, 10, 20, accent, 11);
  }, [h1, h2, h3, accent]);
  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export default function TangentSlopeCanvas({ values, accent }) {
  const { x } = values;
  const f = t => t * t;
  const df = t => 2 * t; // f'(x) = 2x for x^2
  const slope = df(x);
  const yAt = f(x);

  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h * 0.7, s = 40;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);

    // f(x) = x^2
    plotFunction(ctx, f, -w/(2*s)-1, w/(2*s)+1, 400, ox, oy, s, s, 'rgba(255,255,255,0.3)', 1.5);

    // Tangent line: y - yAt = slope*(x - x0) => y = slope*(t-x)+yAt
    plotFunction(ctx, t => slope * (t - x) + yAt, -w/(2*s)-1, w/(2*s)+1, 200, ox, oy, s, s, accent, 2.5);

    // Point
    const px = ox + x * s, py = oy - yAt * s;
    drawDot(ctx, px, py, 6, accent);

    // Dashed drop lines
    ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ox, py); ctx.stroke();
    ctx.setLineDash([]);

    labelAt(ctx, `f(x) = x²`, 10, 20, 'rgba(255,255,255,0.4)', 12);
    labelAt(ctx, `x = ${x.toFixed(2)}`, 10, 38, accent, 13);
    labelAt(ctx, `f(x) = ${yAt.toFixed(3)}`, 10, 56, 'rgba(255,255,255,0.5)', 12);
    labelAt(ctx, `f'(x) = 2x = ${slope.toFixed(3)}`, 10, 74, accent, 13);
  }, [x, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

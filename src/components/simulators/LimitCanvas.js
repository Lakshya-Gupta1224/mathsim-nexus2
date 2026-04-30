import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export default function LimitCanvas({ values, accent }) {
  const { h, x0 } = values;
  const f = x => x * x;
  const secantSlope = (f(x0 + h) - f(x0)) / h;
  const trueSlope = 2 * x0; // derivative of x^2

  const canvasRef = useCanvas((ctx, w, cv) => {
    const ox = w / 2, oy = cv * 0.65, s = 40;
    clearCanvas(ctx, w, cv);
    drawGrid(ctx, w, cv, s, s, ox, oy);
    drawAxes(ctx, w, cv, ox, oy);

    // f(x) = x^2
    plotFunction(ctx, f, -w/(2*s)-1, w/(2*s)+1, 400, ox, oy, s, s, 'rgba(255,255,255,0.25)', 1.5);

    // Secant line through (x0, f(x0)) and (x0+h, f(x0+h))
    plotFunction(ctx, t => f(x0) + secantSlope * (t - x0), -w/(2*s)-1, w/(2*s)+1, 200, ox, oy, s, s, accent, 2.5);

    // True tangent (dim)
    plotFunction(ctx, t => f(x0) + trueSlope * (t - x0), -w/(2*s)-1, w/(2*s)+1, 200, ox, oy, s, s, 'rgba(255,255,255,0.2)', 1.5);

    // Points
    const p1x = ox + x0 * s, p1y = oy - f(x0) * s;
    const p2x = ox + (x0 + h) * s, p2y = oy - f(x0 + h) * s;
    drawDot(ctx, p1x, p1y, 5, '#ffffff');
    drawDot(ctx, p2x, p2y, 5, accent);

    // h arrow
    ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(255,200,0,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p1x, oy + 15); ctx.lineTo(p2x, oy + 15); ctx.stroke();
    ctx.setLineDash([]);
    labelAt(ctx, `h`, (p1x + p2x) / 2 - 4, oy + 28, 'rgba(255,200,0,0.7)', 11);

    labelAt(ctx, `h = ${h.toFixed(3)}`, 10, 20, accent, 13);
    labelAt(ctx, `Secant slope = [f(x+h)−f(x)]/h = ${secantSlope.toFixed(4)}`, 10, 38, accent, 11);
    labelAt(ctx, `True f'(x₀) = 2·${x0} = ${trueSlope.toFixed(4)}`, 10, 56, 'rgba(255,255,255,0.4)', 11);
    labelAt(ctx, `Error = ${Math.abs(secantSlope - trueSlope).toFixed(5)}`, 10, 72, 'rgba(255,100,100,0.7)', 11);
  }, [h, x0, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

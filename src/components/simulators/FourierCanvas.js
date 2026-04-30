import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function FourierCanvas({ values, accent }) {
  const { h1, h2, h3 } = values;
  const fn = x => h1 * Math.sin(x) + h2 * Math.sin(3 * x) + h3 * Math.sin(5 * x);
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = 40 * zm, sy = 40 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    plotFunction(ctx, x => h1 * Math.sin(x), -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, 'rgba(99,102,241,0.4)', 1.5);
    plotFunction(ctx, x => h2 * Math.sin(3*x), -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, 'rgba(236,72,153,0.4)', 1.5);
    plotFunction(ctx, x => h3 * Math.sin(5*x), -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, 'rgba(245,158,11,0.4)', 1.5);
    plotFunction(ctx, fn, -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, accent, 2.5);
    labelAt(ctx, `f(x) = ${h1.toFixed(2)}·sin(x) + ${h2.toFixed(2)}·sin(3x) + ${h3.toFixed(2)}·sin(5x)`, 10, 20, accent, 11);
  }, [h1, h2, h3, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

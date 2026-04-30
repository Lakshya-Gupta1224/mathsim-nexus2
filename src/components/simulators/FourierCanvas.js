import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function FourierCanvas({ values, accent }) {
  const { h1, h2, h3, shiftX = 0, shiftY = 0 } = values;
  const fn = x => h1 * Math.sin(x - shiftX) + h2 * Math.sin(3 * (x - shiftX)) + h3 * Math.sin(5 * (x - shiftX)) + shiftY;
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = 40 * zm, sy = 40 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    const xMin = (0 - ox) / sx;
    const xMax = (w - ox) / sx;
    plotFunction(ctx, x => h1 * Math.sin(x - shiftX) + shiftY, xMin, xMax, 600, ox, oy, sx, sy, 'rgba(99,102,241,0.4)', 1.5);
    plotFunction(ctx, x => h2 * Math.sin(3*(x - shiftX)) + shiftY, xMin, xMax, 600, ox, oy, sx, sy, 'rgba(236,72,153,0.4)', 1.5);
    plotFunction(ctx, x => h3 * Math.sin(5*(x - shiftX)) + shiftY, xMin, xMax, 600, ox, oy, sx, sy, 'rgba(245,158,11,0.4)', 1.5);
    plotFunction(ctx, fn, xMin, xMax, 600, ox, oy, sx, sy, accent, 2.5);
    labelAt(ctx, `f(x) = ${h1.toFixed(2)}·sin(x) + ${h2.toFixed(2)}·sin(3x) + ${h3.toFixed(2)}·sin(5x)`, 10, 20, accent, 11);
  }, [h1, h2, h3, shiftX, shiftY, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

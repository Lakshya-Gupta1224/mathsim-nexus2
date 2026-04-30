import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export default function SystemSolverCanvas({ values, accent }) {
  const { a1, b1, a2, b2 } = values;
  const denom = a1 - a2;
  let ix = null, iy = null;
  if (Math.abs(denom) > 0.001) {
    ix = (b2 - b1) / denom;
    iy = a1 * ix + b1;
  }

  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const s = 35 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    const xMin = (0 - ox) / s;
    const xMax = (w - ox) / s;
    plotFunction(ctx, x => a1 * x + b1, xMin, xMax, 300, ox, oy, s, s, accent, 2.5);
    plotFunction(ctx, x => a2 * x + b2, xMin, xMax, 300, ox, oy, s, s, '#f97316', 2.5);
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

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

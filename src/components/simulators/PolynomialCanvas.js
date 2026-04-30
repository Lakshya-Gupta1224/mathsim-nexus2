// PolynomialCanvas.js
import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export function PolynomialCanvas({ values, accent }) {
  const { r1, r2, r3, r4, shiftX = 0, shiftY = 0 } = values;
  const fn = x => (x - shiftX - r1) * (x - shiftX - r2) * (x - shiftX - r3) * (x - shiftX - r4) / 10 + shiftY;
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const s = 35 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    const xMin = (0 - ox) / s;
    const xMax = (w - ox) / s;
    plotFunction(ctx, fn, xMin, xMax, 500, ox, oy, s, s, accent, 2.5);
    [r1, r2, r3, r4].forEach(r => drawDot(ctx, ox + (r + shiftX) * s, oy - shiftY * s, 5, accent));
    labelAt(ctx, `Roots: ${[r1,r2,r3,r4].map(r=>(r + shiftX).toFixed(1)).join(', ')}`, 10, 20, accent, 12);
  }, [r1, r2, r3, r4, shiftX, shiftY, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
export default PolynomialCanvas;

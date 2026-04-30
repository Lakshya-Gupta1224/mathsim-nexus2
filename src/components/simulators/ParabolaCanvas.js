import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, drawDot, labelAt } from './canvasUtils';

export default function ParabolaCanvas({ values, accent }) {
  const { a, h, k, shiftX = 0, shiftY = 0 } = values;
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, cv, zm, panX, panY) => {
    const s = 35 * zm;
    const ox = w / 2 + panX, oy = cv / 2 + panY;
    clearCanvas(ctx, w, cv);
    drawGrid(ctx, w, cv, s, s, ox, oy);
    drawAxes(ctx, w, cv, ox, oy);
    plotFunction(ctx, x => a * (x - h - shiftX) ** 2 + k + shiftY, -w / (2 * s) - 1, w / (2 * s) + 1, 400, ox, oy, s, s, accent, 2.5);
    drawDot(ctx, ox + (h + shiftX) * s, oy - (k + shiftY) * s, 5, accent);
    labelAt(ctx, `Vertex (${(h + shiftX).toFixed(1)}, ${(k + shiftY).toFixed(1)})`, ox + (h + shiftX) * s + 8, oy - (k + shiftY) * s - 8, accent, 11);
    labelAt(ctx, `y = ${a.toFixed(2)}(x − ${(h + shiftX).toFixed(1)})² + ${(k + shiftY).toFixed(1)}`, 10, 20, accent, 12);
  }, [a, h, k, shiftX, shiftY, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

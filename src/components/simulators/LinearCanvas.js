import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function LinearCanvas({ values, accent }) {
  const { m, c, shiftX = 0, shiftY = 0 } = values;
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const s = 35 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    const xMin = (0 - ox) / s;
    const xMax = (w - ox) / s;
    plotFunction(ctx, x => m * (x - shiftX) + c + shiftY, xMin, xMax, 300, ox, oy, s, s, accent, 2.5);
    labelAt(ctx, `y = ${m.toFixed(2)}x + ${c.toFixed(2)}`, 10, 20, accent, 13);
    labelAt(ctx, `slope = ${m.toFixed(2)}`, 10, 38, 'rgba(255,255,255,0.5)', 11);
    labelAt(ctx, `y-int = ${c.toFixed(2)}`, 10, 54, 'rgba(255,255,255,0.5)', 11);
  }, [m, c, shiftX, shiftY, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

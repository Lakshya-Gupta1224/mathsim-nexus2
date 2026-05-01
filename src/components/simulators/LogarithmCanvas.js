import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function LogarithmCanvas({ values, accent }) {
  const { b, shiftX = 0, shiftY = 0 } = values;
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const s = 40 * zm;
    const ox = w / 6 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    const xMin = (0 - ox) / s;
    const xMax = (w - ox) / s;
    plotFunction(ctx, x => Math.log(x - shiftX) / Math.log(b) + shiftY, xMin, xMax, 400, ox, oy, s, s, accent, 2.5);
    plotFunction(ctx, x => Math.log(x - shiftX) + shiftY, xMin, xMax, 400, ox, oy, s, s, 'rgba(28,28,28,0.3)', 1.5);
    labelAt(ctx, `y = log₍${b.toFixed(2)}₎(x - ${shiftX.toFixed(1)}) + ${shiftY.toFixed(1)}`, 10, 20, accent, 13);
    labelAt(ctx, 'dark: ln(x)', 10, 38, 'rgba(28,28,28,0.6)', 11);
  }, [b, shiftX, shiftY, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

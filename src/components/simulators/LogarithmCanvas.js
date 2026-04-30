import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function LogarithmCanvas({ values, accent }) {
  const { b } = values;
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const s = 40 * zm;
    const ox = w / 6 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, s, s, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    plotFunction(ctx, x => Math.log(x) / Math.log(b), 0.05, w / s + 1, 400, ox, oy, s, s, accent, 2.5);
    plotFunction(ctx, x => Math.log(x), 0.05, w / s + 1, 400, ox, oy, s, s, 'rgba(255,255,255,0.2)', 1.5);
    labelAt(ctx, `y = log₍${b.toFixed(2)}₎(x)`, 10, 20, accent, 13);
    labelAt(ctx, 'gray: ln(x)', 10, 38, 'rgba(255,255,255,0.3)', 11);
  }, [b, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

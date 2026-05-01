import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function WaveMakerCanvas({ values, accent }) {
  const { A, omega, phi, shiftX = 0, shiftY = 0 } = values;
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const sx = 40 * zm, sy = 30 * zm;
    const ox = w / 2 + panX, oy = h / 2 + panY;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    const xMin = (0 - ox) / sx;
    const xMax = (w - ox) / sx;
    plotFunction(ctx, x => A * Math.sin(omega * (x - shiftX) + phi) + shiftY, xMin, xMax, 600, ox, oy, sx, sy, accent, 2.5);
    const period = (2 * Math.PI) / omega;
    labelAt(ctx, `y = ${A.toFixed(2)} · sin(${omega.toFixed(2)}x + ${phi.toFixed(2)})`, 10, 20, accent, 12);
    labelAt(ctx, `Period: ${period.toFixed(2)}  Amplitude: ${A.toFixed(2)}`, 10, 36, 'rgba(28,28,28,0.6)', 11);
  }, [A, omega, phi, shiftX, shiftY, accent]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}

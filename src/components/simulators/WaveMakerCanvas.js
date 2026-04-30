import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

export default function WaveMakerCanvas({ values, accent }) {
  const { A, omega, phi } = values;
  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, sx = 40, sy = 30;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);
    plotFunction(ctx, x => A * Math.sin(omega * x + phi), -w / (2 * sx), w / (2 * sx), 600, ox, oy, sx, sy, accent, 2.5);
    // Period line indicators
    const period = (2 * Math.PI) / omega;
    labelAt(ctx, `y = ${A.toFixed(2)} · sin(${omega.toFixed(2)}x + ${phi.toFixed(2)})`, 10, 20, accent, 12);
    labelAt(ctx, `Period: ${period.toFixed(2)}  Amplitude: ${A.toFixed(2)}`, 10, 36, 'rgba(255,255,255,0.4)', 11);
  }, [A, omega, phi, accent]);
  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

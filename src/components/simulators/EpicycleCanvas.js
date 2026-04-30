import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes } from './canvasUtils';

export default function EpicycleCanvas({ values, accent }) {
  const { f1, f2 } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const ox = w / 2 + panX, oy = h / 2 + panY, s = 50 * zm; 
    clearCanvas(ctx, w, h); 
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 2; 
    ctx.beginPath();
    for(let t = 0; t <= Math.PI * 2; t += 0.01) {
      const px = ox + (Math.cos(f1 * t) * 2 + Math.cos(f2 * t)) * s;
      const py = oy - (Math.sin(f1 * t) * 2 + Math.sin(f2 * t)) * s;
      t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    } 
    ctx.stroke();
  }, [f1, f2, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
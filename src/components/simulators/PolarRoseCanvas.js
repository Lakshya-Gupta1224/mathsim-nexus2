import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes, drawGrid } from './canvasUtils';

export default function PolarRoseCanvas({ values, accent }) {
  const { k } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const ox = w / 2 + panX, oy = h / 2 + panY, s = Math.min(w, h) * 0.4 * zm; 
    clearCanvas(ctx, w, h); 
    drawGrid(ctx, w, h, s, s, ox, oy, 1);
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 2; 
    ctx.beginPath();
    
    for(let t = 0; t <= Math.PI * 20; t += 0.05) {
      const r = Math.cos(k * t); 
      const px = ox + r * Math.cos(t) * s; 
      const py = oy - r * Math.sin(t) * s;
      t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    } 
    ctx.stroke();
  }, [k, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
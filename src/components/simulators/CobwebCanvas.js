import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes, plotFunction } from './canvasUtils';

export default function CobwebCanvas({ values, accent }) {
  const { r, x0 } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const s = Math.min(w, h) * 0.7 * zm;
    const ox = w * 0.1 + panX, oy = h * 0.9 + panY; 
    clearCanvas(ctx, w, h); 
    drawAxes(ctx, w, h, ox, oy);
    
    const f = x => r * x * (1 - x);
    plotFunction(ctx, x => x, 0, 1, 100, ox, oy, s, s, 'rgba(255,255,255,0.2)', 1);
    plotFunction(ctx, f, 0, 1, 100, ox, oy, s, s, '#22d3ee', 2);
    
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 1; 
    ctx.beginPath();
    
    let x = x0, y = 0; 
    ctx.moveTo(ox + x * s, oy - y * s);
    for(let i = 0; i < 50; i++) {
      y = f(x); 
      ctx.lineTo(ox + x * s, oy - y * s);
      x = y; 
      ctx.lineTo(ox + x * s, oy - y * s);
    } 
    ctx.stroke();
  }, [r, x0, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
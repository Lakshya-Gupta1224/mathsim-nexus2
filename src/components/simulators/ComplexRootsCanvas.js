import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes, drawDot, drawGrid } from './canvasUtils';

export default function ComplexRootsCanvas({ values, accent }) {
  const { n } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const ox = w / 2 + panX, oy = h / 2 + panY, s = 100 * zm; 
    clearCanvas(ctx, w, h); 
    drawGrid(ctx, w, h, s, s, ox, oy, 1);
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = 'rgba(28,28,28,0.3)'; 
    ctx.beginPath(); 
    ctx.arc(ox, oy, s, 0, Math.PI * 2); 
    ctx.stroke();
    
    for(let k = 0; k < n; k++) {
      const ang = (Math.PI * 2 * k) / n; 
      drawDot(ctx, ox + Math.cos(ang) * s, oy - Math.sin(ang) * s, 6, accent);
    }
  }, [n, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
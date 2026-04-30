import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes, drawDot } from './canvasUtils';

export default function ConicCanvas({ values, accent }) {
  const { e } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const ox = w / 2 + panX, oy = h / 2 + panY, s = 20 * zm; 
    clearCanvas(ctx, w, h); 
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; 
    ctx.beginPath(); 
    ctx.moveTo(ox - 5 * s, 0); 
    ctx.lineTo(ox - 5 * s, h); 
    ctx.stroke(); 
    
    drawDot(ctx, ox, oy, 5, '#f97316');
    
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 2; 
    ctx.beginPath();
    for(let t = 0; t <= Math.PI * 2; t += 0.05) {
      const r = (e * 5) / (1 - e * Math.cos(t)); 
      if(r < 0 || r > 100) continue;
      const px = ox + r * Math.cos(t) * s, py = oy - r * Math.sin(t) * s;
      t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    } 
    ctx.stroke();
  }, [e, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
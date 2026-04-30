import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas } from './canvasUtils';

export default function ModuloCircleCanvas({ values, accent }) {
  const { n, m } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const ox = w / 2 + panX, oy = h / 2 + panY, r = Math.min(w, h) * 0.4 * zm; 
    clearCanvas(ctx, w, h);
    
    ctx.strokeStyle = `${accent}40`; 
    ctx.lineWidth = 1;
    for(let i = 0; i < n; i++) {
      const a1 = (i / n) * Math.PI * 2; 
      const a2 = ((i * m % n) / n) * Math.PI * 2;
      ctx.beginPath(); 
      ctx.moveTo(ox + Math.cos(a1) * r, oy + Math.sin(a1) * r); 
      ctx.lineTo(ox + Math.cos(a2) * r, oy + Math.sin(a2) * r); 
      ctx.stroke();
    }
  }, [n, m, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
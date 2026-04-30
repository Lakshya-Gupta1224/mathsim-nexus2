import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes, drawDot, drawGrid } from './canvasUtils';

export default function BezierCanvas({ values, accent }) {
  const { cx, cy, shiftX = 0, shiftY = 0 } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const ox = w / 2 + panX, oy = h / 2 + panY, s = 80 * zm; 
    clearCanvas(ctx, w, h); 
    drawGrid(ctx, w, h, s, s, ox, oy, 1);
    drawAxes(ctx, w, h, ox, oy);
    
    const p0 = { x: -2 + shiftX, y: -1 + shiftY }, 
          p1 = { x: cx + shiftX, y: cy + shiftY }, 
          p2 = { x: 2 + shiftX, y: 1 + shiftY };
    
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; 
    ctx.beginPath(); 
    ctx.moveTo(ox + p0.x * s, oy - p0.y * s); 
    ctx.lineTo(ox + p1.x * s, oy - p1.y * s); 
    ctx.lineTo(ox + p2.x * s, oy - p2.y * s); 
    ctx.stroke();
    
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 3; 
    ctx.beginPath(); 
    ctx.moveTo(ox + p0.x * s, oy - p0.y * s); 
    ctx.quadraticCurveTo(ox + p1.x * s, oy - p1.y * s, ox + p2.x * s, oy - p2.y * s); 
    ctx.stroke();
    
    drawDot(ctx, ox + p1.x * s, oy - p1.y * s, 6, '#f97316');
  }, [cx, cy, shiftX, shiftY, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
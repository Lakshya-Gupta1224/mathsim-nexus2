import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawAxes, drawDot } from './canvasUtils';

export default function BezierCanvas({ values, accent }) {
  const { cx, cy } = values;
  
  const ref = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = 80; 
    clearCanvas(ctx, w, h); 
    drawAxes(ctx, w, h, ox, oy);
    
    const p0 = { x: -2, y: -1 }, p1 = { x: cx, y: cy }, p2 = { x: 2, y: 1 };
    
    // Draw connecting lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; 
    ctx.beginPath(); 
    ctx.moveTo(ox + p0.x * s, oy - p0.y * s); 
    ctx.lineTo(ox + p1.x * s, oy - p1.y * s); 
    ctx.lineTo(ox + p2.x * s, oy - p2.y * s); 
    ctx.stroke();
    
    // Draw actual curve
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 3; 
    ctx.beginPath(); 
    ctx.moveTo(ox + p0.x * s, oy - p0.y * s); 
    ctx.quadraticCurveTo(ox + p1.x * s, oy - p1.y * s, ox + p2.x * s, oy - p2.y * s); 
    ctx.stroke();
    
    drawDot(ctx, ox + p1.x * s, oy - p1.y * s, 6, '#f97316');
  }, [cx, cy, accent]); 
  
  return <canvas ref={ref} className="w-full h-80 rounded-xl block" />;
}
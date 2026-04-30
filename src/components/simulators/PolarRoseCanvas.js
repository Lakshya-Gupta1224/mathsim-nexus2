import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawAxes } from './canvasUtils';

export default function PolarRoseCanvas({ values, accent }) {
  const { k } = values;
  
  const ref = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = Math.min(w, h) * 0.4; 
    clearCanvas(ctx, w, h); 
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
  
  return <canvas ref={ref} className="w-full h-80 rounded-xl block" />;
}
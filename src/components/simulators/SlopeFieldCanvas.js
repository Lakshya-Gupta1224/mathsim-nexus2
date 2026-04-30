import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawAxes } from './canvasUtils';

export default function SlopeFieldCanvas({ values, accent }) {
  const { c } = values;
  
  const ref = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = 30; 
    clearCanvas(ctx, w, h); 
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 1.5;
    for(let x = -10; x <= 10; x++) {
      for(let y = -10; y <= 10; y++) {
        const slope = c * x - y; 
        const ang = Math.atan(slope); 
        const len = 10;
        const px = ox + x * s, py = oy - y * s;
        ctx.beginPath(); 
        ctx.moveTo(px - Math.cos(ang) * len / 2, py + Math.sin(ang) * len / 2); 
        ctx.lineTo(px + Math.cos(ang) * len / 2, py - Math.sin(ang) * len / 2); 
        ctx.stroke();
      }
    }
  }, [c, accent]); 
  
  return <canvas ref={ref} className="w-full h-80 rounded-xl block" />;
}
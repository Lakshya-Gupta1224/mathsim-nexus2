import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawAxes, drawDot } from './canvasUtils';

export default function ComplexRootsCanvas({ values, accent }) {
  const { n } = values;
  
  const ref = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = 100; 
    clearCanvas(ctx, w, h); 
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; 
    ctx.beginPath(); 
    ctx.arc(ox, oy, s, 0, Math.PI * 2); 
    ctx.stroke();
    
    for(let k = 0; k < n; k++) {
      const ang = (Math.PI * 2 * k) / n; 
      drawDot(ctx, ox + Math.cos(ang) * s, oy - Math.sin(ang) * s, 6, accent);
    }
  }, [n, accent]); 
  
  return <canvas ref={ref} className="w-full h-80 rounded-xl block" />;
}
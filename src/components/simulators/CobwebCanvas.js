import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawAxes, plotFunction } from './canvasUtils';

export default function CobwebCanvas({ values, accent }) {
  const { r, x0 } = values;
  
  const ref = useCanvas((ctx, w, h) => {
    const ox = w * 0.1, oy = h * 0.9, s = Math.min(w, h) * 0.7; 
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
  
  return <canvas ref={ref} className="w-full h-80 rounded-xl block" />;
}
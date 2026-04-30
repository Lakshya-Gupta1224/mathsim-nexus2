import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas } from './canvasUtils';

export default function ModuloCircleCanvas({ values, accent }) {
  const { n, m } = values;
  
  const ref = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, r = Math.min(w, h) * 0.4; 
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
  
  return <canvas ref={ref} className="w-full h-80 rounded-xl block" />;
}
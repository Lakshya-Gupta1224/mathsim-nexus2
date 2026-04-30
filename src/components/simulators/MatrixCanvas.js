import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawAxes } from './canvasUtils';

export default function MatrixCanvas({ values, accent }) {
  const { a, b, c, d } = values;
  
  const ref = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, s = 40; 
    clearCanvas(ctx, w, h); 
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = `${accent}60`; 
    ctx.lineWidth = 1;
    for(let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(ox+(a*-5+c*i)*s, oy-(b*-5+d*i)*s); ctx.lineTo(ox+(a*5+c*i)*s, oy-(b*5+d*i)*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox+(a*i+c*-5)*s, oy-(b*i+d*-5)*s); ctx.lineTo(ox+(a*i+c*5)*s, oy-(b*i+d*5)*s); ctx.stroke();
    }
  }, [a, b, c, d, accent]); 
  
  return <canvas ref={ref} className="w-full h-80 rounded-xl block" />;
}
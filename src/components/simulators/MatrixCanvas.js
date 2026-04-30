import React from 'react';
import useInteractiveCanvas from './useInteractiveCanvas';
import ZoomControls from './ZoomControls';
import { clearCanvas, drawAxes, drawGrid } from './canvasUtils';

export default function MatrixCanvas({ values, accent }) {
  const { a, b, c, d } = values;
  
  const { canvasRef, zoom, zoomIn, zoomOut, resetView } = useInteractiveCanvas((ctx, w, h, zm, panX, panY) => {
    const ox = w / 2 + panX, oy = h / 2 + panY, s = 40 * zm; 
    clearCanvas(ctx, w, h); 
    drawGrid(ctx, w, h, s, s, ox, oy, 1);
    drawAxes(ctx, w, h, ox, oy);
    
    ctx.strokeStyle = `${accent}60`; 
    ctx.lineWidth = 1;
    for(let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(ox+(a*-5+c*i)*s, oy-(b*-5+d*i)*s); ctx.lineTo(ox+(a*5+c*i)*s, oy-(b*5+d*i)*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox+(a*i+c*-5)*s, oy-(b*i+d*-5)*s); ctx.lineTo(ox+(a*i+c*5)*s, oy-(b*i+d*5)*s); ctx.stroke();
    }
  }, [a, b, c, d, accent]); 
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-xl block" />
      <ZoomControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}
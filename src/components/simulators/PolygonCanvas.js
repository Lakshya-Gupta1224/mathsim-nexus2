import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, labelAt } from './canvasUtils';

export default function PolygonCanvas({ values, accent }) {
  const { n } = Math.round(values.n) ? { n: Math.round(values.n) } : values;
  const sides = Math.max(3, Math.round(n));
  const interiorAngle = ((sides - 2) * 180) / sides;
  const exteriorAngle = 360 / sides;
  const sumInterior = (sides - 2) * 180;

  const canvasRef = useCanvas((ctx, w, h) => {
    clearCanvas(ctx, w, h);
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38;

    // Draw polygon
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = -Math.PI / 2;
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = startAngle + i * angleStep;
      const px = cx + r * Math.cos(angle), py = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = `${accent}15`; ctx.fill();

    // Vertices
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const px = cx + r * Math.cos(angle), py = cy + r * Math.sin(angle);
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();

      // Vertex angle arc (small)
      ctx.beginPath();
      ctx.arc(px, py, 18, angle + Math.PI / 2, angle + Math.PI / 2 + ((sides - 2) * Math.PI) / sides);
      ctx.strokeStyle = 'rgba(255,200,0,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    }

    // Center dot
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();

    labelAt(ctx, `${sides}-sided polygon`, 10, 20, accent, 14);
    labelAt(ctx, `Sum of interior angles = ${sumInterior}°`, 10, 40, 'rgba(255,200,0,0.8)', 12);
    labelAt(ctx, `Each interior angle = ${interiorAngle.toFixed(2)}°`, 10, 58, 'rgba(255,255,255,0.5)', 11);
    labelAt(ctx, `Each exterior angle = ${exteriorAngle.toFixed(2)}°`, 10, 74, 'rgba(255,255,255,0.4)', 11);
    labelAt(ctx, `Formula: (n−2)×180°`, 10, 90, 'rgba(255,255,255,0.25)', 10);
  }, [sides, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

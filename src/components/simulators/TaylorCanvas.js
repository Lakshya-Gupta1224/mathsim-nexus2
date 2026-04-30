import React from 'react';
import useCanvas from './useCanvas';
import { clearCanvas, drawGrid, drawAxes, plotFunction, labelAt } from './canvasUtils';

// Taylor series sin(x) = sum_{k=0}^{n} (-1)^k * x^(2k+1) / (2k+1)!
function factorial(n) {
  if (n <= 1) return 1;
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
}
function taylorSin(x, terms) {
  let sum = 0;
  for (let k = 0; k < terms; k++) {
    sum += (Math.pow(-1, k) * Math.pow(x, 2 * k + 1)) / factorial(2 * k + 1);
  }
  return sum;
}

export default function TaylorCanvas({ values, accent }) {
  const { n } = values;
  const terms = Math.floor((n + 1) / 2); // degree n -> number of terms

  const canvasRef = useCanvas((ctx, w, h) => {
    const ox = w / 2, oy = h / 2, sx = 40, sy = 60;
    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, sx, sy, ox, oy);
    drawAxes(ctx, w, h, ox, oy);

    // True sin(x) dim
    plotFunction(ctx, Math.sin, -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, 'rgba(255,255,255,0.2)', 1.5);

    // Taylor approx
    plotFunction(ctx, x => taylorSin(x, terms), -w/(2*sx), w/(2*sx), 600, ox, oy, sx, sy, accent, 2.5);

    labelAt(ctx, `Degree n = ${n}  (${terms} terms)`, 10, 20, accent, 13);
    labelAt(ctx, `sin(x) ≈ x − x³/3! + x⁵/5! − ...`, 10, 38, 'rgba(255,255,255,0.3)', 11);
    labelAt(ctx, `White: true sin(x)`, 10, 54, 'rgba(255,255,255,0.3)', 11);
  }, [n, accent]);

  return <canvas ref={canvasRef} className="w-full h-80 rounded-xl" style={{ display: 'block' }} />;
}

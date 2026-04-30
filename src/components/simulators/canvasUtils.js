// canvasUtils.js — shared drawing helpers with zoom/pan support

export const DARK_BG = '#0f172a';
export const GRID_COLOR = 'rgba(255,255,255,0.05)';
export const AXIS_COLOR = 'rgba(255,255,255,0.2)';
export const LABEL_COLOR = 'rgba(255,255,255,0.4)';

export function clearCanvas(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = DARK_BG;
  ctx.fillRect(0, 0, w, h);
}

// Apply zoom and pan to base origin and scale
export function getTransform(w, h, baseScale, zoom = 1, panX = 0, panY = 0) {
  const s = baseScale * zoom;
  const ox = w / 2 + panX;
  const oy = h / 2 + panY;
  return { ox, oy, s };
}

export function drawGrid(ctx, w, h, xScale, yScale, ox, oy, step = 1) {
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;
  // vertical
  for (let gx = -50; gx <= 50; gx += step) {
    const px = ox + gx * xScale;
    if (px < -10 || px > w + 10) continue;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
  }
  // horizontal
  for (let gy = -50; gy <= 50; gy += step) {
    const py = oy - gy * yScale;
    if (py < -10 || py > h + 10) continue;
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
  }
}

export function drawAxes(ctx, w, h, ox, oy) {
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 1.5;
  // X axis
  ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
  // Y axis
  ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
}

export function drawAxisLabels(ctx, w, h, ox, oy, xScale, yScale, xLabel = 'x', yLabel = 'y') {
  ctx.fillStyle = LABEL_COLOR;
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  
  // X-axis ticks & labels
  for (let i = -20; i <= 20; i += 2) {
    const px = ox + i * xScale;
    if (px < 0 || px > w) continue;
    ctx.beginPath();
    ctx.moveTo(px, oy - 3);
    ctx.lineTo(px, oy + 3);
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillText(i.toString(), px, oy + 15);
  }
  
  // Y-axis ticks & labels
  ctx.textAlign = 'right';
  for (let i = -20; i <= 20; i += 2) {
    const py = oy - i * yScale;
    if (py < 0 || py > h) continue;
    ctx.beginPath();
    ctx.moveTo(ox - 3, py);
    ctx.lineTo(ox + 3, py);
    ctx.stroke();
    ctx.fillText(i.toString(), ox - 10, py + 4);
  }
  
  // Axis labels
  ctx.textAlign = 'center';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(xLabel, w - 20, oy - 20);
  ctx.textAlign = 'right';
  ctx.fillText(yLabel, ox - 20, 15);
}

export function plotFunction(ctx, fn, xMin, xMax, steps, ox, oy, xScale, yScale, color, lineWidth = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  let first = true;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    const y = fn(x);
    if (!isFinite(y) || Math.abs(y) > 1e6) { first = true; continue; }
    const px = ox + x * xScale;
    const py = oy - y * yScale;
    if (first) { ctx.moveTo(px, py); first = false; }
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

export function drawDot(ctx, px, py, r, color) {
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function labelAt(ctx, text, px, py, color = LABEL_COLOR, size = 11) {
  ctx.fillStyle = color;
  ctx.font = `${size}px monospace`;
  ctx.fillText(text, px, py);
}

export function drawDesmosPoint(ctx, px, py, text, color) {
  // Draw dot with background-colored stroke for the "pop" effect
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = DARK_BG; 
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw floating coordinate label
  if (text) {
    ctx.fillStyle = color;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(text, px + 10, py - 10);
  }
}
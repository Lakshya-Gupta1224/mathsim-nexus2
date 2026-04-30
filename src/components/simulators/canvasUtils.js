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

  // Determine dynamic step based on scale to prevent a solid block of lines when zoomed out
  let currentStep = step;
  if (xScale < 15) currentStep = step * 5;
  if (xScale < 3) currentStep = step * 25;
  if (xScale > 100) currentStep = step / 2;

  const minGx = Math.floor((-ox) / xScale) - 1;
  const maxGx = Math.ceil((w - ox) / xScale) + 1;

  // vertical
  for (let gx = minGx - (minGx % currentStep); gx <= maxGx; gx += currentStep) {
    const px = ox + gx * xScale;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
  }

  const minGy = Math.floor((oy - h) / yScale) - 1;
  const maxGy = Math.ceil(oy / yScale) + 1;

  // horizontal
  for (let gy = minGy - (minGy % currentStep); gy <= maxGy; gy += currentStep) {
    const py = oy - gy * yScale;
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
  }
  
  // Automatically draw axis labels for all simulators
  drawAxisLabels(ctx, w, h, ox, oy, xScale, yScale);
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
  
  let labelStep = 2;
  if (xScale < 15) labelStep = 10;
  if (xScale < 3) labelStep = 50;
  if (xScale > 100) labelStep = 1;

  const minX = Math.floor((-ox) / xScale) - 1;
  const maxX = Math.ceil((w - ox) / xScale) + 1;

  // X-axis ticks & labels
  ctx.textAlign = 'center';
  for (let i = minX - (minX % labelStep); i <= maxX; i += labelStep) {
    if (i === 0) continue; // skip origin to avoid overlap
    const px = ox + i * xScale;
    ctx.beginPath();
    ctx.moveTo(px, oy - 3);
    ctx.lineTo(px, oy + 3);
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Clamp to screen bounds
    let textY = oy + 15;
    if (textY < 20) textY = 20;
    if (textY > h - 10) textY = h - 10;
    
    // format to avoid long decimals
    ctx.fillText(Number.isInteger(i) ? i.toString() : i.toFixed(1), px, textY);
  }
  
  const minY = Math.floor((oy - h) / yScale) - 1;
  const maxY = Math.ceil(oy / yScale) + 1;

  // Y-axis ticks & labels
  for (let i = minY - (minY % labelStep); i <= maxY; i += labelStep) {
    if (i === 0) continue;
    const py = oy - i * yScale;
    ctx.beginPath();
    ctx.moveTo(ox - 3, py);
    ctx.lineTo(ox + 3, py);
    ctx.stroke();
    
    let textX = ox - 10;
    if (textX < 30) {
      ctx.textAlign = 'left';
      textX = 10;
    } else if (textX > w - 10) {
      ctx.textAlign = 'right';
      textX = w - 10;
    } else {
      ctx.textAlign = 'right';
    }
    
    ctx.fillText(Number.isInteger(i) ? i.toString() : i.toFixed(1), textX, py + 4);
  }
  
  // Axis labels
  ctx.font = 'bold 14px monospace';
  
  ctx.textAlign = 'right';
  let xLabelY = oy - 20;
  if (xLabelY < 20) xLabelY = 20;
  if (xLabelY > h - 20) xLabelY = h - 20;
  ctx.fillText(xLabel, w - 20, xLabelY);
  
  let yLabelX = ox - 20;
  if (yLabelX < 30) yLabelX = 30;
  if (yLabelX > w - 20) yLabelX = w - 20;
  ctx.fillText(yLabel, yLabelX, 20);
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
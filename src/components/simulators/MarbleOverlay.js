// MarbleOverlay.js — physics-driven marble run with free-standing bucket
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MarbleSimulation } from './MarblePhysics';

export default function MarbleOverlay({ curveFn, accent }) {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const animRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [dropX, setDropX] = useState(-3);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(null);

  // Bucket placed randomly in bottom-half of the viewport, NOT on the curve
  const [bucket, setBucket] = useState(() => ({
    x: (Math.random() * 6 - 3),         // x in [-3, 3]
    y: (Math.random() * -3 - 1),         // y in [-4, -1] (below center)
    width: 1.4,
    height: 1.0,
  }));

  const xMin = -8, xMax = 8, yMin = -6, yMax = 8;

  const drop = useCallback(() => {
    simRef.current = new MarbleSimulation(curveFn, {
      startX: dropX,
      startY: yMax - 0.5,
      gravity: 30, // Lowered gravity for a slower ball drop
      friction: 0.98,
      restitution: 0.35,
    });
    setRunning(true);
    setScore(null);
    setAttempts(a => a + 1);
  }, [curveFn, dropX, yMax]);

  const resetGame = useCallback(() => {
    setRunning(false);
    setScore(null);
    simRef.current = null;
  }, []);

  const randomizeBucket = useCallback(() => {
    setBucket({
      x: (Math.random() * 6 - 3),
      y: (Math.random() * -3 - 1),
      width: 1.4,
      height: 1.0,
    });
    setAttempts(0);
    setScore(null);
    setRunning(false);
    simRef.current = null;
  }, []);

  // Check if marble is inside the bucket
  const isInBucket = (mx, my) => {
    const hw = bucket.width / 2;
    return (
      mx > bucket.x - hw &&
      mx < bucket.x + hw &&
      my < bucket.y + bucket.height * 0.3 &&  // top opening
      my > bucket.y - bucket.height * 0.5      // bottom
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    if (W === 0 || H === 0) return;

    const scX = W / (xMax - xMin);
    const scY = H / (yMax - yMin);
    const toSX = (x) => (x - xMin) * scX;
    const toSY = (y) => H - (y - yMin) * scY;

    let lastTime = null;
    let alive = true;

    const drawBucket = () => {
      const bx = toSX(bucket.x);
      const by = toSY(bucket.y);
      const bw = bucket.width * scX;
      const bh = bucket.height * scY;
      const hw = bw / 2;

      // Bucket body — trapezoid shape (wider at top)
      const topW = hw;
      const botW = hw * 0.7;
      ctx.beginPath();
      ctx.moveTo(bx - topW, by);            // top-left
      ctx.lineTo(bx - botW, by + bh);       // bottom-left
      ctx.lineTo(bx + botW, by + bh);       // bottom-right
      ctx.lineTo(bx + topW, by);            // top-right
      ctx.closePath();

      // Fill with gradient
      const grd = ctx.createLinearGradient(bx, by, bx, by + bh);
      grd.addColorStop(0, 'rgba(255, 180, 0, 0.08)');
      grd.addColorStop(1, 'rgba(255, 140, 0, 0.2)');
      ctx.fillStyle = grd;
      ctx.fill();

      // Bucket walls — thick strokes for the sides and bottom (no top line — open)
      ctx.strokeStyle = 'rgba(255, 180, 0, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      // Left wall
      ctx.beginPath();
      ctx.moveTo(bx - topW, by);
      ctx.lineTo(bx - botW, by + bh);
      ctx.stroke();
      // Bottom
      ctx.beginPath();
      ctx.moveTo(bx - botW, by + bh);
      ctx.lineTo(bx + botW, by + bh);
      ctx.stroke();
      // Right wall
      ctx.beginPath();
      ctx.moveTo(bx + botW, by + bh);
      ctx.lineTo(bx + topW, by);
      ctx.stroke();

      // Small rim on top edges
      ctx.strokeStyle = 'rgba(255, 200, 50, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx - topW - 4, by);
      ctx.lineTo(bx - topW + 4, by);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + topW - 4, by);
      ctx.lineTo(bx + topW + 4, by);
      ctx.stroke();

      // Glow underneath
      const glowGrd = ctx.createRadialGradient(bx, by + bh * 0.5, 0, bx, by + bh * 0.5, bw);
      glowGrd.addColorStop(0, 'rgba(255, 180, 0, 0.06)');
      glowGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrd;
      ctx.fillRect(bx - bw, by - bh * 0.3, bw * 2, bh * 2);

      // Label
      ctx.fillStyle = 'rgba(255, 200, 50, 0.7)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🎯 BUCKET', bx, by - 8);
    };

    const render = (timestamp) => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#0c1322';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let gx = Math.ceil(xMin); gx <= xMax; gx++) {
        const px = toSX(gx);
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
      }
      for (let gy = Math.ceil(yMin); gy <= yMax; gy++) {
        const py = toSY(gy);
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
      }

      // Axes
      const axX = toSY(0), axY = toSX(0);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, axX); ctx.lineTo(W, axX); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(axY, 0); ctx.lineTo(axY, H); ctx.stroke();

      // Draw the curve
      ctx.strokeStyle = `${accent}cc`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= W; px += 2) {
        const x = xMin + (px / W) * (xMax - xMin);
        const y = curveFn(x);
        if (!isFinite(y) || Math.abs(y) > 1e4) { first = true; continue; }
        const sy = toSY(y);
        if (first) { ctx.moveTo(px, sy); first = false; }
        else ctx.lineTo(px, sy);
      }
      ctx.stroke();

      // Draw bucket (free-standing, not on the curve)
      drawBucket();

      // Drop indicator
      if (!running) {
        const dpx = toSX(dropX);
        const dpy = toSY(yMax - 0.5);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(dpx, 0); ctx.lineTo(dpx, H); ctx.stroke();
        ctx.setLineDash([]);

        // Ghost marble
        ctx.beginPath();
        ctx.arc(dpx, dpy, 8, 0, Math.PI * 2);
        ctx.fillStyle = `${accent}40`;
        ctx.fill();
        ctx.strokeStyle = `${accent}80`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`drop x = ${dropX.toFixed(1)}`, dpx, dpy + 22);
      }

      // Physics
      const sim = simRef.current;
      if (sim && running) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.03);
        lastTime = timestamp;

        for (let i = 0; i < 5; i++) sim.step(dt / 5);

        // Trail
        if (sim.trail.length > 1) {
          for (let i = 1; i < sim.trail.length; i++) {
            const t = i / sim.trail.length;
            ctx.strokeStyle = `rgba(255, 255, 255, ${t * 0.3})`;
            ctx.lineWidth = t * 2;
            ctx.beginPath();
            ctx.moveTo(toSX(sim.trail[i - 1].x), toSY(sim.trail[i - 1].y));
            ctx.lineTo(toSX(sim.trail[i].x), toSY(sim.trail[i].y));
            ctx.stroke();
          }
        }

        // Marble
        const mx = toSX(sim.x), my = toSY(sim.y);

        // Glow
        const mgrd = ctx.createRadialGradient(mx, my, 0, mx, my, 16);
        mgrd.addColorStop(0, `${accent}50`);
        mgrd.addColorStop(1, 'transparent');
        ctx.fillStyle = mgrd;
        ctx.fillRect(mx - 18, my - 18, 36, 36);

        // Body
        ctx.beginPath();
        ctx.arc(mx, my, 7, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Check bucket capture
        if (isInBucket(sim.x, sim.y)) {
          setScore('🎯 PERFECT! Marble in the bucket!');
          setRunning(false);
        }

        // Out of bounds
        if (sim.x < xMin - 2 || sim.x > xMax + 2 || sim.y < yMin - 3) {
          setScore('💨 Out of bounds — try again!');
          setRunning(false);
        }

        // Settled but missed
        if (sim.settled && !isInBucket(sim.x, sim.y)) {
          const dist = Math.sqrt((sim.x - bucket.x) ** 2 + (sim.y - bucket.y) ** 2);
          setScore(dist < 2 ? `Almost! ${dist.toFixed(1)} units from bucket` : `Missed — ${dist.toFixed(1)} units away`);
          setRunning(false);
        }

        // HUD
        const spd = Math.sqrt(sim.vx ** 2 + sim.vy ** 2);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`speed: ${spd.toFixed(0)}  bounces: ${sim.bounceCount}`, 6, H - 6);
      }

      // Score overlay when game ended
      if (score && !running) {
        const isPerfect = score.includes('PERFECT');
        ctx.fillStyle = isPerfect ? 'rgba(0, 50, 0, 0.75)' : 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = isPerfect ? '#fbbf24' : 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${isPerfect ? 24 : 16}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(score, W / 2, H / 2 - 10);
        
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '11px monospace';
        ctx.fillText(isPerfect ? "Great job! Click '🔄' to play a new level." : "Adjust the curve or drop position and try again.", W / 2, H / 2 + 20);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      alive = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curveFn, accent, running, dropX, bucket, xMin, xMax, yMin, yMax]);

  return (
    <div className="flex flex-col gap-3">
      <canvas
        ref={canvasRef}
        className="w-full rounded-xl block"
        style={{ height: 320, background: '#0c1322' }}
      />

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-slate-400 mb-1 block">Drop Position X</label>
          <input
            type="range"
            min={xMin + 1}
            max={xMax - 1}
            step={0.1}
            value={dropX}
            onChange={(e) => setDropX(parseFloat(e.target.value))}
            disabled={running}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${accent} 0%, ${accent} ${((dropX - xMin - 1) / (xMax - xMin - 2)) * 100}%, rgba(255,255,255,0.1) ${((dropX - xMin - 1) / (xMax - xMin - 2)) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="flex justify-between text-slate-600 text-xs mt-0.5">
            <span>{xMin + 1}</span>
            <span className="text-slate-400 font-mono">{dropX.toFixed(1)}</span>
            <span>{xMax - 1}</span>
          </div>
        </div>

        <button
          onClick={randomizeBucket}
          disabled={running}
          className={`px-4 py-2.5 rounded-lg text-lg font-bold transition shrink-0 ${
            running ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700' : 'bg-slate-700/50 border border-slate-500/50 text-slate-300 hover:bg-slate-600'
          }`}
          title="Reset Level"
        >
          🔄
        </button>

        <button
          onClick={running ? resetGame : drop}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0 ${
            running
              ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
              : 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-500/50 text-amber-200 hover:from-amber-500/40 hover:to-orange-500/40'
          }`}
        >
          {running ? '⏹ Stop' : '🎱 Drop!'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Attempts: <span className="text-white font-bold">{attempts}</span></span>
        {score && !running && (
          <span className={`text-xs font-bold ${score.includes('PERFECT') ? 'text-yellow-300' : score.includes('Almost') ? 'text-blue-300' : 'text-slate-400'}`}>
            {score}
          </span>
        )}
      </div>
    </div>
  );
}

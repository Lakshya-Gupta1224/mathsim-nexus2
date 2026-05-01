// VectorFieldBoat.js — WASD-controlled boat navigating through vector fields
import React, { useRef, useEffect, useState, useCallback } from 'react';

function getFieldAt(simulatorId, values, x, y) {
  switch (simulatorId) {
    case 'slopefield': {
      const slope = values.c * x - y;
      return { fx: 1, fy: slope };
    }
    case 'matrix': {
      return { fx: values.a * x + values.c * y, fy: values.b * x + values.d * y };
    }
    case 'vectoradder': {
      const r1 = (values.a1 * Math.PI) / 180;
      const r2 = (values.a2 * Math.PI) / 180;
      const fx = values.m1 * Math.cos(r1) + values.m2 * Math.cos(r2);
      const fy = values.m1 * Math.sin(r1) + values.m2 * Math.sin(r2);
      // Add position-dependent variation
      return { fx: fx + Math.sin(y * 0.5) * 0.5, fy: fy + Math.cos(x * 0.5) * 0.5 };
    }
    default:
      return { fx: 0, fy: 0 };
  }
}

// Seed-based obstacle generator
function generateObstacles(seed) {
  const obstacles = [];
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
  for (let i = 0; i < 6; i++) {
    obstacles.push({
      x: rand() * 8 - 4,
      y: rand() * 6 - 3,
      r: 0.3 + rand() * 0.5,
    });
  }
  return obstacles;
}

export default function VectorFieldBoat({ values, simulatorId, accent }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const keysRef = useRef({ w: false, a: false, s: false, d: false });
  const [gameState, setGameState] = useState('ready'); // ready | playing | won | lost
  const boatRef = useRef({ x: -5, y: 0, vx: 0, vy: 0, trail: [], health: 100 });
  const [obstacles] = useState(() => generateObstacles(42));
  const goalX = 5, goalY = 0, goalR = 0.8;

  const startGame = useCallback(() => {
    boatRef.current = { x: -5, y: 0, vx: 0, vy: 0, trail: [], health: 100 };
    setGameState('playing');
  }, []);

  const resetGame = useCallback(() => {
    boatRef.current = { x: -5, y: 0, vx: 0, vy: 0, trail: [], health: 100 };
    setGameState('ready');
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const onDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = true;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = true;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = true;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = true;
    };
    const onUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = false;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = false;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = false;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  // Animation loop
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

    const xMin = -7, xMax = 7, yMin = -5, yMax = 5;
    const sx = W / (xMax - xMin);
    const sy = H / (yMax - yMin);
    const toSX = (x) => (x - xMin) * sx;
    const toSY = (y) => H - (y - yMin) * sy;

    let lastTime = null;
    let running = true;

    const render = (timestamp) => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#F8F6F3';
      ctx.fillRect(0, 0, W, H);

      // Draw vector field arrows
      ctx.globalAlpha = 0.4;
      for (let x = xMin + 0.5; x <= xMax - 0.5; x += 1) {
        for (let y = yMin + 0.5; y <= yMax - 0.5; y += 1) {
          const { fx, fy } = getFieldAt(simulatorId, values, x, y);
          const mag = Math.sqrt(fx * fx + fy * fy);
          const maxLen = 0.35;
          const scale = mag > 0 ? Math.min(maxLen / mag, maxLen) : 0;
          const ax = fx * scale, ay = fy * scale;

          const px1 = toSX(x), py1 = toSY(y);
          const px2 = toSX(x + ax), py2 = toSY(y + ay);
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();

          // Arrowhead
          const ang = Math.atan2(py2 - py1, px2 - px1);
          ctx.beginPath();
          ctx.moveTo(px2, py2);
          ctx.lineTo(px2 - 5 * Math.cos(ang - 0.5), py2 - 5 * Math.sin(ang - 0.5));
          ctx.lineTo(px2 - 5 * Math.cos(ang + 0.5), py2 - 5 * Math.sin(ang + 0.5));
          ctx.closePath();
          ctx.fillStyle = accent;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Draw obstacles
      obstacles.forEach(ob => {
        const ox = toSX(ob.x), oy = toSY(ob.y), or = ob.r * sx;
        ctx.beginPath();
        ctx.arc(ox, oy, or, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow
        const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, or * 1.5);
        grd.addColorStop(0, 'rgba(239, 68, 68, 0.1)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(ox - or * 2, oy - or * 2, or * 4, or * 4);
      });

      // Draw goal
      const gx = toSX(goalX), gy = toSY(goalY), gr = goalR * sx;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(76, 175, 80, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#1C1C1C';
      ctx.font = 'bold 12px DM Sans';
      ctx.textAlign = 'center';
      ctx.fillText('GOAL', gx, gy + 4);

      // Draw start marker
      const startPx = toSX(-5), startPy = toSY(0);
      ctx.fillStyle = 'rgba(28, 28, 28, 0.6)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('START', startPx, startPy - 15);

      const boat = boatRef.current;

      if (gameState === 'playing') {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.03);
        lastTime = timestamp;

        // User thrust
        const thrust = 3;
        if (keysRef.current.w) boat.vy += thrust * dt;
        if (keysRef.current.s) boat.vy -= thrust * dt;
        if (keysRef.current.a) boat.vx -= thrust * dt;
        if (keysRef.current.d) boat.vx += thrust * dt;

        // Field force
        const { fx, fy } = getFieldAt(simulatorId, values, boat.x, boat.y);
        boat.vx += fx * dt * 0.5;
        boat.vy += fy * dt * 0.5;

        // Drag
        boat.vx *= 0.98;
        boat.vy *= 0.98;

        // Move
        boat.x += boat.vx * dt;
        boat.y += boat.vy * dt;

        // Trail
        boat.trail.push({ x: boat.x, y: boat.y });
        if (boat.trail.length > 200) boat.trail.shift();

        // Check obstacle collisions
        obstacles.forEach(ob => {
          const dist = Math.sqrt((boat.x - ob.x) ** 2 + (boat.y - ob.y) ** 2);
          if (dist < ob.r + 0.2) {
            boat.health -= 40;
            // Push away
            const dx = boat.x - ob.x;
            const dy = boat.y - ob.y;
            const d = Math.max(dist, 0.1);
            boat.vx += (dx / d) * 3;
            boat.vy += (dy / d) * 3;
          }
        });

        // Check goal
        const goalDist = Math.sqrt((boat.x - goalX) ** 2 + (boat.y - goalY) ** 2);
        if (goalDist < goalR) {
          setGameState('won');
        }

        // Check health / bounds
        if (boat.health <= 0 || boat.x < xMin - 1 || boat.x > xMax + 1 || boat.y < yMin - 1 || boat.y > yMax + 1) {
          setGameState('lost');
        }
      }

      // Draw boat trail
      if (boat.trail.length > 1) {
        for (let i = 1; i < boat.trail.length; i++) {
          const t = i / boat.trail.length;
          ctx.strokeStyle = `rgba(255,255,255,${t * 0.3})`;
          ctx.lineWidth = t * 1.5;
          ctx.beginPath();
          ctx.moveTo(toSX(boat.trail[i - 1].x), toSY(boat.trail[i - 1].y));
          ctx.lineTo(toSX(boat.trail[i].x), toSY(boat.trail[i].y));
          ctx.stroke();
        }
      }

      // Draw boat
      const bx = toSX(boat.x), by = toSY(boat.y);
      const angle = Math.atan2(boat.vy, boat.vx);
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(-angle);
      // Triangle boat shape
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-6, -7);
      ctx.lineTo(-6, 7);
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.strokeStyle = '#1C1C1C';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Health bar
      ctx.fillStyle = 'rgba(28, 28, 28, 0.3)';
      ctx.fillRect(10, H - 24, 100, 14);
      ctx.fillStyle = boat.health > 50 ? '#4CAF50' : boat.health > 20 ? '#F59D8A' : '#CFA8B8';
      ctx.fillRect(10, H - 24, Math.max(0, boat.health), 14);
      ctx.fillStyle = '#1C1C1C';
      ctx.font = '9px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`HP: ${Math.max(0, Math.round(boat.health))}`, 14, H - 14);

      // Game state messages
      if (gameState === 'won') {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.75)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#1C1C1C';
        ctx.font = 'bold 28px DM Sans';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 GOAL REACHED!', W / 2, H / 2);
        ctx.fillStyle = 'rgba(28, 28, 28, 0.8)';
        ctx.font = '14px Inter';
        ctx.fillText('Click Reset to try again', W / 2, H / 2 + 30);
      } else if (gameState === 'lost') {
        ctx.fillStyle = 'rgba(245, 157, 138, 0.75)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#1C1C1C';
        ctx.font = 'bold 28px DM Sans';
        ctx.textAlign = 'center';
        ctx.fillText('💥 CRASHED!', W / 2, H / 2);
        ctx.fillStyle = 'rgba(28, 28, 28, 0.8)';
        ctx.font = '14px Inter';
        ctx.fillText('Click Reset to try again', W / 2, H / 2 + 30);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => { running = false; if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [values, simulatorId, accent, gameState, obstacles]);

  return (
    <div className="flex flex-col gap-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-80 rounded-[12px] block border-2 border-[#1C1C1C]" 
        style={{ background: '#F8F6F3', boxShadow: '4px 4px 0px #1C1C1C' }} 
      />
      <div className="flex items-center gap-3">
        <button
          onClick={gameState === 'playing' ? resetGame : startGame}
          className={`px-4 py-2 rounded-[8px] text-xs font-bold uppercase tracking-wider transition shrink-0 border-2 border-[#1C1C1C] ${
            gameState === 'playing'
              ? 'bg-[#CFA8B8] text-[#1C1C1C] hover:bg-[#F59D8A]'
              : 'bg-[#F59D8A] text-[#1C1C1C] hover:bg-[#CFA8B8] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]'
          }`}
          style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '4px 4px 0px #1C1C1C' }}
        >
          {gameState === 'playing' ? 'Reset' : gameState === 'ready' ? '🚤 Start' : '🔄 Retry'}
        </button>
        <span className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {gameState === 'ready' ? 'Press Start, then use WASD to navigate' : 
           gameState === 'playing' ? 'Navigate to the green GOAL!' : ''}
        </span>
      </div>
    </div>
  );
}

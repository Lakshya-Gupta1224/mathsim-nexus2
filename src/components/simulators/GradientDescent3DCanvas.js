import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";

const COST_FUNCTIONS = {
  1: {
    name: 'Convex Bowl',
    f: (x, y) => (x * x + y * y) / 4,
    dx: (x, y) => x / 2,
    dy: (x, y) => y / 2
  },
  2: {
    name: 'Non-Convex Waves',
    f: (x, y) => Math.sin(x) + Math.cos(y) + 0.1 * (x * x + y * y),
    dx: (x, y) => Math.cos(x) + 0.2 * x,
    dy: (x, y) => -Math.sin(y) + 0.2 * y
  },
  3: {
    name: 'Steep Canyon',
    f: (x, y) => (Math.pow(x * x - y, 2) + Math.pow(1 - x, 2)) / 5,
    dx: (x, y) => (4 * x * (x * x - y) - 2 * (1 - x)) / 5,
    dy: (x, y) => (-2 * (x * x - y)) / 5
  }
};

function Surface({ fn, xRange, yRange, resolution, accent }) {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const { geometry } = useMemo(() => {
    const segs = resolution;
    const geom = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, segs, segs);
    const positions = geom.attributes.position;
    const colorArr = new Float32Array(positions.count * 3);
    
    let zMin = Infinity, zMax = -Infinity;
    const zValues = [];
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i) + (xMax + xMin) / 2;
      const y = positions.getY(i) + (yMax + yMin) / 2;
      let z = fn(x, y);
      if (!isFinite(z)) z = 0;
      z = Math.max(-5, Math.min(15, z)); // Clamp to reasonable bounds
      zValues.push(z);
      if (z < zMin) zMin = z;
      if (z > zMax) zMax = z;
    }

    const range = zMax - zMin || 1;
    const accentColor = new THREE.Color(accent);
    const lowColor = new THREE.Color("#1e3a5f");
    const highColor = accentColor;
    const peakColor = new THREE.Color("#ffffff");

    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, zValues[i]);
      const t = (zValues[i] - zMin) / range;
      let color;
      if (t < 0.5) {
        color = lowColor.clone().lerp(highColor, t * 2);
      } else {
        color = highColor.clone().lerp(peakColor, (t - 0.5) * 2);
      }
      colorArr[i * 3] = color.r;
      colorArr[i * 3 + 1] = color.g;
      colorArr[i * 3 + 2] = color.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));
    geom.computeVertexNormals();

    return { geometry: geom };
  }, [fn, xMin, xMax, yMin, yMax, resolution, accent]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} metalness={0.1} roughness={0.5} />
    </mesh>
  );
}

// Agent handles movement logic inside the 3D canvas
function Agent({ points, setPoints, playing, alpha, costData }) {
  const timer = useRef(0);
  
  useFrame((_, delta) => {
    if (!playing || points.length === 0) return;
    
    timer.current += delta;
    if (timer.current > 0.05) { // 20 steps per second
      timer.current = 0;
      
      const current = points[points.length - 1];
      const dx = costData.dx(current.x, current.y);
      const dy = costData.dy(current.x, current.y);
      
      const nextX = current.x - alpha * dx;
      const nextY = current.y - alpha * dy;
      
      // Stop if gradient is tiny
      if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) return;
      
      const nextZRaw = costData.f(nextX, nextY);
      const nextZ = Math.max(-5, Math.min(15, nextZRaw));
      
      setPoints(prev => [...prev, { x: nextX, y: nextY, z: nextZ }]);
    }
  });

  const pathVectors = useMemo(() => {
    // Math coordinates (x, y, z) map to ThreeJS coordinates: (x, z, -y)
    return points.map(p => new THREE.Vector3(p.x, p.z, -p.y)); 
  }, [points]);

  if (points.length === 0) return null;
  const current = points[points.length - 1];

  return (
    <group>
      {pathVectors.length > 1 && (
        <Line points={pathVectors} color="white" lineWidth={3} />
      )}
      <Sphere args={[0.2, 16, 16]} position={[current.x, current.z, -current.y]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* Downward light pointing at the agent */}
      <pointLight position={[current.x, current.z + 1, -current.y]} intensity={0.5} color="#ef4444" distance={3} />
    </group>
  );
}

export default function GradientDescent3DCanvas({ values, accent }) {
  const { alpha, costFn, startX, startY } = values;
  const costData = COST_FUNCTIONS[costFn] || COST_FUNCTIONS[1];

  const [points, setPoints] = useState([]);
  const [playing, setPlaying] = useState(false);

  // Reset when cost function or start position changes
  useEffect(() => {
    const initialZ = Math.max(-5, Math.min(15, costData.f(startX, startY)));
    setPoints([{ x: startX, y: startY, z: initialZ }]);
    setPlaying(false);
  }, [costFn, startX, startY, costData]);

  const handleStep = () => {
    if (points.length === 0) return;
    const current = points[points.length - 1];
    const dx = costData.dx(current.x, current.y);
    const dy = costData.dy(current.x, current.y);
    const nextX = current.x - alpha * dx;
    const nextY = current.y - alpha * dy;
    const nextZRaw = costData.f(nextX, nextY);
    const nextZ = Math.max(-5, Math.min(15, nextZRaw));
    setPoints(prev => [...prev, { x: nextX, y: nextY, z: nextZ }]);
  };

  const handleReset = () => {
    const initialZ = Math.max(-5, Math.min(15, costData.f(startX, startY)));
    setPoints([{ x: startX, y: startY, z: initialZ }]);
    setPlaying(false);
  };

  return (
    <div className="w-full relative rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 160px)', minHeight: 400, background: '#0a0f1a' }}>
      
      {/* UI Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          onClick={() => setPlaying(!playing)}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg ${playing ? 'bg-red-500/80 hover:bg-red-600/80 text-white' : 'bg-green-500/80 hover:bg-green-600/80 text-white'}`}
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button 
          onClick={handleStep}
          disabled={playing}
          className="px-4 py-2 rounded-lg font-bold text-sm bg-blue-500/80 hover:bg-blue-600/80 text-white disabled:opacity-50 transition shadow-lg"
        >
          ⏭ Step
        </button>
        <button 
          onClick={handleReset}
          className="px-4 py-2 rounded-lg font-bold text-sm bg-slate-700/80 hover:bg-slate-600/80 text-white transition shadow-lg"
        >
          ↺ Reset
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur border border-white/10 rounded-lg p-3 text-xs text-slate-300 min-w-32 shadow-xl">
        <p className="font-bold text-white mb-2 pb-1 border-b border-white/10">{costData.name}</p>
        <p>Iteration: <span className="font-mono text-cyan-300">{points.length - 1}</span></p>
        {points.length > 0 && (
          <div className="mt-2 space-y-1 font-mono text-[10px]">
            <p>X: {points[points.length-1].x.toFixed(3)}</p>
            <p>Y: {points[points.length-1].y.toFixed(3)}</p>
            <p className="mt-2 text-amber-300">Cost: {points[points.length-1].z.toFixed(4)}</p>
          </div>
        )}
      </div>

      <Canvas camera={{ position: [6, 6, 8], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, -5]} intensity={0.4} color={accent} />

        <Surface fn={costData.f} accent={accent} xRange={[-5, 5]} yRange={[-5, 5]} resolution={80} />
        <Agent points={points} setPoints={setPoints} playing={playing} alpha={alpha} costData={costData} />

        {/* Grid helper moved down slightly to avoid z-fighting with z=0 parts of surface */}
        <gridHelper args={[10, 20, '#1e293b', '#0f172a']} position={[0, -0.01, 0]} />

        <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} minDistance={2} maxDistance={20} />
      </Canvas>
    </div>
  );
}

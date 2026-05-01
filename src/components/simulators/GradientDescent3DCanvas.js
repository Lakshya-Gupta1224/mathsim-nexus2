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
    const lowColor = new THREE.Color("#F8F6F3");
    const midColor = new THREE.Color("#F59D8A");
    const highColor = new THREE.Color("#CFA8B8");
    const peakColor = new THREE.Color("#A8D5D2");

    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, zValues[i]);
      const t = (zValues[i] - zMin) / range;
      let color;
      if (t < 0.25) {
        color = lowColor.clone().lerp(midColor, t * 4);
      } else if (t < 0.5) {
        color = midColor.clone().lerp(highColor, (t - 0.25) * 4);
      } else if (t < 0.75) {
        color = highColor.clone().lerp(peakColor, (t - 0.5) * 4);
      } else {
        color = peakColor.clone().lerp(new THREE.Color("#F4F1EA"), (t - 0.75) * 4);
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
        <Line points={pathVectors} color="#1C1C1C" lineWidth={4} />
      )}
      <Sphere args={[0.2, 16, 16]} position={[current.x, current.z, -current.y]}>
        <meshStandardMaterial color="#F59D8A" emissive="#F59D8A" emissiveIntensity={0.3} />
      </Sphere>
      
      {/* Downward light pointing at the agent */}
      <pointLight position={[current.x, current.z + 1, -current.y]} intensity={0.5} color="#F59D8A" distance={3} />
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
    <div className="w-full relative rounded-[12px] overflow-hidden border-2 border-[#1C1C1C]" style={{ height: 'calc(100vh - 160px)', minHeight: 400, background: '#F8F6F3', boxShadow: '4px 4px 0px #1C1C1C' }}>
      
      {/* UI Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          onClick={() => setPlaying(!playing)}
          className={`px-4 py-2 rounded-[8px] font-bold text-sm transition border-2 border-[#1C1C1C] ${
            playing ? 'bg-[#CFA8B8] text-[#1C1C1C] hover:bg-[#F59D8A]' : 'bg-[#F59D8A] text-[#1C1C1C] hover:bg-[#CFA8B8]'
          } hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]`}
          style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '4px 4px 0px #1C1C1C' }}
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button 
          onClick={handleStep}
          disabled={playing}
          className="px-4 py-2 rounded-[8px] font-bold text-sm bg-[#A8D5D2] text-[#1C1C1C] disabled:opacity-50 transition border-2 border-[#1C1C1C] hover:bg-[#CFA8B8] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C] disabled:cursor-not-allowed"
          style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '4px 4px 0px #1C1C1C' }}
        >
          ⏭ Step
        </button>
        <button 
          onClick={handleReset}
          className="px-4 py-2 rounded-[8px] font-bold text-sm bg-white text-[#1C1C1C] transition border-2 border-[#1C1C1C] hover:bg-[#F4F1EA] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
          style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '4px 4px 0px #1C1C1C' }}
        >
          ↺ Reset
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10 bg-white border-2 border-[#1C1C1C] rounded-[8px] p-3 text-xs text-[#1C1C1C] min-w-32 shadow-[4px_4px_0px_#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p className="font-bold text-[#1C1C1C] mb-2 pb-1 border-b-2 border-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{costData.name}</p>
        <p>Iteration: <span className="font-mono text-[#F59D8A]">{points.length - 1}</span></p>
        {points.length > 0 && (
          <div className="mt-2 space-y-1 font-mono text-[10px]">
            <p>X: {points[points.length-1].x.toFixed(3)}</p>
            <p>Y: {points[points.length-1].y.toFixed(3)}</p>
            <p className="mt-2 text-[#A8D5D2]">Cost: {points[points.length-1].z.toFixed(4)}</p>
          </div>
        )}
      </div>

      <Canvas camera={{ position: [6, 6, 8], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.0} />
        <pointLight position={[-5, 5, -5]} intensity={0.6} color="#F59D8A" />

        <Surface fn={costData.f} accent={accent} xRange={[-5, 5]} yRange={[-5, 5]} resolution={80} />
        <Agent points={points} setPoints={setPoints} playing={playing} alpha={alpha} costData={costData} />

        {/* Grid helper moved down slightly to avoid z-fighting with z=0 parts of surface */}
        <gridHelper args={[10, 20, '#1C1C1C', 'rgba(28,28,28,0.1)']} position={[0, -0.01, 0]} />

        <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} minDistance={2} maxDistance={20} />
      </Canvas>
    </div>
  );
}

// Lorenz3DCanvas.js — Interactive 3D Lorenz attractor with time scrubbing
import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function lorenzStep(x, y, z, sigma, rho, beta, dt = 0.005) {
  return [
    x + sigma * (y - x) * dt,
    y + (x * (rho - z) - y) * dt,
    z + (x * y - beta * z) * dt,
  ];
}

function AttractorTrail({ sigma, rho, beta, maxSteps, currentStep, accent }) {
  const lineRef = useRef();
  const headRef = useRef();
  const points = useMemo(() => {
    const pts = [];
    let x = 0.1, y = 0, z = 0;
    for (let i = 0; i < maxSteps; i++) {
      [x, y, z] = lorenzStep(x, y, z, sigma, rho, beta);
      pts.push(new THREE.Vector3(x * 0.1, z * 0.1 - 2, y * 0.1));
    }
    return pts;
  }, [sigma, rho, beta, maxSteps]);

  // Create gradient colors
  const colors = useMemo(() => {
    const accentColor = new THREE.Color(accent);
    const startColor = new THREE.Color('#F8F6F3');
    const midColor = new THREE.Color('#F59D8A');
    const endColor = new THREE.Color('#1C1C1C');
    const arr = new Float32Array(maxSteps * 3);
    for (let i = 0; i < maxSteps; i++) {
      const t = i / maxSteps;
      let color;
      if (t < 0.5) {
        color = startColor.clone().lerp(midColor, t * 2);
      } else {
        color = midColor.clone().lerp(endColor, (t - 0.5) * 2);
      }
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, [maxSteps, accent]);

  useFrame(() => {
    if (!lineRef.current) return;
    const geom = lineRef.current.geometry;
    const visible = Math.min(currentStep, points.length);
    
    const positions = new Float32Array(visible * 3);
    const visibleColors = new Float32Array(visible * 3);
    for (let i = 0; i < visible; i++) {
      positions[i * 3] = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
      visibleColors[i * 3] = colors[i * 3];
      visibleColors[i * 3 + 1] = colors[i * 3 + 1];
      visibleColors[i * 3 + 2] = colors[i * 3 + 2];
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(visibleColors, 3));
    geom.setDrawRange(0, visible);
    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;

    // Update head position
    if (headRef.current && visible > 0) {
      const p = points[visible - 1];
      headRef.current.position.set(p.x, p.y, p.z);
    }
  });

  return (
    <>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.8} />
      </line>
      <mesh ref={headRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function AxisLabels() {
  return (
    <>
      <Text position={[4, -2, 0]} fontSize={0.2} color="rgba(255,255,255,0.3)">X</Text>
      <Text position={[0, -2, 4]} fontSize={0.2} color="rgba(255,255,255,0.3)">Y</Text>
      <Text position={[0, 3, 0]} fontSize={0.2} color="rgba(255,255,255,0.3)">Z</Text>
    </>
  );
}

export default function Lorenz3DCanvas({ values, accent }) {
  const { sigma, rho, beta } = values;
  const [playing, setPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const maxSteps = 8000;
  const animRef = useRef(null);

  // Auto-advance
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      setCurrentStep(s => {
        if (s >= maxSteps) return maxSteps;
        return s + 8;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [playing, maxSteps]);

  // Reset on param change
  useEffect(() => {
    setCurrentStep(0);
    setPlaying(true);
  }, [sigma, rho, beta]);

  const togglePlay = useCallback(() => setPlaying(p => !p), []);
  const resetAnim = useCallback(() => { setCurrentStep(0); setPlaying(true); }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full rounded-[12px] overflow-hidden border-2 border-[#1C1C1C]" style={{ height: 'calc(100vh - 210px)', minHeight: 400, background: '#F8F6F3', boxShadow: '4px 4px 0px #1C1C1C' }}>
        <Canvas camera={{ position: [4, 2.5, 4], fov: 50 }} dpr={[1, 2]}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 10, 5]} intensity={0.8} color="#F59D8A" />
          <pointLight position={[-3, 5, -3]} intensity={0.5} color="#CFA8B8" />
          
          <AttractorTrail
            sigma={sigma}
            rho={rho}
            beta={beta}
            maxSteps={maxSteps}
            currentStep={currentStep}
            accent={accent}
          />
          
          <gridHelper args={[8, 16, '#1C1C1C', 'rgba(28,28,28,0.1)']} position={[0, -2, 0]} />
          <AxisLabels />
          
          <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} minDistance={2} maxDistance={20} />
        </Canvas>
      </div>

      {/* Time scrub controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#F4F1EA] text-sm font-bold transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
          style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          onClick={resetAnim}
          className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#F4F1EA] text-xs font-bold transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
          style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
        >
          ⟳
        </button>
        <input
          type="range"
          min={0}
          max={maxSteps}
          step={1}
          value={currentStep}
          onChange={(e) => { setCurrentStep(parseInt(e.target.value)); setPlaying(false); }}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer border-2 border-[#1C1C1C]"
          style={{
            background: `linear-gradient(to right, #F59D8A 0%, #F59D8A ${(currentStep / maxSteps) * 100}%, #F4F1EA ${(currentStep / maxSteps) * 100}%, #F4F1EA 100%)`,
            boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)'
          }}
        />
        <span className="text-xs font-mono text-[#1C1C1C] min-w-[80px] text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
          {currentStep.toLocaleString()} / {maxSteps.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

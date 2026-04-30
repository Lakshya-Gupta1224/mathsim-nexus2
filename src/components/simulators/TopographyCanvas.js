// TopographyCanvas.js — Interactive 3D surface for multivariable calculus
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Environment } from "@react-three/drei";
import * as THREE from "three";

function Surface({ fn, accent, xRange, yRange, resolution }) {
  const meshRef = useRef();
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const { geometry, colors } = useMemo(() => {
    const segs = resolution;
    const geom = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, segs, segs);

    const positions = geom.attributes.position;
    const colorArr = new Float32Array(positions.count * 3);
    let zMin = Infinity,
      zMax = -Infinity;

    // First pass: compute z values
    const zValues = [];
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i) + (xMax + xMin) / 2;
      const y = positions.getY(i) + (yMax + yMin) / 2;
      let z = fn(x, y);
      if (!isFinite(z)) z = 0;
      z = Math.max(-5, Math.min(5, z));
      zValues.push(z);
      if (z < zMin) zMin = z;
      if (z > zMax) zMax = z;
    }

    // Second pass: set z positions and vertex colors
    const range = zMax - zMin || 1;
    const accentColor = new THREE.Color(accent);
    const lowColor = new THREE.Color("#1e3a5f");
    const highColor = accentColor;
    const peakColor = new THREE.Color("#ffffff");

    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, zValues[i] * 0.5);
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

    return { geometry: geom, colors: colorArr };
  }, [fn, xMin, xMax, yMin, yMax, resolution, accent]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]}>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        metalness={0.1}
        roughness={0.5}
        wireframe={false}
      />
    </mesh>
  );
}

function WireframeSurface({ fn, xRange, yRange, resolution }) {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const geometry = useMemo(() => {
    const segs = Math.floor(resolution / 2);
    const geom = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, segs, segs);
    const positions = geom.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i) + (xMax + xMin) / 2;
      const y = positions.getY(i) + (yMax + yMin) / 2;
      let z = fn(x, y);
      if (!isFinite(z)) z = 0;
      z = Math.max(-5, Math.min(5, z));
      positions.setZ(i, z * 0.5);
    }
    geom.computeVertexNormals();
    return geom;
  }, [fn, xMin, xMax, yMin, yMax, resolution]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]}>
      <meshBasicMaterial
        wireframe
        color="rgba(255,255,255,0.1)"
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

export default function TopographyCanvas({ values, accent }) {
  const { a, b, c: cVal } = values;

  const fn = useMemo(() => {
    return (x, y) =>
      a * Math.sin(x * b) * Math.cos(y * cVal) +
      Math.sin(Math.sqrt(x * x + y * y)) * 0.5;
  }, [a, b, cVal]);

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        height: "calc(100vh - 160px)",
        minHeight: 400,
        background: "#0a0f1a",
      }}
    >
      <Canvas camera={{ position: [6, 4, 6], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, -5]} intensity={0.4} color="#22d3ee" />

        <Surface
          fn={fn}
          accent={accent}
          xRange={[-4, 4]}
          yRange={[-4, 4]}
          resolution={64}
        />
        <WireframeSurface
          fn={fn}
          xRange={[-4, 4]}
          yRange={[-4, 4]}
          resolution={64}
        />

        {/* Grid helper */}
        <gridHelper
          args={[8, 16, "#1e293b", "#0f172a"]}
          position={[0, -2.5, 0]}
        />

        {/* Axis labels */}
        <Text
          position={[4.5, -2.5, 0]}
          fontSize={0.3}
          color="rgba(255,255,255,0.3)"
        >
          X
        </Text>
        <Text
          position={[0, -2.5, 4.5]}
          fontSize={0.3}
          color="rgba(255,255,255,0.3)"
        >
          Y
        </Text>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="rgba(255,255,255,0.3)"
        >
          Z
        </Text>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}

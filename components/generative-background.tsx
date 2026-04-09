"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SimplexNoise, fourierWave } from "@/lib/simplex-noise";

function NoiseField() {
  const meshRef = useRef<THREE.Mesh>(null);
  const noise = useMemo(() => new SimplexNoise(42), []);
  
  const { geometry, positions, colors } = useMemo(() => {
    const count = 80;
    const geometry = new THREE.PlaneGeometry(20, 20, count, count);
    const positions = geometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    
    for (let i = 0; i < positions.count; i++) {
      colors[i * 3] = 0.08;
      colors[i * 3 + 1] = 0.08;
      colors[i * 3 + 2] = 0.08;
    }
    
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    
    return { geometry, positions, colors };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.3;
    const positionArray = positions.array as Float32Array;
    const colorArray = colors;

    for (let i = 0; i < positions.count; i++) {
      const x = positionArray[i * 3];
      const y = positionArray[i * 3 + 1];
      
      const noiseVal = noise.noise3D(x * 0.15, y * 0.15, time);
      const fourier = fourierWave(x * 0.1, time, 5) * 0.5;
      const combined = noiseVal + fourier;
      
      positionArray[i * 3 + 2] = combined * 1.5;
      
      const normalizedNoise = (combined + 1) * 0.5;
      colorArray[i * 3] = 0.08 + normalizedNoise * 0.16;
      colorArray[i * 3 + 1] = 0.08 + normalizedNoise * 0.16;
      colorArray[i * 3 + 2] = 0.08 + normalizedNoise * 0.16;
    }

    positions.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -5]}>
      <meshBasicMaterial vertexColors wireframe transparent opacity={0.4} />
    </mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);
  const noise = useMemo(() => new SimplexNoise(123), []);
  
  const { positions, originalPositions } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }
    
    return { positions, originalPositions };
  }, []);

  useFrame(({ clock }) => {
    if (!particlesRef.current || !glowRef.current) return;
    const time = clock.getElapsedTime() * 0.2;
    const positionArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positionArray.length / 3; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];
      
      const noiseX = noise.noise3D(ox * 0.1, oy * 0.1, time) * 0.5;
      const noiseY = noise.noise3D(ox * 0.1 + 100, oy * 0.1, time) * 0.5;
      const noiseZ = noise.noise3D(ox * 0.1 + 200, oy * 0.1, time) * 0.3;
      
      positionArray[i * 3] = ox + noiseX;
      positionArray[i * 3 + 1] = oy + noiseY;
      positionArray[i * 3 + 2] = oz + noiseZ;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    glowRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#2f2f2f"
          transparent
          opacity={0.14}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#151515"
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export function GenerativeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "linear-gradient(to bottom, #000000, #090909)" }}
      >
        <ambientLight intensity={0.5} />
        <NoiseField />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}

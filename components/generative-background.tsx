"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
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
      colors[i * 3] = 0.1;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.7;
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
      colorArray[i * 3] = 0.1 + normalizedNoise * 0.2;
      colorArray[i * 3 + 1] = 0.6 + normalizedNoise * 0.3;
      colorArray[i * 3 + 2] = 0.6 + normalizedNoise * 0.2;
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

function FloatingLogos() {
  const logosRef = useRef<THREE.Group>(null);
  const noise = useMemo(() => new SimplexNoise(123), []);
  const texture = useLoader(TextureLoader, "/fisidi-particle.png");

  const particles = useMemo(() => {
    return Array.from({ length: 130 }, () => ({
      baseX: (Math.random() - 0.5) * 20,
      baseY: (Math.random() - 0.5) * 20,
      baseZ: (Math.random() - 0.5) * 10,
      scale: 0.16 + Math.random() * 0.1,
      rotation: Math.random() * Math.PI * 2,
      drift: 0.6 + Math.random() * 0.7,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!logosRef.current) return;
    const time = clock.getElapsedTime() * 0.2;

    logosRef.current.children.forEach((child, i) => {
      const particle = particles[i];
      const noiseX = noise.noise3D(particle.baseX * 0.08, particle.baseY * 0.08, time) * 0.6;
      const noiseY = noise.noise3D(particle.baseX * 0.08 + 100, particle.baseY * 0.08, time) * 0.6;
      const noiseZ = noise.noise3D(particle.baseX * 0.08 + 200, particle.baseY * 0.08, time) * 0.35;

      child.position.set(
        particle.baseX + noiseX,
        particle.baseY + noiseY,
        particle.baseZ + noiseZ,
      );
      child.rotation.z = particle.rotation + time * 0.12 * particle.drift;
    });
  });

  return (
    <group ref={logosRef}>
      {particles.map((particle, index) => (
        <sprite
          key={index}
          position={[particle.baseX, particle.baseY, particle.baseZ]}
          scale={[particle.scale, particle.scale, particle.scale]}
        >
          <spriteMaterial map={texture} transparent opacity={0.22} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

export function GenerativeBackground() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`fixed inset-0 -z-10 transition-opacity duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "linear-gradient(to bottom, #090909, #111111)" }}
      >
        <ambientLight intensity={0.6} />
        <NoiseField />
        <FloatingLogos />
      </Canvas>
    </div>
  );
}

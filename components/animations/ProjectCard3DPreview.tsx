'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CubeMeshProps {
  accentHue: number;
  isHovered: boolean;
}

function CubeMesh({ accentHue, isHovered }: CubeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speed = isHovered ? 2 : 0.5;
    meshRef.current.rotation.x += delta * speed * 0.5;
    meshRef.current.rotation.y += delta * speed * 0.7;
  });

  const color = `hsl(${accentHue}, 60%, 50%)`;

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.4}
        roughness={0.6}
        metalness={0.3}
        wireframe={false}
      />
    </mesh>
  );
}

interface ProjectCard3DPreviewProps {
  accentHue: number;
  isHovered: boolean;
  /** full = main content (no media), overlay = small corner when media exists */
  variant?: 'full' | 'overlay';
}

function Scene({ accentHue, isHovered }: { accentHue: number; isHovered: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={1} />
      <CubeMesh accentHue={accentHue} isHovered={isHovered} />
    </>
  );
}

export function ProjectCard3DPreview({ accentHue, isHovered, variant = 'full' }: ProjectCard3DPreviewProps) {
  const isOverlay = variant === 'overlay';
  return (
    <div
      className={`pointer-events-none absolute flex items-center justify-center opacity-60 group-hover:opacity-90 transition-opacity duration-300 ${
        isOverlay ? 'right-3 bottom-3 h-14 w-14' : 'inset-0'
      }`}
    >
      <div className={isOverlay ? 'h-full w-full' : 'h-[60%] w-[60%] max-h-[120px] max-w-[120px]'}>
        <Canvas
          camera={{ position: [0, 0, 2], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          frameloop="always"
        >
          <Scene accentHue={accentHue} isHovered={isHovered} />
        </Canvas>
      </div>
    </div>
  );
}

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, MeshDistortMaterial, Float, Html, MeshWobbleMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { BioMetrics, OrganType } from '../types';
import { cn } from '../lib/utils';
import { ORGAN_BY_ID } from '../config/organs';

interface OrganProps {
  type: OrganType;
  position: [number, number, number];
  color: string;
  activityScale: number;
  label: string;
  health: number;
  isSelected?: boolean;
  onClick: (type: OrganType) => void;
}

const Organ = ({ type, position, color, activityScale, label, health, isSelected, onClick }: OrganProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState(false);

  const healthFactor = health / 100;
  const healthColor = useMemo(() => {
    const c = new THREE.Color(color);
    if (isSelected) return '#ffffff';
    const decayColor = new THREE.Color('#333333');
    return c.lerp(decayColor, 1 - healthFactor).getStyle();
  }, [color, healthFactor, isSelected]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Pulse effect
    const pulse = 1 + Math.sin(t * (activityScale + 1) * 3) * 0.04 * activityScale;
    const scale = healthFactor * pulse;
    meshRef.current.scale.set(scale, scale, scale);

    // Gentle rotation
    meshRef.current.rotation.y += 0.01 * activityScale;

    // Critical stress shake
    if (activityScale > 0.8) {
      meshRef.current.position.x = (Math.random() - 0.5) * 0.01 * activityScale;
      meshRef.current.position.y = position[1] + (Math.random() - 0.5) * 0.01 * activityScale;
    } else {
      meshRef.current.position.x = 0;
      meshRef.current.position.y = position[1];
    }
  });

  const OrganGeometry = () => {
    switch (type) {
      case 'brain':
        return (
          <group>
            <Sphere args={[0.3, 32, 32]}>
              <MeshDistortMaterial color={healthColor} speed={activityScale * 3} distort={0.2} roughness={0.1} />
            </Sphere>
            {/* Neural energy ring */}
            <Torus args={[0.35, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color={healthColor} transparent opacity={activityScale * 0.5} />
            </Torus>
          </group>
        );
      case 'heart':
        return (
          <Sphere args={[0.2, 32, 32]} scale={[1, 1.2, 1]}>
            <MeshWobbleMaterial color={healthColor} speed={activityScale * 5} factor={0.2} />
          </Sphere>
        );
      case 'lungs':
        return (
          <group>
            <Sphere args={[0.22, 32, 32]} position={[-0.2, 0, 0]} scale={[1, 1.8, 0.8]}>
              <meshStandardMaterial color={healthColor} transparent opacity={0.8} />
            </Sphere>
            <Sphere args={[0.22, 32, 32]} position={[0.2, 0, 0]} scale={[1, 1.8, 0.8]}>
              <meshStandardMaterial color={healthColor} transparent opacity={0.8} />
            </Sphere>
          </group>
        );
      case 'liver':
        return (
          <Box args={[0.4, 0.25, 0.2]} rotation={[0, 0, -0.3]}>
            <meshStandardMaterial color={healthColor} roughness={0.5} />
          </Box>
        );
      case 'nervous_system':
        return (
          <group>
            <Sphere args={[0.06, 16, 16]} position={[0, 0.55, 0]}>
              <meshStandardMaterial color={healthColor} emissive={healthColor} emissiveIntensity={0.2} />
            </Sphere>
            <Box args={[0.04, 1.35, 0.04]} position={[0, -0.15, 0]}>
              <meshStandardMaterial color={healthColor} emissive={healthColor} emissiveIntensity={0.15} />
            </Box>
            <Box args={[0.55, 0.03, 0.03]} position={[0, 0.15, 0]} rotation={[0, 0, 0.25]}>
              <meshStandardMaterial color={healthColor} transparent opacity={0.8} />
            </Box>
            <Box args={[0.55, 0.03, 0.03]} position={[0, -0.25, 0]} rotation={[0, 0, -0.25]}>
              <meshStandardMaterial color={healthColor} transparent opacity={0.8} />
            </Box>
          </group>
        );
      case 'skin':
        return (
          <Sphere args={[1.5, 32, 32]}>
            <meshStandardMaterial color={healthColor} wireframe transparent opacity={0.3} />
          </Sphere>
        );
      default:
        return <Sphere args={[0.1]} />;
    }
  };

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(type);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={meshRef}>
        <OrganGeometry />
      </group>
      <Html distanceFactor={4} position={[0.5, 0, 0]}>
        <div className="pointer-events-none select-none">
          <div className="flex flex-col gap-1 items-start">
            <div className={cn(
              "px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tighter whitespace-nowrap backdrop-blur-sm shadow-xl transition-colors",
              isSelected ? "bg-white text-black border-white" :
                health < 30 ? "bg-red-950/80 border-red-500/50 text-red-100" :
                  hovered ? "bg-white/20 border-white/40 text-white" :
                    "bg-black/60 border-white/20 text-white/80"
            )}>
              {label}
            </div>
            {activityScale > 0.5 && (
              <div className="w-12 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400"
                  style={{ width: `${Math.min(100, Math.max(0, (activityScale || 0) * 100))}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};

interface HumanModelProps {
  metrics: BioMetrics;
  selectedOrgan: OrganType | null;
  onSelectOrgan: (type: OrganType | null) => void;
}

export const HumanModel = ({ metrics, selectedOrgan, onSelectOrgan }: HumanModelProps) => {
  const heartActivity = (metrics.heartRate - 60) / 100;
  const brainActivity = (metrics.dopamineLevel / 100);
  const liverActivity = (metrics.toxinLevel / 100);
  const health = metrics.organHealth;

  return (
    <group onPointerMissed={() => onSelectOrgan(null)}>
      {/* Body Silhouette */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.6, 2.4, 32, 32]} />
        <meshStandardMaterial
          color={health < 30 ? "#330000" : "#222222"}
          wireframe
          transparent
          opacity={0.1}
          emissive={health < 30 ? "#ff0000" : "#00ffff"}
          emissiveIntensity={health < 30 ? 0.2 : 0.05}
        />
      </mesh>

      {/* Internal Organs */}
      <Organ
        type="brain"
        position={[0, 1.4, 0]} 
        color={brainActivity > 0.5 ? '#fbc02d' : '#ec407a'} 
        activityScale={brainActivity} 
        label={ORGAN_BY_ID.brain.label}
        health={health}
        isSelected={selectedOrgan === 'brain'}
        onClick={onSelectOrgan}
      />

      <Organ
        type="heart"
        position={[0, 0.6, 0.1]} 
        color={heartActivity > 0.8 ? '#d32f2f' : '#ad1457'} 
        activityScale={heartActivity} 
        label={ORGAN_BY_ID.heart.label}
        health={health}
        isSelected={selectedOrgan === 'heart'}
        onClick={onSelectOrgan}
      />

      <Organ
        type="lungs"
        position={[0, 0.55, -0.1]} 
        color="#80deea" 
        activityScale={metrics.respirationRate / 30} 
        label={ORGAN_BY_ID.lungs.label}
        health={health}
        isSelected={selectedOrgan === 'lungs'}
        onClick={onSelectOrgan}
      />

      <Organ
        type="liver"
        position={[-0.2, 0.15, 0.1]} 
        color={liverActivity > 0.5 ? '#5d4037' : '#6d4c41'} 
        activityScale={liverActivity} 
        label={ORGAN_BY_ID.liver.label}
        health={health}
        isSelected={selectedOrgan === 'liver'}
        onClick={onSelectOrgan}
      />

      <Organ
        type="nervous_system"
        position={[0, 0.35, -0.05]}
        color="#facc15"
        activityScale={Math.max(0.2, brainActivity)}
        label={ORGAN_BY_ID.nervous_system.label}
        health={health}
        isSelected={selectedOrgan === 'nervous_system'}
        onClick={onSelectOrgan}
      />

      <Organ 
        type="skin" 
        position={[0, 0, 0]} 
        color={liverActivity > 0.5 ? '#e8c5a5' : '#d4a574'} 
        activityScale={0.1} 
        label={ORGAN_BY_ID.skin.label}
        health={health}
        isSelected={selectedOrgan === 'skin'}
        onClick={onSelectOrgan}
      />

      {/* Circulatory Energy Particles */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={300}
              array={new Float32Array(Array.from({ length: 900 }, () => (Math.random() - 0.5) * 2.5))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color={heartActivity > 0.8 ? "#ff1744" : "#00e5ff"}
            size={0.015}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </Float>

      {/* Floor reflection effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

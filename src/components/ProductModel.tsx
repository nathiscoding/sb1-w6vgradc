
import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

export default function ProductModel() {
  const meshRef = useRef<Mesh>(null);

  // Animation de rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Anneau principal */}
      <mesh ref={meshRef}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial 
          color="#B8860B"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Détails décoratifs */}
      <mesh position={[0, 0, 0.3]}>
        <torusGeometry args={[1, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#DAA520"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Effet de brillance */}
      <pointLight
        position={[2, 2, 2]}
        intensity={1}
        color="#FFFFFF"
      />
    </group>
  );
}



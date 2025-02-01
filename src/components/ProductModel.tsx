import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function ProductModel() {
  // Note: This is a placeholder model. You'll need to replace it with your actual 3D model
  const { scene } = useGLTF('https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/ring-2/model.gltf');
  
  return <primitive object={scene} scale={1.5} />;
}
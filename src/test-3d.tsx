// Quick test file to verify 3D components work
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Character3D } from './components/3D/Character3D'

export function Test3D() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />
        <Character3D 
          ageGroup="3-5"
          emotion="happy"
          activity="idle"
          position={[0, 0, 0]}
          scale={1}
        />
      </Canvas>
    </div>
  )
}
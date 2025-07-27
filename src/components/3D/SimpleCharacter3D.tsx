import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AgeGroup } from '@/App'

interface SimpleCharacter3DProps {
  ageGroup: AgeGroup
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking' | 'idle'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting' | 'floating'
  position?: [number, number, number]
  scale?: number
}

// Simple Baby Dragon for ages 3-5
function SimpleBabyDragon({ emotion = 'happy', activity = 'idle', position = [0, 0, 0], scale = 1 }: Omit<SimpleCharacter3DProps, 'ageGroup'>) {
  const groupRef = useRef<THREE.Group>(null)
  const wingsRef = useRef<THREE.Group>(null)
  const eyesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current || !state?.clock) return
    
    try {
      const time = state.clock.elapsedTime
      
      // Gentle floating
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.05
      
      // Wing flapping
      if (wingsRef.current) {
        wingsRef.current.rotation.y = Math.sin(time * 4) * 0.2
      }
      
      // Blinking
      if (eyesRef.current) {
        const blinkTime = time % 3
        if (blinkTime > 2.8) {
          eyesRef.current.scale.y = 0.1
        } else {
          eyesRef.current.scale.y = 1
        }
      }
    } catch (error) {
      console.error('SimpleBabyDragon animation error:', error)
    }
  })

  const emotionColor = emotion === 'excited' ? '#FFD700' : emotion === 'happy' ? '#FF69B4' : '#FF1493'

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color={emotionColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.6, 0.2]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={emotionColor} roughness={0.3} />
      </mesh>

      {/* Eyes */}
      <group ref={eyesRef} position={[0, 0.6, 0.2]}>
        <mesh position={[-0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[-0.15, 0.1, 0.4]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.4]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Wings */}
      <group ref={wingsRef}>
        <mesh position={[-0.5, 0.2, -0.2]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.3, 0.6, 0.1]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.5, 0.2, -0.2]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.3, 0.6, 0.1]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Snout */}
      <mesh position={[0, 0.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.15]} />
        <meshStandardMaterial color="#FF1493" />
      </mesh>

      {/* Tail */}
      <mesh position={[0, -0.2, -0.7]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.05, 0.6]} />
        <meshStandardMaterial color={emotionColor} />
      </mesh>
    </group>
  )
}

// Simple Robot Explorer for ages 6-9
function SimpleRobotExplorer({ emotion = 'happy', activity = 'idle', position = [0, 0, 0], scale = 1 }: Omit<SimpleCharacter3DProps, 'ageGroup'>) {
  const groupRef = useRef<THREE.Group>(null)
  const antennaRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current || !state?.clock) return
    
    try {
      const time = state.clock.elapsedTime
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.05
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1
      
      if (antennaRef.current) {
        antennaRef.current.rotation.z = Math.sin(time * 2) * 0.2
      }
    } catch (error) {
      console.error('SimpleRobotExplorer animation error:', error)
    }
  })

  const emotionColor = emotion === 'excited' ? '#FF6347' : emotion === 'happy' ? '#00CED1' : '#4169E1'

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color={emotionColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 0.75, 0.21]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.15, 0.75, 0.21]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
      </mesh>

      {/* Antenna */}
      <group ref={antennaRef} position={[0, 1, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Arms */}
      <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color={emotionColor} metalness={0.7} />
      </mesh>
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color={emotionColor} metalness={0.7} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4]} />
        <meshStandardMaterial color={emotionColor} metalness={0.7} />
      </mesh>
      <mesh position={[0.2, -0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4]} />
        <meshStandardMaterial color={emotionColor} metalness={0.7} />
      </mesh>
    </group>
  )
}

// Simple Tech Guide for ages 10-12
function SimpleTechGuide({ emotion = 'happy', activity = 'idle', position = [0, 0, 0], scale = 1 }: Omit<SimpleCharacter3DProps, 'ageGroup'>) {
  const groupRef = useRef<THREE.Group>(null)
  const orbRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current || !state?.clock) return
    
    try {
      const time = state.clock.elapsedTime
      groupRef.current.position.y = position[1] + Math.sin(time * 1.2) * 0.08
      
      if (orbRef.current) {
        orbRef.current.rotation.y = time * 0.5
      }
    } catch (error) {
      console.error('SimpleTechGuide animation error:', error)
    }
  })

  const emotionColor = emotion === 'excited' ? '#FF4500' : emotion === 'happy' ? '#6A5ACD' : '#4682B4'

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.25, 0.8]} />
        <meshStandardMaterial color={emotionColor} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.35]} />
        <meshStandardMaterial color="#F0F0F0" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 0.65, 0.3]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial 
          color="#000080" 
          emissive="#000080" 
          emissiveIntensity={0.3} 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color={emotionColor} />
      </mesh>
      <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color={emotionColor} />
      </mesh>

      {/* Floating orbs */}
      <group ref={orbRef}>
        {[...Array(4)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * Math.PI / 2) * 0.8,
              Math.cos(i * Math.PI / 2) * 0.3 + 0.8,
              Math.sin(i * Math.PI / 3) * 0.2
            ]}
          >
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFD700" 
              emissiveIntensity={0.6} 
              transparent 
              opacity={0.7} 
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function SimpleCharacter3D({ ageGroup, emotion = 'happy', activity = 'idle', position = [0, 0, 0], scale = 1 }: SimpleCharacter3DProps) {
  const CharacterComponent = ageGroup === '3-5' ? SimpleBabyDragon :
                           ageGroup === '6-9' ? SimpleRobotExplorer :
                           SimpleTechGuide

  try {
    return (
      <>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <pointLight position={[-2, 2, 2]} intensity={0.5} color="#FFB6C1" />
        
        <CharacterComponent 
          emotion={emotion} 
          activity={activity} 
          position={position} 
          scale={scale} 
        />
      </>
    )
  } catch (error) {
    console.error('SimpleCharacter3D error:', error)
    return (
      <>
        <ambientLight intensity={0.6} />
        <mesh position={position} scale={scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#4F46E5" />
        </mesh>
      </>
    )
  }
}
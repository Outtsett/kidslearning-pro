import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { AgeGroup } from '@/App'

interface Character3DProps {
  ageGroup: AgeGroup
  emotion: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking' | 'idle'
  activity: 'idle' | 'celebrating' | 'explaining' | 'waiting' | 'floating'
  position?: [number, number, number]
  scale?: number
}

// Cute BabyDragon for ages 3-5
function BabyDragon({ emotion, activity, position = [0, 0, 0], scale = 1 }: Omit<Character3DProps, 'ageGroup'>) {
  const groupRef = useRef<THREE.Group>(null)
  const eyesRef = useRef<THREE.Group>(null)
  const wingsRef = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Group>(null)
  
  // Animation states
  const { floatY, wingRotation, tailSway, eyeScale } = useSpring({
    floatY: activity === 'floating' ? 0.3 : 0,
    wingRotation: activity === 'celebrating' ? Math.PI / 3 : Math.PI / 6,
    tailSway: activity === 'idle' ? Math.PI / 12 : 0,
    eyeScale: emotion === 'excited' ? 1.2 : emotion === 'thinking' ? 0.8 : 1,
    config: { tension: 120, friction: 14 }
  })

  // Continuous animations
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.1 + floatY.get()
      
      // Breathing effect on body scale
      const breathScale = 1 + Math.sin(clock.elapsedTime * 2) * 0.05
      groupRef.current.scale.set(scale * breathScale, scale * breathScale, scale * breathScale)
    }

    if (eyesRef.current) {
      // Blinking animation
      const blinkTime = clock.elapsedTime % 3
      if (blinkTime > 2.8) {
        eyesRef.current.scale.y = Math.max(0.1, 1 - (blinkTime - 2.8) * 10)
      } else {
        eyesRef.current.scale.y = eyeScale.get()
      }
    }

    if (wingsRef.current) {
      // Wing flapping - additional movement on top of spring animation
      const flapSpeed = activity === 'celebrating' ? 4 : 2
      const flapOffset = Math.sin(clock.elapsedTime * flapSpeed) * 0.2
      wingsRef.current.rotation.x = flapOffset
    }

    if (tailRef.current) {
      // Tail wagging
      tailRef.current.rotation.y = tailSway.get() + Math.sin(clock.elapsedTime * 1.8) * 0.4
    }
  })

  // Fur-like material with soft shading
  const furMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ff6b9d'),
    roughness: 0.8,
    metalness: 0.1,
    normalScale: new THREE.Vector2(0.5, 0.5),
  }), [])

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#000'),
    emissive: new THREE.Color('#001122'),
    emissiveIntensity: 0.2,
  }), [])

  const pupilMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 0.3,
  }), [])

  return (
    <animated.group ref={groupRef} position={position}>
      {/* Body */}
      <mesh material={furMaterial}>
        <sphereGeometry args={[0.8, 16, 16]} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.6, 0.2]} material={furMaterial}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
      
      {/* Big cute eyes */}
      <animated.group ref={eyesRef} position={[0, 0.7, 0.6]}>
        {/* Left eye */}
        <mesh position={[-0.15, 0, 0]} material={eyeMaterial}>
          <sphereGeometry args={[0.12, 8, 8]} />
        </mesh>
        {/* Left pupil highlight */}
        <mesh position={[-0.15, 0.02, 0.1]} material={pupilMaterial}>
          <sphereGeometry args={[0.03, 6, 6]} />
        </mesh>
        
        {/* Right eye */}
        <mesh position={[0.15, 0, 0]} material={eyeMaterial}>
          <sphereGeometry args={[0.12, 8, 8]} />
        </mesh>
        {/* Right pupil highlight */}
        <mesh position={[0.15, 0.02, 0.1]} material={pupilMaterial}>
          <sphereGeometry args={[0.03, 6, 6]} />
        </mesh>
      </animated.group>
      
      {/* Wings */}
      <animated.group ref={wingsRef}>
        {/* Left wing */}
        <animated.mesh position={[-0.6, 0.2, -0.2]} rotation-z={wingRotation} material={furMaterial}>
          <boxGeometry args={[0.1, 0.8, 0.4]} />
        </animated.mesh>
        {/* Right wing */}
        <animated.mesh position={[0.6, 0.2, -0.2]} rotation-z={wingRotation.to(r => -r)} material={furMaterial}>
          <boxGeometry args={[0.1, 0.8, 0.4]} />
        </animated.mesh>
      </animated.group>
      
      {/* Tail */}
      <animated.group ref={tailRef} position={[0, -0.3, -0.8]}>
        <mesh material={furMaterial}>
          <cylinderGeometry args={[0.1, 0.2, 0.8]} />
        </mesh>
      </animated.group>
      
      {/* Sparkles around character when celebrating */}
      {activity === 'celebrating' && (
        <>
          {[...Array(6)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos(i * Math.PI / 3) * 1.5,
                Math.sin(i * Math.PI / 3) * 0.5 + 0.5,
                Math.sin(i * Math.PI / 3) * 1.5
              ]}
              material={pupilMaterial}
            >
              <octahedronGeometry args={[0.05]} />
            </mesh>
          ))}
        </>
      )}
    </animated.group>
  )
}

// Playful RobotExplorer for ages 6-9
function RobotExplorer({ emotion, activity, position = [0, 0, 0], scale = 1 }: Omit<Character3DProps, 'ageGroup'>) {
  const groupRef = useRef<THREE.Group>(null)
  const antennaRef = useRef<THREE.Group>(null)
  const eyesRef = useRef<THREE.Group>(null)
  
  const { bounce, antennaGlow, eyeColor } = useSpring({
    bounce: activity === 'celebrating' ? 0.5 : 0,
    antennaGlow: emotion === 'thinking' ? 1 : 0.3,
    eyeColor: emotion === 'excited' ? '#00ff88' : emotion === 'happy' ? '#0088ff' : '#ffffff',
    config: { tension: 200, friction: 20 }
  })

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.15 + bounce.get()
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.1
    }

    if (antennaRef.current) {
      antennaRef.current.rotation.x = Math.sin(clock.elapsedTime * 3) * 0.2
    }

    if (eyesRef.current) {
      // Digital blinking effect
      const blinkTime = clock.elapsedTime % 4
      if (blinkTime > 3.5) {
        eyesRef.current.scale.y = 0.1
      } else {
        eyesRef.current.scale.y = 1
      }
    }
  })

  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#4a90e2'),
    metalness: 0.8,
    roughness: 0.2,
  }), [])

  const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(eyeColor.get()),
    emissive: new THREE.Color(eyeColor.get()),
    emissiveIntensity: antennaGlow.get(),
  }), [eyeColor, antennaGlow])

  return (
    <animated.group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh material={metalMaterial}>
        <boxGeometry args={[0.8, 1, 0.6]} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.8, 0]} material={metalMaterial}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
      </mesh>
      
      {/* Eyes */}
      <animated.group ref={eyesRef} position={[0, 0.8, 0.31]}>
        <mesh position={[-0.15, 0, 0]} material={glowMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.02]} />
        </mesh>
        <mesh position={[0.15, 0, 0]} material={glowMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.02]} />
        </mesh>
      </animated.group>
      
      {/* Antenna */}
      <animated.group ref={antennaRef} position={[0, 1.1, 0]}>
        <mesh material={metalMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        </mesh>
        <mesh position={[0, 0.2, 0]} material={glowMaterial}>
          <sphereGeometry args={[0.06]} />
        </mesh>
      </animated.group>
      
      {/* Arms */}
      <mesh position={[-0.5, 0.3, 0]} rotation={[0, 0, activity === 'celebrating' ? -Math.PI/3 : -Math.PI/6]} material={metalMaterial}>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
      </mesh>
      <mesh position={[0.5, 0.3, 0]} rotation={[0, 0, activity === 'celebrating' ? Math.PI/3 : Math.PI/6]} material={metalMaterial}>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
      </mesh>
    </animated.group>
  )
}

// Wise TechGuide for ages 10-12
function TechGuide({ emotion, activity, position = [0, 0, 0], scale = 1 }: Omit<Character3DProps, 'ageGroup'>) {
  const groupRef = useRef<THREE.Group>(null)
  const cloakRef = useRef<THREE.Group>(null)
  const staffRef = useRef<THREE.Group>(null)
  
  const { hover, cloakFlow, staffGlow } = useSpring({
    hover: activity === 'explaining' ? 0.2 : 0,
    cloakFlow: activity === 'idle' ? 0.1 : 0.3,
    staffGlow: emotion === 'thinking' ? 1.5 : 0.8,
    config: { tension: 80, friction: 25 }
  })

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2) * 0.08 + hover.get()
    }

    if (cloakRef.current) {
      cloakRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * cloakFlow.get()
    }

    if (staffRef.current) {
      staffRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.8) * 0.1
    }
  })

  const clothMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6b46c1'),
    roughness: 0.9,
    metalness: 0.1,
  }), [])

  const mysticalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#a855f7'),
    emissive: new THREE.Color('#7c3aed'),
    emissiveIntensity: staffGlow.get(),
  }), [staffGlow])

  return (
    <animated.group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh material={clothMaterial}>
        <cylinderGeometry args={[0.4, 0.3, 1.2]} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.8, 0]} material={clothMaterial}>
        <sphereGeometry args={[0.3]} />
      </mesh>
      
      {/* Hood/Cloak */}
      <animated.group ref={cloakRef}>
        <mesh position={[0, 0.9, -0.2]} material={clothMaterial}>
          <coneGeometry args={[0.5, 0.8]} />
        </mesh>
      </animated.group>
      
      {/* Glowing eyes */}
      <mesh position={[-0.1, 0.85, 0.25]} material={mysticalMaterial}>
        <sphereGeometry args={[0.04]} />
      </mesh>
      <mesh position={[0.1, 0.85, 0.25]} material={mysticalMaterial}>
        <sphereGeometry args={[0.04]} />
      </mesh>
      
      {/* Staff */}
      <animated.group ref={staffRef} position={[0.4, 0, 0]}>
        <mesh material={clothMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 1.5]} />
        </mesh>
        <mesh position={[0, 0.8, 0]} material={mysticalMaterial}>
          <octahedronGeometry args={[0.1]} />
        </mesh>
      </animated.group>
      
      {/* Floating mystical orbs */}
      {activity === 'explaining' && (
        <>
          {[...Array(4)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos(i * Math.PI / 2 + Date.now() * 0.001) * 0.8,
                0.5 + Math.sin(i * Math.PI / 2 + Date.now() * 0.001) * 0.3,
                Math.sin(i * Math.PI / 2 + Date.now() * 0.001) * 0.8
              ]}
              material={mysticalMaterial}
            >
              <sphereGeometry args={[0.05]} />
            </mesh>
          ))}
        </>
      )}
    </animated.group>
  )
}

export function Character3D({ ageGroup, emotion, activity, position, scale }: Character3DProps) {
  const CharacterComponent = useMemo(() => {
    switch (ageGroup) {
      case '3-5':
        return BabyDragon
      case '6-9':
        return RobotExplorer
      case '10-12':
        return TechGuide
      default:
        return BabyDragon
    }
  }, [ageGroup])

  return (
    <>
      {/* Ambient lighting for soft, warm feel */}
      <ambientLight intensity={0.6} color="#fff8dc" />
      
      {/* Directional light for definition */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow
      />
      
      {/* Point light for magical glow */}
      <pointLight 
        position={[0, 2, 2]} 
        intensity={0.5} 
        color="#a855f7"
        distance={6}
      />
      
      <CharacterComponent 
        emotion={emotion} 
        activity={activity} 
        position={position} 
        scale={scale} 
      />
    </>
  )
}
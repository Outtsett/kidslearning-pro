import React, { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Sparkles } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Character3D } from './Character3D'
import type { AgeGroup } from '@/App'

interface FloatingElement {
  id: number
  position: [number, number, number]
  color: string
  size: number
}

function BackgroundElements({ ageGroup }: { ageGroup: AgeGroup }) {
  const elementsRef = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (elementsRef.current) {
      elementsRef.current.rotation.y = clock.elapsedTime * 0.1
    }
  })

  const elements = useMemo(() => {
    const configs = {
      '3-5': { colors: ['#ff6b9d', '#4ecdc4', '#ffd93d'], count: 8 },
      '6-9': { colors: ['#4a90e2', '#50c878', '#ff6b35'], count: 6 },
      '10-12': { colors: ['#6b46c1', '#8b5cf6', '#a855f7'], count: 4 }
    }
    
    const config = configs[ageGroup]
    
    return Array.from({ length: config.count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 + 2,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      color: config.colors[i % config.colors.length],
      size: 0.1 + Math.random() * 0.1
    }))
  }, [ageGroup])

  return (
    <group ref={elementsRef}>
      {elements.map((element) => (
        <Float
          key={element.id}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <mesh position={element.position}>
            <sphereGeometry args={[element.size]} />
            <meshStandardMaterial 
              color={element.color}
              emissive={element.color}
              emissiveIntensity={0.2}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Age-specific sparkles */}
      <Sparkles 
        count={ageGroup === '3-5' ? 100 : ageGroup === '6-9' ? 60 : 40}
        scale={6}
        size={2}
        speed={0.4}
        opacity={0.6}
        color={ageGroup === '3-5' ? '#ffd93d' : ageGroup === '6-9' ? '#4a90e2' : '#a855f7'}
      />
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="text-2xl font-heading text-primary animate-pulse">
        Loading your companion...
      </div>
    </div>
  )
}

interface CharacterSceneProps {
  ageGroup: AgeGroup
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking' | 'idle'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting' | 'floating'
  dialogue?: string
  className?: string
  enableControls?: boolean
  autoRotate?: boolean
}

export function CharacterScene({ 
  ageGroup, 
  emotion = 'happy', 
  activity = 'idle',
  dialogue,
  className = "w-full h-96",
  enableControls = false,
  autoRotate = true
}: CharacterSceneProps) {
  const sceneVariants = {
    '3-5': {
      background: 'from-pink-100 via-yellow-50 to-green-100',
      cameraPosition: [0, 2, 4] as [number, number, number]
    },
    '6-9': {
      background: 'from-blue-100 via-cyan-50 to-teal-100',
      cameraPosition: [0, 1, 5] as [number, number, number]
    },
    '10-12': {
      background: 'from-purple-100 via-indigo-50 to-blue-100',
      cameraPosition: [0, 1, 6] as [number, number, number]
    }
  }

  const currentVariant = sceneVariants[ageGroup]

  return (
    <motion.div 
      className={`${className} bg-gradient-to-br ${currentVariant.background} rounded-2xl overflow-hidden relative`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Canvas
        camera={{ 
          position: currentVariant.cameraPosition, 
          fov: 50 
        }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Environment for realistic lighting */}
          <Environment preset="studio" />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#ffffff', 8, 20]} />
          
          {/* Background elements */}
          <BackgroundElements ageGroup={ageGroup} />
          
          {/* Main character */}
          <Character3D 
            ageGroup={ageGroup}
            emotion={emotion}
            activity={activity}
            position={[0, 0, 0]}
            scale={1}
          />
          
          {/* Controls if enabled */}
          {enableControls && (
            <OrbitControls 
              enablePan={false}
              enableZoom={false}
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* Dialogue bubble */}
      {dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
        >
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse" />
            <p className="font-body text-sm text-foreground leading-relaxed">
              {dialogue}
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Loading overlay */}
      <Suspense fallback={<LoadingFallback />}>
        <div />
      </Suspense>
    </motion.div>
  )
}

// Simplified companion for use in other components
export function CompanionWidget({ 
  ageGroup, 
  emotion = 'happy', 
  activity = 'idle',
  size = 'small'
}: {
  ageGroup: AgeGroup
  emotion?: CharacterSceneProps['emotion']
  activity?: CharacterSceneProps['activity']
  size?: 'small' | 'medium' | 'large'
}) {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  }

  return (
    <CharacterScene
      ageGroup={ageGroup}
      emotion={emotion}
      activity={activity}
      className={`${sizeClasses[size]} rounded-full`}
      enableControls={false}
      autoRotate={true}
    />
  )
}
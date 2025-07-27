import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import { SimpleCharacter3D } from './SimpleCharacter3D'
import type { AgeGroup } from '@/App'

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="text-2xl font-heading text-primary animate-pulse">
        Loading companion...
      </div>
    </div>
  )
}

interface SimpleCharacterSceneProps {
  ageGroup: AgeGroup
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking' | 'idle'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting' | 'floating'
  dialogue?: string
  className?: string
  enableControls?: boolean
  autoRotate?: boolean
}

export function SimpleCharacterScene({ 
  ageGroup, 
  emotion = 'happy', 
  activity = 'idle',
  dialogue,
  className = "w-full h-96",
  enableControls = false,
  autoRotate = true
}: SimpleCharacterSceneProps) {
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
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ 
            position: currentVariant.cameraPosition, 
            fov: 50 
          }}
          gl={{ 
            antialias: true, 
            alpha: true
          }}
        >
          <Environment preset="studio" />
          
          <SimpleCharacter3D 
            ageGroup={ageGroup}
            emotion={emotion}
            activity={activity}
            position={[0, 0, 0]}
            scale={1}
          />
          
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
        </Canvas>
      </Suspense>
      
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
    </motion.div>
  )
}

// Simplified companion widget
export function SimpleCompanionWidget({ 
  ageGroup, 
  emotion = 'happy', 
  activity = 'idle',
  size = 'small'
}: {
  ageGroup: AgeGroup
  emotion?: SimpleCharacterSceneProps['emotion']
  activity?: SimpleCharacterSceneProps['activity']
  size?: 'small' | 'medium' | 'large'
}) {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  }

  return (
    <SimpleCharacterScene
      ageGroup={ageGroup}
      emotion={emotion}
      activity={activity}
      className={`${sizeClasses[size]} rounded-full`}
      enableControls={false}
      autoRotate={true}
    />
  )
}
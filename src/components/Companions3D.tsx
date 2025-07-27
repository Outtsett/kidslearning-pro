import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float,
  Environment,
  ContactShadows,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Text3D,
  Center,
  Html,
  OrbitControls,
  useTexture
} from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import type { AgeGroup } from '@/App'

interface Companion3DProps {
  ageGroup: AgeGroup
  name: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
  showSpeech?: boolean
  speechText?: string
}

// 3D Baby Dragon for ages 3-5
function BabyDragon3D({ emotion, activity }: { emotion: string; activity: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const wingsRef = useRef<THREE.Group>(null)
  const [isBlinking, setIsBlinking] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    
    // Gentle floating
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    
    // Wing flapping
    if (wingsRef.current) {
      wingsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2
    }
    
    // Emotion-based movement
    if (emotion === 'excited') {
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 3) * 0.1
    }
  })

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      const timeoutId = setTimeout(() => setIsBlinking(false), 150)
      return () => clearTimeout(timeoutId)
    }, 2000 + Math.random() * 3000)
    
    return () => clearInterval(blinkInterval)
  }, [])

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return '#FF69B4'
      case 'excited': return '#FFD700'
      case 'proud': return '#9370DB'
      case 'encouraging': return '#32CD32'
      case 'thinking': return '#87CEEB'
      default: return '#FF69B4'
    }
  }

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Main body */}
        <Sphere position={[0, 0, 0]} scale={0.8}>
          <meshStandardMaterial 
            color={getEmotionColor()}
            roughness={0.3}
            metalness={0.1}
          />
        </Sphere>

        {/* Head */}
        <Sphere position={[0, 0.6, 0.2]} scale={0.5}>
          <meshStandardMaterial 
            color={getEmotionColor()}
            roughness={0.3}
          />
        </Sphere>

        {/* Eyes */}
        <group position={[0, 0.6, 0.2]}>
          <Sphere 
            position={[-0.15, 0.1, 0.35]} 
            scale={isBlinking ? [0.08, 0.02, 0.08] : [0.08, 0.08, 0.08]}
          >
            <meshStandardMaterial color="#FFFFFF" />
          </Sphere>
          <Sphere 
            position={[0.15, 0.1, 0.35]} 
            scale={isBlinking ? [0.08, 0.02, 0.08] : [0.08, 0.08, 0.08]}
          >
            <meshStandardMaterial color="#FFFFFF" />
          </Sphere>
          
          {/* Pupils */}
          {!isBlinking && (
            <>
              <Sphere position={[-0.15, 0.1, 0.4]} scale={0.04}>
                <meshStandardMaterial color="#000000" />
              </Sphere>
              <Sphere position={[0.15, 0.1, 0.4]} scale={0.04}>
                <meshStandardMaterial color="#000000" />
              </Sphere>
            </>
          )}
        </group>

        {/* Snout */}
        <Cylinder
          position={[0, 0.5, 0.5]}
          args={[0.08, 0.06, 0.15]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#FF1493" />
        </Cylinder>

        {/* Wings */}
        <group ref={wingsRef}>
          <Box
            position={[-0.5, 0.2, -0.2]}
            scale={[0.3, 0.6, 0.1]}
            rotation={[0, 0, Math.PI / 6]}
          >
            <meshStandardMaterial 
              color="#FFD700" 
              transparent 
              opacity={0.8}
            />
          </Box>
          <Box
            position={[0.5, 0.2, -0.2]}
            scale={[0.3, 0.6, 0.1]}
            rotation={[0, 0, -Math.PI / 6]}
          >
            <meshStandardMaterial 
              color="#FFD700" 
              transparent 
              opacity={0.8}
            />
          </Box>
        </group>

        {/* Tail */}
        <Cylinder
          position={[0, -0.2, -0.7]}
          args={[0.1, 0.05, 0.6]}
          rotation={[Math.PI / 4, 0, 0]}
        >
          <meshStandardMaterial color={getEmotionColor()} />
        </Cylinder>

        {/* Sparkles for happy/excited emotions */}
        {(emotion === 'happy' || emotion === 'excited') && (
          <group>
            {[...Array(6)].map((_, i) => (
              <Sphere
                key={i}
                position={[
                  Math.sin(i * Math.PI / 3) * 1.2,
                  Math.cos(i * Math.PI / 3) * 0.5 + 0.5,
                  Math.sin(i * Math.PI / 4) * 0.3
                ]}
                scale={0.02}
              >
                <meshStandardMaterial 
                  color="#FFD700" 
                  emissive="#FFD700" 
                  emissiveIntensity={0.5}
                />
              </Sphere>
            ))}
          </group>
        )}
      </Float>
    </group>
  )
}

// 3D Robot Explorer for ages 6-9
function RobotExplorer3D({ emotion, activity }: { emotion: string; activity: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const antennaRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    
    // Robotic movement
    const time = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.05
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1
    
    // Antenna glow
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(time * 2) * 0.2
    }
    
    if (emotion === 'excited') {
      groupRef.current.rotation.x = Math.sin(time * 4) * 0.05
    }
  })

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return '#00CED1'
      case 'excited': return '#FF6347'
      case 'proud': return '#4169E1'
      case 'encouraging': return '#32CD32'
      case 'thinking': return '#9370DB'
      default: return '#00CED1'
    }
  }

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
        {/* Main body */}
        <Box position={[0, 0, 0]} scale={[0.6, 0.8, 0.4]}>
          <meshStandardMaterial 
            color={getEmotionColor()}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>

        {/* Head */}
        <Box position={[0, 0.7, 0]} scale={[0.5, 0.4, 0.4]}>
          <meshStandardMaterial 
            color="#E0E0E0"
            metalness={0.9}
            roughness={0.1}
          />
        </Box>

        {/* Eyes (LED screens) */}
        <Box position={[-0.15, 0.75, 0.21]} scale={[0.08, 0.08, 0.02]}>
          <meshStandardMaterial 
            color="#00FF00" 
            emissive="#00FF00"
            emissiveIntensity={0.5}
          />
        </Box>
        <Box position={[0.15, 0.75, 0.21]} scale={[0.08, 0.08, 0.02]}>
          <meshStandardMaterial 
            color="#00FF00"
            emissive="#00FF00" 
            emissiveIntensity={0.5}
          />
        </Box>

        {/* Antenna */}
        <group ref={antennaRef} position={[0, 1, 0]}>
          <Cylinder args={[0.02, 0.02, 0.3]} position={[0, 0.15, 0]}>
            <meshStandardMaterial color="#666666" />
          </Cylinder>
          <Sphere position={[0, 0.35, 0]} scale={0.05}>
            <meshStandardMaterial 
              color="#FF0000" 
              emissive="#FF0000"
              emissiveIntensity={emotion === 'thinking' ? 1 : 0.3}
            />
          </Sphere>
        </group>

        {/* Arms */}
        <Cylinder
          position={[-0.5, 0.2, 0]}
          args={[0.06, 0.06, 0.4]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <meshStandardMaterial color={getEmotionColor()} metalness={0.7} />
        </Cylinder>
        <Cylinder
          position={[0.5, 0.2, 0]}
          args={[0.06, 0.06, 0.4]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <meshStandardMaterial color={getEmotionColor()} metalness={0.7} />
        </Cylinder>

        {/* Legs */}
        <Cylinder
          position={[-0.2, -0.6, 0]}
          args={[0.08, 0.08, 0.4]}
        >
          <meshStandardMaterial color={getEmotionColor()} metalness={0.7} />
        </Cylinder>
        <Cylinder
          position={[0.2, -0.6, 0]}
          args={[0.08, 0.08, 0.4]}
        >
          <meshStandardMaterial color={getEmotionColor()} metalness={0.7} />
        </Cylinder>

        {/* Digital particles for thinking/processing */}
        {emotion === 'thinking' && (
          <group>
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                position={[
                  Math.sin(i * Math.PI / 4) * 0.8,
                  Math.cos(i * Math.PI / 4) * 0.3 + 0.5,
                  Math.sin(i * Math.PI / 6) * 0.2
                ]}
                scale={0.03}
              >
                <meshStandardMaterial 
                  color="#00FFFF" 
                  emissive="#00FFFF"
                  emissiveIntensity={0.8}
                />
              </Box>
            ))}
          </group>
        )}
      </Float>
    </group>
  )
}

// 3D Tech Guide for ages 10-12
function TechGuide3D({ emotion, activity }: { emotion: string; activity: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const orbRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.08
    
    // Floating orbs
    if (orbRef.current) {
      orbRef.current.rotation.y = time * 0.5
    }
  })

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return '#6A5ACD'
      case 'excited': return '#FF4500'
      case 'proud': return '#DAA520'
      case 'encouraging': return '#228B22'
      case 'thinking': return '#4682B4'
      default: return '#6A5ACD'
    }
  }

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Humanoid form */}
        <Cylinder position={[0, 0, 0]} args={[0.3, 0.25, 0.8]}>
          <meshStandardMaterial 
            color={getEmotionColor()}
            roughness={0.1}
            metalness={0.3}
          />
        </Cylinder>

        {/* Head */}
        <Sphere position={[0, 0.6, 0]} scale={0.35}>
          <meshStandardMaterial 
            color="#F0F0F0"
            roughness={0.2}
            metalness={0.1}
          />
        </Sphere>

        {/* Visor/Eyes */}
        <Box position={[0, 0.65, 0.3]} scale={[0.5, 0.15, 0.05]}>
          <meshStandardMaterial 
            color="#000080"
            emissive="#000080"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Box>

        {/* Arms */}
        <Cylinder
          position={[-0.4, 0.3, 0]}
          args={[0.05, 0.05, 0.5]}
          rotation={[0, 0, Math.PI / 6]}
        >
          <meshStandardMaterial color={getEmotionColor()} />
        </Cylinder>
        <Cylinder
          position={[0.4, 0.3, 0]}
          args={[0.05, 0.05, 0.5]}
          rotation={[0, 0, -Math.PI / 6]}
        >
          <meshStandardMaterial color={getEmotionColor()} />
        </Cylinder>

        {/* Floating knowledge orbs */}
        <group ref={orbRef}>
          {[...Array(4)].map((_, i) => (
            <Sphere
              key={i}
              position={[
                Math.sin(i * Math.PI / 2) * 0.8,
                Math.cos(i * Math.PI / 2) * 0.3 + 0.8,
                Math.sin(i * Math.PI / 3) * 0.2
              ]}
              scale={0.08}
            >
              <meshStandardMaterial 
                color="#FFD700" 
                emissive="#FFD700"
                emissiveIntensity={0.6}
                transparent
                opacity={0.7}
              />
            </Sphere>
          ))}
        </group>

        {/* Energy field when encouraging */}
        {emotion === 'encouraging' && (
          <Torus position={[0, 0, 0]} args={[1, 0.1, 8, 16]}>
            <meshStandardMaterial 
              color="#32CD32"
              emissive="#32CD32"
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </Torus>
        )}
      </Float>
    </group>
  )
}

// Main 3D Companion Component
export function Companions3D({ 
  ageGroup, 
  name, 
  emotion = 'happy', 
  activity = 'idle',
  showSpeech = false,
  speechText = ""
}: Companion3DProps) {
  const [aiPersonality, setAiPersonality] = useState<string>("")

  // Generate AI personality
  useEffect(() => {
    const generatePersonality = async () => {
      const prompt = spark.llmPrompt`Generate a one-sentence personality trait for a companion character based on:
- Age group: ${ageGroup}
- Emotion: ${emotion}
- Activity: ${activity}
- Name: ${name}

Make it encouraging, age-appropriate, and reflective of the current state. Keep it under 20 words.`

      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini')
        setAiPersonality(response.trim())
      } catch (error) {
        // Fallback personalities
        const fallbacks = {
          '3-5': "Ready for magical learning adventures!",
          '6-9': "Let's explore and discover together!",
          '10-12': "Thinking big thoughts and solving challenges!"
        }
        setAiPersonality(fallbacks[ageGroup])
      }
    }

    generatePersonality()
  }, [ageGroup, emotion, activity, name])

  const getCompanionComponent = () => {
    switch (ageGroup) {
      case '3-5':
        return <BabyDragon3D emotion={emotion} activity={activity} />
      case '6-9':
        return <RobotExplorer3D emotion={emotion} activity={activity} />
      case '10-12':
        return <TechGuide3D emotion={emotion} activity={activity} />
      default:
        return <BabyDragon3D emotion={emotion} activity={activity} />
    }
  }

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "backOut" }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeech && speechText && (
          <motion.div
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl px-4 py-3 shadow-lg border-2 border-primary/20 max-w-xs relative">
              <p className="text-sm font-medium text-foreground text-center">{speechText}</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Personality indicator */}
      {aiPersonality && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-gradient-to-r from-primary/80 to-secondary/80 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
            {aiPersonality}
          </div>
        </motion.div>
      )}

      {/* 3D Companion */}
      <div className="w-32 h-32 mx-auto">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 5, 2]} intensity={1} />
            <pointLight position={[-2, 2, 2]} intensity={0.5} color="#FFB6C1" />

            {/* Environment */}
            <Environment preset="sunset" />
            
            {/* Companion */}
            {getCompanionComponent()}

            {/* Ground shadow */}
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.2}
              scale={3}
              blur={2}
            />

            {/* Subtle camera controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3}
              autoRotate={emotion === 'excited'}
              autoRotateSpeed={1}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(emotion === 'excited' ? 6 : 3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Companion name */}
      <motion.div
        className="text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm font-medium text-foreground/80">{name}</p>
      </motion.div>
    </motion.div>
  )
}
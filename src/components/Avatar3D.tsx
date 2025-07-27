import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Float,
  Text3D,
  Center,
  useGLTF,
  Sphere,
  Box,
  Cylinder
} from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface Avatar3DProps {
  avatar: {
    body: string
    hair: string
    clothes: string
    accessories: string[]
  }
  size?: 'small' | 'medium' | 'large'
  className?: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  animated?: boolean
}

// 3D Avatar Character Component
function AvatarCharacter({ avatar, emotion = 'happy', animated = true }: {
  avatar: Avatar3DProps['avatar']
  emotion: string
  animated: boolean
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Animation frame
  useFrame((state) => {
    if (!meshRef.current || !animated) return
    
    // Gentle breathing animation
    meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02
    
    // Subtle floating based on emotion
    const emotionIntensity = emotion === 'excited' ? 0.1 : emotion === 'happy' ? 0.05 : 0.02
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * emotionIntensity
    
    // Head tilt for personality
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
  })

  // Color schemes based on avatar properties
  const getBodyColor = (bodyType: string) => {
    const colors = {
      light: '#FDB5A6',
      medium: '#D2B48C', 
      dark: '#8B4513',
      tan: '#DEB887',
      default: '#FFB6C1'
    }
    return colors[bodyType as keyof typeof colors] || colors.default
  }

  const getHairColor = (hairType: string) => {
    const colors = {
      'brown-short': '#8B4513',
      'blonde-long': '#FFD700',
      'black-curly': '#000000',
      'red-pigtails': '#FF4500',
      'blue-spiky': '#4169E1',
      default: '#8B4513'
    }
    return colors[hairType as keyof typeof colors] || colors.default
  }

  const getClothesColor = (clothesType: string) => {
    const colors = {
      'red-tshirt': '#DC143C',
      'blue-dress': '#1E90FF',
      'green-hoodie': '#32CD32',
      'purple-shirt': '#9370DB',
      'yellow-overalls': '#FFD700',
      default: '#4169E1'
    }
    return colors[clothesType as keyof typeof colors] || colors.default
  }

  return (
    <group ref={meshRef}>
      {/* Main Body */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Head */}
        <Sphere
          position={[0, 1.2, 0]}
          scale={0.5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={getBodyColor(avatar.body)}
            roughness={0.3}
            metalness={0.1}
          />
        </Sphere>

        {/* Eyes */}
        <group position={[0, 1.2, 0]}>
          <Sphere position={[-0.15, 0.1, 0.35]} scale={0.08}>
            <meshStandardMaterial color="#000000" />
          </Sphere>
          <Sphere position={[0.15, 0.1, 0.35]} scale={0.08}>
            <meshStandardMaterial color="#000000" />
          </Sphere>
          
          {/* Eye highlights for emotion */}
          {emotion === 'happy' && (
            <>
              <Sphere position={[-0.12, 0.12, 0.37]} scale={0.02}>
                <meshStandardMaterial color="#FFFFFF" />
              </Sphere>
              <Sphere position={[0.18, 0.12, 0.37]} scale={0.02}>
                <meshStandardMaterial color="#FFFFFF" />
              </Sphere>
            </>
          )}
        </group>

        {/* Hair */}
        <Sphere
          position={[0, 1.5, -0.1]}
          scale={[0.6, 0.4, 0.5]}
        >
          <meshStandardMaterial 
            color={getHairColor(avatar.hair)}
            roughness={0.8}
          />
        </Sphere>

        {/* Body */}
        <Cylinder
          position={[0, 0.4, 0]}
          args={[0.3, 0.4, 0.8]}
        >
          <meshStandardMaterial 
            color={getClothesColor(avatar.clothes)}
            roughness={0.4}
          />
        </Cylinder>

        {/* Arms */}
        <Cylinder
          position={[-0.5, 0.6, 0]}
          args={[0.08, 0.08, 0.6]}
          rotation={[0, 0, Math.PI / 6]}
        >
          <meshStandardMaterial 
            color={getBodyColor(avatar.body)}
            roughness={0.3}
          />
        </Cylinder>
        <Cylinder
          position={[0.5, 0.6, 0]}
          args={[0.08, 0.08, 0.6]}
          rotation={[0, 0, -Math.PI / 6]}
        >
          <meshStandardMaterial 
            color={getBodyColor(avatar.body)}
            roughness={0.3}
          />
        </Cylinder>

        {/* Legs */}
        <Cylinder
          position={[-0.15, -0.3, 0]}
          args={[0.08, 0.08, 0.6]}
        >
          <meshStandardMaterial 
            color={getBodyColor(avatar.body)}
            roughness={0.3}
          />
        </Cylinder>
        <Cylinder
          position={[0.15, -0.3, 0]}
          args={[0.08, 0.08, 0.6]}
        >
          <meshStandardMaterial 
            color={getBodyColor(avatar.body)}
            roughness={0.3}
          />
        </Cylinder>

        {/* Accessories */}
        {avatar.accessories.includes('hat') && (
          <Cylinder
            position={[0, 1.7, 0]}
            args={[0.4, 0.4, 0.1]}
          >
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
        )}

        {avatar.accessories.includes('glasses') && (
          <group position={[0, 1.2, 0.3]}>
            <Cylinder
              position={[-0.2, 0, 0]}
              args={[0.12, 0.12, 0.02]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial color="#333333" transparent opacity={0.3} />
            </Cylinder>
            <Cylinder
              position={[0.2, 0, 0]}
              args={[0.12, 0.12, 0.02]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial color="#333333" transparent opacity={0.3} />
            </Cylinder>
          </group>
        )}

        {/* Emotion-based particles */}
        {hovered && emotion === 'happy' && (
          <group>
            {[...Array(5)].map((_, i) => (
              <Sphere
                key={i}
                position={[
                  Math.sin(i * 2) * 0.8,
                  1.5 + Math.cos(i * 2) * 0.3,
                  Math.cos(i * 2) * 0.5
                ]}
                scale={0.05}
              >
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
              </Sphere>
            ))}
          </group>
        )}
      </Float>
    </group>
  )
}

// Main Avatar 3D Component
export function Avatar3D({ 
  avatar, 
  size = 'medium', 
  className, 
  emotion = 'happy',
  animated = true 
}: Avatar3DProps) {
  const sizeConfig = {
    small: { width: 120, height: 120, cameraDistance: 3 },
    medium: { width: 160, height: 160, cameraDistance: 2.5 },
    large: { width: 200, height: 200, cameraDistance: 2 }
  }

  const config = sizeConfig[size]

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: config.width, height: config.height }}
      initial={{ scale: 0, rotateY: -180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: "backOut",
        staggerChildren: 0.1
      }}
      whileHover={{ scale: 1.05 }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, config.cameraDistance], 
          fov: 50 
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden'
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1} castShadow />
        <pointLight position={[-2, 2, 2]} intensity={0.5} color="#FFB6C1" />

        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Avatar Character */}
        <AvatarCharacter 
          avatar={avatar} 
          emotion={emotion} 
          animated={animated}
        />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.3}
          scale={3}
          blur={2}
        />

        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          autoRotate={emotion === 'excited'}
          autoRotateSpeed={2}
        />
      </Canvas>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${
            emotion === 'happy' ? '#FFD700' : 
            emotion === 'excited' ? '#FF69B4' :
            emotion === 'proud' ? '#9370DB' :
            emotion === 'encouraging' ? '#32CD32' :
            '#87CEEB'
          }22, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

// Enhanced 3D Companion for the learning environment
export function Avatar3DCompanion({ 
  avatar, 
  emotion = 'happy',
  size = 'medium',
  showSpeechBubble = false,
  speechText = "",
  className
}: Avatar3DProps & {
  showSpeechBubble?: boolean
  speechText?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <Avatar3D 
        avatar={avatar}
        emotion={emotion}
        size={size}
        animated={true}
      />
      
      {/* Speech bubble */}
      {showSpeechBubble && speechText && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-primary/20 max-w-xs">
            <p className="text-sm font-medium text-foreground">{speechText}</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useSound } from '@/lib/sound'
import type { AgeGroup, Subject } from '@/App'

interface ParticleSystemProps {
  type: 'celebration' | 'sparkles' | 'stars' | 'hearts' | 'coins'
  intensity: 'low' | 'medium' | 'high'
  ageGroup: AgeGroup
  duration?: number
  onComplete?: () => void
}

interface ParticleConfig {
  emoji: string
  count: number
  colors: string[]
  physics: 'float' | 'bounce' | 'spiral' | 'explode' | 'rain'
}

const PARTICLE_CONFIGS: Record<string, ParticleConfig> = {
  celebration: {
    emoji: '🎉',
    count: 12,
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    physics: 'explode'
  },
  sparkles: {
    emoji: '✨',
    count: 8,
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
    physics: 'float'
  },
  stars: {
    emoji: '⭐',
    count: 6,
    colors: ['#FFD700', '#FFF700', '#FFAA00'],
    physics: 'spiral'
  },
  hearts: {
    emoji: '💕',
    count: 5,
    colors: ['#FF69B4', '#FF1493', '#DC143C'],
    physics: 'bounce'
  },
  coins: {
    emoji: '🪙',
    count: 4,
    colors: ['#FFD700', '#FFA500'],
    physics: 'rain'
  }
}

export function ParticleSystem({ type, intensity, ageGroup, duration = 3000, onComplete }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { playSuccess, playCollect } = useSound()

  const config = PARTICLE_CONFIGS[type]
  const intensityMultiplier = intensity === 'low' ? 0.5 : intensity === 'medium' ? 1 : 1.5
  const particleCount = Math.floor(config.count * intensityMultiplier)

  useEffect(() => {
    if (!containerRef.current) return

    // Play appropriate sound
    if (type === 'celebration') playSuccess()
    if (type === 'coins') playCollect()

    // Generate initial particles
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
    setParticles(newParticles)

    // Cleanup after duration
    const timer = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [type, intensity, duration, particleCount, onComplete, playSuccess, playCollect])

  const getPhysicsAnimation = (physics: string, index: number) => {
    const baseDelay = index * 0.1
    
    switch (physics) {
      case 'explode':
        return {
          initial: { scale: 0, opacity: 0, x: '50%', y: '50%' },
          animate: {
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0],
            x: `${50 + (Math.random() - 0.5) * 200}%`,
            y: `${50 + (Math.random() - 0.5) * 200}%`,
            rotate: Math.random() * 360
          },
          transition: { duration: 2, delay: baseDelay }
        }
      
      case 'float':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: [0, 1, 0.8, 0],
            opacity: [0, 1, 0.7, 0],
            y: [-20, -40, -60, -80],
            x: [0, Math.sin(index) * 20, Math.sin(index * 2) * 15, 0]
          },
          transition: { duration: 3, delay: baseDelay }
        }
      
      case 'spiral':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: Array.from({ length: 20 }, (_, i) => Math.cos(i * 0.5) * (i * 2)),
            y: Array.from({ length: 20 }, (_, i) => Math.sin(i * 0.5) * (i * 2) - i * 3)
          },
          transition: { duration: 2.5, delay: baseDelay }
        }
      
      case 'bounce':
        return {
          initial: { scale: 0, y: -20 },
          animate: {
            scale: [0, 1.2, 1, 0],
            y: [-20, 0, -10, 0, -5, 0],
            opacity: [0, 1, 1, 0]
          },
          transition: { duration: 2, delay: baseDelay }
        }
      
      case 'rain':
        return {
          initial: { y: -50, opacity: 0 },
          animate: {
            y: ['-50px', '100vh'],
            opacity: [0, 1, 1, 0],
            x: [0, Math.sin(index) * 30],
            rotate: [0, 180, 360]
          },
          transition: { duration: 3, delay: baseDelay }
        }
      
      default:
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0, opacity: 0 },
          transition: { duration: 1, delay: baseDelay }
        }
    }
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      <AnimatePresence>
        {particles.map((particle, index) => {
          const animation = getPhysicsAnimation(config.physics, index)
          return (
            <motion.div
              key={particle.id}
              className="absolute text-2xl select-none"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                filter: `hue-rotate(${index * 30}deg)`
              }}
              {...animation}
            >
              {config.emoji}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Age-appropriate celebration effects
export function CelebrationEffect({ ageGroup, type = 'achievement', onComplete }: {
  ageGroup: AgeGroup
  type?: 'achievement' | 'correct' | 'milestone' | 'level_up'
  onComplete?: () => void
}) {
  const getAgeAppropriateEffect = () => {
    switch (ageGroup) {
      case '3-5':
        return type === 'achievement' ? 'hearts' : 'sparkles'
      case '6-9':
        return type === 'achievement' ? 'stars' : 'celebration'
      case '10-12':
        return type === 'achievement' ? 'celebration' : 'sparkles'
      default:
        return 'sparkles'
    }
  }

  const getIntensity = () => {
    switch (type) {
      case 'milestone':
      case 'level_up':
        return 'high'
      case 'achievement':
        return 'medium'
      default:
        return 'low'
    }
  }

  return (
    <ParticleSystem
      type={getAgeAppropriateEffect() as any}
      intensity={getIntensity() as any}
      ageGroup={ageGroup}
      duration={type === 'level_up' ? 4000 : 3000}
      onComplete={onComplete}
    />
  )
}

// Interactive elements that respond to user actions
export function InteractiveSparkle({ children, ageGroup, onClick }: {
  children: React.ReactNode
  ageGroup: AgeGroup
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSparkle, setShowSparkle] = useState(false)
  const { playClick } = useSound()

  const handleClick = () => {
    playClick()
    setShowSparkle(true)
    setTimeout(() => setShowSparkle(false), 1000)
    onClick?.()
  }

  const hoverAnimation = {
    scale: isHovered ? 1.05 : 1,
    transition: { duration: 0.2 }
  }

  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      animate={hoverAnimation}
    >
      {children}
      
      {showSparkle && (
        <ParticleSystem
          type="sparkles"
          intensity="low"
          ageGroup={ageGroup}
          duration={1000}
        />
      )}
      
      {isHovered && (
        <motion.div
          className="absolute -inset-2 bg-primary/10 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}

// Advanced animation hook for complex sequences
export function useAdvancedAnimation() {
  const { playSuccess, playError, playAchievement } = useSound()
  const controls = useAnimation()

  const createCelebrationSequence = async (type: 'success' | 'achievement' | 'level_up') => {
    switch (type) {
      case 'success':
        playSuccess()
        await controls.start({
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
          transition: { duration: 0.8, ease: "easeOut" }
        })
        break

      case 'achievement':
        playAchievement()
        await controls.start({
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.8, ease: "backOut" }
        })
        break

      case 'level_up':
        playAchievement()
        await controls.start({
          scale: [1, 1.3, 1],
          filter: ['hue-rotate(0deg) brightness(1)', 'hue-rotate(360deg) brightness(1.2)', 'hue-rotate(0deg) brightness(1)'],
          transition: { duration: 1.8, ease: "elasticOut" }
        })
        break
    }
  }

  const createErrorShake = async () => {
    playError()
    await controls.start({
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    })
  }

  const createPulseAttention = async () => {
    await controls.start({
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(var(--primary), 0.7)', 
        '0 0 0 10px rgba(var(--primary), 0)', 
        '0 0 0 0 rgba(var(--primary), 0)'
      ],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    })
  }

  return {
    controls,
    createCelebrationSequence,
    createErrorShake,
    createPulseAttention
  }
}
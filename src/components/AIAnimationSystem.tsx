
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import type { AgeGroup, Subject } from '@/App'

interface AIAnimationSystemProps {
  ageGroup: AgeGroup
  subject?: Subject
  userProgress?: number
  emotion?: 'happy' | 'excited' | 'confused' | 'proud' | 'encouraging'
  trigger?: 'activity_start' | 'correct_answer' | 'wrong_answer' | 'achievement' | 'idle'
  children: React.ReactNode
}

interface AnimationPattern {
  type: 'celebration' | 'encouragement' | 'thinking' | 'discovery' | 'idle'
  particles: ParticleConfig[]
  companionAction: CompanionAction
  backgroundEffect: BackgroundEffect
}

interface ParticleConfig {
  emoji: string
  count: number
  duration: number
  physics: 'float' | 'bounce' | 'spiral' | 'explode'
  color?: string
}

interface CompanionAction {
  animation: 'bounce' | 'spin' | 'glow' | 'dance' | 'think'
  intensity: number
  duration: number
}

interface BackgroundEffect {
  type: 'pulse' | 'wave' | 'sparkle' | 'gradient_shift' | 'none'
  color: string
  intensity: number
}

// AI-generated animation patterns based on context
const generateAnimationPattern = async (
  ageGroup: AgeGroup,
  subject: Subject,
  emotion: string,
  trigger: string,
  progress: number
): Promise<AnimationPattern> => {
  const prompt = spark.llmPrompt`Create an animation pattern for a kids learning app with these details:
- Age Group: ${ageGroup}
- Subject: ${subject}
- Emotion: ${emotion}
- Trigger: ${trigger}
- Progress: ${progress}%

Consider age-appropriate visual elements, educational psychology, and engagement principles.
Return a JSON object with this structure:
{
  "type": "celebration|encouragement|thinking|discovery|idle",
  "particles": [
    {
      "emoji": "relevant emoji for age and subject",
      "count": "number of particles (3-12)",
      "duration": "animation duration in seconds (1-4)",
      "physics": "float|bounce|spiral|explode",
      "color": "hex color or null"
    }
  ],
  "companionAction": {
    "animation": "bounce|spin|glow|dance|think",
    "intensity": "1-10 scale",
    "duration": "duration in seconds"
  },
  "backgroundEffect": {
    "type": "pulse|wave|sparkle|gradient_shift|none",
    "color": "hex color",
    "intensity": "1-10 scale"
  }
}

Use age-appropriate complexity:
- Ages 3-5: Simple, soft animations with basic shapes and gentle movements
- Ages 6-9: More dynamic with moderate complexity and playful elements  
- Ages 10-12: Sophisticated effects with meaningful visual feedback

Use subject-specific themes:
- Math: Numbers, geometric shapes, calculation symbols
- Science: Atoms, stars, lab equipment, nature elements
- Reading: Letters, books, words, storytelling elements
- Art: Brushes, colors, creative tools, artistic elements`

  try {
    const response = await spark.llm(prompt, 'gpt-4o', true)
    return JSON.parse(response)
  } catch (error) {
    return getDefaultPattern(ageGroup, emotion, trigger)
  }
}

// Fallback patterns for when AI generation fails
const getDefaultPattern = (ageGroup: AgeGroup, emotion: string, trigger: string): AnimationPattern => {
  const patterns = {
    '3-5': {
      celebration: {
        type: 'celebration',
        particles: [{ emoji: '🌟', count: 6, duration: 2, physics: 'float' }],
        companionAction: { animation: 'bounce', intensity: 5, duration: 2 },
        backgroundEffect: { type: 'pulse', color: '#fbbf24', intensity: 3 }
      },
      encouragement: {
        type: 'encouragement',
        particles: [{ emoji: '💕', count: 4, duration: 3, physics: 'float' }],
        companionAction: { animation: 'glow', intensity: 4, duration: 3 },
        backgroundEffect: { type: 'wave', color: '#f472b6', intensity: 2 }
      }
    },
    '6-9': {
      celebration: {
        type: 'celebration',
        particles: [{ emoji: '⚡', count: 8, duration: 2.5, physics: 'bounce' }],
        companionAction: { animation: 'dance', intensity: 7, duration: 2.5 },
        backgroundEffect: { type: 'sparkle', color: '#3b82f6', intensity: 5 }
      },
      encouragement: {
        type: 'encouragement',
        particles: [{ emoji: '🚀', count: 5, duration: 3, physics: 'spiral' }],
        companionAction: { animation: 'spin', intensity: 6, duration: 3 },
        backgroundEffect: { type: 'gradient_shift', color: '#06b6d4', intensity: 4 }
      }
    },
    '10-12': {
      celebration: {
        type: 'celebration',
        particles: [{ emoji: '✨', count: 10, duration: 3, physics: 'explode' }],
        companionAction: { animation: 'dance', intensity: 8, duration: 3 },
        backgroundEffect: { type: 'wave', color: '#8b5cf6', intensity: 6 }
      },
      encouragement: {
        type: 'encouragement',
        particles: [{ emoji: '🎯', count: 6, duration: 3.5, physics: 'spiral' }],
        companionAction: { animation: 'glow', intensity: 7, duration: 3.5 },
        backgroundEffect: { type: 'pulse', color: '#10b981', intensity: 5 }
      }
    }
  }

  const agePatterns = patterns[ageGroup]
  const triggerType = trigger === 'correct_answer' || trigger === 'achievement' ? 'celebration' : 'encouragement'
  return agePatterns[triggerType]
}

// Particle animation component
function AnimatedParticles({ particles }: { particles: ParticleConfig[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle, particleIndex) => 
          Array.from({ length: particle.count }).map((_, index) => (
            <motion.div
              key={`${particleIndex}-${index}`}
              className="absolute text-2xl"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0],
                rotate: [0, Math.random() * 360]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: particle.duration,
                delay: index * 0.1,
                ease: 'easeInOut'
              }}
            >
              {particle.emoji}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

// Background effect component
function BackgroundEffect({ effect }: { effect: BackgroundEffect }) {
  const controls = useAnimation()

  useEffect(() => {
    const runAnimation = async () => {
      switch (effect.type) {
        case 'pulse':
          await controls.start({
            scale: [1, 1 + effect.intensity * 0.05, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          })
          break
        
        case 'wave':
          await controls.start({
            background: [
              `linear-gradient(45deg, ${effect.color}20, ${effect.color}10, ${effect.color}20)`,
              `linear-gradient(45deg, ${effect.color}10, ${effect.color}20, ${effect.color}10)`
            ],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          })
          break

        case 'sparkle':
          await controls.start({
            filter: [
              'hue-rotate(0deg) saturate(1)',
              `hue-rotate(${effect.intensity * 10}deg) saturate(${1 + effect.intensity * 0.2})`,
              'hue-rotate(0deg) saturate(1)'
            ],
            transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          })
          break

        case 'gradient_shift':
          await controls.start({
            background: [
              `radial-gradient(circle at 30% 30%, ${effect.color}15, transparent 70%)`,
              `radial-gradient(circle at 70% 70%, ${effect.color}15, transparent 70%)`,
              `radial-gradient(circle at 30% 30%, ${effect.color}15, transparent 70%)`
            ],
            transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          })
          break
      }
    }

    runAnimation()
  }, [effect, controls])

  return (
    <motion.div
      animate={controls}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: effect.color ? `${effect.color}10` : 'transparent',
        mixBlendMode: 'multiply'
      }}
    />
  )
}

// Main AI Animation System component
export function AIAnimationSystem({
  ageGroup,
  subject = 'math',
  userProgress = 0,
  emotion = 'happy',
  trigger = 'idle',
  children
}: AIAnimationSystemProps) {
  const [currentPattern, setCurrentPattern] = useState<AnimationPattern | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (trigger === 'idle') return

    const generateAnimation = async () => {
      setIsGenerating(true)
      try {
        const pattern = await generateAnimationPattern(
          ageGroup,
          subject,
          emotion,
          trigger,
          userProgress
        )
        setCurrentPattern(pattern)
        
        setTimeout(() => {
          setCurrentPattern(null)
        }, Math.max(...pattern.particles.map(p => p.duration)) * 1000 + 1000)
      } catch (error) {
        console.error('Failed to generate AI animation:', error)
      } finally {
        setIsGenerating(false)
      }
    }

    generateAnimation()
  }, [ageGroup, subject, emotion, trigger, userProgress])

  return (
    <div ref={containerRef} className="relative">
      {currentPattern && (
        <BackgroundEffect effect={currentPattern.backgroundEffect} />
      )}
      
      {currentPattern && (
        <AnimatedParticles particles={currentPattern.particles} />
      )}
      
      {isGenerating && (
        <div className="absolute top-4 right-4 z-50">
          <motion.div
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
      
      {currentPattern && (
        <motion.div
          className="absolute bottom-4 left-4 z-40"
          animate={{
            y: currentPattern.companionAction.animation === 'bounce' 
              ? [0, -currentPattern.companionAction.intensity * 2, 0]
              : 0,
            rotate: currentPattern.companionAction.animation === 'spin'
              ? [0, 360 * currentPattern.companionAction.intensity]
              : 0,
            scale: currentPattern.companionAction.animation === 'dance'
              ? [1, 1 + currentPattern.companionAction.intensity * 0.1, 1]
              : 1,
            filter: currentPattern.companionAction.animation === 'glow'
              ? [
                  'brightness(1)',
                  `brightness(${1 + currentPattern.companionAction.intensity * 0.2}) drop-shadow(0 0 ${currentPattern.companionAction.intensity * 2}px rgba(255,255,255,0.8))`,
                  'brightness(1)'
                ]
              : 'brightness(1)'
          }}
          transition={{
            duration: currentPattern.companionAction.duration,
            ease: 'easeInOut'
          }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white text-sm">
            🤖
          </div>
        </motion.div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Hook for triggering AI animations
export function useAIAnimation() {
  const [trigger, setTrigger] = useState<{
    type: 'activity_start' | 'correct_answer' | 'wrong_answer' | 'achievement' | 'idle'
    emotion: 'happy' | 'excited' | 'confused' | 'proud' | 'encouraging'
  }>({ type: 'idle', emotion: 'happy' })

  const triggerAnimation = (
    type: 'activity_start' | 'correct_answer' | 'wrong_answer' | 'achievement',
    emotion: 'happy' | 'excited' | 'confused' | 'proud' | 'encouraging' = 'happy'
  ) => {
    setTrigger({ type, emotion })
    
    setTimeout(() => {
      setTrigger({ type: 'idle', emotion: 'happy' })
    }, 500)
  }

  return { trigger, triggerAnimation }
}

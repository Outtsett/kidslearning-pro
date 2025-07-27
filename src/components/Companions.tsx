import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import type { AgeGroup } from '@/App'

interface CompanionProps {
  ageGroup: AgeGroup
  name: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
}

// AI-Enhanced Movement Controller
function useAIMovement(emotion: string, activity: string) {
  const [movement, setMovement] = useState<{
    x: number;
    y: number;
    intensity: number;
  }>({
    x: 0,
    y: 0,
    intensity: 1
  })

  useEffect(() => {
    const generateMovement = async () => {
      const prompt = spark.llmPrompt`Generate natural movement parameters for a companion character based on:
- Emotion: ${emotion}
- Activity: ${activity}

Return JSON with structure:
{
  "x": "horizontal movement range (-20 to 20)",
  "y": "vertical movement range (-15 to 15)", 
  "intensity": "movement intensity (0.5 to 2.0)"
}

Consider natural, PBS kids-style animation that feels alive but not distracting.`

      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini', true)
        const newMovement = JSON.parse(response)
        setMovement(newMovement)
      } catch (error) {
        // Fallback movement patterns
        const fallbacks = {
          happy: { x: 8, y: -5, intensity: 1.2 },
          excited: { x: 15, y: -10, intensity: 1.8 },
          proud: { x: 5, y: -8, intensity: 1.0 },
          encouraging: { x: 10, y: -6, intensity: 1.3 },
          thinking: { x: 3, y: -3, intensity: 0.8 }
        }
        setMovement(fallbacks[emotion as keyof typeof fallbacks] || fallbacks.happy)
      }
    }

    generateMovement()
  }, [emotion, activity])

  return movement
}

// Floating Background Elements
function FloatingElements({ count = 6, children }: { count?: number, children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            opacity: 0.3
          }}
          animate={{
            x: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%'
            ],
            y: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%', 
              Math.random() * 100 + '%'
            ],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  )
}

// Baby Dragon for ages 3-5 - Enhanced with AI
function BabyDragon({ message, emotion = 'happy', activity = 'idle' }: { 
  message: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
}) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [isFlapping, setIsFlapping] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [aiPersonality, setAIPersonality] = useState('')
  const dragonRef = useRef<HTMLDivElement>(null)
  const movement = useAIMovement(emotion, activity)

  // AI-generated personality responses
  useEffect(() => {
    const generatePersonality = async () => {
      const prompt = spark.llmPrompt`Generate a short, warm personality trait for a baby dragon companion based on:
- Current emotion: ${emotion}
- Current activity: ${activity}
- Age group: 3-5 years

Return a single descriptive phrase (2-4 words) that captures the dragon's current mood.
Examples: "giggling softly", "eyes sparkling", "tail swishing", "wings fluttering"
Keep it gentle and nurturing for young children.`

      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini')
        setAIPersonality(response.trim())
      } catch (error) {
        setAIPersonality('eyes twinkling')
      }
    }

    generatePersonality()
  }, [emotion, activity])

  // Enhanced GSAP animations based on AI movement
  useEffect(() => {
    if (!dragonRef.current) return

    const element = dragonRef.current
    const tl = gsap.timeline({ repeat: -1 })
    
    tl.to(element, {
      x: movement.x * movement.intensity,
      y: movement.y * movement.intensity,
      rotation: movement.x * 0.1,
      duration: 3 + Math.random() * 2,
      ease: 'power2.inOut'
    })
    .to(element, {
      x: -movement.x * movement.intensity * 0.5,
      y: movement.y * movement.intensity * 0.3,
      rotation: -movement.x * 0.1,
      duration: 3 + Math.random() * 2,
      ease: 'power2.inOut'
    })
    .to(element, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 2,
      ease: 'power2.inOut'
    })

    return () => {
      tl.kill()
    }
  }, [movement])

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 2000 + Math.random() * 2000)

    const flapInterval = setInterval(() => {
      setIsFlapping(true)
      setTimeout(() => setIsFlapping(false), 600)
    }, 3000 + Math.random() * 2000)

    const heartInterval = setInterval(() => {
      if (emotion === 'happy' || emotion === 'proud') {
        setShowHearts(true)
        setTimeout(() => setShowHearts(false), 2000)
      }
    }, 6000 + Math.random() * 4000)

    return () => {
      clearInterval(blinkInterval)
      clearInterval(flapInterval)
      clearInterval(heartInterval)
    }
  }, [emotion])

  const emotionColors = {
    happy: 'from-pink-400 to-purple-500',
    excited: 'from-yellow-400 to-orange-500',
    proud: 'from-purple-400 to-indigo-500',
    encouraging: 'from-green-400 to-teal-500',
    thinking: 'from-blue-400 to-cyan-500'
  }

  return (
    <div className="relative">
      <FloatingElements count={emotion === 'excited' ? 8 : 4}>
        <div className="text-pink-300 text-lg">✨</div>
      </FloatingElements>
      
      <div className="flex items-center gap-4 relative z-10">
        <div ref={dragonRef} className="relative">
          {/* Dragon Body */}
          <div className={`w-16 h-16 bg-gradient-to-br ${emotionColors[emotion]} rounded-full relative shadow-lg transition-all duration-500`}>
            {/* Eyes */}
            <div className="absolute top-3 left-3 flex gap-2">
              <motion.div
                className="w-3 h-3 bg-white rounded-full flex items-center justify-center"
                animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                transition={{ duration: 0.1 }}
              >
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </motion.div>
              <motion.div
                className="w-3 h-3 bg-white rounded-full flex items-center justify-center"
                animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                transition={{ duration: 0.1 }}
              >
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </motion.div>
            </div>
            
            {/* Nose/Snout */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-pink-600 rounded-full"></div>
            
            {/* Wings with enhanced animation */}
            <motion.div
              className="absolute -top-1 -left-2 w-4 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full"
              animate={{ 
                rotate: isFlapping ? [0, -15, 0] : 0,
                scale: emotion === 'excited' ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'bottom center' }}
            />
            <motion.div
              className="absolute -top-1 -right-2 w-4 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full"
              animate={{ 
                rotate: isFlapping ? [0, 15, 0] : 0,
                scale: emotion === 'excited' ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'bottom center' }}
            />
            
            {/* Enhanced sparkles */}
            <motion.div
              className="absolute -top-2 -right-1 w-1 h-1 bg-yellow-300 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: emotion === 'excited' ? 1 : 2,
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-300 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: emotion === 'excited' ? 1 : 2,
                repeat: Infinity,
                delay: 1
              }}
            />
            
            {/* AI personality indicator */}
            {aiPersonality && (
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-pink-500/80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {aiPersonality}
              </motion.div>
            )}
          </div>
          
          {/* Enhanced Floating Hearts */}
          <AnimatePresence>
            {showHearts && (
              <>
                {[...Array(emotion === 'proud' ? 5 : 3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-pink-400 text-sm"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{ 
                      x: (i - 2) * 15, 
                      y: -20 - i * 5, 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2
                    }}
                  >
                    💕
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/90 rounded-xl p-3 shadow-lg relative">
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/90"></div>
            <p className="font-body text-sm text-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Robot Explorer for ages 6-9 - Enhanced with AI
function RobotExplorer({ message, emotion = 'excited', activity = 'idle' }: { 
  message: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
}) {
  const [isScanning, setIsScanning] = useState(false)
  const [antennaGlow, setAntennaGlow] = useState(false)
  const [showData, setShowData] = useState(false)
  const [aiDialogue, setAIDialogue] = useState('')
  const robotRef = useRef<HTMLDivElement>(null)
  const movement = useAIMovement(emotion, activity)

  // AI-generated robotic personality
  useEffect(() => {
    const generateDialogue = async () => {
      const prompt = spark.llmPrompt`Generate a short robotic catchphrase or system status for an explorer robot based on:
- Current emotion: ${emotion}
- Current activity: ${activity}
- Age group: 6-9 years

Return 2-4 words that sound like fun robot speech.
Examples: "SYSTEMS GO!", "SCANNING...", "AWESOME DETECTED!", "LEARNING MODE ON"
Keep it playful and tech-themed for school-age children.`

      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini')
        setAIDialogue(response.trim().replace(/['"]/g, ''))
      } catch (error) {
        setAIDialogue('READY TO EXPLORE!')
      }
    }

    generateDialogue()
  }, [emotion, activity])

  // Enhanced GSAP animations
  useEffect(() => {
    if (!robotRef.current) return

    const element = robotRef.current
    const tl = gsap.timeline({ repeat: -1 })
    
    tl.to(element, {
      x: movement.x * movement.intensity,
      y: movement.y * movement.intensity,
      rotation: movement.x * 0.05,
      duration: 2.5 + Math.random(),
      ease: 'power1.inOut'
    })
    .to(element, {
      x: -movement.x * movement.intensity * 0.7,
      y: movement.y * movement.intensity * 0.5,
      rotation: -movement.x * 0.05,
      duration: 2.5 + Math.random(),
      ease: 'power1.inOut'
    })
    .to(element, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1.5,
      ease: 'power1.inOut'
    })

    return () => {
      tl.kill()
    }
  }, [movement])

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setIsScanning(true)
      setTimeout(() => setIsScanning(false), 1000)
    }, 2500 + Math.random() * 2000)

    const glowInterval = setInterval(() => {
      setAntennaGlow(true)
      setTimeout(() => setAntennaGlow(false), 300)
    }, 1500 + Math.random() * 1000)

    const dataInterval = setInterval(() => {
      if (emotion === 'thinking' || activity === 'explaining') {
        setShowData(true)
        setTimeout(() => setShowData(false), 3000)
      }
    }, 5000 + Math.random() * 3000)

    return () => {
      clearInterval(scanInterval)
      clearInterval(glowInterval)
      clearInterval(dataInterval)
    }
  }, [emotion, activity])

  const emotionColors = {
    happy: 'from-blue-400 to-cyan-500',
    excited: 'from-yellow-400 to-orange-500',
    proud: 'from-purple-400 to-blue-500',
    encouraging: 'from-green-400 to-blue-500',
    thinking: 'from-indigo-400 to-purple-500'
  }

  return (
    <div className="relative">
      <FloatingElements count={emotion === 'excited' ? 8 : 5}>
        <div className="text-blue-300 text-sm">⚡</div>
      </FloatingElements>
      
      <div className="flex items-center gap-4 relative z-10">
        <div ref={robotRef} className="relative">
          {/* Robot Body */}
          <div className={`w-16 h-16 bg-gradient-to-br ${emotionColors[emotion]} rounded-lg relative shadow-lg transition-all duration-500`}>
            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-400 rounded-full">
              <motion.div
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"
                animate={{
                  boxShadow: antennaGlow
                    ? ['0 0 0 0 rgba(74, 222, 128, 0.7)', '0 0 0 10px rgba(74, 222, 128, 0)']
                    : '0 0 0 0 rgba(74, 222, 128, 0)',
                  scale: emotion === 'excited' ? [1, 1.3, 1] : 1
                }}
                transition={{ duration: 0.6 }}
              />
            </div>
            
            {/* Eyes/Screen with emotion-based colors */}
            <div className="absolute top-3 left-2 right-2 h-6 bg-black rounded flex items-center justify-center">
              <motion.div
                className="flex gap-1"
                animate={{ x: isScanning ? [0, 8, -8, 0] : 0 }}
                transition={{ duration: 1 }}
              >
                <div className={`w-1 h-3 ${emotion === 'thinking' ? 'bg-purple-400' : 'bg-green-400'} rounded-full opacity-80`}></div>
                <div className={`w-1 h-3 ${emotion === 'thinking' ? 'bg-purple-400' : 'bg-green-400'} rounded-full opacity-60`}></div>
                <div className={`w-1 h-3 ${emotion === 'thinking' ? 'bg-purple-400' : 'bg-green-400'} rounded-full opacity-40`}></div>
              </motion.div>
            </div>
            
            {/* Enhanced Control Panel */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
              <motion.div
                className="w-2 h-2 bg-red-400 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: emotion === 'excited' ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: emotion === 'excited' ? 0.8 : 1.5,
                  repeat: Infinity
                }}
              />
              <motion.div
                className="w-2 h-2 bg-yellow-400 rounded-full"
                animate={{
                  opacity: [1, 0.5, 1],
                  scale: emotion === 'excited' ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: emotion === 'excited' ? 0.8 : 1.5,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: emotion === 'excited' ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: emotion === 'excited' ? 0.8 : 1.5,
                  repeat: Infinity,
                  delay: 1
                }}
              />
            </div>
            
            {/* Side panels with emotion-based glow */}
            <motion.div 
              className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-8 bg-gray-500 rounded-l"
              animate={{
                boxShadow: emotion === 'proud' ? '0 0 5px rgba(59, 130, 246, 0.5)' : 'none'
              }}
            />
            <motion.div 
              className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-8 bg-gray-500 rounded-r"
              animate={{
                boxShadow: emotion === 'proud' ? '0 0 5px rgba(59, 130, 246, 0.5)' : 'none'
              }}
            />
            
            {/* AI dialogue display */}
            {aiDialogue && (
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-mono"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {aiDialogue}
              </motion.div>
            )}
          </div>
          
          {/* Enhanced Data Stream */}
          <AnimatePresence>
            {showData && (
              <div className="absolute -right-6 top-0 space-y-1">
                {['01', '10', '11', '++', '>>'].slice(0, emotion === 'thinking' ? 5 : 3).map((data, i) => (
                  <motion.div
                    key={i}
                    className="text-cyan-400 text-xs font-mono"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      x: [0, 15, 30]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3
                    }}
                  >
                    {data}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/90 rounded-xl p-3 shadow-lg relative">
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/90"></div>
            <p className="font-body text-sm text-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Wise Guide for ages 10-12 - Enhanced with AI
function WiseGuide({ message, emotion = 'encouraging', activity = 'idle' }: { 
  message: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
}) {
  const [orbGlow, setOrbGlow] = useState(false)
  const [runesActive, setRunesActive] = useState(false)
  const [showWisdom, setShowWisdom] = useState(false)
  const [aiWisdom, setAIWisdom] = useState('')
  const guideRef = useRef<HTMLDivElement>(null)
  const movement = useAIMovement(emotion, activity)

  // AI-generated wisdom phrases
  useEffect(() => {
    const generateWisdom = async () => {
      const prompt = spark.llmPrompt`Generate a short inspirational phrase for a wise guide character based on:
- Current emotion: ${emotion}
- Current activity: ${activity}
- Age group: 10-12 years

Return 2-5 words that sound wise and encouraging for preteens.
Examples: "Knowledge grows strong!", "Curiosity leads truth!", "Mind expanding!", "Wisdom unlocked!"
Keep it mystical but relatable for older children.`

      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini')
        setAIWisdom(response.trim().replace(/['"]/g, ''))
      } catch (error) {
        setAIWisdom('Knowledge is power!')
      }
    }

    generateWisdom()
  }, [emotion, activity])

  // Enhanced GSAP animations
  useEffect(() => {
    if (!guideRef.current) return

    const element = guideRef.current
    const tl = gsap.timeline({ repeat: -1 })
    
    tl.to(element, {
      x: movement.x * movement.intensity,
      y: movement.y * movement.intensity,
      rotation: movement.x * 0.03,
      duration: 4 + Math.random(),
      ease: 'power2.inOut'
    })
    .to(element, {
      x: -movement.x * movement.intensity * 0.6,
      y: movement.y * movement.intensity * 0.4,
      rotation: -movement.x * 0.03,
      duration: 4 + Math.random(),
      ease: 'power2.inOut'
    })
    .to(element, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 3,
      ease: 'power2.inOut'
    })

    return () => {
      tl.kill()
    }
  }, [movement])

  useEffect(() => {
    const orbInterval = setInterval(() => {
      setOrbGlow(true)
      setTimeout(() => setOrbGlow(false), 800)
    }, 2000 + Math.random() * 2000)

    const runeInterval = setInterval(() => {
      setRunesActive(true)
      setTimeout(() => setRunesActive(false), 1200)
    }, 3000 + Math.random() * 2000)

    const wisdomInterval = setInterval(() => {
      if (emotion === 'proud' || activity === 'celebrating') {
        setShowWisdom(true)
        setTimeout(() => setShowWisdom(false), 2500)
      }
    }, 6000 + Math.random() * 4000)

    return () => {
      clearInterval(orbInterval)
      clearInterval(runeInterval)
      clearInterval(wisdomInterval)
    }
  }, [emotion, activity])

  const emotionColors = {
    happy: 'from-indigo-500 to-purple-600',
    excited: 'from-purple-500 to-pink-600',
    proud: 'from-blue-500 to-indigo-600',
    encouraging: 'from-indigo-500 to-purple-600',
    thinking: 'from-violet-500 to-indigo-600'
  }

  return (
    <div className="relative">
      <FloatingElements count={emotion === 'thinking' ? 6 : 4}>
        <div className="text-purple-300 text-lg">✦</div>
      </FloatingElements>
      
      <div className="flex items-center gap-4 relative z-10">
        <div ref={guideRef} className="relative">
          {/* Wizard/Guide figure */}
          <div className={`w-16 h-16 bg-gradient-to-br ${emotionColors[emotion]} rounded-full relative shadow-lg transition-all duration-500`}>
            {/* Enhanced Hat with emotion-based effects */}
            <motion.div 
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-t-full"
              animate={{
                scale: emotion === 'excited' ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full"
                animate={{
                  scale: orbGlow ? [1, 1.8, 1] : 1,
                  opacity: orbGlow ? [0.7, 1, 0.7] : 0.7,
                  boxShadow: orbGlow ? '0 0 8px rgba(253, 224, 71, 0.8)' : 'none'
                }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
            
            {/* Enhanced Eyes with emotion-based colors */}
            <div className="absolute top-4 left-3 flex gap-2">
              <motion.div
                className={`w-2 h-2 ${emotion === 'thinking' ? 'bg-violet-300' : 'bg-cyan-300'} rounded-full`}
                animate={{
                  boxShadow: runesActive
                    ? ['0 0 0 0 rgba(103, 232, 249, 0.7)', '0 0 0 4px rgba(103, 232, 249, 0)']
                    : '0 0 0 0 rgba(103, 232, 249, 0)',
                  scale: emotion === 'excited' ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 1.2 }}
              />
              <motion.div
                className={`w-2 h-2 ${emotion === 'thinking' ? 'bg-violet-300' : 'bg-cyan-300'} rounded-full`}
                animate={{
                  boxShadow: runesActive
                    ? ['0 0 0 0 rgba(103, 232, 249, 0.7)', '0 0 0 4px rgba(103, 232, 249, 0)']
                    : '0 0 0 0 rgba(103, 232, 249, 0)',
                  scale: emotion === 'excited' ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 1.2 }}
              />
            </div>
            
            {/* Beard with subtle animation */}
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-6 h-4 bg-gray-300 rounded-b-full opacity-80"
              animate={{
                scale: emotion === 'proud' ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Enhanced magical orb */}
            <motion.div
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full"
              animate={{
                scale: orbGlow ? [1, 1.3, 1] : emotion === 'excited' ? [1, 1.1, 1] : 1,
                rotate: [0, 360],
                boxShadow: emotion === 'proud' ? '0 0 12px rgba(103, 232, 249, 0.6)' : 'none'
              }}
              transition={{
                scale: { duration: 0.8 },
                rotate: { duration: emotion === 'excited' ? 6 : 8, repeat: Infinity, ease: "linear" }
              }}
            >
              <motion.div
                className="w-full h-full rounded-full"
                animate={{
                  boxShadow: orbGlow
                    ? ['0 0 0 0 rgba(103, 232, 249, 0.5)', '0 0 0 8px rgba(103, 232, 249, 0)']
                    : '0 0 0 0 rgba(103, 232, 249, 0)'
                }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
            
            {/* Enhanced floating runes */}
            <motion.div
              className="absolute -top-1 -left-2 w-2 h-2 text-yellow-300 text-xs flex items-center justify-center"
              animate={{
                y: runesActive ? [0, -10, 0] : 0,
                opacity: runesActive ? [0.5, 1, 0.5] : 0.5,
                rotate: runesActive ? [0, 180, 360] : 0
              }}
              transition={{ duration: 1.2 }}
            >
              ✦
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-1 w-2 h-2 text-cyan-300 text-xs flex items-center justify-center"
              animate={{
                y: runesActive ? [0, -8, 0] : 0,
                opacity: runesActive ? [0.5, 1, 0.5] : 0.5,
                rotate: runesActive ? [0, -180, -360] : 0
              }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              ◆
            </motion.div>
            <motion.div
              className="absolute top-2 -left-3 w-2 h-2 text-purple-300 text-xs flex items-center justify-center"
              animate={{
                x: runesActive ? [0, -6, 0] : 0,
                opacity: runesActive ? [0.5, 1, 0.5] : 0.5,
                scale: runesActive ? [1, 1.3, 1] : 1
              }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              ✧
            </motion.div>
            
            {/* AI wisdom display */}
            {aiWisdom && (
              <motion.div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {aiWisdom} ✨
              </motion.div>
            )}
          </div>
          
          {/* Enhanced Wisdom Text */}
          <AnimatePresence>
            {showWisdom && (
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-indigo-600/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-purple-300/30"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {aiWisdom || 'Knowledge is power!'} 📚
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/90 rounded-xl p-3 shadow-lg relative">
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/90"></div>
            <p className="font-body text-sm text-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function CompanionMessage({ 
  ageGroup, 
  name, 
  emotion = 'happy', 
  activity = 'idle' 
}: CompanionProps) {
  const messages = {
    '3-5': `Hi ${name}! I'm your magical friend! Let's play and learn together! What fun activity should we try today?`,
    '6-9': `Hey ${name}! I'm your adventure buddy! Ready for some awesome learning quests? Pick a subject and let's explore together!`,
    '10-12': `Hello ${name}! I'm your learning guide! Let's tackle some exciting challenges and discover amazing things. Which subject calls to you today?`
  }

  const message = messages[ageGroup]

  switch (ageGroup) {
    case '3-5':
      return <BabyDragon message={message} emotion={emotion} activity={activity} />
    case '6-9':
      return <RobotExplorer message={message} emotion={emotion} activity={activity} />
    case '10-12':
      return <WiseGuide message={message} emotion={emotion} activity={activity} />
    default:
      return null
  }
}
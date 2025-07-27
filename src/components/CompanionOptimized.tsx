import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { useAnimationRef, useAnimationInterval } from '@/hooks/useAnimationRef'
import type { AgeGroup } from '@/App'

interface CompanionProps {
  ageGroup: AgeGroup
  name: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
  showSpeech?: boolean
  speechText?: string
}

// Optimized Baby Dragon for ages 3-5
function BabyDragon({ emotion, activity, showSpeech, speechText }: Omit<CompanionProps, 'ageGroup' | 'name'>) {
  const { ref: dragonRef, createAnimation } = useAnimationRef<HTMLDivElement>()
  const [isBlinking, setIsBlinking] = useState(false)
  const [aiDialogue, setAiDialogue] = useState<string>("")
  
  // Use proper interval management for blinking
  useAnimationInterval(
    useCallback(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, []),
    2000 + Math.random() * 3000
  )

  // Generate AI dialogue
  useEffect(() => {
    const generateDialogue = async () => {
      const prompt = spark.llmPrompt`Generate a short, encouraging message from a baby dragon companion for a 3-5 year old. Emotion: ${emotion}, Activity: ${activity}. Keep it under 15 words and very playful.`
      
      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini')
        setAiDialogue(response.trim())
      } catch {
        setAiDialogue("Let's have magical fun together! ✨🐉")
      }
    }

    generateDialogue()
  }, [emotion, activity])

  // Setup floating animation
  useEffect(() => {
    createAnimation((element) => {
      return gsap.timeline({ repeat: -1 })
        .to(element, {
          y: -10,
          duration: 2,
          ease: "power2.inOut"
        })
        .to(element, {
          y: 0,
          duration: 2,
          ease: "power2.inOut"
        })
    })
  }, [createAnimation])

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return 'from-pink-400 to-purple-500'
      case 'excited': return 'from-yellow-400 to-orange-500'
      case 'proud': return 'from-purple-400 to-indigo-500'
      case 'encouraging': return 'from-green-400 to-teal-500'
      case 'thinking': return 'from-blue-400 to-cyan-500'
      default: return 'from-pink-400 to-purple-500'
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="relative flex flex-col items-center"
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {(showSpeech && speechText) || aiDialogue ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="mb-4 relative"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border-2 border-pink-200 max-w-xs">
              <p className="text-sm font-medium text-gray-800 text-center">
                {showSpeech && speechText ? speechText : aiDialogue}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white/95"></div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Dragon character */}
      <div ref={dragonRef} className="relative">
        <motion.div 
          className={`w-20 h-20 bg-gradient-to-br ${getEmotionColor()} rounded-full relative shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Eyes */}
          <div className="absolute top-4 left-4 flex gap-2">
            <motion.div
              className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"
              animate={{ 
                scaleY: isBlinking ? 0.1 : 1,
                scale: emotion === 'excited' ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                scaleY: { duration: 0.1 },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </motion.div>
            <motion.div
              className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"
              animate={{ 
                scaleY: isBlinking ? 0.1 : 1,
                scale: emotion === 'excited' ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                scaleY: { duration: 0.1 },
                scale: { duration: 2, repeat: Infinity, delay: 0.1 }
              }}
            >
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </motion.div>
          </div>
          
          {/* Wings */}
          <motion.div 
            className="absolute -top-1 -left-3 w-5 h-7 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-md"
            animate={{ 
              rotate: emotion === 'excited' ? [0, 15, -15, 0] : [0, 5, -5, 0]
            }}
            transition={{ 
              duration: emotion === 'excited' ? 0.5 : 2,
              repeat: Infinity 
            }}
          />
          <motion.div 
            className="absolute -top-1 -right-3 w-5 h-7 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-md"
            animate={{ 
              rotate: emotion === 'excited' ? [0, -15, 15, 0] : [0, -5, 5, 0]
            }}
            transition={{ 
              duration: emotion === 'excited' ? 0.5 : 2,
              repeat: Infinity 
            }}
          />

          {/* Snout */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-pink-300 rounded-full shadow-sm"></div>
        </motion.div>

        {/* Magic sparkles for happy/excited */}
        {(emotion === 'happy' || emotion === 'excited') && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + (i % 2) * 60}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Optimized Robot Explorer for ages 6-9
function RobotExplorer({ emotion, activity, showSpeech, speechText }: Omit<CompanionProps, 'ageGroup' | 'name'>) {
  const { ref: robotRef, createAnimation } = useAnimationRef<HTMLDivElement>()
  const [isScanning, setIsScanning] = useState(false)
  const [aiDialogue, setAiDialogue] = useState<string>("")

  // Robot scanning animation
  useAnimationInterval(
    useCallback(() => {
      setIsScanning(true)
      setTimeout(() => setIsScanning(false), 800)
    }, []),
    3000
  )

  // Generate AI dialogue
  useEffect(() => {
    const generateDialogue = async () => {
      const prompt = spark.llmPrompt`Generate a short message from a friendly robot companion for a 6-9 year old. Emotion: ${emotion}, Activity: ${activity}. Use robot-like language but keep it fun and encouraging. Under 20 words.`
      
      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini')
        setAiDialogue(response.trim())
      } catch {
        setAiDialogue("Beep boop! Ready for adventure, explorer! 🤖⚡")
      }
    }

    generateDialogue()
  }, [emotion, activity])

  // Setup hover animation
  useEffect(() => {
    createAnimation((element) => {
      return gsap.timeline({ repeat: -1 })
        .to(element, {
          y: -5,
          duration: 1.5,
          ease: "power2.inOut"
        })
        .to(element, {
          y: 0,
          duration: 1.5,
          ease: "power2.inOut"
        })
    })
  }, [createAnimation])

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return 'from-cyan-400 to-blue-500'
      case 'excited': return 'from-orange-400 to-red-500'
      case 'proud': return 'from-indigo-400 to-purple-500'
      case 'encouraging': return 'from-green-400 to-emerald-500'
      case 'thinking': return 'from-violet-400 to-purple-600'
      default: return 'from-cyan-400 to-blue-500'
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="relative flex flex-col items-center"
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {(showSpeech && speechText) || aiDialogue ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="mb-4 relative"
          >
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border-2 border-cyan-400/50 max-w-xs">
              <p className="text-sm font-medium text-cyan-100 text-center">
                {showSpeech && speechText ? speechText : aiDialogue}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-900/95"></div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Robot character */}
      <div ref={robotRef} className="relative">
        <motion.div 
          className={`w-20 h-20 bg-gradient-to-br ${getEmotionColor()} rounded-lg relative shadow-lg border-2 border-gray-300`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Eyes (LED screens) */}
          <div className="absolute top-3 left-3 flex gap-2">
            <motion.div
              className="w-4 h-3 bg-green-400 rounded-sm shadow-sm"
              animate={{ 
                opacity: isScanning ? [1, 0.3, 1] : 1,
                boxShadow: isScanning ? [
                  '0 0 5px #4ade80',
                  '0 0 15px #4ade80',
                  '0 0 5px #4ade80'
                ] : '0 0 5px #4ade80'
              }}
              transition={{ duration: 0.3, repeat: isScanning ? 3 : 0 }}
            />
            <motion.div
              className="w-4 h-3 bg-green-400 rounded-sm shadow-sm"
              animate={{ 
                opacity: isScanning ? [1, 0.3, 1] : 1,
                boxShadow: isScanning ? [
                  '0 0 5px #4ade80',
                  '0 0 15px #4ade80',
                  '0 0 5px #4ade80'
                ] : '0 0 5px #4ade80'
              }}
              transition={{ duration: 0.3, repeat: isScanning ? 3 : 0, delay: 0.1 }}
            />
          </div>

          {/* Antenna */}
          <motion.div 
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            animate={{ 
              rotate: emotion === 'thinking' ? [0, 15, -15, 0] : 0
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
            <motion.div 
              className="w-2 h-2 bg-red-500 rounded-full shadow-sm"
              animate={{ 
                opacity: emotion === 'thinking' ? [0.3, 1, 0.3] : 0.8,
                scale: emotion === 'thinking' ? [0.8, 1.2, 0.8] : 1
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>

          {/* Digital face display */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black rounded-sm overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400"
              animate={{ 
                width: emotion === 'happy' ? '100%' : emotion === 'excited' ? ['20%', '100%', '20%'] : '60%'
              }}
              transition={{ duration: 1, repeat: emotion === 'excited' ? Infinity : 0 }}
            />
          </div>
        </motion.div>

        {/* Digital particles for thinking */}
        {emotion === 'thinking' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 2) * 50}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Optimized Tech Guide for ages 10-12
function TechGuide({ emotion, activity, showSpeech, speechText }: Omit<CompanionProps, 'ageGroup' | 'name'>) {
  const { ref: guideRef, createAnimation } = useAnimationRef<HTMLDivElement>()
  const [aiDialogue, setAiDialogue] = useState<string>("")

  // Generate AI dialogue
  useEffect(() => {
    const generateDialogue = async () => {
      const prompt = spark.llmPrompt`Generate a wise, encouraging message from a tech guide companion for a 10-12 year old. Emotion: ${emotion}, Activity: ${activity}. Use slightly more advanced vocabulary but keep it inspiring. Under 25 words.`
      
      try {
        const response = await spark.llm(prompt, 'gpt-4o-mini')
        setAiDialogue(response.trim())
      } catch {
        setAiDialogue("Knowledge awaits those who dare to explore. Ready for the next challenge? 🔮⚡")
      }
    }

    generateDialogue()
  }, [emotion, activity])

  // Setup floating animation
  useEffect(() => {
    createAnimation((element) => {
      return gsap.timeline({ repeat: -1 })
        .to(element, {
          y: -8,
          duration: 2.5,
          ease: "power2.inOut"
        })
        .to(element, {
          y: 0,
          duration: 2.5,
          ease: "power2.inOut"
        })
    })
  }, [createAnimation])

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return 'from-violet-500 to-purple-600'
      case 'excited': return 'from-orange-500 to-red-600'
      case 'proud': return 'from-yellow-500 to-orange-600'
      case 'encouraging': return 'from-emerald-500 to-teal-600'
      case 'thinking': return 'from-blue-500 to-indigo-600'
      default: return 'from-violet-500 to-purple-600'
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="relative flex flex-col items-center"
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {(showSpeech && speechText) || aiDialogue ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="mb-4 relative"
          >
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border-2 border-violet-400/50 max-w-sm">
              <p className="text-sm font-medium text-violet-100 text-center">
                {showSpeech && speechText ? speechText : aiDialogue}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-slate-900/95"></div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Tech Guide character */}
      <div ref={guideRef} className="relative">
        <motion.div 
          className={`w-20 h-24 bg-gradient-to-br ${getEmotionColor()} rounded-2xl relative shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Visor/Eyes */}
          <motion.div 
            className="absolute top-4 left-2 right-2 h-4 bg-cyan-400/80 rounded-lg shadow-inner"
            animate={{ 
              opacity: [0.8, 1, 0.8],
              boxShadow: [
                '0 0 10px #22d3ee',
                '0 0 20px #22d3ee',
                '0 0 10px #22d3ee'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-1 bg-black/20 rounded-md"></div>
            {emotion === 'thinking' && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="text-xs text-cyan-100">...</div>
              </motion.div>
            )}
          </motion.div>

          {/* Body details */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-black/20 rounded-lg">
            <div className="w-full h-1 bg-cyan-400/60 rounded-full mt-2"></div>
            <div className="w-3/4 h-1 bg-violet-400/60 rounded-full mt-1 mx-auto"></div>
            <div className="w-1/2 h-1 bg-pink-400/60 rounded-full mt-1 mx-auto"></div>
          </div>
        </motion.div>

        {/* Floating knowledge orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.6, 1, 0.6],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.8
              }}
            />
          ))}
        </div>

        {/* Energy field for encouraging */}
        {emotion === 'encouraging' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            style={{ transform: 'translate(-10%, -10%) scale(1.2)' }}
          />
        )}
      </div>
    </motion.div>
  )
}

// Main Companion Component with proper useRef patterns
export function CompanionOptimized({ 
  ageGroup, 
  name, 
  emotion = 'happy', 
  activity = 'idle',
  showSpeech = false,
  speechText = ""
}: CompanionProps) {
  const getCompanionComponent = () => {
    const props = { emotion, activity, showSpeech, speechText }
    
    switch (ageGroup) {
      case '3-5':
        return <BabyDragon {...props} />
      case '6-9':
        return <RobotExplorer {...props} />
      case '10-12':
        return <TechGuide {...props} />
      default:
        return <BabyDragon {...props} />
    }
  }

  return (
    <div className="relative">
      {getCompanionComponent()}
      
      {/* Companion name */}
      <motion.div
        className="text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs font-medium text-foreground/70">{name}</p>
      </motion.div>
    </div>
  )
}
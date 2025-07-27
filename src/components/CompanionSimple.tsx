import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AgeGroup } from '@/App'

interface CompanionProps {
  ageGroup: AgeGroup
  name: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
}

// Simple Baby Dragon for ages 3-5
function BabyDragon({ message }: { message: string }) {
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <motion.div 
        className="relative"
        animate={{
          x: [0, 5, -5, 0],
          y: [0, -3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full relative shadow-lg">
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
          
          {/* Wings */}
          <div className="absolute -top-1 -left-2 w-4 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full" />
          <div className="absolute -top-1 -right-2 w-4 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full" />
        </div>
      </motion.div>
      
      <div className="flex-1">
        <div className="bg-white/90 rounded-xl p-3 shadow-lg relative">
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/90"></div>
          <p className="font-body text-sm text-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

// Simple Robot for ages 6-9
function RobotExplorer({ message }: { message: string }) {
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(true)
      setTimeout(() => setIsScanning(false), 1000)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <motion.div 
        className="relative"
        animate={{
          x: [0, 8, -8, 0],
          y: [0, -2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg relative shadow-lg">
          {/* Antenna */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-400 rounded-full">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full" />
          </div>
          
          {/* Eyes/Screen */}
          <div className="absolute top-3 left-2 right-2 h-6 bg-black rounded flex items-center justify-center">
            <motion.div
              className="flex gap-1"
              animate={{ x: isScanning ? [0, 8, -8, 0] : 0 }}
              transition={{ duration: 1 }}
            >
              <div className="w-1 h-3 bg-green-400 rounded-full opacity-80"></div>
              <div className="w-1 h-3 bg-green-400 rounded-full opacity-60"></div>
              <div className="w-1 h-3 bg-green-400 rounded-full opacity-40"></div>
            </motion.div>
          </div>
          
          {/* Control Panel */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
          </div>
        </div>
      </motion.div>
      
      <div className="flex-1">
        <div className="bg-white/90 rounded-xl p-3 shadow-lg relative">
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/90"></div>
          <p className="font-body text-sm text-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

// Simple Wise Guide for ages 10-12
function WiseGuide({ message }: { message: string }) {
  const [orbGlow, setOrbGlow] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbGlow(true)
      setTimeout(() => setOrbGlow(false), 800)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <motion.div 
        className="relative"
        animate={{
          x: [0, 3, -3, 0],
          y: [0, -4, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full relative shadow-lg">
          {/* Hat */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-t-full">
            <motion.div
              className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full"
              animate={{
                scale: orbGlow ? [1, 1.8, 1] : 1,
                opacity: orbGlow ? [0.7, 1, 0.7] : 0.7
              }}
              transition={{ duration: 0.8 }}
            />
          </div>
          
          {/* Eyes */}
          <div className="absolute top-4 left-3 flex gap-2">
            <div className="w-2 h-2 bg-cyan-300 rounded-full" />
            <div className="w-2 h-2 bg-cyan-300 rounded-full" />
          </div>
          
          {/* Beard */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-6 h-4 bg-gray-300 rounded-b-full opacity-80" />
          
          {/* Magical orb */}
          <motion.div
            className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full"
            animate={{
              scale: orbGlow ? [1, 1.3, 1] : 1,
              rotate: [0, 360]
            }}
            transition={{
              scale: { duration: 0.8 },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
          />
        </div>
      </motion.div>
      
      <div className="flex-1">
        <div className="bg-white/90 rounded-xl p-3 shadow-lg relative">
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/90"></div>
          <p className="font-body text-sm text-foreground leading-relaxed">
            {message}
          </p>
        </div>
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
      return <BabyDragon message={message} />
    case '6-9':
      return <RobotExplorer message={message} />
    case '10-12':
      return <WiseGuide message={message} />
    default:
      return null
  }
}
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AgeGroup } from '@/App'

interface CompanionProps {
  ageGroup: AgeGroup
  name: string
}

// Floating Background Elements
function FloatingElements({ count = 6, children }: { count?: number, children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
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

// Baby Dragon for ages 3-5
function BabyDragon({ message }: { message: string }) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [isFlapping, setIsFlapping] = useState(false)
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 3000)

    const flapInterval = setInterval(() => {
      setIsFlapping(true)
      setTimeout(() => setIsFlapping(false), 600)
    }, 4000)

    const heartInterval = setInterval(() => {
      setShowHearts(true)
      setTimeout(() => setShowHearts(false), 2000)
    }, 8000)

    return () => {
      clearInterval(blinkInterval)
      clearInterval(flapInterval)
      clearInterval(heartInterval)
    }
  }, [])

  return (
    <div className="relative">
      <FloatingElements count={4}>
        <div className="text-pink-300 text-lg">✨</div>
      </FloatingElements>
      
      <div className="flex items-center gap-4 relative z-10">
        <motion.div
          className="relative"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Dragon Body */}
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
            
            {/* Nose/Snout */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-pink-600 rounded-full"></div>
            
            {/* Wings */}
            <motion.div
              className="absolute -top-1 -left-2 w-4 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full"
              animate={{ rotate: isFlapping ? [0, -15, 0] : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'bottom center' }}
            />
            <motion.div
              className="absolute -top-1 -right-2 w-4 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full"
              animate={{ rotate: isFlapping ? [0, 15, 0] : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'bottom center' }}
            />
            
            {/* Small sparkles around */}
            <motion.div
              className="absolute -top-2 -right-1 w-1 h-1 bg-yellow-300 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
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
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            />
          </div>
          
          {/* Floating Hearts */}
          <AnimatePresence>
            {showHearts && (
              <>
                {[...Array(3)].map((_, i) => (
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
                      x: (i - 1) * 15, 
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
        </motion.div>
        
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

// Robot Explorer for ages 6-9
function RobotExplorer({ message }: { message: string }) {
  const [isScanning, setIsScanning] = useState(false)
  const [antennaGlow, setAntennaGlow] = useState(false)
  const [showData, setShowData] = useState(false)

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setIsScanning(true)
      setTimeout(() => setIsScanning(false), 1000)
    }, 3500)

    const glowInterval = setInterval(() => {
      setAntennaGlow(true)
      setTimeout(() => setAntennaGlow(false), 300)
    }, 2000)

    const dataInterval = setInterval(() => {
      setShowData(true)
      setTimeout(() => setShowData(false), 3000)
    }, 7000)

    return () => {
      clearInterval(scanInterval)
      clearInterval(glowInterval)
      clearInterval(dataInterval)
    }
  }, [])

  return (
    <div className="relative">
      <FloatingElements count={5}>
        <div className="text-blue-300 text-sm">⚡</div>
      </FloatingElements>
      
      <div className="flex items-center gap-4 relative z-10">
        <motion.div
          className="relative"
          animate={{
            x: [0, 5, -5, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Robot Body */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg relative shadow-lg">
            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-400 rounded-full">
              <motion.div
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"
                animate={{
                  boxShadow: antennaGlow
                    ? ['0 0 0 0 rgba(74, 222, 128, 0.7)', '0 0 0 10px rgba(74, 222, 128, 0)']
                    : '0 0 0 0 rgba(74, 222, 128, 0)'
                }}
                transition={{ duration: 0.6 }}
              />
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
              <motion.div
                className="w-2 h-2 bg-red-400 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
              <motion.div
                className="w-2 h-2 bg-yellow-400 rounded-full"
                animate={{
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 1
                }}
              />
            </div>
            
            {/* Side panels */}
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-8 bg-gray-500 rounded-l"></div>
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-8 bg-gray-500 rounded-r"></div>
          </div>
          
          {/* Data Stream */}
          <AnimatePresence>
            {showData && (
              <div className="absolute -right-6 top-0 space-y-1">
                {['01', '10', '11'].map((binary, i) => (
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
                    {binary}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
        
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

// Wise Guide for ages 10-12
function WiseGuide({ message }: { message: string }) {
  const [orbGlow, setOrbGlow] = useState(false)
  const [runesActive, setRunesActive] = useState(false)
  const [showWisdom, setShowWisdom] = useState(false)

  useEffect(() => {
    const orbInterval = setInterval(() => {
      setOrbGlow(true)
      setTimeout(() => setOrbGlow(false), 800)
    }, 3000)

    const runeInterval = setInterval(() => {
      setRunesActive(true)
      setTimeout(() => setRunesActive(false), 1200)
    }, 4500)

    const wisdomInterval = setInterval(() => {
      setShowWisdom(true)
      setTimeout(() => setShowWisdom(false), 2500)
    }, 9000)

    return () => {
      clearInterval(orbInterval)
      clearInterval(runeInterval)
      clearInterval(wisdomInterval)
    }
  }, [])

  return (
    <div className="relative">
      <FloatingElements count={4}>
        <div className="text-purple-300 text-lg">✦</div>
      </FloatingElements>
      
      <div className="flex items-center gap-4 relative z-10">
        <motion.div
          className="relative"
          animate={{
            y: [0, -6, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Wizard/Guide figure */}
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full relative shadow-lg">
            {/* Hat */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-t-full">
              <motion.div
                className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full"
                animate={{
                  scale: orbGlow ? [1, 1.5, 1] : 1,
                  opacity: orbGlow ? [0.7, 1, 0.7] : 0.7
                }}
                transition={{ duration: 0.8 }}
              />
            </div>
            
            {/* Eyes */}
            <div className="absolute top-4 left-3 flex gap-2">
              <motion.div
                className="w-2 h-2 bg-cyan-300 rounded-full"
                animate={{
                  boxShadow: runesActive
                    ? ['0 0 0 0 rgba(103, 232, 249, 0.7)', '0 0 0 4px rgba(103, 232, 249, 0)']
                    : '0 0 0 0 rgba(103, 232, 249, 0)'
                }}
                transition={{ duration: 1.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-cyan-300 rounded-full"
                animate={{
                  boxShadow: runesActive
                    ? ['0 0 0 0 rgba(103, 232, 249, 0.7)', '0 0 0 4px rgba(103, 232, 249, 0)']
                    : '0 0 0 0 rgba(103, 232, 249, 0)'
                }}
                transition={{ duration: 1.2 }}
              />
            </div>
            
            {/* Beard */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-6 h-4 bg-gray-300 rounded-b-full opacity-80"></div>
            
            {/* Magical orb */}
            <motion.div
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full"
              animate={{
                scale: orbGlow ? [1, 1.2, 1] : 1,
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: 0.8 },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
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
            
            {/* Floating runes */}
            <motion.div
              className="absolute -top-1 -left-2 w-2 h-2 text-yellow-300 text-xs flex items-center justify-center"
              animate={{
                y: runesActive ? [0, -8, 0] : 0,
                opacity: runesActive ? [0.5, 1, 0.5] : 0.5
              }}
              transition={{ duration: 1.2 }}
            >
              ✦
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-1 w-2 h-2 text-cyan-300 text-xs flex items-center justify-center"
              animate={{
                y: runesActive ? [0, -6, 0] : 0,
                opacity: runesActive ? [0.5, 1, 0.5] : 0.5
              }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              ◆
            </motion.div>
            <motion.div
              className="absolute top-2 -left-3 w-2 h-2 text-purple-300 text-xs flex items-center justify-center"
              animate={{
                x: runesActive ? [0, -4, 0] : 0,
                opacity: runesActive ? [0.5, 1, 0.5] : 0.5
              }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              ✧
            </motion.div>
          </div>
          
          {/* Wisdom Text */}
          <AnimatePresence>
            {showWisdom && (
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                Knowledge is power! 📚
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
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

export function CompanionMessage({ ageGroup, name }: CompanionProps) {
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
import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SimpleCharacterScene, SimpleCompanionWidget } from './3D/SimpleCharacterScene'
import type { AgeGroup } from '@/App'

interface DialogueOption {
  text: string
  emotion: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking' | 'idle'
  activity: 'idle' | 'celebrating' | 'explaining' | 'waiting' | 'floating'
}

const dialogueOptions: Record<AgeGroup, DialogueOption[]> = {
  '3-5': [
    { 
      text: "Hi there little explorer! I'm your magical friend. Let's learn together!", 
      emotion: 'excited', 
      activity: 'celebrating' 
    },
    { 
      text: "You're doing amazing! Should we try something fun?", 
      emotion: 'encouraging', 
      activity: 'floating' 
    },
    { 
      text: "I love learning new things with you. What's your favorite color?", 
      emotion: 'happy', 
      activity: 'idle' 
    },
    { 
      text: "Wow! You're so smart! That makes me happy!", 
      emotion: 'proud', 
      activity: 'celebrating' 
    }
  ],
  '6-9': [
    { 
      text: "Greetings, young scientist! Ready for an awesome adventure?", 
      emotion: 'excited', 
      activity: 'celebrating' 
    },
    { 
      text: "My circuits are buzzing with excitement! You're doing great!", 
      emotion: 'encouraging', 
      activity: 'floating' 
    },
    { 
      text: "Let me compute the best way to help you learn...", 
      emotion: 'thinking', 
      activity: 'explaining' 
    },
    { 
      text: "Achievement unlocked! You're becoming quite the explorer!", 
      emotion: 'proud', 
      activity: 'celebrating' 
    }
  ],
  '10-12': [
    { 
      text: "Welcome, young scholar. The realms of knowledge await your discovery.", 
      emotion: 'encouraging', 
      activity: 'explaining' 
    },
    { 
      text: "Your dedication to learning fills me with pride. Continue your quest!", 
      emotion: 'proud', 
      activity: 'floating' 
    },
    { 
      text: "I sense great potential within you. What mysteries shall we unravel today?", 
      emotion: 'thinking', 
      activity: 'explaining' 
    },
    { 
      text: "Excellent work! Your knowledge grows stronger with each challenge.", 
      emotion: 'excited', 
      activity: 'celebrating' 
    }
  ]
}

interface CompanionTestProps {}

export function CompanionTest({}: CompanionTestProps) {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('3-5')
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [showDialogue, setShowDialogue] = useState(true)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout>()

  const currentOptions = dialogueOptions[selectedAge]
  const currentOption = currentOptions[currentDialogue]

  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentDialogue((prev) => (prev + 1) % currentOptions.length)
      }, 4000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlay, currentOptions.length])

  const characterNames = {
    '3-5': 'Baby Dragon',
    '6-9': 'Robot Explorer', 
    '10-12': 'Tech Guide'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading text-primary mb-2">
            3D Character Companion System
          </h1>
          <p className="text-muted-foreground">
            Interactive animated characters with advanced 3D rendering and AI-powered personalities
          </p>
        </div>

        {/* Age Group Selection */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-heading mb-4">Select Age Group</h2>
          <div className="flex gap-4 justify-center">
            {(['3-5', '6-9', '10-12'] as AgeGroup[]).map((age) => (
              <Button
                key={age}
                variant={selectedAge === age ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedAge(age)
                  setCurrentDialogue(0)
                }}
                className="font-heading"
              >
                Ages {age} - {characterNames[age]}
              </Button>
            ))}
          </div>
        </Card>

        {/* Main Character Display */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* 3D Character Scene */}
          <Card className="p-6">
            <h3 className="text-xl font-heading mb-4 text-center">
              {characterNames[selectedAge]}
            </h3>
            <SimpleCharacterScene
              ageGroup={selectedAge}
              emotion={currentOption.emotion}
              activity={currentOption.activity}
              dialogue={showDialogue ? currentOption.text : undefined}
              className="w-full h-96"
              enableControls={true}
              autoRotate={!isAutoPlay}
            />
          </Card>

          {/* Controls */}
          <Card className="p-6">
            <h3 className="text-xl font-heading mb-4">Animation Controls</h3>
            
            {/* Dialogue Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Dialogue & Emotion</label>
                <div className="flex gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDialogue((prev) => (prev - 1 + currentOptions.length) % currentOptions.length)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDialogue((prev) => (prev + 1) % currentOptions.length)}
                  >
                    Next
                  </Button>
                  <Button
                    variant={isAutoPlay ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                  >
                    {isAutoPlay ? 'Stop Auto' : 'Auto Play'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentDialogue + 1} of {currentOptions.length}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Show Dialogue</label>
                <Button
                  variant={showDialogue ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowDialogue(!showDialogue)}
                >
                  {showDialogue ? 'Hide' : 'Show'} Dialogue
                </Button>
              </div>

              {/* Current State Display */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Current State:</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Emotion:</strong> {currentOption.emotion}</div>
                  <div><strong>Activity:</strong> {currentOption.activity}</div>
                  <div><strong>Character:</strong> {characterNames[selectedAge]}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Character Size Variations */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-heading mb-4">Size Variations</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Small Widget</p>
              <SimpleCompanionWidget 
                ageGroup={selectedAge}
                emotion={currentOption.emotion}
                activity={currentOption.activity}
                size="small"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Medium Widget</p>
              <SimpleCompanionWidget 
                ageGroup={selectedAge}
                emotion={currentOption.emotion}
                activity={currentOption.activity}
                size="medium"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Large Widget</p>
              <SimpleCompanionWidget 
                ageGroup={selectedAge}
                emotion={currentOption.emotion}
                activity={currentOption.activity}
                size="large"
              />
            </div>
          </div>
        </Card>

        {/* Features List */}
        <Card className="p-6">
          <h3 className="text-xl font-heading mb-4">Advanced Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '3D Animated Characters',
              'Realistic Materials & Textures',
              'Dynamic Lighting Effects',
              'Emotion-Based Animations',
              'Activity State Changes',
              'Age-Appropriate Personalities',
              'Floating Background Elements',
              'Interactive Dialogue System',
              'Smooth State Transitions',
              'High-Performance Rendering',
              'Responsive Design',
              'Particle Effects'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Exit Instructions */}
        <div className="text-center mt-8 text-muted-foreground">
          <p>Press Escape or Ctrl+Shift+C to exit companion test</p>
        </div>
      </motion.div>
    </div>
  )
}
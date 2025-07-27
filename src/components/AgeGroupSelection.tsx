import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Heart } from '@phosphor-icons/react'
import { gsap } from 'gsap/dist/gsap'
import type { AgeGroup } from '@/App'

interface AgeGroupSelectionProps {
  onAgeGroupSelected: (ageGroup: AgeGroup) => void
}

const AGE_GROUPS = [
  {
    id: '3-5' as AgeGroup,
    name: 'Little Explorers',
    ages: '3-5 years',
    description: 'Perfect for our youngest learners! Fun games with colors, shapes, and simple counting.',
    emoji: '🌟',
    colors: 'from-pink-300/30 via-purple-300/30 to-yellow-300/30',
    cardColors: 'bg-gradient-to-br from-pink-100 to-purple-100',
    subjects: [
      { name: 'Count & Play', icon: '🔢', description: 'Learning numbers 1-10 with fun games' },
      { name: 'Letter Fun', icon: '📖', description: 'ABC adventures and simple words' },
      { name: 'Nature Time', icon: '🌱', description: 'Animals, weather, and plants' },
      { name: 'Art Magic', icon: '🎨', description: 'Colors, shapes, and creative play' }
    ]
  },
  {
    id: '6-9' as AgeGroup,
    name: 'Super Learners',
    ages: '6-9 years',
    description: 'Ready for bigger challenges! Math problems, reading stories, and cool science experiments.',
    emoji: '🚀',
    colors: 'from-blue-300/30 via-green-300/30 to-cyan-300/30',
    cardColors: 'bg-gradient-to-br from-blue-100 to-green-100',
    subjects: [
      { name: 'Math Adventures', icon: '➕', description: 'Addition, subtraction, and money counting' },
      { name: 'Story World', icon: '📚', description: 'Chapter books and creative writing' },
      { name: 'Science Lab', icon: '🔬', description: 'Water cycle, planets, and body systems' },
      { name: 'Art Studio', icon: '🖌️', description: 'Digital art and sculpture projects' }
    ]
  },
  {
    id: '10-12' as AgeGroup,
    name: 'Young Scholars',
    ages: '10-12 years',
    description: 'Advanced learning adventures! Complex math, detailed science, and creative projects.',
    emoji: '🎓',
    colors: 'from-purple-300/30 via-indigo-300/30 to-blue-300/30',
    cardColors: 'bg-gradient-to-br from-purple-100 to-indigo-100',
    subjects: [
      { name: 'Advanced Math', icon: '✖️', description: 'Multiplication, fractions, and geometry' },
      { name: 'Literature', icon: '📝', description: 'Novel analysis and poetry writing' },
      { name: 'Discovery Lab', icon: '⚗️', description: 'Chemistry, ecosystems, and physics' },
      { name: 'Design Studio', icon: '🎭', description: 'Animation, graphic design, and perspective art' }
    ]
  }
]

export function AgeGroupSelection({ onAgeGroupSelected }: AgeGroupSelectionProps) {
  const [showDetails, setShowDetails] = useState<AgeGroup | null>(null)
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null)

  const handleAgeGroupClick = (ageGroup: AgeGroup) => {
    setSelectedAge(ageGroup)
    
    // Animate selection with GSAP
    gsap.to(`.age-card-${ageGroup}`, {
      scale: 1.1,
      duration: 0.2,
      ease: "easeOut",
      onComplete: () => {
        gsap.to(`.age-card-${ageGroup}`, {
          scale: 1,
          duration: 0.2,
          ease: "easeOut"
        })
      }
    })

    // Auto-navigate after a brief delay
    setTimeout(() => {
      onAgeGroupSelected(ageGroup)
    }, 600)
  }

  // Add scroll restoration on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary/20 via-lavender/20 to-secondary/20 transition-all duration-1000 overflow-y-auto`}>
      <div className="flex flex-col p-4 min-h-screen">
        {/* Welcome Header - Fixed Height */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-block p-4 bg-white/90 rounded-2xl shadow-xl">
            <div className="text-4xl mb-2">🧸</div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Welcome to KidsLearning Pro!
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              Hi! I'm Teddy. Let's find your perfect learning adventure!
            </p>
          </div>
        </motion.div>

        {/* Age Group Selection - Scrollable */}
        <div className="flex-1 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-4"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center justify-center gap-2">
              <Heart className="text-accent w-5 h-5" weight="fill" />
              Choose Your Learning Level
              <Heart className="text-accent w-5 h-5" weight="fill" />
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {AGE_GROUPS.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex"
              >
                <Card 
                  className={`age-card-${group.id} cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-lg ${group.cardColors} flex flex-col w-full h-full ${selectedAge === group.id ? 'ring-4 ring-primary ring-opacity-50' : ''}`}
                  onClick={() => handleAgeGroupClick(group.id)}
                >
                  <CardHeader className="text-center pb-2 flex-shrink-0">
                    <div className="text-3xl mb-2">{group.emoji}</div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                      {group.name}
                    </h3>
                    <p className="font-body text-sm font-semibold text-primary">
                      {group.ages}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center flex-1 flex flex-col justify-between p-3">
                    <div className="space-y-2">
                      <p className="font-body text-xs text-muted-foreground">
                        {group.description}
                      </p>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDetails(showDetails === group.id ? null : group.id)
                        }}
                        className="w-full font-heading text-xs"
                      >
                        {showDetails === group.id ? 'Hide' : 'Preview'}
                      </Button>

                      {showDetails === group.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 pt-2 border-t border-border"
                        >
                          {group.subjects.slice(0, 2).map((subject, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-left">
                              <span className="text-sm">{subject.icon}</span>
                              <div>
                                <p className="font-heading font-semibold text-xs text-foreground">
                                  {subject.name}
                                </p>
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-muted-foreground">+ {group.subjects.length - 2} more subjects</p>
                        </motion.div>
                      )}
                    </div>

                    {selectedAge === group.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 p-2 bg-primary/10 rounded-lg"
                      >
                        <p className="text-xs font-bold text-primary">
                          Great choice! Loading your adventure...
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
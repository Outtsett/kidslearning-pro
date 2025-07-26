import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Star, Heart, Sparkles } from '@phosphor-icons/react'
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
  const [selectedGroup, setSelectedGroup] = useState<AgeGroup | null>(null)
  const [showDetails, setShowDetails] = useState<AgeGroup | null>(null)

  const handleContinue = () => {
    if (selectedGroup) {
      onAgeGroupSelected(selectedGroup)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedGroup ? AGE_GROUPS.find(g => g.id === selectedGroup)?.colors || 'from-primary/20 via-lavender/20 to-secondary/20' : 'from-primary/20 via-lavender/20 to-secondary/20'} p-4 transition-all duration-1000`}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-8 bg-white/90 rounded-3xl shadow-xl">
            <div className="text-8xl mb-6">🧸</div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Welcome to KidsLearning Pro!
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Hi there! I'm Teddy, your learning buddy. Let's find the perfect learning adventure just for you!
            </p>
          </div>
        </motion.div>

        {/* Age Group Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-heading text-2xl font-semibold text-foreground text-center mb-8 flex items-center justify-center gap-2">
            <Heart className="text-accent" weight="fill" />
            Choose Your Learning Level
            <Heart className="text-accent" weight="fill" />
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {AGE_GROUPS.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedGroup === group.id 
                      ? 'ring-4 ring-primary shadow-xl' 
                      : 'hover:shadow-lg'
                  } ${group.cardColors}`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="text-6xl mb-4">{group.emoji}</div>
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                      {group.name}
                    </h3>
                    <p className="font-body text-lg font-semibold text-primary">
                      {group.ages}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="font-body text-muted-foreground">
                      {group.description}
                    </p>
                    
                    <Button
                      variant={selectedGroup === group.id ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDetails(showDetails === group.id ? null : group.id)
                      }}
                      className="w-full font-heading"
                    >
                      {showDetails === group.id ? 'Hide Subjects' : 'See What You\'ll Learn'}
                    </Button>

                    {showDetails === group.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-4 border-t border-border"
                      >
                        {group.subjects.map((subject, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-left">
                            <span className="text-xl">{subject.icon}</span>
                            <div>
                              <p className="font-heading font-semibold text-sm text-foreground">
                                {subject.name}
                              </p>
                              <p className="font-body text-xs text-muted-foreground">
                                {subject.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {selectedGroup === group.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex justify-center mt-4"
                      >
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500 w-5 h-5" weight="fill" />
                          <span className="font-heading text-sm font-semibold text-foreground">Selected!</span>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="inline-block bg-white/90 border-none shadow-xl">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">
                    {AGE_GROUPS.find(g => g.id === selectedGroup)?.emoji}
                  </div>
                  <p className="font-body text-lg text-muted-foreground">
                    Perfect choice! Ready to create your learning avatar?
                  </p>
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="font-heading text-lg px-8 py-3"
                  >
                    Create My Avatar <Sparkles className="ml-2" weight="fill" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
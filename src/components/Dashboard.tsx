import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Calculator, Flask, Book, Palette, Coins, Settings, Star } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { CustomizationStore } from '@/components/CustomizationStore'
import type { UserProfile, Subject } from '@/App'

interface DashboardProps {
  profile: UserProfile
  onProfileUpdate: (updater: (profile: UserProfile) => UserProfile) => void
  onActivityStart: (subject: Subject, activityId: string) => void
  onShowParentDashboard: () => void
}

const SUBJECTS = [
  {
    id: 'math' as Subject,
    name: 'Math',
    icon: Calculator,
    color: 'bg-primary text-primary-foreground',
    description: 'Numbers, counting, and problem solving'
  },
  {
    id: 'science' as Subject,
    name: 'Science',
    icon: Flask,
    color: 'bg-secondary text-secondary-foreground',
    description: 'Explore the world around you'
  },
  {
    id: 'reading' as Subject,
    name: 'Reading',
    icon: Book,
    color: 'bg-lavender text-lavender-foreground',
    description: 'Stories, letters, and words'
  },
  {
    id: 'art' as Subject,
    name: 'Art',
    icon: Palette,
    color: 'bg-accent text-accent-foreground',
    description: 'Create and express yourself'
  }
]

const ACTIVITIES_BY_AGE = {
  '3-5': {
    math: [
      { id: 'counting-1-10', name: 'Count to 10', difficulty: 1 },
      { id: 'shapes-basic', name: 'Basic Shapes', difficulty: 1 },
      { id: 'bigger-smaller', name: 'Bigger or Smaller', difficulty: 2 }
    ],
    science: [
      { id: 'animals-sounds', name: 'Animal Sounds', difficulty: 1 },
      { id: 'weather-today', name: 'Today\'s Weather', difficulty: 1 },
      { id: 'plants-grow', name: 'How Plants Grow', difficulty: 2 }
    ],
    reading: [
      { id: 'letters-abc', name: 'ABC Letters', difficulty: 1 },
      { id: 'rhyming-words', name: 'Rhyming Fun', difficulty: 2 },
      { id: 'short-stories', name: 'Picture Stories', difficulty: 2 }
    ],
    art: [
      { id: 'color-mixing', name: 'Mix Colors', difficulty: 1 },
      { id: 'draw-family', name: 'Draw Your Family', difficulty: 2 },
      { id: 'pattern-making', name: 'Make Patterns', difficulty: 1 }
    ]
  },
  '6-9': {
    math: [
      { id: 'addition-basic', name: 'Adding Numbers', difficulty: 2 },
      { id: 'subtraction-basic', name: 'Taking Away', difficulty: 2 },
      { id: 'money-counting', name: 'Counting Money', difficulty: 3 }
    ],
    science: [
      { id: 'water-cycle', name: 'Water Cycle', difficulty: 2 },
      { id: 'solar-system', name: 'Planets and Stars', difficulty: 3 },
      { id: 'body-parts', name: 'Our Amazing Body', difficulty: 2 }
    ],
    reading: [
      { id: 'sight-words', name: 'Common Words', difficulty: 2 },
      { id: 'chapter-books', name: 'Chapter Stories', difficulty: 3 },
      { id: 'writing-sentences', name: 'Write Sentences', difficulty: 3 }
    ],
    art: [
      { id: 'digital-painting', name: 'Digital Art', difficulty: 2 },
      { id: 'sculpture-clay', name: 'Clay Sculptures', difficulty: 3 },
      { id: 'comic-strips', name: 'Make Comics', difficulty: 3 }
    ]
  },
  '10-12': {
    math: [
      { id: 'multiplication', name: 'Times Tables', difficulty: 3 },
      { id: 'fractions-intro', name: 'Understanding Fractions', difficulty: 4 },
      { id: 'geometry-advanced', name: 'Geometry Shapes', difficulty: 4 }
    ],
    science: [
      { id: 'chemistry-basics', name: 'Chemical Reactions', difficulty: 4 },
      { id: 'ecosystem-balance', name: 'Ecosystems', difficulty: 3 },
      { id: 'force-motion', name: 'Forces and Motion', difficulty: 4 }
    ],
    reading: [
      { id: 'novel-analysis', name: 'Story Analysis', difficulty: 4 },
      { id: 'poetry-writing', name: 'Write Poems', difficulty: 3 },
      { id: 'research-skills', name: 'Research Projects', difficulty: 4 }
    ],
    art: [
      { id: 'perspective-drawing', name: 'Perspective Art', difficulty: 4 },
      { id: 'animation-basics', name: 'Simple Animation', difficulty: 4 },
      { id: 'graphic-design', name: 'Design Projects', difficulty: 3 }
    ]
  }
}

export function Dashboard({ profile, onProfileUpdate, onActivityStart, onShowParentDashboard }: DashboardProps) {
  const [showCustomization, setShowCustomization] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const activities = ACTIVITIES_BY_AGE[profile.ageGroup]

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        weight={i < difficulty ? 'fill' : 'regular'}
        className="w-3 h-3 text-yellow-500"
      />
    ))
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  if (showCustomization) {
    return (
      <CustomizationStore
        profile={profile}
        onProfileUpdate={onProfileUpdate}
        onClose={() => setShowCustomization(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="medium" />
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Welcome back, {profile.name}!
              </h1>
              <p className="font-body text-muted-foreground">
                Ready for today's learning adventure?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2 p-2">
              <Coins className="w-4 h-4 text-yellow-600" weight="fill" />
              <span className="font-heading font-semibold">{profile.coins}</span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomization(true)}
            >
              <Settings className="w-4 h-4" />
              Customize
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onShowParentDashboard}
              className="hidden md:flex"
            >
              📊 Parent View
            </Button>
          </div>
        </div>

        {/* Avatar Companion */}
        <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">😊</div>
              <div className="flex-1">
                <p className="font-body text-lg text-foreground">
                  "Hey {profile.name}! I'm so excited to learn with you today. 
                  What subject should we explore together?"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SUBJECTS.map((subject) => {
            const progress = profile.progress[subject.id]
            return (
              <Card key={subject.id} className="text-center">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-full ${subject.color} flex items-center justify-center mx-auto mb-2`}>
                    <subject.icon className="w-6 h-6" weight="bold" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {subject.name}
                  </h3>
                  <Progress 
                    value={progress} 
                    className="h-2 mb-1"
                  />
                  <p className="text-xs text-muted-foreground">{progress}% Complete</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Subject Selection */}
        {!selectedSubject ? (
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
              Choose Your Subject
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUBJECTS.map((subject) => (
                <Card 
                  key={subject.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 rounded-full ${subject.color} flex items-center justify-center mx-auto mb-3`}>
                      <subject.icon className="w-8 h-8" weight="bold" />
                    </div>
                    <CardTitle className="font-heading text-lg">{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="font-body text-sm text-muted-foreground mb-3">
                      {subject.description}
                    </p>
                    <Badge variant="outline">
                      {activities[subject.id].length} Activities
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedSubject(null)}
              >
                ← Back
              </Button>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {SUBJECTS.find(s => s.id === selectedSubject)?.name} Activities
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities[selectedSubject].map((activity) => (
                <Card 
                  key={activity.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onActivityStart(selectedSubject, activity.id)}
                >
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center justify-between">
                      {activity.name}
                      <div className="flex">
                        {getDifficultyStars(activity.difficulty)}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full font-heading">
                      Start Activity
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Parent Dashboard Access */}
        <div className="md:hidden mt-8">
          <Card className="bg-gradient-to-r from-muted/50 to-card border-dashed">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  For parents: Monitor learning progress
                </p>
                <Button
                  variant="secondary"
                  onClick={onShowParentDashboard}
                  className="w-full"
                >
                  📊 View Parent Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
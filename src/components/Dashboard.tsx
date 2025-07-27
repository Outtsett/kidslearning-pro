import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Calculator, Flask, Book, Palette, Coins, Settings, Star, ArrowLeft } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { CustomizationStore } from '@/components/CustomizationStore'
import { CompanionMessage } from '@/components/Companions'
import { gsap } from 'gsap'
import type { UserProfile, Subject } from '@/App'

interface DashboardProps {
  profile: UserProfile
  onProfileUpdate: (updater: (profile: UserProfile) => UserProfile) => void
  onActivityStart: (subject: Subject, activityId: string) => void
  onShowParentDashboard: () => void
  onBackToAgeSelection: () => void
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

// Age-specific themes and content
const AGE_GROUP_THEMES = {
  '3-5': {
    subjects: [
      {
        id: 'math' as Subject,
        name: 'Count & Play',
        icon: Calculator,
        color: 'bg-pink-400 text-white',
        description: '🔢 Fun with numbers and shapes!'
      },
      {
        id: 'reading' as Subject,
        name: 'Letter Fun',
        icon: Book,
        color: 'bg-purple-400 text-white',
        description: '📖 ABC adventures and stories!'
      },
      {
        id: 'science' as Subject,
        name: 'Nature Time',
        icon: Flask,
        color: 'bg-green-400 text-white',
        description: '🌱 Animals, plants, and weather!'
      },
      {
        id: 'art' as Subject,
        name: 'Art Magic',
        icon: Palette,
        color: 'bg-yellow-400 text-white',
        description: '🎨 Colors and creative fun!'
      }
    ],
    background: 'from-pink-300/20 via-purple-300/20 to-yellow-300/20'
  },
  '6-9': {
    subjects: [
      {
        id: 'math' as Subject,
        name: 'Math Adventures',
        icon: Calculator,
        color: 'bg-blue-500 text-white',
        description: '➕ Addition, subtraction & more!'
      },
      {
        id: 'reading' as Subject,
        name: 'Story World',
        icon: Book,
        color: 'bg-indigo-500 text-white',
        description: '📚 Amazing books and writing!'
      },
      {
        id: 'science' as Subject,
        name: 'Science Lab',
        icon: Flask,
        color: 'bg-teal-500 text-white',
        description: '🔬 Cool experiments await!'
      },
      {
        id: 'art' as Subject,
        name: 'Art Studio',
        icon: Palette,
        color: 'bg-orange-500 text-white',
        description: '🖌️ Digital art and crafts!'
      }
    ],
    background: 'from-blue-300/20 via-teal-300/20 to-green-300/20'
  },
  '10-12': {
    subjects: [
      {
        id: 'math' as Subject,
        name: 'Advanced Math',
        icon: Calculator,
        color: 'bg-slate-600 text-white',
        description: '✖️ Complex problems & geometry!'
      },
      {
        id: 'reading' as Subject,
        name: 'Literature',
        icon: Book,
        color: 'bg-violet-600 text-white',
        description: '📝 Deep stories and analysis!'
      },
      {
        id: 'science' as Subject,
        name: 'Discovery Lab',
        icon: Flask,
        color: 'bg-emerald-600 text-white',
        description: '⚗️ Chemistry and physics!'
      },
      {
        id: 'art' as Subject,
        name: 'Design Studio',
        icon: Palette,
        color: 'bg-rose-600 text-white',
        description: '🎭 Animation and design!'
      }
    ],
    background: 'from-slate-300/20 via-violet-300/20 to-emerald-300/20'
  }
}

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
      { id: 'letterland-adventure', name: 'Letterland Adventure', difficulty: 1 },
      { id: 'find-letter', name: 'Find the Letter', difficulty: 1 },
      { id: 'sound-match', name: 'Sound Matching', difficulty: 2 }
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
      { id: 'story-safari', name: 'Story Safari', difficulty: 2 },
      { id: 'word-builder', name: 'Word Builder', difficulty: 2 },
      { id: 'story-quiz', name: 'Story Quiz', difficulty: 3 }
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
      { id: 'grammar-galaxy', name: 'Grammar Galaxy', difficulty: 4 },
      { id: 'sentence-fix', name: 'Fix the Sentence', difficulty: 3 },
      { id: 'reading-quest', name: 'Reading Quest', difficulty: 4 }
    ],
    art: [
      { id: 'perspective-drawing', name: 'Perspective Art', difficulty: 4 },
      { id: 'animation-basics', name: 'Simple Animation', difficulty: 4 },
      { id: 'graphic-design', name: 'Design Projects', difficulty: 3 }
    ]
  }
}

export function Dashboard({ profile, onProfileUpdate, onActivityStart, onShowParentDashboard, onBackToAgeSelection }: DashboardProps) {
  const [showCustomization, setShowCustomization] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const subjectCardsRef = useRef<HTMLDivElement[]>([])
  const companionRef = useRef<HTMLDivElement>(null)

  // Animation setup
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
    }
  }, [])

  useEffect(() => {
    if (!selectedSubject && subjectCardsRef.current.length > 0) {
      gsap.fromTo(subjectCardsRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.5, 
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      )
    }
  }, [selectedSubject])

  // Animate companion float
  useEffect(() => {
    if (companionRef.current) {
      gsap.to(companionRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    }
  }, [])

  // Safety check - return early if profile is not available
  if (!profile) {
    return <div>Loading...</div>
  }

  const activities = ACTIVITIES_BY_AGE[profile.ageGroup]
  const theme = AGE_GROUP_THEMES[profile.ageGroup]

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
    <div ref={containerRef} className={`h-screen bg-gradient-to-br ${theme.background} flex flex-col`}>
      {/* Top Bar - Fixed Height */}
      <div className="flex justify-between items-center bg-white/80 rounded-2xl p-3 shadow-lg m-3 mb-2">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToAgeSelection}
            className="font-heading flex items-center gap-1"
          >
            <ArrowLeft weight="bold" className="w-4 h-4" />
            Age
          </Button>
          <AvatarDisplay avatar={profile.avatar} size="small" />
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground">
              Hi {profile.name}!
            </h1>
            <Badge variant="secondary" className="text-xs">
              Age {profile.ageGroup}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1 p-1">
            <Coins className="w-3 h-3 text-yellow-600" weight="fill" />
            <span className="font-heading font-semibold text-sm">{profile.coins}</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomization(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onShowParentDashboard}
            className="hidden sm:flex"
          >
            📊
          </Button>
        </div>
      </div>

      {/* Main Content Area - Uses remaining space */}
      <div className="flex-1 px-3 pb-3 min-h-0">
        {!selectedSubject ? (
          <div className="h-full flex flex-col gap-3">
            {/* Companion Message */}
            <Card ref={companionRef} className="bg-gradient-to-r from-primary/20 to-secondary/20 border-none flex-shrink-0">
              <CardContent className="p-4">
                <CompanionMessage ageGroup={profile.ageGroup} name={profile.name} />
              </CardContent>
            </Card>

            {/* Subject Grid - Takes remaining space */}
            <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
              {theme.subjects.map((subject, index) => {
                const progress = profile.progress[subject.id]
                return (
                  <Card 
                    key={subject.id}
                    ref={(el) => {
                      if (el) subjectCardsRef.current[index] = el
                    }}
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 flex flex-col min-h-0"
                    onClick={() => {
                      gsap.to(subjectCardsRef.current[index], {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.out"
                      })
                      setTimeout(() => setSelectedSubject(subject.id), 100)
                    }}
                  >
                    <CardContent className="p-3 flex flex-col items-center justify-center h-full text-center">
                      <div className={`w-10 h-10 rounded-full ${subject.color} flex items-center justify-center mb-2`}>
                        <subject.icon className="w-5 h-5" weight="bold" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-1 text-sm">
                        {subject.name}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground mb-2 line-clamp-2">
                        {subject.description}
                      </p>
                      <Progress 
                        value={progress} 
                        className="h-1.5 w-full mb-1"
                      />
                      <p className="text-xs text-muted-foreground">{progress}%</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {activities[subject.id].length} Activities
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Activity Header */}
            <div className="flex items-center gap-3 mb-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSubject(null)}
              >
                ← Back
              </Button>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {theme.subjects.find(s => s.id === selectedSubject)?.name} Activities
              </h2>
            </div>

            {/* Activities Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto">
              {activities[selectedSubject].map((activity) => (
                <Card 
                  key={activity.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 flex flex-col"
                  onClick={() => onActivityStart(selectedSubject, activity.id)}
                >
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading text-sm font-semibold">
                          {activity.name}
                        </h3>
                        <div className="flex">
                          {getDifficultyStars(activity.difficulty)}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full font-heading mt-auto">
                      Start
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parent Dashboard Access - Mobile Only */}
      <div className="sm:hidden px-3 pb-3">
        <Button
          variant="secondary"
          onClick={onShowParentDashboard}
          className="w-full h-8 text-xs"
        >
          📊 Parent View
        </Button>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Microscope, Beaker, Leaf, Lightning, Star, Coins } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { NatureNook } from './NatureNook'
import { LabExplorers } from './LabExplorers'
import { ScienceQuest } from './ScienceQuest'
import type { UserProfile } from '@/App'
import { useSessionTracking } from '@/hooks/useSessionTracking'
import { toast } from 'sonner'

interface ScienceSafariProps {
  profile: UserProfile
  onComplete: (coinsEarned: number) => void
  onBack: () => void
}

type ScienceActivity = 'nature-explorer' | 'experiment-lab' | 'science-mysteries'

const AGE_GROUP_ACTIVITIES: Record<string, { activities: ScienceActivity[], title: string, description: string, icon: React.ReactNode }> = {
  '3-5': {
    activities: ['nature-explorer'],
    title: 'Nature Nook',
    description: 'Discover animals, plants, and weather with your curious friends!',
    icon: <Leaf className="w-8 h-8" weight="fill" />
  },
  '6-9': {
    activities: ['experiment-lab'],
    title: 'Lab Explorers',
    description: 'Conduct fun experiments and learn about the world around you!',
    icon: <Beaker className="w-8 h-8" weight="fill" />
  },
  '10-12': {
    activities: ['science-mysteries'],
    title: 'Science Quest',
    description: 'Solve scientific mysteries and run advanced experiments!',
    icon: <Microscope className="w-8 h-8" weight="fill" />
  }
}

const ENCOURAGEMENT_MESSAGES = [
  "What an amazing scientist you are!",
  "Your curiosity is incredible!",
  "You're making great discoveries!",
  "Science is so much fun with you!",
  "Keep exploring, young scientist!",
  "Your observations are spot on!",
  "You're learning so much!",
  "What a brilliant scientific mind!"
]

export function ScienceSafari({ profile, onComplete, onBack }: ScienceSafariProps) {
  const [currentActivity, setCurrentActivity] = useState<ScienceActivity | null>(null)
  const [experimentsCompleted, setExperimentsCompleted] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [startTime] = useState(Date.now())
  const { recordSession } = useSessionTracking()

  // Safety check for profile
  if (!profile) {
    return <div>Loading...</div>
  }

  const ageGroupConfig = AGE_GROUP_ACTIVITIES[profile.ageGroup]

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  }

  const handleActivityComplete = (score: number) => {
    setExperimentsCompleted(prev => prev + 1)
    setTotalScore(prev => prev + score)
    setCurrentActivity(null)
    
    toast.success("Experiment completed! Great discovery! 🧪")
    
    // If all activities for this age group are completed
    if (experimentsCompleted + 1 >= ageGroupConfig.activities.length) {
      handleCompleteAllActivities()
    }
  }

  const handleCompleteAllActivities = () => {
    const coinsEarned = Math.max(20, totalScore * 2)
    const duration = Math.round((Date.now() - startTime) / 60000)
    
    // Record the science session
    recordSession('science', Math.max(1, duration), experimentsCompleted + 1, coinsEarned, totalScore)
    
    setTimeout(() => {
      onComplete(coinsEarned)
      toast.success(`Science Safari completed! You earned ${coinsEarned} coins! 🏆`)
    }, 2000)
  }

  // Render specific activity component
  if (currentActivity) {
    switch (currentActivity) {
      case 'nature-explorer':
        return (
          <NatureNook
            profile={profile}
            onComplete={handleActivityComplete}
            onBack={() => setCurrentActivity(null)}
          />
        )
      case 'experiment-lab':
        return (
          <LabExplorers
            profile={profile}
            onComplete={handleActivityComplete}
            onBack={() => setCurrentActivity(null)}
          />
        )
      case 'science-mysteries':
        return (
          <ScienceQuest
            profile={profile}
            onComplete={handleActivityComplete}
            onBack={() => setCurrentActivity(null)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-blue-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              {ageGroupConfig.icon}
              <div>
                <h1 className="font-heading text-2xl font-bold text-emerald-800">
                  Science Safari
                </h1>
                <p className="font-body text-sm text-emerald-600">
                  {ageGroupConfig.title} • Ages {profile.ageGroup}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="small" />
            <Badge variant="outline" className="bg-emerald-50">
              <Lightning className="w-4 h-4 mr-1" weight="fill" />
              Scientist {profile.name}
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Microscope className="w-6 h-6 text-emerald-600" weight="fill" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-emerald-800">
                    Discovery Progress
                  </h3>
                  <p className="font-body text-sm text-emerald-600">
                    {experimentsCompleted} of {ageGroupConfig.activities.length} experiments completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                  <span className="font-body text-sm font-medium">{totalScore} discoveries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-600" weight="fill" />
                  <span className="font-body text-sm font-medium">{profile.coins} coins</span>
                </div>
              </div>
            </div>
            <Progress 
              value={(experimentsCompleted / ageGroupConfig.activities.length) * 100} 
              className="h-3 bg-emerald-100" 
            />
          </CardContent>
        </Card>

        {/* Avatar Companion */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🐻</div>
              <div className="flex-1">
                <p className="font-body text-lg text-blue-800">
                  "Welcome to Science Safari, {profile.name}! I'm Dr. Teddy, your science guide. 
                  {experimentsCompleted === 0 
                    ? " Let's explore the amazing world of science together!"
                    : ` ${getRandomEncouragement()} Ready for more discoveries?`
                  }"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Selection */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-center text-emerald-800">
            Choose Your Science Adventure
          </h2>
          
          <div className="grid gap-4">
            {ageGroupConfig.activities.map((activity) => {
              const isCompleted = activity === 'nature-explorer' && experimentsCompleted > 0
              
              return (
                <Card 
                  key={activity}
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    isCompleted ? 'bg-emerald-50 border-emerald-300' : 'hover:scale-[1.02]'
                  }`}
                  onClick={() => setCurrentActivity(activity)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-full ${
                        activity === 'nature-explorer' ? 'bg-green-100' :
                        activity === 'experiment-lab' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        {activity === 'nature-explorer' && <Leaf className="w-8 h-8 text-green-600" weight="fill" />}
                        {activity === 'experiment-lab' && <Beaker className="w-8 h-8 text-blue-600" weight="fill" />}
                        {activity === 'science-mysteries' && <Microscope className="w-8 h-8 text-purple-600" weight="fill" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-heading text-lg font-semibold">
                            {activity === 'nature-explorer' && 'Nature Explorer'}
                            {activity === 'experiment-lab' && 'Experiment Lab'}
                            {activity === 'science-mysteries' && 'Science Mysteries'}
                          </h3>
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                        <p className="font-body text-muted-foreground mb-3">
                          {activity === 'nature-explorer' && 'Learn about animals, plants, and weather through interactive exploration!'}
                          {activity === 'experiment-lab' && 'Conduct safe, fun experiments and discover scientific principles!'}
                          {activity === 'science-mysteries' && 'Solve complex scientific puzzles and run advanced experiments!'}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Star className="w-4 h-4" weight="fill" />
                            Earn discoveries
                          </span>
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Coins className="w-4 h-4" weight="fill" />
                            Earn coins
                          </span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="lg" className="font-heading">
                        {isCompleted ? 'Play Again' : 'Start Exploring'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Fun Science Facts */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold text-orange-800 flex items-center gap-2">
              <Star className="w-5 h-5" weight="fill" />
              Did You Know?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-orange-700">
              {profile.ageGroup === '3-5' && "A butterfly can taste with its feet! They land on flowers to taste if they're sweet enough to drink from. 🦋"}
              {profile.ageGroup === '6-9' && "Octopuses have three hearts and blue blood! Two hearts pump blood to their gills, and one pumps blood to the rest of their body. 🐙"}
              {profile.ageGroup === '10-12' && "There are more possible games of chess than there are atoms in the observable universe! Chess has about 10^120 possible games. ♟️"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
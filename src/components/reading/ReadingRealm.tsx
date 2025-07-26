import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BookOpen, Star, Users, Trophy } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { LetterLandAdventure } from './LetterLandAdventure'
import { StorySafari } from './StorySafari'
import { GrammarGalaxy } from './GrammarGalaxy'
import type { UserProfile, AgeGroup } from '@/App'

interface ReadingRealmProps {
  profile: UserProfile
  onComplete: (coinsEarned: number) => void
  onBack: () => void
}

type ReadingActivity = {
  id: string
  title: string
  description: string
  ageGroups: AgeGroup[]
  difficulty: number
  icon: string
  component: 'letterland' | 'story-safari' | 'grammar-galaxy'
  estimatedTime: string
  skills: string[]
}

const READING_ACTIVITIES: ReadingActivity[] = [
  {
    id: 'letterland-adventure',
    title: 'Letterland Adventure',
    description: 'Learn letters, phonics, and simple words with talking animal friends!',
    ageGroups: ['3-5'],
    difficulty: 1,
    icon: '🏰',
    component: 'letterland',
    estimatedTime: '10-15 min',
    skills: ['Letter Recognition', 'Phonics', 'Sound Matching', 'Simple Words']
  },
  {
    id: 'story-safari',
    title: 'Story Safari',
    description: 'Interactive storybooks with comprehension and vocabulary building!',
    ageGroups: ['6-9'],
    difficulty: 2,
    icon: '🦁',
    component: 'story-safari',
    estimatedTime: '15-20 min',
    skills: ['Reading Comprehension', 'Vocabulary', 'Word Building', 'Story Analysis']
  },
  {
    id: 'grammar-galaxy',
    title: 'Grammar Galaxy',
    description: 'Master grammar, sentence structure, and advanced reading skills!',
    ageGroups: ['10-12'],
    difficulty: 3,
    icon: '🌌',
    component: 'grammar-galaxy',
    estimatedTime: '20-25 min',
    skills: ['Grammar', 'Sentence Structure', 'Reading Analysis', 'Critical Thinking']
  }
]

export function ReadingRealm({ profile, onComplete, onBack }: ReadingRealmProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  
  // Filter activities based on user's age group
  const availableActivities = READING_ACTIVITIES.filter(activity => 
    activity.ageGroups.includes(profile.ageGroup)
  )

  // Also include activities from lower age groups for review/practice
  const reviewActivities = READING_ACTIVITIES.filter(activity => {
    const ageGroupOrder: AgeGroup[] = ['3-5', '6-9', '10-12']
    const currentIndex = ageGroupOrder.indexOf(profile.ageGroup)
    const activityIndex = ageGroupOrder.findIndex(age => activity.ageGroups.includes(age))
    return activityIndex < currentIndex && activityIndex >= 0
  })

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId)
  }

  const handleActivityComplete = (coinsEarned: number) => {
    setSelectedActivity(null)
    onComplete(coinsEarned)
  }

  const handleBackFromActivity = () => {
    setSelectedActivity(null)
  }

  // Render specific activity component
  if (selectedActivity) {
    const activity = READING_ACTIVITIES.find(a => a.id === selectedActivity)
    if (!activity) return null

    switch (activity.component) {
      case 'letterland':
        return (
          <LetterLandAdventure
            profile={profile}
            onComplete={handleActivityComplete}
            onBack={handleBackFromActivity}
          />
        )
      case 'story-safari':
        return (
          <StorySafari
            profile={profile}
            onComplete={handleActivityComplete}
            onBack={handleBackFromActivity}
          />
        )
      case 'grammar-galaxy':
        return (
          <GrammarGalaxy
            profile={profile}
            onComplete={handleActivityComplete}
            onBack={handleBackFromActivity}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                📚 Reading Realm
              </h1>
              <p className="font-body text-muted-foreground">
                Embark on magical reading adventures!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="small" />
            <div className="text-right">
              <div className="font-heading text-lg font-semibold text-primary">
                Level {Math.floor((profile.progress.reading || 0) / 20) + 1}
              </div>
              <div className="text-sm text-muted-foreground">Reader</div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-pink-200 to-purple-200 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">📖</div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-bold mb-2">
                  Welcome to Reading Realm, {profile.name}! 
                </h2>
                <p className="font-body text-foreground">
                  Choose your reading adventure! Each quest will help you become a stronger reader with fun activities, 
                  stories, and challenges designed just for your age group.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Age-Appropriate Activities */}
        <div>
          <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" weight="fill" />
            Perfect for You ({profile.ageGroup} years)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableActivities.map((activity) => (
              <Card
                key={activity.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white/80 backdrop-blur-sm"
                onClick={() => handleActivitySelect(activity.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-5xl mb-2">{activity.icon}</div>
                  <CardTitle className="font-heading text-lg font-bold">
                    {activity.title}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="w-4 h-4" />
                    <span>Difficulty: {activity.difficulty}/5</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-body text-sm text-center text-muted-foreground">
                    {activity.description}
                  </p>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                      <BookOpen className="w-3 h-3" />
                      {activity.estimatedTime}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground">Skills you'll practice:</div>
                    <div className="flex flex-wrap gap-1">
                      {activity.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {activity.skills.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{activity.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button className="w-full font-heading" size="sm">
                    Start Adventure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Review Activities (if available) */}
        {reviewActivities.length > 0 && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" weight="fill" />
              Review & Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewActivities.map((activity) => (
                <Card
                  key={activity.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white/60 backdrop-blur-sm border-2 border-dashed border-blue-300"
                  onClick={() => handleActivitySelect(activity.id)}
                >
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2 opacity-70">{activity.icon}</div>
                    <CardTitle className="font-heading text-base font-bold text-blue-700">
                      {activity.title} (Review)
                    </CardTitle>
                    <div className="text-xs text-blue-600">
                      Great for building confidence!
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="font-body text-xs text-center text-muted-foreground">
                      Review and strengthen your foundation with this activity.
                    </p>
                    
                    <Button variant="outline" className="w-full font-heading" size="sm">
                      Practice Again
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reading Progress */}
        <Card className="bg-gradient-to-r from-emerald-100 to-blue-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold mb-2">Your Reading Journey</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Keep reading to unlock new adventures and earn more coins!
                </p>
              </div>
              <div className="text-right">
                <div className="font-heading text-2xl font-bold text-primary">
                  {profile.progress.reading || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
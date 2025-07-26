import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { AvatarCreation } from '@/components/AvatarCreation'
import { Dashboard } from '@/components/Dashboard'
import { LearningActivity } from '@/components/LearningActivity'

export type AgeGroup = '3-5' | '6-9' | '10-12'
export type Subject = 'math' | 'science' | 'reading' | 'art'

export interface UserProfile {
  name: string
  age: number
  ageGroup: AgeGroup
  avatar: {
    body: string
    hair: string
    clothes: string
    accessories: string[]
  }
  theme: string
  coins: number
  unlockedItems: string[]
  progress: Record<Subject, number>
  achievements: string[]
}

export interface ActivityState {
  subject: Subject | null
  activityId: string | null
}

function App() {
  const [profile, setProfile] = useKV<UserProfile | null>('user-profile', null)
  const [currentActivity, setCurrentActivity] = useState<ActivityState>({ subject: null, activityId: null })

  const handleProfileCreated = (newProfile: UserProfile) => {
    setProfile(newProfile)
  }

  const handleActivityStart = (subject: Subject, activityId: string) => {
    setCurrentActivity({ subject, activityId })
  }

  const handleActivityComplete = (coinsEarned: number) => {
    if (profile) {
      setProfile((current) => ({
        ...current!,
        coins: current!.coins + coinsEarned
      }))
    }
    setCurrentActivity({ subject: null, activityId: null })
  }

  const handleBackToDashboard = () => {
    setCurrentActivity({ subject: null, activityId: null })
  }

  if (!profile) {
    return <AvatarCreation onProfileCreated={handleProfileCreated} />
  }

  if (currentActivity.subject && currentActivity.activityId) {
    return (
      <LearningActivity
        subject={currentActivity.subject}
        activityId={currentActivity.activityId}
        profile={profile}
        onComplete={handleActivityComplete}
        onBack={handleBackToDashboard}
      />
    )
  }

  return (
    <Dashboard
      profile={profile}
      onProfileUpdate={setProfile}
      onActivityStart={handleActivityStart}
    />
  )
}

export default App
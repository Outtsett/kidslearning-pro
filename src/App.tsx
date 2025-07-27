import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { AgeGroupSelection } from '@/components/AgeGroupSelection'
import { Dashboard } from '@/components/Dashboard'
import { LearningActivity } from '@/components/LearningActivity'
import { ParentDashboard } from '@/components/ParentDashboard'

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
  const [selectedAgeGroup, setSelectedAgeGroup] = useKV<AgeGroup | null>('selected-age-group', null)
  const [currentActivity, setCurrentActivity] = useState<ActivityState>({ subject: null, activityId: null })
  const [showParentDashboard, setShowParentDashboard] = useState(false)

  const handleAgeGroupSelected = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup)
    // Create default profile when age group is selected
    const defaultProfile: UserProfile = {
      name: 'Young Learner',
      age: ageGroup === '3-5' ? 4 : ageGroup === '6-9' ? 7 : 11,
      ageGroup,
      avatar: {
        body: 'default',
        hair: 'default',
        clothes: 'default',
        accessories: []
      },
      theme: 'default',
      coins: 0,
      unlockedItems: [],
      progress: { math: 0, science: 0, reading: 0, art: 0 },
      achievements: []
    }
    setProfile(defaultProfile)
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

  const handleShowParentDashboard = () => {
    setShowParentDashboard(true)
  }

  const handleBackFromParentDashboard = () => {
    setShowParentDashboard(false)
  }

  const handleBackToAgeSelection = () => {
    setSelectedAgeGroup(null)
    setProfile(null)
  }

  // If no age group is selected, show age group selection
  if (!selectedAgeGroup) {
    return <AgeGroupSelection onAgeGroupSelected={handleAgeGroupSelected} />
  }

  if (showParentDashboard) {
    return (
      <ParentDashboard
        profile={profile}
        onBack={handleBackFromParentDashboard}
      />
    )
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
      profile={profile!}
      onProfileUpdate={setProfile}
      onActivityStart={handleActivityStart}
      onShowParentDashboard={handleShowParentDashboard}
      onBackToAgeSelection={handleBackToAgeSelection}
    />
  )
}

export default App
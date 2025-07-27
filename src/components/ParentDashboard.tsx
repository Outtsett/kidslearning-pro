import { useState, useMemo, useEffect, useRef } from 'react'
import React from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calculator, 
  Palette, 
  Microscope,
  Target,
  Award,
  Brain,
  ArrowLeft,
  Database,
  Lock,
  Download,
  FileText,
  FileCsv,
  Shield,
  Eye,
  EyeSlash,
  ChartLine
} from '@phosphor-icons/react'
import { UserProfile, Subject, AgeGroup } from '@/App'
import { useSampleData } from '@/hooks/useSampleData'

interface SessionData {
  date: string
  subject: Subject
  duration: number // in minutes
  activitiesCompleted: number
  coinsEarned: number
  accuracy: number // percentage
  difficultyLevel: 'easy' | 'medium' | 'hard'
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  score: number
}

interface WeeklyGoal {
  subject: Subject
  targetMinutes: number
  targetActivities: number
  currentMinutes: number
  currentActivities: number
}

interface ParentDashboardProps {
  profile: UserProfile | null
  onBack: () => void
}

interface Stats {
  totalTime: number
  totalActivities: number
  averageAccuracy: number
  averageScore: number
  subjectBreakdown: Array<{
    subject: Subject
    time: number
    activities: number
    accuracy: number
    score: number
    trend: 'up' | 'down' | 'stable'
    averageDifficulty: number
  }>
  sessionsThisWeek: number
  difficultyTrends: DifficultyTrend[]
  timeDistribution: Record<string, number>
  streakDays: number
}

interface DifficultyTrend {
  subject: Subject
  trend: 'increasing' | 'decreasing' | 'stable'
  averageDifficulty: number
  recommendation: string
}

function PasswordProtection({ onAuthenticated, onBack }: { onAuthenticated: () => void, onBack: () => void }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [parentPassword] = useKV<string>('parent-password', 'parent123')
  const [attempts, setAttempts] = useKV<number>('password-attempts', 0)
  const [lockoutUntil, setLockoutUntil] = useKV<number>('lockout-until', 0)

  const handleLogin = () => {
    if (Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60)
      toast.error(`Too many failed attempts. Try again in ${remainingTime} minutes.`)
      return
    }

    if (password === parentPassword) {
      setAttempts(0)
      onAuthenticated()
      toast.success('Access granted to Parent Dashboard')
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts >= 3) {
        setLockoutUntil(Date.now() + 15 * 60 * 1000) // 15 minute lockout
        toast.error('Too many failed attempts. Locked out for 15 minutes.')
      } else {
        toast.error(`Incorrect password. ${3 - newAttempts} attempts remaining.`)
      }
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield size={32} className="text-primary" />
            </div>
            <div className="w-10"></div>
          </div>
          <CardTitle className="font-heading text-2xl">Parent Dashboard</CardTitle>
          <CardDescription>
            Enter your password to access progress monitoring and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter parent password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            {attempts > 0 && attempts < 3 && (
              <p className="text-sm text-destructive">
                {3 - attempts} attempts remaining
              </p>
            )}
          </div>
          
          <Button onClick={handleLogin} className="w-full" disabled={Date.now() < lockoutUntil}>
            <Lock size={16} className="mr-2" />
            Access Dashboard
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Default password: parent123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ParentDashboard({ profile, onBack }: ParentDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessions] = useKV<SessionData[]>('learning-sessions', [])
  const [weeklyGoals, setWeeklyGoals] = useKV<WeeklyGoal[]>('weekly-goals', [
    { subject: 'math', targetMinutes: 90, targetActivities: 6, currentMinutes: 0, currentActivities: 0 },
    { subject: 'reading', targetMinutes: 120, targetActivities: 8, currentMinutes: 0, currentActivities: 0 },
    { subject: 'science', targetMinutes: 60, targetActivities: 4, currentMinutes: 0, currentActivities: 0 },
    { subject: 'art', targetMinutes: 45, targetActivities: 3, currentMinutes: 0, currentActivities: 0 }
  ])
  const { generateSampleSessions } = useSampleData()
  const dashboardRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  // Animation setup
  useEffect(() => {
    if (isAuthenticated && dashboardRef.current) {
      gsap.fromTo(dashboardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      )
    }
  }, [isAuthenticated, sessions.length])

  // Show password protection first
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} onBack={onBack} />
  }

  // Safety check for profile
  if (!profile) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <p>No profile data available</p>
            <Button onClick={onBack} className="mt-4">
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const subjectConfig = {
    math: { icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50' },
    reading: { icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
    science: { icon: Microscope, color: 'text-purple-600', bg: 'bg-purple-50' },
    art: { icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50' }
  }

  // Calculate comprehensive statistics
  const stats: Stats = useMemo(() => {
    const now = new Date()
    const last7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date)
      const daysDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24)
      return daysDiff <= 7
    })
    const last30Days = sessions.filter(session => {
      const sessionDate = new Date(session.date)
      const daysDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24)
      return daysDiff <= 30
    })

    const calculateTrend = (recentSessions: SessionData[]) => {
      if (recentSessions.length < 2) return 'stable' as const
      const firstHalf = recentSessions.slice(0, Math.floor(recentSessions.length / 2))
      const secondHalf = recentSessions.slice(Math.floor(recentSessions.length / 2))
      
      const firstAvg = firstHalf.reduce((sum, s) => sum + s.accuracy, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((sum, s) => sum + s.accuracy, 0) / secondHalf.length
      
      const difference = secondAvg - firstAvg
      return difference > 5 ? 'up' : difference < -5 ? 'down' : 'stable'
    }

    const calculateAverageDifficulty = (sessions: SessionData[]) => {
      if (sessions.length === 0) return 0
      const difficultyMap = { easy: 1, medium: 2, hard: 3 }
      return sessions.reduce((sum, s) => sum + difficultyMap[s.difficultyLevel], 0) / sessions.length
    }

    const calculateDifficultyTrend = (sessions: SessionData[]) => {
      if (sessions.length < 3) return { trend: 'stable' as const, averageDifficulty: 0 }
      
      const recent = sessions.slice(-5)
      const earlier = sessions.slice(-10, -5)
      
      const recentAvg = calculateAverageDifficulty(recent)
      const earlierAvg = calculateAverageDifficulty(earlier)
      
      const diff = recentAvg - earlierAvg
      const trend = diff > 0.3 ? 'increasing' : diff < -0.3 ? 'decreasing' : 'stable'
      
      return { trend, averageDifficulty: recentAvg }
    }

    const calculateTimeDistribution = (sessions: SessionData[]) => {
      const distribution = { morning: 0, afternoon: 0, evening: 0 }
      sessions.forEach(session => {
        distribution[session.timeOfDay] += session.duration
      })
      return distribution
    }

    const calculateStreakDays = (allSessions: SessionData[]) => {
      if (allSessions.length === 0) return 0
      
      const sortedDates = [...new Set(allSessions.map(s => s.date))].sort().reverse()
      let streak = 0
      const today = new Date().toDateString()
      let currentDate = new Date()
      
      for (let i = 0; i < sortedDates.length; i++) {
        const sessionDate = new Date(sortedDates[i]).toDateString()
        const expectedDate = currentDate.toDateString()
        
        if (sessionDate === expectedDate) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else if (i === 0 && sessionDate !== today) {
          // If the first session isn't today, no current streak
          break
        } else {
          break
        }
      }
      
      return streak
    }

    const generateRecommendation = (subject: Subject, trend: { trend: string, averageDifficulty: number }, ageGroup: AgeGroup): string => {
      const recommendations = {
        '3-5': {
          math: ['Try counting games', 'Use visual aids', 'Keep sessions short'],
          reading: ['Read aloud together', 'Use picture books', 'Practice letter sounds'],
          science: ['Explore nature', 'Simple experiments', 'Ask "why" questions'],
          art: ['Free drawing time', 'Finger painting', 'Shape exploration']
        },
        '6-9': {
          math: ['Practice mental math', 'Word problems', 'Math games'],
          reading: ['Independent reading', 'Chapter books', 'Reading comprehension'],
          science: ['Science experiments', 'Nature observation', 'Simple research'],
          art: ['Drawing techniques', 'Color mixing', 'Craft projects']
        },
        '10-12': {
          math: ['Advanced problems', 'Real-world applications', 'Logic puzzles'],
          reading: ['Complex literature', 'Research skills', 'Critical thinking'],
          science: ['Lab experiments', 'Scientific method', 'Research projects'],
          art: ['Digital art', 'Portfolio building', 'Art history']
        }
      }

      const tips = recommendations[ageGroup][subject]
      return tips[Math.floor(Math.random() * tips.length)]
    }

    const totalTime = last7Days.reduce((sum, session) => sum + session.duration, 0)
    const totalActivities = last7Days.reduce((sum, session) => sum + session.activitiesCompleted, 0)
    const averageAccuracy = last7Days.length > 0
      ? last7Days.reduce((sum, session) => sum + session.accuracy, 0) / last7Days.length 
      : 0
    const averageScore = last7Days.length > 0
      ? last7Days.reduce((sum, session) => sum + (session.score || 0), 0) / last7Days.length
      : 0

    const subjectBreakdown = Object.keys(subjectConfig).map(subject => {
      const subjectSessions = last7Days.filter(s => s.subject === subject as Subject)
      const monthSessions = last30Days.filter(s => s.subject === subject as Subject)
      
      return {
        subject: subject as Subject,
        time: subjectSessions.reduce((sum, s) => sum + s.duration, 0),
        activities: subjectSessions.reduce((sum, s) => sum + s.activitiesCompleted, 0),
        accuracy: subjectSessions.length > 0 
          ? subjectSessions.reduce((sum, s) => sum + s.accuracy, 0) / subjectSessions.length 
          : 0,
        score: subjectSessions.length > 0
          ? subjectSessions.reduce((sum, s) => sum + (s.score || 0), 0) / subjectSessions.length
          : 0,
        trend: calculateTrend(monthSessions),
        averageDifficulty: calculateAverageDifficulty(subjectSessions)
      }
    })

    // Calculate difficulty trends
    const difficultyTrends: DifficultyTrend[] = Object.keys(subjectConfig).map(subject => {
      const subjectSessions = last30Days.filter(s => s.subject === subject as Subject)
      const trend = calculateDifficultyTrend(subjectSessions)
      
      return {
        subject: subject as Subject,
        trend: trend.trend,
        averageDifficulty: trend.averageDifficulty,
        recommendation: generateRecommendation(subject as Subject, trend, profile?.ageGroup || '6-9')
      }
    })

    return {
      totalTime,
      totalActivities,
      averageAccuracy,
      averageScore,
      subjectBreakdown,
      sessionsThisWeek: last7Days.length,
      difficultyTrends,
      timeDistribution: calculateTimeDistribution(last7Days),
      streakDays: calculateStreakDays(sessions)
    }
  }, [sessions, profile?.ageGroup])

  const exportToPDF = () => {
    toast.info('PDF export feature coming soon!')
  }

  const exportToCSV = () => {
    if (sessions.length === 0) {
      toast.error('No data to export')
      return
    }

    const csvContent = [
      ['Date', 'Subject', 'Duration (min)', 'Activities', 'Accuracy (%)', 'Score', 'Difficulty'],
      ...sessions.map(session => [
        session.date,
        session.subject,
        session.duration.toString(),
        session.activitiesCompleted.toString(),
        session.accuracy.toString(),
        (session.score || 0).toString(),
        session.difficultyLevel
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learning-progress-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Progress data exported to CSV')
  }

  const addSampleData = () => {
    generateSampleSessions()
    toast.success(`Added sample learning sessions for demo`)
  }

  return (
    <div ref={dashboardRef} className="h-screen bg-gradient-to-br from-background via-card to-muted overflow-hidden">
      <div className="h-full flex flex-col p-4">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold">Parent Dashboard</h1>
              <p className="text-muted-foreground">
                Monitoring progress for {profile?.name || 'Young Learner'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addSampleData}>
              <Database size={16} className="mr-2" />
              Add Sample Data
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <FileCsv size={16} className="mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <FileText size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <BarChart3 size={16} className="mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="subjects">
                <Brain size={16} className="mr-2" />
                Subjects
              </TabsTrigger>
              <TabsTrigger value="goals">
                <Target size={16} className="mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="insights">
                <ChartLine size={16} className="mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card ref={(el) => { if (el) cardsRef.current[0] = el }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">This Week</p>
                        <p className="text-2xl font-bold">{stats.totalTime}min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card ref={(el) => { if (el) cardsRef.current[1] = el }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Activities</p>
                        <p className="text-2xl font-bold">{stats.totalActivities}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card ref={(el) => { if (el) cardsRef.current[2] = el }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Star size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{Math.round(stats.averageAccuracy)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card ref={(el) => { if (el) cardsRef.current[3] = el }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Streak</p>
                        <p className="text-2xl font-bold">{stats.streakDays} days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject Performance Overview */}
              <Card ref={(el) => { if (el) cardsRef.current[4] = el }}>
                <CardHeader>
                  <CardTitle>Subject Performance (Last 7 Days)</CardTitle>
                  <CardDescription>
                    Time spent and accuracy by subject
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.subjectBreakdown.map((subject) => {
                      const SubjectIcon = subjectConfig[subject.subject].icon
                      return (
                        <div key={subject.subject} className="flex items-center justify-between p-4 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${subjectConfig[subject.subject].bg}`}>
                              <SubjectIcon size={20} className={subjectConfig[subject.subject].color} />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{subject.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {subject.time}min • {subject.activities} activities
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Badge variant={subject.accuracy >= 80 ? 'default' : 'secondary'}>
                                {Math.round(subject.accuracy)}%
                              </Badge>
                              {subject.trend === 'up' && <TrendingUp size={16} className="text-green-500" />}
                              {subject.trend === 'down' && <TrendingUp size={16} className="text-red-500 rotate-180" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.subjectBreakdown.map((subject) => {
                  const SubjectIcon = subjectConfig[subject.subject].icon
                  return (
                    <Card key={subject.subject}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <SubjectIcon size={20} className={subjectConfig[subject.subject].color} />
                          <span className="capitalize">{subject.subject}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Time This Week</p>
                            <p className="text-xl font-bold">{subject.time} min</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Activities</p>
                            <p className="text-xl font-bold">{subject.activities}</p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Accuracy</span>
                            <span>{Math.round(subject.accuracy)}%</span>
                          </div>
                          <Progress value={subject.accuracy} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Average Score</span>
                            <span>{Math.round(subject.score)}/100</span>
                          </div>
                          <Progress value={subject.score} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span>Difficulty Level</span>
                          <Badge variant="outline">
                            {subject.averageDifficulty.toFixed(1)}/3.0
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Learning Goals</CardTitle>
                  <CardDescription>
                    Track progress toward weekly targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {weeklyGoals.map((goal) => {
                      const SubjectIcon = subjectConfig[goal.subject].icon
                      const timeProgress = (goal.currentMinutes / goal.targetMinutes) * 100
                      const activityProgress = (goal.currentActivities / goal.targetActivities) * 100
                      
                      return (
                        <div key={goal.subject} className="space-y-3">
                          <div className="flex items-center gap-3">
                            <SubjectIcon size={20} className={subjectConfig[goal.subject].color} />
                            <h3 className="font-medium capitalize">{goal.subject}</h3>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Time Goal</span>
                                <span>{goal.currentMinutes}/{goal.targetMinutes} min</span>
                              </div>
                              <Progress value={Math.min(timeProgress, 100)} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Activity Goal</span>
                                <span>{goal.currentActivities}/{goal.targetActivities} activities</span>
                              </div>
                              <Progress value={Math.min(activityProgress, 100)} className="h-2" />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adjust Goals</CardTitle>
                  <CardDescription>
                    Customize weekly targets for each subject
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyGoals.map((goal, index) => (
                      <div key={goal.subject} className="space-y-3 p-4 border rounded-lg">
                        <h4 className="font-medium capitalize flex items-center gap-2">
                          {React.createElement(subjectConfig[goal.subject].icon, { 
                            size: 16, 
                            className: subjectConfig[goal.subject].color 
                          })}
                          {goal.subject}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`time-${goal.subject}`}>Weekly Minutes</Label>
                            <Input
                              id={`time-${goal.subject}`}
                              type="number"
                              value={goal.targetMinutes}
                              onChange={(e) => {
                                const newGoals = [...weeklyGoals]
                                newGoals[index].targetMinutes = parseInt(e.target.value) || 0
                                setWeeklyGoals(newGoals)
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`activities-${goal.subject}`}>Weekly Activities</Label>
                            <Input
                              id={`activities-${goal.subject}`}
                              type="number"
                              value={goal.targetActivities}
                              onChange={(e) => {
                                const newGoals = [...weeklyGoals]
                                newGoals[index].targetActivities = parseInt(e.target.value) || 0
                                setWeeklyGoals(newGoals)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Patterns</CardTitle>
                  <CardDescription>
                    Insights based on your child's activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.totalTime > 0 ? (
                      <>
                        <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                          <p className="text-sm">
                            <strong>Most Active Subject:</strong> {
                              stats.subjectBreakdown.reduce((prev, current) => 
                                prev.time > current.time ? prev : current
                              ).subject
                            }
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                          <p className="text-sm">
                            <strong>Strongest Performance:</strong> {
                              stats.subjectBreakdown.reduce((prev, current) => 
                                prev.accuracy > current.accuracy ? prev : current
                              ).subject
                            } ({Math.round(
                              stats.subjectBreakdown.reduce((prev, current) => 
                                prev.accuracy > current.accuracy ? prev : current
                              ).accuracy
                            )}% accuracy)
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Start learning activities to see personalized insights here!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
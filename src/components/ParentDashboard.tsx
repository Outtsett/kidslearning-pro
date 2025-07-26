import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Database
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
}

interface WeeklyGoal {
  subject: Subject
  targetMinutes: number
  targetActivities: number
  currentMinutes: number
  currentActivities: number
}

interface ParentDashboardProps {
  profile: UserProfile
  onBack: () => void
}

export function ParentDashboard({ profile, onBack }: ParentDashboardProps) {
  const [sessions] = useKV<SessionData[]>('learning-sessions', [])
  const [weeklyGoals, setWeeklyGoals] = useKV<WeeklyGoal[]>('weekly-goals', [
    { subject: 'math', targetMinutes: 90, targetActivities: 6, currentMinutes: 0, currentActivities: 0 },
    { subject: 'reading', targetMinutes: 120, targetActivities: 8, currentMinutes: 0, currentActivities: 0 },
    { subject: 'science', targetMinutes: 60, targetActivities: 4, currentMinutes: 0, currentActivities: 0 },
    { subject: 'art', targetMinutes: 45, targetActivities: 3, currentMinutes: 0, currentActivities: 0 }
  ])
  const { generateSampleSessions } = useSampleData()

  const subjectConfig = {
    math: { icon: Calculator, color: 'text-primary', name: 'Math' },
    reading: { icon: BookOpen, color: 'text-secondary', name: 'Reading' },
    science: { icon: Microscope, color: 'text-accent', name: 'Science' },
    art: { icon: Palette, color: 'text-lavender', name: 'Art' }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const last7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    })

    const totalTime = last7Days.reduce((sum, session) => sum + session.duration, 0)
    const totalActivities = last7Days.reduce((sum, session) => sum + session.activitiesCompleted, 0)
    const averageAccuracy = last7Days.length > 0 
      ? last7Days.reduce((sum, session) => sum + session.accuracy, 0) / last7Days.length 
      : 0

    const subjectBreakdown = Object.keys(subjectConfig).map(subject => {
      const subjectSessions = last7Days.filter(s => s.subject === subject as Subject)
      return {
        subject: subject as Subject,
        time: subjectSessions.reduce((sum, s) => sum + s.duration, 0),
        activities: subjectSessions.reduce((sum, s) => sum + s.activitiesCompleted, 0),
        accuracy: subjectSessions.length > 0 
          ? subjectSessions.reduce((sum, s) => sum + s.accuracy, 0) / subjectSessions.length 
          : 0
      }
    })

    return {
      totalTime,
      totalActivities,
      averageAccuracy,
      subjectBreakdown,
      sessionsThisWeek: last7Days.length
    }
  }, [sessions])

  const ageGroupRecommendations = {
    '3-5': {
      dailyTime: '15-20 minutes',
      focusAreas: ['Letter recognition', 'Number counting', 'Color identification', 'Basic shapes'],
      tips: ['Keep sessions short and playful', 'Use lots of visual rewards', 'Encourage exploration']
    },
    '6-9': {
      dailyTime: '20-30 minutes',
      focusAreas: ['Reading comprehension', 'Basic math operations', 'Science experiments', 'Creative projects'],
      tips: ['Set small achievable goals', 'Mix different subjects', 'Celebrate progress regularly']
    },
    '10-12': {
      dailyTime: '30-45 minutes',
      focusAreas: ['Advanced reading', 'Problem solving', 'Scientific method', 'Creative expression'],
      tips: ['Encourage independent learning', 'Discuss what they learned', 'Connect to real-world applications']
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to App
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Parent Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitoring {profile.name}'s learning journey
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              Age Group: {profile.ageGroup}
            </Badge>
            {sessions.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateSampleSessions}
                className="flex items-center gap-2"
              >
                <Database size={16} />
                Load Demo Data
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTime}m</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.sessionsThisWeek} sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activities</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalActivities}</div>
                  <p className="text-xs text-muted-foreground">
                    Completed this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(stats.averageAccuracy)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Average this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coins Earned</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.coins}</div>
                  <p className="text-xs text-muted-foreground">
                    Total collected
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Subject Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance This Week</CardTitle>
                <CardDescription>
                  Time spent and accuracy by subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.subjectBreakdown.map((subject) => {
                    const config = subjectConfig[subject.subject]
                    const Icon = config.icon
                    return (
                      <div key={subject.subject} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{config.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {subject.time}m
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">
                                {subject.activities} activities
                              </span>
                              <span className="text-muted-foreground">
                                {Math.round(subject.accuracy)}% accuracy
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  Track improvement across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(Object.keys(subjectConfig) as Subject[]).map((subject) => {
                  const config = subjectConfig[subject]
                  const Icon = config.icon
                  const progress = profile.progress[subject] || 0
                  
                  return (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                            <Icon size={20} />
                          </div>
                          <span className="font-medium">{config.name}</span>
                        </div>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Celebrate your child's learning milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.achievements.length > 0 ? (
                    profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <Award className="text-accent" size={24} />
                        <span className="font-medium">{achievement}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-2">
                      No achievements yet. Keep learning to unlock rewards!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Learning Goals</CardTitle>
                <CardDescription>
                  Track progress toward weekly targets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {weeklyGoals.map((goal) => {
                  const config = subjectConfig[goal.subject]
                  const Icon = config.icon
                  const timeProgress = Math.min((goal.currentMinutes / goal.targetMinutes) * 100, 100)
                  const activityProgress = Math.min((goal.currentActivities / goal.targetActivities) * 100, 100)
                  
                  return (
                    <div key={goal.subject} className="space-y-4 p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                          <Icon size={20} />
                        </div>
                        <span className="font-medium text-lg">{config.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Time Goal</span>
                            <span>{goal.currentMinutes}/{goal.targetMinutes} minutes</span>
                          </div>
                          <Progress value={timeProgress} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Activity Goal</span>
                            <span>{goal.currentActivities}/{goal.targetActivities} activities</span>
                          </div>
                          <Progress value={activityProgress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Age-Appropriate Recommendations</CardTitle>
                <CardDescription>
                  Tailored guidance for {profile.ageGroup} year olds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">
                    Recommended Daily Learning Time
                  </h4>
                  <p className="text-sm">
                    {ageGroupRecommendations[profile.ageGroup].dailyTime}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Focus Areas for This Age Group</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {ageGroupRecommendations[profile.ageGroup].focusAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Brain className="text-accent" size={16} />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Parenting Tips</h4>
                  <div className="space-y-2">
                    {ageGroupRecommendations[profile.ageGroup].tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="text-secondary mt-0.5 flex-shrink-0" size={16} />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

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
  )
}
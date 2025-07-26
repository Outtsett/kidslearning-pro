import { useState, useMemo } from 'react'
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

interface DifficultyTrend {
  subject: Subject
  trend: 'improving' | 'stable' | 'declining'
  averageDifficulty: number
  recommendation: string
}

interface ParentDashboardProps {
  profile: UserProfile
  onBack: () => void
}

function PasswordProtection({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [parentPassword] = useKV<string>('parent-password', 'parent123')
  const [attempts, setAttempts] = useKV<number>('password-attempts', 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (attempts >= 3) {
      toast.error('Too many failed attempts. Please wait before trying again.')
      return
    }

    if (password === parentPassword) {
      setAttempts(0)
      onAuthenticated()
      toast.success('Access granted to Parent Dashboard')
    } else {
      setAttempts(prev => prev + 1)
      toast.error(`Incorrect password. ${3 - (attempts + 1)} attempts remaining.`)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-heading">Parent Dashboard Access</CardTitle>
          <CardDescription>
            Enter your password to view your child's learning progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter parent password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            
            {attempts >= 3 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  Account temporarily locked due to failed attempts.
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={attempts >= 3 || !password.trim()}
            >
              <Lock size={16} className="mr-2" />
              Access Dashboard
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Default password: parent123
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function ExportReports({ profile, sessions }: { profile: UserProfile; sessions: SessionData[] }) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf')
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month')

  const generateReport = () => {
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date)
      const now = new Date()
      
      switch (dateRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return sessionDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return sessionDate >= monthAgo
        default:
          return true
      }
    })

    if (exportFormat === 'csv') {
      generateCSV(filteredSessions)
    } else {
      generatePDF(filteredSessions)
    }
  }

  const generateCSV = (data: SessionData[]) => {
    const headers = ['Date', 'Subject', 'Duration (min)', 'Activities', 'Accuracy (%)', 'Score', 'Difficulty', 'Time of Day', 'Coins Earned']
    const rows = data.map(session => [
      session.date,
      session.subject,
      session.duration,
      session.activitiesCompleted,
      session.accuracy,
      session.score,
      session.difficultyLevel,
      session.timeOfDay,
      session.coinsEarned
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name}_progress_report_${dateRange}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('CSV report downloaded successfully!')
  }

  const generatePDF = (data: SessionData[]) => {
    // Create a simple PDF-like HTML report
    const reportContent = `
      <html>
        <head>
          <title>${profile.name}'s Learning Progress Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${profile.name}'s Learning Progress Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>Age Group: ${profile.ageGroup} | Report Period: ${dateRange}</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <h3>Total Time</h3>
              <p>${data.reduce((sum, s) => sum + s.duration, 0)} minutes</p>
            </div>
            <div class="stat-card">
              <h3>Activities Completed</h3>
              <p>${data.reduce((sum, s) => sum + s.activitiesCompleted, 0)}</p>
            </div>
            <div class="stat-card">
              <h3>Average Accuracy</h3>
              <p>${Math.round(data.reduce((sum, s) => sum + s.accuracy, 0) / data.length)}%</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Duration</th>
                <th>Activities</th>
                <th>Accuracy</th>
                <th>Score</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(session => `
                <tr>
                  <td>${session.date}</td>
                  <td>${session.subject}</td>
                  <td>${session.duration}m</td>
                  <td>${session.activitiesCompleted}</td>
                  <td>${session.accuracy}%</td>
                  <td>${session.score}</td>
                  <td>${session.difficultyLevel}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(reportContent)
      printWindow.document.close()
      printWindow.print()
      toast.success('PDF report generated! Please save using your browser\'s print dialog.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download size={20} />
          Export Progress Reports
        </CardTitle>
        <CardDescription>
          Download detailed progress reports in PDF or CSV format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Report Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'pdf' | 'csv') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    PDF Report
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileCsv size={16} />
                    CSV Data
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={(value: 'week' | 'month' | 'all') => setDateRange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateReport} className="w-full">
          <Download size={16} className="mr-2" />
          Generate {exportFormat.toUpperCase()} Report
        </Button>
      </CardContent>
    </Card>
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

  // Show password protection first
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />
  }

  const subjectConfig = {
    math: { icon: Calculator, color: 'text-primary', name: 'Math' },
    reading: { icon: BookOpen, color: 'text-secondary', name: 'Reading' },
    science: { icon: Microscope, color: 'text-accent', name: 'Science' },
    art: { icon: Palette, color: 'text-lavender', name: 'Art' }
  }

  // Calculate advanced statistics including difficulty trends
  const stats = useMemo(() => {
    const last7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    })

    const last30Days = sessions.filter(session => {
      const sessionDate = new Date(session.date)
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      return sessionDate >= monthAgo
    })

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
        recommendation: generateRecommendation(subject as Subject, trend, profile.ageGroup)
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
  }, [sessions, profile.ageGroup])

  const calculateTrend = (sessions: SessionData[]) => {
    if (sessions.length < 2) return 'stable'
    
    const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2))
    const secondHalf = sessions.slice(Math.floor(sessions.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, s) => sum + s.accuracy, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.accuracy, 0) / secondHalf.length
    
    if (secondAvg > firstAvg + 5) return 'improving'
    if (secondAvg < firstAvg - 5) return 'declining'
    return 'stable'
  }

  const calculateAverageDifficulty = (sessions: SessionData[]) => {
    if (sessions.length === 0) return 0
    
    const difficultyMap = { easy: 1, medium: 2, hard: 3 }
    return sessions.reduce((sum, s) => sum + (difficultyMap[s.difficultyLevel || 'medium']), 0) / sessions.length
  }

  const calculateDifficultyTrend = (sessions: SessionData[]) => {
    const difficultyMap = { easy: 1, medium: 2, hard: 3 }
    const difficulties = sessions.map(s => difficultyMap[s.difficultyLevel || 'medium'])
    
    if (difficulties.length < 2) {
      return { trend: 'stable' as const, averageDifficulty: difficulties[0] || 2 }
    }
    
    const firstHalf = difficulties.slice(0, Math.floor(difficulties.length / 2))
    const secondHalf = difficulties.slice(Math.floor(difficulties.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + d, 0) / secondHalf.length
    const overallAvg = difficulties.reduce((sum, d) => sum + d, 0) / difficulties.length
    
    if (secondAvg > firstAvg + 0.3) return { trend: 'improving' as const, averageDifficulty: overallAvg }
    if (secondAvg < firstAvg - 0.3) return { trend: 'declining' as const, averageDifficulty: overallAvg }
    return { trend: 'stable' as const, averageDifficulty: overallAvg }
  }

  const generateRecommendation = (subject: Subject, trend: { trend: string; averageDifficulty: number }, ageGroup: AgeGroup) => {
    if (trend.trend === 'improving' && trend.averageDifficulty < 2.5) {
      return `${profile.name} is ready for more challenging ${subject} activities!`
    }
    if (trend.trend === 'declining') {
      return `Consider reviewing ${subject} basics and providing extra support.`
    }
    if (trend.averageDifficulty > 2.5) {
      return `${profile.name} is tackling advanced ${subject} concepts well!`
    }
    return `${profile.name} is making steady progress in ${subject}.`
  }

  const calculateTimeDistribution = (sessions: SessionData[]) => {
    const distribution = { morning: 0, afternoon: 0, evening: 0 }
    sessions.forEach(session => {
      if (session.timeOfDay) {
        distribution[session.timeOfDay] += session.duration
      }
    })
    return distribution
  }

  const calculateStreakDays = (sessions: SessionData[]) => {
    const dates = [...new Set(sessions.map(s => s.date))].sort()
    let currentStreak = 0
    let maxStreak = 0
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const currentDate = new Date(dates[i])
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i))
      
      if (currentDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        break
      }
    }
    
    return { current: currentStreak, max: maxStreak }
  }

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(stats.averageScore)}</div>
                  <p className="text-xs text-muted-foreground">
                    Out of 100 points
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.streakDays.current}</div>
                  <p className="text-xs text-muted-foreground">
                    Days in a row
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
                                {subject.activities} activities • {Math.round(subject.accuracy)}% accuracy
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Score:</span>
                                <span className="font-medium">{Math.round(subject.score)}</span>
                              </div>
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

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={20} />
                  Difficulty Progression & Trends
                </CardTitle>
                <CardDescription>
                  Track how your child's performance and difficulty levels are changing over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {stats.difficultyTrends.map((trend) => {
                  const config = subjectConfig[trend.subject]
                  const Icon = config.icon
                  const trendColor = trend.trend === 'improving' ? 'text-green-600' : 
                                   trend.trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                  const trendIcon = trend.trend === 'improving' ? '↗️' : 
                                  trend.trend === 'declining' ? '↘️' : '→'
                  
                  return (
                    <div key={trend.subject} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <span className="font-medium text-lg">{config.name}</span>
                            <div className="flex items-center gap-2 text-sm">
                              <span className={trendColor}>
                                {trendIcon} {trend.trend}
                              </span>
                              <span className="text-muted-foreground">
                                Avg. Difficulty: {trend.averageDifficulty.toFixed(1)}/3
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{trend.recommendation}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Time Distribution</CardTitle>
                <CardDescription>
                  When your child learns best throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(stats.timeDistribution).map(([period, minutes]) => (
                    <div key={period} className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">{minutes}m</div>
                      <div className="text-sm text-muted-foreground capitalize">{period}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <ExportReports profile={profile} sessions={sessions} />
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Summary</CardTitle>
                <CardDescription>
                  Detailed breakdown of the last 10 learning sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.slice(-10).reverse().map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${subjectConfig[session.subject].color}`}>
                          {React.createElement(subjectConfig[session.subject].icon, { size: 16 })}
                        </div>
                        <div>
                          <div className="font-medium">
                            {subjectConfig[session.subject].name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.date} • {session.timeOfDay || 'unknown'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{session.duration}m</div>
                        <div className="text-muted-foreground">
                          {session.accuracy}% • {session.difficultyLevel || 'medium'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No learning sessions recorded yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
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

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
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
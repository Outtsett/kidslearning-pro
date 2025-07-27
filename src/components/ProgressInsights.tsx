import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendUp, 
  TrendDown, 
  Target, 
  Star, 
  Brain, 
  Clock, 
  Lightbulb,
  CheckCircle,
  AlertTriangle
} from '@phosphor-icons/react'
import { useDifficultyEngine } from '@/hooks/useDifficultyEngine'
import type { Subject, AgeGroup } from '@/App'

interface ProgressInsightsProps {
  ageGroup: AgeGroup
  currentSubject?: Subject
}

export function ProgressInsights({ ageGroup, currentSubject }: ProgressInsightsProps) {
  const { 
    getSubjectPerformance, 
    getRecommendedActivities, 
    getLearningInsights,
    difficultyLevels 
  } = useDifficultyEngine()
  
  const [selectedSubject, setSelectedSubject] = useState<Subject>(currentSubject || 'math')
  const insights = getLearningInsights(ageGroup)
  const subjectPerformance = getSubjectPerformance(selectedSubject)
  const recommendations = getRecommendedActivities(selectedSubject, ageGroup)

  const subjects: Subject[] = ['math', 'reading', 'science', 'art']
  
  const getAccuracy = (subject: Subject) => {
    const perf = getSubjectPerformance(subject)
    return perf.totalAttempts > 0 ? (perf.correctAnswers / perf.totalAttempts) * 100 : 0
  }

  const getDifficultyLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-blue-100 text-blue-800'
      case 3: return 'bg-yellow-100 text-yellow-800'
      case 4: return 'bg-orange-100 text-orange-800'
      case 5: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceTrend = (performance: typeof subjectPerformance) => {
    if (performance.recentPerformanceHistory.length < 2) return 'stable'
    
    const recent = performance.recentPerformanceHistory.slice(-3)
    const average = recent.reduce((sum, score) => sum + score, 0) / recent.length
    const previousAverage = performance.recentPerformanceHistory.slice(-6, -3)
      .reduce((sum, score) => sum + score, 0) / Math.max(1, performance.recentPerformanceHistory.slice(-6, -3).length)
    
    if (average > previousAverage + 5) return 'improving'
    if (average < previousAverage - 5) return 'declining'
    return 'stable'
  }

  const trend = getPerformanceTrend(subjectPerformance)

  return (
    <div className="space-y-4">
      {/* Overall Learning Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Learning Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-body text-sm text-muted-foreground">Overall Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={insights.overallProgress} className="flex-1 h-2" />
                <span className="font-heading text-sm font-semibold">
                  {insights.overallProgress.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-body text-sm text-muted-foreground">Average Level</p>
              <Badge className={getDifficultyLevelColor(Math.round(insights.averageDifficultyLevel))}>
                Level {Math.round(insights.averageDifficultyLevel)}
              </Badge>
            </div>
          </div>
          
          {insights.strongestSubject && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-green-600" weight="fill" />
                <span className="font-heading text-sm font-semibold text-green-800">
                  Strongest: {insights.strongestSubject.charAt(0).toUpperCase() + insights.strongestSubject.slice(1)}
                </span>
              </div>
            </div>
          )}
          
          {insights.subjectsNeedingAttention.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-heading text-sm font-semibold text-yellow-800">
                  Focus on: {insights.subjectsNeedingAttention.join(', ')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-lg">Subject Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className="font-heading text-xs capitalize"
              >
                {subject}
              </Button>
            ))}
          </div>

          {/* Subject Performance Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-semibold capitalize">
                  {selectedSubject} Performance
                </h3>
                <p className="font-body text-xs text-muted-foreground">
                  Current Level: {recommendations.levelName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {trend === 'improving' && <TrendUp className="w-4 h-4 text-green-600" />}
                {trend === 'declining' && <TrendDown className="w-4 h-4 text-red-600" />}
                {trend === 'stable' && <Target className="w-4 h-4 text-blue-600" />}
                <Badge className={getDifficultyLevelColor(subjectPerformance.difficultyLevel)}>
                  Level {subjectPerformance.difficultyLevel}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="space-y-1">
                <p className="font-body text-2xl font-bold text-foreground">
                  {getAccuracy(selectedSubject).toFixed(0)}%
                </p>
                <p className="font-body text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="space-y-1">
                <p className="font-body text-2xl font-bold text-foreground">
                  {subjectPerformance.streak}
                </p>
                <p className="font-body text-xs text-muted-foreground">Current Streak</p>
              </div>
              <div className="space-y-1">
                <p className="font-body text-2xl font-bold text-foreground">
                  {subjectPerformance.bestStreak}
                </p>
                <p className="font-body text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-heading text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Mastered Concepts ({subjectPerformance.masteredConcepts.length})
                </h4>
                {subjectPerformance.masteredConcepts.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {subjectPerformance.masteredConcepts.map((concept, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-xs text-muted-foreground">
                    Keep practicing to master new concepts!
                  </p>
                )}
              </div>

              {subjectPerformance.strugglingConcepts.length > 0 && (
                <div>
                  <h4 className="font-heading text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    Practice Areas ({subjectPerformance.strugglingConcepts.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {subjectPerformance.strugglingConcepts.map((concept, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Adaptive Settings */}
            <div className="bg-muted rounded-lg p-3">
              <h4 className="font-heading text-sm font-semibold mb-2">Current Adaptations</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    subjectPerformance.adaptiveSettings.showHints ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Hints {subjectPerformance.adaptiveSettings.showHints ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    subjectPerformance.adaptiveSettings.extendedTime ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Extended Time {subjectPerformance.adaptiveSettings.extendedTime ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    subjectPerformance.adaptiveSettings.visualSupport ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Visual Support {subjectPerformance.adaptiveSettings.visualSupport ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{recommendations.recommendedSettings.timeLimit}s per question</span>
                </div>
              </div>
            </div>

            {/* Encouragement Message */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
              <p className="font-body text-sm text-foreground text-center">
                "{recommendations.encouragement}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {insights.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="font-body text-sm text-foreground">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
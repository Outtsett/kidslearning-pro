// Progressive difficulty adjustment implementation
import { useKV } from '@github/spark/hooks'
import { useEffect, useCallback } from 'react'
import type { UserProfile, Subject } from '@/App'

interface PerformanceData {
  subject: Subject
  accuracy: number
  timeSpent: number
  hintsUsed: number
  attemptsCount: number
  timestamp: Date
  difficulty: number
}

interface DifficultySettings {
  currentLevel: number
  adaptiveEnabled: boolean
  lastAdjustment: Date
  targetAccuracy: number
  minimumSessions: number
}

/**
 * Hook for managing progressive difficulty adjustment based on child's performance
 */
export function useProgressiveDifficulty(profile: UserProfile | null) {
  const [performanceHistory, setPerformanceHistory] = useKV<PerformanceData[]>('performance-history', [])
  const [difficultySettings, setDifficultySettings] = useKV<Record<Subject, DifficultySettings>>('difficulty-settings', {
    math: { currentLevel: 1, adaptiveEnabled: true, lastAdjustment: new Date(), targetAccuracy: 0.75, minimumSessions: 3 },
    science: { currentLevel: 1, adaptiveEnabled: true, lastAdjustment: new Date(), targetAccuracy: 0.75, minimumSessions: 3 },
    reading: { currentLevel: 1, adaptiveEnabled: true, lastAdjustment: new Date(), targetAccuracy: 0.75, minimumSessions: 3 },
    art: { currentLevel: 1, adaptiveEnabled: true, lastAdjustment: new Date(), targetAccuracy: 0.75, minimumSessions: 3 }
  })

  // Record performance data
  const recordPerformance = useCallback((data: Omit<PerformanceData, 'timestamp'>) => {
    const newEntry: PerformanceData = {
      ...data,
      timestamp: new Date()
    }
    
    setPerformanceHistory(currentHistory => {
      const updated = [...currentHistory, newEntry]
      // Keep only last 50 entries per subject
      const subjectEntries = updated.filter(entry => entry.subject === data.subject)
      if (subjectEntries.length > 50) {
        const otherEntries = updated.filter(entry => entry.subject !== data.subject)
        const recentSubjectEntries = subjectEntries.slice(-50)
        return [...otherEntries, ...recentSubjectEntries]
      }
      return updated
    })
  }, [setPerformanceHistory])

  // Analyze performance and adjust difficulty
  const adjustDifficulty = useCallback((subject: Subject) => {
    const recentSessions = performanceHistory
      .filter(entry => entry.subject === subject)
      .slice(-5) // Last 5 sessions

    if (recentSessions.length < difficultySettings[subject].minimumSessions) {
      return // Not enough data yet
    }

    const averageAccuracy = recentSessions.reduce((sum, session) => sum + session.accuracy, 0) / recentSessions.length
    const averageTime = recentSessions.reduce((sum, session) => sum + session.timeSpent, 0) / recentSessions.length
    const averageHints = recentSessions.reduce((sum, session) => sum + session.hintsUsed, 0) / recentSessions.length

    const currentSettings = difficultySettings[subject]
    let newLevel = currentSettings.currentLevel

    // Decision logic for difficulty adjustment
    if (averageAccuracy > 0.9 && averageHints < 1 && averageTime < 60) {
      // High performance - increase difficulty
      newLevel = Math.min(5, currentSettings.currentLevel + 1)
    } else if (averageAccuracy < 0.5 || averageHints > 3) {
      // Low performance - decrease difficulty
      newLevel = Math.max(1, currentSettings.currentLevel - 1)
    } else if (averageAccuracy > 0.8 && averageTime < 90) {
      // Good performance - slight increase
      newLevel = Math.min(5, currentSettings.currentLevel + 0.5)
    }

    // Update settings if changed
    if (Math.abs(newLevel - currentSettings.currentLevel) > 0.1) {
      setDifficultySettings(currentSettings => ({
        ...currentSettings,
        [subject]: {
          ...currentSettings[subject],
          currentLevel: newLevel,
          lastAdjustment: new Date()
        }
      }))
    }
  }, [performanceHistory, difficultySettings, setDifficultySettings])

  // Get current difficulty level for a subject
  const getDifficultyLevel = useCallback((subject: Subject): number => {
    return difficultySettings[subject]?.currentLevel || 1
  }, [difficultySettings])

  // Get performance insights
  const getPerformanceInsights = useCallback((subject: Subject) => {
    const recentSessions = performanceHistory
      .filter(entry => entry.subject === subject)
      .slice(-10)

    if (recentSessions.length === 0) {
      return {
        trend: 'stable' as const,
        averageAccuracy: 0,
        improvement: 0,
        recommendation: 'Complete a few activities to see insights'
      }
    }

    const firstHalf = recentSessions.slice(0, Math.floor(recentSessions.length / 2))
    const secondHalf = recentSessions.slice(Math.floor(recentSessions.length / 2))

    const firstHalfAccuracy = firstHalf.reduce((sum, s) => sum + s.accuracy, 0) / firstHalf.length
    const secondHalfAccuracy = secondHalf.reduce((sum, s) => sum + s.accuracy, 0) / secondHalf.length

    const improvement = secondHalfAccuracy - firstHalfAccuracy
    const averageAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length

    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    if (improvement > 0.1) trend = 'improving'
    else if (improvement < -0.1) trend = 'declining'

    let recommendation = ''
    if (trend === 'improving') {
      recommendation = 'Great progress! You\'re ready for more challenging activities.'
    } else if (trend === 'declining') {
      recommendation = 'Take your time and use hints when needed. Practice makes perfect!'
    } else {
      recommendation = 'Consistent performance! Try varying activity types for well-rounded learning.'
    }

    return {
      trend,
      averageAccuracy,
      improvement,
      recommendation
    }
  }, [performanceHistory])

  // Auto-adjust difficulties periodically
  useEffect(() => {
    if (!profile || performanceHistory.length === 0) return

    const subjects: Subject[] = ['math', 'science', 'reading', 'art']
    subjects.forEach(subject => {
      const lastAdjustment = new Date(difficultySettings[subject]?.lastAdjustment || 0)
      const daysSinceAdjustment = (Date.now() - lastAdjustment.getTime()) / (1000 * 60 * 60 * 24)
      
      // Adjust every 3 days or after 10 new sessions
      const newSessionsCount = performanceHistory.filter(
        entry => entry.subject === subject && entry.timestamp > lastAdjustment
      ).length

      if (daysSinceAdjustment >= 3 || newSessionsCount >= 10) {
        adjustDifficulty(subject)
      }
    })
  }, [performanceHistory, difficultySettings, adjustDifficulty, profile])

  return {
    recordPerformance,
    adjustDifficulty,
    getDifficultyLevel,
    getPerformanceInsights,
    performanceHistory,
    difficultySettings
  }
}
import { useKV } from '@github/spark/hooks'
import { Subject, AgeGroup } from '@/App'

// Detailed performance tracking for each subject
export interface PerformanceMetrics {
  subject: Subject
  totalAttempts: number
  correctAnswers: number
  averageTimePerQuestion: number // in seconds
  streak: number // current correct answer streak
  bestStreak: number
  difficultyLevel: number // 1-10 scale
  lastSessionAccuracy: number
  recentPerformanceHistory: number[] // last 10 session accuracies
  strugglingConcepts: string[] // specific concepts the child finds difficult
  masteredConcepts: string[] // concepts the child has mastered
  adaptiveSettings: {
    showHints: boolean
    extendedTime: boolean
    simplifiedLanguage: boolean
    visualSupport: boolean
  }
}

// Activity difficulty configuration
export interface DifficultyConfig {
  level: number
  name: string
  description: string
  requiredAccuracy: number // percentage needed to advance
  minSessionsAtLevel: number
  maxTimePerQuestion: number // seconds
  hints: boolean
  visualSupport: 'high' | 'medium' | 'low'
  questionComplexity: 'simple' | 'moderate' | 'complex'
}

// Subject-specific difficulty progression
const DIFFICULTY_LEVELS: Record<Subject, DifficultyConfig[]> = {
  math: [
    { level: 1, name: 'Explorer', description: 'Basic counting and simple patterns', requiredAccuracy: 70, minSessionsAtLevel: 3, maxTimePerQuestion: 30, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 2, name: 'Counter', description: 'Numbers 1-20 and basic shapes', requiredAccuracy: 75, minSessionsAtLevel: 3, maxTimePerQuestion: 25, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 3, name: 'Calculator', description: 'Simple addition and subtraction', requiredAccuracy: 80, minSessionsAtLevel: 3, maxTimePerQuestion: 20, hints: true, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 4, name: 'Problem Solver', description: 'Multi-step problems', requiredAccuracy: 85, minSessionsAtLevel: 4, maxTimePerQuestion: 45, hints: false, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 5, name: 'Math Wizard', description: 'Advanced concepts for age group', requiredAccuracy: 90, minSessionsAtLevel: 5, maxTimePerQuestion: 60, hints: false, visualSupport: 'low', questionComplexity: 'complex' }
  ],
  reading: [
    { level: 1, name: 'Letter Friend', description: 'Letter recognition and sounds', requiredAccuracy: 70, minSessionsAtLevel: 3, maxTimePerQuestion: 20, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 2, name: 'Word Builder', description: 'Simple words and phonics', requiredAccuracy: 75, minSessionsAtLevel: 3, maxTimePerQuestion: 25, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 3, name: 'Story Reader', description: 'Short sentences and comprehension', requiredAccuracy: 80, minSessionsAtLevel: 3, maxTimePerQuestion: 30, hints: true, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 4, name: 'Book Explorer', description: 'Longer texts and analysis', requiredAccuracy: 85, minSessionsAtLevel: 4, maxTimePerQuestion: 45, hints: false, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 5, name: 'Literature Expert', description: 'Complex texts and critical thinking', requiredAccuracy: 90, minSessionsAtLevel: 5, maxTimePerQuestion: 60, hints: false, visualSupport: 'low', questionComplexity: 'complex' }
  ],
  science: [
    { level: 1, name: 'Curious Explorer', description: 'Basic observations and simple facts', requiredAccuracy: 70, minSessionsAtLevel: 3, maxTimePerQuestion: 25, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 2, name: 'Nature Detective', description: 'Animal behaviors and plant life', requiredAccuracy: 75, minSessionsAtLevel: 3, maxTimePerQuestion: 30, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 3, name: 'Lab Assistant', description: 'Simple experiments and cause-effect', requiredAccuracy: 80, minSessionsAtLevel: 3, maxTimePerQuestion: 35, hints: true, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 4, name: 'Science Explorer', description: 'Scientific method and hypotheses', requiredAccuracy: 85, minSessionsAtLevel: 4, maxTimePerQuestion: 50, hints: false, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 5, name: 'Young Scientist', description: 'Complex concepts and research', requiredAccuracy: 90, minSessionsAtLevel: 5, maxTimePerQuestion: 60, hints: false, visualSupport: 'low', questionComplexity: 'complex' }
  ],
  art: [
    { level: 1, name: 'Color Friend', description: 'Basic colors and simple shapes', requiredAccuracy: 70, minSessionsAtLevel: 3, maxTimePerQuestion: 30, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 2, name: 'Pattern Maker', description: 'Patterns and basic techniques', requiredAccuracy: 75, minSessionsAtLevel: 3, maxTimePerQuestion: 35, hints: true, visualSupport: 'high', questionComplexity: 'simple' },
    { level: 3, name: 'Creative Artist', description: 'Composition and color theory', requiredAccuracy: 80, minSessionsAtLevel: 3, maxTimePerQuestion: 40, hints: true, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 4, name: 'Design Expert', description: 'Advanced techniques and styles', requiredAccuracy: 85, minSessionsAtLevel: 4, maxTimePerQuestion: 55, hints: false, visualSupport: 'medium', questionComplexity: 'moderate' },
    { level: 5, name: 'Art Master', description: 'Professional concepts and criticism', requiredAccuracy: 90, minSessionsAtLevel: 5, maxTimePerQuestion: 60, hints: false, visualSupport: 'low', questionComplexity: 'complex' }
  ]
}

// Age-appropriate level caps
const AGE_LEVEL_CAPS: Record<AgeGroup, number> = {
  '3-5': 3,
  '6-9': 4,
  '10-12': 5
}

export function useDifficultyEngine() {
  const [performanceMetrics, setPerformanceMetrics] = useKV<PerformanceMetrics[]>('performance-metrics', [])

  // Get current performance for a subject
  const getSubjectPerformance = (subject: Subject): PerformanceMetrics => {
    const existing = performanceMetrics.find(p => p.subject === subject)
    if (existing) return existing

    // Create default performance metrics
    const defaultMetrics: PerformanceMetrics = {
      subject,
      totalAttempts: 0,
      correctAnswers: 0,
      averageTimePerQuestion: 0,
      streak: 0,
      bestStreak: 0,
      difficultyLevel: 1,
      lastSessionAccuracy: 0,
      recentPerformanceHistory: [],
      strugglingConcepts: [],
      masteredConcepts: [],
      adaptiveSettings: {
        showHints: true,
        extendedTime: false,
        simplifiedLanguage: false,
        visualSupport: true
      }
    }
    return defaultMetrics
  }

  // Record performance data from a completed session
  const recordPerformance = (
    subject: Subject,
    questionsAnswered: number,
    correctAnswers: number,
    totalTimeSpent: number,
    conceptsEncountered: string[],
    ageGroup: AgeGroup
  ) => {
    const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0
    const averageTime = questionsAnswered > 0 ? totalTimeSpent / questionsAnswered : 0

    setPerformanceMetrics((current) => {
      const existing = current.find(p => p.subject === subject)
      const levelCap = AGE_LEVEL_CAPS[ageGroup]

      if (existing) {
        // Update existing metrics
        const updatedStreak = accuracy >= 70 ? existing.streak + 1 : 0
        const recentHistory = [...existing.recentPerformanceHistory, accuracy].slice(-10)
        
        // Calculate if concepts should be marked as mastered or struggling
        const conceptThreshold = 3 // Number of encounters to determine mastery/struggle
        const newMasteredConcepts = [...existing.masteredConcepts]
        const newStrugglingConcepts = [...existing.strugglingConcepts]

        conceptsEncountered.forEach(concept => {
          if (accuracy >= 80 && !newMasteredConcepts.includes(concept)) {
            newMasteredConcepts.push(concept)
            // Remove from struggling if now mastered
            const strugglingIndex = newStrugglingConcepts.indexOf(concept)
            if (strugglingIndex > -1) {
              newStrugglingConcepts.splice(strugglingIndex, 1)
            }
          } else if (accuracy < 60 && !newStrugglingConcepts.includes(concept) && !newMasteredConcepts.includes(concept)) {
            newStrugglingConcepts.push(concept)
          }
        })

        // Determine if difficulty should be adjusted
        const currentLevel = existing.difficultyLevel
        const config = DIFFICULTY_LEVELS[subject][currentLevel - 1]
        const shouldLevelUp = 
          accuracy >= config.requiredAccuracy &&
          recentHistory.length >= config.minSessionsAtLevel &&
          recentHistory.slice(-config.minSessionsAtLevel).every(score => score >= config.requiredAccuracy) &&
          currentLevel < levelCap

        const shouldLevelDown = 
          accuracy < 50 && 
          existing.streak === 0 && 
          recentHistory.length >= 3 &&
          recentHistory.slice(-3).every(score => score < 60) &&
          currentLevel > 1

        const newLevel = shouldLevelUp ? currentLevel + 1 : shouldLevelDown ? currentLevel - 1 : currentLevel

        // Update adaptive settings based on performance
        const adaptiveSettings = {
          showHints: accuracy < 70 || newLevel <= 2,
          extendedTime: averageTime > (config.maxTimePerQuestion * 0.8),
          simplifiedLanguage: ageGroup === '3-5' || accuracy < 60,
          visualSupport: ageGroup === '3-5' || newStrugglingConcepts.length > 0
        }

        const updated: PerformanceMetrics = {
          ...existing,
          totalAttempts: existing.totalAttempts + questionsAnswered,
          correctAnswers: existing.correctAnswers + correctAnswers,
          averageTimePerQuestion: (existing.averageTimePerQuestion + averageTime) / 2,
          streak: updatedStreak,
          bestStreak: Math.max(existing.bestStreak, updatedStreak),
          difficultyLevel: newLevel,
          lastSessionAccuracy: accuracy,
          recentPerformanceHistory: recentHistory,
          strugglingConcepts: newStrugglingConcepts,
          masteredConcepts: newMasteredConcepts,
          adaptiveSettings
        }

        return current.map(p => p.subject === subject ? updated : p)
      } else {
        // Create new performance entry
        const newPerformance: PerformanceMetrics = {
          subject,
          totalAttempts: questionsAnswered,
          correctAnswers,
          averageTimePerQuestion: averageTime,
          streak: accuracy >= 70 ? 1 : 0,
          bestStreak: accuracy >= 70 ? 1 : 0,
          difficultyLevel: 1,
          lastSessionAccuracy: accuracy,
          recentPerformanceHistory: [accuracy],
          strugglingConcepts: accuracy < 60 ? conceptsEncountered : [],
          masteredConcepts: accuracy >= 80 ? conceptsEncountered : [],
          adaptiveSettings: {
            showHints: true,
            extendedTime: ageGroup === '3-5',
            simplifiedLanguage: ageGroup === '3-5',
            visualSupport: true
          }
        }

        return [...current, newPerformance]
      }
    })
  }

  // Get recommended activities based on current performance
  const getRecommendedActivities = (subject: Subject, ageGroup: AgeGroup) => {
    const performance = getSubjectPerformance(subject)
    const currentLevel = performance.difficultyLevel
    const config = DIFFICULTY_LEVELS[subject][currentLevel - 1]

    return {
      currentLevel,
      levelName: config.name,
      levelDescription: config.description,
      recommendedSettings: {
        showHints: performance.adaptiveSettings.showHints,
        timeLimit: config.maxTimePerQuestion,
        visualSupport: performance.adaptiveSettings.visualSupport,
        complexity: config.questionComplexity
      },
      strugglingAreas: performance.strugglingConcepts,
      masteredAreas: performance.masteredConcepts,
      encouragement: generateEncouragement(performance, ageGroup)
    }
  }

  // Generate age-appropriate encouragement based on performance
  const generateEncouragement = (performance: PerformanceMetrics, ageGroup: AgeGroup): string => {
    const accuracy = performance.totalAttempts > 0 ? (performance.correctAnswers / performance.totalAttempts) * 100 : 0
    
    if (accuracy >= 90) {
      return ageGroup === '3-5' ? "You're amazing! Keep being awesome!" :
             ageGroup === '6-9' ? "Outstanding work! You're really mastering this!" :
             "Exceptional performance! You're ready for bigger challenges!"
    } else if (accuracy >= 75) {
      return ageGroup === '3-5' ? "Great job! You're learning so much!" :
             ageGroup === '6-9' ? "Good work! You're making excellent progress!" :
             "Well done! Your skills are really improving!"
    } else if (accuracy >= 60) {
      return ageGroup === '3-5' ? "You're trying so hard! Keep going!" :
             ageGroup === '6-9' ? "You're on the right track! Keep practicing!" :
             "Good effort! Practice makes progress!"
    } else {
      return ageGroup === '3-5' ? "Every try makes you stronger! Let's keep playing!" :
             ageGroup === '6-9' ? "Learning takes time - you're doing great!" :
             "Challenges help us grow! Don't give up!"
    }
  }

  // Get overall learning insights across all subjects
  const getLearningInsights = (ageGroup: AgeGroup) => {
    const allPerformance = performanceMetrics
    const totalAccuracy = allPerformance.length > 0 
      ? allPerformance.reduce((sum, p) => sum + (p.totalAttempts > 0 ? (p.correctAnswers / p.totalAttempts) * 100 : 0), 0) / allPerformance.length
      : 0

    const strongestSubject = allPerformance.reduce((strongest, current) => {
      const currentAccuracy = current.totalAttempts > 0 ? (current.correctAnswers / current.totalAttempts) * 100 : 0
      const strongestAccuracy = strongest.totalAttempts > 0 ? (strongest.correctAnswers / strongest.totalAttempts) * 100 : 0
      return currentAccuracy > strongestAccuracy ? current : strongest
    }, allPerformance[0])

    const needsAttention = allPerformance.filter(p => {
      const accuracy = p.totalAttempts > 0 ? (p.correctAnswers / p.totalAttempts) * 100 : 0
      return accuracy < 60 || p.strugglingConcepts.length > 2
    })

    return {
      overallProgress: totalAccuracy,
      strongestSubject: strongestSubject?.subject,
      subjectsNeedingAttention: needsAttention.map(p => p.subject),
      totalMasteredConcepts: allPerformance.reduce((sum, p) => sum + p.masteredConcepts.length, 0),
      averageDifficultyLevel: allPerformance.length > 0 
        ? allPerformance.reduce((sum, p) => sum + p.difficultyLevel, 0) / allPerformance.length 
        : 1,
      recommendations: generateOverallRecommendations(allPerformance, ageGroup)
    }
  }

  const generateOverallRecommendations = (performance: PerformanceMetrics[], ageGroup: AgeGroup): string[] => {
    const recommendations: string[] = []
    
    const lowPerformanceSubjects = performance.filter(p => {
      const accuracy = p.totalAttempts > 0 ? (p.correctAnswers / p.totalAttempts) * 100 : 0
      return accuracy < 60
    })

    if (lowPerformanceSubjects.length > 0) {
      recommendations.push(`Focus extra time on ${lowPerformanceSubjects.map(p => p.subject).join(', ')} for better results`)
    }

    const highStreakSubjects = performance.filter(p => p.streak >= 3)
    if (highStreakSubjects.length > 0) {
      recommendations.push(`Excellent momentum in ${highStreakSubjects.map(p => p.subject).join(', ')} - try harder challenges!`)
    }

    if (performance.some(p => p.strugglingConcepts.length > 3)) {
      recommendations.push("Consider breaking down difficult concepts into smaller steps")
    }

    return recommendations
  }

  return {
    performanceMetrics,
    getSubjectPerformance,
    recordPerformance,
    getRecommendedActivities,
    getLearningInsights,
    difficultyLevels: DIFFICULTY_LEVELS
  }
}
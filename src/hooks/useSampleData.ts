import { useKV } from '@github/spark/hooks'
import { Subject } from '@/App'

interface SessionData {
  date: string
  subject: Subject
  duration: number
  activitiesCompleted: number
  coinsEarned: number
  accuracy: number
  difficultyLevel: 'easy' | 'medium' | 'hard'
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  score: number
}

// Generate sample session data for demonstration
export function useSampleData() {
  const [, setSessions] = useKV<SessionData[]>('learning-sessions', [])

  const generateSampleSessions = () => {
    const sampleSessions: SessionData[] = []
    const subjects: Subject[] = ['math', 'reading', 'science', 'art']
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']
    const timePeriods: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening']
    const now = new Date()

    // Generate sessions for the last 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // 1-3 sessions per day
      const sessionsPerDay = Math.floor(Math.random() * 3) + 1
      
      for (let j = 0; j < sessionsPerDay; j++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)]
        const duration = Math.floor(Math.random() * 20) + 5 // 5-25 minutes
        const activitiesCompleted = Math.floor(Math.random() * 5) + 1 // 1-5 activities
        const accuracy = Math.floor(Math.random() * 30) + 70 // 70-100% accuracy
        const coinsEarned = Math.floor(accuracy / 10) * 5
        const difficultyLevel = difficulties[Math.floor(Math.random() * difficulties.length)]
        const timeOfDay = timePeriods[Math.floor(Math.random() * timePeriods.length)]
        const score = Math.floor(accuracy * 0.8) + Math.floor(Math.random() * 20) // Score based on accuracy with some variance
        
        sampleSessions.push({
          date: date.toDateString(),
          subject,
          duration,
          activitiesCompleted,
          coinsEarned,
          accuracy,
          difficultyLevel,
          timeOfDay,
          score
        })
      }
    }

    // Sort sessions by date (newest first)
    sampleSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setSessions(sampleSessions)
  }

  return { generateSampleSessions }
}
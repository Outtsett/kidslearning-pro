import { useKV } from '@github/spark/hooks'
import { Subject } from '@/App'

// Generate sample session data for demonstration
export function useSampleData() {
  const [, setSessions] = useKV<any[]>('learning-sessions', [])

  const generateSampleSessions = () => {
    const sampleSessions = []
    const subjects: Subject[] = ['math', 'reading', 'science', 'art']
    const now = new Date()

    // Generate sessions for the last 7 days
    for (let i = 0; i < 7; i++) {
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
        
        sampleSessions.push({
          date: date.toISOString(),
          subject,
          duration,
          activitiesCompleted,
          coinsEarned,
          accuracy
        })
      }
    }

    setSessions(sampleSessions)
  }

  return { generateSampleSessions }
}
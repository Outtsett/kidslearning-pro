import { useKV } from '@github/spark/hooks'
import { Subject } from '@/App'

interface SessionData {
  date: string
  subject: Subject
  duration: number // in minutes
  activitiesCompleted: number
  coinsEarned: number
  accuracy: number // percentage
}

export function useSessionTracking() {
  const [sessions, setSessions] = useKV<SessionData[]>('learning-sessions', [])

  const recordSession = (
    subject: Subject,
    duration: number,
    activitiesCompleted: number = 1,
    coinsEarned: number = 0,
    accuracy: number = 100
  ) => {
    const newSession: SessionData = {
      date: new Date().toISOString(),
      subject,
      duration,
      activitiesCompleted,
      coinsEarned,
      accuracy
    }

    setSessions((currentSessions) => [...currentSessions, newSession])
  }

  return {
    sessions,
    recordSession
  }
}
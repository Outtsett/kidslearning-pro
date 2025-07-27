import { motion } from 'framer-motion'
import type { AgeGroup } from '@/App'

interface CompanionSafeProps {
  ageGroup: AgeGroup
  name: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  activity?: 'idle' | 'celebrating' | 'explaining' | 'waiting'
}

export function CompanionSafe({ 
  ageGroup, 
  name, 
  emotion = 'happy', 
  activity = 'idle' 
}: CompanionSafeProps) {
  const messages = {
    '3-5': `Hi ${name}! I'm your magical friend! Let's play and learn together!`,
    '6-9': `Hey ${name}! I'm your adventure buddy! Ready for some awesome learning quests?`,
    '10-12': `Hello ${name}! I'm your learning guide! Let's tackle some exciting challenges!`
  }

  const message = messages[ageGroup]

  return (
    <motion.div
      className="flex items-center gap-4 p-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
        <span className="text-2xl">
          {ageGroup === '3-5' ? '🐉' : ageGroup === '6-9' ? '🤖' : '🧙‍♂️'}
        </span>
      </div>
      
      <div className="flex-1">
        <div className="bg-white/90 rounded-xl p-3 shadow-lg relative">
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/90"></div>
          <p className="font-body text-sm text-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
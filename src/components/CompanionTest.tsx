import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Companions3D } from '@/components/Companions3D'
import type { AgeGroup } from '@/App'

export function CompanionTest() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('3-5')
  const [emotion, setEmotion] = useState<'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'>('happy')
  const [activity, setActivity] = useState<'idle' | 'celebrating' | 'explaining' | 'waiting'>('idle')

  const emotions = ['happy', 'excited', 'proud', 'encouraging', 'thinking'] as const
  const activities = ['idle', 'celebrating', 'explaining', 'waiting'] as const
  const ageGroups = ['3-5', '6-9', '10-12'] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Character Companion System Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age Group</label>
                <div className="flex gap-2">
                  {ageGroups.map((age) => (
                    <Button
                      key={age}
                      variant={ageGroup === age ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAgeGroup(age)}
                    >
                      {age}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Emotion</label>
                <div className="flex flex-wrap gap-1">
                  {emotions.map((emo) => (
                    <Button
                      key={emo}
                      variant={emotion === emo ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEmotion(emo)}
                    >
                      {emo}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Activity</label>
                <div className="flex flex-wrap gap-1">
                  {activities.map((act) => (
                    <Button
                      key={act}
                      variant={activity === act ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivity(act)}
                    >
                      {act}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D Companion Display */}
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-dashed border-purple-200">
              <CardContent className="p-6 flex justify-center">
                <Companions3D
                  ageGroup={ageGroup}
                  name="Test User"
                  emotion={emotion}
                  activity={activity}
                />
              </CardContent>
            </Card>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">3D Features Tested:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✨ AI-generated personality traits and dialogue</li>
                <li>🎭 Framer Motion smooth animations</li>
                <li>🎮 React Three Fiber 3D character movement</li>
                <li>🎨 3D cartoon characters with Three.js</li>
                <li>🌟 Floating 3D background elements</li>
                <li>💫 Emotion-based 3D visual effects</li>
                <li>🤖 Age-appropriate 3D character selection</li>
                <li>🎪 Interactive 3D environment with lighting</li>
                <li>🌈 Real-time 3D animations and physics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Volume2, CheckCircle, Star, Leaf } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile } from '@/App'
import { toast } from 'sonner'

interface NatureNookProps {
  profile: UserProfile
  onComplete: (score: number) => void
  onBack: () => void
}

interface NatureActivity {
  id: string
  type: 'animal-sounds' | 'weather-match' | 'plant-growth' | 'habitat-match'
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  visual: string
  sound?: string
}

const NATURE_ACTIVITIES: NatureActivity[] = [
  {
    id: '1',
    type: 'animal-sounds',
    question: 'What sound does a cow make?',
    options: ['Moo', 'Woof', 'Meow', 'Quack'],
    correctAnswer: 'Moo',
    explanation: 'Cows say "Moo"! They live on farms and give us milk.',
    visual: '🐄',
    sound: 'moo'
  },
  {
    id: '2',
    type: 'animal-sounds',
    question: 'What sound does a duck make?',
    options: ['Chirp', 'Roar', 'Quack', 'Hiss'],
    correctAnswer: 'Quack',
    explanation: 'Ducks say "Quack"! They love swimming in ponds and lakes.',
    visual: '🦆',
    sound: 'quack'
  },
  {
    id: '3',
    type: 'weather-match',
    question: 'What do you wear when it\'s raining?',
    options: ['Sunglasses', 'Raincoat', 'Shorts', 'Sandals'],
    correctAnswer: 'Raincoat',
    explanation: 'We wear raincoats to stay dry when it rains! Rain helps plants grow.',
    visual: '🌧️',
  },
  {
    id: '4',
    type: 'weather-match',
    question: 'What do you see in the sky when it\'s sunny?',
    options: ['Moon', 'Stars', 'Sun', 'Clouds'],
    correctAnswer: 'Sun',
    explanation: 'The sun shines bright and gives us light and warmth!',
    visual: '☀️',
  },
  {
    id: '5',
    type: 'plant-growth',
    question: 'What do plants need to grow?',
    options: ['Candy', 'Water', 'Toys', 'Books'],
    correctAnswer: 'Water',
    explanation: 'Plants need water, sunlight, and soil to grow big and strong!',
    visual: '🌱',
  },
  {
    id: '6',
    type: 'habitat-match',
    question: 'Where do fish live?',
    options: ['Trees', 'Caves', 'Water', 'Sky'],
    correctAnswer: 'Water',
    explanation: 'Fish live in water! They can be in oceans, rivers, or ponds.',
    visual: '🐠',
  }
]

const ENCOURAGEMENT_MESSAGES = [
  "You're such a great nature explorer!",
  "Amazing discovery!",
  "You know so much about nature!",
  "What a smart little scientist!",
  "Keep exploring, you're doing great!",
  "Nature loves curious kids like you!"
]

export function NatureNook({ profile, onComplete, onBack }: NatureNookProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [soundPlaying, setSoundPlaying] = useState(false)

  const currentActivity = NATURE_ACTIVITIES[currentActivityIndex]
  const progress = ((currentActivityIndex + 1) / NATURE_ACTIVITIES.length) * 100

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  }

  const playAnimalSound = () => {
    setSoundPlaying(true)
    // Simulate sound playing
    setTimeout(() => setSoundPlaying(false), 1000)
    
    if (currentActivity.sound) {
      toast.success(`Playing ${currentActivity.sound} sound! 🔊`)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === currentActivity.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      toast.success("Correct! Great job! 🎉")
    } else {
      toast.error("Not quite! Let's learn together! 😊")
    }
  }

  const handleNextActivity = () => {
    if (currentActivityIndex < NATURE_ACTIVITIES.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
    } else {
      handleCompleteActivities()
    }
  }

  const handleCompleteActivities = () => {
    setCompleted(true)
    setTimeout(() => {
      onComplete(score)
    }, 2000)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🌟</div>
            <CardTitle className="font-heading text-2xl font-bold text-green-800">
              Amazing Nature Explorer!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarDisplay avatar={profile.avatar} size="large" className="mx-auto" />
              <div className="text-4xl">🐻</div>
              <p className="font-body text-lg text-green-700">
                "Wow, {profile.name}! You discovered so much about nature today! 
                You got {score} out of {NATURE_ACTIVITIES.length} discoveries!"
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" weight="fill" />
                <span className="font-heading text-lg font-semibold text-green-800">
                  Nature Discovery Badge Earned!
                </span>
              </div>
              <Progress value={(score / NATURE_ACTIVITIES.length) * 100} className="h-3 bg-green-200" />
              <div className="flex justify-center gap-4 text-sm text-green-600">
                <span>🐄 Animal Sounds</span>
                <span>🌧️ Weather</span>
                <span>🌱 Plants</span>
                <span>🏠 Habitats</span>
              </div>
            </div>

            <Button onClick={onBack} className="w-full font-heading bg-green-600 hover:bg-green-700">
              Continue Exploring
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600" weight="fill" />
              <div>
                <h1 className="font-heading text-xl font-bold text-green-800">
                  Nature Nook
                </h1>
                <p className="font-body text-sm text-green-600">
                  Discovery {currentActivityIndex + 1} of {NATURE_ACTIVITIES.length}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="small" />
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                <span className="font-body text-sm font-medium">{score}</span>
              </div>
              <span className="font-body text-xs text-muted-foreground">discoveries</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-green-700">Nature Discovery Progress</span>
              <span className="font-body text-sm text-green-700">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-green-100" />
          </CardContent>
        </Card>

        {/* Avatar Companion */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🐻</div>
              <div className="flex-1">
                <p className="font-body text-lg text-blue-800">
                  {showFeedback 
                    ? isCorrect 
                      ? `"${getRandomEncouragement()} ${currentActivity.explanation}"`
                      : `"That's okay! ${currentActivity.explanation} Let's try again!"`
                    : `"Look at this fun nature question, ${profile.name}! Take your time and think about it."`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Activity */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-8xl mb-4">{currentActivity.visual}</div>
            <CardTitle className="font-heading text-2xl font-semibold text-center">
              {currentActivity.question}
            </CardTitle>
            {currentActivity.sound && (
              <Button
                variant="outline"
                size="lg"
                onClick={playAnimalSound}
                disabled={soundPlaying}
                className="mx-auto font-heading"
              >
                <Volume2 className="w-5 h-5 mr-2" weight="fill" />
                {soundPlaying ? 'Playing...' : 'Hear the Sound!'}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentActivity.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`h-20 text-xl font-heading ${
                    showFeedback && option === currentActivity.correctAnswer
                      ? 'ring-2 ring-green-500 bg-green-100 text-green-800'
                      : showFeedback && selectedAnswer === option && !isCorrect
                      ? 'ring-2 ring-red-500 bg-red-100 text-red-800'
                      : ''
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="font-heading px-8 bg-green-600 hover:bg-green-700"
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextActivity}
                  size="lg"
                  className="font-heading px-8 bg-blue-600 hover:bg-blue-700"
                >
                  {currentActivityIndex < NATURE_ACTIVITIES.length - 1 ? (
                    <>Next Discovery</>
                  ) : (
                    <>Complete Nature Nook <CheckCircle className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fun Nature Fact */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <p className="font-body text-yellow-800">
              <span className="font-semibold">Fun Fact:</span> {' '}
              {currentActivity.type === 'animal-sounds' && "Did you know animals make different sounds to talk to each other? Just like how we use words!"}
              {currentActivity.type === 'weather-match' && "Weather changes help plants and animals know what season it is!"}
              {currentActivity.type === 'plant-growth' && "Plants are like nature's food makers - they turn sunlight into energy!"}
              {currentActivity.type === 'habitat-match' && "Every animal has a special home that gives them everything they need!"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
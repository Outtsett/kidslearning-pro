import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Star, Coins } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile, Subject } from '@/App'
import { useSessionTracking } from '@/hooks/useSessionTracking'
import { toast } from 'sonner'

interface LearningActivityProps {
  subject: Subject
  activityId: string
  profile: UserProfile
  onComplete: (coinsEarned: number) => void
  onBack: () => void
}

interface Question {
  id: string
  question: string
  options?: string[]
  correctAnswer: string
  type: 'multiple-choice' | 'input' | 'drag-drop'
  explanation?: string
}

const SAMPLE_ACTIVITIES: Record<string, Question[]> = {
  'counting-1-10': [
    {
      id: '1',
      question: 'How many apples do you see? 🍎🍎🍎',
      options: ['1', '2', '3', '4'],
      correctAnswer: '3',
      type: 'multiple-choice',
      explanation: 'Great job! There are 3 apples. Count them: 1, 2, 3!'
    },
    {
      id: '2',
      question: 'Count the stars: ⭐⭐⭐⭐⭐',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      type: 'multiple-choice',
      explanation: 'Excellent! You counted 5 stars perfectly!'
    },
    {
      id: '3',
      question: 'How many fingers are on one hand? ✋',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      type: 'multiple-choice',
      explanation: 'Perfect! One hand has 5 fingers!'
    }
  ],
  'addition-basic': [
    {
      id: '1',
      question: 'What is 2 + 3?',
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      type: 'multiple-choice',
      explanation: 'Great! 2 + 3 = 5. You can count: 2, then add 3 more!'
    },
    {
      id: '2',
      question: 'If you have 4 toys and get 2 more, how many do you have?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '6',
      type: 'multiple-choice',
      explanation: 'Awesome! 4 + 2 = 6 toys in total!'
    }
  ],
  'animals-sounds': [
    {
      id: '1',
      question: 'What sound does a cow make?',
      options: ['Woof', 'Meow', 'Moo', 'Roar'],
      correctAnswer: 'Moo',
      type: 'multiple-choice',
      explanation: 'That\'s right! Cows say "Moo"! 🐄'
    },
    {
      id: '2',
      question: 'What sound does a cat make?',
      options: ['Bark', 'Meow', 'Quack', 'Chirp'],
      correctAnswer: 'Meow',
      type: 'multiple-choice',
      explanation: 'Perfect! Cats say "Meow"! 🐱'
    }
  ]
}

const ENCOURAGEMENT_MESSAGES = [
  "You're doing amazing!",
  "Great job, keep going!",
  "You're so smart!",
  "Fantastic work!",
  "You're a star learner!",
  "Keep up the great work!",
  "You're getting better every day!",
  "What a brilliant mind you have!"
]

export function LearningActivity({ subject, activityId, profile, onComplete, onBack }: LearningActivityProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [startTime] = useState(Date.now())
  const { recordSession } = useSessionTracking()

  const questions = SAMPLE_ACTIVITIES[activityId] || SAMPLE_ACTIVITIES['counting-1-10']
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      toast.success("Correct! 🎉")
    } else {
      toast.error("Try again! You've got this! 💪")
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
    } else {
      handleCompleteActivity()
    }
  }

  const handleCompleteActivity = () => {
    setCompleted(true)
    const percentage = (score / questions.length) * 100
    const coinsEarned = Math.max(10, Math.floor(percentage / 10) * 5)
    const duration = Math.round((Date.now() - startTime) / 60000) // Convert to minutes
    
    // Record the learning session
    recordSession(subject, Math.max(1, duration), questions.length, coinsEarned, percentage)
    
    setTimeout(() => {
      onComplete(coinsEarned)
      toast.success(`Activity completed! You earned ${coinsEarned} coins! 🪙`)
    }, 2000)
  }

  if (completed) {
    const percentage = (score / questions.length) * 100
    const coinsEarned = Math.max(10, Math.floor(percentage / 10) * 5)

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-lavender/20 to-secondary/20 p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="font-heading text-2xl font-bold text-foreground">
              Amazing Work, {profile.name}!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarDisplay avatar={profile.avatar} size="large" className="mx-auto" />
              <div className="text-4xl">😊</div>
              <p className="font-body text-lg text-foreground">
                "{getRandomEncouragement()}"
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" weight="fill" />
                <span className="font-heading text-lg font-semibold">
                  You got {score} out of {questions.length} correct!
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" weight="fill" />
                <span className="font-heading text-lg font-semibold">
                  Earned {coinsEarned} coins!
                </span>
              </div>
              <Progress value={percentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {percentage.toFixed(0)}% Score
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-body text-muted-foreground">
                Keep learning to unlock more awesome items!
              </p>
              <Button onClick={onBack} className="w-full font-heading">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-lavender/20 to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground capitalize">
                {subject} Activity
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="small" />
            <Badge variant="outline">
              Score: {score}/{questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-muted-foreground">Progress</span>
              <span className="font-body text-sm text-muted-foreground">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Avatar Companion */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">😊</div>
              <div className="flex-1">
                <p className="font-body text-lg text-foreground">
                  {showFeedback 
                    ? isCorrect 
                      ? `"${getRandomEncouragement()} ${currentQuestion.explanation}"`
                      : `"Don't worry! ${currentQuestion.explanation} Try again!"`
                    : `"Take your time with this question, ${profile.name}. You've got this!"`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl font-semibold text-center">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className={`h-16 text-lg font-heading ${
                      showFeedback && option === currentQuestion.correctAnswer
                        ? 'ring-2 ring-green-500 bg-green-100'
                        : showFeedback && selectedAnswer === option && !isCorrect
                        ? 'ring-2 ring-red-500 bg-red-100'
                        : ''
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="font-heading px-8"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  size="lg"
                  className="font-heading px-8"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>Next Question</>
                  ) : (
                    <>Complete Activity <CheckCircle className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Star, Coins, Lightbulb, Clock } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { ReadingRealm } from '@/components/reading/ReadingRealm'
import { ScienceSafari } from '@/components/science/ScienceSafari'
import { AIAnimationSystem, useAIAnimation } from '@/components/AIAnimationSystem'
import { useDifficultyEngine } from '@/hooks/useDifficultyEngine'
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
  concept: string // The learning concept this question tests
  difficultyLevel: number // 1-5 scale
  timeLimit?: number // seconds
}

const SAMPLE_ACTIVITIES: Record<string, Question[]> = {
  'counting-1-10': [
    {
      id: '1',
      question: 'How many apples do you see? 🍎🍎🍎',
      options: ['1', '2', '3', '4'],
      correctAnswer: '3',
      type: 'multiple-choice',
      explanation: 'Great job! There are 3 apples. Count them: 1, 2, 3!',
      concept: 'counting_small_numbers',
      difficultyLevel: 1,
      timeLimit: 30
    },
    {
      id: '2',
      question: 'Count the stars: ⭐⭐⭐⭐⭐',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      type: 'multiple-choice',
      explanation: 'Excellent! You counted 5 stars perfectly!',
      concept: 'counting_small_numbers',
      difficultyLevel: 1,
      timeLimit: 30
    },
    {
      id: '3',
      question: 'How many fingers are on one hand? ✋',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      type: 'multiple-choice',
      explanation: 'Perfect! One hand has 5 fingers!',
      concept: 'number_recognition',
      difficultyLevel: 2,
      timeLimit: 25
    }
  ],
  'addition-basic': [
    {
      id: '1',
      question: 'What is 2 + 3?',
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      type: 'multiple-choice',
      explanation: 'Great! 2 + 3 = 5. You can count: 2, then add 3 more!',
      concept: 'basic_addition',
      difficultyLevel: 2,
      timeLimit: 30
    },
    {
      id: '2',
      question: 'If you have 4 toys and get 2 more, how many do you have?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '6',
      type: 'multiple-choice',
      explanation: 'Awesome! 4 + 2 = 6 toys in total!',
      concept: 'word_problems',
      difficultyLevel: 3,
      timeLimit: 45
    }
  ],
  'animals-sounds': [
    {
      id: '1',
      question: 'What sound does a cow make?',
      options: ['Woof', 'Meow', 'Moo', 'Roar'],
      correctAnswer: 'Moo',
      type: 'multiple-choice',
      explanation: 'That\'s right! Cows say "Moo"! 🐄',
      concept: 'animal_sounds',
      difficultyLevel: 1,
      timeLimit: 20
    },
    {
      id: '2',
      question: 'What sound does a cat make?',
      options: ['Bark', 'Meow', 'Quack', 'Chirp'],
      correctAnswer: 'Meow',
      type: 'multiple-choice',
      explanation: 'Perfect! Cats say "Meow"! 🐱',
      concept: 'animal_sounds',
      difficultyLevel: 1,
      timeLimit: 20
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
  // If this is a reading activity, use the Reading Realm
  if (subject === 'reading') {
    return (
      <ReadingRealm
        profile={profile}
        onComplete={onComplete}
        onBack={onBack}
      />
    )
  }

  // If this is a science activity, use the Science Safari
  if (subject === 'science') {
    return (
      <ScienceSafari
        profile={profile}
        onComplete={onComplete}
        onBack={onBack}
      />
    )
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [startTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [questionTimes, setQuestionTimes] = useState<number[]>([])
  
  const { recordSession } = useSessionTracking()
  const { trigger, triggerAnimation } = useAIAnimation()
  const { 
    getSubjectPerformance, 
    getRecommendedActivities, 
    recordPerformance 
  } = useDifficultyEngine()

  const questions = SAMPLE_ACTIVITIES[activityId] || SAMPLE_ACTIVITIES['counting-1-10']
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  
  // Get adaptive settings for current subject
  const subjectPerformance = getSubjectPerformance(subject)
  const recommendations = getRecommendedActivities(subject, profile.ageGroup)
  const shouldShowHints = subjectPerformance.adaptiveSettings.showHints
  const timeLimit = currentQuestion.timeLimit || recommendations.recommendedSettings.timeLimit

  // Timer effect
  useEffect(() => {
    if (timeLimit && !showFeedback && !completed) {
      setTimeRemaining(timeLimit)
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev <= 1) {
            // Time's up - auto submit if there's a selected answer, otherwise mark as incorrect
            if (selectedAnswer) {
              handleSubmitAnswer()
            } else {
              handleTimeUp()
            }
            return null
          }
          return prev ? prev - 1 : null
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestionIndex, showFeedback, completed, timeLimit])

  // Reset question start time when moving to next question
  useEffect(() => {
    setQuestionStartTime(Date.now())
    setShowHint(false)
  }, [currentQuestionIndex])

  const handleTimeUp = () => {
    setIsCorrect(false)
    setShowFeedback(true)
    triggerAnimation('time_up', 'encouraging')
    toast.error("Time's up! Don't worry, keep trying! ⏰")
  }

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer
    const timeSpent = (Date.now() - questionStartTime) / 1000 // Convert to seconds
    
    setQuestionTimes((prev) => [...prev, timeSpent])
    setIsCorrect(correct)
    setShowFeedback(true)
    setTimeRemaining(null) // Stop timer
    
    if (correct) {
      setScore(score + 1)
      triggerAnimation('correct_answer', 'proud')
      toast.success("Correct! 🎉")
    } else {
      triggerAnimation('wrong_answer', 'encouraging')
      toast.error("Try again! You've got this! 💪")
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
      setTimeRemaining(null)
    } else {
      handleCompleteActivity()
    }
  }

  const handleCompleteActivity = () => {
    setCompleted(true)
    triggerAnimation('achievement', 'excited')
    const percentage = (score / questions.length) * 100
    const coinsEarned = Math.max(10, Math.floor(percentage / 10) * 5)
    const totalDuration = Math.round((Date.now() - startTime) / 60000) // Convert to minutes
    const totalTimeSpent = questionTimes.reduce((sum, time) => sum + time, 0)
    const conceptsEncountered = questions.map(q => q.concept)
    
    // Record performance for difficulty adjustment
    recordPerformance(
      subject,
      questions.length,
      score,
      totalTimeSpent,
      conceptsEncountered,
      profile.ageGroup
    )
    
    // Record the learning session for tracking
    recordSession(subject, Math.max(1, totalDuration), questions.length, coinsEarned, percentage)
    
    setTimeout(() => {
      onComplete(coinsEarned)
      toast.success(`Activity completed! You earned ${coinsEarned} coins! 🪙`)
    }, 2000)
  }

  const handleShowHint = () => {
    setShowHint(true)
    triggerAnimation('hint_shown', 'helpful')
  }

  if (completed) {
    const percentage = (score / questions.length) * 100
    const coinsEarned = Math.max(10, Math.floor(percentage / 10) * 5)

    return (
      <AIAnimationSystem
        ageGroup={profile.ageGroup}
        subject={subject}
        userProgress={100}
        emotion="proud"
        trigger="celebration"
      >
        <div className="h-screen bg-gradient-to-br from-primary/20 via-lavender/20 to-secondary/20 p-4 flex items-center justify-center overflow-hidden">
          <Card className="max-w-md w-full text-center">
            <CardHeader className="pb-3">
              <div className="text-4xl mb-2">🎉</div>
              <CardTitle className="font-heading text-xl font-bold text-foreground">
                Amazing Work, {profile.name}!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <AvatarDisplay avatar={profile.avatar} size="medium" className="mx-auto" />
                <div className="text-2xl">😊</div>
                <p className="font-body text-sm text-foreground">
                  "{getRandomEncouragement()}"
                </p>
              </div>

              <div className="bg-muted rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                  <span className="font-heading text-sm font-semibold">
                    {score}/{questions.length} correct!
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-600" weight="fill" />
                  <span className="font-heading text-sm font-semibold">
                    +{coinsEarned} coins!
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {percentage.toFixed(0)}% Score
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs text-muted-foreground">
                  Keep learning to unlock more awesome items!
                </p>
                <Button onClick={onBack} className="w-full font-heading">
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AIAnimationSystem>
    )
  }

  return (
    <AIAnimationSystem
      ageGroup={profile.ageGroup}
      subject={subject}
      userProgress={progress}
      emotion={isCorrect ? 'proud' : showFeedback && !isCorrect ? 'encouraging' : 'happy'}
      trigger={trigger.type}
    >
      <div className="h-screen bg-gradient-to-br from-primary/20 via-lavender/20 to-secondary/20 overflow-hidden">
        <div className="h-full flex flex-col p-3">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between bg-white/80 rounded-2xl p-3 shadow-lg mb-3">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="font-heading text-lg font-bold text-foreground capitalize">
                  {subject} Activity
                </h1>
                <p className="font-body text-xs text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length} • Level {subjectPerformance.difficultyLevel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AvatarDisplay avatar={profile.avatar} size="small" />
              <Badge variant="outline" className="text-xs">
                {score}/{questions.length}
              </Badge>
              {timeRemaining !== null && (
                <Badge variant={timeRemaining <= 10 ? "destructive" : "secondary"} className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {timeRemaining}s
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="mb-3">
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body text-xs text-muted-foreground">Progress</span>
              <span className="font-body text-xs text-muted-foreground">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
          </Card>

          {/* Main Content - Flexible */}
          <div className="flex-1 min-h-0 space-y-3">
          {/* Companion Message */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">😊</div>
                <div className="flex-1">
                  <p className="font-body text-sm text-foreground">
                    {showFeedback 
                      ? isCorrect 
                        ? `"${getRandomEncouragement()} ${currentQuestion.explanation}"`
                        : `"Don't worry! ${currentQuestion.explanation} Try again!"`
                      : `"Take your time, ${profile.name}. You've got this!"`
                    }
                  </p>
                  {shouldShowHints && !showFeedback && !showHint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShowHint}
                      className="mt-1 h-6 text-xs p-1"
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Need a hint?
                    </Button>
                  )}
                  {showHint && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      💡 <strong>Hint:</strong> {currentQuestion.explanation?.split('.')[0] || "Think about what you know!"}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-semibold text-center">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              {/* Multiple Choice Options */}
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showFeedback}
                      className={`h-full text-base font-heading ${
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

              {/* Action Button */}
              <div className="flex justify-center">
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    size="lg"
                    className="font-heading px-6"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    size="lg"
                    className="font-heading px-6"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      "Next Question"
                    ) : (
                      <span>Complete <CheckCircle className="w-4 h-4 ml-2" /></span>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </AIAnimationSystem>
  )
}
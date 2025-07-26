import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, Star, Volume2, Lightbulb, Target } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile } from '@/App'
import { toast } from 'sonner'

interface GrammarGalaxyProps {
  profile: UserProfile
  onComplete: (coinsEarned: number) => void
  onBack: () => void
}

interface GrammarActivity {
  id: string
  type: 'sentence-fix' | 'word-choice' | 'paragraph-build' | 'reading-quest'
  title: string
  content: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty: number
  points: number
}

const GRAMMAR_ACTIVITIES: GrammarActivity[] = [
  {
    id: '1',
    type: 'sentence-fix',
    title: 'Fix the Sentence',
    content: 'the cat is sleeping on the couch',
    options: [
      'the cat is sleeping on the couch',
      'The cat is sleeping on the couch.',
      'The Cat Is Sleeping On The Couch.',
      'THE CAT IS SLEEPING ON THE COUCH'
    ],
    correctAnswer: 'The cat is sleeping on the couch.',
    explanation: 'Sentences start with a capital letter and end with a period!',
    difficulty: 1,
    points: 10
  },
  {
    id: '2',
    type: 'word-choice',
    title: 'Choose the Right Word',
    content: 'I can _____ three birds in the tree.',
    options: ['see', 'sea', 'c', 'bee'],
    correctAnswer: 'see',
    explanation: '"See" means to look at something with your eyes. "Sea" is a large body of water.',
    difficulty: 1,
    points: 10
  },
  {
    id: '3',
    type: 'sentence-fix',
    title: 'Fix the Sentence',
    content: 'my friend and me went to the park yesterday',
    options: [
      'my friend and me went to the park yesterday',
      'My friend and I went to the park yesterday.',
      'My friend and me went to the park yesterday.',
      'me and my friend went to the park yesterday.'
    ],
    correctAnswer: 'My friend and I went to the park yesterday.',
    explanation: 'Use "I" (not "me") when you are the subject of the sentence, and always capitalize the first word!',
    difficulty: 2,
    points: 15
  },
  {
    id: '4',
    type: 'word-choice',
    title: 'Choose the Right Word',
    content: 'The library has many interesting _____ to read.',
    options: ['book', 'books', 'bookes', 'booking'],
    correctAnswer: 'books',
    explanation: 'When there are many of something, we use the plural form. "Book" becomes "books"!',
    difficulty: 2,
    points: 15
  },
  {
    id: '5',
    type: 'paragraph-build',
    title: 'Build a Paragraph',
    content: 'Arrange these sentences to make a good paragraph about making cookies:',
    options: [
      'First, we mixed flour, sugar, and eggs in a bowl. Then, we rolled the dough into small balls. Next, we baked them in the oven for 12 minutes. Finally, we enjoyed our delicious homemade cookies!',
      'Finally, we enjoyed our delicious homemade cookies! First, we mixed flour, sugar, and eggs in a bowl. Next, we baked them in the oven for 12 minutes. Then, we rolled the dough into small balls.',
      'Then, we rolled the dough into small balls. Finally, we enjoyed our delicious homemade cookies! First, we mixed flour, sugar, and eggs in a bowl. Next, we baked them in the oven for 12 minutes.',
      'Next, we baked them in the oven for 12 minutes. Then, we rolled the dough into small balls. Finally, we enjoyed our delicious homemade cookies! First, we mixed flour, sugar, and eggs in a bowl.'
    ],
    correctAnswer: 'First, we mixed flour, sugar, and eggs in a bowl. Then, we rolled the dough into small balls. Next, we baked them in the oven for 12 minutes. Finally, we enjoyed our delicious homemade cookies!',
    explanation: 'Good paragraphs follow a logical order: First, Then, Next, Finally. This helps readers follow the steps!',
    difficulty: 3,
    points: 20
  },
  {
    id: '6',
    type: 'reading-quest',
    title: 'Reading Quest: Find the Main Idea',
    content: 'Read this passage and find the main idea: "Dolphins are amazing sea animals. They are very smart and can learn tricks. Dolphins live in groups called pods. They use clicks and whistles to talk to each other. Dolphins are also very friendly to humans and often help people in the ocean."',
    options: [
      'Dolphins live in the ocean',
      'Dolphins are amazing and intelligent sea animals',
      'Dolphins can do tricks',
      'Dolphins make clicking sounds'
    ],
    correctAnswer: 'Dolphins are amazing and intelligent sea animals',
    explanation: 'The main idea includes the most important point that covers the whole passage. All the details support that dolphins are amazing and intelligent!',
    difficulty: 3,
    points: 25
  },
  {
    id: '7',
    type: 'word-choice',
    title: 'Advanced Word Choice',
    content: 'The scientist made an important _____ that could help save the environment.',
    options: ['discovery', 'recovery', 'grocery', 'mystery'],
    correctAnswer: 'discovery',
    explanation: 'A "discovery" is when someone finds or learns something new. This fits perfectly with what a scientist would make!',
    difficulty: 4,
    points: 20
  },
  {
    id: '8',
    type: 'sentence-fix',
    title: 'Complex Sentence Fix',
    content: 'Although it was raining outside sarah decided to go for a walk because she needed fresh air',
    options: [
      'Although it was raining outside sarah decided to go for a walk because she needed fresh air',
      'Although it was raining outside, Sarah decided to go for a walk because she needed fresh air.',
      'although it was raining outside, Sarah decided to go for a walk because she needed fresh air.',
      'Although it was raining outside Sarah decided to go for a walk, because she needed fresh air.'
    ],
    correctAnswer: 'Although it was raining outside, Sarah decided to go for a walk because she needed fresh air.',
    explanation: 'Complex sentences need commas to separate clauses, capital letters for names, and end punctuation!',
    difficulty: 4,
    points: 25
  }
]

const GRAMMAR_TIPS = [
  "Read each sentence out loud to hear if it sounds right!",
  "Look for capital letters at the beginning of sentences!",
  "Don't forget punctuation at the end!",
  "Think about the meaning of each word choice!",
  "When in doubt, pick the simplest, clearest option!",
  "Practice makes perfect - keep trying!"
]

const DIFFICULTY_LEVELS = {
  1: { name: 'Beginner', color: 'text-green-600', icon: '🌱' },
  2: { name: 'Developing', color: 'text-blue-600', icon: '🌿' },
  3: { name: 'Skilled', color: 'text-purple-600', icon: '🌟' },
  4: { name: 'Advanced', color: 'text-red-600', icon: '🚀' }
}

export function GrammarGalaxy({ profile, onComplete, onBack }: GrammarGalaxyProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeSpent, setTimeSpent] = useState<number[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [showHint, setShowHint] = useState(false)
  
  const currentActivity = GRAMMAR_ACTIVITIES[currentActivityIndex]
  const progress = ((currentActivityIndex + 1) / GRAMMAR_ACTIVITIES.length) * 100
  const difficultyInfo = DIFFICULTY_LEVELS[currentActivity.difficulty as keyof typeof DIFFICULTY_LEVELS]

  // Adaptive difficulty based on profile progress and performance
  const getFilteredActivities = () => {
    const readingProgress = profile.progress.reading || 0
    const avgTimePerQuestion = timeSpent.length > 0 ? timeSpent.reduce((a, b) => a + b, 0) / timeSpent.length : 30000
    const currentAccuracy = score / Math.max(currentActivityIndex, 1)
    
    let maxDifficulty = 2
    if (readingProgress > 50 && currentAccuracy > 0.7) maxDifficulty = 3
    if (readingProgress > 75 && currentAccuracy > 0.8 && avgTimePerQuestion < 45000) maxDifficulty = 4
    
    return GRAMMAR_ACTIVITIES.filter(activity => activity.difficulty <= maxDifficulty)
  }

  const speak = (text: string, rate: number = 0.8) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = 1.0
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    setStartTime(Date.now())
    setTimeout(() => {
      speak(`${currentActivity.title}. ${currentActivity.type === 'reading-quest' ? 'Read carefully and find the answer!' : 'Choose the best option!'}`)
    }, 500)
  }, [currentActivityIndex])

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    const timeForThisQuestion = Date.now() - startTime
    setTimeSpent([...timeSpent, timeForThisQuestion])
    
    const correct = selectedAnswer === currentActivity.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      setTotalPoints(totalPoints + currentActivity.points)
      
      // Bonus points for speed and difficulty
      const speedBonus = timeForThisQuestion < 30000 ? Math.floor(currentActivity.points * 0.2) : 0
      const difficultyBonus = currentActivity.difficulty * 2
      setTotalPoints(prev => prev + speedBonus + difficultyBonus)
      
      toast.success(`Excellent! +${currentActivity.points + speedBonus + difficultyBonus} points! 🎉`)
      speak(`Excellent! ${currentActivity.explanation}`)
    } else {
      toast.error("Not quite right. Think about it again!")
      speak(`Not quite right. ${currentActivity.explanation}`)
    }
  }

  const handleNextActivity = () => {
    const filteredActivities = getFilteredActivities()
    if (currentActivityIndex < filteredActivities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
      setIsCorrect(false)
      setShowHint(false)
    } else {
      handleCompleteActivity()
    }
  }

  const handleCompleteActivity = () => {
    setCompleted(true)
    const filteredActivities = getFilteredActivities()
    const accuracy = (score / filteredActivities.length) * 100
    const avgTime = timeSpent.reduce((a, b) => a + b, 0) / timeSpent.length / 1000 // in seconds
    const coinsEarned = Math.max(25, Math.floor(totalPoints / 10))
    
    setTimeout(() => {
      speak(`Congratulations! You completed Grammar Galaxy with ${accuracy.toFixed(0)}% accuracy!`)
      onComplete(coinsEarned)
      toast.success(`Galaxy conquered! You earned ${coinsEarned} coins! 🪙`)
    }, 1000)
  }

  const getGrammarHint = () => {
    switch (currentActivity.type) {
      case 'sentence-fix':
        return "Look for capital letters, punctuation, and proper word order!"
      case 'word-choice':
        return "Think about the meaning and context of each word!"
      case 'paragraph-build':
        return "Look for transition words like 'First', 'Then', 'Next', and 'Finally'!"
      case 'reading-quest':
        return "Find the sentence that covers the main point of the whole passage!"
      default:
        return "Take your time and think carefully!"
    }
  }

  if (completed) {
    const filteredActivities = getFilteredActivities()
    const accuracy = (score / filteredActivities.length) * 100
    const avgTime = timeSpent.reduce((a, b) => a + b, 0) / timeSpent.length / 1000
    const coinsEarned = Math.max(25, Math.floor(totalPoints / 10))

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉🌟🚀</div>
            <CardTitle className="font-heading text-2xl font-bold text-foreground">
              Grammar Galaxy Master, {profile.name}!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarDisplay avatar={profile.avatar} size="large" className="mx-auto" />
              <div className="text-4xl">⭐🏆⭐</div>
              <p className="font-body text-lg text-foreground">
                You're a grammar superstar!
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-primary">{accuracy.toFixed(0)}%</div>
                  <div className="text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-secondary">{totalPoints}</div>
                  <div className="text-muted-foreground">Points</div>
                </div>
              </div>
              <Progress value={accuracy} className="h-3" />
              <div className="text-center">
                <span className="font-heading text-lg font-semibold">
                  Level: {accuracy > 90 ? 'Grammar Expert' : accuracy > 75 ? 'Grammar Master' : accuracy > 60 ? 'Grammar Scholar' : 'Grammar Explorer'}
                </span>
              </div>
            </div>

            <Button onClick={onBack} className="w-full font-heading">
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                🌌 Grammar Galaxy
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                {currentActivity.title} • {difficultyInfo.icon} {difficultyInfo.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="small" />
            <div className="text-right">
              <div className="text-sm font-semibold text-primary">{totalPoints} pts</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-muted-foreground">Galaxy Progress</span>
              <span className="font-body text-sm text-muted-foreground">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Activity {currentActivityIndex + 1} of {getFilteredActivities().length}</span>
              <span className={difficultyInfo.color}>{difficultyInfo.name} Level</span>
            </div>
          </CardContent>
        </Card>

        {/* Galaxy Guide */}
        <Card className="bg-gradient-to-r from-indigo-100 to-purple-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🤖</div>
              <div className="flex-1">
                <p className="font-body text-lg text-foreground">
                  "Welcome to Grammar Galaxy, {profile.name}! {GRAMMAR_TIPS[Math.floor(Math.random() * GRAMMAR_TIPS.length)]}"
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speak(currentActivity.content)}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {showHint && (
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Target className="w-4 h-4" />
                  <span className="font-body text-sm font-semibold">Hint: {getGrammarHint()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Content */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-2xl">{difficultyInfo.icon}</span>
                  <h2 className="font-heading text-2xl font-bold">
                    {currentActivity.title}
                  </h2>
                  <div className="px-3 py-1 bg-primary/10 rounded-full">
                    <span className="text-sm font-semibold text-primary">
                      +{currentActivity.points} pts
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Question Content */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    {currentActivity.type === 'reading-quest' ? (
                      <div className="space-y-4">
                        <h3 className="font-heading text-lg font-semibold text-blue-800">
                          Reading Quest
                        </h3>
                        <div className="bg-white p-4 rounded-lg border text-left">
                          <p className="font-body text-base leading-relaxed">
                            {currentActivity.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="font-body text-lg">
                            {currentActivity.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Answer Options */}
              <div className="space-y-3">
                {currentActivity.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className={`w-full h-auto p-4 text-left justify-start font-body text-base leading-relaxed ${
                      showFeedback && option === currentActivity.correctAnswer
                        ? 'ring-2 ring-green-500 bg-green-100 text-green-800'
                        : showFeedback && selectedAnswer === option && !isCorrect
                        ? 'ring-2 ring-red-500 bg-red-100 text-red-800'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
              
              {/* Feedback */}
              {showFeedback && (
                <Card className={`${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {isCorrect ? '✅' : '❌'}
                      </div>
                      <div>
                        <p className="font-body text-base">
                          <strong>{isCorrect ? 'Correct!' : 'Not quite right.'}</strong>
                        </p>
                        <p className="font-body text-sm text-muted-foreground mt-1">
                          {currentActivity.explanation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Action Buttons */}
              <div className="text-center">
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
                    onClick={handleNextActivity}
                    size="lg"
                    className="font-heading px-8"
                  >
                    {currentActivityIndex < getFilteredActivities().length - 1 ? (
                      <>Next Challenge</>
                    ) : (
                      <>Complete Galaxy <CheckCircle className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
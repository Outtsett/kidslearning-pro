import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, Star, Volume2, BookOpen } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile } from '@/App'
import { toast } from 'sonner'

interface StorySafariProps {
  profile: UserProfile
  onComplete: (coinsEarned: number) => void
  onBack: () => void
}

interface StoryActivity {
  id: string
  type: 'story-reading' | 'word-builder' | 'story-quiz'
  title: string
  content?: string
  questions?: StoryQuestion[]
  wordPuzzle?: WordPuzzle
  difficulty: number
}

interface StoryQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface WordPuzzle {
  word: string
  syllables: string[]
  definition: string
  scrambledSyllables: string[]
}

const STORY_ACTIVITIES: StoryActivity[] = [
  {
    id: '1',
    type: 'story-reading',
    title: 'The Brave Little Rabbit',
    content: `Once upon a time, there was a brave little rabbit named Ruby. Ruby lived in a cozy burrow under the big oak tree. Every morning, Ruby would hop around the meadow, looking for fresh clover to eat.

One sunny day, Ruby heard a tiny voice crying for help. "Help! Help!" squeaked the voice. Ruby looked around and saw a small mouse stuck under a fallen branch.

"Don't worry, I'll help you!" said Ruby. She used her strong legs to push the branch away. The mouse was free!

"Thank you so much, Ruby!" said the mouse. "You are very kind and brave!"

From that day on, Ruby and the mouse became the best of friends. They played together in the meadow every day.`,
    questions: [
      {
        question: "What is the rabbit's name?",
        options: ["Ruby", "Rose", "Rita", "Rosie"],
        correctAnswer: "Ruby",
        explanation: "The brave little rabbit's name is Ruby!"
      },
      {
        question: "Where did Ruby live?",
        options: ["In a tree", "Under a rock", "In a burrow", "In a house"],
        correctAnswer: "In a burrow",
        explanation: "Ruby lived in a cozy burrow under the big oak tree."
      },
      {
        question: "What happened to the mouse?",
        options: ["It was lost", "It was stuck under a branch", "It was hungry", "It was scared"],
        correctAnswer: "It was stuck under a branch",
        explanation: "The small mouse was stuck under a fallen branch and needed help."
      }
    ],
    difficulty: 1
  },
  {
    id: '2',
    type: 'word-builder',
    title: 'Build New Words',
    wordPuzzle: {
      word: 'butterfly',
      syllables: ['but', 'ter', 'fly'],
      definition: 'A beautiful insect with colorful wings',
      scrambledSyllables: ['fly', 'but', 'ter']
    },
    difficulty: 2
  },
  {
    id: '3',
    type: 'story-reading',
    title: 'The Magic Garden',
    content: `Emma discovered a secret door behind her grandmother's garden shed. When she opened it, she found the most amazing garden she had ever seen.

The flowers in this garden were special - they glowed with soft, colorful light! The roses sparkled like rubies, the daisies shimmered like diamonds, and the sunflowers gleamed like gold.

In the center of the garden stood a magnificent fountain. The water danced and swirled in the air, creating beautiful patterns. Emma reached out to touch the water, and suddenly she could understand what the flowers were saying!

"Welcome to our garden, Emma!" whispered the roses. "We've been waiting for you!"

Emma spent the whole afternoon talking with the flowers and learning about their magical world. When it was time to go home, the flowers gave her a special seed.

"Plant this in your own garden," they said. "And remember, magic happens when you believe!"`,
    questions: [
      {
        question: "Where did Emma find the secret door?",
        options: ["Behind the house", "Behind the garden shed", "In the basement", "In the attic"],
        correctAnswer: "Behind the garden shed",
        explanation: "Emma found the secret door behind her grandmother's garden shed."
      },
      {
        question: "What was special about the flowers?",
        options: ["They were very big", "They glowed with light", "They smelled sweet", "They never wilted"],
        correctAnswer: "They glowed with light",
        explanation: "The flowers were special because they glowed with soft, colorful light!"
      },
      {
        question: "What gift did the flowers give Emma?",
        options: ["A magic wand", "A special seed", "A pretty stone", "A golden coin"],
        correctAnswer: "A special seed",
        explanation: "The flowers gave Emma a special seed to plant in her own garden."
      }
    ],
    difficulty: 2
  },
  {
    id: '4',
    type: 'word-builder',
    title: 'Advanced Word Building',
    wordPuzzle: {
      word: 'adventure',
      syllables: ['ad', 'ven', 'ture'],
      definition: 'An exciting journey or experience',
      scrambledSyllables: ['ture', 'ad', 'ven']
    },
    difficulty: 3
  }
]

const READING_TIPS = [
  "Take your time reading each word!",
  "Use your finger to follow along!",
  "Picture the story in your mind!",
  "Ask yourself what might happen next!",
  "Think about how the characters feel!",
  "Look for words you've learned before!"
]

export function StorySafari({ profile, onComplete, onBack }: StorySafariProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([])
  const [storyComplete, setStoryComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  
  const currentActivity = STORY_ACTIVITIES[currentActivityIndex]
  const progress = ((currentActivityIndex + (currentQuestionIndex / (currentActivity.questions?.length || 1))) / STORY_ACTIVITIES.length) * 100

  // Adaptive difficulty based on profile progress
  const getDifficultyAdjustedActivities = () => {
    const readingProgress = profile.progress.reading || 0
    if (readingProgress < 30) {
      return STORY_ACTIVITIES.filter(activity => activity.difficulty <= 2)
    } else if (readingProgress < 60) {
      return STORY_ACTIVITIES.filter(activity => activity.difficulty <= 3)
    }
    return STORY_ACTIVITIES
  }

  const speak = (text: string, rate: number = 0.7) => {
    if ('speechSynthesis' in window) {
      // Stop any currently speaking text
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = 1.1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const readStoryParagraph = (content: string, paragraphIndex: number = 0) => {
    const paragraphs = content.split('\n\n')
    if (paragraphs[paragraphIndex]) {
      speak(paragraphs[paragraphIndex], 0.6)
    }
  }

  useEffect(() => {
    if (currentActivity.type === 'story-reading') {
      setTimeout(() => {
        speak(`Let's read the story: ${currentActivity.title}`)
      }, 500)
    } else if (currentActivity.type === 'word-builder') {
      setTimeout(() => {
        speak(`Let's build the word: ${currentActivity.wordPuzzle?.word}`)
      }, 500)
    }
  }, [currentActivityIndex])

  const handleStoryRead = () => {
    setStoryComplete(true)
    setCurrentQuestionIndex(0)
    toast.success("Great reading! Now let's answer some questions!")
    speak("Great reading! Now let's answer some questions about the story!")
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!currentActivity.questions) return
    
    const currentQuestion = currentActivity.questions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      toast.success("Excellent comprehension! 🎉")
      speak(`Correct! ${currentQuestion.explanation}`)
    } else {
      toast.error("Think about the story again!")
      speak(`Not quite. ${currentQuestion.explanation}`)
    }
  }

  const handleNextQuestion = () => {
    if (!currentActivity.questions) return
    
    if (currentQuestionIndex < currentActivity.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
    } else {
      handleNextActivity()
    }
  }

  const handleSyllableSelect = (syllable: string) => {
    if (!currentActivity.wordPuzzle) return
    
    const newSelection = [...selectedSyllables, syllable]
    setSelectedSyllables(newSelection)
    speak(syllable)
    
    if (newSelection.length === currentActivity.wordPuzzle.syllables.length) {
      const isCorrect = newSelection.join('') === currentActivity.wordPuzzle.word
      if (isCorrect) {
        setTimeout(() => {
          setScore(score + 1)
          speak(`Perfect! You built the word ${currentActivity.wordPuzzle!.word}! ${currentActivity.wordPuzzle!.definition}`)
          toast.success("Perfect word building! 🎉")
          setIsCorrect(true)
          setShowFeedback(true)
        }, 500)
      } else {
        setTimeout(() => {
          toast.error("Let's try building that word again!")
          speak("Let's try building that word again!")
          setSelectedSyllables([])
        }, 500)
      }
    }
  }

  const handleNextActivity = () => {
    if (currentActivityIndex < getDifficultyAdjustedActivities().length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1)
      setCurrentQuestionIndex(0)
      setSelectedAnswer('')
      setSelectedSyllables([])
      setShowFeedback(false)
      setIsCorrect(false)
      setStoryComplete(false)
      setCurrentPage(0)
    } else {
      handleCompleteActivity()
    }
  }

  const handleCompleteActivity = () => {
    setCompleted(true)
    const activitiesCompleted = getDifficultyAdjustedActivities().length
    const percentage = (score / (activitiesCompleted * 2)) * 100 // Assuming 2 points per activity on average
    const coinsEarned = Math.max(20, Math.floor(percentage / 10) * 10)
    
    setTimeout(() => {
      speak("Congratulations! You completed Story Safari!")
      onComplete(coinsEarned)
      toast.success(`Safari complete! You earned ${coinsEarned} coins! 🪙`)
    }, 1000)
  }

  if (completed) {
    const activitiesCompleted = getDifficultyAdjustedActivities().length
    const percentage = (score / (activitiesCompleted * 2)) * 100
    const coinsEarned = Math.max(20, Math.floor(percentage / 10) * 10)

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉📖🦁</div>
            <CardTitle className="font-heading text-2xl font-bold text-foreground">
              Amazing Story Safari, {profile.name}!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarDisplay avatar={profile.avatar} size="large" className="mx-auto" />
              <div className="text-4xl">🌟📚🌟</div>
              <p className="font-body text-lg text-foreground">
                You're becoming an amazing reader!
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" weight="fill" />
                <span className="font-heading text-lg font-semibold">
                  Reading Level: {percentage > 80 ? 'Excellent' : percentage > 60 ? 'Great' : 'Good'}
                </span>
              </div>
              <Progress value={percentage} className="h-3" />
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
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                🦁 Story Safari
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                {currentActivity.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="small" />
            <BookOpen className="w-6 h-6 text-primary" weight="fill" />
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-muted-foreground">Safari Progress</span>
              <span className="font-body text-sm text-muted-foreground">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Reading Companion */}
        <Card className="bg-gradient-to-r from-emerald-100 to-blue-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🦁</div>
              <div className="flex-1">
                <p className="font-body text-lg text-foreground">
                  {currentActivity.type === 'story-reading' && !storyComplete &&
                    `"Welcome to Story Safari, ${profile.name}! Let's explore this story together. Remember: ${READING_TIPS[Math.floor(Math.random() * READING_TIPS.length)]}"`
                  }
                  {currentActivity.type === 'story-reading' && storyComplete &&
                    `"Great reading! Now let's see how well you understood the story. Take your time!"`
                  }
                  {currentActivity.type === 'word-builder' &&
                    `"Time to build words, ${profile.name}! Listen to each syllable and put them together!"`
                  }
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentActivity.type === 'story-reading' && currentActivity.content) {
                    readStoryParagraph(currentActivity.content, currentPage)
                  } else if (currentActivity.wordPuzzle) {
                    speak(`Let's build the word: ${currentActivity.wordPuzzle.word}`)
                  }
                }}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Content */}
        <Card>
          <CardContent className="p-8">
            {/* Story Reading */}
            {currentActivity.type === 'story-reading' && !storyComplete && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-heading text-2xl font-bold mb-4">
                    📖 {currentActivity.title}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => currentActivity.content && readStoryParagraph(currentActivity.content)}
                    className="mb-4"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Read Story Aloud
                  </Button>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-orange-200">
                  <div className="prose prose-lg max-w-none">
                    {currentActivity.content?.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="font-body text-lg leading-relaxed mb-4 text-gray-800">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <Button onClick={handleStoryRead} size="lg" className="font-heading px-8">
                    I Finished Reading! 📚
                  </Button>
                </div>
              </div>
            )}

            {/* Story Questions */}
            {currentActivity.type === 'story-reading' && storyComplete && currentActivity.questions && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-heading text-2xl font-bold mb-4">
                    Story Questions
                  </h2>
                  <p className="font-body text-muted-foreground mb-6">
                    Question {currentQuestionIndex + 1} of {currentActivity.questions.length}
                  </p>
                </div>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-4 text-center">
                      {currentActivity.questions[currentQuestionIndex].question}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {currentActivity.questions[currentQuestionIndex].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswer === option ? "default" : "outline"}
                          size="lg"
                          onClick={() => handleAnswerSelect(option)}
                          disabled={showFeedback}
                          className={`h-16 text-lg font-heading ${
                            showFeedback && option === currentActivity.questions![currentQuestionIndex].correctAnswer
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
                  </CardContent>
                </Card>
                
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
                      onClick={handleNextQuestion}
                      size="lg"
                      className="font-heading px-8"
                    >
                      {currentQuestionIndex < currentActivity.questions.length - 1 ? (
                        <>Next Question</>
                      ) : (
                        <>Next Adventure <CheckCircle className="w-5 h-5 ml-2" /></>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Word Builder */}
            {currentActivity.type === 'word-builder' && currentActivity.wordPuzzle && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-heading text-2xl font-bold mb-4">
                    🔤 Build the Word
                  </h2>
                  <p className="font-body text-lg text-muted-foreground mb-4">
                    {currentActivity.wordPuzzle.definition}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => speak(currentActivity.wordPuzzle!.word)}
                    className="mb-6"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Hear the Word
                  </Button>
                </div>
                
                {/* Word Building Area */}
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-2 mb-6">
                    {currentActivity.wordPuzzle.syllables.map((_, index) => (
                      <div
                        key={index}
                        className="w-20 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-lg font-heading bg-gray-50"
                      >
                        {selectedSyllables[index] || ''}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    {currentActivity.wordPuzzle.scrambledSyllables.map((syllable, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        onClick={() => handleSyllableSelect(syllable)}
                        disabled={selectedSyllables.length >= currentActivity.wordPuzzle!.syllables.length || selectedSyllables.includes(syllable)}
                        className="h-16 text-lg font-heading hover:scale-110 transition-all duration-300"
                      >
                        {syllable}
                      </Button>
                    ))}
                  </div>
                  
                  {selectedSyllables.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSyllables([])}
                      className="mt-4"
                    >
                      Clear Syllables
                    </Button>
                  )}
                </div>
                
                {showFeedback && isCorrect && (
                  <div className="text-center">
                    <Button
                      onClick={handleNextActivity}
                      size="lg"
                      className="font-heading px-8"
                    >
                      Next Adventure <CheckCircle className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
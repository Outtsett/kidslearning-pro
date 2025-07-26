import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, Star, Volume2 } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile } from '@/App'
import { toast } from 'sonner'

interface LetterLandAdventureProps {
  profile: UserProfile
  onComplete: (coinsEarned: number) => void
  onBack: () => void
}

interface LetterActivity {
  id: string
  type: 'find-letter' | 'sound-match' | 'word-building'
  letter?: string
  sound?: string
  word?: string
  letters?: string[]
  targetSound?: string
  animal?: string
  animalEmoji?: string
}

const LETTER_ACTIVITIES: LetterActivity[] = [
  {
    id: '1',
    type: 'find-letter',
    letter: 'B',
    sound: 'buh',
    animal: 'Bear',
    animalEmoji: '🐻'
  },
  {
    id: '2',
    type: 'sound-match',
    letter: 'M',
    sound: 'muh',
    animal: 'Mouse',
    animalEmoji: '🐭'
  },
  {
    id: '3',
    type: 'word-building',
    word: 'CAT',
    letters: ['C', 'A', 'T'],
    animal: 'Cat',
    animalEmoji: '🐱'
  },
  {
    id: '4',
    type: 'find-letter',
    letter: 'D',
    sound: 'duh',
    animal: 'Dog',
    animalEmoji: '🐶'
  },
  {
    id: '5',
    type: 'word-building',
    word: 'DOG',
    letters: ['D', 'O', 'G'],
    animal: 'Dog',
    animalEmoji: '🐶'
  }
]

const FLOATING_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const LETTER_SOUNDS: Record<string, string> = {
  A: 'ay', B: 'buh', C: 'kuh', D: 'duh', E: 'eh', 
  F: 'fuh', G: 'guh', H: 'huh', I: 'ih', J: 'juh'
}

const ENCOURAGEMENT_SOUNDS = [
  "Fantastic!",
  "Great job!",
  "You're amazing!",
  "Well done!",
  "Perfect!"
]

export function LetterLandAdventure({ profile, onComplete, onBack }: LetterLandAdventureProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [floatingLetters, setFloatingLetters] = useState<{letter: string, id: number, found: boolean}[]>([])
  
  const currentActivity = LETTER_ACTIVITIES[currentActivityIndex]
  const progress = ((currentActivityIndex + 1) / LETTER_ACTIVITIES.length) * 100

  // Text-to-speech functionality
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  // Initialize floating letters for find-letter activities
  useEffect(() => {
    if (currentActivity.type === 'find-letter') {
      const letters = FLOATING_LETTERS.map((letter, index) => ({
        letter,
        id: index,
        found: false
      }))
      setFloatingLetters(letters)
    }
  }, [currentActivityIndex])

  // Speak instructions when activity changes
  useEffect(() => {
    if (currentActivity.type === 'find-letter') {
      setTimeout(() => {
        speak(`Find the letter ${currentActivity.letter}!`)
      }, 500)
    } else if (currentActivity.type === 'sound-match') {
      setTimeout(() => {
        speak(`What letter makes the ${currentActivity.sound} sound?`)
      }, 500)
    } else if (currentActivity.type === 'word-building') {
      setTimeout(() => {
        speak(`Let's spell the word ${currentActivity.word}!`)
      }, 500)
    }
  }, [currentActivityIndex])

  const handleLetterClick = (letter: string) => {
    speak(letter)
    
    if (currentActivity.type === 'find-letter') {
      if (letter === currentActivity.letter) {
        setFloatingLetters(prev => 
          prev.map(l => l.letter === letter ? { ...l, found: true } : l)
        )
        handleCorrectAnswer()
      } else {
        toast.error("Try again! Listen for the sound!")
        speak(`That's ${letter}, try again!`)
      }
    } else if (currentActivity.type === 'sound-match') {
      if (letter === currentActivity.letter) {
        handleCorrectAnswer()
      } else {
        toast.error("Not quite! Listen to the sound again!")
        speak(`That's ${letter}, but listen for the ${currentActivity.sound} sound!`)
      }
    } else if (currentActivity.type === 'word-building') {
      if (currentActivity.letters && selectedLetters.length < currentActivity.letters.length) {
        const newSelection = [...selectedLetters, letter]
        setSelectedLetters(newSelection)
        speak(letter)
        
        if (newSelection.length === currentActivity.letters.length) {
          const isCorrect = newSelection.join('') === currentActivity.word
          if (isCorrect) {
            setTimeout(() => {
              speak(`Great! You spelled ${currentActivity.word}!`)
              handleCorrectAnswer()
            }, 500)
          } else {
            setTimeout(() => {
              toast.error("Let's try again!")
              speak("Let's try spelling that again!")
              setSelectedLetters([])
            }, 500)
          }
        }
      }
    }
  }

  const handleCorrectAnswer = () => {
    setIsCorrect(true)
    setShowFeedback(true)
    setScore(score + 1)
    
    const encouragement = ENCOURAGEMENT_SOUNDS[Math.floor(Math.random() * ENCOURAGEMENT_SOUNDS.length)]
    toast.success(`${encouragement} 🎉`)
    speak(encouragement)
    
    if (currentActivity.animalEmoji) {
      setTimeout(() => {
        speak(`The ${currentActivity.animal} is so happy!`)
      }, 1000)
    }
  }

  const handleNextActivity = () => {
    if (currentActivityIndex < LETTER_ACTIVITIES.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1)
      setSelectedLetters([])
      setShowFeedback(false)
      setIsCorrect(false)
    } else {
      handleCompleteActivity()
    }
  }

  const handleCompleteActivity = () => {
    setCompleted(true)
    const percentage = (score / LETTER_ACTIVITIES.length) * 100
    const coinsEarned = Math.max(15, Math.floor(percentage / 10) * 8)
    
    setTimeout(() => {
      speak("Congratulations! You completed Letterland Adventure!")
      onComplete(coinsEarned)
      toast.success(`Adventure complete! You earned ${coinsEarned} coins! 🪙`)
    }, 1000)
  }

  const playLetterSound = (letter: string) => {
    const sound = LETTER_SOUNDS[letter] || letter.toLowerCase()
    speak(`${letter} says ${sound}`)
  }

  if (completed) {
    const percentage = (score / LETTER_ACTIVITIES.length) * 100
    const coinsEarned = Math.max(15, Math.floor(percentage / 10) * 8)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉📚</div>
            <CardTitle className="font-heading text-2xl font-bold text-foreground">
              Amazing Reading Adventure, {profile.name}!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarDisplay avatar={profile.avatar} size="large" className="mx-auto" />
              <div className="text-4xl">🐻🐭🐱</div>
              <p className="font-body text-lg text-foreground">
                All the animals are cheering for you!
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" weight="fill" />
                <span className="font-heading text-lg font-semibold">
                  {score} out of {LETTER_ACTIVITIES.length} completed!
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
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                🏰 Letterland Adventure
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                Activity {currentActivityIndex + 1} of {LETTER_ACTIVITIES.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AvatarDisplay avatar={profile.avatar} size="small" />
            <div className="text-2xl">{currentActivity.animalEmoji}</div>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-muted-foreground">Adventure Progress</span>
              <span className="font-body text-sm text-muted-foreground">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Animal Guide */}
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{currentActivity.animalEmoji}</div>
              <div className="flex-1">
                <p className="font-body text-lg text-foreground">
                  {currentActivity.type === 'find-letter' && 
                    `"Hi ${profile.name}! I'm ${currentActivity.animal}. Can you find the letter ${currentActivity.letter}?"`
                  }
                  {currentActivity.type === 'sound-match' && 
                    `"Hello! I'm ${currentActivity.animal}. What letter makes the ${currentActivity.sound} sound?"`
                  }
                  {currentActivity.type === 'word-building' && 
                    `"Let's spell my name together! It's ${currentActivity.word}!"`
                  }
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentActivity.type === 'find-letter') {
                    speak(`Find the letter ${currentActivity.letter}!`)
                  } else if (currentActivity.type === 'sound-match') {
                    speak(`What letter makes the ${currentActivity.sound} sound?`)
                  } else if (currentActivity.type === 'word-building') {
                    speak(`Let's spell the word ${currentActivity.word}!`)
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
            {/* Find Letter Activity */}
            {currentActivity.type === 'find-letter' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-heading text-2xl font-bold mb-4">
                    Find the Letter {currentActivity.letter}!
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => playLetterSound(currentActivity.letter!)}
                    className="mb-6"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Hear the Sound
                  </Button>
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  {floatingLetters.map((item) => (
                    <Button
                      key={item.id}
                      variant={item.found ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleLetterClick(item.letter)}
                      disabled={item.found}
                      className={`h-16 text-2xl font-heading transition-all duration-300 ${
                        item.found ? 'bg-green-500 text-white animate-bounce' : 'hover:scale-110'
                      }`}
                    >
                      {item.letter}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sound Match Activity */}
            {currentActivity.type === 'sound-match' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-heading text-2xl font-bold mb-4">
                    What letter makes this sound?
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => speak(currentActivity.sound!)}
                    className="mb-6 text-lg"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    "{currentActivity.sound}"
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => (
                    <Button
                      key={letter}
                      variant="outline"
                      size="lg"
                      onClick={() => handleLetterClick(letter)}
                      disabled={showFeedback}
                      className="h-16 text-2xl font-heading hover:scale-110 transition-all duration-300"
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Word Building Activity */}
            {currentActivity.type === 'word-building' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-heading text-2xl font-bold mb-4">
                    Spell: {currentActivity.word}
                  </h2>
                  <div className="flex justify-center gap-2 mb-6">
                    {currentActivity.letters?.map((_, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-2xl font-heading bg-gray-50"
                      >
                        {selectedLetters[index] || ''}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-6 gap-3">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
                    <Button
                      key={letter}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLetterClick(letter)}
                      disabled={selectedLetters.length >= (currentActivity.letters?.length || 0)}
                      className="h-12 text-lg font-heading hover:scale-110 transition-all duration-300"
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
                
                {selectedLetters.length > 0 && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedLetters([])}
                      className="mt-4"
                    >
                      Clear Letters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Next Button */}
            {showFeedback && isCorrect && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleNextActivity}
                  size="lg"
                  className="font-heading px-8"
                >
                  {currentActivityIndex < LETTER_ACTIVITIES.length - 1 ? (
                    <>Next Adventure</>
                  ) : (
                    <>Complete Adventure <CheckCircle className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
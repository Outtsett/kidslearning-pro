import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Star, Beaker, Flask, Atom, Lightbulb } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile } from '@/App'
import { toast } from 'sonner'

interface LabExplorersProps {
  profile: UserProfile
  onComplete: (score: number) => void
  onBack: () => void
}

interface Experiment {
  id: string
  title: string
  type: 'physics' | 'chemistry' | 'biology' | 'earth-science'
  setup: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  visual: string
  materials: string[]
  safetyTip: string
}

const EXPERIMENTS: Experiment[] = [
  {
    id: '1',
    title: 'Floating vs Sinking',
    type: 'physics',
    setup: 'Let\'s test what floats and what sinks in water!',
    question: 'Which object will float on water?',
    options: ['Rock', 'Cork', 'Coin', 'Marble'],
    correctAnswer: 'Cork',
    explanation: 'Cork floats because it\'s less dense than water! Density determines if objects float or sink.',
    visual: '🪣',
    materials: ['Water bowl', 'Various objects', 'Towel'],
    safetyTip: 'Always have an adult help with water experiments!'
  },
  {
    id: '2',
    title: 'Magnet Power',
    type: 'physics',
    setup: 'Discover which materials are magnetic!',
    question: 'Which material will stick to a magnet?',
    options: ['Plastic spoon', 'Paper clip', 'Wooden block', 'Glass marble'],
    correctAnswer: 'Paper clip',
    explanation: 'Paper clips are made of metal (steel) which is magnetic! Magnets attract metals like iron and steel.',
    visual: '🧲',
    materials: ['Magnet', 'Various objects', 'Safety glasses'],
    safetyTip: 'Keep magnets away from electronics and credit cards!'
  },
  {
    id: '3',
    title: 'Plant Growth Race',
    type: 'biology',
    setup: 'Let\'s see what plants need to grow healthy!',
    question: 'Which plant will grow the tallest?',
    options: ['Plant in dark closet', 'Plant with no water', 'Plant with sunlight and water', 'Plant in freezer'],
    correctAnswer: 'Plant with sunlight and water',
    explanation: 'Plants need sunlight, water, and good soil to grow! This process is called photosynthesis.',
    visual: '🌱',
    materials: ['Seeds', 'Pots', 'Soil', 'Water'],
    safetyTip: 'Always wash hands after handling soil!'
  },
  {
    id: '4',
    title: 'Color Mixing Magic',
    type: 'chemistry',
    setup: 'Mix primary colors to create new colors!',
    question: 'What color do you get when you mix red and yellow?',
    options: ['Purple', 'Green', 'Orange', 'Brown'],
    correctAnswer: 'Orange',
    explanation: 'Red + Yellow = Orange! This is how we create secondary colors from primary colors.',
    visual: '🎨',
    materials: ['Red paint', 'Yellow paint', 'Mixing palette', 'Brushes'],
    safetyTip: 'Use washable paints and wear old clothes!'
  },
  {
    id: '5',
    title: 'Volcano Eruption',
    type: 'earth-science',
    setup: 'Create a safe volcano eruption with household items!',
    question: 'What happens when we mix baking soda and vinegar?',
    options: ['Nothing happens', 'It gets very cold', 'It fizzes and bubbles', 'It changes color only'],
    correctAnswer: 'It fizzes and bubbles',
    explanation: 'Baking soda and vinegar create a chemical reaction that produces carbon dioxide gas, making bubbles!',
    visual: '🌋',
    materials: ['Baking soda', 'Vinegar', 'Food coloring', 'Small container'],
    safetyTip: 'Do this experiment outside or in a sink!'
  },
  {
    id: '6',
    title: 'Light Rainbow',
    type: 'physics',
    setup: 'Discover how white light contains all colors!',
    question: 'What do you see when white light passes through a prism?',
    options: ['More white light', 'Black shadow', 'Rainbow colors', 'Nothing special'],
    correctAnswer: 'Rainbow colors',
    explanation: 'White light contains all colors! A prism separates white light into a rainbow spectrum.',
    visual: '🌈',
    materials: ['Prism or clear glass', 'Flashlight', 'White paper'],
    safetyTip: 'Never look directly at bright lights!'
  }
]

const ENCOURAGEMENT_MESSAGES = [
  "You're an amazing scientist!",
  "Great hypothesis!",
  "Excellent observation!",
  "You're thinking like a real scientist!",
  "What a brilliant experiment!",
  "Keep exploring and discovering!"
]

export function LabExplorers({ profile, onComplete, onBack }: LabExplorersProps) {
  const [currentExperimentIndex, setCurrentExperimentIndex] = useState(0)
  const [experimentPhase, setExperimentPhase] = useState<'setup' | 'hypothesis' | 'results'>('setup')
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [experimenting, setExperimenting] = useState(false)

  const currentExperiment = EXPERIMENTS[currentExperimentIndex]
  const progress = ((currentExperimentIndex + 1) / EXPERIMENTS.length) * 100

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  }

  const handleStartExperiment = () => {
    setExperimentPhase('hypothesis')
  }

  const handleRunExperiment = () => {
    setExperimenting(true)
    toast.success("Running experiment... 🧪")
    
    setTimeout(() => {
      setExperimenting(false)
      setExperimentPhase('results')
    }, 2000)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === currentExperiment.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      toast.success("Hypothesis confirmed! Great scientific thinking! 🎉")
    } else {
      toast.error("Good try! Science is about learning from every experiment! 🔬")
    }
  }

  const handleNextExperiment = () => {
    if (currentExperimentIndex < EXPERIMENTS.length - 1) {
      setCurrentExperimentIndex(currentExperimentIndex + 1)
      setExperimentPhase('setup')
      setSelectedAnswer('')
      setShowFeedback(false)
    } else {
      handleCompleteAllExperiments()
    }
  }

  const handleCompleteAllExperiments = () => {
    setCompleted(true)
    setTimeout(() => {
      onComplete(score)
    }, 2000)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🏆</div>
            <CardTitle className="font-heading text-2xl font-bold text-blue-800">
              Master Lab Explorer!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarDisplay avatar={profile.avatar} size="large" className="mx-auto" />
              <div className="text-4xl">🔬</div>
              <p className="font-body text-lg text-blue-700">
                "Incredible work, {profile.name}! You completed {score} out of {EXPERIMENTS.length} experiments successfully! 
                You're thinking like a real scientist!"
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Beaker className="w-5 h-5 text-blue-600" weight="fill" />
                <span className="font-heading text-lg font-semibold text-blue-800">
                  Lab Explorer Badge Earned!
                </span>
              </div>
              <Progress value={(score / EXPERIMENTS.length) * 100} className="h-3 bg-blue-200" />
              <div className="flex justify-center gap-2 text-sm text-blue-600">
                <Badge variant="outline">Physics</Badge>
                <Badge variant="outline">Chemistry</Badge>
                <Badge variant="outline">Biology</Badge>
                <Badge variant="outline">Earth Science</Badge>
              </div>
            </div>

            <Button onClick={onBack} className="w-full font-heading bg-blue-600 hover:bg-blue-700">
              Continue Science Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Beaker className="w-8 h-8 text-blue-600" weight="fill" />
              <div>
                <h1 className="font-heading text-xl font-bold text-blue-800">
                  Lab Explorers
                </h1>
                <p className="font-body text-sm text-blue-600">
                  Experiment {currentExperimentIndex + 1} of {EXPERIMENTS.length}
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
              <span className="font-body text-xs text-muted-foreground">experiments</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-blue-700">Lab Progress</span>
              <span className="font-body text-sm text-blue-700">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-blue-100" />
          </CardContent>
        </Card>

        {/* Avatar Lab Assistant */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🥽</div>
              <div className="flex-1">
                <p className="font-body text-lg text-purple-800">
                  {experimentPhase === 'setup' && `"Welcome to the lab, ${profile.name}! Let's set up our experiment: ${currentExperiment.title}"`}
                  {experimentPhase === 'hypothesis' && `"Great setup! Now make your hypothesis - what do you think will happen?"`}
                  {experimentPhase === 'results' && showFeedback && (
                    isCorrect 
                      ? `"${getRandomEncouragement()} ${currentExperiment.explanation}"`
                      : `"Good hypothesis! ${currentExperiment.explanation} That's how science works!"`
                  )}
                  {experimentPhase === 'results' && !showFeedback && `"Experiment complete! Now let's see if your hypothesis was correct!"`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experiment Setup Phase */}
        {experimentPhase === 'setup' && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="text-8xl mb-4">{currentExperiment.visual}</div>
              <CardTitle className="font-heading text-2xl font-semibold">
                {currentExperiment.title}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={`mx-auto ${
                  currentExperiment.type === 'physics' ? 'bg-blue-100 text-blue-800' :
                  currentExperiment.type === 'chemistry' ? 'bg-green-100 text-green-800' :
                  currentExperiment.type === 'biology' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}
              >
                {currentExperiment.type === 'physics' && <Atom className="w-4 h-4 mr-1" />}
                {currentExperiment.type === 'chemistry' && <Flask className="w-4 h-4 mr-1" />}
                {currentExperiment.type === 'biology' && <Beaker className="w-4 h-4 mr-1" />}
                {currentExperiment.type === 'earth-science' && <Lightbulb className="w-4 h-4 mr-1" />}
                {currentExperiment.type.replace('-', ' ').toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="font-body text-lg text-center text-foreground">
                {currentExperiment.setup}
              </p>

              {/* Materials List */}
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="font-heading text-lg font-semibold text-amber-800 flex items-center gap-2">
                    🧰 Materials Needed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentExperiment.materials.map((material, index) => (
                      <li key={index} className="flex items-center gap-2 font-body text-amber-700">
                        <CheckCircle className="w-4 h-4" weight="fill" />
                        {material}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Safety Tip */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-heading font-semibold text-red-800">Safety First!</p>
                      <p className="font-body text-red-700">{currentExperiment.safetyTip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleStartExperiment}
                size="lg"
                className="w-full font-heading bg-blue-600 hover:bg-blue-700"
              >
                Start Experiment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Hypothesis Phase */}
        {experimentPhase === 'hypothesis' && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="text-8xl mb-4">{currentExperiment.visual}</div>
              <CardTitle className="font-heading text-2xl font-semibold">
                Make Your Hypothesis
              </CardTitle>
              <p className="font-body text-lg text-muted-foreground">
                {currentExperiment.question}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {currentExperiment.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleAnswerSelect(option)}
                    className="h-16 text-lg font-heading"
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleRunExperiment}
                disabled={!selectedAnswer}
                size="lg"
                className="w-full font-heading bg-green-600 hover:bg-green-700"
              >
                {experimenting ? (
                  <>Running Experiment... 🧪</>
                ) : (
                  <>Run Experiment</>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Phase */}
        {experimentPhase === 'results' && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="text-8xl mb-4">{currentExperiment.visual}</div>
              <CardTitle className="font-heading text-2xl font-semibold">
                Experiment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showFeedback ? (
                <>
                  <p className="font-body text-lg text-center">
                    Your hypothesis: <strong>{selectedAnswer}</strong>
                  </p>
                  <Button
                    onClick={handleSubmitAnswer}
                    size="lg"
                    className="w-full font-heading bg-purple-600 hover:bg-purple-700"
                  >
                    Check Results
                  </Button>
                </>
              ) : (
                <>
                  <div className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-100 border-green-300' : 'bg-blue-100 border-blue-300'
                  }`}>
                    <p className="font-body text-lg text-center">
                      <strong>Correct Answer:</strong> {currentExperiment.correctAnswer}
                    </p>
                    <p className="font-body text-center mt-2">
                      {currentExperiment.explanation}
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleNextExperiment}
                    size="lg"
                    className="w-full font-heading bg-blue-600 hover:bg-blue-700"
                  >
                    {currentExperimentIndex < EXPERIMENTS.length - 1 ? (
                      <>Next Experiment</>
                    ) : (
                      <>Complete Lab <CheckCircle className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
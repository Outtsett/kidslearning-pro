import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, CheckCircle, Star, Microscope, Brain, Atom, MagnifyingGlass, Planet } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile } from '@/App'
import { toast } from 'sonner'

interface ScienceQuestProps {
  profile: UserProfile
  onComplete: (score: number) => void
  onBack: () => void
}

interface Quest {
  id: string
  title: string
  category: 'scientific-method' | 'ecosystems' | 'energy' | 'space' | 'genetics'
  difficulty: 'medium' | 'hard' | 'expert'
  scenario: string
  hypothesis: string[]
  experiment: {
    description: string
    variables: string[]
    controls: string[]
  }
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  realWorldApplication: string
  visual: string
}

const SCIENCE_QUESTS: Quest[] = [
  {
    id: '1',
    title: 'The Vanishing Bees Mystery',
    category: 'ecosystems',
    difficulty: 'medium',
    scenario: 'A local farmer notices that bee populations in their area have been declining. Crops that depend on bee pollination are producing less fruit.',
    hypothesis: [
      'Pesticides are harming the bees',
      'Climate change is affecting bee behavior',
      'New diseases are spreading among bees',
      'All of the above could be factors'
    ],
    experiment: {
      description: 'Design a study to test what factors might be affecting bee populations',
      variables: ['Pesticide use', 'Temperature changes', 'Bee health'],
      controls: ['Areas without pesticides', 'Historical temperature data', 'Healthy bee colonies']
    },
    question: 'What would be the BEST first step in investigating this mystery?',
    options: [
      'Immediately ban all pesticides',
      'Collect data on bee populations and environmental factors',
      'Introduce new bee species',
      'Wait and see what happens'
    ],
    correctAnswer: 'Collect data on bee populations and environmental factors',
    explanation: 'Good scientists always start by gathering data! We need to understand the problem before we can solve it.',
    realWorldApplication: 'Real scientists are studying bee decline to protect our food supply - bees pollinate about 1/3 of our food!',
    visual: '🐝'
  },
  {
    id: '2',
    title: 'The Solar Panel Challenge',
    category: 'energy',
    difficulty: 'medium',
    scenario: 'Your school wants to install solar panels to reduce energy costs. You need to find the best location and angle for maximum energy production.',
    hypothesis: [
      'South-facing panels will produce the most energy',
      'The angle should match our latitude',
      'Shade from trees will reduce efficiency',
      'All of these factors matter'
    ],
    experiment: {
      description: 'Test different panel orientations and measure energy output',
      variables: ['Panel angle', 'Direction facing', 'Amount of shade'],
      controls: ['Same panel type', 'Same weather conditions', 'Same time periods']
    },
    question: 'Which factor would have the GREATEST impact on solar panel efficiency?',
    options: [
      'The color of the panel frame',
      'The direction the panel faces',
      'The height of the mounting pole',
      'The brand name on the panel'
    ],
    correctAnswer: 'The direction the panel faces',
    explanation: 'Panel orientation is crucial! In the Northern Hemisphere, south-facing panels capture the most sunlight throughout the day.',
    realWorldApplication: 'Engineers use this knowledge to design efficient solar farms that can power entire cities!',
    visual: '☀️'
  },
  {
    id: '3',
    title: 'The Ecosystem Balance',
    category: 'ecosystems',
    difficulty: 'hard',
    scenario: 'Wolves were reintroduced to Yellowstone National Park after being absent for 70 years. Scientists want to study how this affects the entire ecosystem.',
    hypothesis: [
      'Wolves will only affect deer populations',
      'The entire ecosystem will change',
      'Only predator-prey relationships will change',
      'Nothing significant will happen'
    ],
    experiment: {
      description: 'Monitor multiple species and environmental factors over several years',
      variables: ['Wolf population', 'Deer behavior', 'Vegetation growth', 'River patterns'],
      controls: ['Areas without wolves', 'Historical data', 'Similar ecosystems']
    },
    question: 'What unexpected change might occur when wolves are reintroduced?',
    options: [
      'Rivers change their paths',
      'Fish populations increase',
      'Tree growth improves',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    explanation: 'This is called a "trophic cascade"! Wolves change deer behavior, which affects vegetation, which affects erosion and rivers, which affects fish!',
    realWorldApplication: 'This real Yellowstone study showed how apex predators can reshape entire landscapes!',
    visual: '🐺'
  },
  {
    id: '4',
    title: 'The Genetics Detective',
    category: 'genetics',
    difficulty: 'hard',
    scenario: 'A plant breeder wants to create tomatoes that are both large AND disease-resistant. They need to understand how traits are inherited.',
    hypothesis: [
      'All traits are inherited equally',
      'Some traits are dominant over others',
      'Genes work independently',
      'Environmental factors don\'t matter'
    ],
    experiment: {
      description: 'Cross-breed tomatoes with different traits and track offspring',
      variables: ['Parent plant traits', 'Offspring traits', 'Environmental conditions'],
      controls: ['Known parent genetics', 'Controlled growing conditions', 'Large sample sizes']
    },
    question: 'If large size (L) is dominant and disease resistance (r) is recessive, what happens when you cross Ll x rr?',
    options: [
      '100% large, disease-prone plants',
      '50% large disease-resistant, 50% small disease-resistant',
      '25% of each possible combination',
      '50% large disease-prone, 50% small disease-resistant'
    ],
    correctAnswer: '50% large disease-prone, 50% small disease-resistant',
    explanation: 'Great genetics thinking! Ll x rr gives us Lr and lr offspring. Large (L) is dominant, so Lr = large but disease-prone.',
    realWorldApplication: 'Plant breeders use these principles to develop crops that feed billions of people worldwide!',
    visual: '🧬'
  },
  {
    id: '5',
    title: 'The Space Mission Planner',
    category: 'space',
    difficulty: 'expert',
    scenario: 'NASA wants to send a mission to Mars. You need to plan the optimal launch window and trajectory considering planetary orbits.',
    hypothesis: [
      'Any time is good for launch',
      'Launch windows depend on planetary alignment',
      'Fuel efficiency matters most',
      'Direct path is always fastest'
    ],
    experiment: {
      description: 'Calculate orbital mechanics and energy requirements for different launch dates',
      variables: ['Launch timing', 'Trajectory path', 'Fuel requirements'],
      controls: ['Known orbital data', 'Spacecraft specifications', 'Mission objectives']
    },
    question: 'Why do Mars missions only launch every 26 months?',
    options: [
      'Mars rotates very slowly',
      'Earth and Mars align optimally every 26 months',
      'Spacecraft need 26 months to build',
      'The weather is only good every 26 months'
    ],
    correctAnswer: 'Earth and Mars align optimally every 26 months',
    explanation: 'This is called a "launch window"! Earth orbits faster than Mars, so we have to wait for the planets to align for an efficient trip.',
    realWorldApplication: 'Real mission planners use these calculations for actual Mars rovers and future human missions!',
    visual: '🚀'
  },
  {
    id: '6',
    title: 'The Climate Data Detective',
    category: 'scientific-method',
    difficulty: 'expert',
    scenario: 'Scientists are analyzing 100 years of temperature data to understand climate patterns. They need to separate natural variation from human-caused changes.',
    hypothesis: [
      'All temperature changes are natural',
      'All temperature changes are human-caused',
      'Both natural and human factors contribute',
      'Temperature data is unreliable'
    ],
    experiment: {
      description: 'Analyze multiple data sources and compare with known natural and human factors',
      variables: ['Temperature trends', 'CO2 levels', 'Solar activity', 'Volcanic activity'],
      controls: ['Multiple measurement stations', 'Peer-reviewed methods', 'Independent verification']
    },
    question: 'What makes climate science conclusions reliable?',
    options: [
      'Using only one type of measurement',
      'Multiple independent lines of evidence',
      'Computer models alone',
      'Opinions of individual scientists'
    ],
    correctAnswer: 'Multiple independent lines of evidence',
    explanation: 'Excellent scientific thinking! Climate scientists use ice cores, tree rings, satellites, and ground stations - when they all agree, we can be confident!',
    realWorldApplication: 'This is how real climate scientists build confidence in their conclusions about global warming!',
    visual: '🌡️'
  }
]

const ENCOURAGEMENT_MESSAGES = [
  "Outstanding scientific reasoning!",
  "You think like a professional scientist!",
  "Brilliant hypothesis formation!",
  "Excellent application of the scientific method!",
  "Your analytical skills are impressive!",
  "You're ready for advanced science!"
]

export function ScienceQuest({ profile, onComplete, onBack }: ScienceQuestProps) {
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0)
  const [questPhase, setQuestPhase] = useState<'briefing' | 'hypothesis' | 'experiment' | 'analysis'>('briefing')
  const [selectedHypothesis, setSelectedHypothesis] = useState<string>('')
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [analysisData, setAnalysisData] = useState<string[]>([])

  const currentQuest = SCIENCE_QUESTS[currentQuestIndex]
  const progress = ((currentQuestIndex + 1) / SCIENCE_QUESTS.length) * 100

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ecosystems': return <Planet className="w-5 h-5" weight="fill" />
      case 'energy': return <Atom className="w-5 h-5" weight="fill" />
      case 'genetics': return <MagnifyingGlass className="w-5 h-5" weight="fill" />
      case 'space': return <Brain className="w-5 h-5" weight="fill" />
      case 'scientific-method': return <Microscope className="w-5 h-5" weight="fill" />
      default: return <Star className="w-5 h-5" weight="fill" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-orange-100 text-orange-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStartInvestigation = () => {
    setQuestPhase('hypothesis')
  }

  const handleHypothesisSelect = (hypothesis: string) => {
    setSelectedHypothesis(hypothesis)
  }

  const handleDesignExperiment = () => {
    setQuestPhase('experiment')
    // Simulate collecting experimental data
    setAnalysisData([
      'Data collection in progress...',
      'Variables controlled successfully',
      'Results showing clear patterns',
      'Ready for analysis'
    ])
  }

  const handleAnalyzeResults = () => {
    setQuestPhase('analysis')
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitConclusion = () => {
    const correct = selectedAnswer === currentQuest.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      toast.success("Excellent scientific conclusion! 🏆")
    } else {
      toast.success("Good scientific thinking! Let's learn from this result! 🔬")
    }
  }

  const handleNextQuest = () => {
    if (currentQuestIndex < SCIENCE_QUESTS.length - 1) {
      setCurrentQuestIndex(currentQuestIndex + 1)
      setQuestPhase('briefing')
      setSelectedHypothesis('')
      setSelectedAnswer('')
      setShowFeedback(false)
      setAnalysisData([])
    } else {
      handleCompleteAllQuests()
    }
  }

  const handleCompleteAllQuests = () => {
    setCompleted(true)
    setTimeout(() => {
      onComplete(score)
    }, 2000)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-cyan-100 p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎓</div>
            <CardTitle className="font-heading text-2xl font-bold text-purple-800">
              Master Science Investigator!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarDisplay avatar={profile.avatar} size="large" className="mx-auto" />
              <div className="text-4xl">🔬</div>
              <p className="font-body text-lg text-purple-700">
                "Phenomenal work, {profile.name}! You completed {score} out of {SCIENCE_QUESTS.length} investigations with scientific excellence! 
                You're thinking like a professional researcher!"
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Microscope className="w-5 h-5 text-purple-600" weight="fill" />
                <span className="font-heading text-lg font-semibold text-purple-800">
                  Master Scientist Badge Earned!
                </span>
              </div>
              <Progress value={(score / SCIENCE_QUESTS.length) * 100} className="h-3 bg-purple-200" />
              <div className="flex justify-center gap-2 text-sm text-purple-600">
                <Badge variant="outline">Scientific Method</Badge>
                <Badge variant="outline">Ecosystems</Badge>
                <Badge variant="outline">Energy</Badge>
                <Badge variant="outline">Space</Badge>
                <Badge variant="outline">Genetics</Badge>
              </div>
            </div>

            <Button onClick={onBack} className="w-full font-heading bg-purple-600 hover:bg-purple-700">
              Continue Scientific Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Microscope className="w-8 h-8 text-purple-600" weight="fill" />
              <div>
                <h1 className="font-heading text-xl font-bold text-purple-800">
                  Science Quest
                </h1>
                <p className="font-body text-sm text-purple-600">
                  Investigation {currentQuestIndex + 1} of {SCIENCE_QUESTS.length}
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
              <span className="font-body text-xs text-muted-foreground">investigations</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-purple-700">Investigation Progress</span>
              <span className="font-body text-sm text-purple-700">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-purple-100" />
          </CardContent>
        </Card>

        {/* Quest Info */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{currentQuest.visual}</div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold text-indigo-800">
                    {currentQuest.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                      {getCategoryIcon(currentQuest.category)}
                      <span className="ml-1 capitalize">{currentQuest.category.replace('-', ' ')}</span>
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(currentQuest.difficulty)}>
                      {currentQuest.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Phase Content */}
        <Tabs value={questPhase} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="briefing">Briefing</TabsTrigger>
            <TabsTrigger value="hypothesis">Hypothesis</TabsTrigger>
            <TabsTrigger value="experiment">Experiment</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="briefing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Mission Briefing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-body text-lg">{currentQuest.scenario}</p>
                <Button
                  onClick={handleStartInvestigation}
                  size="lg"
                  className="w-full font-heading bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Investigation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hypothesis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Form Your Hypothesis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-body">What do you think is happening? Select your hypothesis:</p>
                <div className="space-y-3">
                  {currentQuest.hypothesis.map((hyp, index) => (
                    <Button
                      key={index}
                      variant={selectedHypothesis === hyp ? "default" : "outline"}
                      onClick={() => handleHypothesisSelect(hyp)}
                      className="w-full text-left justify-start h-auto p-4 font-body"
                    >
                      {hyp}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleDesignExperiment}
                  disabled={!selectedHypothesis}
                  size="lg"
                  className="w-full font-heading bg-green-600 hover:bg-green-700"
                >
                  Design Experiment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Experimental Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-body">{currentQuest.experiment.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="font-heading text-sm font-semibold text-blue-800">
                        Variables to Test
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {currentQuest.experiment.variables.map((variable, index) => (
                          <li key={index} className="font-body text-sm text-blue-700">
                            • {variable}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="font-heading text-sm font-semibold text-green-800">
                        Controls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {currentQuest.experiment.controls.map((control, index) => (
                          <li key={index} className="font-body text-sm text-green-700">
                            • {control}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-heading font-semibold text-amber-800 mb-2">Data Collection</h4>
                  {analysisData.map((data, index) => (
                    <p key={index} className="font-body text-sm text-amber-700">
                      ✓ {data}
                    </p>
                  ))}
                </div>

                <Button
                  onClick={handleAnalyzeResults}
                  size="lg"
                  className="w-full font-heading bg-purple-600 hover:bg-purple-700"
                >
                  Analyze Results
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Scientific Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-body text-sm text-gray-600 mb-2">
                    <strong>Your Hypothesis:</strong> {selectedHypothesis}
                  </p>
                  <p className="font-body text-sm text-gray-600">
                    <strong>Experimental Data:</strong> Ready for analysis
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-semibold mb-3">{currentQuest.question}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuest.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === option ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleAnswerSelect(option)}
                        disabled={showFeedback}
                        className={`text-left justify-start h-auto p-4 font-body ${
                          showFeedback && option === currentQuest.correctAnswer
                            ? 'ring-2 ring-green-500 bg-green-100 text-green-800'
                            : showFeedback && selectedAnswer === option && !isCorrect
                            ? 'ring-2 ring-orange-500 bg-orange-100 text-orange-800'
                            : ''
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {showFeedback && (
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                    <p className="font-body text-sm mb-2">
                      <strong>Scientific Explanation:</strong> {currentQuest.explanation}
                    </p>
                    <p className="font-body text-sm text-green-700">
                      <strong>Real-World Application:</strong> {currentQuest.realWorldApplication}
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  {!showFeedback ? (
                    <Button
                      onClick={handleSubmitConclusion}
                      disabled={!selectedAnswer}
                      size="lg"
                      className="font-heading px-8 bg-purple-600 hover:bg-purple-700"
                    >
                      Submit Conclusion
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuest}
                      size="lg"
                      className="font-heading px-8 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {currentQuestIndex < SCIENCE_QUESTS.length - 1 ? (
                        <>Next Investigation</>
                      ) : (
                        <>Complete Quest <CheckCircle className="w-5 h-5 ml-2" /></>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assistant Feedback */}
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">👩‍🔬</div>
              <div className="flex-1">
                <p className="font-body text-lg text-cyan-800">
                  {questPhase === 'briefing' && `"Welcome to your scientific investigation, ${profile.name}! Let's solve this mystery using the scientific method."`}
                  {questPhase === 'hypothesis' && `"Great! Now form a hypothesis - what do you think is causing this phenomenon?"`}
                  {questPhase === 'experiment' && `"Excellent hypothesis! Now let's design an experiment to test it. Remember, good experiments control variables."`}
                  {questPhase === 'analysis' && showFeedback && (
                    isCorrect 
                      ? `"${getRandomEncouragement()} You're using excellent scientific reasoning!"`
                      : `"Good scientific thinking! Sometimes our first hypothesis needs refinement - that's how science works!"`
                  )}
                  {questPhase === 'analysis' && !showFeedback && `"Time to analyze our data! What conclusion can you draw from the evidence?"`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
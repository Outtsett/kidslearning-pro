import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heart, Sparkles, ArrowRight } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile, AgeGroup } from '@/App'

interface AvatarCreationProps {
  onProfileCreated: (profile: UserProfile) => void
  ageGroup: AgeGroup
}

const AVATAR_OPTIONS = {
  body: ['light', 'medium', 'dark', 'tan'],
  hair: ['brown-short', 'blonde-long', 'black-curly', 'red-pigtails', 'blue-spiky'],
  clothes: ['red-tshirt', 'blue-dress', 'green-hoodie', 'purple-shirt', 'yellow-overalls'],
  accessories: ['glasses', 'hat', 'bow', 'necklace', 'backpack']
}

const THEMES = [
  { id: 'forest', name: 'Forest Adventure', color: 'bg-green-200', locked: false },
  { id: 'ocean', name: 'Ocean Explorer', color: 'bg-blue-200', locked: false },
  { id: 'space', name: 'Space Journey', color: 'bg-purple-200', locked: true },
  { id: 'candy', name: 'Candy Land', color: 'bg-pink-200', locked: true }
]

export function AvatarCreation({ onProfileCreated, ageGroup }: AvatarCreationProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  
  const getAgeRange = (ageGroup: AgeGroup) => {
    switch (ageGroup) {
      case '3-5': return { min: 3, max: 5, default: 4 }
      case '6-9': return { min: 6, max: 9, default: 7 }
      case '10-12': return { min: 10, max: 12, default: 11 }
    }
  }

  const ageRange = getAgeRange(ageGroup)
  const [age, setAge] = useState<number | ''>(ageRange.default)
  const [selectedAvatar, setSelectedAvatar] = useState({
    body: 'light',
    hair: 'brown-short',
    clothes: 'red-tshirt',
    accessories: [] as string[]
  })
  const [selectedTheme, setSelectedTheme] = useState('forest')

  const getAgeGroup = (age: number): AgeGroup => {
    if (age <= 5) return '3-5'
    if (age <= 9) return '6-9'
    return '10-12'
  }

  const ageRange = getAgeRange(ageGroup)

  const handleComplete = () => {
    if (name && age) {
      const profile: UserProfile = {
        name,
        age: age as number,
        ageGroup: ageGroup, // Use the pre-selected age group
        avatar: selectedAvatar,
        theme: selectedTheme,
        coins: 100,
        unlockedItems: ['red-tshirt', 'blue-dress', 'forest', 'ocean'],
        progress: { math: 0, science: 0, reading: 0, art: 0 },
        achievements: []
      }
      onProfileCreated(profile)
    }
  }

  const toggleAccessory = (accessory: string) => {
    setSelectedAvatar(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessory)
        ? prev.accessories.filter(a => a !== accessory)
        : [...prev.accessories, accessory]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-lavender/20 to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Teddy Bear Guide */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white/80 rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🧸</div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Hi there, little explorer!
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              I'm Teddy, and I'm here to help you create your learning companion!
            </p>
          </div>
        </div>

        {step === 1 && (
          <Card className="mx-auto max-w-lg">
            <CardHeader className="text-center">
              <h2 className="font-heading text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
                <Heart className="text-accent" weight="fill" />
                Tell me about yourself!
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  What's your name?
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-lg font-heading"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  How old are you?
                </label>
                <Input
                  type="number"
                  min={ageRange.min}
                  max={ageRange.max}
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder={`Enter your age (${ageRange.min}-${ageRange.max})`}
                  className="text-lg font-heading"
                />
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!name || !age || (age as number) < ageRange.min || (age as number) > ageRange.max}
                className="w-full font-heading text-lg"
                size="lg"
              >
                Create My Avatar <ArrowRight weight="bold" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Avatar Preview */}
            <Card>
              <CardHeader className="text-center">
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Your Avatar
                </h2>
              </CardHeader>
              <CardContent className="flex justify-center">
                <AvatarDisplay avatar={selectedAvatar} size="large" />
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card>
              <CardHeader>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Customize Your Look
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Body */}
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">
                    Skin Tone
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.body.map((option) => (
                      <Button
                        key={option}
                        variant={selectedAvatar.body === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAvatar(prev => ({ ...prev, body: option }))}
                        className="capitalize"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hair */}
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">
                    Hair Style
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.hair.map((option) => (
                      <Button
                        key={option}
                        variant={selectedAvatar.hair === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAvatar(prev => ({ ...prev, hair: option }))}
                        className="capitalize"
                      >
                        {option.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clothes */}
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">
                    Outfit
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.clothes.map((option) => (
                      <Button
                        key={option}
                        variant={selectedAvatar.clothes === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAvatar(prev => ({ ...prev, clothes: option }))}
                        className="capitalize"
                      >
                        {option.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Accessories */}
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">
                    Accessories
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.accessories.map((option) => (
                      <Badge
                        key={option}
                        variant={selectedAvatar.accessories.includes(option) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleAccessory(option)}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  className="w-full font-heading"
                  size="lg"
                >
                  Choose Theme <Sparkles weight="fill" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Pick Your Adventure Theme
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => !theme.locked && setSelectedTheme(theme.id)}
                    disabled={theme.locked}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTheme === theme.id
                        ? 'border-primary shadow-lg'
                        : 'border-border hover:border-primary/50'
                    } ${theme.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`h-16 rounded-lg mb-2 ${theme.color}`} />
                    <p className="font-heading font-medium text-foreground">{theme.name}</p>
                    {theme.locked && (
                      <Badge variant="secondary" className="mt-1">
                        🔒 Locked
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={handleComplete}
                className="w-full font-heading text-lg"
                size="lg"
              >
                Start Learning Adventure! 🚀
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
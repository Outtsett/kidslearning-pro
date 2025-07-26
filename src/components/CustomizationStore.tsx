import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coins, Lock, ShoppingCart, X } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import type { UserProfile } from '@/App'
import { toast } from 'sonner'

interface CustomizationStoreProps {
  profile: UserProfile
  onProfileUpdate: (updater: (profile: UserProfile) => UserProfile) => void
  onClose: () => void
}

const STORE_ITEMS = {
  clothes: [
    { id: 'rainbow-shirt', name: 'Rainbow Shirt', price: 50, premium: false },
    { id: 'space-suit', name: 'Space Suit', price: 100, premium: false },
    { id: 'princess-dress', name: 'Princess Dress', price: 80, premium: false },
    { id: 'superhero-cape', name: 'Superhero Cape', price: 120, premium: true },
    { id: 'wizard-robe', name: 'Wizard Robe', price: 150, premium: true }
  ],
  accessories: [
    { id: 'magic-wand', name: 'Magic Wand', price: 30, premium: false },
    { id: 'crown', name: 'Royal Crown', price: 75, premium: false },
    { id: 'wings', name: 'Fairy Wings', price: 60, premium: false },
    { id: 'jetpack', name: 'Jetpack', price: 200, premium: true },
    { id: 'unicorn-horn', name: 'Unicorn Horn', price: 90, premium: true }
  ],
  themes: [
    { id: 'space', name: 'Space Journey', price: 100, premium: false, color: 'bg-purple-200' },
    { id: 'candy', name: 'Candy Land', price: 80, premium: false, color: 'bg-pink-200' },
    { id: 'underwater', name: 'Underwater World', price: 120, premium: true, color: 'bg-blue-300' },
    { id: 'rainbow', name: 'Rainbow Paradise', price: 150, premium: true, color: 'bg-gradient-to-r from-red-200 to-purple-200' }
  ]
}

export function CustomizationStore({ profile, onProfileUpdate, onClose }: CustomizationStoreProps) {
  const [previewAvatar, setPreviewAvatar] = useState(profile.avatar)
  const [previewTheme, setPreviewTheme] = useState(profile.theme)

  const isUnlocked = (itemId: string) => profile.unlockedItems.includes(itemId)
  const canAfford = (price: number) => profile.coins >= price

  const purchaseItem = (itemId: string, price: number, category: 'clothes' | 'accessories' | 'themes') => {
    if (!canAfford(price)) {
      toast.error("Not enough coins! Complete more activities to earn coins.")
      return
    }

    if (isUnlocked(itemId)) {
      toast.error("You already own this item!")
      return
    }

    onProfileUpdate((current) => ({
      ...current,
      coins: current.coins - price,
      unlockedItems: [...current.unlockedItems, itemId]
    }))

    toast.success(`🎉 You purchased ${itemId.replace('-', ' ')}!`)
  }

  const equipItem = (itemId: string, category: 'clothes' | 'accessories' | 'themes') => {
    if (!isUnlocked(itemId)) return

    if (category === 'clothes') {
      setPreviewAvatar(prev => ({ ...prev, clothes: itemId }))
    } else if (category === 'accessories') {
      setPreviewAvatar(prev => ({
        ...prev,
        accessories: prev.accessories.includes(itemId)
          ? prev.accessories.filter(a => a !== itemId)
          : [...prev.accessories, itemId]
      }))
    } else if (category === 'themes') {
      setPreviewTheme(itemId)
    }
  }

  const saveChanges = () => {
    onProfileUpdate((current) => ({
      ...current,
      avatar: previewAvatar,
      theme: previewTheme
    }))
    toast.success("Your avatar has been updated!")
    onClose()
  }

  const renderStoreSection = (items: any[], category: 'clothes' | 'accessories' | 'themes') => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const unlocked = isUnlocked(item.id)
          const affordable = canAfford(item.price)
          const equipped = category === 'clothes' 
            ? previewAvatar.clothes === item.id
            : category === 'accessories'
            ? previewAvatar.accessories.includes(item.id)
            : previewTheme === item.id

          return (
            <Card 
              key={item.id} 
              className={`cursor-pointer transition-all ${
                equipped ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => unlocked && equipItem(item.id, category)}
            >
              <CardHeader className="pb-2">
                {category === 'themes' ? (
                  <div className={`h-16 rounded-lg ${item.color} border-2 border-white shadow-sm`} />
                ) : (
                  <div className="h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-2xl">
                    {category === 'clothes' ? '👕' : '✨'}
                  </div>
                )}
                <CardTitle className="text-sm font-heading">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-600" />
                    {item.price}
                  </Badge>
                  {item.premium && (
                    <Badge variant="secondary">Premium</Badge>
                  )}
                </div>

                {!unlocked ? (
                  <Button
                    size="sm"
                    variant={affordable ? "default" : "secondary"}
                    disabled={!affordable}
                    onClick={(e) => {
                      e.stopPropagation()
                      purchaseItem(item.id, item.price, category)
                    }}
                    className="w-full"
                  >
                    {affordable ? (
                      <>
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Buy
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Need {item.price - profile.coins} more
                      </>
                    )}
                  </Button>
                ) : equipped ? (
                  <Badge variant="default" className="w-full justify-center">
                    Equipped
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline" className="w-full">
                    Equip
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Customization Store
            </h1>
            <p className="font-body text-muted-foreground">
              Make your avatar unique with awesome items!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2 p-2">
              <Coins className="w-4 h-4 text-yellow-600" weight="fill" />
              <span className="font-heading font-semibold">{profile.coins}</span>
            </Badge>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Avatar Preview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-heading text-center">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <AvatarDisplay avatar={previewAvatar} size="large" />
              </div>
              <div className="text-center">
                <p className="font-body text-sm text-muted-foreground mb-2">
                  Theme: {previewTheme}
                </p>
                <Button onClick={saveChanges} className="w-full font-heading">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Store Items */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="clothes" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clothes" className="font-heading">Clothes</TabsTrigger>
                <TabsTrigger value="accessories" className="font-heading">Accessories</TabsTrigger>
                <TabsTrigger value="themes" className="font-heading">Themes</TabsTrigger>
              </TabsList>

              <TabsContent value="clothes" className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">Clothing Collection</h3>
                {renderStoreSection(STORE_ITEMS.clothes, 'clothes')}
              </TabsContent>

              <TabsContent value="accessories" className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">Awesome Accessories</h3>
                {renderStoreSection(STORE_ITEMS.accessories, 'accessories')}
              </TabsContent>

              <TabsContent value="themes" className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">Adventure Themes</h3>
                {renderStoreSection(STORE_ITEMS.themes, 'themes')}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
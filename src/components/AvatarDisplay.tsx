interface AvatarDisplayProps {
  avatar: {
    body: string
    hair: string
    clothes: string
    accessories: string[]
  }
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const AVATAR_EMOJIS = {
  body: {
    light: '👶🏻',
    medium: '👶🏽',
    dark: '👶🏿',
    tan: '👶🏾'
  },
  hair: {
    'brown-short': '🟤',
    'blonde-long': '🟡',
    'black-curly': '⚫',
    'red-pigtails': '🔴',
    'blue-spiky': '🔵'
  },
  clothes: {
    'red-tshirt': '👕',
    'blue-dress': '👗',
    'green-hoodie': '🧥',
    'purple-shirt': '👔',
    'yellow-overalls': '👖'
  },
  accessories: {
    glasses: '👓',
    hat: '👒',
    bow: '🎀',
    necklace: '📿',
    backpack: '🎒'
  }
}

export function AvatarDisplay({ avatar, size = 'medium', className }: AvatarDisplayProps) {
  const sizeClasses = {
    small: 'w-16 h-16 text-2xl',
    medium: 'w-24 h-24 text-4xl',
    large: 'w-32 h-32 text-6xl'
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      bg-gradient-to-br from-primary/10 to-secondary/10 
      rounded-full border-4 border-white shadow-lg
      flex flex-col items-center justify-center
      relative overflow-hidden
      ${className}
    `}>
      {/* Base avatar with body and hair */}
      <div className="relative">
        <span>{AVATAR_EMOJIS.body[avatar.body as keyof typeof AVATAR_EMOJIS.body]}</span>
        <span className="absolute -top-2 -left-1 text-xs">
          {AVATAR_EMOJIS.hair[avatar.hair as keyof typeof AVATAR_EMOJIS.hair]}
        </span>
      </div>
      
      {/* Clothes */}
      <div className="absolute bottom-1">
        <span className="text-xs">
          {AVATAR_EMOJIS.clothes[avatar.clothes as keyof typeof AVATAR_EMOJIS.clothes]}
        </span>
      </div>

      {/* Accessories */}
      {avatar.accessories.length > 0 && (
        <div className="absolute top-0 right-0 flex flex-col">
          {avatar.accessories.slice(0, 2).map((accessory, index) => (
            <span key={accessory} className="text-xs">
              {AVATAR_EMOJIS.accessories[accessory as keyof typeof AVATAR_EMOJIS.accessories]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
import { Avatar3D } from './Avatar3D'

interface AvatarDisplayProps {
  avatar: {
    body: string
    hair: string
    clothes: string
    accessories: string[]
  }
  size?: 'small' | 'medium' | 'large'
  className?: string
  emotion?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'thinking'
  animated?: boolean
}

export function AvatarDisplay({ 
  avatar, 
  size = 'medium', 
  className,
  emotion = 'happy',
  animated = true
}: AvatarDisplayProps) {
  return (
    <Avatar3D
      avatar={avatar}
      size={size}
      className={className}
      emotion={emotion}
      animated={animated}
    />
  )
}
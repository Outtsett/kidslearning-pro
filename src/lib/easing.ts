// Custom easing functions for Framer Motion
export const customEasing = {
  // Power functions
  pow2: (t: number) => t * t,
  pow3: (t: number) => t * t * t,
  pow4: (t: number) => t * t * t * t,
  
  // Power in/out combinations
  pow2InOut: (t: number) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  },
  
  // Bounce function
  bounceOut: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
    }
  },
  
  // Elastic function
  elasticOut: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
  
  // Back function
  backOut: (t: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }
}

// Animation presets for different scenarios
export const animationPresets = {
  // Gentle animations for ages 3-5
  gentle: {
    duration: 0.8,
    ease: customEasing.pow2InOut
  },
  
  // Playful animations for ages 6-9
  playful: {
    duration: 0.6,
    ease: customEasing.backOut
  },
  
  // Sharp animations for ages 10-12
  sharp: {
    duration: 0.4,
    ease: customEasing.pow3
  },
  
  // Celebration animations
  celebration: {
    duration: 1.2,
    ease: customEasing.elasticOut
  },
  
  // Success feedback
  success: {
    duration: 0.5,
    ease: customEasing.bounceOut
  }
}

// Helper function to get age-appropriate animation preset
export function getAgeAppropriateAnimation(ageGroup: '3-5' | '6-9' | '10-12', type: 'default' | 'celebration' | 'success' = 'default') {
  if (type === 'celebration') return animationPresets.celebration
  if (type === 'success') return animationPresets.success
  
  switch (ageGroup) {
    case '3-5': return animationPresets.gentle
    case '6-9': return animationPresets.playful  
    case '10-12': return animationPresets.sharp
    default: return animationPresets.gentle
  }
}
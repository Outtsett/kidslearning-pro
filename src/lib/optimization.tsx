import { useEffect, useRef, useState, useCallback } from 'react'
import { useDebounce } from 'use-debounce'

// Performance monitoring for child-friendly interactions
export function usePerformanceOptimization() {
  const [fps, setFps] = useState(60)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(Date.now())
  const animationFrameId = useRef<number>()

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++
      const now = Date.now()
      
      if (now - lastTime.current >= 1000) {
        const currentFPS = Math.round((frameCount.current * 1000) / (now - lastTime.current))
        setFps(currentFPS)
        setIsLowPerformance(currentFPS < 30)
        
        frameCount.current = 0
        lastTime.current = now
      }
      
      animationFrameId.current = requestAnimationFrame(measureFPS)
    }

    animationFrameId.current = requestAnimationFrame(measureFPS)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  const getOptimizedAnimationConfig = useCallback(() => {
    if (isLowPerformance) {
      return {
        reduceMotion: true,
        animationDuration: 'fast',
        particleCount: 'low',
        complexEffects: false
      }
    }
    
    return {
      reduceMotion: false,
      animationDuration: 'normal',
      particleCount: 'normal',
      complexEffects: true
    }
  }, [isLowPerformance])

  return {
    fps,
    isLowPerformance,
    getOptimizedAnimationConfig
  }
}

// Intelligent animation queuing to prevent overwhelming younger users
export function useAnimationQueue() {
  const [queue, setQueue] = useState<Array<{ id: string, priority: number, execute: () => void }>>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [debouncedQueue] = useDebounce(queue, 200)

  const addAnimation = useCallback((animation: { id: string, priority: number, execute: () => void }) => {
    setQueue(prev => {
      // Remove duplicates and add new animation
      const filtered = prev.filter(item => item.id !== animation.id)
      return [...filtered, animation].sort((a, b) => b.priority - a.priority)
    })
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    if (debouncedQueue.length > 0 && !isPlaying) {
      setIsPlaying(true)
      const animation = debouncedQueue[0]
      
      animation.execute()
      
      // Remove completed animation after a delay
      setTimeout(() => {
        setQueue(prev => prev.filter(item => item.id !== animation.id))
        setIsPlaying(false)
      }, 1000) // Adjust based on typical animation duration
    }
  }, [debouncedQueue, isPlaying])

  return {
    addAnimation,
    clearQueue,
    queueLength: queue.length,
    isPlaying
  }
}

// Memory-efficient image loading for educational content
export function useOptimizedImages() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map())

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve()
        return
      }

      if (failedImages.has(src)) {
        reject(new Error('Image previously failed to load'))
        return
      }

      if (imageCache.current.has(src)) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        imageCache.current.set(src, img)
        setLoadedImages(prev => new Set([...prev, src]))
        resolve()
      }
      img.onerror = () => {
        setFailedImages(prev => new Set([...prev, src]))
        reject(new Error('Failed to load image'))
      }
      img.src = src
    })
  }, [loadedImages, failedImages])

  const preloadImages = useCallback(async (srcs: string[]) => {
    const promises = srcs.map(src => preloadImage(src).catch(() => null))
    await Promise.allSettled(promises)
  }, [preloadImage])

  const isImageLoaded = useCallback((src: string) => loadedImages.has(src), [loadedImages])
  const hasImageFailed = useCallback((src: string) => failedImages.has(src), [failedImages])

  return {
    preloadImage,
    preloadImages,
    isImageLoaded,
    hasImageFailed,
    loadedCount: loadedImages.size,
    failedCount: failedImages.size
  }
}

// Accessibility-first interaction helpers
export function useAccessibleInteractions() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [preferReducedMotion, setPreferReducedMotion] = useState(false)

  useEffect(() => {
    // Detect keyboard usage
    const handleKeyDown = () => setIsKeyboardUser(true)
    const handleMouseDown = () => setIsKeyboardUser(false)

    // Check for accessibility preferences
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)')
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    setIsHighContrast(mediaQueryHighContrast.matches)
    setPreferReducedMotion(mediaQueryReducedMotion.matches)

    // Listen for changes
    const handleContrastChange = (e: MediaQueryListEvent) => setIsHighContrast(e.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setPreferReducedMotion(e.matches)

    mediaQueryHighContrast.addEventListener('change', handleContrastChange)
    mediaQueryReducedMotion.addEventListener('change', handleMotionChange)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      mediaQueryHighContrast.removeEventListener('change', handleContrastChange)
      mediaQueryReducedMotion.removeEventListener('change', handleMotionChange)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const getAccessibleAnimationConfig = useCallback(() => {
    return {
      duration: preferReducedMotion ? 0.1 : 1,
      easing: preferReducedMotion ? 'linear' : 'ease-out',
      particles: preferReducedMotion ? 0 : 'normal',
      contrast: isHighContrast ? 'high' : 'normal'
    }
  }, [preferReducedMotion, isHighContrast])

  return {
    isKeyboardUser,
    isHighContrast,
    preferReducedMotion,
    getAccessibleAnimationConfig
  }
}

// Child-safe interaction boundaries
export function useSafeInteractions(ageGroup: '3-5' | '6-9' | '10-12') {
  const [interactionCount, setInteractionCount] = useState(0)
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const [isOverstimulated, setIsOverstimulated] = useState(false)

  const getAgeAppropriateSettings = useCallback(() => {
    switch (ageGroup) {
      case '3-5':
        return {
          maxInteractionsPerMinute: 10,
          cooldownPeriod: 2000,
          maxParticles: 5,
          animationComplexity: 'simple'
        }
      case '6-9':
        return {
          maxInteractionsPerMinute: 20,
          cooldownPeriod: 1000,
          maxParticles: 10,
          animationComplexity: 'moderate'
        }
      case '10-12':
        return {
          maxInteractionsPerMinute: 30,
          cooldownPeriod: 500,
          maxParticles: 15,
          animationComplexity: 'complex'
        }
    }
  }, [ageGroup])

  const settings = getAgeAppropriateSettings()

  const trackInteraction = useCallback(() => {
    const now = Date.now()
    setLastInteraction(now)
    setInteractionCount(prev => {
      const newCount = prev + 1
      
      // Reset counter every minute
      setTimeout(() => {
        setInteractionCount(c => Math.max(0, c - 1))
      }, 60000)

      // Check for overstimulation
      if (newCount > settings.maxInteractionsPerMinute) {
        setIsOverstimulated(true)
        setTimeout(() => setIsOverstimulated(false), 10000) // 10 second cooldown
      }

      return newCount
    })
  }, [settings.maxInteractionsPerMinute])

  const shouldAllowInteraction = useCallback(() => {
    const now = Date.now()
    const timeSinceLastInteraction = now - lastInteraction
    
    return !isOverstimulated && timeSinceLastInteraction >= settings.cooldownPeriod
  }, [isOverstimulated, lastInteraction, settings.cooldownPeriod])

  return {
    trackInteraction,
    shouldAllowInteraction,
    isOverstimulated,
    interactionCount,
    settings
  }
}

// Comprehensive performance and accessibility provider
export function OptimizationProvider({ children }: { children: React.ReactNode }) {
  const performance = usePerformanceOptimization()
  const accessibility = useAccessibleInteractions()

  useEffect(() => {
    // Add CSS class for reduced motion if needed
    if (accessibility.preferReducedMotion) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }

    // Add CSS class for high contrast if needed
    if (accessibility.isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    // Add CSS class for low performance if needed
    if (performance.isLowPerformance) {
      document.documentElement.classList.add('low-performance')
    } else {
      document.documentElement.classList.remove('low-performance')
    }
  }, [accessibility.preferReducedMotion, accessibility.isHighContrast, performance.isLowPerformance])

  return <>{children}</>
}
import { useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

/**
 * Custom hook for managing animations with proper refs
 * Provides stable references and cleanup
 */
export function useAnimationRef<T extends Element = HTMLDivElement>() {
  const elementRef = useRef<T>(null)
  const animationRef = useRef<gsap.core.Timeline | null>(null)

  // Cleanup function to kill animations
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill()
      animationRef.current = null
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Function to safely create animations
  const createAnimation = useCallback((animationFn: (element: T) => gsap.core.Timeline) => {
    if (elementRef.current) {
      cleanup() // Kill any existing animation
      animationRef.current = animationFn(elementRef.current)
      return animationRef.current
    }
    return null
  }, [cleanup])

  return {
    ref: elementRef,
    createAnimation,
    cleanup,
    element: elementRef.current
  }
}

/**
 * Hook for managing multiple animation refs
 */
export function useMultipleAnimationRefs<T extends Element = HTMLDivElement>(count: number) {
  const refs = useRef<(T | null)[]>(Array(count).fill(null))
  const animations = useRef<(gsap.core.Timeline | null)[]>(Array(count).fill(null))

  const cleanup = useCallback(() => {
    animations.current.forEach(animation => {
      if (animation) {
        animation.kill()
      }
    })
    animations.current.fill(null)
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const setRef = useCallback((index: number) => (element: T | null) => {
    refs.current[index] = element
  }, [])

  const createAnimation = useCallback((index: number, animationFn: (element: T) => gsap.core.Timeline) => {
    const element = refs.current[index]
    if (element) {
      // Kill existing animation for this index
      if (animations.current[index]) {
        animations.current[index]!.kill()
      }
      animations.current[index] = animationFn(element)
      return animations.current[index]
    }
    return null
  }, [])

  return {
    setRef,
    createAnimation,
    cleanup,
    elements: refs.current
  }
}

/**
 * Hook for managing interval-based animations with proper cleanup
 */
export function useAnimationInterval(callback: () => void, delay: number | null, dependencies: React.DependencyList = []) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Setup and cleanup interval
  useEffect(() => {
    if (delay !== null) {
      intervalRef.current = setInterval(() => {
        callbackRef.current()
      }, delay)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  }, [delay, ...dependencies])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const clearAnimationInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return { clearAnimationInterval }
}

/**
 * Hook for managing timeout-based animations with proper cleanup
 */
export function useAnimationTimeout(callback: () => void, delay: number | null, dependencies: React.DependencyList = []) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Setup and cleanup timeout
  useEffect(() => {
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => {
        callbackRef.current()
      }, delay)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }
  }, [delay, ...dependencies])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const clearAnimationTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return { clearAnimationTimeout }
}
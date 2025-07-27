import { motion } from 'framer-motion'

// Simple test component to verify motion library works correctly
export function MotionTest() {
  return (
    <motion.div
      className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-primary-foreground">✓</span>
    </motion.div>
  )
}
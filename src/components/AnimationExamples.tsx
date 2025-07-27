import { motion } from 'framer-motion'
import { customEasing, getAgeAppropriateAnimation } from '@/lib/easing'

// Example component showing proper easing usage
export function AnimationExample() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold">Animation Easing Examples</h2>
      
      {/* Using built-in Framer Motion easing strings */}
      <motion.div
        className="w-16 h-16 bg-blue-500 rounded"
        animate={{ x: 100 }}
        transition={{
          duration: 1,
          ease: "easeInOut" // ✅ Valid Framer Motion easing
        }}
      />
      
      {/* Using custom easing function */}
      <motion.div
        className="w-16 h-16 bg-green-500 rounded"
        animate={{ x: 100 }}
        transition={{
          duration: 1,
          ease: customEasing.pow2 // ✅ Custom function
        }}
      />
      
      {/* Using age-appropriate preset */}
      <motion.div
        className="w-16 h-16 bg-purple-500 rounded"
        animate={{ x: 100 }}
        transition={getAgeAppropriateAnimation('6-9', 'celebration')}
      />
      
      {/* Array of valid Framer Motion easing strings */}
      <div className="text-sm text-gray-600">
        <p>Valid Framer Motion easing strings:</p>
        <ul className="list-disc list-inside">
          <li>"linear"</li>
          <li>"easeIn", "easeOut", "easeInOut"</li>
          <li>"circIn", "circOut", "circInOut"</li>
          <li>"backIn", "backOut", "backInOut"</li>
          <li>"anticipate"</li>
        </ul>
      </div>
      
      {/* Demonstrating the error */}
      <div className="bg-red-100 p-4 rounded">
        <p className="text-red-700 font-semibold">❌ This would cause an error:</p>
        <code>ease: "pow2" // Invalid - not a built-in Framer Motion string</code>
        
        <p className="text-green-700 font-semibold mt-2">✅ Correct alternatives:</p>
        <code>ease: customEasing.pow2 // Custom function</code><br/>
        <code>ease: "easeInOut" // Built-in string</code>
      </div>
    </div>
  )
}
import React from 'react'
import { Button } from '@/components/ui/button'

// Simple test component to verify basic functionality
export function SimpleTest() {
  const handleClick = () => {
    console.log('Simple test button clicked')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-heading text-primary mb-4">
          KidsLearning Pro Test
        </h1>
        <p className="text-foreground mb-4">
          If you can see this, the basic app is working correctly.
        </p>
        <Button onClick={handleClick} className="font-heading">
          Test Button
        </Button>
      </div>
    </div>
  )
}
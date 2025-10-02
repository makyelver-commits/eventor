"use client"

import { useEffect, useState, useMemo } from 'react'

interface SimpleStar {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
}

interface FloatingNumber {
  id: string
  value: string
  x: number
  y: number
  size: number
  opacity: number
  color: string
  animationDuration: number
  delay: number
}

export default function EnhancedBackground() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    updateDimensions()
    
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Simplified star field - only 30 stars instead of 100
  const stars = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return []
    
    const newStars: SimpleStar[] = []
    const starCount = 30 // Reduced from 100
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 3 + 2
      })
    }
    
    return newStars
  }, [dimensions])

  // Floating numbers from 1 to 31 with project colors
  const floatingNumbers = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return []
    
    const numbers: FloatingNumber[] = []
    const projectColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B']
    
    // Create multiple instances of each number
    for (let day = 1; day <= 31; day++) {
      const instances = Math.floor(Math.random() * 3) + 2 // 2-4 instances per number
      
      for (let i = 0; i < instances; i++) {
        numbers.push({
          id: `${day}-${i}`,
          value: day.toString(),
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 20 + 12, // 12-32px
          opacity: 0,
          color: projectColors[Math.floor(Math.random() * projectColors.length)],
          animationDuration: Math.random() * 4 + 3, // 3-7 seconds
          delay: Math.random() * 8 // 0-8 seconds delay
        })
      }
    }
    
    return numbers
  }, [dimensions])

  if (dimensions.width === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20" />
      
      {/* Simple mouse follower - single layer */}
      <div 
        className="absolute rounded-full opacity-30"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.3s ease-out',
        }}
      />
      
      {/* Simplified star field */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
          }}
        />
      ))}
      
      {/* Floating numbers from 1 to 31 */}
      {floatingNumbers.map((number) => (
        <div
          key={number.id}
          className="absolute font-bold select-none"
          style={{
            left: `${number.x}px`,
            top: `${number.y}px`,
            fontSize: `${number.size}px`,
            color: number.color,
            opacity: number.opacity,
            fontFamily: 'var(--font-sans)',
            animation: `fadeInOut ${number.animationDuration}s ease-in-out ${number.delay}s infinite`,
            textShadow: `0 0 10px ${number.color}40, 0 0 20px ${number.color}20`,
            transform: 'translateZ(0)',
            willChange: 'opacity, transform',
          }}
        >
          {number.value}
        </div>
      ))}
      
      {/* Simple floating orbs - only 4 instead of 8 */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.sin(Date.now() / 1000 + i) * 150 + dimensions.width / 2}px`,
            top: `${Math.cos(Date.now() / 1000 + i * 0.7) * 100 + dimensions.height / 2}px`,
            width: '15px',
            height: '15px',
            background: `radial-gradient(circle, ${['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'][i % 4]}30, transparent)`,
            opacity: 0.2,
            filter: 'blur(4px)',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s linear',
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
        
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          20% {
            opacity: 0.6;
            transform: translateY(0px) scale(1);
          }
          80% {
            opacity: 0.6;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
        }
      `}</style>
    </div>
  )
}

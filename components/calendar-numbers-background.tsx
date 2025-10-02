"use client"

import { useEffect, useState, useMemo } from 'react'

interface FloatingNumber {
  id: number
  value: number
  x: number
  y: number
  size: number
  opacity: number
  animationDuration: number
  delay: number
}

export default function CalendarNumbersBackground() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    updateDimensions()
    checkDarkMode()
    
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('storage', checkDarkMode)
    
    // Observer for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('storage', checkDarkMode)
      observer.disconnect()
    }
  }, [])

  const numbers = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return []
    
    const newNumbers: FloatingNumber[] = []
    
    // Generate 31 numbers (days of the month) with multiple instances
    for (let i = 1; i <= 31; i++) {
      // Create 2-3 instances of each number for better coverage
      const instances = Math.floor(Math.random() * 2) + 2
      
      for (let j = 0; j < instances; j++) {
        newNumbers.push({
          id: i * 100 + j,
          value: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 16 + 14, // 14px to 30px
          opacity: isDarkMode ? Math.random() * 0.3 + 0.1 : Math.random() * 0.25 + 0.05, // Higher opacity in dark mode
          animationDuration: Math.random() * 8 + 12, // 12s to 20s
          delay: Math.random() * 8 // 0s to 8s delay
        })
      }
    }
    
    return newNumbers
  }, [dimensions, isDarkMode])

  if (dimensions.width === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {numbers.map((number) => (
        <div
          key={number.id}
          className="absolute font-bold select-none"
          style={{
            left: `${number.x}px`,
            top: `${number.y}px`,
            fontSize: `${number.size}px`,
            opacity: number.opacity,
            fontFamily: 'var(--font-sans)',
            animation: `floatNumber ${number.animationDuration}s ease-in-out ${number.delay}s infinite`,
            textShadow: isDarkMode 
              ? `0 0 8px rgba(0, 255, 255, 0.8), 0 0 16px rgba(255, 0, 255, 0.6), 0 0 24px rgba(0, 255, 255, 0.4)`
              : '0 0 8px rgba(102, 126, 234, 0.2)',
            background: isDarkMode
              ? 'linear-gradient(135deg, #00ffff, #ff00ff, #00ff00, #ffff00)'
              : 'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.6), rgba(240, 147, 251, 0.4))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            filter: isDarkMode ? 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))' : 'none'
          }}
        >
          {number.value}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes floatNumber {
          0% {
            opacity: ${isDarkMode ? '0.1' : '0.05'};
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg) translateZ(0);
          }
          25% {
            opacity: ${isDarkMode ? '0.3' : '0.2'};
            transform: translateY(-15px) translateX(8px) scale(1.1) rotate(2deg) translateZ(0);
          }
          50% {
            opacity: ${isDarkMode ? '0.2' : '0.1'};
            transform: translateY(-30px) translateX(-8px) scale(0.95) rotate(-1deg) translateZ(0);
          }
          75% {
            opacity: ${isDarkMode ? '0.4' : '0.25'};
            transform: translateY(-15px) translateX(4px) scale(1.05) rotate(1deg) translateZ(0);
          }
          90% {
            opacity: ${isDarkMode ? '0.1' : '0.05'};
            transform: translateY(-5px) translateX(2px) scale(1) rotate(0deg) translateZ(0);
          }
          100% {
            opacity: ${isDarkMode ? '0.1' : '0.05'};
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg) translateZ(0);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          @keyframes floatNumber {
            0%, 100% {
              opacity: ${isDarkMode ? '0.15' : '0.1'};
              transform: translateY(0px) translateX(0px) scale(1) rotate(0deg) translateZ(0);
            }
          }
        }
        
        @media (max-width: 768px) {
          @keyframes floatNumber {
            0% {
              opacity: ${isDarkMode ? '0.08' : '0.05'};
              transform: translateY(0px) translateX(0px) scale(1) rotate(0deg) translateZ(0);
            }
            25% {
              opacity: ${isDarkMode ? '0.2' : '0.15'};
              transform: translateY(-8px) translateX(4px) scale(1.05) rotate(1deg) translateZ(0);
            }
            50% {
              opacity: ${isDarkMode ? '0.12' : '0.08'};
              transform: translateY(-15px) translateX(-4px) scale(0.98) rotate(-0.5deg) translateZ(0);
            }
            75% {
              opacity: ${isDarkMode ? '0.25' : '0.18'};
              transform: translateY(-8px) translateX(2px) scale(1.02) rotate(0.5deg) translateZ(0);
            }
            90% {
              opacity: ${isDarkMode ? '0.08' : '0.05'};
              transform: translateY(-3px) translateX(1px) scale(1) rotate(0deg) translateZ(0);
            }
            100% {
              opacity: ${isDarkMode ? '0.08' : '0.05'};
              transform: translateY(0px) translateX(0px) scale(1) rotate(0deg) translateZ(0);
            }
          }
        }
      `}</style>
    </div>
  )
}

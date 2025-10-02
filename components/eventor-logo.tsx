"use client"

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

interface EventorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

export default function EventorLogo({ size = 'md', showText = true, className = '' }: EventorLogoProps) {
  const [currentNumber, setCurrentNumber] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-lg',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-20 w-20 text-2xl'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  // Función para cambiar el número
  const changeNumber = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentNumber(prev => (prev % 31) + 1)
      setIsAnimating(false)
    }, 150)
  }

  // Efecto para detectar clicks en toda la página
  useEffect(() => {
    const handleClick = () => {
      changeNumber()
    }

    document.addEventListener('click', handleClick)
    
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Container - Recuadro negro con número */}
      <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); changeNumber(); }}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
        
        {/* Logo Number Container */}
        <div className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700 shadow-2xl group-hover:scale-105 transition-all duration-300 flex items-center justify-center`}>
          {/* Número con animación */}
          <div className={`text-white font-bold transition-all duration-150 ${isAnimating ? 'scale-0 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}>
            {currentNumber}
          </div>
          
          {/* Efectos de superposición */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Efecto de línea brillante */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />
          
          {/* Efecto de borde animado */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        </div>
        
        {/* Floating Icons */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-0">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1 rounded-full shadow-lg">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
        
        {/* Indicador de click */}
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full opacity-75 animate-ping" />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold ${textSizes[size]} bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-none tracking-wider`}>
            EVENTOR
          </h1>
          <p className="text-xs text-gray-400 leading-none mt-1">
            Calendario de eventos by MakyForce
          </p>
        </div>
      )}
    </div>
  )
}

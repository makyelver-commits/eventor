"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import EnhancedBackground from '@/components/enhanced-background'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        const data = await response.json()
        setIsSubmitted(true)
        toast({
          title: "Email enviado",
          description: "Revisa tu bandeja de entrada para el enlace de recuperación"
        })
        
        // Log debug info in development
        if (process.env.NODE_ENV === 'development' && data.debugInfo) {
          console.log('Debug Info:', data.debugInfo)
          console.log('Reset Link:', data.debugInfo.resetLink)
          console.log('Token:', data.debugInfo.token)
          console.log('Email Sent Status:', data.debugInfo.emailSent)
        }
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "No se pudo procesar la solicitud",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <EnhancedBackground />
        
        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-gray-800/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Email Enviado
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Revisa tu bandeja de entrada
              </p>
            </CardHeader>
            
            <CardContent className="pt-4 text-center">
              <p className="text-gray-300 mb-4">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <strong>Importante:</strong> Revisa tu bandeja de entrada y carpeta de spam. 
                  El enlace expirará en 1 hora.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Link href="/auth">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <EnhancedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gray-800/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Mail className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Recuperar Contraseña
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Te enviaremos un enlace para restablecer tu contraseña
            </p>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto" />
                  ) : (
                    'Enviar Enlace de Recuperación'
                  )}
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Link href="/auth">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Login
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

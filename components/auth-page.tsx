"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User, Calendar, ArrowRight, UserCircle, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import EnhancedBackground from "@/components/enhanced-background"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login, register, continueAsGuest } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const useDemoCredentials = () => {
    setLoginData({
      email: "admin@makyforce.com",
      password: "admin123",
    })
    toast({
      title: "Credenciales de demo cargadas",
      description: "Haz clic en 'Iniciar Sesión' para continuar",
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)

      if (success) {
        toast({
          title: "¡Bienvenido de nuevo!",
          description: "Accediendo a tu calendario...",
        })
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 500)
      } else {
        toast({
          title: "Error",
          description: "Credenciales inválidas",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await register(registerData.email, registerData.password, registerData.name)

      if (success) {
        toast({
          title: "¡Cuenta creada con éxito!",
          description: "Bienvenido a EVENTOR. Redirigiendo a tu calendario...",
        })
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 500)
      } else {
        toast({
          title: "Error",
          description: "No se pudo crear la cuenta",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestMode = () => {
    continueAsGuest()
    toast({
      title: "Modo Invitado Activado",
      description: "Puedes probar el calendario. Los datos no se guardarán al salir.",
    })
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 500)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <EnhancedBackground />

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gray-800/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EVENTOR
            </CardTitle>
            <p className="text-gray-400 text-sm">Calendario de eventos by MakyForce</p>
          </CardHeader>

          <CardContent className="pt-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-700/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Alert className="mb-4 bg-blue-900/30 border-blue-700/50">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-sm text-gray-300">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-blue-400">Credenciales de prueba:</span>
                      <span className="text-xs">Email: admin@makyforce.com</span>
                      <span className="text-xs">Contraseña: admin123</span>
                      <Button
                        type="button"
                        variant="link"
                        onClick={useDemoCredentials}
                        className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300 justify-start"
                      >
                        Usar estas credenciales →
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto" />
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-800 px-2 text-gray-400">o</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGuestMode}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 bg-transparent"
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Probar como Invitado
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-2">Los datos del modo invitado no se guardarán</p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-gray-300">
                      Nombre (opcional)
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre"
                        value={registerData.name}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-300">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={registerData.password}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-gray-300">
                      Confirmar Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto" />
                    ) : (
                      "Crear Cuenta"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-800 px-2 text-gray-400">o</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGuestMode}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 bg-transparent"
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Probar como Invitado
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-2">Los datos del modo invitado no se guardarán</p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

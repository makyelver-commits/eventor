"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name?: string
  isGuest?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
  continueAsGuest: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("eventor-user")
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("eventor-user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("[v0] Attempting login for:", email)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("[v0] Login response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Login successful")
        setUser(data.user)
        localStorage.setItem("eventor-user", JSON.stringify(data.user))
        window.dispatchEvent(new Event("storage"))
        return true
      }

      const errorData = await response.json().catch(() => ({ error: "Error de conexión" }))
      console.error("[v0] Login failed:", JSON.stringify(errorData))
      alert(errorData.error || "Error al iniciar sesión")
      return false
    } catch (error) {
      console.error("[v0] Login error:", error)
      alert("Error de red. Por favor verifica tu conexión.")
      return false
    }
  }

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      console.log("[v0] Attempting registration for:", email)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })

      console.log("[v0] Registration response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Registration successful, user ID:", data.user.id)
        setUser(data.user)
        localStorage.setItem("eventor-user", JSON.stringify(data.user))
        window.dispatchEvent(new Event("storage"))
        return true
      }

      const errorData = await response.json().catch(() => ({ error: "Error de conexión" }))
      console.error("[v0] Registration failed:", JSON.stringify(errorData))
      alert(errorData.error || "Error al registrar usuario")
      return false
    } catch (error) {
      console.error("[v0] Registration error:", error)
      alert("Error de red. Por favor verifica tu conexión.")
      return false
    }
  }

  const continueAsGuest = () => {
    const guestUser: User = {
      id: "guest",
      email: "guest@eventor.app",
      name: "Invitado",
      isGuest: true,
    }
    setUser(guestUser)
    localStorage.setItem("eventor-user", JSON.stringify(guestUser))
    window.dispatchEvent(new Event("storage"))
  }

  const logout = () => {
    if (user?.isGuest) {
      localStorage.removeItem("eventor-guest-events")
    }
    setUser(null)
    localStorage.removeItem("eventor-user")
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, continueAsGuest, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

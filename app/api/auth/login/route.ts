import { type NextRequest, NextResponse } from "next/server"
import { userDb } from "@/lib/simple-db"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login API called")

    const { email, password } = await request.json()
    console.log("[v0] Login attempt for email:", email)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    console.log("[v0] Attempting to find user in database...")
    const user = await userDb.findByEmail(email)
    console.log("[v0] User query completed. User found:", !!user)

    if (!user) {
      console.log("[v0] User not found for email:", email)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    console.log("[v0] Verifying password...")
    const isValidPassword = await verifyPassword(password, user.password)
    console.log("[v0] Password verification result:", isValidPassword)

    if (!isValidPassword) {
      console.log("[v0] Invalid password for user:", email)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    console.log("[v0] Login successful for user:", email)
    return NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Unexpected login error:", error)
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json({ error: `Error al iniciar sesión: ${errorMessage}` }, { status: 500 })
  }
}

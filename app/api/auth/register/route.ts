import { type NextRequest, NextResponse } from "next/server"
import { userDb, userSettingsDb } from "@/lib/simple-db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("[v0] === REGISTER API CALLED ===")

  try {
    const body = await request.json()
    console.log("[v0] Request body received")

    const { email, password, name } = body
    console.log("[v0] Registration attempt for:", email)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("[v0] Invalid email format")
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("[v0] Password too short")
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    console.log("[v0] Checking if user exists...")
    const existingUser = await userDb.findByEmail(email)
    console.log("[v0] User check completed. Exists:", !!existingUser)

    if (existingUser) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 })
    }

    console.log("[v0] Hashing password...")
    let hashedPassword: string
    try {
      hashedPassword = await hashPassword(password)
      console.log("[v0] Password hashed successfully")
    } catch (hashError) {
      console.error("[v0] Error hashing password:", hashError)
      return NextResponse.json(
        {
          error: "Error al procesar la contraseña. Por favor intenta de nuevo.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Creating user in database...")
    const user = await userDb.create({
      email,
      password: hashedPassword,
      name: name || "Usuario",
      role: "user",
      profileName: name || "Usuario",
      profileImage: undefined,
    })
    console.log("[v0] User created successfully:", user.id)

    console.log("[v0] Creating user settings...")
    try {
      await userSettingsDb.create({
        userId: user.id,
        theme: "light",
        language: "es",
        notifications: true,
      })
      console.log("[v0] User settings created")
    } catch (settingsError) {
      console.error("[v0] Error creating user settings:", settingsError)
      // User was created but settings failed - still return success
    }

    console.log("[v0] Registration completed successfully")
    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("[v0] === UNEXPECTED REGISTRATION ERROR ===")
    console.error("[v0] Error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error name:", error.name)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }

    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json(
      {
        error: `Error al crear usuario: ${errorMessage}`,
      },
      { status: 500 },
    )
  }
}

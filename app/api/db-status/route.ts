import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Checking database status...")

    // Try to count users
    const userCount = await db.user.count()
    console.log("[v0] Database connected. User count:", userCount)

    // Try to get admin user
    const adminUser = await db.user.findUnique({
      where: { email: "admin@makyforce.com" },
    })
    console.log("[v0] Admin user exists:", !!adminUser)

    return NextResponse.json({
      status: "connected",
      userCount,
      adminExists: !!adminUser,
      message: "Base de datos conectada correctamente",
    })
  } catch (error) {
    console.error("[v0] Database status check error:", error)
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json(
      {
        status: "error",
        error: errorMessage,
        message: "Error al conectar con la base de datos. Ejecuta los scripts de inicialización.",
      },
      { status: 500 },
    )
  }
}

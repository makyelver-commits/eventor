import { type NextRequest, NextResponse } from "next/server"
import { userSettingsDb } from "@/lib/simple-db"

export async function POST(request: NextRequest) {
  console.log("[v0] === POST USER SETTINGS API CALLED ===")

  try {
    const settings = await request.json()
    const { userId, eventColors } = settings
    console.log("[v0] User settings update request for userId:", userId)

    if (!userId) {
      console.log("[v0] Missing userId")
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    const existingSettings = await userSettingsDb.findByUserId(userId)
    console.log("[v0] Existing settings found:", !!existingSettings)

    let userSettings
    if (existingSettings) {
      console.log("[v0] Updating existing settings")
      userSettings = await userSettingsDb.update(userId, {
        eventColors:
          eventColors ||
          JSON.stringify([
            { name: "Azul", color: "#3B82F6" },
            { name: "Verde", color: "#10B981" },
            { name: "Rojo", color: "#EF4444" },
            { name: "Morado", color: "#8B5CF6" },
            { name: "Naranja", color: "#F97316" },
            { name: "Rosa", color: "#EC4899" },
          ]),
      })
    } else {
      console.log("[v0] Creating new settings")
      userSettings = await userSettingsDb.create({
        userId,
        theme: "light",
        language: "es",
        notifications: true,
        eventColors:
          eventColors ||
          JSON.stringify([
            { name: "Azul", color: "#3B82F6" },
            { name: "Verde", color: "#10B981" },
            { name: "Rojo", color: "#EF4444" },
            { name: "Morado", color: "#8B5CF6" },
            { name: "Naranja", color: "#F97316" },
            { name: "Rosa", color: "#EC4899" },
          ]),
      })
    }

    console.log("[v0] User settings saved successfully")
    return NextResponse.json(userSettings)
  } catch (error) {
    console.error("[v0] Error saving user settings:", error)
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  console.log("[v0] === GET USER SETTINGS API CALLED ===")

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    console.log("[v0] Fetching settings for userId:", userId)

    if (!userId) {
      console.log("[v0] Missing userId")
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    const userSettings = await userSettingsDb.findByUserId(userId)
    console.log("[v0] Settings found:", !!userSettings)

    if (!userSettings) {
      console.log("[v0] Returning default settings")
      // Return default settings if none exist
      return NextResponse.json({
        eventColors: JSON.stringify([
          { name: "Azul", color: "#3B82F6" },
          { name: "Verde", color: "#10B981" },
          { name: "Rojo", color: "#EF4444" },
          { name: "Morado", color: "#8B5CF6" },
          { name: "Naranja", color: "#F97316" },
          { name: "Rosa", color: "#EC4899" },
        ]),
      })
    }

    console.log("[v0] Settings fetched successfully")
    return NextResponse.json(userSettings)
  } catch (error) {
    console.error("[v0] Error loading user settings:", error)
    return NextResponse.json({ error: "Error al cargar configuración" }, { status: 500 })
  }
}

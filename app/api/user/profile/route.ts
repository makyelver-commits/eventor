import { type NextRequest, NextResponse } from "next/server"
import { userDb } from "@/lib/simple-db"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === POST PROFILE API CALLED ===")
    const profile = await request.json()
    const { userId, profileName, profileImage } = profile
    console.log("[v0] Profile update request for userId:", userId)

    if (!userId) {
      console.log("[v0] Missing userId in request")
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    const updatedUser = await userDb.update(userId, {
      profileName: profileName || undefined,
      profileImage: profileImage || undefined,
    })

    if (!updatedUser) {
      console.log("[v0] User not found for update")
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    console.log("[v0] Profile updated successfully")
    return NextResponse.json({
      profileName: updatedUser.profileName,
      profileImage: updatedUser.profileImage,
    })
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] === GET PROFILE API CALLED ===")
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    console.log("[v0] Fetching profile for userId:", userId)

    if (!userId) {
      console.log("[v0] Missing userId in request")
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    const user = await userDb.findById(userId)

    if (!user) {
      console.log("[v0] User not found")
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    console.log("[v0] Profile fetched successfully")
    return NextResponse.json({
      profileName: user.profileName,
      profileImage: user.profileImage,
    })
  } catch (error) {
    console.error("[v0] Error fetching profile:", error)
    return NextResponse.json({ error: "Error al cargar perfil" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { userDb } from "@/lib/simple-db"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === POST PROFILE IMAGE API CALLED ===")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    console.log("[v0] Image upload request for userId:", userId)

    if (!file || !userId) {
      console.log("[v0] Missing file or userId")
      return NextResponse.json({ error: "Archivo y ID de usuario requeridos" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.log("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log("[v0] File too large:", file.size)
      return NextResponse.json({ error: "El archivo es demasiado grande (máximo 5MB)" }, { status: 400 })
    }

    console.log("[v0] Uploading image to Vercel Blob...")
    const blob = await put(`profile-images/${userId}-${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    console.log("[v0] Image uploaded successfully:", blob.url)

    const updatedUser = await userDb.update(userId, {
      profileImage: blob.url,
    })

    if (!updatedUser) {
      console.log("[v0] User not found for update")
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    console.log("[v0] Profile image updated successfully")
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    })
  } catch (error) {
    console.error("[v0] Error uploading image:", error)
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 })
  }
}

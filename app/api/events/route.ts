import { type NextRequest, NextResponse } from "next/server"
import { eventDb } from "@/lib/simple-db"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] === GET EVENTS API CALLED ===")
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      console.log("[v0] Error: User ID is required")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("[v0] Fetching events for userId:", userId)
    const events = await eventDb.findMany(userId)
    console.log("[v0] Events fetched successfully, count:", events.length)

    return NextResponse.json(events)
  } catch (error) {
    console.error("[v0] Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === POST EVENT API CALLED ===")
    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { title, date, time, location, color, imageUrl, notes, userId } = body

    if (!title || !date || !time || !userId) {
      console.log("[v0] Error: Missing required fields")
      return NextResponse.json({ error: "Title, date, time, and userId are required" }, { status: 400 })
    }

    console.log("[v0] Creating event for userId:", userId)
    const event = await eventDb.create({
      title,
      date,
      time,
      location: location || "",
      color: color || "#3B82F6",
      imageUrl: imageUrl || "",
      notes: notes || "",
      userId,
    })

    console.log("[v0] Event created successfully:", event.id)
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    return NextResponse.json(
      { error: "Failed to create event: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { eventDb } from "@/lib/simple-db"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log("[v0] === DELETE EVENT API CALLED ===")
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      console.log("[v0] Error: User ID is required")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("[v0] Deleting event:", id, "for userId:", userId)
    const existingEvent = await eventDb.findById(id)

    if (!existingEvent || existingEvent.userId !== userId) {
      console.log("[v0] Event not found or access denied")
      return NextResponse.json({ error: "Event not found or access denied" }, { status: 404 })
    }

    const deleted = await eventDb.delete(id)

    if (!deleted) {
      console.log("[v0] Failed to delete event")
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
    }

    console.log("[v0] Event deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log("[v0] === PUT EVENT API CALLED ===")
    const { id } = await params
    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { title, date, time, location, color, imageUrl, notes, userId } = body

    if (!userId) {
      console.log("[v0] Error: User ID is required")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("[v0] Updating event:", id, "for userId:", userId)
    const existingEvent = await eventDb.findById(id)

    if (!existingEvent || existingEvent.userId !== userId) {
      console.log("[v0] Event not found or access denied")
      return NextResponse.json({ error: "Event not found or access denied" }, { status: 404 })
    }

    const event = await eventDb.update(id, {
      title: title || existingEvent.title,
      date: date || existingEvent.date,
      time: time || existingEvent.time,
      location: location !== undefined ? location : existingEvent.location,
      color: color || existingEvent.color,
      imageUrl: imageUrl !== undefined ? imageUrl : existingEvent.imageUrl,
      notes: notes !== undefined ? notes : existingEvent.notes,
    })

    if (!event) {
      console.log("[v0] Failed to update event")
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }

    console.log("[v0] Event updated successfully")
    return NextResponse.json(event)
  } catch (error) {
    console.error("[v0] Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

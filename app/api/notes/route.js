import { NextResponse } from "next/server"
import { createNote, getNotes } from "@/lib/db-operations"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const notes = await getNotes(userId)
    return NextResponse.json({ success: true, data: notes })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, ...noteData } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const note = await createNote(userId, noteData)
    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ success: false, error: "Failed to create note" }, { status: 500 })
  }
}

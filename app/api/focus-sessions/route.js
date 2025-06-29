import { NextResponse } from "next/server"
import { createFocusSession, getFocusSessions } from "@/lib/db-operations"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const sessions = await getFocusSessions(userId)
    return NextResponse.json({ success: true, data: sessions })
  } catch (error) {
    console.error("Error fetching focus sessions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch focus sessions" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, ...sessionData } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const session = await createFocusSession(userId, sessionData)
    return NextResponse.json({ success: true, data: session })
  } catch (error) {
    console.error("Error creating focus session:", error)
    return NextResponse.json({ success: false, error: "Failed to create focus session" }, { status: 500 })
  }
}

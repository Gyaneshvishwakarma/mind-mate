import { NextResponse } from "next/server"
import { getUserSettings, updateUserSettings } from "@/lib/db-operations"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const settings = await getUserSettings(userId)
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user settings" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { userId, ...settings } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const success = await updateUserSettings(userId, settings)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ success: false, error: "Failed to update user settings" }, { status: 500 })
  }
}

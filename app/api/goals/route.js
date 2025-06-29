import { NextResponse } from "next/server"
import { createGoal, getGoals } from "@/lib/db-operations"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const goals = await getGoals(userId)
    return NextResponse.json({ success: true, data: goals })
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, ...goalData } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const goal = await createGoal(userId, goalData)
    return NextResponse.json({ success: true, data: goal })
  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json({ success: false, error: "Failed to create goal" }, { status: 500 })
  }
}

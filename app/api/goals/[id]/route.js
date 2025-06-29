import { NextResponse } from "next/server"
import { updateGoal, deleteGoal } from "@/lib/db-operations"

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body
    const { id } = params

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const success = await updateGoal(userId, id, updates)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Goal not found or unauthorized" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json({ success: false, error: "Failed to update goal" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const body = await request.json()
    const { userId } = body
    const { id } = params

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const success = await deleteGoal(userId, id)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Goal not found or unauthorized" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting goal:", error)
    return NextResponse.json({ success: false, error: "Failed to delete goal" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { updateTask, deleteTask } from "@/lib/db-operations"

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body
    const { id } = params

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const success = await updateTask(userId, id, updates)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Task not found or unauthorized" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
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

    const success = await deleteTask(userId, id)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Task not found or unauthorized" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { deleteProject } from "@/lib/db-operations"

export async function DELETE(request, { params }) {
  try {
    const body = await request.json()
    const { userId } = body
    const { id } = params

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const success = await deleteProject(userId, id)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Project not found or unauthorized" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 })
  }
}

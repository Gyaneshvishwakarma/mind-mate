// /app/api/ai-responses/route.js
import { NextResponse } from "next/server"
import {
  createAIResponse,
  getDatabase,
  deleteAIResponse,
} from "@/lib/db-operations"
import { ObjectId } from "mongodb"

// POST: Create new AI response
export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, prompt, response } = body

    if (!userId || !prompt || !response) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const created = await createAIResponse(userId, { prompt, response })

    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error("Error creating AI response:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create AI response" },
      { status: 500 }
    )
  }
}

// DELETE: Delete an AI response by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const aiResponse = await db.collection("aiResponses").findOne({
      _id: new ObjectId(id),
      userId,
    })

    if (!aiResponse) {
      return NextResponse.json(
        { success: false, error: "AI response not found or unauthorized" },
        { status: 404 }
      )
    }

    const deleted = await deleteAIResponse(userId, id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Failed to delete AI response" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "AI response deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting AI response:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete AI response" },
      { status: 500 }
    )
  }
}

// PUT: Update an AI response
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId, ...updates } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const aiResponse = await db.collection("aiResponses").findOne({
      _id: new ObjectId(id),
      userId,
    })

    if (!aiResponse) {
      return NextResponse.json(
        { success: false, error: "AI response not found or unauthorized" },
        { status: 404 }
      )
    }

    const updateData = {
      ...updates,
      updatedAt: new Date(),
    }

    const result = await db.collection("aiResponses").updateOne(
      { _id: new ObjectId(id), userId },
      { $set: updateData }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update AI response" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { id, ...updateData, userId },
    })
  } catch (error) {
    console.error("Error updating AI response:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update AI response" },
      { status: 500 }
    )
  }
}

// /api/ai-responses/route.js
import { NextResponse } from "next/server"
import {
  getAIResponses,
  createAIResponse,
} from "@/lib/db-operations" // ✅ FIXED: included missing functions

// GET: Fetch AI responses for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const aiResponses = await getAIResponses(userId)

    const formattedResponses = aiResponses.map((response) => ({
      ...response,
      createdAt: response.createdAt || new Date(),
      updatedAt: response.updatedAt || new Date(),
    }))

    return NextResponse.json({ success: true, data: formattedResponses })
  } catch (error) {
    console.error("Error fetching AI responses:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch AI responses" },
      { status: 500 }
    )
  }
}

// POST: Create a new AI response
export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, topic, response, tokens } = body

    if (!userId || !topic || !response) {
      return NextResponse.json(
        { success: false, error: "User ID, topic, and response are required" },
        { status: 400 }
      )
    }

    const aiResponseData = {
      topic,
      response,
      tokens: tokens || 0,
    }

    const newAIResponse = await createAIResponse(userId, aiResponseData)

    return NextResponse.json(
      { success: true, data: newAIResponse },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating AI response:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create AI response" },
      { status: 500 }
    )
  }
}

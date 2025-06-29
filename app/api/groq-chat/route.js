// /api/groq-chat/route.js
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Store in .env.local
})

export async function POST(request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Groq API key not configured" },
        { status: 500 }
      )
    }

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Provide comprehensive, well-structured, and informative responses. Use markdown formatting when appropriate for better readability. Be concise but thorough."
        },
        {
          role: "user",
          content: query.trim()
        }
      ],
      model: "llama3-8b-8192", // Fast and efficient model
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: false,
    })

    const response = chatCompletion.choices[0]?.message?.content || "No response generated"
    const tokens = chatCompletion.usage?.total_tokens || 0

    return NextResponse.json({
      success: true,
      response,
      tokens,
      model: "llama3-8b-8192"
    })

  } catch (error) {
    console.error("Groq API Error:", error)
    
    // Handle specific Groq API errors
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: "Invalid Groq API key" },
        { status: 401 }
      )
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }

    if (error.status === 400) {
      return NextResponse.json(
        { success: false, error: "Invalid request to Groq API" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate AI response. Please try again." 
      },
      { status: 500 }
    )
  }
}
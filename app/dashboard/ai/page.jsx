"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useProductivity } from "@/contexts/productivity-context"
import { Brain, Search, Sparkles, Copy, Trash2, MessageSquare, Zap } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
export default function AIPage() {
  const { aiResponses, addAIResponse, deleteAIResponse } = useProductivity()
  const [query, setQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  // Function to call Groq API through your backend
  const callGroqAPI = async (userQuery) => {
    const response = await fetch('/api/groq-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    return response.json()
  }

  const handleGenerateResponse = async () => {
    if (!query.trim()) return

    setIsGenerating(true)
    setError("")

    try {
      // Call Groq API through backend
      const result = await callGroqAPI(query)
      
      if (result.success) {
        await addAIResponse({
          topic: query,
          response: result.response,
          tokens: result.tokens || 0,
        })
        setQuery("")
      } else {
        setError(result.error || "Failed to generate response")
      }
    } catch (err) {
      console.error("Error calling Groq API:", err)
      setError("Failed to generate response. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const formatResponse = (text) => {
    // Simple markdown-like formatting for better display
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Brain className="h-8 w-8" />
            AI Assistant
          </h1>
          <p className="text-gray-300">Powered by Groq - Lightning fast AI responses</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-500/20 w-fit">
          <Zap className="h-4 w-4 mr-1" />
          Groq AI
        </Badge>
      </div>

      {/* AI Query Section */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ask Anything
          </CardTitle>
          <CardDescription className="text-gray-300">
            Get instant, intelligent responses powered by Groq's ultra-fast inference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Ask me anything... e.g., 'Explain quantum computing', 'Write a Python function', 'Plan a workout routine'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === "Enter" && !isGenerating && handleGenerateResponse()}
              />
            </div>
            <Button
              onClick={handleGenerateResponse}
              disabled={!query.trim() || isGenerating}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border border-blue-500/20"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Ask AI
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Try asking:</span>
            {[
              "Explain machine learning",
              "Write a todo app in React",
              "Plan a healthy meal",
              "Productivity tips",
              "Debug my code",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setQuery(suggestion)}
                className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Responses */}
      <div className="space-y-4">
        {aiResponses.length > 0 ? (
          aiResponses.map((response) => (
            <Card
              key={response.id}
              className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:bg-white/15 transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      {response.topic}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-gray-300 border-gray-500">
                        {response.tokens} tokens
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Groq
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(response.createdAt).toLocaleDateString()} at{" "}
                        {new Date(response.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(response.response)}
                      className="text-gray-400 hover:text-blue-400 hover:bg-white/10"
                      title="Copy response"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAIResponse(response.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-white/10"
                      title="Delete response"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div 
                    className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatResponse(response.response) }}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full p-6 mb-4">
                <Brain className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Ready to help!</h3>
              <p className="text-gray-400 text-center max-w-md">
                Ask me anything and I'll provide detailed, helpful responses powered by Groq's lightning-fast AI.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      {aiResponses.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-medium">Total Queries</p>
                <p className="text-2xl font-bold text-blue-400">{aiResponses.length}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-medium">Total Tokens</p>
                <p className="text-2xl font-bold text-purple-400">
                  {aiResponses.reduce((total, response) => total + response.tokens, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <Brain className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-green-400">
                  {Math.round(aiResponses.reduce((total, response) => total + response.tokens, 0) / aiResponses.length)} tokens
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
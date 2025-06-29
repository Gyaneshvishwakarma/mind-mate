"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useProductivity } from "@/contexts/productivity-context"
import { Plus, Pin, Edit, Trash2, Sparkles, StickyNote } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useProductivity()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: [],
  })

  // Sort notes (pinned first, then by date)
  const sortedNotes = notes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const handleCreateNote = () => {
    if (newNote.title.trim()) {
      addNote({
        title: newNote.title,
        content: newNote.content,
        snippet: newNote.content.slice(0, 100) + (newNote.content.length > 100 ? "..." : ""),
        tags: newNote.tags,
        isPinned: false,
      })
      setNewNote({ title: "", content: "", tags: [] })
      setIsCreateDialogOpen(false)
    }
  }

  const handleAISummarize = async (noteId) => {
    // Simulate AI summarization
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      const summary = `AI Summary: ${note.content.slice(0, 50)}... [This is a simulated AI summary]`
      updateNote(noteId, {
        content: note.content + "\n\n--- AI Summary ---\n" + summary,
      })
    }
  }

  const addTag = (tag) => {
    if (tag && !newNote.tags.includes(tag)) {
      setNewNote((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    }
  }

  const removeTag = (tagToRemove) => {
    setNewNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Notes</h1>
          <p className="text-gray-300">Organize your thoughts with AI-powered features</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription className="text-gray-300">Add a new note to your collection</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter note title..."
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white min-h-[120px]"
                  placeholder="Write your note content..."
                />
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 text-xs hover:text-red-400">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tags (press Enter)"
                  className="bg-white/10 border-white/20 text-white"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addTag(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNote}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/20"
                >
                  Create Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedNotes.map((note) => (
          <Card
            key={note.id}
            className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:bg-white/15 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    {note.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                    {note.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePinNote(note.id)}
                    className="text-gray-400 hover:text-yellow-400 hover:bg-white/10"
                  >
                    <Pin className={`h-4 w-4 ${note.isPinned ? "text-yellow-400" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingNote(note.id)}
                    className="text-gray-400 hover:text-blue-400 hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-white/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">{note.snippet}</p>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-400 border-blue-500/20 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedNotes.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No notes found</h3>
            <p className="text-gray-400 text-center mb-4">Create your first note to get started</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

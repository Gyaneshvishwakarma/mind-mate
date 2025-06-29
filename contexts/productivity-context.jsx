"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

const ProductivityContext = createContext(undefined)

export function useProductivity() {
  const context = useContext(ProductivityContext)
  if (context === undefined) {
    throw new Error("useProductivity must be used within a ProductivityProvider")
  }
  return context
}

export function ProductivityProvider({ children }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [goals, setGoals] = useState([])
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [focusSessions, setFocusSessions] = useState([])
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    backgroundSound: false,
  })
  const [loading, setLoading] = useState(false)
  const [aiResponses, setAIResponses] = useState([])

  useEffect(() => {
    if (user?.uid) {
      loadUserData()
    } else {
      setNotes([])
      setGoals([])
      setTasks([])
      setProjects([])
      setFocusSessions([])
      setAIResponses([])
    }
  }, [user?.uid])

  const loadUserData = async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      const [notesRes, tasksRes, goalsRes, projectsRes, sessionsRes, settingsRes, aiResponsesRes] = await Promise.all([
        fetch(`/api/notes?userId=${user.uid}`),
        fetch(`/api/tasks?userId=${user.uid}`),
        fetch(`/api/goals?userId=${user.uid}`),
        fetch(`/api/projects?userId=${user.uid}`),
        fetch(`/api/focus-sessions?userId=${user.uid}`),
        fetch(`/api/user-settings?userId=${user.uid}`),
        fetch(`/api/ai-responses?userId=${user.uid}`),
      ])

      const [notesData, tasksData, goalsData, projectsData, sessionsData, settingsData, aiResponsesData] =
        await Promise.all([
          notesRes.json(),
          tasksRes.json(),
          goalsRes.json(),
          projectsRes.json(),
          sessionsRes.json(),
          settingsRes.json(),
          aiResponsesRes.json(),
        ])

      setNotes(notesData.data || [])
      setTasks(tasksData.data || [])
      setGoals(goalsData.data || [])
      setProjects(projectsData.data || [])
      setFocusSessions(sessionsData.data || [])
      setPomodoroSettings(settingsData.data?.pomodoroSettings || pomodoroSettings)
      setAIResponses(aiResponsesData.data || [])
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addNote = async (note) => {
    if (!user?.uid) return
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setNotes((prev) => [result.data, ...prev])
      }
    } catch (error) {
      console.error("Error adding note:", error)
    }
  }

  const updateNote = async (id, updates) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setNotes((prev) =>
          prev.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note))
        )
      }
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const deleteNote = async (id) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setNotes((prev) => prev.filter((note) => note.id !== id))
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const togglePinNote = async (id) => {
    const note = notes.find((n) => n.id === id)
    if (note) {
      await updateNote(id, { isPinned: !note.isPinned })
    }
  }

  const addTask = async (task) => {
    if (!user?.uid) return
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setTasks((prev) => [result.data, ...prev])
      }
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const updateTask = async (id, updates) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (id) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setTasks((prev) => prev.filter((task) => task.id !== id))
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      await updateTask(id, { isCompleted: !task.isCompleted })
    }
  }

  const addGoal = async (goal) => {
    if (!user?.uid) return
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...goal, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setGoals((prev) => [result.data, ...prev])
      }
    } catch (error) {
      console.error("Error adding goal:", error)
    }
  }

  const updateGoal = async (id, updates) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
      }
    } catch (error) {
      console.error("Error updating goal:", error)
    }
  }

  const deleteGoal = async (id) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setGoals((prev) => prev.filter((goal) => goal.id !== id))
      }
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  const addProject = async (project) => {
    if (!user?.uid) return
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setProjects((prev) => [result.data, ...prev])
      }
    } catch (error) {
      console.error("Error adding project:", error)
    }
  }

  const deleteProject = async (id) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setProjects((prev) => prev.filter((project) => project.id !== id))
        setTasks((prev) => prev.map((task) => (task.projectId === id ? { ...task, projectId: undefined } : task)))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const addFocusSession = async (session) => {
    if (!user?.uid) return
    try {
      const response = await fetch("/api/focus-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...session, userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setFocusSessions((prev) => [result.data, ...prev])
      }
    } catch (error) {
      console.error("Error adding focus session:", error)
    }
  }

  const updatePomodoroSettings = async (settings) => {
    if (!user?.uid) return
    try {
      const response = await fetch("/api/user-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          pomodoroSettings: { ...pomodoroSettings, ...settings },
        }),
      })
      const result = await response.json()
      if (result.success) {
        setPomodoroSettings((prev) => ({ ...prev, ...settings }))
      }
    } catch (error) {
      console.error("Error updating pomodoro settings:", error)
    }
  }

  const addAIResponse = async (response) => {
    if (!user?.uid) return
    try {
      const apiResponse = await fetch("/api/ai-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, userId: user.uid }),
      })
      const result = await apiResponse.json()
      if (result.success) {
        setAIResponses((prev) => [result.data, ...prev])
      }
    } catch (error) {
      console.error("Error adding AI response:", error)
    }
  }

  const deleteAIResponse = async (id) => {
    if (!user?.uid) return
    try {
      const response = await fetch(`/api/ai-responses/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })
      const result = await response.json()
      if (result.success) {
        setAIResponses((prev) => prev.filter((response) => response.id !== id))
      }
    } catch (error) {
      console.error("Error deleting AI response:", error)
    }
  }

  return (
    <ProductivityContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        projects,
        addProject,
        deleteProject,
        focusSessions,
        addFocusSession,
        pomodoroSettings,
        updatePomodoroSettings,
        loading,
        aiResponses,
        addAIResponse,
        deleteAIResponse,
      }}
    >
      {children}
    </ProductivityContext.Provider>
  )
}

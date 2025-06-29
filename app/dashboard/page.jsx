"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProductivity } from "@/contexts/productivity-context"
import { CheckSquare, StickyNote, Target, Timer, TrendingUp, Calendar } from "lucide-react"

export default function DashboardPage() {
  const { tasks, notes, goals, focusSessions } = useProductivity()

  // Calculate stats
  const completedTasks = tasks.filter((task) => task.isCompleted).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const completedGoals = goals.filter((goal) => goal.isCompleted).length
  const totalGoals = goals.length

  const todaysSessions = focusSessions.filter((session) => {
    const today = new Date().toDateString()
    return new Date(session.completedAt).toDateString() === today
  }).length

  const totalFocusTime = focusSessions.reduce((total, session) => total + session.duration, 0)

  // Recent activity
  const recentTasks = tasks
    .filter((task) => !task.isCompleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const recentNotes = notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300">Welcome back!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
                <p className="text-xs text-green-400">{completionRate}% completed</p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Notes</p>
                <p className="text-2xl font-bold text-white">{notes.length}</p>
                <p className="text-xs text-blue-400">Knowledge base</p>
              </div>
              <StickyNote className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Goals</p>
                <p className="text-2xl font-bold text-white">{totalGoals}</p>
                <p className="text-xs text-purple-400">{completedGoals} completed</p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Focus Time</p>
                <p className="text-2xl font-bold text-white">{Math.round(totalFocusTime / 60)}h</p>
                <p className="text-xs text-orange-400">{todaysSessions} sessions today</p>
              </div>
              <Timer className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
            <CardDescription className="text-gray-300">Your latest pending tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{task.title}</p>
                    <p className="text-gray-400 text-xs">
                      {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No pending tasks</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Recent Notes
            </CardTitle>
            <CardDescription className="text-gray-300">Your latest notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{note.title}</p>
                    <p className="text-gray-400 text-xs">Updated: {new Date(note.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No notes yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Productivity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">Task Completion</p>
              <p className="text-2xl font-bold text-blue-400">{completionRate}%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <Timer className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-white font-medium">Focus Sessions</p>
              <p className="text-2xl font-bold text-orange-400">{focusSessions.length}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium">Active Goals</p>
              <p className="text-2xl font-bold text-purple-400">{totalGoals - completedGoals}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

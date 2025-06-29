"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useProductivity } from "@/contexts/productivity-context"
import { Plus, Target, Calendar, CheckCircle, Edit, Trash2, Trophy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useProductivity()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal",
    targetDate: "",
    priority: "medium",
    subtasks: [],
  })

  const handleCreateGoal = () => {
    if (newGoal.title.trim()) {
      addGoal({
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
        priority: newGoal.priority,
        subtasks: [],
        progress: 0,
        isCompleted: false,
      })
      setNewGoal({
        title: "",
        description: "",
        category: "personal",
        targetDate: "",
        priority: "medium",
        subtasks: [],
      })
      setIsCreateDialogOpen(false)
    }
  }

  const calculateProgress = (goal) => {
    if (!goal.subtasks || goal.subtasks.length === 0) return 0
    const completed = goal.subtasks.filter((subtask) => subtask.isCompleted).length
    return Math.round((completed / goal.subtasks.length) * 100)
  }

  const getGoalStats = () => {
    const total = goals.length
    const completed = goals.filter((g) => g.isCompleted).length
    const inProgress = goals.filter((g) => !g.isCompleted && calculateProgress(g) > 0).length
    const notStarted = goals.filter((g) => !g.isCompleted && calculateProgress(g) === 0).length

    return { total, completed, inProgress, notStarted }
  }

  const stats = getGoalStats()

  const categoryColors = {
    personal: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    work: "bg-green-500/20 text-green-400 border-green-500/20",
    health: "bg-red-500/20 text-red-400 border-red-500/20",
    learning: "bg-purple-500/20 text-purple-400 border-purple-500/20",
    finance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  }

  const priorityColors = {
    low: "bg-green-500/20 text-green-400 border-green-500/20",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
    high: "bg-red-500/20 text-red-400 border-red-500/20",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Goals</h1>
          <p className="text-gray-300">Track and achieve your objectives</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription className="text-gray-300">Set a new goal to work towards</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalTitle">Goal Title</Label>
                <Input
                  id="goalTitle"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter goal title..."
                />
              </div>
              <div>
                <Label htmlFor="goalDescription">Description</Label>
                <Textarea
                  id="goalDescription"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Describe your goal..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="personal" className="text-white">
                        Personal
                      </SelectItem>
                      <SelectItem value="work" className="text-white">
                        Work
                      </SelectItem>
                      <SelectItem value="health" className="text-white">
                        Health
                      </SelectItem>
                      <SelectItem value="learning" className="text-white">
                        Learning
                      </SelectItem>
                      <SelectItem value="finance" className="text-white">
                        Finance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value) => setNewGoal((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="low" className="text-white">
                        Low Priority
                      </SelectItem>
                      <SelectItem value="medium" className="text-white">
                        Medium Priority
                      </SelectItem>
                      <SelectItem value="high" className="text-white">
                        High Priority
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
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
                  onClick={handleCreateGoal}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/20"
                >
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Goals</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Not Started</p>
                <p className="text-2xl font-bold text-gray-400">{stats.notStarted}</p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = calculateProgress(goal)
          return (
            <Card
              key={goal.id}
              className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:bg-white/15 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      {goal.isCompleted && <Trophy className="h-4 w-4 text-yellow-400" />}
                      {goal.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={categoryColors[goal.category]}>{goal.category}</Badge>
                      <Badge className={priorityColors[goal.priority]}>{goal.priority}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-white/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-white/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {goal.description && <p className="text-gray-300 text-sm mb-3">{goal.description}</p>}

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {goal.targetDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  )}

                  {goal.subtasks && goal.subtasks.length > 0 && (
                    <div className="text-sm text-gray-400">
                      {goal.subtasks.filter((st) => st.isCompleted).length} of {goal.subtasks.length} subtasks completed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {goals.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No goals found</h3>
            <p className="text-gray-400 text-center mb-4">Create your first goal to get started</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useProductivity } from "@/contexts/productivity-context"
import {
  Plus,
  Calendar,
  Flag,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  FolderPlus,
  Tag,
  Clock,
  AlertCircle,
} from "lucide-react"
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

const priorityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/20 text-red-400 border-red-500/20",
}

const projectColors = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // yellow
  "#EF4444", // red
  "#8B5CF6", // purple
  "#06B6D4", // cyan
  "#F97316", // orange
  "#EC4899", // pink
]

export default function TasksPage() {
  const { tasks, projects, goals, addTask, updateTask, deleteTask, toggleTask, addProject, deleteProject } =
    useProductivity()
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [selectedView, setSelectedView] = useState("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    projectId: "none",
    goalId: "none",
    labels: [],
    isDaily: false,
    isRecurring: false,
  })
  const [newProject, setNewProject] = useState({
    name: "",
    color: projectColors[0],
  })

  // Filter tasks based on current view
  const filteredTasks = tasks.filter((task) => {
    const today = new Date()
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    switch (selectedView) {
      case "today":
        return task.dueDate ? new Date(task.dueDate).toDateString() === today.toDateString() : false
      case "week":
        return task.dueDate ? new Date(task.dueDate) <= weekFromNow : false
      case "project":
        return !!task.projectId
      default:
        return true
    }
  })

  // Sort tasks (incomplete first, then by priority, then by due date)
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1
    }

    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Group tasks by project
  const tasksByProject = sortedTasks.reduce((acc, task) => {
    const projectId = task.projectId || "no-project"
    if (!acc[projectId]) {
      acc[projectId] = []
    }
    acc[projectId].push(task)
    return acc
  }, {})

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      addTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        projectId: newTask.projectId === "none" ? undefined : newTask.projectId,
        goalId: newTask.goalId === "none" ? undefined : newTask.goalId,
        labels: newTask.labels,
        isDaily: newTask.isDaily,
        isRecurring: newTask.isRecurring,
        isCompleted: false,
        subtasks: [],
      })
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        projectId: "none",
        goalId: "none",
        labels: [],
        isDaily: false,
        isRecurring: false,
      })
      setIsCreateTaskOpen(false)
    }
  }

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      addProject({
        name: newProject.name,
        color: newProject.color,
        isArchived: false,
      })
      setNewProject({
        name: "",
        color: projectColors[0],
      })
      setIsCreateProjectOpen(false)
    }
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.isCompleted).length
    const today = new Date()
    const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < today && !t.isCompleted).length
    const dueToday = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString() && !t.isCompleted,
    ).length

    return { total, completed, overdue, dueToday }
  }

  const stats = getTaskStats()

  const isOverdue = (task) => {
    if (!task.dueDate || task.isCompleted) return false
    return new Date(task.dueDate) < new Date()
  }

  const isDueToday = (task) => {
    if (!task.dueDate || task.isCompleted) return false
    return new Date(task.dueDate).toDateString() === new Date().toDateString()
  }

  const addLabel = (label) => {
    if (label && !newTask.labels.includes(label)) {
      setNewTask((prev) => ({ ...prev, labels: [...prev.labels, label] }))
    }
  }

  const removeLabel = (labelToRemove) => {
    setNewTask((prev) => ({
      ...prev,
      labels: prev.labels.filter((label) => label !== labelToRemove),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-gray-300">Organize and track your tasks</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription className="text-gray-300">Organize your tasks into projects</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter project name..."
                  />
                </div>
                <div>
                  <Label>Project Color</Label>
                  <div className="flex gap-2 mt-2">
                    {projectColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewProject((prev) => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newProject.color === color ? "border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateProjectOpen(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/20"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription className="text-gray-300">Add a new task to your list</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input
                    id="taskTitle"
                    value={newTask.title}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    value={newTask.description}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Task description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, priority: value }))}
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
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project</Label>
                    <Select
                      value={newTask.projectId}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, projectId: value }))}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="none" className="text-white">
                          No Project
                        </SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id} className="text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Link to Goal</Label>
                    <Select
                      value={newTask.goalId}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, goalId: value }))}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="none" className="text-white">
                          No Goal
                        </SelectItem>
                        {goals.map((goal) => (
                          <SelectItem key={goal.id} value={goal.id} className="text-white">
                            {goal.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Labels</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newTask.labels.map((label) => (
                      <Badge
                        key={label}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-400 border-blue-500/20"
                      >
                        {label}
                        <button onClick={() => removeLabel(label)} className="ml-1 text-xs hover:text-red-400">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add labels (press Enter)"
                    className="bg-white/10 border-white/20 text-white"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addLabel(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDaily"
                      checked={newTask.isDaily}
                      onCheckedChange={(checked) => setNewTask((prev) => ({ ...prev, isDaily: !!checked }))}
                    />
                    <Label htmlFor="isDaily" className="text-white">
                      Daily Task
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRecurring"
                      checked={newTask.isRecurring}
                      onCheckedChange={(checked) => setNewTask((prev) => ({ ...prev, isRecurring: !!checked }))}
                    />
                    <Label htmlFor="isRecurring" className="text-white">
                      Recurring
                    </Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateTaskOpen(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTask}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/20"
                  >
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
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
              <Circle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Due Today</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.dueToday}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Overdue</p>
                <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Filters */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedView("all")}
              className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${selectedView === "all" ? "bg-white/20" : ""}`}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedView("today")}
              className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${selectedView === "today" ? "bg-white/20" : ""}`}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedView("week")}
              className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${selectedView === "week" ? "bg-white/20" : ""}`}
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedView("project")}
              className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${selectedView === "project" ? "bg-white/20" : ""}`}
            >
              By Project
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {selectedView === "project" ? (
          // Group by project view
          Object.entries(tasksByProject).map(([projectId, projectTasks]) => {
            const project = projects.find((p) => p.id === projectId)
            const projectName = project ? project.name : "No Project"
            const projectColor = project ? project.color : "#6B7280"

            return (
              <Card key={projectId} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: projectColor }} />
                      <CardTitle className="text-white">{projectName}</CardTitle>
                      <Badge variant="outline" className="text-gray-300 border-gray-500">
                        {projectTasks.length}
                      </Badge>
                    </div>
                    {project && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        task.isCompleted
                          ? "bg-white/5 border-white/10 opacity-60"
                          : "bg-white/10 border-white/20 hover:bg-white/15"
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          task.isCompleted ? "bg-green-500 border-green-500" : "border-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {task.isCompleted && <CheckCircle className="h-3 w-3 text-white" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-medium ${task.isCompleted ? "text-gray-400 line-through" : "text-white"}`}
                          >
                            {task.title}
                          </h3>
                          <Badge className={priorityColors[task.priority]}>
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                          {isOverdue(task) && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                          {isDueToday(task) && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                              <Clock className="h-3 w-3 mr-1" />
                              Due Today
                            </Badge>
                          )}
                        </div>
                        {task.description && <p className="text-sm text-gray-400 mb-2">{task.description}</p>}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          {task.labels.map((label) => (
                            <Badge
                              key={label}
                              variant="outline"
                              className="bg-blue-500/20 text-blue-400 border-blue-500/20 text-xs"
                            >
                              <Tag className="h-2 w-2 mr-1" />
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-blue-400 hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })
        ) : (
          // Regular list view
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-4 space-y-2">
              {sortedTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId)

                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      task.isCompleted
                        ? "bg-white/5 border-white/10 opacity-60"
                        : "bg-white/10 border-white/20 hover:bg-white/15"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        task.isCompleted ? "bg-green-500 border-green-500" : "border-gray-400 hover:border-gray-300"
                      }`}
                    >
                      {task.isCompleted && <CheckCircle className="h-3 w-3 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${task.isCompleted ? "text-gray-400 line-through" : "text-white"}`}>
                          {task.title}
                        </h3>
                        <Badge className={priorityColors[task.priority]}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                        {project && (
                          <Badge variant="outline" className="text-gray-300 border-gray-500">
                            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: project.color }} />
                            {project.name}
                          </Badge>
                        )}
                        {isOverdue(task) && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                        {isDueToday(task) && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                            <Clock className="h-3 w-3 mr-1" />
                            Due Today
                          </Badge>
                        )}
                      </div>
                      {task.description && <p className="text-sm text-gray-400 mb-2">{task.description}</p>}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        {task.labels.map((label) => (
                          <Badge
                            key={label}
                            variant="outline"
                            className="bg-blue-500/20 text-blue-400 border-blue-500/20 text-xs"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-white/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              {sortedTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
                  <p className="text-gray-400 text-center mb-4">Create your first task to get started</p>
                  <Button
                    onClick={() => setIsCreateTaskOpen(true)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

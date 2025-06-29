"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useProductivity } from "@/contexts/productivity-context"
import { Play, Pause, RotateCcw, Timer, Coffee, Target } from "lucide-react"

export default function FocusPage() {
  const { focusSessions, addFocusSession, pomodoroSettings, updatePomodoroSettings } = useProductivity()
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Session completed
      if (!isBreak) {
        // Work session completed
        addFocusSession({
          duration: pomodoroSettings.workDuration,
          type: "work",
          sessionNumber: sessionCount + 1,
        })
        setSessionCount((prev) => prev + 1)

        // Start break
        const breakDuration = sessionCount % 4 === 3 ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak
        setTimeLeft(breakDuration * 60)
        setIsBreak(true)
      } else {
        // Break completed, start new work session
        setTimeLeft(pomodoroSettings.workDuration * 60)
        setIsBreak(false)
      }
      setIsActive(false)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, isBreak, sessionCount, pomodoroSettings, addFocusSession])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(pomodoroSettings.workDuration * 60)
    setIsBreak(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalTime = isBreak
      ? (sessionCount % 4 === 3 ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak) * 60
      : pomodoroSettings.workDuration * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  // Calculate today's stats
  const today = new Date().toDateString()
  const todaysSessions = focusSessions.filter((session) => {
    return new Date(session.completedAt).toDateString() === today
  })
  const todaysFocusTime = todaysSessions.reduce((total, session) => total + session.duration, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Focus Timer</h1>
        <p className="text-gray-300">Use the Pomodoro Technique to boost your productivity</p>
      </div>

      {/* Timer Card */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            {isBreak ? <Coffee className="h-6 w-6" /> : <Target className="h-6 w-6" />}
            {isBreak ? "Break Time" : "Focus Time"}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {isBreak ? "Take a well-deserved break" : "Stay focused on your task"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">{formatTime(timeLeft)}</div>
            <Progress value={getProgress()} className="h-3 mb-4" />
            <p className="text-gray-300 text-sm">
              Session {sessionCount + 1} • {isBreak ? "Break" : "Work"}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleTimer}
              className={`${
                isActive
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/20"
                  : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/20"
              }`}
            >
              {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Today's Sessions</p>
                <p className="text-2xl font-bold text-white">{todaysSessions.length}</p>
              </div>
              <Timer className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Today's Focus Time</p>
                <p className="text-2xl font-bold text-white">{todaysFocusTime}m</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{focusSessions.length}</p>
              </div>
              <Coffee className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Focus Sessions</CardTitle>
          <CardDescription className="text-gray-300">Your latest productivity sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {focusSessions.length > 0 ? (
            <div className="space-y-3">
              {focusSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {session.duration} minute {session.type} session
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(session.completedAt).toLocaleDateString()} at{" "}
                        {new Date(session.completedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Timer className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No focus sessions yet. Start your first session!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

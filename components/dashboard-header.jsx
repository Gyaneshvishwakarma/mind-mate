"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Star, ExternalLink } from "lucide-react"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  const handleGitHubClick = () => {
    window.open("https://github.com/your-repo-url", "_blank", "noopener,noreferrer")
  }

  return (
    <header className="h-16 bg-white/5 backdrop-blur-xl shadow-lg border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-white">Welcome back, {user?.name}</h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* GitHub Star Button - Desktop Only */}
        <div className="hidden lg:block">
          <Button
            onClick={handleGitHubClick}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 group"
          >
            <Star className="h-4 w-4 mr-2 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-colors" />
            Star on GitHub
            <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 border border-white/20">
            <AvatarFallback className="text-white text-sm bg-transparent">{user?.avatar}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-300">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
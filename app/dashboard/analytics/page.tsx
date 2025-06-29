import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-300">Detailed insights and performance metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">54,231</div>
            <p className="text-xs text-blue-400">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,543</div>
            <p className="text-xs text-green-400">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3.24%</div>
            <p className="text-xs text-purple-400">+0.5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Traffic Overview</CardTitle>
          <CardDescription className="text-gray-300">Website traffic analytics for the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">Chart visualization would go here</p>
              <p className="text-sm text-gray-500">Integration with charting library needed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Top Pages</CardTitle>
            <CardDescription className="text-gray-300">Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { page: "/dashboard", views: "12,543", percentage: "45%" },
                { page: "/analytics", views: "8,234", percentage: "30%" },
                { page: "/settings", views: "4,123", percentage: "15%" },
                { page: "/users", views: "2,756", percentage: "10%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{item.page}</p>
                    <p className="text-xs text-gray-400">{item.views} views</p>
                  </div>
                  <div className="text-sm font-medium text-blue-400">{item.percentage}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Traffic Sources</CardTitle>
            <CardDescription className="text-gray-300">Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Direct", visitors: "8,234", percentage: "40%" },
                { source: "Google Search", visitors: "6,123", percentage: "30%" },
                { source: "Social Media", visitors: "4,087", percentage: "20%" },
                { source: "Referrals", visitors: "2,043", percentage: "10%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{item.source}</p>
                    <p className="text-xs text-gray-400">{item.visitors} visitors</p>
                  </div>
                  <div className="text-sm font-medium text-green-400">{item.percentage}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

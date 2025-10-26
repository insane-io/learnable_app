"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TrendingUp,
  Clock,
  Target,
  MessageCircle,
  FileText,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { isAuthenticated, hasRole, getCurrentUser } from "@/lib/auth"

export default function ParentDashboardPage() {
  const router = useRouter()
  const [selectedChild, setSelectedChild] = useState("alex")
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated and has parent role
    if (!isAuthenticated() || !hasRole('parent')) {
      router.push('/parent/login')
      return
    }
    
    // Get current user data
    const user = getCurrentUser()
    setCurrentUser(user)
    console.log('Current logged in parent:', user)
  }, [router])

  const children = [
    {
      id: "alex",
      name: "Alex Johnson",
      age: 8,
      grade: "3rd Grade",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["ADHD", "Mild Dyslexia"],
      currentStreak: 8,
      weeklyProgress: 85,
      lastActivity: "2 hours ago",
      upcomingGoals: 2,
      alerts: 1,
    },
    {
      id: "emma",
      name: "Emma Johnson",
      age: 6,
      grade: "1st Grade",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Autism Spectrum"],
      currentStreak: 5,
      weeklyProgress: 92,
      lastActivity: "1 hour ago",
      upcomingGoals: 1,
      alerts: 0,
    },
  ]

  const currentChild = children.find((child) => child.id === selectedChild) || children[0]

  const weeklyStats = {
    totalActivities: 24,
    totalTime: 180, // minutes
    averageScore: 87,
    improvementAreas: ["Reading Comprehension", "Focus Duration"],
    strengths: ["Math Problem Solving", "Visual Learning"],
  }

  const recentActivities = [
    {
      id: 1,
      name: "Word Detective",
      date: "Today, 2:30 PM",
      duration: "12 min",
      score: 85,
      category: "Reading",
      status: "completed",
    },
    {
      id: 2,
      name: "Focus Challenge",
      date: "Today, 1:15 PM",
      duration: "8 min",
      score: 92,
      category: "Attention",
      status: "completed",
    },
    {
      id: 3,
      name: "Math Adventure",
      date: "Yesterday, 4:20 PM",
      duration: "15 min",
      score: 78,
      category: "Mathematics",
      status: "completed",
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "achievement",
      title: "New Achievement Unlocked!",
      message: "Alex completed their 8-day learning streak",
      time: "1 hour ago",
      icon: Award,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "teacher",
      title: "Message from Ms. Smith",
      message: "Great progress on reading activities this week!",
      time: "3 hours ago",
      icon: MessageCircle,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "alert",
      title: "Attention Needed",
      message: "Consider shorter activity sessions for better focus",
      time: "1 day ago",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="parent" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Child Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black mb-6">Parent Dashboard</h1>
          {currentUser && (
            <p className="text-sm text-muted-foreground mb-4">
              Welcome back, {currentUser.email}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            {children.map((child) => (
              <Card
                key={child.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedChild === child.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:shadow-md hover:border-primary/50"
                }`}
                onClick={() => setSelectedChild(child.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={child.avatar || "/placeholder.svg"} alt={child.name} />
                      <AvatarFallback>
                        {child.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {child.grade} • Age {child.age}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {child.conditions.map((condition) => (
                          <Badge key={condition} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {child.alerts > 0 && (
                      <div className="ml-auto">
                        <Badge variant="destructive" className="text-xs">
                          {child.alerts} alert{child.alerts > 1 ? "s" : ""}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                This Week's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Goal</span>
                    <span className="text-sm text-muted-foreground">{currentChild.weeklyProgress}%</span>
                  </div>
                  <Progress value={currentChild.weeklyProgress} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{weeklyStats.totalActivities}</div>
                    <div className="text-xs text-muted-foreground">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.floor(weeklyStats.totalTime / 60)}h {weeklyStats.totalTime % 60}m
                    </div>
                    <div className="text-xs text-muted-foreground">Learning Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Learning Streak</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-primary">{currentChild.currentStreak} days</span>
                    <span>🔥</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Score</span>
                  <Badge className="bg-green-100 text-green-800">{weeklyStats.averageScore}%</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Activity</span>
                  <span className="text-sm text-muted-foreground">{currentChild.lastActivity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Upcoming Goals</span>
                  <Badge variant="outline">{currentChild.upcomingGoals} pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                onClick={() => router.push(`/parent/progress/${currentChild.id}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Detailed Progress
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push(`/parent/activities/${currentChild.id}`)}
              >
                <Target className="h-4 w-4 mr-2" />
                Home Activities
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/parent/communication")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Teacher
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push(`/parent/reports/${currentChild.id}`)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{activity.duration}</span>
                        <span>•</span>
                        <span>{activity.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="mb-1">{activity.score}%</Badge>
                      <div className="text-xs text-muted-foreground">{activity.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications & Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon
                  return (
                    <div key={notification.id} className="flex gap-3 p-3 border rounded-lg">
                      <IconComponent className={`h-5 w-5 mt-0.5 ${notification.color}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Insights */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Learning Insights for {currentChild.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-700">Strengths</h4>
                <div className="space-y-2">
                  {weeklyStats.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-orange-700">Areas for Growth</h4>
                <div className="space-y-2">
                  {weeklyStats.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

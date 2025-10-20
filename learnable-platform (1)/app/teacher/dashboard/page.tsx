"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, AlertTriangle, Clock, MessageCircle, Plus, Eye, Calendar } from "lucide-react"

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState("class-3a")

  const classes = [
    {
      id: "class-3a",
      name: "3rd Grade A",
      students: 18,
      activeStudents: 15,
      avgProgress: 87,
      needsAttention: 3,
    },
    {
      id: "class-3b",
      name: "3rd Grade B",
      students: 16,
      activeStudents: 14,
      avgProgress: 82,
      needsAttention: 2,
    },
  ]

  const currentClass = classes.find((c) => c.id === selectedClass) || classes[0]

  const students = [
    {
      id: "alex-johnson",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["ADHD", "Mild Dyslexia"],
      weeklyProgress: 85,
      lastActivity: "2 hours ago",
      currentStreak: 8,
      needsAttention: false,
      recentScore: 92,
      activitiesCompleted: 24,
    },
    {
      id: "emma-smith",
      name: "Emma Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Autism Spectrum"],
      weeklyProgress: 92,
      lastActivity: "1 hour ago",
      currentStreak: 12,
      needsAttention: false,
      recentScore: 88,
      activitiesCompleted: 28,
    },
    {
      id: "michael-brown",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Down Syndrome"],
      weeklyProgress: 65,
      lastActivity: "1 day ago",
      currentStreak: 3,
      needsAttention: true,
      recentScore: 72,
      activitiesCompleted: 15,
    },
    {
      id: "sarah-davis",
      name: "Sarah Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Dyslexia"],
      weeklyProgress: 78,
      lastActivity: "3 hours ago",
      currentStreak: 6,
      needsAttention: true,
      recentScore: 85,
      activitiesCompleted: 20,
    },
  ]

  const classStats = {
    totalActivities: 156,
    avgCompletionRate: 84,
    totalLearningHours: 142,
    improvementRate: 15,
  }

  const recentAlerts = [
    {
      id: 1,
      student: "Michael Brown",
      type: "attention",
      message: "Has not completed activities in 24 hours",
      time: "1 hour ago",
      priority: "high",
    },
    {
      id: 2,
      student: "Sarah Davis",
      type: "performance",
      message: "Struggling with reading comprehension activities",
      time: "3 hours ago",
      priority: "medium",
    },
    {
      id: 3,
      student: "Alex Johnson",
      type: "achievement",
      message: "Achieved 8-day learning streak!",
      time: "5 hours ago",
      priority: "low",
    },
  ]

  const upcomingTasks = [
    {
      id: 1,
      task: "Review weekly progress reports",
      dueDate: "Today, 4:00 PM",
      priority: "high",
    },
    {
      id: 2,
      task: "Parent-teacher conference with Johnson family",
      dueDate: "Tomorrow, 2:00 PM",
      priority: "medium",
    },
    {
      id: 3,
      task: "Create custom activities for struggling readers",
      dueDate: "Friday, 10:00 AM",
      priority: "medium",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="teacher" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your classroom and track student progress</p>
        </div>

        {/* Class Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-serif font-black mb-4">Your Classes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {classes.map((classItem) => (
              <Card
                key={classItem.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedClass === classItem.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:shadow-md hover:border-primary/50"
                }`}
                onClick={() => setSelectedClass(classItem.id)}
              >
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">{classItem.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-medium">{classItem.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Today:</span>
                      <span className="font-medium text-green-600">{classItem.activeStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Progress:</span>
                      <span className="font-medium">{classItem.avgProgress}%</span>
                    </div>
                    {classItem.needsAttention > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {classItem.needsAttention} need attention
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{classStats.totalActivities}</div>
              <div className="text-sm text-muted-foreground">Activities Assigned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{classStats.avgCompletionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{classStats.totalLearningHours}h</div>
              <div className="text-sm text-muted-foreground">Total Learning Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">+{classStats.improvementRate}%</div>
              <div className="text-sm text-muted-foreground">Class Improvement</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                onClick={() => router.push(`/teacher/classroom/${selectedClass}`)}
              >
                <Users className="h-4 w-4 mr-2" />
                View {currentClass.name}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/teacher/assign-activity")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Assign New Activity
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/teacher/monitor")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Monitor Students
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/teacher/communication")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Parents
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 border rounded-lg ${getPriorityColor(alert.priority)}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{alert.student}</h4>
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{task.task}</h4>
                      <Badge variant={task.priority === "high" ? "default" : "secondary"} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {currentClass.name} - Student Overview
              </span>
              <Button size="sm" onClick={() => router.push(`/teacher/classroom/${selectedClass}`)}>
                View Full Class
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    student.needsAttention ? "border-orange-300 bg-orange-50" : "hover:border-primary/50"
                  }`}
                  onClick={() => router.push(`/teacher/student/${student.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{student.name}</h4>
                        <div className="flex gap-1 mt-1">
                          {student.conditions.slice(0, 2).map((condition) => (
                            <Badge key={condition} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {student.needsAttention && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Weekly Progress</span>
                          <span>{student.weeklyProgress}%</span>
                        </div>
                        <Progress value={student.weeklyProgress} className="h-2" />
                      </div>

                      <div className="flex justify-between">
                        <span>Recent Score:</span>
                        <Badge className="text-xs">{student.recentScore}%</Badge>
                      </div>

                      <div className="flex justify-between">
                        <span>Streak:</span>
                        <span className="font-medium text-primary">{student.currentStreak} days</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Last Active:</span>
                        <span className="text-muted-foreground">{student.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

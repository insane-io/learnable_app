"use client"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  Plus,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Brain,
  Focus,
  Users,
} from "lucide-react"

export default function StudentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const studentData = {
    id: studentId,
    name: "Alex Johnson",
    age: 8,
    grade: "3rd Grade",
    avatar: "/placeholder.svg?height=80&width=80",
    conditions: ["ADHD", "Mild Dyslexia"],
    parentName: "Sarah Johnson",
    parentEmail: "sarah.johnson@email.com",
    enrollmentDate: "September 2024",
    currentStreak: 8,
    longestStreak: 12,
  }

  const overallProgress = {
    totalActivities: 156,
    completedActivities: 132,
    totalHours: 42,
    averageScore: 87,
    improvementRate: 12,
    weeklyGoal: 85,
    currentProgress: 92,
  }

  const skillProgress = [
    {
      skill: "Reading Comprehension",
      current: 78,
      target: 85,
      change: +12,
      activities: 45,
      icon: BookOpen,
      color: "text-blue-600",
      needsAttention: true,
    },
    {
      skill: "Focus & Attention",
      current: 85,
      target: 90,
      change: +8,
      activities: 38,
      icon: Focus,
      color: "text-green-600",
      needsAttention: false,
    },
    {
      skill: "Math Problem Solving",
      current: 92,
      target: 95,
      change: +5,
      activities: 32,
      icon: Brain,
      color: "text-purple-600",
      needsAttention: false,
    },
    {
      skill: "Social Skills",
      current: 74,
      target: 80,
      change: +15,
      activities: 17,
      icon: Users,
      color: "text-orange-600",
      needsAttention: true,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      name: "Word Detective",
      date: "2024-10-20",
      score: 85,
      time: 12,
      category: "Reading",
      difficulty: "Medium",
      attempts: 1,
    },
    {
      id: 2,
      name: "Focus Challenge",
      date: "2024-10-20",
      score: 92,
      time: 8,
      category: "Attention",
      difficulty: "Easy",
      attempts: 1,
    },
    {
      id: 3,
      name: "Math Adventure",
      date: "2024-10-19",
      score: 78,
      time: 15,
      category: "Mathematics",
      difficulty: "Hard",
      attempts: 2,
    },
  ]

  const recommendations = [
    {
      type: "intervention",
      title: "Reading Support Needed",
      description: "Consider additional phonics-based activities to improve reading comprehension",
      priority: "high",
      suggestedActivities: ["Phonics Games", "Sight Word Practice", "Reading Comprehension Exercises"],
    },
    {
      type: "strength",
      title: "Math Excellence",
      description: "Student shows strong mathematical reasoning. Consider advanced challenges",
      priority: "medium",
      suggestedActivities: ["Advanced Problem Solving", "Logic Puzzles", "Math Competitions"],
    },
    {
      type: "social",
      title: "Social Skills Development",
      description: "Gradual improvement in social interactions. Continue with group activities",
      priority: "medium",
      suggestedActivities: ["Group Projects", "Peer Collaboration", "Social Stories"],
    },
  ]

  const weeklyData = [
    { week: "Week 1", activities: 8, score: 82, time: 3.5, focus: 75 },
    { week: "Week 2", activities: 12, score: 85, time: 5.2, focus: 80 },
    { week: "Week 3", activities: 10, score: 88, time: 4.1, focus: 85 },
    { week: "Week 4", activities: 12, score: 91, time: 5.7, focus: 88 },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-red-50"
      case "medium":
        return "border-orange-300 bg-orange-50"
      case "low":
        return "border-green-300 bg-green-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="teacher" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.push("/teacher/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={studentData.avatar || "/placeholder.svg"} alt={studentData.name} />
              <AvatarFallback className="text-lg">
                {studentData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-black">{studentData.name}</h1>
              <p className="text-muted-foreground">
                {studentData.grade} • Age {studentData.age} • Enrolled {studentData.enrollmentDate}
              </p>
              <div className="flex gap-2 mt-2">
                {studentData.conditions.map((condition) => (
                  <Badge key={condition} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Parent: {studentData.parentName} ({studentData.parentEmail})
              </p>
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/teacher/student/${studentId}/custom-activity`)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Activity
            </Button>
            <Button onClick={() => router.push(`/teacher/student/${studentId}/report`)}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={() => router.push(`/teacher/communication?student=${studentId}`)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Parent
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress.completedActivities}</div>
              <div className="text-sm text-muted-foreground">Activities Done</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Learning Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">+{overallProgress.improvementRate}%</div>
              <div className="text-sm text-muted-foreground">Improvement</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{studentData.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{studentData.longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {skillProgress.map((skill) => {
                const IconComponent = skill.icon
                return (
                  <Card key={skill.skill} className={skill.needsAttention ? "border-orange-300 bg-orange-50" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent className={`h-5 w-5 ${skill.color}`} />
                        {skill.skill}
                        {skill.needsAttention && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Current Level</span>
                            <span className="text-sm text-muted-foreground">
                              {skill.current}% / {skill.target}%
                            </span>
                          </div>
                          <Progress value={skill.current} className="h-3" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Progress:</span>
                            <div className="font-bold text-green-600">+{skill.change}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Activities:</span>
                            <div className="font-bold">{skill.activities}</div>
                          </div>
                        </div>

                        {skill.needsAttention && (
                          <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                              This skill area needs additional attention and support.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{activity.time} min</span>
                          <span>•</span>
                          <span>{activity.category}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-1">{activity.score}%</Badge>
                        <div className="text-xs text-muted-foreground">
                          {activity.attempts} attempt{activity.attempts > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weeklyData.map((week) => (
                    <div key={week.week} className="flex items-center gap-6">
                      <div className="w-20 text-sm font-medium">{week.week}</div>
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Activities</div>
                          <div className="font-bold">{week.activities}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Avg Score</div>
                          <div className="font-bold">{week.score}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Time</div>
                          <div className="font-bold">{week.time}h</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Focus</div>
                          <div className="font-bold">{week.focus}%</div>
                        </div>
                      </div>
                      <div className="w-32">
                        <Progress value={week.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className={getPriorityColor(rec.priority)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {rec.type === "intervention" && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                        {rec.type === "strength" && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {rec.type === "social" && <Users className="h-5 w-5 text-blue-600" />}
                        {rec.title}
                      </CardTitle>
                      <Badge variant={rec.priority === "high" ? "default" : "secondary"} className="text-xs">
                        {rec.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{rec.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Suggested Activities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.suggestedActivities.map((activity, actIndex) => (
                          <Badge key={actIndex} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Download,
  Share,
  Calendar,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Brain,
  Users,
  Focus,
} from "lucide-react"

export default function ParentReportsPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.childId as string
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const [reportType, setReportType] = useState("comprehensive")

  const childData = {
    id: childId,
    name: "Alex Johnson",
    age: 8,
    grade: "3rd Grade",
    avatar: "/placeholder.svg?height=60&width=60",
    conditions: ["ADHD", "Mild Dyslexia"],
  }

  const reportData = {
    period: "October 2024",
    totalActivities: 42,
    totalHours: 18.5,
    averageScore: 87,
    improvementRate: 12,
    goalsAchieved: 3,
    goalsInProgress: 2,
  }

  const skillBreakdown = [
    {
      skill: "Reading Comprehension",
      current: 78,
      previous: 70,
      change: +8,
      activities: 15,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      skill: "Focus & Attention",
      current: 85,
      previous: 78,
      change: +7,
      activities: 12,
      icon: Focus,
      color: "text-green-600",
    },
    {
      skill: "Math Problem Solving",
      current: 92,
      previous: 88,
      change: +4,
      activities: 10,
      icon: Brain,
      color: "text-purple-600",
    },
    {
      skill: "Social Skills",
      current: 74,
      previous: 65,
      change: +9,
      activities: 5,
      icon: Users,
      color: "text-orange-600",
    },
  ]

  const achievements = [
    {
      title: "Reading Champion",
      description: "Completed 15 reading activities with 80%+ average",
      date: "October 15, 2024",
      category: "Reading",
    },
    {
      title: "Focus Master",
      description: "Maintained attention for 15+ minutes consistently",
      date: "October 22, 2024",
      category: "Attention",
    },
    {
      title: "10-Day Streak",
      description: "Completed activities for 10 consecutive days",
      date: "October 25, 2024",
      category: "Consistency",
    },
  ]

  const recommendations = [
    {
      area: "Reading Support",
      suggestion: "Continue with phonics-based activities. Consider introducing longer texts gradually.",
      priority: "High",
    },
    {
      area: "Attention Training",
      suggestion: "Excellent progress! Maintain current activity duration and gradually increase complexity.",
      priority: "Medium",
    },
    {
      area: "Social Skills",
      suggestion: "Great improvement! Add more group-based activities to further develop social interaction.",
      priority: "Medium",
    },
  ]

  const weeklyProgress = [
    { week: "Week 1", activities: 8, avgScore: 82, totalTime: 3.5 },
    { week: "Week 2", activities: 12, avgScore: 85, totalTime: 5.2 },
    { week: "Week 3", activities: 10, avgScore: 88, totalTime: 4.1 },
    { week: "Week 4", activities: 12, avgScore: 91, totalTime: 5.7 },
  ]

  const generateReport = () => {
    // Generate and download report logic
    console.log(`Generating ${reportType} report for ${reportPeriod}`)
  }

  const shareReport = () => {
    // Share report logic
    console.log("Sharing report")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="parent" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.push("/parent/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={childData.avatar || "/placeholder.svg"} alt={childData.name} />
              <AvatarFallback>
                {childData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-black">Progress Report - {childData.name}</h1>
              <p className="text-muted-foreground">
                {childData.grade} • Age {childData.age}
              </p>
              <div className="flex gap-2 mt-2">
                {childData.conditions.map((condition) => (
                  <Badge key={condition} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="quarterly">This Quarter</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="skills">Skills Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-serif font-black">Report Period: {reportData.period}</h2>
            <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={shareReport}>
              <Share className="h-4 w-4 mr-2" />
              Share Report
            </Button>
            <Button onClick={generateReport}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{reportData.totalActivities}</div>
              <div className="text-sm text-muted-foreground">Activities Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{reportData.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Learning Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{reportData.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">+{reportData.improvementRate}%</div>
              <div className="text-sm text-muted-foreground">Improvement</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{reportData.goalsAchieved}</div>
              <div className="text-sm text-muted-foreground">Goals Achieved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{reportData.goalsInProgress}</div>
              <div className="text-sm text-muted-foreground">Goals In Progress</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Skill Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillBreakdown.map((skill) => {
                  const IconComponent = skill.icon
                  return (
                    <div key={skill.skill}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${skill.color}`} />
                          <span className="font-medium">{skill.skill}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={skill.change > 0 ? "default" : "secondary"} className="text-xs">
                            {skill.change > 0 ? "+" : ""}
                            {skill.change}%
                          </Badge>
                          <span className="text-sm text-muted-foreground">{skill.current}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.current}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{skill.activities} activities completed</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((week) => (
                  <div key={week.week} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-16 text-sm font-medium">{week.week}</div>
                    <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Activities</div>
                        <div className="font-bold">{week.activities}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Score</div>
                        <div className="font-bold">{week.avgScore}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time</div>
                        <div className="font-bold">{week.totalTime}h</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {achievement.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{achievement.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rec.area}</h4>
                      <Badge variant={rec.priority === "High" ? "default" : "secondary"} className="text-xs">
                        {rec.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

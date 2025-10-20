"use client"

import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, TrendingUp, Calendar, Brain, BookOpen, Focus, Users, Download, Share } from "lucide-react"

export default function ChildProgressPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.childId as string

  const childData = {
    id: childId,
    name: "Alex Johnson",
    age: 8,
    grade: "3rd Grade",
    avatar: "/placeholder.svg?height=60&width=60",
    conditions: ["ADHD", "Mild Dyslexia"],
    joinDate: "September 2024",
  }

  const overallProgress = {
    totalActivities: 156,
    totalHours: 42,
    averageScore: 87,
    currentStreak: 8,
    longestStreak: 12,
    skillsImproved: 6,
  }

  const skillProgress = [
    {
      skill: "Reading Comprehension",
      current: 78,
      target: 85,
      trend: "+12%",
      color: "bg-blue-500",
      icon: BookOpen,
    },
    {
      skill: "Focus & Attention",
      current: 85,
      target: 90,
      trend: "+8%",
      color: "bg-green-500",
      icon: Focus,
    },
    {
      skill: "Math Problem Solving",
      current: 92,
      target: 95,
      trend: "+5%",
      color: "bg-purple-500",
      icon: Brain,
    },
    {
      skill: "Social Skills",
      current: 74,
      target: 80,
      trend: "+15%",
      color: "bg-orange-500",
      icon: Users,
    },
  ]

  const weeklyData = [
    { week: "Week 1", activities: 8, score: 82, time: 120 },
    { week: "Week 2", activities: 12, score: 85, time: 180 },
    { week: "Week 3", activities: 10, score: 88, time: 150 },
    { week: "Week 4", activities: 14, score: 87, time: 210 },
  ]

  const milestones = [
    {
      id: 1,
      title: "First Week Complete",
      description: "Completed first 7 days of learning",
      date: "Sep 15, 2024",
      achieved: true,
    },
    {
      id: 2,
      title: "Reading Milestone",
      description: "Achieved 80% average in reading activities",
      date: "Oct 2, 2024",
      achieved: true,
    },
    {
      id: 3,
      title: "Focus Champion",
      description: "Maintained focus for 15+ minutes consistently",
      date: "Oct 18, 2024",
      achieved: true,
    },
    {
      id: 4,
      title: "Math Master",
      description: "Score 90%+ on 10 consecutive math activities",
      date: "Target: Nov 15, 2024",
      achieved: false,
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
    },
    {
      id: 2,
      name: "Focus Challenge",
      date: "2024-10-20",
      score: 92,
      time: 8,
      category: "Attention",
      difficulty: "Easy",
    },
    {
      id: 3,
      name: "Math Adventure",
      date: "2024-10-19",
      score: 78,
      time: 15,
      category: "Mathematics",
      difficulty: "Hard",
    },
  ]

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
              <h1 className="text-3xl font-serif font-black">{childData.name}'s Progress</h1>
              <p className="text-muted-foreground">
                {childData.grade} • Age {childData.age} • Learning since {childData.joinDate}
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
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share Progress
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress.totalActivities}</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
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
              <div className="text-2xl font-bold text-primary">{overallProgress.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress.longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress.skillsImproved}</div>
              <div className="text-sm text-muted-foreground">Skills Improved</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skill Progress</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {skillProgress.map((skill) => {
                const IconComponent = skill.icon
                return (
                  <Card key={skill.skill}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent className="h-5 w-5" />
                        {skill.skill}
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

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-green-700 bg-green-50">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {skill.trend} this month
                          </Badge>
                          <span className="text-sm text-muted-foreground">Target: {skill.target}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weeklyData.map((week, index) => (
                    <div key={week.week} className="flex items-center gap-6">
                      <div className="w-20 text-sm font-medium">{week.week}</div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
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
                          <div className="font-bold">
                            {Math.floor(week.time / 60)}h {week.time % 60}m
                          </div>
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

          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                          milestone.achieved ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {milestone.achieved ? "✓" : "○"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{milestone.date}</p>
                      </div>
                      {milestone.achieved && <Badge className="bg-green-100 text-green-800">Achieved</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{activity.time} min</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.difficulty}
                          </Badge>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

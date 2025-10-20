"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Star, Trophy, Target, Clock, Heart } from "lucide-react"

export default function ChildDashboardPage() {
  const router = useRouter()
  const [streak, setStreak] = useState(7)
  const [todayProgress, setTodayProgress] = useState(60)

  const todaysActivities = [
    {
      id: 1,
      title: "Word Detective 🔍",
      description: "Find hidden words in fun pictures",
      duration: "10 min",
      difficulty: "Easy",
      type: "reading",
      completed: false,
      emoji: "🔍",
    },
    {
      id: 2,
      title: "Focus Challenge ⚡",
      description: "Quick attention games",
      duration: "5 min",
      difficulty: "Medium",
      type: "focus",
      completed: true,
      emoji: "⚡",
    },
    {
      id: 3,
      title: "Math Adventure 🧮",
      description: "Solve puzzles with numbers",
      duration: "15 min",
      difficulty: "Easy",
      type: "math",
      completed: false,
      emoji: "🧮",
    },
  ]

  const achievements = [
    { icon: "🏆", title: "Reading Star", description: "Completed 10 reading activities" },
    { icon: "🔥", title: "7-Day Streak", description: "Learning every day this week!" },
    { icon: "🎯", title: "Focus Master", description: "Finished all focus games" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="child" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black">Good morning, Alex! 🌟</h1>
              <p className="text-xl text-muted-foreground">Ready for another awesome day of learning?</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(streak)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-primary rounded-full mr-1" />
                ))}
              </div>
              <span className="font-bold text-primary">{streak} day streak! 🔥</span>
            </div>

            <div className="flex items-center gap-2">
              <Progress value={todayProgress} className="w-32" />
              <span className="font-medium">{todayProgress}% today</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Activities */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-black flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Today's Learning Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        activity.completed
                          ? "bg-primary/10 border-primary/30"
                          : "border-border hover:border-primary/50 hover:shadow-md cursor-pointer"
                      }`}
                      onClick={() => !activity.completed && router.push(`/child/activity/${activity.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{activity.emoji}</div>
                          <div>
                            <h3 className="text-xl font-bold">{activity.title}</h3>
                            <p className="text-muted-foreground">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.duration}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {activity.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          {activity.completed ? (
                            <div className="flex items-center gap-2 text-primary">
                              <Trophy className="h-6 w-6" />
                              <span className="font-bold">Done! ✅</span>
                            </div>
                          ) : (
                            <Button size="lg" className="text-lg">
                              <Play className="h-5 w-5 mr-2" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements & Progress */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl font-serif font-black flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl font-serif font-black">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 bg-transparent"
                  onClick={() => router.push("/child/activities")}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <p className="font-bold">All Activities</p>
                      <p className="text-xs text-muted-foreground">Browse all games</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 bg-transparent"
                  onClick={() => router.push("/child/progress")}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="font-bold">My Progress</p>
                      <p className="text-xs text-muted-foreground">See how you're doing</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

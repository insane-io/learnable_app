"use client"

import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, TrendingUp, Home } from "lucide-react"

export default function ChildProgressPage() {
  const router = useRouter()

  const sessionSummary = {
    activitiesCompleted: 3,
    totalTime: 25,
    pointsEarned: 150,
    streak: 8,
    newAchievements: 2,
  }

  const recentActivities = [
    {
      id: 1,
      title: "Word Detective 🔍",
      score: 85,
      time: "8 min",
      stars: 4,
      completed: true,
      emoji: "🔍",
    },
    {
      id: 2,
      title: "Focus Challenge ⚡",
      score: 92,
      time: "5 min",
      stars: 5,
      completed: true,
      emoji: "⚡",
    },
    {
      id: 3,
      title: "Math Adventure 🧮",
      score: 78,
      time: "12 min",
      stars: 3,
      completed: true,
      emoji: "🧮",
    },
  ]

  const weeklyProgress = [
    { day: "Mon", activities: 2, points: 80 },
    { day: "Tue", activities: 3, points: 120 },
    { day: "Wed", activities: 1, points: 40 },
    { day: "Thu", activities: 4, points: 160 },
    { day: "Fri", activities: 3, points: 150 },
    { day: "Sat", activities: 2, points: 90 },
    { day: "Sun", activities: 3, points: 150 },
  ]

  const achievements = [
    { icon: "🏆", title: "Reading Champion", description: "Completed 15 reading activities", isNew: true },
    { icon: "🔥", title: "8-Day Streak", description: "Learning every day!", isNew: true },
    { icon: "🎯", title: "Focus Master", description: "Perfect score on focus games", isNew: false },
    { icon: "⭐", title: "Star Student", description: "Earned 500 total points", isNew: false },
  ]

  const renderStars = (count: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="child" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-serif font-black mb-2">Amazing Work Today!</h1>
          <p className="text-xl text-muted-foreground">
            You completed {sessionSummary.activitiesCompleted} activities and earned {sessionSummary.pointsEarned}{" "}
            points!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Session Summary */}
          <Card className="border-4 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-black flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Activities Done:</span>
                  <Badge className="text-lg px-3 py-1">{sessionSummary.activitiesCompleted}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Time Spent:</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {sessionSummary.totalTime} min
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Points Earned:</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {sessionSummary.pointsEarned} pts
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Learning Streak:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-primary">{sessionSummary.streak}</span>
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Achievements */}
          <Card className="border-4 border-yellow-300 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-black flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                New Achievements!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements
                  .filter((a) => a.isNew)
                  .map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-yellow-200"
                    >
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-serif font-black">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => router.push("/child/activities")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎮</span>
                  <div>
                    <p className="font-bold">More Activities</p>
                    <p className="text-xs opacity-75">Keep learning!</p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-4 bg-transparent"
                onClick={() => router.push("/child/dashboard")}
              >
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6" />
                  <div>
                    <p className="font-bold">Back to Dashboard</p>
                    <p className="text-xs text-muted-foreground">See today's plan</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-black flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Activities You Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{activity.emoji}</span>
                      <div>
                        <h3 className="font-bold">{activity.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">{renderStars(activity.stars)}</div>
                          <span className="text-sm text-muted-foreground">• {activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="text-lg px-3 py-1">{activity.score}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-black flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                This Week's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-12 text-center font-bold text-sm">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{day.activities} activities</span>
                        <span className="text-sm font-bold text-primary">{day.points} pts</span>
                      </div>
                      <Progress value={(day.points / 160) * 100} className="h-2" />
                    </div>
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

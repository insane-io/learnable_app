"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Clock, Target, Users, Heart, Star } from "lucide-react"

export default function ADHDPage() {
  const strategies = [
    {
      title: "Break Tasks into Small Steps",
      description: "Divide complex activities into manageable 5-10 minute segments",
      icon: Target,
      difficulty: "Easy",
    },
    {
      title: "Use Visual Timers",
      description: "Help children see time passing with colorful countdown timers",
      icon: Clock,
      difficulty: "Easy",
    },
    {
      title: "Movement Breaks",
      description: "Include 2-3 minute physical activities between learning sessions",
      icon: Heart,
      difficulty: "Medium",
    },
    {
      title: "Fidget Tools",
      description: "Provide stress balls, fidget cubes, or textured objects during focus time",
      icon: Brain,
      difficulty: "Easy",
    },
  ]

  const activities = [
    {
      id: 1,
      title: "Focus Challenge",
      description: "Interactive attention-building games with immediate rewards",
      duration: "10-15 min",
      level: "Beginner",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      title: "Memory Palace",
      description: "Visual memory games using familiar locations and objects",
      duration: "8-12 min",
      level: "Intermediate",
      color: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      title: "Impulse Control Games",
      description: "Fun activities that practice stopping, thinking, and choosing",
      duration: "5-10 min",
      level: "Beginner",
      color: "bg-purple-100 text-purple-800",
    },
  ]

  const tips = [
    {
      category: "For Parents",
      items: [
        "Create consistent daily routines with visual schedules",
        "Use positive reinforcement immediately after good behavior",
        "Provide a quiet, organized space for homework and activities",
        "Break instructions into one step at a time",
      ],
    },
    {
      category: "For Teachers",
      items: [
        "Seat students away from distractions (windows, high-traffic areas)",
        "Use hand signals and visual cues to redirect attention",
        "Provide frequent breaks and movement opportunities",
        "Offer choices when possible to increase engagement",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="child" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-serif font-black text-blue-600">ADHD Support</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized activities and strategies designed for children with ADHD to improve focus, attention, and
            self-regulation skills.
          </p>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="tips">Tips & Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <Badge className={activity.color}>{activity.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.duration}
                      </span>
                      <Button size="sm">Start Activity</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {strategies.map((strategy, index) => {
                const IconComponent = strategy.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{strategy.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {strategy.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{strategy.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {tips.map((tipCategory, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      {tipCategory.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tipCategory.items.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Weekly Progress Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Focus Duration</span>
                    <span>12/15 minutes</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Task Completion</span>
                    <span>7/10 activities</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Self-Regulation</span>
                    <span>85% success rate</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

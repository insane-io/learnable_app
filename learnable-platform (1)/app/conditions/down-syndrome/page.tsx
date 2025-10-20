"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Repeat, Users, Smile, Star, Trophy, Clock, Target } from "lucide-react"

export default function DownSyndromePage() {
  const strategies = [
    {
      title: "Repetition & Practice",
      description: "Multiple practice opportunities with consistent reinforcement",
      icon: Repeat,
      difficulty: "Easy",
    },
    {
      title: "Visual Learning",
      description: "Use pictures, symbols, and visual aids to support understanding",
      icon: Smile,
      difficulty: "Easy",
    },
    {
      title: "Peer Interaction",
      description: "Structured social activities to build communication skills",
      icon: Users,
      difficulty: "Medium",
    },
    {
      title: "Positive Reinforcement",
      description: "Immediate praise and rewards for effort and achievement",
      icon: Trophy,
      difficulty: "Easy",
    },
  ]

  const activities = [
    {
      id: 1,
      title: "Memory Games",
      description: "Fun matching and sequence games to strengthen working memory",
      duration: "10-15 min",
      level: "Beginner",
      color: "bg-pink-100 text-pink-800",
    },
    {
      id: 2,
      title: "Communication Builder",
      description: "Interactive activities to practice speech and language skills",
      duration: "8-20 min",
      level: "Beginner",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 3,
      title: "Life Skills Practice",
      description: "Real-world scenarios teaching daily living and social skills",
      duration: "15-25 min",
      level: "Intermediate",
      color: "bg-green-100 text-green-800",
    },
  ]

  const learningSupports = [
    {
      name: "Slower Pacing",
      description: "Extended time for processing and responding to activities",
      active: true,
    },
    {
      name: "Visual Cues",
      description: "Picture prompts and visual instructions for all activities",
      active: true,
    },
    {
      name: "Simplified Language",
      description: "Clear, concrete instructions with familiar vocabulary",
      active: true,
    },
    {
      name: "Frequent Breaks",
      description: "Regular rest periods to maintain attention and engagement",
      active: false,
    },
  ]

  const tips = [
    {
      category: "For Parents",
      items: [
        "Break tasks into small, manageable steps with clear expectations",
        "Use consistent routines and provide plenty of practice time",
        "Celebrate every achievement, no matter how small",
        "Encourage independence while providing necessary support",
      ],
    },
    {
      category: "For Teachers",
      items: [
        "Use concrete examples and hands-on learning experiences",
        "Provide extra time for processing and completing tasks",
        "Create inclusive classroom environments with peer support",
        "Focus on strengths and build confidence through success",
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
            <div className="p-3 bg-pink-100 rounded-full">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-4xl font-serif font-black text-pink-600">Down Syndrome Support</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized learning activities designed for children with Down syndrome, focusing on strengths-based
            learning and individualized support.
          </p>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="supports">Learning Supports</TabsTrigger>
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
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-pink-600" />
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

          <TabsContent value="supports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-pink-600" />
                  Individualized Learning Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningSupports.map((support, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{support.name}</h4>
                      <p className="text-sm text-muted-foreground">{support.description}</p>
                    </div>
                    <Button variant={support.active ? "default" : "outline"} size="sm">
                      {support.active ? "Active" : "Enable"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  Learning Achievements This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Communication Skills</span>
                    <span>9/12 goals achieved</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Memory Activities</span>
                    <span>85% success rate</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Life Skills Practice</span>
                    <span>6/8 tasks completed</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {tips.map((tipCategory, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-pink-600" />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

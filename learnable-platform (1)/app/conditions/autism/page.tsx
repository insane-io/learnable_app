"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Puzzle, Calendar, Palette, Users, Heart, Star, Shield } from "lucide-react"

export default function AutismPage() {
  const strategies = [
    {
      title: "Visual Schedules",
      description: "Use picture schedules and visual cues to provide structure and predictability",
      icon: Calendar,
      difficulty: "Easy",
    },
    {
      title: "Sensory Breaks",
      description: "Regular breaks in calm, quiet spaces to prevent sensory overload",
      icon: Shield,
      difficulty: "Easy",
    },
    {
      title: "Social Stories",
      description: "Simple stories that explain social situations and appropriate responses",
      icon: Users,
      difficulty: "Medium",
    },
    {
      title: "Special Interests Integration",
      description: "Incorporate child's interests into learning activities for engagement",
      icon: Heart,
      difficulty: "Medium",
    },
  ]

  const activities = [
    {
      id: 1,
      title: "Social Skills Practice",
      description: "Interactive scenarios teaching conversation and social cues",
      duration: "10-15 min",
      level: "Beginner",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 2,
      title: "Routine Builder",
      description: "Create and practice daily routines with visual supports",
      duration: "5-20 min",
      level: "Beginner",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 3,
      title: "Emotion Recognition",
      description: "Games to identify and understand different emotions and expressions",
      duration: "8-12 min",
      level: "Intermediate",
      color: "bg-green-100 text-green-800",
    },
  ]

  const sensorySupports = [
    {
      name: "Reduced Visual Stimulation",
      description: "Simplified interface with minimal distractions",
      active: true,
    },
    {
      name: "Sound Control",
      description: "Adjustable volume and option to mute background sounds",
      active: true,
    },
    {
      name: "Predictable Navigation",
      description: "Consistent layout and clear navigation patterns",
      active: true,
    },
    {
      name: "Break Reminders",
      description: "Gentle prompts for sensory breaks during activities",
      active: false,
    },
  ]

  const tips = [
    {
      category: "For Parents",
      items: [
        "Maintain consistent routines and prepare for changes in advance",
        "Create a calm-down space with sensory tools (weighted blanket, fidgets)",
        "Use clear, concrete language and avoid idioms or sarcasm",
        "Celebrate small victories and focus on strengths and interests",
      ],
    },
    {
      category: "For Teachers",
      items: [
        "Provide advance notice of schedule changes or new activities",
        "Use visual supports and written instructions alongside verbal ones",
        "Allow processing time - wait longer for responses to questions",
        "Create quiet spaces where students can retreat when overwhelmed",
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
            <div className="p-3 bg-purple-100 rounded-full">
              <Puzzle className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-serif font-black text-purple-600">Autism Support</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized activities and supports designed for children on the autism spectrum, focusing on social skills,
            communication, and sensory needs.
          </p>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="supports">Sensory Supports</TabsTrigger>
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
                        <Puzzle className="h-4 w-4" />
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
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-purple-600" />
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
                  <Palette className="h-5 w-5 text-purple-600" />
                  Sensory Accommodation Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sensorySupports.map((support, index) => (
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

            {/* Social Skills Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Social Skills Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Eye Contact Practice</span>
                    <span>6/10 successful attempts</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Turn-Taking Skills</span>
                    <span>8/10 activities completed</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Emotion Recognition</span>
                    <span>75% accuracy rate</span>
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
                      <Users className="h-5 w-5 text-purple-600" />
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

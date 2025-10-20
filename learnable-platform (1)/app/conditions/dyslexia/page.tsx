"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Volume2, Eye, Palette, Type, Headphones, Star, Users } from "lucide-react"

export default function DyslexiaPage() {
  const strategies = [
    {
      title: "Multi-Sensory Learning",
      description: "Combine visual, auditory, and tactile methods for better retention",
      icon: Palette,
      difficulty: "Medium",
    },
    {
      title: "Phonics-Based Approach",
      description: "Break words into sounds and syllables for easier recognition",
      icon: Volume2,
      difficulty: "Easy",
    },
    {
      title: "Visual Word Recognition",
      description: "Use sight words and visual patterns to improve reading fluency",
      icon: Eye,
      difficulty: "Easy",
    },
    {
      title: "Audio Support",
      description: "Provide text-to-speech and audio books for comprehension",
      icon: Headphones,
      difficulty: "Easy",
    },
  ]

  const activities = [
    {
      id: 1,
      title: "Word Building Games",
      description: "Interactive phonics activities with immediate audio feedback",
      duration: "15-20 min",
      level: "Beginner",
      color: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      title: "Reading Comprehension",
      description: "Stories with adjustable text size, spacing, and background colors",
      duration: "10-25 min",
      level: "Intermediate",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 3,
      title: "Spelling Practice",
      description: "Multi-sensory spelling games with visual and audio cues",
      duration: "8-15 min",
      level: "Beginner",
      color: "bg-purple-100 text-purple-800",
    },
  ]

  const readingSupports = [
    {
      name: "Dyslexia-Friendly Font",
      description: "OpenDyslexic font reduces letter confusion",
      active: true,
    },
    {
      name: "Increased Line Spacing",
      description: "Extra space between lines improves readability",
      active: true,
    },
    {
      name: "Background Tinting",
      description: "Colored backgrounds reduce visual stress",
      active: false,
    },
    {
      name: "Text-to-Speech",
      description: "Audio narration for all text content",
      active: true,
    },
  ]

  const tips = [
    {
      category: "For Parents",
      items: [
        "Read together daily, taking turns with sentences or paragraphs",
        "Use audiobooks alongside physical books to support comprehension",
        "Celebrate effort and progress, not just accuracy",
        "Create a quiet, well-lit reading space free from distractions",
      ],
    },
    {
      category: "For Teachers",
      items: [
        "Allow extra time for reading and writing assignments",
        "Provide written instructions alongside verbal ones",
        "Use graphic organizers to help with writing structure",
        "Offer alternative ways to demonstrate knowledge (oral presentations, projects)",
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
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-serif font-black text-green-600">Dyslexia Support</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized reading and writing activities designed to support children with dyslexia through multi-sensory
            learning approaches.
          </p>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="supports">Reading Supports</TabsTrigger>
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
                        <BookOpen className="h-4 w-4" />
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
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-green-600" />
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
                  <Type className="h-5 w-5 text-green-600" />
                  Reading Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {readingSupports.map((support, index) => (
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

            {/* Reading Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Reading Progress This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Words Read Correctly</span>
                    <span>245/300 words</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reading Fluency</span>
                    <span>65 words per minute</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Comprehension Score</span>
                    <span>8/10 questions</span>
                  </div>
                  <Progress value={80} className="h-2" />
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
                      <Users className="h-5 w-5 text-green-600" />
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

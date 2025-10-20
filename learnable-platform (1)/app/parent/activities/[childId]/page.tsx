"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Download, Clock, Users, BookOpen, Brain, Target, CheckCircle, Printer } from "lucide-react"

export default function ParentActivitiesPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.childId as string
  const [completedActivities, setCompletedActivities] = useState<string[]>([])

  const childData = {
    id: childId,
    name: "Alex Johnson",
    age: 8,
    conditions: ["ADHD", "Mild Dyslexia"],
    avatar: "/placeholder.svg?height=40&width=40",
  }

  const recommendedActivities = [
    {
      id: "reading-1",
      title: "Story Time Together",
      description: "Read a short story together and discuss the characters",
      duration: "15-20 minutes",
      category: "Reading",
      difficulty: "Easy",
      materials: ["Children's book", "Comfortable seating"],
      instructions: [
        "Choose a book appropriate for your child's reading level",
        "Take turns reading paragraphs or pages",
        "Ask questions about the story as you read",
        "Discuss the characters and plot at the end",
      ],
      benefits: ["Improves reading comprehension", "Builds vocabulary", "Strengthens parent-child bond"],
      icon: BookOpen,
      color: "bg-blue-100 border-blue-300",
    },
    {
      id: "focus-1",
      title: "Mindful Breathing Exercise",
      description: "Practice calm breathing techniques to improve focus",
      duration: "5-10 minutes",
      category: "Focus & Attention",
      difficulty: "Easy",
      materials: ["Quiet space", "Comfortable cushion (optional)"],
      instructions: [
        "Find a quiet, comfortable spot to sit together",
        "Close your eyes and breathe slowly through your nose",
        "Count to 4 while breathing in, hold for 2, breathe out for 4",
        "Repeat 5-10 times, focusing only on breathing",
      ],
      benefits: ["Improves attention span", "Reduces anxiety", "Teaches self-regulation"],
      icon: Target,
      color: "bg-green-100 border-green-300",
    },
    {
      id: "math-1",
      title: "Kitchen Math Adventures",
      description: "Practice math skills while cooking or baking together",
      duration: "30-45 minutes",
      category: "Mathematics",
      difficulty: "Medium",
      materials: ["Recipe", "Measuring cups", "Ingredients"],
      instructions: [
        "Choose a simple recipe to make together",
        "Have your child measure ingredients",
        "Practice fractions with measuring cups (1/2 cup, 1/4 cup)",
        "Count and add ingredients together",
      ],
      benefits: ["Practical math application", "Fine motor skills", "Following instructions"],
      icon: Brain,
      color: "bg-purple-100 border-purple-300",
    },
    {
      id: "social-1",
      title: "Emotion Identification Game",
      description: "Practice recognizing and naming different emotions",
      duration: "10-15 minutes",
      category: "Social Skills",
      difficulty: "Easy",
      materials: ["Emotion cards or pictures", "Mirror"],
      instructions: [
        "Show emotion cards or make faces in the mirror",
        "Name the emotion together",
        "Talk about when you might feel this way",
        "Practice making the facial expression",
      ],
      benefits: ["Emotional awareness", "Social understanding", "Communication skills"],
      icon: Users,
      color: "bg-orange-100 border-orange-300",
    },
  ]

  const printableWorksheets = [
    {
      id: "worksheet-1",
      title: "Letter Tracing Practice",
      description: "Uppercase and lowercase letter formation",
      category: "Writing",
      pages: 3,
      ageRange: "6-8 years",
    },
    {
      id: "worksheet-2",
      title: "Number Recognition 1-20",
      description: "Number identification and counting exercises",
      category: "Math",
      pages: 2,
      ageRange: "5-7 years",
    },
    {
      id: "worksheet-3",
      title: "Pattern Completion",
      description: "Visual pattern recognition and completion",
      category: "Logic",
      pages: 4,
      ageRange: "7-9 years",
    },
  ]

  const weeklyTips = [
    {
      title: "Creating a Calm Learning Environment",
      content:
        "For children with ADHD, minimize distractions by choosing a quiet space with good lighting and comfortable seating.",
    },
    {
      title: "Reading Support for Dyslexia",
      content: "Use books with larger fonts and consider colored overlays to reduce visual stress while reading.",
    },
    {
      title: "Celebrating Small Wins",
      content:
        "Acknowledge effort over perfection. Praise your child for trying hard, even if the result isn't perfect.",
    },
  ]

  const handleActivityComplete = (activityId: string) => {
    setCompletedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
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
            <Avatar className="h-12 w-12">
              <AvatarImage src={childData.avatar || "/placeholder.svg"} alt={childData.name} />
              <AvatarFallback>
                {childData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-black">Home Activities for {childData.name}</h1>
              <p className="text-muted-foreground">Recommended activities to support learning at home</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Recommended Activities</TabsTrigger>
            <TabsTrigger value="worksheets">Printable Worksheets</TabsTrigger>
            <TabsTrigger value="tips">Weekly Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {recommendedActivities.map((activity) => {
                const IconComponent = activity.icon
                const isCompleted = completedActivities.includes(activity.id)

                return (
                  <Card key={activity.id} className={`border-2 ${activity.color} ${isCompleted ? "opacity-75" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6 text-primary" />
                          <div>
                            <CardTitle className="text-xl">{activity.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={activity.id}
                            checked={isCompleted}
                            onCheckedChange={() => handleActivityComplete(activity.id)}
                          />
                          <label htmlFor={activity.id} className="text-sm font-medium">
                            {isCompleted ? "Completed" : "Mark as done"}
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {activity.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Materials Needed:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {activity.materials.map((material, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                {material}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Instructions:</h4>
                          <ol className="text-sm text-muted-foreground space-y-1">
                            {activity.instructions.map((instruction, index) => (
                              <li key={index} className="flex gap-2">
                                <span className="font-medium text-primary">{index + 1}.</span>
                                {instruction}
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Benefits:</h4>
                          <div className="flex flex-wrap gap-1">
                            {activity.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="worksheets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Printable Learning Worksheets</CardTitle>
                <p className="text-muted-foreground">Download and print these activities for offline learning</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {printableWorksheets.map((worksheet) => (
                    <Card key={worksheet.id} className="border">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{worksheet.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{worksheet.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Category:</span>
                            <Badge variant="secondary" className="text-xs">
                              {worksheet.category}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Pages:</span>
                            <span>{worksheet.pages}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Age Range:</span>
                            <span>{worksheet.ageRange}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              {weeklyTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Need More Support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about these activities or need personalized recommendations, don't hesitate to
                  reach out to your child's teacher.
                </p>
                <Button onClick={() => router.push("/parent/communication")}>Message Teacher</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Filter, Clock, Target, Users, BookOpen, Brain, Focus } from "lucide-react"

export default function AssignActivityPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedStudents = searchParams.get("students")?.split(",") || []

  const [selectedStudents, setSelectedStudents] = useState<string[]>(preSelectedStudents)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [assignmentType, setAssignmentType] = useState("immediate")
  const [dueDate, setDueDate] = useState("")
  const [instructions, setInstructions] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const students = [
    {
      id: "alex-johnson",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["ADHD", "Mild Dyslexia"],
      currentLevel: "Intermediate",
    },
    {
      id: "emma-smith",
      name: "Emma Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Autism Spectrum"],
      currentLevel: "Advanced",
    },
    {
      id: "michael-brown",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Down Syndrome"],
      currentLevel: "Beginner",
    },
    {
      id: "sarah-davis",
      name: "Sarah Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Dyslexia"],
      currentLevel: "Intermediate",
    },
  ]

  const activities = [
    {
      id: "word-detective",
      title: "Word Detective",
      description: "Find hidden words in colorful pictures",
      category: "Reading",
      difficulty: "Easy",
      duration: "10-15 min",
      skills: ["Reading Comprehension", "Visual Processing"],
      icon: BookOpen,
      color: "bg-blue-100 border-blue-300",
      suitableFor: ["ADHD", "Dyslexia"],
    },
    {
      id: "focus-challenge",
      title: "Focus Challenge",
      description: "Attention and concentration exercises",
      category: "Focus",
      difficulty: "Medium",
      duration: "5-10 min",
      skills: ["Attention", "Concentration"],
      icon: Focus,
      color: "bg-green-100 border-green-300",
      suitableFor: ["ADHD"],
    },
    {
      id: "math-adventure",
      title: "Math Adventure",
      description: "Interactive math problem solving",
      category: "Math",
      difficulty: "Medium",
      duration: "15-20 min",
      skills: ["Problem Solving", "Numerical Reasoning"],
      icon: Brain,
      color: "bg-purple-100 border-purple-300",
      suitableFor: ["Down Syndrome", "ADHD"],
    },
    {
      id: "social-stories",
      title: "Social Stories",
      description: "Interactive social situation scenarios",
      category: "Social",
      difficulty: "Easy",
      duration: "10-15 min",
      skills: ["Social Skills", "Emotional Understanding"],
      icon: Users,
      color: "bg-orange-100 border-orange-300",
      suitableFor: ["Autism Spectrum"],
    },
  ]

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || activity.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const handleAssign = () => {
    if (selectedStudents.length > 0 && selectedActivities.length > 0) {
      // Assignment logic here
      console.log("Assigning activities:", {
        students: selectedStudents,
        activities: selectedActivities,
        type: assignmentType,
        dueDate,
        instructions,
      })
      router.push("/teacher/dashboard")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

          <div>
            <h1 className="text-3xl font-serif font-black">Assign Activities</h1>
            <p className="text-muted-foreground">Select students and activities to create assignments</p>
          </div>

          <div className="ml-auto">
            <Button onClick={handleAssign} disabled={selectedStudents.length === 0 || selectedActivities.length === 0}>
              Assign to {selectedStudents.length} Student{selectedStudents.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Student Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Select Students ({selectedStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedStudents.includes(student.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <Checkbox checked={selectedStudents.includes(student.id)} readOnly />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback className="text-xs">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{student.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {student.conditions.slice(0, 2).map((condition) => (
                          <Badge key={condition} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Select Activities ({selectedActivities.length})
              </CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="focus">Focus</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredActivities.map((activity) => {
                  const IconComponent = activity.icon
                  const isSelected = selectedActivities.includes(activity.id)

                  return (
                    <Card
                      key={activity.id}
                      className={`cursor-pointer transition-all duration-200 ${activity.color} ${
                        isSelected ? "border-primary bg-primary/10 shadow-md" : "hover:shadow-md"
                      }`}
                      onClick={() => handleActivitySelect(activity.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox checked={isSelected} readOnly />
                          <IconComponent className="h-6 w-6 text-primary mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                                {activity.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.duration}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground mb-1">Skills:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {activity.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground mb-1">Suitable for:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {activity.suitableFor.map((condition) => (
                                    <Badge key={condition} variant="outline" className="text-xs">
                                      {condition}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Settings */}
        {(selectedStudents.length > 0 || selectedActivities.length > 0) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Assignment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assignment Type</label>
                    <Select value={assignmentType} onValueChange={setAssignmentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Assign Immediately</SelectItem>
                        <SelectItem value="scheduled">Schedule for Later</SelectItem>
                        <SelectItem value="recurring">Recurring Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {assignmentType !== "immediate" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Due Date</label>
                      <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Instructions for Students</label>
                  <Textarea
                    placeholder="Add any special instructions or notes for the students..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

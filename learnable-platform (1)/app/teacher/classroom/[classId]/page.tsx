"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react"

export default function ClassroomPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.classId as string
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const classData = {
    id: classId,
    name: "3rd Grade A",
    totalStudents: 18,
    activeToday: 15,
    avgProgress: 87,
    needsAttention: 3,
  }

  const students = [
    {
      id: "alex-johnson",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["ADHD", "Mild Dyslexia"],
      weeklyProgress: 85,
      lastActivity: "2 hours ago",
      currentStreak: 8,
      needsAttention: false,
      recentScore: 92,
      activitiesCompleted: 24,
      totalActivities: 28,
      status: "active",
      parentContact: "parent@example.com",
    },
    {
      id: "emma-smith",
      name: "Emma Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Autism Spectrum"],
      weeklyProgress: 92,
      lastActivity: "1 hour ago",
      currentStreak: 12,
      needsAttention: false,
      recentScore: 88,
      activitiesCompleted: 28,
      totalActivities: 30,
      status: "active",
      parentContact: "parent@example.com",
    },
    {
      id: "michael-brown",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Down Syndrome"],
      weeklyProgress: 65,
      lastActivity: "1 day ago",
      currentStreak: 3,
      needsAttention: true,
      recentScore: 72,
      activitiesCompleted: 15,
      totalActivities: 25,
      status: "inactive",
      parentContact: "parent@example.com",
    },
    {
      id: "sarah-davis",
      name: "Sarah Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      conditions: ["Dyslexia"],
      weeklyProgress: 78,
      lastActivity: "3 hours ago",
      currentStreak: 6,
      needsAttention: true,
      recentScore: 85,
      activitiesCompleted: 20,
      totalActivities: 26,
      status: "active",
      parentContact: "parent@example.com",
    },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "needs-attention" && student.needsAttention) ||
      (filterBy === "active" && student.status === "active") ||
      (filterBy === "inactive" && student.status === "inactive")
    return matchesSearch && matchesFilter
  })

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id))
    }
  }

  const bulkAssignActivity = () => {
    if (selectedStudents.length > 0) {
      router.push(`/teacher/assign-activity?students=${selectedStudents.join(",")}`)
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
            <h1 className="text-3xl font-serif font-black">{classData.name}</h1>
            <p className="text-muted-foreground">
              {classData.totalStudents} students • {classData.activeToday} active today
            </p>
          </div>

          <div className="ml-auto flex gap-2">
            <Button onClick={() => router.push("/teacher/monitor")}>
              <Eye className="h-4 w-4 mr-2" />
              Monitor Live
            </Button>
            <Button variant="outline" onClick={() => router.push("/teacher/assign-activity")}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Activity
            </Button>
          </div>
        </div>

        {/* Class Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{classData.totalStudents}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{classData.activeToday}</div>
              <div className="text-sm text-muted-foreground">Active Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{classData.avgProgress}%</div>
              <div className="text-sm text-muted-foreground">Average Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{classData.needsAttention}</div>
              <div className="text-sm text-muted-foreground">Need Attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Student Management
              </CardTitle>
              {selectedStudents.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedStudents.length} selected</span>
                  <Button size="sm" onClick={bulkAssignActivity}>
                    Bulk Assign Activity
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active Today</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All
                </label>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className={`transition-all duration-200 ${
                    student.needsAttention ? "border-orange-300 bg-orange-50" : ""
                  } ${selectedStudents.includes(student.id) ? "border-primary bg-primary/5" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleStudentSelect(student.id)}
                      />

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{student.name}</h4>
                          {student.needsAttention && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                          {student.status === "active" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex gap-2 mb-2">
                          {student.conditions.map((condition) => (
                            <Badge key={condition} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Progress:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={student.weeklyProgress} className="flex-1 h-2" />
                              <span className="font-medium">{student.weeklyProgress}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Activities:</span>
                            <div className="font-medium">
                              {student.activitiesCompleted}/{student.totalActivities}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Recent Score:</span>
                            <div className="font-medium">{student.recentScore}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Streak:</span>
                            <div className="font-medium text-primary">{student.currentStreak} days</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/teacher/student/${student.id}`)}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/teacher/communication?student=${student.id}`)}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Contact Parent
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

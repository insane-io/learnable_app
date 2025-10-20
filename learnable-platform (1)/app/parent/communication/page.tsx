"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Paperclip, Search, Calendar, FileText, User } from "lucide-react"

export default function ParentCommunicationPage() {
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const teachers = [
    {
      id: "ms-smith",
      name: "Ms. Sarah Smith",
      role: "Special Education Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "2 hours ago",
      unreadCount: 2,
      subjects: ["Reading", "Writing", "Social Skills"],
    },
    {
      id: "mr-johnson",
      name: "Mr. Mike Johnson",
      role: "Math Specialist",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "1 day ago",
      unreadCount: 0,
      subjects: ["Mathematics", "Problem Solving"],
    },
  ]

  const conversations = [
    {
      id: 1,
      teacherId: "ms-smith",
      teacherName: "Ms. Sarah Smith",
      messages: [
        {
          id: 1,
          sender: "teacher",
          content:
            "Hi! I wanted to update you on Alex's progress this week. He's been doing really well with his reading activities.",
          timestamp: "2024-10-20 10:30 AM",
          attachments: [],
        },
        {
          id: 2,
          sender: "parent",
          content:
            "That's wonderful to hear! We've been practicing reading together at home using the activities you recommended.",
          timestamp: "2024-10-20 11:15 AM",
          attachments: [],
        },
        {
          id: 3,
          sender: "teacher",
          content:
            "Perfect! I can see the improvement in his comprehension. I've attached his latest assessment results for your review.",
          timestamp: "2024-10-20 2:45 PM",
          attachments: [{ name: "Alex_Reading_Assessment_Oct2024.pdf", type: "pdf" }],
        },
        {
          id: 4,
          sender: "teacher",
          content:
            "Also, I think we should consider increasing the difficulty level of his reading activities. What do you think?",
          timestamp: "2024-10-20 2:47 PM",
          attachments: [],
        },
      ],
    },
  ]

  const announcements = [
    {
      id: 1,
      title: "Parent-Teacher Conference Scheduling",
      content:
        "Parent-teacher conferences for November are now open for scheduling. Please book your preferred time slot.",
      date: "2024-10-18",
      priority: "high",
      author: "School Administration",
    },
    {
      id: 2,
      title: "New Learning Resources Available",
      content:
        "We've added new interactive math games to our platform. These are specifically designed for children with learning differences.",
      date: "2024-10-15",
      priority: "medium",
      author: "Ms. Sarah Smith",
    },
    {
      id: 3,
      title: "Holiday Schedule Update",
      content: "Please note the updated holiday schedule for November. Classes will be adjusted accordingly.",
      date: "2024-10-12",
      priority: "low",
      author: "School Administration",
    },
  ]

  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0].id)
  const selectedConversation = conversations.find((c) => c.teacherId === selectedTeacher)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="parent" />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black mb-2">Communication Center</h1>
          <p className="text-muted-foreground">Stay connected with your child's teachers and school</p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
              {/* Teacher List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Teachers</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search teachers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                          selectedTeacher === teacher.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                        }`}
                        onClick={() => setSelectedTeacher(teacher.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
                            <AvatarFallback>
                              {teacher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">{teacher.name}</h4>
                              {teacher.unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  {teacher.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{teacher.role}</p>
                            <p className="text-xs text-muted-foreground">{teacher.lastMessage}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teachers.find((t) => t.id === selectedTeacher)?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {teachers
                          .find((t) => t.id === selectedTeacher)
                          ?.name.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{teachers.find((t) => t.id === selectedTeacher)?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {teachers.find((t) => t.id === selectedTeacher)?.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {selectedConversation?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "parent" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === "parent" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs opacity-75">
                                  <FileText className="h-3 w-3" />
                                  <span>{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[60px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Announcements</CardTitle>
                <p className="text-muted-foreground">Important updates and information from the school</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <Badge className={`text-xs ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{announcement.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(announcement.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

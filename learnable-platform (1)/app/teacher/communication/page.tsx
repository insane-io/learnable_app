"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText } from "lucide-react"

export default function TeacherCommunicationPage() {
  const searchParams = useSearchParams()
  const preSelectedStudent = searchParams.get("student")

  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParent, setSelectedParent] = useState(preSelectedStudent ? `parent-${preSelectedStudent}` : "")

  const parents = [
    {
      id: "parent-alex-johnson",
      studentName: "Alex Johnson",
      parentName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "2 hours ago",
      unreadCount: 1,
      studentConditions: ["ADHD", "Mild Dyslexia"],
    },
    {
      id: "parent-emma-smith",
      studentName: "Emma Smith",
      parentName: "Michael Smith",
      email: "michael.smith@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "1 day ago",
      unreadCount: 0,
      studentConditions: ["Autism Spectrum"],
    },
    {
      id: "parent-michael-brown",
      studentName: "Michael Brown",
      parentName: "Lisa Brown",
      email: "lisa.brown@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "3 days ago",
      unreadCount: 2,
      studentConditions: ["Down Syndrome"],
    },
  ]

  const conversations = [
    {
      id: 1,
      parentId: "parent-alex-johnson",
      messages: [
        {
          id: 1,
          sender: "parent",
          content: "Hi Ms. Johnson, I wanted to ask about Alex's progress with reading activities this week.",
          timestamp: "2024-10-20 9:30 AM",
          attachments: [],
        },
        {
          id: 2,
          sender: "teacher",
          content:
            "Hello Sarah! Alex has been doing wonderfully. He completed 8 reading activities this week with an average score of 87%. I'm particularly impressed with his improvement in comprehension.",
          timestamp: "2024-10-20 10:15 AM",
          attachments: [],
        },
        {
          id: 3,
          sender: "teacher",
          content:
            "I've attached his detailed progress report for this week. You'll notice significant improvement in focus duration as well.",
          timestamp: "2024-10-20 10:17 AM",
          attachments: [{ name: "Alex_Weekly_Report_Oct20.pdf", type: "pdf" }],
        },
        {
          id: 4,
          sender: "parent",
          content:
            "Thank you so much! We've been practicing the home activities you recommended. Should we continue with the same routine?",
          timestamp: "2024-10-20 2:45 PM",
          attachments: [],
        },
      ],
    },
  ]

  const announcements = [
    {
      id: 1,
      title: "Parent-Teacher Conference Week",
      content:
        "Scheduling is now open for November parent-teacher conferences. Please book your preferred time slot through the parent portal.",
      date: "2024-10-18",
      priority: "high",
      recipients: "All Parents",
    },
    {
      id: 2,
      title: "New Learning Resources Available",
      content:
        "We've added new interactive activities specifically designed for children with learning differences. These will be gradually introduced to student learning plans.",
      date: "2024-10-15",
      priority: "medium",
      recipients: "All Parents",
    },
  ]

  const selectedConversation = conversations.find((c) => c.parentId === selectedParent)
  const selectedParentData = parents.find((p) => p.id === selectedParent)

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedParent) {
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
      <Navigation role="teacher" />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black mb-2">Parent Communication</h1>
          <p className="text-muted-foreground">Connect with parents and share student progress</p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
              {/* Parent List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Parent Contacts</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search parents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {parents.map((parent) => (
                      <div
                        key={parent.id}
                        className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                          selectedParent === parent.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                        }`}
                        onClick={() => setSelectedParent(parent.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={parent.avatar || "/placeholder.svg"} alt={parent.parentName} />
                            <AvatarFallback>
                              {parent.parentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">{parent.parentName}</h4>
                              {parent.unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  {parent.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">Parent of {parent.studentName}</p>
                            <div className="flex gap-1 mt-1">
                              {parent.studentConditions.slice(0, 2).map((condition) => (
                                <Badge key={condition} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{parent.lastMessage}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-2 flex flex-col">
                {selectedParentData ? (
                  <>
                    <CardHeader className="border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedParentData.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {selectedParentData.parentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedParentData.parentName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Parent of {selectedParentData.studentName} • {selectedParentData.email}
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
                            className={`flex ${message.sender === "teacher" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender === "teacher" ? "bg-primary text-primary-foreground" : "bg-muted"
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
                          placeholder="Type your message to the parent..."
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
                          <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                            Send
                          </Button>
                          <Button size="sm" variant="outline">
                            Attach
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <CardContent className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Select a parent to start messaging</p>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Class Announcements</h2>
              <Button>Create Announcement</Button>
            </div>

            <div className="grid gap-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {announcement.recipients} • {announcement.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{announcement.content}</p>
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

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Clock, Star } from "lucide-react"

export default function ChildActivitiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activities, setActivities] = useState<any[] | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/data/activities-data.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setActivities(data)
      })
      .catch(() => {
        if (mounted) setActivities([])
      })
    return () => {
      mounted = false
    }
  }, [])

  const categories = [
    { id: "all", label: "All Activities", emoji: "🎯" },
    { id: "reading", label: "Reading", emoji: "📖" },
    { id: "math", label: "Math", emoji: "🔢" },
    { id: "focus", label: "Focus", emoji: "🎯" },
    { id: "memory", label: "Memory", emoji: "🧠" },
    { id: "social", label: "Social", emoji: "👥" },
  ]

  const filteredActivities = (activities ?? []).filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
      <Navigation role="child" />

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-black mb-4">Learning Activities 🎮</h1>
          <p className="text-xl text-muted-foreground mb-6">Choose from lots of fun games and activities!</p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex flex-col gap-1 p-3 h-auto">
                <span className="text-2xl">{category.emoji}</span>
                <span className="text-xs font-medium">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities === null && (
            <div className="col-span-3 text-center py-12">Loading activities…</div>
          )}

          {activities !== null &&
            filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className={`border-2 hover:shadow-lg transition-all duration-200 cursor-pointer ${activity.color} ${
                  activity.completed ? "opacity-75" : "hover:scale-105"
                }`}
                onClick={() => router.push(`/child/activity/${activity.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{activity.emoji}</div>
                    {activity.completed && <Badge className="bg-primary text-primary-foreground">✅ Done!</Badge>}
                  </div>
                  <CardTitle className="text-xl font-serif font-black">{activity.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{activity.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.duration}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{activity.rating}</span>
                    </div>
                  </div>

                  <Button className="w-full text-lg h-12" disabled={activity.completed}>
                    {activity.completed ? (
                      <>✅ Completed!</>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Start Activity
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-serif font-black mb-2">No activities found</h3>
            <p className="text-muted-foreground">Try searching for something else or check out all activities!</p>
          </div>
        )}
      </div>
    </div>
  )
}

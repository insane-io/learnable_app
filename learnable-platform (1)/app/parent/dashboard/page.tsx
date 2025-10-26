"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import pb from "@/lib/pb"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  TrendingUp,
  Clock,
  Target,
  MessageCircle,
  FileText,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Gamepad2,
  Activity,
  Play
} from "lucide-react"
import { isAuthenticated, hasRole, getCurrentUser } from "@/lib/auth"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, Cell, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

export default function ParentDashboardPage() {
  const router = useRouter()
  const [selectedChild, setSelectedChild] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const result = await pb.collection('students').getList(1, 50,
        {
          headers: {
            Authorization: `Bearer ${pb.authStore?.token}`
          }
        }
      );
      const data = result.items.map((item) => ({
        name: item.student_name || item.name,
        id: item.id,
        avatar: item.avatar,
      }))
      setChildren(data)
      if (data.length > 0 && !selectedChild) {
        setSelectedChild(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents();
  }, [])

  useEffect(() => {
    if (!isAuthenticated() || !hasRole('parent')) {
      router.push('/parent/login')
      return
    }
    const user = getCurrentUser()
    setCurrentUser(user)
    console.log('Current logged in parent:', user)
  }, [router])

  const currentChild = children.find((child) => child.id === selectedChild) || children[0] || { id: '', name: 'Student' }

  // Student-specific game data (dummy data)
  const studentGameData = {
    alex: {
      weeklyGames: [
        { day: "Mon", games: 5, score: 85, time: 45, mathGames: 2, readingGames: 2, memoryGames: 1 },
        { day: "Tue", games: 7, score: 92, time: 60, mathGames: 3, readingGames: 2, memoryGames: 2 },
        { day: "Wed", games: 4, score: 78, time: 35, mathGames: 1, readingGames: 2, memoryGames: 1 },
        { day: "Thu", games: 8, score: 88, time: 70, mathGames: 3, readingGames: 3, memoryGames: 2 },
        { day: "Fri", games: 6, score: 95, time: 55, mathGames: 2, readingGames: 2, memoryGames: 2 },
        { day: "Sat", games: 10, score: 90, time: 85, mathGames: 4, readingGames: 3, memoryGames: 3 },
        { day: "Sun", games: 9, score: 87, time: 75, mathGames: 3, readingGames: 3, memoryGames: 3 },
      ],
      categories: [
        { category: "Math", games: 18, fill: "hsl(var(--chart-1))" },
        { category: "Reading", games: 17, fill: "hsl(var(--chart-2))" },
        { category: "Memory", games: 14, fill: "hsl(var(--chart-3))" },
        { category: "Puzzle", games: 8, fill: "hsl(var(--chart-4))" },
        { category: "Focus", games: 6, fill: "hsl(var(--chart-5))" },
      ],
      performance: [
        { week: "Week 1", score: 75, gamesPlayed: 28 },
        { week: "Week 2", score: 82, gamesPlayed: 35 },
        { week: "Week 3", score: 78, gamesPlayed: 32 },
        { week: "Week 4", score: 88, gamesPlayed: 42 },
        { week: "Week 5", score: 92, gamesPlayed: 49 },
      ],
      totalGames: 63,
      avgScore: 87,
      totalTime: 425, // minutes
      streak: 8,
    },
    emma: {
      weeklyGames: [
        { day: "Mon", games: 6, score: 88, time: 50, mathGames: 2, readingGames: 3, memoryGames: 1 },
        { day: "Tue", games: 8, score: 95, time: 65, mathGames: 3, readingGames: 3, memoryGames: 2 },
        { day: "Wed", games: 5, score: 82, time: 40, mathGames: 2, readingGames: 2, memoryGames: 1 },
        { day: "Thu", games: 7, score: 91, time: 60, mathGames: 2, readingGames: 3, memoryGames: 2 },
        { day: "Fri", games: 9, score: 97, time: 70, mathGames: 3, readingGames: 4, memoryGames: 2 },
        { day: "Sat", games: 11, score: 93, time: 90, mathGames: 4, readingGames: 4, memoryGames: 3 },
        { day: "Sun", games: 10, score: 89, time: 80, mathGames: 3, readingGames: 4, memoryGames: 3 },
      ],
      categories: [
        { category: "Math", games: 19, fill: "hsl(var(--chart-1))" },
        { category: "Reading", games: 23, fill: "hsl(var(--chart-2))" },
        { category: "Memory", games: 14, fill: "hsl(var(--chart-3))" },
        { category: "Puzzle", games: 10, fill: "hsl(var(--chart-4))" },
        { category: "Focus", games: 8, fill: "hsl(var(--chart-5))" },
      ],
      performance: [
        { week: "Week 1", score: 80, gamesPlayed: 32 },
        { week: "Week 2", score: 85, gamesPlayed: 38 },
        { week: "Week 3", score: 88, gamesPlayed: 40 },
        { week: "Week 4", score: 91, gamesPlayed: 48 },
        { week: "Week 5", score: 95, gamesPlayed: 56 },
      ],
      totalGames: 74,
      avgScore: 92,
      totalTime: 455, // minutes
      streak: 5,
    },
  }

  // Get current student's data
  const currentStudentData = studentGameData[selectedChild as keyof typeof studentGameData] || studentGameData.alex
  const weeklyGameData = currentStudentData.weeklyGames
  const gamesByCategory = currentStudentData.categories
  const performanceData = currentStudentData.performance

  // Individual game statistics
  const individualGames = {
    alex: [
      {
        id: 1,
        name: "Signal Sprinter",
        category: "ADHD Assessment Game",
        condition: "ADHD",
        timesPlayed: 12,
        bestScore: 95,
        avgScore: 87,
        lastPlayed: "2 hours ago",
        totalTime: 84, // minutes
        improvement: "+8%",
        difficulty: "Medium",
        status: "completed",
        progressHistory: [
          { attempt: "1", score: 72 },
          { attempt: "2", score: 75 },
          { attempt: "3", score: 78 },
          { attempt: "4", score: 82 },
          { attempt: "5", score: 85 },
          { attempt: "6", score: 87 },
          { attempt: "7", score: 89 },
          { attempt: "8", score: 90 },
          { attempt: "9", score: 92 },
          { attempt: "10", score: 93 },
          { attempt: "11", score: 94 },
          { attempt: "12", score: 95 },
        ],
      },
      {
        id: 2,
        name: "Mouse Maze",
        category: "Dysgraphia Assessment Game",
        condition: "Dysgraphia",
        timesPlayed: 8,
        bestScore: 82,
        avgScore: 76,
        lastPlayed: "5 hours ago",
        totalTime: 56,
        improvement: "+5%",
        difficulty: "Hard",
        status: "in-progress",
        progressHistory: [
          { attempt: "1", score: 68 },
          { attempt: "2", score: 71 },
          { attempt: "3", score: 73 },
          { attempt: "4", score: 75 },
          { attempt: "5", score: 77 },
          { attempt: "6", score: 78 },
          { attempt: "7", score: 80 },
          { attempt: "8", score: 82 },
        ],
      },
      {
        id: 3,
        name: "Word Sleuth",
        category: "Dyslexia Assessment Game",
        condition: "Dyslexia",
        timesPlayed: 15,
        bestScore: 91,
        avgScore: 85,
        lastPlayed: "1 day ago",
        totalTime: 105,
        improvement: "+12%",
        difficulty: "Medium",
        status: "completed",
        progressHistory: [
          { attempt: "1", score: 70 },
          { attempt: "2", score: 73 },
          { attempt: "3", score: 76 },
          { attempt: "4", score: 78 },
          { attempt: "5", score: 80 },
          { attempt: "6", score: 82 },
          { attempt: "7", score: 84 },
          { attempt: "8", score: 85 },
          { attempt: "9", score: 86 },
          { attempt: "10", score: 87 },
          { attempt: "11", score: 88 },
          { attempt: "12", score: 89 },
          { attempt: "13", score: 90 },
          { attempt: "14", score: 90 },
          { attempt: "15", score: 91 },
        ],
      },
      {
        id: 4,
        name: "Quant-Quest",
        category: "Dyscalculia Assessment Game",
        condition: "Dyscalculia",
        timesPlayed: 10,
        bestScore: 88,
        avgScore: 80,
        lastPlayed: "3 hours ago",
        totalTime: 70,
        improvement: "+6%",
        difficulty: "Easy",
        status: "completed",
        progressHistory: [
          { attempt: "1", score: 74 },
          { attempt: "2", score: 76 },
          { attempt: "3", score: 77 },
          { attempt: "4", score: 78 },
          { attempt: "5", score: 80 },
          { attempt: "6", score: 81 },
          { attempt: "7", score: 83 },
          { attempt: "8", score: 85 },
          { attempt: "9", score: 86 },
          { attempt: "10", score: 88 },
        ],
      },
    ],
    emma: [
      {
        id: 1,
        name: "Signal Sprinter",
        category: "ADHD Assessment Game",
        condition: "ADHD",
        timesPlayed: 10,
        bestScore: 92,
        avgScore: 88,
        lastPlayed: "1 hour ago",
        totalTime: 70,
        improvement: "+10%",
        difficulty: "Medium",
        status: "completed",
        progressHistory: [
          { attempt: "1", score: 78 },
          { attempt: "2", score: 80 },
          { attempt: "3", score: 82 },
          { attempt: "4", score: 84 },
          { attempt: "5", score: 86 },
          { attempt: "6", score: 88 },
          { attempt: "7", score: 89 },
          { attempt: "8", score: 90 },
          { attempt: "9", score: 91 },
          { attempt: "10", score: 92 },
        ],
      },
      {
        id: 2,
        name: "Mouse Maze",
        category: "Dysgraphia Assessment Game",
        condition: "Dysgraphia",
        timesPlayed: 14,
        bestScore: 96,
        avgScore: 91,
        lastPlayed: "3 hours ago",
        totalTime: 98,
        improvement: "+15%",
        difficulty: "Medium",
        status: "completed",
        progressHistory: [
          { attempt: "1", score: 76 },
          { attempt: "2", score: 80 },
          { attempt: "3", score: 82 },
          { attempt: "4", score: 85 },
          { attempt: "5", score: 87 },
          { attempt: "6", score: 89 },
          { attempt: "7", score: 90 },
          { attempt: "8", score: 91 },
          { attempt: "9", score: 92 },
          { attempt: "10", score: 93 },
          { attempt: "11", score: 94 },
          { attempt: "12", score: 95 },
          { attempt: "13", score: 95 },
          { attempt: "14", score: 96 },
        ],
      },
      {
        id: 3,
        name: "Word Sleuth",
        category: "Dyslexia Assessment Game",
        condition: "Dyslexia",
        timesPlayed: 18,
        bestScore: 97,
        avgScore: 93,
        lastPlayed: "2 hours ago",
        totalTime: 126,
        improvement: "+14%",
        difficulty: "Easy",
        status: "completed",
        progressHistory: [
          { attempt: "1", score: 78 },
          { attempt: "2", score: 81 },
          { attempt: "3", score: 83 },
          { attempt: "4", score: 85 },
          { attempt: "5", score: 87 },
          { attempt: "6", score: 89 },
          { attempt: "7", score: 90 },
          { attempt: "8", score: 91 },
          { attempt: "9", score: 92 },
          { attempt: "10", score: 93 },
          { attempt: "11", score: 94 },
          { attempt: "12", score: 94 },
          { attempt: "13", score: 95 },
          { attempt: "14", score: 95 },
          { attempt: "15", score: 96 },
          { attempt: "16", score: 96 },
          { attempt: "17", score: 97 },
          { attempt: "18", score: 97 },
        ],
      },
      {
        id: 4,
        name: "Quant-Quest",
        category: "Dyscalculia Assessment Game",
        condition: "Dyscalculia",
        timesPlayed: 12,
        bestScore: 94,
        avgScore: 89,
        lastPlayed: "4 hours ago",
        totalTime: 84,
        improvement: "+11%",
        difficulty: "Medium",
        status: "completed",
        progressHistory: [
          { attempt: "1", score: 80 },
          { attempt: "2", score: 82 },
          { attempt: "3", score: 84 },
          { attempt: "4", score: 86 },
          { attempt: "5", score: 87 },
          { attempt: "6", score: 88 },
          { attempt: "7", score: 89 },
          { attempt: "8", score: 90 },
          { attempt: "9", score: 91 },
          { attempt: "10", score: 92 },
          { attempt: "11", score: 93 },
          { attempt: "12", score: 94 },
        ],
      },
    ],
  }

  const currentGames = individualGames[selectedChild as keyof typeof individualGames] || individualGames.alex

  // Game comparison data
  const gameComparisonData = currentGames.map(game => ({
    name: game.name.split(' ')[0], // Shortened name for chart
    avgScore: game.avgScore,
    bestScore: game.bestScore,
    timesPlayed: game.timesPlayed,
  }))

  // Skill assessment radar data
  const skillRadarData = {
    alex: [
      { skill: "Attention", score: 87 },
      { skill: "Memory", score: 82 },
      { skill: "Reading", score: 85 },
      { skill: "Math", score: 80 },
      { skill: "Motor Skills", score: 76 },
      { skill: "Problem Solving", score: 88 },
    ],
    emma: [
      { skill: "Attention", score: 88 },
      { skill: "Memory", score: 90 },
      { skill: "Reading", score: 93 },
      { skill: "Math", score: 89 },
      { skill: "Motor Skills", score: 91 },
      { skill: "Problem Solving", score: 92 },
    ],
  }

  const currentSkillData = skillRadarData[selectedChild as keyof typeof skillRadarData] || skillRadarData.alex

  const chartConfig = {
    games: {
      label: "Games Played",
      color: "hsl(var(--chart-1))",
    },
    score: {
      label: "Average Score",
      color: "hsl(var(--chart-2))",
    },
    time: {
      label: "Time (min)",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig

  const weeklyStats = {
    totalActivities: 24,
    totalTime: 180, // minutes
    averageScore: 87,
    improvementAreas: ["Reading Comprehension", "Focus Duration"],
    strengths: ["Math Problem Solving", "Visual Learning"],
  }

  const recentActivities = [
    {
      id: 1,
      name: "Word Detective",
      date: "Today, 2:30 PM",
      duration: "12 min",
      score: 85,
      category: "Reading",
      status: "completed",
    },
    {
      id: 2,
      name: "Focus Challenge",
      date: "Today, 1:15 PM",
      duration: "8 min",
      score: 92,
      category: "Attention",
      status: "completed",
    },
    {
      id: 3,
      name: "Math Adventure",
      date: "Yesterday, 4:20 PM",
      duration: "15 min",
      score: 78,
      category: "Mathematics",
      status: "completed",
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "achievement",
      title: "New Achievement Unlocked!",
      message: "Alex completed their 8-day learning streak",
      time: "1 hour ago",
      icon: Award,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "teacher",
      title: "Message from Ms. Smith",
      message: "Great progress on reading activities this week!",
      time: "3 hours ago",
      icon: MessageCircle,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "alert",
      title: "Attention Needed",
      message: "Consider shorter activity sessions for better focus",
      time: "1 day ago",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="parent" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Child Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black mb-6">Parent Dashboard</h1>
          {currentUser && (
            <p className="text-sm text-muted-foreground mb-4">
              Welcome back, {currentUser.email}
            </p>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading students...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 mb-6">
              {children.map((child) => (
                <Card
                  key={child.id}
                  className={`cursor-pointer transition-all duration-200 ${selectedChild === child.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:shadow-md hover:border-primary/50"
                    }`}
                  onClick={() => setSelectedChild(child.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={child.avatar || "/placeholder.svg"} alt={child.name} />
                        <AvatarFallback>
                          {child.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold">{child.name}</h3>
                        <button
                          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium transition-all duration-200 hover:shadow-md"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/child/welcome`)
                          }}
                          aria-label="Start activities"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Analytics & Statistics Section */}
        <div className="grid gap-6 mb-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStudentData.totalGames}</div>
                <p className="text-xs text-muted-foreground">
                  {weeklyGameData.reduce((sum, day) => sum + day.games, 0)} games this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStudentData.avgScore}%</div>
                <p className="text-xs text-muted-foreground">
                  {currentStudentData.avgScore > 85 ? '+' : ''}{currentStudentData.avgScore - 85}% from baseline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Play Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(weeklyGameData.reduce((sum, day) => sum + day.time, 0) / 60)}h {weeklyGameData.reduce((sum, day) => sum + day.time, 0) % 60}m
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStudentData.streak} days</div>
                <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Games Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Game Activity</CardTitle>
                <CardDescription>Games played per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    accessibilityLayer
                    data={weeklyGameData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      tickLine={false} 
                      tickMargin={10} 
                      axisLine={false} 
                    />
                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent />} 
                    />
                    <Bar dataKey="games" fill="var(--color-games)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  {weeklyGameData.reduce((sum, day) => sum + day.games, 0)} games played <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing {currentChild.name}'s activity for the last 7 days
                </div>
              </CardFooter>
            </Card>

            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Average score over 5 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart 
                    accessibilityLayer
                    data={performanceData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      tickLine={false} 
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area 
                      dataKey="score"
                      type="natural"
                      fill="var(--color-score)" 
                      fillOpacity={0.4}
                      stroke="var(--color-score)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 leading-none font-medium">
                      Improved by {performanceData[performanceData.length - 1].score - performanceData[0].score} points <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                      {currentChild.name} is showing great progress!
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Games by Category */}
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Games by Category</CardTitle>
                <CardDescription>Distribution of games played</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={gamesByCategory}
                      dataKey="games"
                      nameKey="category"
                      label
                      labelLine={false}
                    >
                      {gamesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {gamesByCategory[0].category} games are most popular <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  {currentChild.name}'s favorite game category
                </div>
              </CardFooter>
            </Card>

            {/* Skills Assessment Radar */}
            <Card>
              <CardHeader className="items-center">
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>
                  Performance across different skill areas
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadarChart data={currentSkillData}>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarGrid />
                    <Radar
                      dataKey="score"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fillOpacity: 1,
                      }}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                  {currentChild.name}'s strongest: {currentSkillData.reduce((prev, current) => 
                    (prev.score > current.score) ? prev : current
                  ).skill} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  Overall skill assessment scores
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Individual Game Statistics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">Assessment Games Performance</h2>
            <Badge variant="outline" className="text-sm">
              {currentGames.length} Games Tracked
            </Badge>
          </div>

          {/* Game Comparison Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Overall Game Scores Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Game Scores Comparison</CardTitle>
                <CardDescription>Average vs Best scores across all games</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    accessibilityLayer
                    data={gameComparisonData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      tickMargin={10} 
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent />} 
                    />
                    <Legend />
                    <Bar dataKey="avgScore" name="Avg Score" fill="hsl(var(--chart-2))" radius={4} />
                    <Bar dataKey="bestScore" name="Best Score" fill="hsl(var(--chart-1))" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  {currentChild.name}'s performance across all assessment games
                </div>
              </CardFooter>
            </Card>

            {/* Game Engagement - Times Played */}
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Game Engagement</CardTitle>
                <CardDescription>Number of times each game was played</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer 
                  config={chartConfig} 
                  className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={gameComparisonData}
                      dataKey="timesPlayed"
                      nameKey="name"
                      label
                      labelLine={false}
                    >
                      {gameComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Total plays: {gameComparisonData.reduce((sum, game) => sum + game.timesPlayed, 0)} <Activity className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing engagement across all assessment games
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Individual Game Progress Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {currentGames.map((game) => (
              <Card key={game.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{game.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {game.category}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        game.difficulty === "Easy" 
                          ? "bg-green-50 text-green-700 border-green-200"
                          : game.difficulty === "Medium"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {game.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Stats Summary */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Plays</p>
                      <p className="text-lg font-bold">{game.timesPlayed}</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Best</p>
                      <p className="text-lg font-bold text-green-600">{game.bestScore}%</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Avg</p>
                      <p className="text-lg font-bold">{game.avgScore}%</p>
                    </div>
                  </div>

                  {/* Progress Line Chart */}
                  <ChartContainer config={chartConfig}>
                    <LineChart 
                      accessibilityLayer
                      data={game.progressHistory}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="attempt" 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={8}
                        fontSize={10}
                      />
                      <YAxis domain={[60, 100]} fontSize={10} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line 
                        dataKey="score"
                        type="monotone"
                        stroke={`hsl(var(--chart-${game.id}))`}
                        strokeWidth={3}
                        dot={{
                          fill: `hsl(var(--chart-${game.id}))`,
                          r: 4,
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={game.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {game.status === "completed" ? (
                        <CheckCircle className="h-3 w-3 mr-1 inline" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1 inline" />
                      )}
                      {game.status}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Improvement: {game.improvement}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Last: {game.lastPlayed}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Game Summary Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Most Played Game</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">
                  {currentGames.reduce((prev, current) => 
                    (prev.timesPlayed > current.timesPlayed) ? prev : current
                  ).name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentGames.reduce((prev, current) => 
                    (prev.timesPlayed > current.timesPlayed) ? prev : current
                  ).timesPlayed} times
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Highest Scoring Game</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">
                  {currentGames.reduce((prev, current) => 
                    (prev.bestScore > current.bestScore) ? prev : current
                  ).name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentGames.reduce((prev, current) => 
                    (prev.bestScore > current.bestScore) ? prev : current
                  ).bestScore}% best score
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Assessment Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">
                  {Math.floor(currentGames.reduce((sum, game) => sum + game.totalTime, 0) / 60)}h{" "}
                  {currentGames.reduce((sum, game) => sum + game.totalTime, 0) % 60}m
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {currentGames.length} assessment games
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

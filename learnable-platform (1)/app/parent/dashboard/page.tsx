"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

// Types for assessment data
interface AssessmentRecord {
  id: string
  user_id: string
  data: string
  created: string
  updated: string
}

interface ParsedAssessment {
  assessmentData: any
  apiResponse: {
    confidence: string
    has_disease: boolean
  }
  gameName: string
  gameType: 'dyslexia' | 'dyscalculia' | 'dysgraphia' | 'adhd'
  created: string
}

export default function ParentDashboardPage() {
  const router = useRouter()
  const [selectedChild, setSelectedChild] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [assessments, setAssessments] = useState<ParsedAssessment[]>([])
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false)

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

  const fetchAssessments = async (studentId: string) => {
    setIsLoadingAssessments(true)
    try {
      console.log('🔍 Fetching assessments for student:', studentId)
      console.log('🔍 Filter query:', `user_id="${studentId}"`)

      const resultList = await pb.collection('score').getList(1, 50, {
        filter: `user_id="${studentId}"`,
        sort: '-created',
      })

      console.log('📊 Raw assessment records:', resultList.items.length)
      console.log('📊 Total items in DB:', resultList.totalItems)
      if (resultList.items.length > 0) {
        console.log('📊 Sample record:', resultList.items[0])
      }

      const parsed: ParsedAssessment[] = resultList.items.map((record: any) => {
        // The data field might be a string or already an object
        let data = record.data
        if (typeof data === 'string') {
          data = JSON.parse(data)
        }

        console.log('📝 Parsing record:', record.id, 'Game type check:', {
          hasDyslexia: !!data.assessmentData?.dyslexiaAssessment,
          hasDyscalculia: !!data.assessmentData?.dyscalculiaAssessment,
          hasDysgraphia: !!data.assessmentData?.dysgraphiaAssessment,
        })

        // Determine game type and extract game name
        let gameName = ''
        let gameType: 'dyslexia' | 'dyscalculia' | 'dysgraphia' | 'adhd' = 'dyslexia'

        if (data.assessmentData?.dyslexiaAssessment) {
          gameName = data.assessmentData.dyslexiaAssessment.gameName || 'Word Sleuth'
          gameType = 'dyslexia'
        } else if (data.assessmentData?.dyscalculiaAssessment) {
          gameName = data.assessmentData.dyscalculiaAssessment.gameName || 'Quant-Quest'
          gameType = 'dyscalculia'
        } else if (data.assessmentData?.dysgraphiaAssessment) {
          gameName = data.assessmentData.dysgraphiaAssessment.gameName || 'Mouse Maze'
          gameType = 'dysgraphia'
        }

        console.log('✅ Parsed game:', gameName, 'Type:', gameType, 'Confidence:', data.apiResponse?.confidence, 'Has disease:', data.apiResponse?.has_disease)

        return {
          assessmentData: data.assessmentData,
          apiResponse: data.apiResponse || { confidence: 'N/A', has_disease: false },
          gameName,
          gameType,
          created: record.created
        }
      })

      console.log('✅ Total parsed assessments:', parsed.length)
      console.log('✅ Parsed assessments summary:', parsed.map(p => ({
        game: p.gameName,
        type: p.gameType,
        confidence: p.apiResponse.confidence,
        hasDisease: p.apiResponse.has_disease
      })))
      setAssessments(parsed)
    } catch (error) {
      console.error('❌ Error fetching assessments:', error)
      setAssessments([])
    } finally {
      setIsLoadingAssessments(false)
    }
  }

  useEffect(() => {
    fetchStudents();
  }, [])

  useEffect(() => {
    if (selectedChild) {
      fetchAssessments(selectedChild)
    }
  }, [selectedChild])

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

  // Function to start playing as the selected child
  const handlePlayAsChild = () => {
    const studentId = selectedChild || children[0]?.id
    if (studentId) {
      console.log('🎮 Parent starting play session for student:', studentId)
      router.push(`/child/welcome/${studentId}`)
    } else {
      console.error('No student selected')
    }
  }

  // Process assessment data for visualizations
  const getGameStats = () => {
    const gameGroups = assessments.reduce((acc, assessment) => {
      const key = assessment.gameName
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(assessment)
      return acc
    }, {} as Record<string, ParsedAssessment[]>)

    return Object.entries(gameGroups).map(([gameName, gameAssessments]) => {
      const gameType = gameAssessments[0].gameType
      let scores: number[] = []

      // Extract scores based on game type
      gameAssessments.forEach(assessment => {
        if (gameType === 'dyslexia') {
          scores.push(assessment.assessmentData.dyslexiaAssessment?.performance?.accuracy || 0)
        } else if (gameType === 'dyscalculia') {
          const progressHistory = assessment.assessmentData.dyscalculiaAssessment?.progressHistory || []
          if (progressHistory.length > 0) {
            scores.push(progressHistory[progressHistory.length - 1].arithmeticAccuracy || 0)
          }
        } else if (gameType === 'dysgraphia') {
          scores.push(assessment.assessmentData.dysgraphiaAssessment?.copyingPerformance?.accuracyRate || 0)
        }
      })

      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0

      return {
        name: gameName,
        gameType,
        timesPlayed: gameAssessments.length,
        avgScore,
        bestScore,
        assessments: gameAssessments,
        hasDisease: gameAssessments.some(a => a.apiResponse?.has_disease),
        confidence: gameAssessments[0]?.apiResponse?.confidence || 'N/A'
      }
    })
  }

  const gameStats = getGameStats()

  // Calculate overall statistics
  const totalGames = assessments.length
  const averageScore = gameStats.length > 0
    ? Math.round(gameStats.reduce((sum, game) => sum + game.avgScore, 0) / gameStats.length)
    : 0

  // Game distribution by type
  const gamesByType = [
    { name: 'Dyslexia', value: assessments.filter(a => a.gameType === 'dyslexia').length, fill: 'hsl(var(--chart-1))' },
    { name: 'Dyscalculia', value: assessments.filter(a => a.gameType === 'dyscalculia').length, fill: 'hsl(var(--chart-2))' },
    { name: 'Dysgraphia', value: assessments.filter(a => a.gameType === 'dysgraphia').length, fill: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0)

  const chartConfig = {
    games: {
      label: "Games Played",
      color: "hsl(var(--chart-1))",
    },
    score: {
      label: "Average Score",
      color: "hsl(var(--chart-2))",
    },
    accuracy: {
      label: "Accuracy",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig

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
                            router.push(`/child/welcome/${child.id}`)
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

        {/* Section Header with Refresh Button */}
        {selectedChild && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold">Assessment Results</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Viewing results for {currentChild.name}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAssessments(selectedChild)}
              disabled={isLoadingAssessments}
            >
              {isLoadingAssessments ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>
        )}

        {/* Analytics & Statistics Section */}
        <div className="grid gap-6 mb-8">
          {/* Show loading state */}
          {isLoadingAssessments ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading assessment data...</p>
              </div>
            </div>
          ) : assessments.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  {currentChild.name} hasn't completed any assessment games yet.
                </p>
                <Button onClick={() => router.push(`/child/welcome/${selectedChild}`)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Playing
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                    <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalGames}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {gameStats.length} game{gameStats.length !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageScore}%</div>
                    <p className="text-xs text-muted-foreground">
                      {averageScore >= 80 ? 'Excellent performance' : averageScore >= 60 ? 'Good progress' : 'Needs practice'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Assessment Types</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{gamesByType.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Different assessment categories
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {gameStats.filter(g => g.hasDisease).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {gameStats.filter(g => g.hasDisease).length > 0 ? 'Areas need attention' : 'All clear'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Disease Risk Assessment Summary */}
              {gameStats.some(g => g.hasDisease) && (
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-lg">Health Assessment Summary</CardTitle>
                    </div>
                    <CardDescription>
                      AI analysis indicates potential areas that may need professional evaluation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {gameStats.filter(g => g.hasDisease).map((game, idx) => {
                        const conditionName = game.gameType === 'dyslexia' ? 'Dyslexia' :
                          game.gameType === 'dyscalculia' ? 'Dyscalculia' :
                            game.gameType === 'dysgraphia' ? 'Dysgraphia' : 'ADHD'
                        const origConfidence = parseInt(String(game.confidence).replace('%', ''))
                        const invertedConfidenceValue = isNaN(origConfidence) ? 0 : Math.max(0, Math.min(100, 100 - origConfidence))
                        const displayConfidence = isNaN(origConfidence) ? 'N/A' : `${invertedConfidenceValue}%`

                        return (
                          <div key={idx} className="bg-white rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">{conditionName}</h4>
                              <Badge variant="destructive" className="text-xs">
                                Risk Detected
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Disease probability</span>
                                  <span className="font-bold">{displayConfidence}</span>
                                </div>
                                <Progress value={invertedConfidenceValue} className="h-2" />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Based on {game.timesPlayed} assessment{game.timesPlayed !== 1 ? 's' : ''}
                              </p>
                              <p className="text-xs font-medium text-orange-700">
                                ⚠️ Consider professional evaluation
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Conditions Summary - Show all assessed conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Condition Assessment Overview</CardTitle>
                  <CardDescription>
                    AI-based analysis results for all assessed conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {gameStats.map((game, idx) => {
                      const conditionName = game.gameType === 'dyslexia' ? 'Dyslexia' :
                        game.gameType === 'dyscalculia' ? 'Dyscalculia' :
                          game.gameType === 'dysgraphia' ? 'Dysgraphia' : 'ADHD'

                      const origConfidence = parseInt(String(game.confidence).replace('%', ''))
                      const invertedConfidenceValue = isNaN(origConfidence) ? 0 : Math.max(0, Math.min(100, 100 - origConfidence))
                      const displayConfidence = isNaN(origConfidence) ? 'N/A' : `${invertedConfidenceValue}%`
                      const riskLevel = game.hasDisease ? 'High' : invertedConfidenceValue > 50 ? 'High' : 'Very Low'
                      const riskColor = game.hasDisease ? 'text-red-600' : invertedConfidenceValue > 50 ? 'text-yellow-600' : 'text-green-600'
                      const bgColor = game.hasDisease ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'

                      return (
                        <div key={idx} className={`rounded-lg p-4 border ${bgColor}`}>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{conditionName}</h4>
                            {game.hasDisease ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Risk Level</span>
                                <span className={`font-bold ${riskColor}`}>{riskLevel}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Disease probability</span>
                                <span className="font-bold">{displayConfidence}</span>
                              </div>
                              <Progress
                                value={invertedConfidenceValue}
                                className={`h-2 ${game.hasDisease ? '[&>div]:bg-red-600' : '[&>div]:bg-green-600'}`}
                              />
                              <div className="pt-2 border-t">
                                <div className="text-xs text-muted-foreground mb-1">Performance</div>
                                <div className="flex justify-between text-sm">
                                  <span>Avg Score:</span>
                                  <span className="font-semibold">{game.avgScore}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Assessments:</span>
                                  <span className="font-semibold">{game.timesPlayed}</span>
                                </div>
                              </div>
                              {game.hasDisease && (
                                <div className="pt-2 border-t">
                                  <p className="text-xs font-medium text-red-700">
                                    ⚠️ Recommendation: Consult with a healthcare professional
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Game Distribution by Type */}
                {gamesByType.length > 0 && (
                  <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                      <CardTitle>Assessment Distribution</CardTitle>
                      <CardDescription>By assessment type</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                      <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
                      >
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                          <Pie
                            data={gamesByType}
                            dataKey="value"
                            nameKey="name"
                            label
                            labelLine={false}
                          >
                            {gamesByType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 font-medium leading-none">
                        Total {totalGames} assessments completed
                      </div>
                    </CardFooter>
                  </Card>
                )}

                {/* Game Scores Comparison */}
                {gameStats.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Game Performance</CardTitle>
                      <CardDescription>Average vs Best scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig}>
                        <BarChart
                          accessibilityLayer
                          data={gameStats}
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
                  </Card>
                )}
              </div>

              {/* Individual Game Details */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold">Assessment Details</h2>
                  <Badge variant="outline" className="text-sm">
                    {gameStats.length} Game{gameStats.length !== 1 ? 's' : ''} Tracked
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {gameStats.map((game, index) => {
                    const gameTypeLabel = game.gameType === 'dyslexia' ? 'Dyslexia' :
                      game.gameType === 'dyscalculia' ? 'Dyscalculia' :
                        game.gameType === 'dysgraphia' ? 'Dysgraphia' : 'ADHD'

                    // Get progress history for this game
                    const progressHistory = game.assessments.map((assessment, idx) => {
                      let score = 0
                      if (game.gameType === 'dyslexia') {
                        score = assessment.assessmentData.dyslexiaAssessment?.performance?.accuracy || 0
                      } else if (game.gameType === 'dyscalculia') {
                        const history = assessment.assessmentData.dyscalculiaAssessment?.progressHistory || []
                        score = history.length > 0 ? history[history.length - 1].arithmeticAccuracy || 0 : 0
                      } else if (game.gameType === 'dysgraphia') {
                        score = assessment.assessmentData.dysgraphiaAssessment?.copyingPerformance?.accuracyRate || 0
                      }
                      return { attempt: (idx + 1).toString(), score: Math.round(score) }
                    })

                    const improvement = progressHistory.length > 1
                      ? progressHistory[progressHistory.length - 1].score - progressHistory[0].score
                      : 0

                    const origConfidence = parseInt(String(game.confidence).replace('%', ''))
                    const invertedConfidenceValue = isNaN(origConfidence) ? 0 : Math.max(0, Math.min(100, 100 - origConfidence))
                    const displayConfidence = isNaN(origConfidence) ? 'N/A' : `${invertedConfidenceValue}%`

                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{game.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {gameTypeLabel} Assessment
                              </CardDescription>
                            </div>
                            <Badge
                              variant={game.hasDisease ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              {displayConfidence} confidence
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
                          {progressHistory.length > 0 && (
                            <ChartContainer config={chartConfig}>
                              <LineChart
                                accessibilityLayer
                                data={progressHistory}
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
                                <YAxis domain={[0, 100]} fontSize={10} />
                                <ChartTooltip
                                  cursor={false}
                                  content={<ChartTooltipContent hideLabel />}
                                />
                                <Line
                                  dataKey="score"
                                  type="monotone"
                                  stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                                  strokeWidth={3}
                                  dot={{
                                    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
                                    r: 4,
                                    strokeWidth: 2,
                                  }}
                                  activeDot={{
                                    r: 6,
                                  }}
                                />
                              </LineChart>
                            </ChartContainer>
                          )}
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={game.hasDisease ? "destructive" : "default"}
                              className="text-xs"
                            >
                              {game.hasDisease ? (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1 inline" />
                                  Needs Attention
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1 inline" />
                                  Looking Good
                                </>
                              )}
                            </Badge>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {improvement > 0 ? `+${improvement}%` : improvement < 0 ? `${improvement}%` : 'No change'}
                            </span>
                          </div>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

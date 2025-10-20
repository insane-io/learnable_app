"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Pause, Home, Volume2, VolumeX, Heart } from "lucide-react"

export default function ActivityPage() {
  const router = useRouter()
  const params = useParams()
  const activityId = params.id as string

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)

  // Mock activity data
  const activity = {
    id: activityId,
    title: "Word Detective 🔍",
    description: "Find hidden words in colorful pictures",
    totalQuestions: 5,
    emoji: "🔍",
  }

  const questions = [
    {
      id: 1,
      question: "Find the word 'CAT' in this picture!",
      image: "/hidden-cat-colorful.png",
      options: ["CAT", "DOG", "BIRD", "FISH"],
      correct: "CAT",
    },
    {
      id: 2,
      question: "Can you spot the word 'SUN'?",
      image: "/sunny-hidden-sun.png",
      options: ["MOON", "SUN", "STAR", "CLOUD"],
      correct: "SUN",
    },
  ]

  const currentQ = questions[currentQuestion] || questions[0]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
        setProgress((prev) => Math.min(prev + 100 / 600, 100))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswer = (answer: string) => {
    if (answer === currentQ.correct) {
      setScore((prev) => prev + 20)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Activity completed
      router.push("/child/progress")
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleCalmDown = () => {
    setIsPlaying(false)
    // Show calming interface for children with autism/anxiety
  }

  return (
    <div className="min-h-screen bg-primary/10">
      {/* Header Controls */}
      <div className="bg-card border-b-2 border-primary/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/child/dashboard")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">{activity.emoji}</span>
              <h1 className="text-xl font-serif font-black">{activity.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Score: {score}
            </Badge>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
              <Progress value={(600 - timeLeft) / 6} className="w-20" />
            </div>

            <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Activity Area */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-black">
              Question {currentQuestion + 1} of {activity.totalQuestions}
            </h2>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePause} className="flex items-center gap-2 bg-transparent">
                <Pause className="h-4 w-4" />
                Pause
              </Button>

              <Button
                variant="outline"
                onClick={handleCalmDown}
                className="flex items-center gap-2 bg-pink-100 border-pink-300 text-pink-800 hover:bg-pink-200"
              >
                <Heart className="h-4 w-4" />
                Calm Down
              </Button>
            </div>
          </div>

          <Progress value={((currentQuestion + 1) / activity.totalQuestions) * 100} className="h-3" />
        </div>

        <Card className="border-4 border-primary/30 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-serif font-black">{currentQ.question}</CardTitle>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="text-center mb-8">
              <img
                src={currentQ.image || "/placeholder.svg"}
                alt="Activity image"
                className="mx-auto rounded-lg border-4 border-primary/20 shadow-lg max-w-md w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentQ.options.map((option) => (
                <Button
                  key={option}
                  size="lg"
                  variant="outline"
                  className="h-16 text-xl font-bold border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200 bg-transparent"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encouragement Messages */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <span className="text-2xl">⭐</span>
            <span className="text-lg font-medium text-primary">You're doing great! Keep going!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Eye, Hand, BookOpen } from "lucide-react"

export default function ChildAssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const assessmentQuestions = [
    {
      id: "focus",
      question: "Which activity sounds most fun to you?",
      icon: Brain,
      options: [
        { id: "short", text: "Quick 5-minute games", emoji: "⚡" },
        { id: "medium", text: "15-minute activities", emoji: "🎯" },
        { id: "long", text: "Long projects I can work on", emoji: "🏗️" },
      ],
    },
    {
      id: "learning",
      question: "How do you like to learn new things?",
      icon: Eye,
      options: [
        { id: "visual", text: "Looking at pictures and colors", emoji: "🎨" },
        { id: "audio", text: "Listening to stories and music", emoji: "🎵" },
        { id: "hands-on", text: "Building and touching things", emoji: "🔧" },
      ],
    },
    {
      id: "reading",
      question: "When you see words, what happens?",
      icon: BookOpen,
      options: [
        { id: "easy", text: "I can read them easily", emoji: "📖" },
        { id: "sometimes", text: "Sometimes they look mixed up", emoji: "🔄" },
        { id: "help", text: "I like when someone reads to me", emoji: "👂" },
      ],
    },
    {
      id: "social",
      question: "What do you like to do with friends?",
      icon: Hand,
      options: [
        { id: "group", text: "Play in big groups", emoji: "👥" },
        { id: "small", text: "Play with one or two friends", emoji: "👫" },
        { id: "alone", text: "I like playing by myself too", emoji: "🧸" },
      ],
    },
  ]

  const currentQ = assessmentQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  const handleAnswer = (answerId: string) => {
    const newAnswers = [...answers, answerId]
    setAnswers(newAnswers)

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsComplete(true)
      // Simulate assessment processing
      setTimeout(() => {
        router.push("/child/dashboard")
      }, 2000)
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-primary/10 flex items-center justify-center p-4">
        <Card className="border-4 border-primary/30 shadow-2xl max-w-md w-full">
          <CardContent className="p-12 text-center">
            <div className="animate-spin mb-6">
              <Brain className="h-16 w-16 text-primary mx-auto" />
            </div>
            <h2 className="text-3xl font-serif font-black mb-4">Creating Your Learning Plan! 🎯</h2>
            <p className="text-lg text-muted-foreground">
              Just a moment while we set up the perfect activities for you...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const IconComponent = currentQ.icon

  return (
    <div className="min-h-screen bg-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Progress value={progress} className="h-3" />
          <p className="text-center mt-2 text-lg font-medium">
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </p>
        </div>

        <Card className="border-4 border-primary/30 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/20 w-fit">
              <IconComponent className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-black">{currentQ.question}</CardTitle>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="space-y-4">
              {currentQ.options.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full p-6 h-auto text-left border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200 bg-transparent"
                  onClick={() => handleAnswer(option.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-xl font-medium">{option.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

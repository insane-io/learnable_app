"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function RhymeRidersGame() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState(1)
  const [questionsInPhase, setQuestionsInPhase] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const phase1Questions = [
    {
      word: "cat",
      image: "/cute-orange-cat.png",
      options: [
        { word: "hat", image: "/red-hat.png", correct: true },
        { word: "car", image: "/vibrant-blue-classic-car.png", correct: false },
        { word: "dog", image: "/brown-dog.png", correct: false },
      ],
    },
    {
      word: "sun",
      image: "/bright-yellow-sun.png",
      options: [
        { word: "moon", image: "/crescent-moon.png", correct: false },
        { word: "fun", image: "/children-playing.png", correct: true },
        { word: "tree", image: "/green-tree.png", correct: false },
      ],
    },
    {
      word: "bee",
      image: "/yellow-and-black-bee.png",
      options: [
        { word: "tree", image: "/tall-tree.png", correct: true },
        { word: "bird", image: "/blue-bird.png", correct: false },
        { word: "fish", image: "/orange-fish.png", correct: false },
      ],
    },
    {
      word: "ball",
      image: "/red-bouncy-ball.png",
      options: [
        { word: "book", image: "/open-book.png", correct: false },
        { word: "wall", image: "/weathered-brick-wall.png", correct: true },
        { word: "cake", image: "/festive-birthday-cake.png", correct: false },
      ],
    },
    {
      word: "frog",
      image: "/green-frog.png",
      options: [
        { word: "log", image: "/wooden-log.png", correct: true },
        { word: "star", image: "/yellow-star.png", correct: false },
        { word: "cup", image: "/blue-cup.png", correct: false },
      ],
    },
  ]

  const phase2Questions = [
    {
      word: "light",
      image: "/bright-light-bulb.png",
      options: [
        { word: "night", image: "/dark-night-sky.png", correct: true },
        { word: "house", image: "/small-charming-house.png", correct: false },
        { word: "water", image: "/glass-of-water.png", correct: false },
      ],
    },
    {
      word: "train",
      image: "/red-train.png",
      options: [
        { word: "plane", image: "/placeholder.svg?height=150&width=150", correct: false },
        { word: "brain", image: "/placeholder.svg?height=150&width=150", correct: true },
        { word: "truck", image: "/placeholder.svg?height=150&width=150", correct: false },
      ],
    },
    {
      word: "flower",
      image: "/placeholder.svg?height=200&width=200",
      options: [
        { word: "tower", image: "/placeholder.svg?height=150&width=150", correct: true },
        { word: "apple", image: "/placeholder.svg?height=150&width=150", correct: false },
        { word: "chair", image: "/placeholder.svg?height=150&width=150", correct: false },
      ],
    },
  ]

  const currentQuestions = phase === 1 ? phase1Questions : phase2Questions
  const currentQ = currentQuestions[currentQuestion % currentQuestions.length]
  const totalQuestions = phase1Questions.length + phase2Questions.length
  const progress = ((questionsInPhase + (phase - 1) * 5) / totalQuestions) * 100

  const handleAnswer = (selectedOption: any) => {
    setShowFeedback(true)

    if (selectedOption.correct) {
      setScore(score + 1)
      setFeedback("Great job! 🎉")
    } else {
      setFeedback("Try again! 🦊")
    }

    setTimeout(() => {
      setShowFeedback(false)
      setFeedback(null)

      const newQuestionsInPhase = questionsInPhase + 1
      setQuestionsInPhase(newQuestionsInPhase)

      if (newQuestionsInPhase >= 5 && phase === 1) {
        setPhase(2)
        setQuestionsInPhase(0)
        setCurrentQuestion(0)
      } else if (newQuestionsInPhase >= 3 && phase === 2) {
        // Game complete
        router.push("/child/games")
      } else {
        setCurrentQuestion(currentQuestion + 1)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => router.push("/child/games")}>
              ← Back
            </Button>
            <div className="text-2xl font-bold">Phase {phase} 🦊</div>
            <div className="text-2xl font-bold">Score: {score}</div>
          </div>
          <Progress value={progress} className="h-3 mb-4" />
          <h1 className="text-4xl font-serif font-black">Rhyme Riders! 🎵</h1>
        </div>

        {/* Main Game Card */}
        <Card className="border-4 border-amber-300 shadow-2xl">
          <CardContent className="p-8">
            {/* Main Image and Word */}
            <div className="text-center mb-8">
              <img
                src={currentQ.image || "/placeholder.svg"}
                alt={currentQ.word}
                className="w-48 h-48 mx-auto rounded-2xl border-4 border-amber-200 mb-4"
              />
              <div className="flex items-center justify-center gap-4">
                <h2 className="text-6xl font-serif font-black text-amber-600">{currentQ.word}</h2>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-2xl p-4 bg-transparent"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(currentQ.word)
                    speechSynthesis.speak(utterance)
                  }}
                >
                  🔊
                </Button>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-6">
              {currentQ.options.map((option, index) => (
                <Card
                  key={index}
                  className={`border-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    showFeedback && option.correct
                      ? "border-green-500 bg-green-100 animate-pulse"
                      : showFeedback && !option.correct
                        ? "border-red-500 bg-red-100 animate-shake"
                        : "border-gray-300 hover:border-amber-400"
                  }`}
                  onClick={() => !showFeedback && handleAnswer(option)}
                >
                  <CardContent className="p-6 text-center">
                    <img
                      src={option.image || "/placeholder.svg"}
                      alt={option.word}
                      className="w-24 h-24 mx-auto rounded-xl mb-4"
                    />
                    <h3 className="text-2xl font-bold">{option.word}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className="text-center mt-8">
                <div className="text-4xl font-bold text-amber-600 animate-bounce">{feedback}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

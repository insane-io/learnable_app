"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignalSprinterGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentShape, setCurrentShape] = useState<string | null>(null)
  const [shapeStartTime, setShapeStartTime] = useState<number>(0)
  const [gameTime, setGameTime] = useState(0)
  const [omissionErrors, setOmissionErrors] = useState(0)
  const [commissionErrors, setCommissionErrors] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [assessmentSent, setAssessmentSent] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // preserve studentId when navigating back
  const studentId = searchParams.get('studentId')
  const gameDuration = 30 // 30 seconds
  const shapeDuration = 750 // 750ms to show each shape
  const intervalRange = [800, 1500] // Variable interval between shapes

  const shapes = {
    target: { emoji: "🟢", name: "green-circle" },
    distractor1: { emoji: "🔴", name: "red-square" },
    distractor2: { emoji: "🔵", name: "blue-triangle" }
  }

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameTimer = setInterval(() => {
        setGameTime((prev) => {
          if (prev >= gameDuration) {
            endGame()
            return prev
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(gameTimer)
    }
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      showNextShape()
    }
  }, [gameStarted])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameStarted && !gameOver) {
        e.preventDefault()
        handleSpacePress()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameStarted, currentShape, gameOver, shapeStartTime])

  const showNextShape = () => {
    const randomDelay = Math.random() * (intervalRange[1] - intervalRange[0]) + intervalRange[0]

    setTimeout(() => {
      if (gameTime >= gameDuration) {
        endGame()
        return
      }

      const rand = Math.random()
      let selectedShape

      if (rand < 0.5) {
        selectedShape = shapes.target
      } else if (rand < 0.75) {
        selectedShape = shapes.distractor1
      } else {
        selectedShape = shapes.distractor2
      }

      setCurrentShape(selectedShape.emoji)
      setShapeStartTime(Date.now())

      setTimeout(() => {
        // Check if user didn't press spacebar for target
        if (selectedShape.emoji === shapes.target.emoji) {
          setOmissionErrors((prev) => prev + 1)
        }
        setCurrentShape(null)
        showNextShape()
      }, shapeDuration)
    }, randomDelay)
  }

  const handleSpacePress = () => {
    if (currentShape === null) return

    const reactionTime = Date.now() - shapeStartTime

    if (currentShape === shapes.target.emoji) {
      // Correct response to target
      setReactionTimes((prev) => [...prev, reactionTime])
      setScore((prev) => prev + 10)
    } else {
      // Incorrect response to distractor
      setCommissionErrors((prev) => prev + 1)
      setScore((prev) => Math.max(0, prev - 5))
    }
  }

  const endGame = () => {
    setGameOver(true)
  }

  const calculateMeanReactionTime = () => {
    if (reactionTimes.length === 0) return 0
    return Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
  }

  const calculateReactionTimeVariability = () => {
    if (reactionTimes.length === 0) return 0
    const mean = calculateMeanReactionTime()
    const variance = reactionTimes.reduce((sum, rt) => sum + Math.pow(rt - mean, 2), 0) / reactionTimes.length
    return Math.round(Math.sqrt(variance))
  }

  const startGame = () => {
    setGameStarted(true)
    setGameTime(0)
    setOmissionErrors(0)
    setCommissionErrors(0)
    setReactionTimes([])
    setScore(0)
    setGameOver(false)
    setAssessmentSent(false)
  }

  // Send ADHD assessment data when game is over (only once)
  useEffect(() => {
    if (gameOver && !assessmentSent) {
      const meanRT = calculateMeanReactionTime()
      const rtVariability = calculateReactionTimeVariability()

      // Prepare ADHD assessment data for the backend
      const adhdAssessmentData = {
        "Raw Score Omissions": omissionErrors,
        "Raw Score Commissions": commissionErrors,
        "Raw Score HitRT": meanRT,
        "Raw Score HitSE": rtVariability
      }

      // Send assessment data to API
      fetch("/api/analyze/adhd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(adhdAssessmentData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          console.log("ADHD assessment sent successfully:", data)
          console.log("Prediction:", data.prediction ? "ADHD Detected" : "No ADHD")
          console.log("Confidence:", data.confidence)
        })
        .catch(error => {
          console.error("Error sending ADHD assessment:", error)
        })

      setAssessmentSent(true)
    }
  }, [gameOver, assessmentSent])

  if (gameOver) {
    const meanRT = calculateMeanReactionTime()
    const rtVariability = calculateReactionTimeVariability()

    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-green-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🏃‍♂️</div>
              <h1 className="text-4xl font-bold mb-6">Game Complete!</h1>

              <div className="bg-white/70 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Your Results:</h2>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-3xl font-bold">{score}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Omission Errors</p>
                    <p className="text-3xl font-bold">{omissionErrors}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Commission Errors</p>
                    <p className="text-3xl font-bold">{commissionErrors}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Mean Reaction Time</p>
                    <p className="text-3xl font-bold">{meanRT}ms</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded col-span-2">
                    <p className="text-sm text-muted-foreground">Reaction Time Variability (SD)</p>
                    <p className="text-3xl font-bold">{rtVariability}ms</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={startGame}>
                  Play Again 🔄
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/child/games")}>
                  Back to Games 🏠
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push(studentId ? `/parent/dashboard?studentId=${studentId}` : '/parent/dashboard')}>
                  Back to dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-green-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-8xl mb-4">🏃‍♂️</div>
              <h1 className="text-4xl font-bold mb-4">Signal Sprinter</h1>
              <p className="text-xl mb-6 text-muted-foreground">ADHD Assessment Game</p>

              <div className="bg-white/70 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-2xl font-bold mb-4">How to Play:</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">🟢</span>
                    <span>Press <kbd className="bg-gray-200 px-2 py-1 rounded">SPACEBAR</kbd> when you see the GREEN CIRCLE</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">🔴</span>
                    <span>DO NOT press anything for RED SQUARE</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">🔵</span>
                    <span>DO NOT press anything for BLUE TRIANGLE</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">⏱️</span>
                    <span>Game duration: 5 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">⚡</span>
                    <span>React quickly - shapes appear for only 250ms!</span>
                  </li>
                </ul>
              </div>

              <Button size="lg" onClick={startGame} className="text-xl px-8 py-6">
                Start Game! 🎮
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Signal Sprinter 🏃‍♂️</h2>
            <div className="text-xl font-bold">Score: {score}</div>
          </div>
          <Progress value={(gameTime / gameDuration) * 100} className="h-3" />
          <p className="text-center mt-2 text-muted-foreground">
            Time: {gameTime}s / {gameDuration}s
          </p>
        </div>

        <Card className="bg-slate-900 border-4 min-h-[500px]">
          <CardContent className="p-12">
            <div className="flex items-center justify-center min-h-[400px]">
              {currentShape ? (
                <div className="text-9xl animate-pulse">
                  {currentShape}
                </div>
              ) : (
                <div className="text-white text-2xl">+</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-muted-foreground">
          <p className="text-lg">Press SPACEBAR when you see 🟢</p>
          {/* <div className="mt-4 flex justify-center gap-8">
            <div>
              <p className="text-sm">Missed Targets</p>
              <p className="text-2xl font-bold text-orange-600">{omissionErrors}</p>
            </div>
            <div>
              <p className="text-sm">False Alarms</p>
              <p className="text-2xl font-bold text-red-600">{commissionErrors}</p>
            </div>
            <div>
              <p className="text-sm">Correct Hits</p>
              <p className="text-2xl font-bold text-green-600">{reactionTimes.length}</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Shape {
  id: number
  type: "yellow-star" | "blue-star" | "red-circle"
  x: number
  y: number
  opacity: number
  size: number
}

export default function StarCatcherGame() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [phase, setPhase] = useState(1)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [gameActive, setGameActive] = useState(true)

  const generateShape = useCallback(() => {
    if (!gameActive) return

    const shapeTypes: Shape["type"][] = ["yellow-star", "blue-star", "red-circle"]
    const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]

    // Phase 2 has smaller, faster shapes
    const baseSize = phase === 1 ? 60 : 40
    const fadeSpeed = phase === 1 ? 3000 : 2000

    const newShape: Shape = {
      id: Date.now() + Math.random(),
      type: randomType,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 200) + 100,
      opacity: 1,
      size: baseSize + Math.random() * 20,
    }

    setShapes((prev) => [...prev, newShape])

    // Remove shape after fade time
    setTimeout(() => {
      setShapes((prev) => prev.filter((shape) => shape.id !== newShape.id))
    }, fadeSpeed)
  }, [gameActive, phase])

  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const shapeGenerator = setInterval(
      () => {
        generateShape()
      },
      phase === 1 ? 1500 : 1000,
    ) // Faster in phase 2

    return () => {
      clearInterval(timer)
      clearInterval(shapeGenerator)
    }
  }, [generateShape, gameActive, phase])

  const handleShapeClick = (shape: Shape) => {
    if (!gameActive) return

    // Only yellow and blue stars give points
    if (shape.type === "yellow-star" || shape.type === "blue-star") {
      setScore((prev) => prev + (shape.type === "yellow-star" ? 2 : 1))
      setQuestionsAnswered((prev) => {
        const newCount = prev + 1
        // Phase change every 5 correct clicks
        if (newCount >= 5 && phase === 1) {
          setPhase(2)
          return 0
        }
        return newCount
      })
    }

    // Remove clicked shape
    setShapes((prev) => prev.filter((s) => s.id !== shape.id))
  }

  const getShapeEmoji = (type: Shape["type"]) => {
    switch (type) {
      case "yellow-star":
        return "⭐"
      case "blue-star":
        return "💙"
      case "red-circle":
        return "🔴"
    }
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(60)
    setPhase(1)
    setQuestionsAnswered(0)
    setShapes([])
    setGameActive(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/child/games")} className="bg-white">
          ← Back
        </Button>
        <div className="text-white text-2xl font-bold">Phase {phase} 🐻</div>
        <div className="flex gap-4 text-white text-xl font-bold">
          <div>Score: {score}</div>
          <div>Time: {timeLeft}s</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-20">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute cursor-pointer transition-opacity duration-1000 hover:scale-110"
            style={{
              left: shape.x,
              top: shape.y,
              opacity: shape.opacity,
              fontSize: shape.size,
              animation: "fadeOut 3s ease-in-out forwards",
            }}
            onClick={() => handleShapeClick(shape)}
          >
            {getShapeEmoji(shape.type)}
          </div>
        ))}
      </div>

      {/* Game Over Screen */}
      {!gameActive && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="bg-white p-12 rounded-2xl text-center border-4 border-cyan-300">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-serif font-black mb-4">Great Job!</h2>
            <p className="text-2xl mb-2">Final Score: {score}</p>
            <p className="text-xl mb-6">You reached Phase {phase}! 🐻</p>
            <div className="flex gap-4">
              <Button onClick={restartGame} className="text-xl px-8 py-4 bg-cyan-500 hover:bg-cyan-600">
                Play Again! 🚀
              </Button>
              <Button variant="outline" onClick={() => router.push("/child/games")} className="text-xl px-8 py-4">
                Choose Game
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
        <p className="text-lg">Click ⭐ and 💙 to score points! Avoid 🔴</p>
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}

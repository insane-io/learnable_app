"use client"

import { useState, useEffect } from "react"

interface AnimalMascotProps {
  size?: "sm" | "md" | "lg"
  mood?: "happy" | "excited" | "thinking" | "celebrating"
  className?: string
}

export function AnimalMascot({ size = "md", mood = "happy", className = "" }: AnimalMascotProps) {
  const [currentAnimal, setCurrentAnimal] = useState(0)

  const animals = {
    happy: ["🦊", "🐻", "🐰", "🐨"],
    excited: ["🎉", "🌟", "✨", "🎊"],
    thinking: ["🤔", "💭", "🧠", "💡"],
    celebrating: ["🎈", "🏆", "🎯", "⭐"],
  }

  const sizes = {
    sm: "text-4xl",
    md: "text-6xl",
    lg: "text-8xl",
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnimal((prev) => (prev + 1) % animals[mood].length)
    }, 3000)

    return () => clearInterval(timer)
  }, [mood])

  return <div className={`inline-block animate-bounce ${sizes[size]} ${className}`}>{animals[mood][currentAnimal]}</div>
}

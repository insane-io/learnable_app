﻿"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"

export default function GamesListPage() {
  const [games, setGames] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get student ID from URL
  const studentId = searchParams.get('studentId')

  useEffect(() => {
    console.log('🎮 Games List - Student ID:', studentId)

    fetch('/data/games-data.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((list) => {
        setGames(list)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load games:', err)
        setIsLoading(false)
      })
  }, [studentId])

  const handleGameClick = (gameSlug: string) => {
    // Pass student ID to individual game
    if (studentId) {
      console.log('🎯 Opening game:', gameSlug, 'for student:', studentId)
      router.push(`/child/games/${gameSlug}?studentId=${studentId}`)
    } else {
      router.push(`/child/games/${gameSlug}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-2xl">Loading games...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-center md:text-left">Learning Games</h1>
            <p className="text-center md:text-left text-muted-foreground mb-2">
              Choose a game to play and improve your skills!
            </p>
          </div>
          <div className="hidden md:block">
            <Button
              variant="outline"
              onClick={() => router.push(studentId ? `/parent/dashboard?studentId=${studentId}` : '/parent/dashboard')}
            >
              Back to dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              className="bg-blue-100 border-4 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
              onClick={() => handleGameClick(game.slug)}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{game.animal}</div>
                  <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{game.description}</p>

                  <div className="flex justify-between items-center text-sm mt-4">
                    <span className="bg-white/50 px-3 py-1 rounded-full">
                      {game.category}
                    </span>
                    <span className="bg-white/50 px-3 py-1 rounded-full">
                      {Math.floor(game.durationSeconds / 60)}min
                    </span>
                  </div>

                  <Button className="mt-4 w-full" size="lg">
                    Play Now!
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {games.length === 0 && !isLoading && (
          <div className="text-center text-muted-foreground mt-12">
            <p className="text-xl">No games available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
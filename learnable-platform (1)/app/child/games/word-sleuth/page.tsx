"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export default function WordSleuthGame() {
  const [gamePhase, setGamePhase] = useState<"instructions" | "reading" | "recognition" | "complete">("instructions")
  const [readingStartTime, setReadingStartTime] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [wordStartTime, setWordStartTime] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [errors, setErrors] = useState(0)
  const [score, setScore] = useState(0)
  
  const router = useRouter()

  const story = {
    text: "The little brown dog jumped over the tall fence. He ran quickly through the green grass and found a red ball. The dog was very happy to play with his new toy in the sunny garden.",
    words: ["dog", "jumped", "fence", "grass", "ball", "happy", "toy", "garden", "brown", "sunny"]
  }

  const storyWords = story.text.split(/\s+/)
  const wordsToFind = story.words.slice(0, 8) // Find 8 words

  const startReading = () => {
    setGamePhase("reading")
    setReadingStartTime(Date.now())
  }

  const finishReading = () => {
    const endTime = Date.now()
    setReadingTime(endTime - readingStartTime)
    setGamePhase("recognition")
    setWordStartTime(Date.now())
  }

  const handleWordClick = (clickedWord: string) => {
    const targetWord = wordsToFind[currentWordIndex]
    const reactionTime = Date.now() - wordStartTime

    if (clickedWord.toLowerCase() === targetWord.toLowerCase()) {
      // Correct word clicked
      setReactionTimes(prev => [...prev, reactionTime])
      setScore(prev => prev + 100)

      if (currentWordIndex < wordsToFind.length - 1) {
        setCurrentWordIndex(prev => prev + 1)
        setWordStartTime(Date.now())
      } else {
        setGamePhase("complete")
      }
    } else {
      // Wrong word clicked
      setErrors(prev => prev + 1)
      setScore(prev => Math.max(0, prev - 20))
    }
  }

  const calculateReadingSpeed = () => {
    const minutes = readingTime / 60000
    const wordCount = storyWords.length
    return Math.round(wordCount / minutes)
  }

  const calculateMeanReactionTime = () => {
    if (reactionTimes.length === 0) return 0
    return Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
  }

  const calculateErrorRate = () => {
    const totalAttempts = reactionTimes.length + errors
    if (totalAttempts === 0) return 0
    return Math.round((errors / totalAttempts) * 100)
  }

  const startGame = () => {
    setGamePhase("reading")
    setReadingStartTime(Date.now())
    setReadingTime(0)
    setCurrentWordIndex(0)
    setReactionTimes([])
    setErrors(0)
    setScore(0)
  }

  if (gamePhase === "complete") {
    const readingSpeed = calculateReadingSpeed()
    const meanRT = calculateMeanReactionTime()
    const errorRate = calculateErrorRate()

    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-blue-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🕵️‍♀️</div>
              <h1 className="text-4xl font-bold mb-6">Game Complete!</h1>
              
              <div className="bg-white/70 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Your Results:</h2>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-3xl font-bold">{score}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Reading Speed</p>
                    <p className="text-3xl font-bold">{readingSpeed} WPM</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Word Hunt Reaction Time</p>
                    <p className="text-3xl font-bold">{meanRT}ms</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-3xl font-bold">{errorRate}%</p>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gamePhase === "instructions") {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-blue-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-8xl mb-4">🕵️‍♀️</div>
              <h1 className="text-4xl font-bold mb-4">Word Sleuth</h1>
              <p className="text-xl mb-6 text-muted-foreground">Dyslexia Assessment Game</p>
              
              <div className="bg-white/70 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-2xl font-bold mb-4">How to Play:</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">📖</span>
                    <span><strong>Part 1:</strong> Read the story at your own pace</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">✅</span>
                    <span>Click "Finished" when you're done reading</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">🔍</span>
                    <span><strong>Part 2:</strong> Find the highlighted words in the story</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">⚡</span>
                    <span>Click on each word as quickly as you can!</span>
                  </li>
                </ul>
              </div>

              <Button size="lg" onClick={startReading} className="text-xl px-8 py-6">
                Start Game! 🎮
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gamePhase === "reading") {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-3xl w-full bg-blue-50 border-4">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="text-3xl font-bold mb-2">Read the Story</h2>
              <p className="text-muted-foreground">Take your time and read carefully</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 mb-8">
              <p className="text-2xl leading-relaxed text-gray-800">
                {story.text}
              </p>
            </div>

            <div className="text-center">
              <Button size="lg" onClick={finishReading} className="text-xl px-8 py-4">
                I'm Finished Reading! ✅
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gamePhase === "recognition") {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">Word Sleuth 🕵️‍♀️</h2>
              <div className="text-xl font-bold">Score: {score}</div>
            </div>
            <Progress value={(currentWordIndex / wordsToFind.length) * 100} className="h-3" />
            <p className="text-center mt-2 text-muted-foreground">
              Word {currentWordIndex + 1} of {wordsToFind.length}
            </p>
          </div>

          <Card className="bg-yellow-50 border-4 mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">Find this word:</h3>
                <div className="bg-yellow-200 inline-block px-8 py-4 rounded-lg">
                  <p className="text-5xl font-bold text-gray-800">{wordsToFind[currentWordIndex]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-4">
            <CardContent className="p-8">
              <p className="text-2xl leading-relaxed">
                {storyWords.map((word, index) => {
                  const cleanWord = word.replace(/[.,!?]/g, "")
                  return (
                    <span key={index}>
                      <button
                        onClick={() => handleWordClick(cleanWord)}
                        className="hover:bg-blue-200 px-1 rounded transition-colors cursor-pointer"
                      >
                        {word}
                      </button>
                      {" "}
                    </span>
                  )
                })}
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <div className="flex justify-center gap-8">
              <div>
                <p className="text-sm text-muted-foreground">Words Found</p>
                <p className="text-2xl font-bold text-green-600">{currentWordIndex}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{errors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

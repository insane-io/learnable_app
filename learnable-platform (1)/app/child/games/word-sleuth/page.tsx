"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useSearchParams } from "next/navigation"
import pb from "@/lib/pb"

// Types for assessment data
type WordErrorDetail = {
  targetWord: string
  clickedWord: string
  timestamp: number
  reactionTime: number
}

type WordSuccessDetail = {
  word: string
  reactionTime: number
  timestamp: number
}

type AssessmentData = { dyslexiaAssessment: DyslexiaAssessment }

interface DyslexiaAssessment {
  // Basic info
  gameName: string
  sessionDuration: number // Total session time in milliseconds
  readingDuration: number // Time spent reading in milliseconds
  recognitionDuration: number // Time spent on word recognition in milliseconds

  // Actual performance metrics
  performance: {
    totalWordsToFind: number
    wordsFoundCorrectly: number
    totalErrors: number
    finalScore: number
    accuracy: number // Percentage
  }

  // Reading speed (calculated from actual reading time)
  readingSpeed: {
    wordsPerMinute: number
    readingTimeSeconds: number
    totalWordsInStory: number
  }

  // Word recognition metrics
  wordRecognition: {
    averageReactionTime: number // milliseconds
    fastestReactionTime: number
    slowestReactionTime: number
    reactionTimeVariability: number
    successfulAttempts: WordSuccessDetail[]
    errors: WordErrorDetail[]
  }

  // Calculated metrics
  cognitiveMetrics: {
    processingSpeed: number // Based on reaction times
    attentionConsistency: number // Based on reaction time variability
    errorRate: number // Percentage
    completionRate: number // Percentage
  }
}

export default function WordSleuthGame() {
  const [gamePhase, setGamePhase] = useState<"instructions" | "reading" | "recognition" | "complete">("instructions")
  const [gameStartTime, setGameStartTime] = useState(0)
  const [readingStartTime, setReadingStartTime] = useState(0)
  const [readingEndTime, setReadingEndTime] = useState(0)
  const [recognitionStartTime, setRecognitionStartTime] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [wordStartTime, setWordStartTime] = useState(0)
  const [errors, setErrors] = useState(0)
  const [score, setScore] = useState(0)

  // Detailed tracking
  const [successfulAttempts, setSuccessfulAttempts] = useState<WordSuccessDetail[]>([])
  const [errorAttempts, setErrorAttempts] = useState<WordErrorDetail[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()

  // Get student ID from URL
  const studentId = searchParams.get('studentId')

  const story = {
    text: "The little brown dog jumped over the tall fence. He ran quickly through the green grass and found a red ball. The dog was very happy to play with his new toy in the sunny garden.",
    words: ["dog", "jumped", "fence", "grass", "ball", "happy", "toy", "garden", "brown", "sunny"]
  }

  const storyWords = story.text.split(/\s+/)
  const wordsToFind = story.words.slice(0, 8) // Find 8 words

  // Calculate actual metrics from real game data
  const generateAssessmentData = (): AssessmentData => {
    const now = Date.now()
    const totalSessionTime = now - gameStartTime
    const readingTime = readingEndTime - readingStartTime
    const recognitionTime = now - recognitionStartTime

    // Calculate accuracy
    const totalAttempts = successfulAttempts.length + errorAttempts.length
    const accuracy = totalAttempts > 0 ? (successfulAttempts.length / totalAttempts) * 100 : 0

    // Calculate reading speed
    const readingMinutes = readingTime / 60000
    const wordsPerMinute = readingMinutes > 0 ? storyWords.length / readingMinutes : 0

    // Calculate reaction time metrics
    const reactionTimes = successfulAttempts.map(a => a.reactionTime)
    const avgReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0
    const fastestRT = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0
    const slowestRT = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0

    // Calculate variability (standard deviation)
    let variability = 0
    if (reactionTimes.length > 1) {
      const mean = avgReactionTime
      const squareDiffs = reactionTimes.map(value => Math.pow(value - mean, 2))
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length
      variability = Math.sqrt(avgSquareDiff)
    }

    // Processing speed (inverse of reaction time, normalized)
    const processingSpeed = avgReactionTime > 0 ? (1000 / avgReactionTime) * 100 : 0

    // Attention consistency (lower variability = better consistency)
    const attentionConsistency = avgReactionTime > 0
      ? Math.max(0, 100 - (variability / avgReactionTime * 100))
      : 0

    const assessmentData: AssessmentData = {
      dyslexiaAssessment: {
        gameName: "Word Sleuth",
        sessionDuration: totalSessionTime,
        readingDuration: readingTime,
        recognitionDuration: recognitionTime,

        performance: {
          totalWordsToFind: wordsToFind.length,
          wordsFoundCorrectly: successfulAttempts.length,
          totalErrors: errorAttempts.length,
          finalScore: score,
          accuracy: Math.round(accuracy * 100) / 100
        },

        readingSpeed: {
          wordsPerMinute: Math.round(wordsPerMinute),
          readingTimeSeconds: Math.round(readingTime / 1000),
          totalWordsInStory: storyWords.length
        },

        wordRecognition: {
          averageReactionTime: Math.round(avgReactionTime),
          fastestReactionTime: Math.round(fastestRT),
          slowestReactionTime: Math.round(slowestRT),
          reactionTimeVariability: Math.round(variability),
          successfulAttempts: successfulAttempts,
          errors: errorAttempts
        },

        cognitiveMetrics: {
          processingSpeed: Math.round(processingSpeed * 100) / 100,
          attentionConsistency: Math.round(attentionConsistency * 100) / 100,
          errorRate: Math.round((errorAttempts.length / totalAttempts) * 100 * 100) / 100,
          completionRate: Math.round((successfulAttempts.length / wordsToFind.length) * 100 * 100) / 100
        }
      }
    }

    return assessmentData
  }

  const startReading = () => {
    setGamePhase("reading")
    const now = Date.now()
    setGameStartTime(now)
    setReadingStartTime(now)
  }

  const finishReading = () => {
    const now = Date.now()
    setReadingEndTime(now)
    setGamePhase("recognition")
    setRecognitionStartTime(now)
    setWordStartTime(now)
  }

  const handleWordClick = (clickedWord: string) => {
    const targetWord = wordsToFind[currentWordIndex]
    const now = Date.now()
    const reactionTime = now - wordStartTime

    if (clickedWord.toLowerCase() === targetWord.toLowerCase()) {
      // Correct word clicked
      setSuccessfulAttempts(prev => [...prev, {
        word: targetWord,
        reactionTime: reactionTime,
        timestamp: now
      }])
      setScore(prev => prev + 100)

      if (currentWordIndex < wordsToFind.length - 1) {
        setCurrentWordIndex(prev => prev + 1)
        setWordStartTime(now)
      } else {
        // Game complete - generate and log assessment data
        setTimeout(() => {
          const assessmentData = generateAssessmentData()
          console.log(JSON.stringify(assessmentData, null, 2))
        }, 100)

        setGamePhase("complete")
      }
    } else {
      // Wrong word clicked
      setErrors(prev => prev + 1)
      setScore(prev => Math.max(0, prev - 20))
      setErrorAttempts(prev => [...prev, {
        targetWord: targetWord,
        clickedWord: clickedWord,
        timestamp: now,
        reactionTime: reactionTime
      }])
    }
  }

  const calculateReadingSpeed = () => {
    const readingTime = readingEndTime - readingStartTime
    const minutes = readingTime / 60000
    const wordCount = storyWords.length
    return minutes > 0 ? Math.round(wordCount / minutes) : 0
  }

  const calculateMeanReactionTime = () => {
    if (successfulAttempts.length === 0) return 0
    const total = successfulAttempts.reduce((sum, attempt) => sum + attempt.reactionTime, 0)
    return Math.round(total / successfulAttempts.length)
  }

  const calculateAccuracy = () => {
    const totalAttempts = successfulAttempts.length + errorAttempts.length
    if (totalAttempts === 0) return 0
    return Math.round((successfulAttempts.length / totalAttempts) * 100)
  }

  const startGame = () => {
    // Reset everything for a fresh game
    setGamePhase("reading")
    const now = Date.now()
    setGameStartTime(now)
    setReadingStartTime(now)
    setReadingEndTime(0)
    setRecognitionStartTime(0)
    setCurrentWordIndex(0)
    setWordStartTime(0)
    setErrors(0)
    setScore(0)
    setSuccessfulAttempts([])
    setErrorAttempts([])
  }

  const viewAssessmentData = async () => {
    const assessmentData = generateAssessmentData()
    console.log(JSON.stringify(assessmentData, null, 2))

    try {
      // Send to analysis API
      const response = await fetch("/api/analyze/dyslexia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(assessmentData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiResponse = await response.json()
      console.log("Dyslexia assessment sent successfully:", apiResponse)

      // Save to PocketBase with both assessment data and API response
      if (studentId) {
        try {
          const combinedData = {
            assessmentData,
            apiResponse
          }

          const data = {
            "user_id": studentId,
            "data": JSON.stringify(combinedData)
          }

          const record = await pb.collection('score').create(data)
          console.log("Successfully saved to PocketBase:", record)
        } catch (pbError) {
          console.error("Error saving to PocketBase:", pbError)
        }
      } else {
        console.warn("No studentId found in URL params, skipping PocketBase save")
      }
    } catch (error) {
      console.error("Error sending dyslexia assessment:", error)
    }
  }

  if (gamePhase === "complete") {
    const readingSpeed = calculateReadingSpeed()
    const meanRT = calculateMeanReactionTime()
    const accuracy = calculateAccuracy()
    viewAssessmentData()

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
                    <p className="text-sm text-muted-foreground">Avg Reaction Time</p>
                    <p className="text-3xl font-bold">{meanRT}ms</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-3xl font-bold">{accuracy}%</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded col-span-2">
                    <p className="text-sm text-muted-foreground">Words Found / Errors</p>
                    <p className="text-3xl font-bold">{successfulAttempts.length} / {errorAttempts.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
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

              <div className="mt-4 text-sm text-muted-foreground">
                <p>💡 Assessment data auto-logged to console. Click button above to view again.</p>
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

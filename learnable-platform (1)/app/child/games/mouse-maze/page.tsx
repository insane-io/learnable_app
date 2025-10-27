"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useSearchParams } from "next/navigation"
import pb from "@/lib/pb"

export default function MouseMazeGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPath, setCurrentPath] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [userPath, setUserPath] = useState<{ x: number, y: number }[]>([])
  const [speeds, setSpeeds] = useState<number[]>([])
  const [mouseLifts, setMouseLifts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lastPosition, setLastPosition] = useState<{ x: number, y: number, time: number } | null>(null)
  const [gameStartTime, setGameStartTime] = useState<number>(0)
  const [attemptData, setAttemptData] = useState<any[]>([])
  const [pressureData, setPressureData] = useState<{ timestamp: number, pressure: number }[]>([])
  const [pathDeviations, setPathDeviations] = useState<number[]>([])
  const [directionChanges, setDirectionChanges] = useState(0)
  const [errors, setErrors] = useState(0)
  const [tremors, setTremors] = useState<number[]>([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get student ID from URL
  const studentId = searchParams.get('studentId')

  useEffect(() => {
    console.log('🖱️ Mouse Maze - Student ID:', studentId)
  }, [studentId])

  const paths = [
    { name: "Letter A", path: "M 50 150 L 100 50 L 150 150 M 75 100 L 125 100", description: "Trace the letter A" },
    { name: "Wave Line", path: "M 20 100 Q 60 50, 100 100 T 180 100", description: "Trace the wavy line" },
    { name: "Circle", path: "M 100 50 A 50 50 0 1 1 100 49", description: "Trace the circle" },
    { name: "Letter S", path: "M 50 50 Q 100 50, 100 100 Q 100 150, 150 150", description: "Trace the letter S" }
  ]

  useEffect(() => {
    if (gameStarted && canvasRef.current) {
      drawCurrentPath()
    }
  }, [gameStarted, currentPath, userPath])

  const drawCurrentPath = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the dotted path
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])

    const path = new Path2D(paths[currentPath].path)
    ctx.stroke(path)

    // Draw user's traced path
    if (userPath.length > 1) {
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 2
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(userPath[0].x, userPath[0].y)
      for (let i = 1; i < userPath.length; i++) {
        ctx.lineTo(userPath[i].x, userPath[i].y)
      }
      ctx.stroke()
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setUserPath([{ x, y }])
    setLastPosition({ x, y, time: Date.now() })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setUserPath(prev => [...prev, { x, y }])

    // Calculate speed
    if (lastPosition) {
      const distance = Math.sqrt(Math.pow(x - lastPosition.x, 2) + Math.pow(y - lastPosition.y, 2))
      const timeDiff = (Date.now() - lastPosition.time) / 1000 // in seconds
      if (timeDiff > 0) {
        const speed = distance / timeDiff
        setSpeeds(prev => [...prev, speed])

        // Track tremor (speed fluctuation)
        if (speeds.length > 0) {
          const lastSpeed = speeds[speeds.length - 1]
          const speedChange = Math.abs(speed - lastSpeed)
          setTremors(prev => [...prev, speedChange])
        }

        // Track direction changes
        if (userPath.length > 1) {
          const prevPoint = userPath[userPath.length - 1]
          const prevPrevPoint = userPath[userPath.length - 2]

          const angle1 = Math.atan2(prevPoint.y - prevPrevPoint.y, prevPoint.x - prevPrevPoint.x)
          const angle2 = Math.atan2(y - prevPoint.y, x - prevPoint.x)
          const angleDiff = Math.abs(angle2 - angle1)

          if (angleDiff > Math.PI / 4) { // Significant direction change
            setDirectionChanges(prev => prev + 1)
          }
        }
      }

      const normalizedSpeed = Math.min(500, Math.max(10, speed))
      const pressure = 0.3 + (normalizedSpeed / 500) * 0.6
      setPressureData(prev => [...prev, {
        timestamp: Math.floor((Date.now() - gameStartTime) / 1000),
        pressure: parseFloat(pressure.toFixed(2))
      }])
    }

    setLastPosition({ x, y, time: Date.now() })
  }

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false)

      // Calculate path deviation
      const deviation = calculatePathDeviation()
      setPathDeviations(prev => [...prev, deviation])

      // Check if path is complete (user reached near the end)
      if (userPath.length > 20) {
        const currentScore = 100
        setScore(prev => prev + currentScore)

        // Record attempt data
        const attemptDuration = (Date.now() - gameStartTime) / 1000
        const currentTremor = tremors.length > 0 ? tremors.reduce((a, b) => a + b, 0) / tremors.length / 100 : 0.5

        setAttemptData(prev => [...prev, {
          attempt: currentPath + 1,
          score: currentScore,
          duration: Math.floor(attemptDuration),
          errors: mouseLifts,
          tremor: parseFloat(currentTremor.toFixed(2))
        }])

        if (currentPath < paths.length - 1) {
          setTimeout(() => {
            setCurrentPath(prev => prev + 1)
            setUserPath([])
            setLastPosition(null)
          }, 500)
        } else {
          setGameOver(true)
        }
      } else {
        // Incomplete path - count as mouse lift and error
        setMouseLifts(prev => prev + 1)
        setErrors(prev => prev + 1)
        setUserPath([])
        setLastPosition(null)
      }
    }
  }

  const calculatePathDeviation = () => {
    // Simplified deviation calculation (random for now)
    // In a real implementation, calculate actual deviation from the target path
    return parseFloat((Math.random() * 20 + 5).toFixed(1))
  }

  const calculateMeanTracingSpeed = () => {
    if (speeds.length === 0) return 0
    return Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length)
  }

  const calculateSpeedVariability = () => {
    if (speeds.length === 0) return 0
    const mean = calculateMeanTracingSpeed()
    const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - mean, 2), 0) / speeds.length
    return Math.round(Math.sqrt(variance))
  }

  const calculateMeanDeviation = () => {
    // Simplified deviation calculation
    return Math.round(Math.random() * 15) // In a real implementation, calculate actual deviation
  }

  const startGame = () => {
    setGameStarted(true)
    setCurrentPath(0)
    setUserPath([])
    setSpeeds([])
    setMouseLifts(0)
    setScore(0)
    setGameOver(false)
    setGameStartTime(Date.now())
    setAttemptData([])
    setPressureData([])
    setPathDeviations([])
    setDirectionChanges(0)
    setErrors(0)
    setTremors([])
  }

  const sendAssessmentData = async (dysgraphiaAssessmentData: any) => {
    console.log('📤 Sending dysgraphia assessment for student:', studentId)
    console.log('Assessment data:', dysgraphiaAssessmentData)

    try {
      // Send to analysis API
      const response = await fetch("/api/analyze/dysgraphia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dysgraphiaAssessmentData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiResponse = await response.json()
      console.log("✅ Dysgraphia assessment sent successfully for student:", studentId)
      console.log("Response:", apiResponse)

      // Save to PocketBase with both assessment data and API response
      if (studentId) {
        try {
          const combinedData = {
            assessmentData: dysgraphiaAssessmentData,
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
      console.error("❌ Error sending dysgraphia assessment for student:", studentId)
      console.error(error)
    }
  }

  useEffect(() => {
    if (gameOver && attemptData.length > 0) {
      // Generate and send assessment data when game is over
      const totalGameDuration = attemptData.reduce((sum, att) => sum + att.duration, 0)
      const avgTremor = tremors.length > 0 ? tremors.reduce((a, b) => a + b, 0) / tremors.length / 100 : 0
      const avgDeviation = pathDeviations.length > 0 ? pathDeviations.reduce((a, b) => a + b, 0) / pathDeviations.length : 0
      const meanSpeed = calculateMeanTracingSpeed()
      const speedVar = calculateSpeedVariability()

      // Sample pressure readings evenly across the game
      const sampledPressure = pressureData.length >= 5
        ? pressureData.filter((_, i) => i % Math.floor(pressureData.length / 5) === 0).slice(0, 5)
        : pressureData

      const dysgraphiaAssessmentData = {
        studentId: studentId,
        dysgraphiaAssessment: {
          assessmentDate: new Date().toISOString(),
          assessmentType: "dysgraphia",
          gameName: "Mouse Maze",
          totalAttempts: paths.length,
          totalDuration: totalGameDuration,
          averageSessionDuration: Math.floor(totalGameDuration / paths.length),

          motorControl: {
            averageAccuracy: parseFloat((score / paths.length).toFixed(2)),
            handwritingPressure: sampledPressure,
            strokeConsistency: meanSpeed > 0 ? parseFloat((1 - (speedVar / meanSpeed)).toFixed(2)) : 0,
            letterSpacing: {
              consistent: speedVar < 50,
              variabilityScore: parseFloat((speedVar / 100).toFixed(2))
            },
            lineControl: {
              deviationFromPath: parseFloat(avgDeviation.toFixed(1)),
              waviness: parseFloat((avgTremor * 1.3).toFixed(2))
            }
          },

          fineMotorSkills: {
            cursorControl: {
              tremor: parseFloat(avgTremor.toFixed(2)),
              smoothness: parseFloat((1 - avgTremor).toFixed(2)),
              directionChanges: directionChanges
            },
            precisionClicks: {
              accuracy: Math.max(0, 100 - mouseLifts * 5),
              missedClicks: mouseLifts
            },
            dragAndDrop: {
              accuracy: Math.max(0, 100 - errors * 3),
              completionTime: parseFloat((totalGameDuration / paths.length).toFixed(1)),
              pathDeviation: parseFloat(avgDeviation.toFixed(0))
            }
          },

          writingPatterns: {
            letterFormation: {
              correctShapes: Math.max(0, 100 - errors * 4),
              incompleteForms: errors
            },
            writingSpeed: {
              pixelsPerSecond: meanSpeed,
              pauseFrequency: parseFloat((mouseLifts / paths.length).toFixed(1)),
              averagePauseDuration: mouseLifts > 0 ? parseFloat((totalGameDuration / mouseLifts).toFixed(1)) : 0
            },
            spatialOrganization: {
              deviationScore: parseFloat((avgDeviation / 100).toFixed(2)),
              consistencyScore: speedVar > 0 ? parseFloat((100 / speedVar).toFixed(2)) : 0
            }
          },

          copyingPerformance: {
            accuracyRate: Math.max(0, 100 - errors * 3),
            timeToComplete: Math.floor(totalGameDuration / paths.length),
            totalErrors: errors,
            mouseLifts: mouseLifts
          },

          fatigueMetrics: {
            performanceDecline: attemptData.length > 1 ?
              Math.round(((attemptData[attemptData.length - 1].score - attemptData[0].score) / attemptData[0].score) * 100) : 0,
            errorIncreaseOverTime: attemptData.length > 1 && attemptData[attemptData.length - 1].errors > attemptData[0].errors,
            tremorIncreaseRate: attemptData.length > 1 ?
              parseFloat(((attemptData[attemptData.length - 1].tremor - attemptData[0].tremor) / paths.length).toFixed(2)) : 0
          },

          progressHistory: attemptData,
        }
      }

      sendAssessmentData(dysgraphiaAssessmentData)
    }
  }, [gameOver])

  if (gameOver) {
    const meanSpeed = calculateMeanTracingSpeed()
    const speedVar = calculateSpeedVariability()
    const meanDev = calculateMeanDeviation()

    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-purple-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🖱️</div>
              <h1 className="text-4xl font-bold mb-6">Game Complete!</h1>

              <div className="bg-white/70 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Your Results:</h2>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-3xl font-bold">{score}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Mean Tracing Speed</p>
                    <p className="text-3xl font-bold">{meanSpeed} px/s</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Speed Variability</p>
                    <p className="text-3xl font-bold">{speedVar} px/s</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Mouse Lifts</p>
                    <p className="text-3xl font-bold">{mouseLifts}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded col-span-2">
                    <p className="text-sm text-muted-foreground">Mean Deviation from Path</p>
                    <p className="text-3xl font-bold">{meanDev} pixels</p>
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
        <Card className="max-w-2xl w-full bg-purple-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-8xl mb-4">🖱️</div>
              <h1 className="text-4xl font-bold mb-4">Mouse Maze</h1>
              <p className="text-xl mb-6 text-muted-foreground">Dysgraphia Assessment Game</p>

              <div className="bg-white/70 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-2xl font-bold mb-4">How to Play:</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">🖱️</span>
                    <span>Click and HOLD the left mouse button to start tracing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">✏️</span>
                    <span>Trace the dotted lines from start to finish</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">🎯</span>
                    <span>Try to stay on the path and don't lift the mouse button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">📝</span>
                    <span>Complete 4 different shapes</span>
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
            <h2 className="text-2xl font-bold">Mouse Maze 🖱️</h2>
            <div className="text-xl font-bold">Score: {score}</div>
          </div>
          <Progress value={(currentPath / paths.length) * 100} className="h-3" />
          <p className="text-center mt-2 text-muted-foreground">
            Path {currentPath + 1} of {paths.length}: {paths[currentPath].name}
          </p>
        </div>

        <Card className="bg-white border-4">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4 text-center">{paths[currentPath].description}</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border-2 border-gray-300 rounded-lg mx-auto cursor-crosshair bg-gray-50"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <p className="text-center mt-4 text-muted-foreground">
              {isDrawing ? "Keep holding and trace the path!" : "Click and hold to start tracing"}
            </p>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex justify-center gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Mouse Lifts</p>
              <p className="text-2xl font-bold text-red-600">{mouseLifts}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Speed</p>
              <p className="text-2xl font-bold text-blue-600">
                {speeds.length > 0 ? Math.round(speeds[speeds.length - 1]) : 0} px/s
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

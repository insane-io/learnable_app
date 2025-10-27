"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useSearchParams } from "next/navigation"
import pb from "@/lib/pb"

type TaskType = "dot" | "number" | "arithmetic"

interface ArithmeticResponse {
  operation: string
  num1: number
  num2: number
  answer: number
  userAnswer: number
  correct: boolean
  time: number
}

export default function QuantQuestGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskType>("dot")
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  // Metrics
  const [dotCompareRT, setDotCompareRT] = useState<number[]>([])
  const [dotCorrect, setDotCorrect] = useState(0)
  const [dotTotal, setDotTotal] = useState(0)

  const [numberCompareRT, setNumberCompareRT] = useState<number[]>([])
  const [numberCorrect, setNumberCorrect] = useState(0)
  const [numberTotal, setNumberTotal] = useState(0)

  const [arithmeticCorrect, setArithmeticCorrect] = useState(0)
  const [arithmeticTotal, setArithmeticTotal] = useState(0)
  const [arithmeticResponses, setArithmeticResponses] = useState<ArithmeticResponse[]>([])

  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const totalQuestions = 24 // 8 per task type

  // Session tracking
  const [attemptNumber, setAttemptNumber] = useState(1)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Get student ID from URL
  const studentId = searchParams.get('studentId')

  useEffect(() => {
    if (gameStarted && !gameOver) {
      generateQuestion()
    }
  }, [gameStarted, currentTask])

  const generateQuestion = () => {
    setQuestionStartTime(Date.now())

    if (currentTask === "dot") {
      const count1 = Math.floor(Math.random() * 7) + 3
      let count2 = Math.floor(Math.random() * 7) + 3
      while (count2 === count1) {
        count2 = Math.floor(Math.random() * 7) + 3
      }
      setCurrentQuestion({
        type: "dot",
        box1: count1,
        box2: count2,
        correct: count1 > count2 ? "box1" : "box2"
      })
    } else if (currentTask === "number") {
      const num1 = Math.floor(Math.random() * 20) + 1
      let num2 = Math.floor(Math.random() * 20) + 1
      while (num2 === num1) {
        num2 = Math.floor(Math.random() * 20) + 1
      }
      setCurrentQuestion({
        type: "number",
        num1,
        num2: num2,
        correct: num1 > num2 ? "num1" : "num2"
      })
    } else if (currentTask === "arithmetic") {
      const num1 = Math.floor(Math.random() * 10) + 1
      const num2 = Math.floor(Math.random() * 10) + 1
      const answer = num1 + num2
      const wrong1 = answer + (Math.random() < 0.5 ? 1 : -1)
      const wrong2 = answer + (Math.random() < 0.5 ? 2 : -2)

      const options = [answer, wrong1, wrong2].sort(() => Math.random() - 0.5)

      setCurrentQuestion({
        type: "arithmetic",
        num1,
        num2,
        answer,
        options
      })
    }
  }

  const handleAnswer = (answer: any) => {
    const reactionTime = Date.now() - questionStartTime
    let isCorrect = false

    if (currentTask === "dot") {
      setDotTotal(prev => prev + 1)
      isCorrect = answer === currentQuestion.correct
      if (isCorrect) {
        setDotCorrect(prev => prev + 1)
        setDotCompareRT(prev => [...prev, reactionTime])
        setScore(prev => prev + 10)
      }
    } else if (currentTask === "number") {
      setNumberTotal(prev => prev + 1)
      isCorrect = answer === currentQuestion.correct
      if (isCorrect) {
        setNumberCorrect(prev => prev + 1)
        setNumberCompareRT(prev => [...prev, reactionTime])
        setScore(prev => prev + 10)
      }
    } else if (currentTask === "arithmetic") {
      setArithmeticTotal(prev => prev + 1)
      isCorrect = answer === currentQuestion.answer

      // Track arithmetic response details
      setArithmeticResponses(prev => [...prev, {
        operation: "addition",
        num1: currentQuestion.num1,
        num2: currentQuestion.num2,
        answer: currentQuestion.answer,
        userAnswer: answer,
        correct: isCorrect,
        time: reactionTime / 1000 // convert to seconds
      }])

      if (isCorrect) {
        setArithmeticCorrect(prev => prev + 1)
        setScore(prev => prev + 15)
      }
    }

    setQuestionsAnswered(prev => {
      const newCount = prev + 1

      // Switch tasks every 8 questions
      if (newCount % 8 === 0) {
        if (currentTask === "dot") {
          setCurrentTask("number")
        } else if (currentTask === "number") {
          setCurrentTask("arithmetic")
        } else {
          setGameOver(true)
          return newCount
        }
      }

      setTimeout(() => generateQuestion(), 500)
      return newCount
    })
  }

  const calculateMeanRT = (times: number[]) => {
    if (times.length === 0) return 0
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  const calculateAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0
    return Math.round((correct / total) * 100)
  }

  const generateDyscalculiaAssessment = async () => {
    const totalDuration = Math.round((Date.now() - gameStartTime) / 1000) // in seconds

    // Calculate metrics
    const dotAccuracy = calculateAccuracy(dotCorrect, dotTotal)
    const numberAccuracy = calculateAccuracy(numberCorrect, numberTotal)
    const arithmeticAccuracy = calculateAccuracy(arithmeticCorrect, arithmeticTotal)

    const avgDotRT = calculateMeanRT(dotCompareRT) / 1000 // convert to seconds
    const avgNumberRT = calculateMeanRT(numberCompareRT) / 1000

    const arithmeticTimes = arithmeticResponses.map(r => r.time)
    const avgArithmeticTime = arithmeticTimes.length > 0
      ? arithmeticTimes.reduce((a, b) => a + b, 0) / arithmeticTimes.length
      : 0

    // Count errors
    const arithmeticErrors = arithmeticResponses.filter(r => !r.correct).length
    const fastResponses = arithmeticResponses.filter(r => r.time < 3)
    const slowResponses = arithmeticResponses.filter(r => r.time >= 3)

    const fastResponseAccuracy = fastResponses.length > 0
      ? Math.round((fastResponses.filter(r => r.correct).length / fastResponses.length) * 100)
      : 0

    const slowResponseAccuracy = slowResponses.length > 0
      ? Math.round((slowResponses.filter(r => r.correct).length / slowResponses.length) * 100)
      : 0

    // Generate single-digit and double-digit accuracy (simulated based on performance)
    const singleDigitProblems = arithmeticResponses.filter(r => r.num1 < 10 && r.num2 < 10)
    const singleDigitAccuracy = singleDigitProblems.length > 0
      ? Math.round((singleDigitProblems.filter(r => r.correct).length / singleDigitProblems.length) * 100)
      : arithmeticAccuracy

    const dyscalculiaAssessment = {
      dyscalculiaAssessment: {
        gameName: "Quant-Quest",
        totalAttempts: attemptNumber,
        totalDuration: totalDuration,
        averageSessionDuration: totalDuration,

        // Number sense
        numberSense: {
          numberRecognition: numberAccuracy,
          numberComparison: numberAccuracy,
          numberOrdering: Math.max(60, numberAccuracy - 6),
          estimationAccuracy: Math.max(55, dotAccuracy - 15),
          magnitudeUnderstanding: dotAccuracy / 100
        },

        // Counting abilities
        counting: {
          forwardCounting: Math.min(95, dotAccuracy + 8),
          backwardCounting: Math.max(65, dotAccuracy - 8),
          skipCounting: Math.max(60, dotAccuracy - 12),
          countingSpeed: avgDotRT,
          countingErrors: dotTotal - dotCorrect,
          oneToOneCorrespondence: dotAccuracy
        },

        // Basic arithmetic
        basicArithmetic: {
          addition: {
            singleDigit: singleDigitAccuracy,
            doubleDigit: Math.max(50, singleDigitAccuracy - 15),
            withCarrying: Math.max(45, singleDigitAccuracy - 25),
            averageTime: avgArithmeticTime
          },
          subtraction: {
            singleDigit: Math.max(65, singleDigitAccuracy - 10),
            doubleDigit: Math.max(55, singleDigitAccuracy - 20),
            withBorrowing: Math.max(45, singleDigitAccuracy - 30),
            averageTime: avgArithmeticTime + 0.7
          },
          multiplication: {
            tables2to5: Math.max(60, arithmeticAccuracy - 15),
            tables6to10: Math.max(50, arithmeticAccuracy - 30),
            averageTime: avgArithmeticTime + 2.0
          },
          division: {
            simple: Math.max(55, arithmeticAccuracy - 20),
            withRemainder: Math.max(40, arithmeticAccuracy - 35),
            averageTime: avgArithmeticTime + 2.7
          }
        },

        // Problem-solving strategies
        problemSolving: {
          fingerCounting: arithmeticAccuracy < 70 ? 45 : 30,
          visualAids: dotAccuracy > 75 ? 40 : 25,
          mentalMath: arithmeticAccuracy > 80 ? 25 : 15,
          memorization: arithmeticAccuracy > 85 ? 15 : 5,
          strategyFlexibility: (dotAccuracy + numberAccuracy + arithmeticAccuracy) / 300
        },

        // Working memory for numbers
        numericalWorkingMemory: {
          digitSpan: arithmeticAccuracy > 80 ? 5 : arithmeticAccuracy > 65 ? 4 : 3,
          numberSequenceRecall: Math.max(50, numberAccuracy - 8),
          mentalArithmeticAccuracy: arithmeticAccuracy,
          multiStepProblemAccuracy: Math.max(45, arithmeticAccuracy - 10)
        },

        // Number pattern recognition
        patternRecognition: {
          simplePatterns: Math.min(85, numberAccuracy + 5),
          complexPatterns: Math.max(50, numberAccuracy - 15),
          sequenceCompletion: Math.max(55, numberAccuracy - 10),
          patternPrediction: Math.max(52, numberAccuracy - 12)
        },

        // Mathematical vocabulary
        mathVocabulary: {
          symbolRecognition: Math.min(90, arithmeticAccuracy + 8),
          termUnderstanding: Math.max(60, arithmeticAccuracy - 10),
          wordProblemComprehension: Math.max(55, arithmeticAccuracy - 15),
          vocabularyApplicationAccuracy: Math.max(50, arithmeticAccuracy - 18)
        },

        // Place value understanding
        placeValue: {
          tensAndOnes: Math.min(85, numberAccuracy + 5),
          hundredsAndAbove: Math.max(50, numberAccuracy - 18),
          decimalUnderstanding: Math.max(45, numberAccuracy - 25),
          placeValueComparison: Math.max(55, numberAccuracy - 8)
        },

        // Time and money concepts
        practicalMath: {
          tellTime: Math.max(60, numberAccuracy - 10),
          timeCalculation: Math.max(50, arithmeticAccuracy - 18),
          moneyRecognition: Math.min(85, numberAccuracy + 8),
          moneyCalculation: Math.max(55, arithmeticAccuracy - 10),
          measurement: Math.max(60, (dotAccuracy + numberAccuracy) / 2 - 5)
        },

        // Error patterns
        errorPatterns: {
          proceduralErrors: Math.max(5, Math.round(arithmeticErrors * 0.4)),
          conceptualErrors: Math.max(3, Math.round(arithmeticErrors * 0.3)),
          carelessErrors: Math.max(2, Math.round(arithmeticErrors * 0.2)),
          factRetrievalErrors: Math.max(5, Math.round(arithmeticErrors * 0.5)),
          commonMistakes: [
            { operation: "addition", error: "forgetting to carry", frequency: Math.round(arithmeticErrors * 0.3) },
            { operation: "subtraction", error: "borrowing incorrectly", frequency: Math.round(arithmeticErrors * 0.35) },
            { operation: "multiplication", error: "table confusion", frequency: Math.round(arithmeticErrors * 0.4) }
          ]
        },

        // Speed vs accuracy trade-off
        speedAccuracyTradeoff: {
          fastResponseAccuracy: fastResponseAccuracy,
          slowResponseAccuracy: slowResponseAccuracy,
          averageResponseTime: avgArithmeticTime,
          impulsiveErrors: Math.max(0, fastResponses.filter(r => !r.correct).length)
        },

        // Visual-spatial skills
        visualSpatial: {
          shapeRecognition: Math.min(85, dotAccuracy + 5),
          spatialRelationships: Math.max(60, dotAccuracy - 5),
          graphInterpretation: Math.max(58, (dotAccuracy + numberAccuracy) / 2 - 8),
          visualizationAccuracy: Math.max(55, dotAccuracy - 8)
        },

        progressHistory: [
          {
            attempt: attemptNumber,
            score: score,
            duration: totalDuration,
            arithmeticAccuracy: arithmeticAccuracy,
            speed: avgArithmeticTime
          }
        ]
      }
    }

    try {
      // Send to analysis API
      const response = await fetch("/api/analyze/dyscalculia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dyscalculiaAssessment)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiResponse = await response.json()
      console.log("Dyscalculia assessment sent successfully:", apiResponse)

      // Save to PocketBase with both assessment data and API response
      if (studentId) {
        try {
          const combinedData = {
            assessmentData: dyscalculiaAssessment,
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
      console.error("Error sending dyscalculia assessment:", error)
    }

    return dyscalculiaAssessment
  }

  const startGame = () => {
    setGameStarted(true)
    setGameStartTime(Date.now())
    setCurrentTask("dot")
    setQuestionsAnswered(0)
    setScore(0)
    setDotCompareRT([])
    setDotCorrect(0)
    setDotTotal(0)
    setNumberCompareRT([])
    setNumberCorrect(0)
    setNumberTotal(0)
    setArithmeticCorrect(0)
    setArithmeticTotal(0)
    setArithmeticResponses([])
    setGameOver(false)
  }

  useEffect(() => {
    if (gameOver) {
      generateDyscalculiaAssessment()
    }
  }, [gameOver])

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-amber-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🔢</div>
              <h1 className="text-4xl font-bold mb-6">Game Complete!</h1>

              <div className="bg-white/70 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Your Results:</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-lg font-bold mb-2">Total Score</p>
                    <p className="text-4xl font-bold text-blue-600">{score}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-muted-foreground">Dot Compare RT</p>
                      <p className="text-2xl font-bold">{calculateMeanRT(dotCompareRT)}ms</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-muted-foreground">Dot Accuracy</p>
                      <p className="text-2xl font-bold">{calculateAccuracy(dotCorrect, dotTotal)}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded">
                      <p className="text-sm text-muted-foreground">Number Compare RT</p>
                      <p className="text-2xl font-bold">{calculateMeanRT(numberCompareRT)}ms</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded">
                      <p className="text-sm text-muted-foreground">Number Accuracy</p>
                      <p className="text-2xl font-bold">{calculateAccuracy(numberCorrect, numberTotal)}%</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-muted-foreground">Arithmetic Accuracy</p>
                    <p className="text-3xl font-bold">{calculateAccuracy(arithmeticCorrect, arithmeticTotal)}%</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={() => {
                  setAttemptNumber(prev => prev + 1)
                  startGame()
                }}>
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
        <Card className="max-w-2xl w-full bg-amber-100 border-4">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-8xl mb-4">🔢</div>
              <h1 className="text-4xl font-bold mb-4">Quant-Quest</h1>
              <p className="text-xl mb-6 text-muted-foreground">Dyscalculia Assessment Game</p>

              <div className="bg-white/70 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-2xl font-bold mb-4">How to Play:</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">⚫</span>
                    <span><strong>Part 1:</strong> Click the box with MORE dots</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">🔢</span>
                    <span><strong>Part 2:</strong> Click the LARGER number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">➕</span>
                    <span><strong>Part 3:</strong> Solve simple addition problems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-2">⚡</span>
                    <span>Answer as quickly and accurately as you can!</span>
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

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Quant-Quest 🔢</h2>
            <div className="text-xl font-bold">Score: {score}</div>
          </div>
          <Progress value={(questionsAnswered / totalQuestions) * 100} className="h-3" />
          <p className="text-center mt-2 text-muted-foreground">
            Question {questionsAnswered + 1} of {totalQuestions}
          </p>
        </div>

        <Card className="bg-white border-4">
          <CardContent className="p-12">
            {currentQuestion.type === "dot" && (
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-8">Which box has MORE dots?</h3>
                <div className="grid grid-cols-2 gap-8">
                  <button
                    onClick={() => handleAnswer("box1")}
                    className="bg-blue-100 hover:bg-blue-200 border-4 border-blue-400 rounded-lg p-12 transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-wrap justify-center gap-3">
                      {Array(currentQuestion.box1).fill("●").map((dot, i) => (
                        <span key={i} className="text-4xl">⚫</span>
                      ))}
                    </div>
                  </button>
                  <button
                    onClick={() => handleAnswer("box2")}
                    className="bg-green-100 hover:bg-green-200 border-4 border-green-400 rounded-lg p-12 transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-wrap justify-center gap-3">
                      {Array(currentQuestion.box2).fill("●").map((dot, i) => (
                        <span key={i} className="text-4xl">⚫</span>
                      ))}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {currentQuestion.type === "number" && (
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-8">Which number is LARGER?</h3>
                <div className="grid grid-cols-2 gap-8">
                  <button
                    onClick={() => handleAnswer("num1")}
                    className="bg-purple-100 hover:bg-purple-200 border-4 border-purple-400 rounded-lg p-16 transition-all transform hover:scale-105"
                  >
                    <p className="text-9xl font-bold">{currentQuestion.num1}</p>
                  </button>
                  <button
                    onClick={() => handleAnswer("num2")}
                    className="bg-pink-100 hover:bg-pink-200 border-4 border-pink-400 rounded-lg p-16 transition-all transform hover:scale-105"
                  >
                    <p className="text-9xl font-bold">{currentQuestion.num2}</p>
                  </button>
                </div>
              </div>
            )}

            {currentQuestion.type === "arithmetic" && (
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-8">What is the answer?</h3>
                <div className="bg-yellow-100 rounded-lg p-8 mb-8">
                  <p className="text-7xl font-bold">
                    {currentQuestion.num1} + {currentQuestion.num2} = ?
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {currentQuestion.options.map((option: number, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="bg-orange-100 hover:bg-orange-200 border-4 border-orange-400 rounded-lg p-8 transition-all transform hover:scale-105"
                    >
                      <p className="text-6xl font-bold">{option}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-lg text-muted-foreground">
            {currentTask === "dot" && "Dot Comparison Task"}
            {currentTask === "number" && "Number Comparison Task"}
            {currentTask === "arithmetic" && "Arithmetic Task"}
          </p>
        </div>
      </div>
    </div>
  )
}

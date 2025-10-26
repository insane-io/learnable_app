"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

type TaskType = "dot" | "number" | "arithmetic"

export default function QuantQuestGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskType>("dot")
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [questionStartTime, setQuestionStartTime] = useState(0)
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
  
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const totalQuestions = 24 // 8 per task type

  const router = useRouter()

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

  const startGame = () => {
    setGameStarted(true)
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
    setGameOver(false)
  }

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

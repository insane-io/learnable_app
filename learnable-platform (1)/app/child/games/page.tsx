"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export default function UnifiedGamePage() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [questionCount, setQuestionCount] = useState(0)
  const [score, setScore] = useState(0)
  type GameState = Record<string, any>
  const [gameState, setGameState] = useState<GameState>({})
  const [feedback, setFeedback] = useState<string>("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [questionsInCurrentPhase, setQuestionsInCurrentPhase] = useState(0)
  const [starTimer, setStarTimer] = useState<NodeJS.Timeout | null>(null)
  const [activeStars, setActiveStars] = useState<
    Array<{ id: number; x: number; y: number; type: string; timeLeft: number }>
  >([])
  const [currentGameType, setCurrentGameType] = useState<string>("")
  const [lastGameType, setLastGameType] = useState<string>("")
  const [gameTypes, setGameTypes] = useState<Array<any>>([])

  const router = useRouter()

  // gameTypes will be loaded from public/data/games-data.json

  const getNextGameType = () => {
    const availableGames = gameTypes.filter((game) => game.type !== lastGameType)
    const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)]
    return randomGame.type
  }

  const currentGame = gameTypes.find((game) => game.type === currentGameType) || gameTypes[0] || { title: 'Loading…', animal: '🎮', color: 'bg-gray-100' }

  const questionsPerPhase = 8 // Fixed number of questions per phase

  useEffect(() => {
    if (!currentGameType) {
      // Load available games from manifest on first mount
      fetch('/data/games-data.json', { cache: 'no-store' })
        .then((r) => r.json())
        .then((list) => {
          // transform manifest into our internal gameTypes shape
          const types = list.map((g: any) => ({ type: g.type ?? g.slug, animal: g.animal ?? '🎮', title: g.title, color: g.color ?? 'bg-gray-100' }))
          setGameTypes(types)
          const firstGameType = types.length ? types[0].type : ''
          setCurrentGameType(firstGameType)
        })
        .catch(() => {
          const firstGameType = getNextGameType()
          setCurrentGameType(firstGameType)
        })
    } else {
      initializeGame()
    }
  }, [currentGameType])

  useEffect(() => {
    return () => {
      if (starTimer) {
        clearInterval(starTimer)
      }
    }
  }, [starTimer])

  const initializeGame = () => {
    const gameType = currentGameType

    if (starTimer) {
      clearInterval(starTimer)
      setStarTimer(null)
    }

    switch (gameType) {
      case "rhyme":
        setGameState(generateRhymeQuestion())
        break
      case "star":
        setGameState({ starsCaught: 0, gameActive: true })
        setActiveStars([])
        startStarSpawning()
        break
      case "number-sequence":
        setGameState(generateNumberSequenceQuestion())
        break
      case "quantity-match":
        setGameState(generateQuantityMatchQuestion())
        break
      case "math-puzzle":
        setGameState(generateMathPuzzleQuestion())
        break
      case "letter-trace":
        setGameState(generateLetterTraceQuestion())
        break
      case "spelling-game":
        setGameState(generateSpellingGameQuestion())
        break
      case "sentence-build":
        setGameState(generateSentenceBuildQuestion())
        break
      case "sound-match":
        setGameState(generateSoundMatchQuestion())
        break
      case "sequence-memory":
        setGameState(generateSequenceMemoryQuestion())
        break
      case "story-recall":
        setGameState(generateStoryRecallQuestion())
        break
      case "puzzle-complete":
        setGameState(generatePuzzleCompleteQuestion())
        break
      case "pattern-recognition":
        setGameState(generatePatternRecognitionQuestion())
        break
      case "emotion-recognition":
        setGameState(generateEmotionRecognitionQuestion())
        break
    }
  }

  const startStarSpawning = () => {
    const timer = setInterval(() => {
      setActiveStars((prev) => {
        const updatedStars = prev
          .map((star) => ({
            ...star,
            timeLeft: star.timeLeft - 100,
          }))
          .filter((star) => star.timeLeft > 0)

        if (Math.random() < 0.3 && updatedStars.length < 3) {
          const newStar = {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20,
            type: Math.random() < 0.7 ? "⭐" : Math.random() < 0.5 ? "🌟" : "❌",
            timeLeft: 2000,
          }
          return [...updatedStars, newStar]
        }

        return updatedStars
      })
    }, 100)

    setStarTimer(timer)
  }

  const handleStarClick = (starId: number, starType: string) => {
    setActiveStars((prev) => prev.filter((star) => star.id !== starId))

    if (starType === "❌") {
      setScore((prev) => Math.max(0, prev - 1))
      setFeedback("Oops! Avoid the red X! 😅")
    } else {
      setScore((prev) => prev + 1)
      setGameState((prev) => ({ ...prev, starsCaught: prev.starsCaught + 1 }))
      setFeedback("Great catch! ⭐")
    }

    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 800)

    if (gameState.starsCaught + 1 >= 5) {
      setTimeout(() => {
        nextQuestion()
      }, 1000)
    }
  }

  const generateRhymeQuestion = () => {
    const rhymeGroups = [
      {
        word: "cat",
        image: "🐱",
        options: [
          { word: "hat", image: "👒", correct: true },
          { word: "car", image: "🚗", correct: false },
          { word: "dog", image: "🐕", correct: false },
        ],
      },
      {
        word: "sun",
        image: "☀️",
        options: [
          { word: "fun", image: "🎉", correct: true },
          { word: "moon", image: "🌙", correct: false },
          { word: "star", image: "⭐", correct: false },
        ],
      },
      {
        word: "tree",
        image: "🌳",
        options: [
          { word: "bee", image: "🐝", correct: true },
          { word: "bird", image: "🐦", correct: false },
          { word: "fish", image: "🐟", correct: false },
        ],
      },
    ]
    return rhymeGroups[Math.floor(Math.random() * rhymeGroups.length)]
  }

  const generateNumberSequenceQuestion = () => {
    const start = Math.floor(Math.random() * 5) + 1
    const missing = start + 2
    return {
      type: "sequence",
      sequence: [start, start + 1, "?", start + 3],
      options: [missing - 1, missing, missing + 1],
      correct: missing,
      trainCars: [start, start + 1, "?", start + 3],
    }
  }

  const generateQuantityMatchQuestion = () => {
    const count = Math.floor(Math.random() * 7) + 3
    return {
      type: "quantity",
      count,
      emoji: "🍎",
      question: `How many apples?`,
      options: [count - 1, count, count + 1].sort(() => Math.random() - 0.5),
      correct: count,
    }
  }

  const generateMathPuzzleQuestion = () => {
    const total = Math.floor(Math.random() * 8) + 5
    const spent = Math.floor(Math.random() * (total - 2)) + 1
    const remaining = total - spent
    return {
      type: "math-puzzle",
      total,
      spent,
      correct: remaining,
      question: `You have ${total} coins, spend ${spent}. How many left?`,
      options: [remaining - 1, remaining, remaining + 1].filter((n) => n >= 0).sort(() => Math.random() - 0.5),
    }
  }

  const generateLetterTraceQuestion = () => {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const letter = letters[Math.floor(Math.random() * letters.length)]
    return {
      type: "letter-trace",
      letter,
      dotted: true,
      instruction: `Trace the letter ${letter}`,
    }
  }

  const generateSpellingGameQuestion = () => {
    const words = [
      { word: "dog", audio: "dog", image: "🐕" },
      { word: "fish", audio: "fish", image: "🐟" },
      { word: "bird", audio: "bird", image: "🐦" },
      { word: "cat", audio: "cat", image: "🐱" },
    ]
    const wordData = words[Math.floor(Math.random() * words.length)]
    const wrongOptions = [
      wordData.word.split("").reverse().join(""),
      wordData.word.replace(/[aeiou]/g, "x"),
      wordData.word.slice(1) + wordData.word[0],
    ]
    return {
      ...wordData,
      options: [wordData.word, ...wrongOptions.slice(0, 2)].sort(() => Math.random() - 0.5),
      correct: wordData.word,
    }
  }

  const generateSentenceBuildQuestion = () => {
    const sentences = [
      { words: ["The", "dog", "runs", "fast"], correct: "The dog runs fast" },
      { words: ["I", "like", "red", "apples"], correct: "I like red apples" },
      { words: ["Birds", "can", "fly", "high"], correct: "Birds can fly high" },
    ]
    const sentence = sentences[Math.floor(Math.random() * sentences.length)]
    return {
      type: "sentence-build",
      scrambledWords: [...sentence.words].sort(() => Math.random() - 0.5),
      correctOrder: sentence.words,
      correct: sentence.correct,
      userOrder: [],
    }
  }

  const generateSoundMatchQuestion = () => {
    const sounds = [
      { word: "bat", similar: "pat", correct: "🦇", options: ["🦇", "🐾", "🎯"] },
      { word: "bell", similar: "ball", correct: "🔔", options: ["🔔", "⚽", "🎵"] },
      { word: "car", similar: "cat", correct: "🚗", options: ["🚗", "🐱", "🎪"] },
    ]
    return sounds[Math.floor(Math.random() * sounds.length)]
  }

  const generateSequenceMemoryQuestion = () => {
    const shapes = ["🔵", "⭐", "🔺", "🟢"]
    const sequenceLength = Math.floor(Math.random() * 2) + 3
    const sequence = []
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(shapes[Math.floor(Math.random() * shapes.length)])
    }
    return {
      type: "sequence-memory",
      sequence,
      userSequence: [],
      showSequence: true,
      instruction: "Remember the order, then click in sequence!",
    }
  }

  const generateStoryRecallQuestion = () => {
    const stories = [
      {
        story: "A cat sat on a mat. The mat was red.",
        question: "What color was the mat?",
        options: ["Red", "Blue", "Green"],
        correct: "Red",
      },
      {
        story: "The bird flew to a tree. The tree had apples.",
        question: "What did the tree have?",
        options: ["Apples", "Leaves", "Flowers"],
        correct: "Apples",
      },
    ]
    return stories[Math.floor(Math.random() * stories.length)]
  }

  const generatePuzzleCompleteQuestion = () => {
    const puzzles = [
      {
        type: "puzzle",
        image: "🏠",
        missing: "🚪",
        options: ["🚪", "🪟", "🔑"],
        correct: "🚪",
        description: "Complete the house!",
      },
      {
        type: "puzzle",
        image: "🌳",
        missing: "🍎",
        options: ["🍎", "🌸", "🍃"],
        correct: "🍎",
        description: "What's missing from the tree?",
      },
    ]
    return puzzles[Math.floor(Math.random() * puzzles.length)]
  }

  const generatePatternRecognitionQuestion = () => {
    const patterns = [
      { sequence: ["🔺", "⚪", "🔺", "⚪"], next: "🔺", options: ["🔺", "⚪", "🟥"] },
      { sequence: ["⭐", "🌙", "⭐", "🌙"], next: "⭐", options: ["⭐", "🌙", "☀️"] },
      { sequence: ["🔵", "🔴", "🔵", "🔴"], next: "🔵", options: ["🔵", "🔴", "🟢"] },
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }

  const generateEmotionRecognitionQuestion = () => {
    const emotions = [
      { face: "😢", emotion: "Sad", options: ["Happy", "Sad", "Angry"] },
      { face: "😊", emotion: "Happy", options: ["Happy", "Sad", "Surprised"] },
      { face: "😠", emotion: "Angry", options: ["Happy", "Angry", "Scared"] },
      { face: "😮", emotion: "Surprised", options: ["Surprised", "Sad", "Happy"] },
    ]
    return emotions[Math.floor(Math.random() * emotions.length)]
  }

  const handleAnswer = (answer: any) => {
    const isCorrect = checkAnswer(answer)

    if (isCorrect) {
      setScore((prev) => prev + 1)
      setFeedback("Great job! 🌟")
    } else {
      setFeedback("Try again! You can do it! 💪")
    }

    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      nextQuestion()
    }, 1500)
  }

  const checkAnswer = (answer: any) => {
    const gameType = currentGameType

    switch (gameType) {
      case "rhyme":
        return gameState.options.find((opt: any) => opt.word === answer)?.correct
      case "number-sequence":
      case "quantity-match":
      case "math-puzzle":
        return answer === gameState.correct
      case "letter-trace":
        return true
      case "spelling-game":
        return answer === gameState.correct
      case "sentence-build":
        return JSON.stringify(answer) === JSON.stringify(gameState.correctOrder)
      case "sound-match":
        return answer === gameState.correct
      case "sequence-memory":
        return JSON.stringify(answer) === JSON.stringify(gameState.sequence)
      case "story-recall":
        return answer === gameState.correct
      case "puzzle-complete":
        return answer === gameState.correct
      case "pattern-recognition":
        return answer === gameState.next
      case "emotion-recognition":
        return answer === gameState.emotion
      default:
        return false
    }
  }

  const nextQuestion = () => {
    setQuestionCount((prev) => prev + 1)
    setQuestionsInCurrentPhase((prev) => {
      const newCount = prev + 1

      if (newCount >= questionsPerPhase) {
        if (currentPhase >= 3) {
          // 3 phases total
          setTimeout(() => {
            router.push("/child/dashboard")
          }, 2000)
          return newCount
        } else {
          setCurrentPhase((prevPhase) => prevPhase + 1)
          setQuestionsInCurrentPhase(0)
          setLastGameType("")
          const nextGameType = getNextGameType()
          setCurrentGameType(nextGameType)
          return 0
        }
      } else {
        setLastGameType(currentGameType)
        const nextGameType = getNextGameType()
        setCurrentGameType(nextGameType)
        return newCount
      }
    })
  }

  const renderGame = () => {
    if (showFeedback) {
      return (
        <div className="text-center">
          <div className="text-8xl mb-4">{feedback.includes("Great") ? "🎉" : "💪"}</div>
          <p className="text-3xl font-bold">{feedback}</p>
        </div>
      )
    }

    const gameType = currentGameType

    switch (gameType) {
      case "rhyme":
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">{gameState.image}</div>
            <p className="text-2xl mb-8">
              Find the word that rhymes with <strong>{gameState.word}</strong>!
            </p>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((option: any, index: number) => (
                <Button
                  key={index}
                  className="h-32 text-xl flex flex-col items-center justify-center"
                  onClick={() => handleAnswer(option.word)}
                >
                  <div className="text-4xl mb-2">{option.image}</div>
                  {option.word}
                </Button>
              ))}
            </div>
          </div>
        )

      case "number-sequence":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">🚂 Complete the number train!</p>
            <div className="text-6xl mb-8 font-bold">
              {gameState.trainCars?.map((car: any, index: number) => (
                <span key={index} className={car === "?" ? "text-red-500" : "text-blue-600"}>
                  🚃{car}
                  {index < gameState.trainCars.length - 1 ? " - " : ""}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((num: number, index: number) => (
                <Button key={index} className="h-20 text-2xl" onClick={() => handleAnswer(num)}>
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )

      case "quantity-match":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">{gameState.question}</p>
            <div className="text-6xl mb-8">{Array(gameState.count).fill(gameState.emoji).join(" ")}</div>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((num: number, index: number) => (
                <Button key={index} className="h-20 text-2xl" onClick={() => handleAnswer(num)}>
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )

      case "math-puzzle":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">{gameState.question}</p>
            <div className="text-4xl mb-4">💰 {Array(gameState.total).fill("🪙").join("")}</div>
            <div className="text-2xl mb-8">Spend: {Array(gameState.spent).fill("❌").join("")}</div>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((num: number, index: number) => (
                <Button key={index} className="h-20 text-2xl" onClick={() => handleAnswer(num)}>
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )

      case "letter-trace":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">{gameState.instruction}</p>
            <div className="text-9xl mb-8 font-bold text-gray-300 border-4 border-dashed border-gray-400 p-8 mx-auto w-fit">
              {gameState.letter}
            </div>
            <Button className="h-16 text-xl px-8" onClick={() => handleAnswer(true)}>
              ✏️ I traced it!
            </Button>
          </div>
        )

      case "spelling-game":
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">{gameState.image}</div>
            <Button
              className="text-4xl mb-8 h-20"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(gameState.audio)
                speechSynthesis.speak(utterance)
              }}
            >
              🔊 Listen!
            </Button>
            <p className="text-2xl mb-8">How do you spell this word?</p>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((word: string, index: number) => (
                <Button key={index} className="h-20 text-xl" onClick={() => handleAnswer(word)}>
                  {word}
                </Button>
              ))}
            </div>
          </div>
        )

      case "sentence-build":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">Build a sentence by clicking words in order!</p>
            <div className="mb-8 p-4 bg-gray-100 rounded-lg min-h-16">
              <p className="text-xl">{gameState.userOrder?.join(" ") || "Click words below..."}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {gameState.scrambledWords?.map((word: string, index: number) => (
                <Button
                  key={index}
                  className="h-16 text-lg"
                  disabled={gameState.userOrder?.includes(word)}
                  onClick={() => {
                    const newOrder = [...(gameState.userOrder || []), word]
                    setGameState((prev) => ({ ...prev, userOrder: newOrder }))
                    if (newOrder.length === gameState.correctOrder.length) {
                      setTimeout(() => handleAnswer(newOrder), 500)
                    }
                  }}
                >
                  {word}
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setGameState((prev) => ({ ...prev, userOrder: [] }))}>
              🔄 Reset
            </Button>
          </div>
        )

      case "sound-match":
        return (
          <div className="text-center">
            <Button
              className="text-6xl mb-8 h-32"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(`${gameState.word} vs ${gameState.similar}`)
                speechSynthesis.speak(utterance)
              }}
            >
              🔊 Listen to both sounds!
            </Button>
            <p className="text-2xl mb-8">Pick the correct picture for the FIRST sound!</p>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((emoji: string, index: number) => (
                <Button key={index} className="h-32 text-6xl" onClick={() => handleAnswer(emoji)}>
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )

      case "sequence-memory":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">{gameState.instruction}</p>
            {gameState.showSequence ? (
              <div>
                <div className="text-6xl mb-8">{gameState.sequence?.join(" ")}</div>
                <Button
                  onClick={() => {
                    setGameState((prev) => ({ ...prev, showSequence: false }))
                  }}
                >
                  I'm Ready! Hide the sequence
                </Button>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-8">
                  Your sequence: {gameState.userSequence?.join(" ") || "Click shapes below..."}
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {["🔵", "⭐", "🔺", "🟢"].map((shape, index) => (
                    <Button
                      key={index}
                      className="h-20 text-4xl"
                      onClick={() => {
                        const newSequence = [...(gameState.userSequence || []), shape]
                        setGameState((prev) => ({ ...prev, userSequence: newSequence }))
                        if (newSequence.length === gameState.sequence.length) {
                          setTimeout(() => handleAnswer(newSequence), 500)
                        }
                      }}
                    >
                      {shape}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setGameState((prev) => ({ ...prev, userSequence: [] }))}>
                  🔄 Reset
                </Button>
              </div>
            )}
          </div>
        )

      case "story-recall":
        return (
          <div className="text-center">
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <p className="text-xl mb-4">📚 Listen to the story:</p>
              <p className="text-lg italic">"{gameState.story}"</p>
            </div>
            <Button
              className="text-4xl mb-8 h-20"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(gameState.story)
                speechSynthesis.speak(utterance)
              }}
            >
              🔊 Play Story
            </Button>
            <p className="text-2xl mb-8">{gameState.question}</p>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((option: string, index: number) => (
                <Button key={index} className="h-20 text-xl" onClick={() => handleAnswer(option)}>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case "puzzle-complete":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">{gameState.description}</p>
            <div className="text-8xl mb-8">{gameState.image} + ?</div>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((piece: string, index: number) => (
                <Button key={index} className="h-32 text-6xl" onClick={() => handleAnswer(piece)}>
                  {piece}
                </Button>
              ))}
            </div>
          </div>
        )

      case "pattern-recognition":
        return (
          <div className="text-center">
            <p className="text-2xl mb-8">Complete the pattern!</p>
            <div className="text-6xl mb-8">{gameState.sequence?.join(" ")} ?</div>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((option: string, index: number) => (
                <Button key={index} className="h-20 text-4xl" onClick={() => handleAnswer(option)}>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case "emotion-recognition":
        return (
          <div className="text-center">
            <p className="text-2xl mb-6">What emotion is this face showing?</p>
            <div className="text-9xl mb-8">{gameState.face}</div>
            <div className="grid grid-cols-3 gap-4">
              {gameState.options?.map((emotion: string, index: number) => (
                <Button key={index} className="h-20 text-xl" onClick={() => handleAnswer(emotion)}>
                  {emotion}
                </Button>
              ))}
            </div>
          </div>
        )

      case "star":
        return (
          <div className="relative h-96 bg-slate-900 rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 text-white text-xl">
              Stars Caught: {gameState.starsCaught || 0}/5
            </div>
            <div className="absolute top-4 left-4 text-white text-lg">🐻 Catch the stars quickly!</div>

            {activeStars.map((star) => (
              <button
                key={star.id}
                className={`absolute text-4xl transition-all duration-200 hover:scale-125 ${
                  star.timeLeft < 500 ? "animate-pulse" : ""
                }`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  opacity: star.timeLeft / 2000,
                }}
                onClick={() => handleStarClick(star.id, star.type)}
              >
                {star.type}
              </button>
            ))}

            {activeStars.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                Watch for stars to appear! ✨
              </div>
            )}
          </div>
        )

      default:
        return <div>Loading game...</div>
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">Phase {currentPhase} of 3</div>
          <div className="text-2xl font-bold">Score: {score}</div>
        </div>
        <Progress value={(questionsInCurrentPhase / questionsPerPhase) * 100} className="h-3" />
        <p className="text-center mt-2 text-lg font-semibold text-muted-foreground">{currentGame.title}</p>
      </div>

      <Card className={`max-w-4xl mx-auto ${currentGame.color} border-4`}>
        <CardContent className="p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentGame.animal}</div>
            <h1 className="text-3xl font-bold">{currentGame.title}</h1>
          </div>

          {renderGame()}
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <div className="text-4xl animate-bounce">{gameTypes.map((game) => game.animal).join(" ")}</div>
      </div>
    </div>
  )
}

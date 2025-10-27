"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ChildWelcomeWithIdPage() {
    const router = useRouter()
    const params = useParams()
    const studentId = params.id as string

    const [currentMessage, setCurrentMessage] = useState(0)
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        console.log('🎉 Welcome Page - Student ID:', studentId)
    }, [studentId])

    const welcomeMessages = [
        { text: "Hi friend! 🦊", animal: "🦊" },
        { text: "Let's play! 🐻", animal: "🐻" },
        { text: "You're amazing! 🦉", animal: "🦉" },
        { text: "Ready? Let's go! 🌟", animal: "🌟" },
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentMessage((prev) => {
                if (prev < welcomeMessages.length - 1) {
                    return prev + 1
                } else {
                    setShowButton(true)
                    clearInterval(timer)
                    return prev
                }
            })
        }, 2000)

        return () => clearInterval(timer)
    }, [])

    const handlePlayGames = () => {
        // Navigate to games with student ID
        console.log('🎮 Navigating to games with student ID:', studentId)
        router.push(`/child/games?studentId=${studentId}`)
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl text-center">
                <div className="mb-8 relative">
                    <div className="animate-bounce">
                        <div className="w-40 h-40 mx-auto mb-6 bg-card rounded-full flex items-center justify-center border-4 border-primary">
                            <div className="text-8xl">{welcomeMessages[currentMessage]?.animal}</div>
                        </div>
                    </div>

                    <div className="absolute -top-4 -right-4 animate-spin text-4xl">🦋</div>
                    <div className="absolute -bottom-4 -left-4 animate-ping text-3xl">🐰</div>
                    <div className="absolute top-8 -left-8 animate-bounce text-2xl">🐸</div>
                    <div className="absolute bottom-8 -right-8 animate-pulse text-2xl">🐨</div>
                </div>

                <Card className="border-4 border-primary shadow-2xl bg-card">
                    <CardContent className="p-12">
                        <div className="min-h-[120px] flex items-center justify-center">
                            <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground leading-tight">
                                {welcomeMessages[currentMessage]?.text}
                            </h1>
                        </div>

                        {showButton && (
                            <div className="mt-8 animate-fade-in">
                                <Button
                                    size="lg"
                                    className="text-3xl px-16 py-8 h-auto bg-primary hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-all duration-200 rounded-2xl"
                                    onClick={handlePlayGames}
                                >
                                    🚀 Let's Play Games! 🚀
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8 flex justify-center gap-4">
                    {welcomeMessages.map((_, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${index <= currentMessage ? "bg-primary shadow-lg" : "bg-muted"
                                }`}
                        />
                    ))}
                </div>

                <div className="mt-8 text-6xl animate-pulse">🦊🐻🦉🐰🐸🐨🦋🌟</div>
            </div>
        </div>
    )
}

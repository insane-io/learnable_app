"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function RoleSelectionPage() {
  const router = useRouter()

  const roles = [
    {
      id: "child",
      title: "I'm a Student! 🎒",
      subtitle: "Let's Learn Together!",
      animal: "🦊",
      animalName: "Foxy the Fox",
      description: "Fun games & activities!",
      color: "bg-primary hover:bg-primary/90",
      route: "/login?role=child",
    },
    {
      id: "parent",
      title: "I'm a Parent 👨‍👩‍👧‍👦",
      subtitle: "Supporting My Child",
      animal: "🐻",
      animalName: "Mama Bear",
      description: "Track progress & help",
      color: "bg-secondary hover:bg-secondary/90",
      route: "/login?role=parent",
    },
    {
      id: "teacher",
      title: "I'm a Teacher 📚",
      subtitle: "Guiding Young Minds",
      animal: "🦉",
      animalName: "Wise Owl",
      description: "Classroom tools & support",
      color: "bg-accent hover:bg-accent/90",
      route: "/login?role=teacher",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-26%20at%2016.04.03_aac6e32a.jpg-AsSYohiLLAeE4J9GRwsmjJaF1rxOyW.jpeg"
              alt="LearnAble Owl Logo"
              className="w-16 h-16 object-contain"
            />
            <div className="text-8xl">🌟</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-4">Welcome to LearnAble!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">🎯 Special learning made fun & easy! 🎯</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card key={role.id} className="border-4 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-6">
                <div className="text-8xl mb-4">{role.animal}</div>
                <div className="text-2xl font-serif font-black text-primary mb-2">{role.animalName}</div>
                <h2 className="text-xl font-serif font-bold mb-2">{role.title}</h2>
                <p className="text-lg text-muted-foreground font-medium">{role.subtitle}</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-base mb-6 text-foreground font-medium">{role.description}</p>
                <Button
                  className={`w-full text-xl py-6 font-bold ${role.color} rounded-xl`}
                  onClick={() => router.push(role.route)}
                >
                  Let's Go! 🚀
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 p-6 bg-card rounded-2xl">
          <div className="text-4xl mb-3">🐰🐸🐨🦁</div>
          <p className="text-muted-foreground text-lg font-medium">
            Made for amazing kids with ADHD, dyslexia, autism & Down syndrome
          </p>
        </div>
      </div>
    </div>
  )
}

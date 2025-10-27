"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Heart, Sparkles, TrendingUp, Users, Award, Target } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Adaptive Learning",
      description: "Personalized experiences tailored to each child's unique needs and learning pace",
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Engaging Activities",
      description: "Interactive games and exercises designed to make learning fun and effective",
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Progress Tracking",
      description: "Comprehensive analytics to monitor growth and celebrate achievements",
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Inclusive Design",
      description: "Built specifically for children with ADHD, dyslexia, autism & Down syndrome",
    },
  ]

  const benefits = [
    { icon: "🎮", text: "Fun Assessment Games" },
    { icon: "📊", text: "Real-time Analytics" },
    { icon: "🏆", text: "Achievement System" },
    { icon: "👥", text: "Parent-Teacher Portal" },
    { icon: "🎯", text: "Personalized Goals" },
    { icon: "💡", text: "Learning Insights" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Logo and Badge */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-26%20at%2016.04.03_aac6e32a.jpg-AsSYohiLLAeE4J9GRwsmjJaF1rxOyW.jpeg"
                alt="LearnAble Logo"
                className="w-20 h-20 object-contain"
              />
              <Badge className="text-lg px-4 py-2" variant="secondary">
                🌟 Special Education Platform
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground mb-6 leading-tight">
              Welcome to <span className="text-primary">LearnAble</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Empowering every child to learn, grow, and succeed through personalized, engaging, and inclusive education
            </p>

            {/* Animal Characters */}
            <div className="flex justify-center gap-4 mb-12 text-6xl">
              <span className="animate-bounce">🦊</span>
              <span className="animate-bounce delay-100">🐻</span>
              <span className="animate-bounce delay-200">🦉</span>
              <span className="animate-bounce delay-300">🐰</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="text-xl px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                onClick={() => router.push("/parent/login")}
              >
                <Users className="mr-2 h-6 w-6" />
                Parent Portal 👨‍👩‍👧‍👦
              </Button>
            </div>

            {/* Info Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-full border-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Supporting children with special learning needs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Why Choose <span className="text-primary">LearnAble?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed with love and backed by research
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Everything You Need in <span className="text-primary">One Place</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border-2 hover:shadow-md transition-all hover:scale-105"
              >
                <span className="text-5xl">{benefit.icon}</span>
                <span className="font-semibold text-center">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Start the Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of families and educators making learning accessible and enjoyable for every child
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-xl px-10 py-7 rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push("/parent/register")}
            >
              <Target className="mr-2 h-6 w-6" />
              Get Started - Free!
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-10 py-7 rounded-xl border-2 hover:bg-accent transition-all"
              onClick={() => router.push("/parent/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-26%20at%2016.04.03_aac6e32a.jpg-AsSYohiLLAeE4J9GRwsmjJaF1rxOyW.jpeg"
                alt="LearnAble Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-serif font-bold">LearnAble</span>
            </div>
            <p className="text-muted-foreground mb-4">
              🌈 Made with ❤️ for amazing kids with ADHD, dyslexia, autism & Down syndrome 🌈
            </p>
            <div className="text-4xl">🐰 🐸 🐨 🦁 🐯 🦋</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

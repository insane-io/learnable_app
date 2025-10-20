"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Users, GraduationCap, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") as "child" | "parent" | "teacher") || "child"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    pin: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const roleConfig = {
    child: {
      title: "Welcome Back, Student!",
      description: "Enter your PIN to continue learning",
      icon: Heart,
      bgColor: "bg-primary/10",
      redirectPath: "/child/welcome",
    },
    parent: {
      title: "Parent Login",
      description: "Access your child's learning dashboard",
      icon: Users,
      bgColor: "bg-secondary/10",
      redirectPath: "/parent/dashboard",
    },
    teacher: {
      title: "Teacher Login",
      description: "Manage your classroom and students",
      icon: GraduationCap,
      bgColor: "bg-accent/10",
      redirectPath: "/teacher/dashboard",
    },
  }

  const config = roleConfig[role]
  const IconComponent = config.icon

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      router.push(config.redirectPath)
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${config.bgColor}`}>
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 rounded-full bg-card w-fit">
              <IconComponent className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-black">{config.title}</CardTitle>
            <CardDescription className="text-base">{config.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {role === "child" ? (
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-lg font-medium">
                    Your Learning PIN
                  </Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter your 4-digit PIN"
                    value={formData.pin}
                    onChange={(e) => handleInputChange("pin", e.target.value)}
                    className="text-center text-2xl tracking-widest h-14"
                    maxLength={4}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="h-12 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              {role !== "child" && (
                <div className="text-center">
                  <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary underline">
                    Forgot your password?
                  </Link>
                </div>
              )}
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href={`/register?role=${role}`} className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary underline">
            ← Back to role selection
          </Link>
        </div>
      </div>
    </div>
  )
}

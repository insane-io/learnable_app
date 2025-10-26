"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Users, GraduationCap, Eye, EyeOff } from "lucide-react"
import pb from "@/lib/pb"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") as "child" | "parent" | "teacher") || "child"
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pin: "",
    confirmPin: "",
    parentEmail: "",
    schoolName: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const roleConfig = {
    child: {
      title: "Join LearnAble!",
      description: "Create your learning account with help from a parent",
      icon: Heart,
      bgColor: "bg-primary/10",
    },
    parent: {
      title: "Create Parent Account",
      description: "Create an account to track your child's progress",
      icon: Users,
      bgColor: "bg-secondary/10",
    },
    teacher: {
      title: "Create Teacher Account",
      description: "Set up your classroom management account",
      icon: GraduationCap,
      bgColor: "bg-accent/10",
    },
  }

  const config = roleConfig[role]
  const IconComponent = config.icon

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (role === "parent") {
        // Parent registration with PocketBase
        const record = await pb.collection('users').create({
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.password,
          role: 'parent',
        })

        // Auto-login after registration
        await pb.collection('users').authWithPassword(
          formData.email,
          formData.password,
        )

        toast({
          title: "Registration Successful",
          description: "Let's set up your children!",
        })

        setTimeout(() => {
          router.push('/parent/setup')
        }, 1500)
      } else {
        // Simulate registration for child and teacher
        setTimeout(() => {
          setIsLoading(false)
          router.push("/profile-setup")
        }, 2000)
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      let errorMessage = "Unable to create account. Please try again."
      if (error.data?.email) {
        errorMessage = "This email is already registered."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {role !== "parent" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    {role === "child" ? "Your Name" : "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={role === "child" ? "What should we call you?" : "Enter your full name"}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12"
                    required={role !== "parent"}
                    disabled={isLoading}
                  />
                </div>
              )}

              {role === "child" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pin" className="text-base font-medium">
                      Create Your Learning PIN
                    </Label>
                    <Input
                      id="pin"
                      type="password"
                      placeholder="Create a 4-digit PIN"
                      value={formData.pin}
                      onChange={(e) => handleInputChange("pin", e.target.value)}
                      className="text-center text-xl tracking-widest h-12"
                      maxLength={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPin" className="text-base font-medium">
                      Confirm Your PIN
                    </Label>
                    <Input
                      id="confirmPin"
                      type="password"
                      placeholder="Enter your PIN again"
                      value={formData.confirmPin}
                      onChange={(e) => handleInputChange("confirmPin", e.target.value)}
                      className="text-center text-xl tracking-widest h-12"
                      maxLength={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentEmail" className="text-base font-medium">
                      Parent's Email
                    </Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      placeholder="Your parent's email address"
                      value={formData.parentEmail}
                      onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                </>
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
                      disabled={isLoading}
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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="h-12 pr-12"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {role !== "parent" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-base font-medium">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Enter your password again"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="h-12"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  {role === "teacher" && (
                    <div className="space-y-2">
                      <Label htmlFor="schoolName" className="text-base font-medium">
                        School Name
                      </Label>
                      <Input
                        id="schoolName"
                        type="text"
                        placeholder="Enter your school name"
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange("schoolName", e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {role !== "parent" && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    required
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg" 
                disabled={isLoading || (role !== "parent" && !formData.agreeToTerms)}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href={`/login?role=${role}`} className="text-primary hover:underline font-medium">
                  Sign in here
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

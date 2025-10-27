"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Eye, EyeOff } from "lucide-react"
import pb from "@/lib/pb"
import { useToast } from "@/hooks/use-toast"

export default function ParentRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create parent account
      const record = await pb.collection('users').create({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,
        role: 'parent',
      })

      console.log('Registration successful:', record)

      // Auto-login after registration
      await pb.collection('users').authWithPassword(
        formData.email,
        formData.password,
      )

      toast({
        title: "Registration Successful",
        description: "Let's set up your children!",
      })

      // Redirect to setup page
      setTimeout(() => {
        router.push('/parent/setup')
      }, 1500)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 rounded-full bg-card w-fit">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-black">Parent Registration</CardTitle>
            <CardDescription className="text-base">Create an account to track your child's progress</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/parent/login" className="text-primary hover:underline font-medium">
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

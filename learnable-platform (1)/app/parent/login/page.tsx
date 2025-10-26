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

export default function ParentLoginPage() {
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
      // Authenticate with PocketBase
      const authData = await pb.collection('users').authWithPassword(
        formData.email,
        formData.password,
      )

      // After authentication, you can access auth data from authStore
      console.log('Auth successful:', {
        isValid: pb.authStore.isValid,
        token: pb.authStore.token,
        userId: pb.authStore.record?.id,
        userEmail: pb.authStore.record?.email,
        userRole: pb.authStore.record?.role
      })

      // Check if the user is a parent
      if (authData.record.role !== 'parent') {
        pb.authStore.clear() // Logout if not a parent
        toast({
          title: "Access Denied",
          description: "This login is for parents only. Please use the correct login portal.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })

      // Check if parent has already added children
      try {
        const students = await pb.collection('students').getList(1, 1, {
          filter: `parent_id = "${authData.record.id}"`
        })

        // If parent has children, go to dashboard, otherwise go to setup
        if (students.items.length > 0) {
          setTimeout(() => {
            router.push('/parent/dashboard')
          }, 1000)
        } else {
          setTimeout(() => {
            router.push('/parent/setup')
          }, 1000)
        }
      } catch (error) {
        // If there's an error checking students, default to setup page
        console.error('Error checking students:', error)
        setTimeout(() => {
          router.push('/parent/setup')
        }, 1000)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
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
            <CardTitle className="text-3xl font-serif font-black">Parent Login</CardTitle>
            <CardDescription className="text-base">Access your child's learning dashboard</CardDescription>
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
                    placeholder="Enter your password"
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
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary underline">
                  Forgot your password?
                </Link>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/parent/register" className="text-primary hover:underline font-medium">
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

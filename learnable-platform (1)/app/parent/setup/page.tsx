"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, UserPlus, ChevronRight } from "lucide-react"
import pb from "@/lib/pb"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated, hasRole, getCurrentUser } from "@/lib/auth"

export default function ParentSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [step, setStep] = useState(1)
  const [numberOfChildren, setNumberOfChildren] = useState("")
  const [children, setChildren] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated() || !hasRole('parent')) {
      router.push('/parent/login')
      return
    }
  }, [router])

  const handleNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(numberOfChildren)
    
    if (num < 1 || num > 10) {
      toast({
        title: "Invalid Number",
        description: "Please enter a number between 1 and 10.",
        variant: "destructive",
      })
      return
    }

    setChildren(new Array(num).fill(""))
    setStep(2)
  }

  const handleChildNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if all children have names
    const emptyFields = children.filter(name => !name.trim())
    if (emptyFields.length > 0) {
      toast({
        title: "Names Required",
        description: "Please enter all children's names.",
        variant: "destructive",
      })
      return
    }

    // Save all children
    saveChildren(children)
  }

  const handleChildChange = (index: number, value: string) => {
    const updatedChildren = [...children]
    updatedChildren[index] = value
    setChildren(updatedChildren)
  }

  const saveChildren = async (childrenNames: string[]) => {
    setIsLoading(true)
    
    try {
      const user = getCurrentUser()
      const parentId = user?.id // Get parent's ID from auth
      
      if (!parentId) {
        throw new Error('Parent ID not found')
      }

      console.log('Creating students for parent:', parentId)

      // Create a student record for each child in the 'students' collection
      const createdStudents = []
      
      for (let index = 0; index < childrenNames.length; index++) {
        const studentData = {
          parent_id: parentId, // Link to parent's user ID
          student_name: childrenNames[index],
          test_data: JSON.stringify({
            index: index + 1,
            created_at: new Date().toISOString(),
          }),
        }

        const record = await pb.collection('students').create(studentData)
        createdStudents.push(record)
        console.log(`Created student ${index + 1}:`, record)
      }

      toast({
        title: "Setup Complete!",
        description: `Successfully added ${childrenNames.length} ${childrenNames.length === 1 ? 'child' : 'children'}.`,
      })

      // Redirect to parent dashboard
      setTimeout(() => {
        router.push('/parent/dashboard')
      }, 1500)
    } catch (error: any) {
      console.error('Save children error:', error)
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save children data. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 rounded-full bg-card w-fit">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-black">
              {step === 1 ? "Setup Your Account" : "Add Your Children"}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 1 
                ? "How many children do you want to track?" 
                : "Enter all your children's names"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleNumberSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="numberOfChildren" className="text-base font-medium">
                    Number of Children
                  </Label>
                  <Input
                    id="numberOfChildren"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Enter number (1-10)"
                    value={numberOfChildren}
                    onChange={(e) => setNumberOfChildren(e.target.value)}
                    className="h-12 text-center text-2xl"
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg">
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleChildNameSubmit} className="space-y-6">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {children.map((childName, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`child-${index}`} className="text-base font-medium">
                        Child {index + 1} Name
                      </Label>
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id={`child-${index}`}
                          type="text"
                          placeholder={`Enter child ${index + 1}'s name`}
                          value={childName}
                          onChange={(e) => handleChildChange(index, e.target.value)}
                          className="h-12 pl-11"
                          required
                          autoFocus={index === 0}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => {
                      setStep(1)
                      setChildren([])
                      setNumberOfChildren("")
                    }}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 text-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save & Finish"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

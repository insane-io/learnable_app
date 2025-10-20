"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Brain, Heart, Users } from "lucide-react"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    learningStyle: "",
    interests: [] as string[],
    supportNeeds: [] as string[],
    avatar: "",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const learningStyles = [
    { id: "visual", label: "Visual Learner", description: "I learn best with pictures and colors" },
    { id: "auditory", label: "Audio Learner", description: "I learn best by listening" },
    { id: "kinesthetic", label: "Hands-on Learner", description: "I learn best by doing and moving" },
    { id: "reading", label: "Reading Learner", description: "I learn best by reading and writing" },
  ]

  const interests = [
    "Math & Numbers",
    "Reading & Stories",
    "Science & Nature",
    "Art & Drawing",
    "Music & Songs",
    "Sports & Movement",
    "Animals",
    "Technology",
    "Cooking",
    "Building & Creating",
  ]

  const supportNeeds = [
    "Focus and Attention (ADHD)",
    "Reading Support (Dyslexia)",
    "Social Skills (Autism)",
    "Step-by-step Learning (Down Syndrome)",
    "Memory Support",
    "Emotional Regulation",
    "Communication Support",
  ]

  const avatars = [
    { id: "bear", emoji: "🐻", name: "Friendly Bear" },
    { id: "cat", emoji: "🐱", name: "Curious Cat" },
    { id: "robot", emoji: "🤖", name: "Smart Robot" },
    { id: "star", emoji: "⭐", name: "Bright Star" },
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Simulate profile creation
    setTimeout(() => {
      setIsLoading(false)
      router.push("/child/welcome")
    }, 2000)
  }

  const handleInterestToggle = (interest: string) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSupportToggle = (support: string) => {
    setProfileData((prev) => ({
      ...prev,
      supportNeeds: prev.supportNeeds.includes(support)
        ? prev.supportNeeds.filter((s) => s !== support)
        : [...prev.supportNeeds, support],
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black mb-2">How do you learn best?</h2>
              <p className="text-muted-foreground">Choose the way you like to learn new things</p>
            </div>

            <RadioGroup
              value={profileData.learningStyle}
              onValueChange={(value) => setProfileData((prev) => ({ ...prev, learningStyle: value }))}
              className="space-y-4"
            >
              {learningStyles.map((style) => (
                <div key={style.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card">
                  <RadioGroupItem value={style.id} id={style.id} />
                  <div className="flex-1">
                    <Label htmlFor={style.id} className="font-medium cursor-pointer">
                      {style.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black mb-2">What do you love?</h2>
              <p className="text-muted-foreground">
                Pick the things you're interested in (choose as many as you like!)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-card">
                  <Checkbox
                    id={interest}
                    checked={profileData.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="text-sm cursor-pointer">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black mb-2">How can we help you?</h2>
              <p className="text-muted-foreground">Let us know what kind of support would help you learn better</p>
            </div>

            <div className="space-y-3">
              {supportNeeds.map((support) => (
                <div key={support} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card">
                  <Checkbox
                    id={support}
                    checked={profileData.supportNeeds.includes(support)}
                    onCheckedChange={() => handleSupportToggle(support)}
                  />
                  <Label htmlFor={support} className="cursor-pointer">
                    {support}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black mb-2">Choose your learning buddy!</h2>
              <p className="text-muted-foreground">Pick an avatar that will help you on your learning journey</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`p-6 border-2 rounded-lg cursor-pointer text-center transition-all ${
                    profileData.avatar === avatar.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setProfileData((prev) => ({ ...prev, avatar: avatar.id }))}
                >
                  <div className="text-4xl mb-2">{avatar.emoji}</div>
                  <p className="font-medium">{avatar.name}</p>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-serif font-black">Let's Set Up Your Profile!</CardTitle>
            <CardDescription className="text-base">
              Step {currentStep} of {totalSteps}
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>

          <CardContent className="pb-8">
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !profileData.learningStyle) ||
                  (currentStep === 4 && !profileData.avatar) ||
                  isLoading
                }
              >
                {currentStep === totalSteps ? (isLoading ? "Creating Profile..." : "Complete Setup") : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

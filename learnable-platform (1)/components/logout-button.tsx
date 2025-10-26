"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LogoutButton() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    
    router.push('/parent/login')
  }

  return (
    <Button onClick={handleLogout} variant="outline" size="sm">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}

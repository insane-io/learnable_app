"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, User, Settings, LogOut } from "lucide-react"
import { logout } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface NavigationProps {
  role: "child" | "parent" | "teacher"
}

export function Navigation({ role }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    
    // Redirect based on role
    const loginPath = role === 'parent' ? '/parent/login' : role === 'teacher' ? '/teacher/login' : '/login'
    router.push(loginPath)
  }

  const getNavigationItems = () => {
    switch (role) {
      case "child":
        return [
          { href: "/child/dashboard", label: "My Dashboard", icon: Home },
          { href: "/child/activities", label: "Activities", icon: User },
          { href: "/child/progress", label: "My Progress", icon: User },
        ]
      case "parent":
        return [
          { href: "/parent/dashboard", label: "Dashboard", icon: Home },
          // { href: "/parent/communication", label: "Messages", icon: User },
          // { href: "/settings", label: "Settings", icon: Settings },
        ]
      case "teacher":
        return [
          { href: "/teacher/dashboard", label: "Dashboard", icon: Home },
          { href: "/teacher/communication", label: "Messages", icon: User },
          { href: "/settings", label: "Settings", icon: Settings },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-serif font-black text-primary hover:opacity-80 transition-opacity"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-26%20at%2016.04.03_aac6e32a.jpg-AsSYohiLLAeE4J9GRwsmjJaF1rxOyW.jpeg"
            alt="LearnAble Owl Logo"
            className="w-12 h-12 object-contain bg-transparent"
          />
          LearnAble
        </Link>

        <div className="flex items-center gap-4">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                asChild
                className="flex items-center gap-2"
              >
                <Link href={item.href}>
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}

          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

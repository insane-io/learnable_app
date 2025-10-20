"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface NavItem {
  path: string
  animal: string
  label: string
  description: string
}

export function AnimalNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      path: "/child/welcome",
      animal: "🏠",
      label: "Home",
      description: "My Home",
    },
    {
      path: "/child/games",
      animal: "🎮",
      label: "Games",
      description: "Play & Learn",
    },
    {
      path: "/child/stories",
      animal: "📚",
      label: "Stories",
      description: "Story Time",
    },
    {
      path: "/child/art",
      animal: "🎨",
      label: "Art",
      description: "Create Art",
    },
    {
      path: "/child/music",
      animal: "🎵",
      label: "Music",
      description: "Sing Along",
    },
    {
      path: "/child/profile",
      animal: "⭐",
      label: "Me",
      description: "My Profile",
    },
  ]

  return (
    <nav className="bg-card border-t-4 border-primary p-4">
      <div className="flex justify-center gap-2 max-w-4xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={`flex flex-col items-center p-4 h-auto min-w-[80px] rounded-xl ${
                isActive ? "bg-primary text-primary-foreground shadow-lg scale-105" : "hover:bg-muted hover:scale-105"
              } transition-all duration-200`}
              onClick={() => router.push(item.path)}
            >
              <div className="text-3xl mb-1">{item.animal}</div>
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}

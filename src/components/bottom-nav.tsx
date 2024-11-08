"use client"

import { useState } from 'react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ImagePlus, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from '@/hooks/useAuth'

const routes = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "#",
    label: "Upload",
    icon: ImagePlus,
    sheet: true,
  },
  {
    href: "/likes",
    label: "Likes",
    icon: Heart,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { requireAuth } = useAuth()

  const handleUploadSuccess = () => {
    setSheetOpen(false)
    window.location.reload()
  }

  const handleUploadClick = () => {
    requireAuth(() => setSheetOpen(true))
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur border-t">
      <div className="container h-full">
        <div className="grid h-full grid-cols-4 items-center justify-items-center">
          {routes.map((route) => (
            <div key={route.label}>
              {route.sheet ? (
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12"
                      onClick={handleUploadClick}
                    >
                      <route.icon className="h-6 w-6" />
                      <span className="sr-only">{route.label}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[90vh]">
                    <SheetHeader>
                      <SheetTitle>Upload Image</SheetTitle>
                      <SheetDescription>
                        Upload a new image to your carousel. Images will appear after upload.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <ImageUpload onSuccess={handleUploadSuccess} />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Link href={route.href}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-12 w-12",
                      pathname === route.href && "bg-accent"
                    )}
                  >
                    <route.icon className="h-6 w-6" />
                    <span className="sr-only">{route.label}</span>
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}

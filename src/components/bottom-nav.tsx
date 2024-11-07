"use client"

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

const routes = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
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
  const handleUploadSuccess = () => {
    window.location.reload()
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur border-t">
      <div className="container h-full">
        <div className="grid h-full grid-cols-4 items-center justify-items-center">
          {routes.map((route) => (
            <div key={route.label}>
              {route.sheet ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-12 w-12">
                      <route.icon className="h-6 w-6" />
                      <span className="sr-only">{route.label}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[90vh]">
                    <SheetHeader>
                      <SheetTitle>Add New Image</SheetTitle>
                      <SheetDescription>
                        Upload a new image to your carousel.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <ImageUpload onSuccess={handleUploadSuccess} />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-12 w-12",
                    route.href === window.location.pathname && "bg-accent"
                  )}
                  asChild
                >
                  <a href={route.href}>
                    <route.icon className="h-6 w-6" />
                    <span className="sr-only">{route.label}</span>
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}

"use client"

import { Menu, Home, User, FolderGit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const routes = [
  {
    href: "/",
    label: "Home",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    href: "/about",
    label: "About",
    icon: <User className="h-4 w-4 mr-2" />,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: <FolderGit2 className="h-4 w-4 mr-2" />,
  },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                {routes.map((route) => (
                  <a
                    key={route.href}
                    href={route.href}
                    className="text-sm font-medium transition-colors"
                  >
                    {route.icon}
                    {route.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <nav className="hidden md:flex items-center space-x-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                size="default"
                className="text-sm font-medium transition-colors"
                asChild
              >
                <a href={route.href}>
                  {route.icon}
                  {route.label}
                </a>
              </Button>
            ))}
          </nav>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}

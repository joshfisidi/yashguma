"use client"

import { Menu, Home, User, FolderGit2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ImageUpload } from "@/components/image-upload"
import { useState } from "react"

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
  {
    label: "Add Image",
    icon: <ImagePlus className="h-4 w-4 mr-2" />,
    sheet: true,
  }
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  
  const handleUploadSuccess = () => {
    setOpen(false)
    window.location.reload()
  }

  return (
    <header className="sm:flex sm:justify-between py-3 px-4 border-b">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="h-[90vh] overflow-y-auto"
              onPointerDownOutside={() => setOpen(false)}
            >
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                {routes.map((route) => (
                  <div key={route.label}>
                    {route.sheet ? (
                      <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start">
                            {route.icon}
                            {route.label}
                          </Button>
                        </SheetTrigger>
                        <SheetContent 
                          side="top" 
                          className="h-[90vh] overflow-y-auto"
                          onPointerDownOutside={() => setOpen(false)}
                        >
                          <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
                            <SheetTitle>Add New Image</SheetTitle>
                            <SheetDescription>
                              Upload a new image to your carousel. Images will appear in the carousel after upload.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="pb-20 pt-4">
                            <ImageUpload onSuccess={handleUploadSuccess} />
                          </div>
                        </SheetContent>
                      </Sheet>
                    ) : (
                      <Button variant="ghost" className="w-full justify-start">
                        {route.icon}
                        {route.label}
                      </Button>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-4 md:ml-0">
            <h1 className="text-xl font-bold">Logo</h1>
          </div>
        </div>

        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
          {routes.map((route) => (
            <div key={route.label} className="inline-block">
              {route.sheet ? (
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost">
                      {route.icon}
                      {route.label}
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="top" 
                    className="h-[90vh] overflow-y-auto"
                    onPointerDownOutside={() => setOpen(false)}
                  >
                    <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
                      <SheetTitle>Add New Image</SheetTitle>
                      <SheetDescription>
                        Upload a new image to your carousel. Images will appear in the carousel after upload.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="pb-20 pt-4">
                      <ImageUpload onSuccess={handleUploadSuccess} />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button variant="ghost">
                  {route.icon}
                  {route.label}
                </Button>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

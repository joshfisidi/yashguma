"use client"

import { type FC } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

const ProfilePage: FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header Section with Profile Image and Follow Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 p-1 bg-muted rounded-full">
            <Avatar className="w-full h-full">
              <AvatarImage 
                src="https://hpxbyjpeqohdwxedties.supabase.co/storage/v1/object/public/placeholders/mumuthebull.png" 
                alt="@josh" 
              />
              <AvatarFallback className="text-xl sm:text-2xl">J</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm">
              Follow
            </Button>
            <Button variant="outline" size="sm">
              Following
            </Button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <Alert className="mb-8 bg-muted border-none">
        <AlertDescription>
          I am the biggest bully in town
        </AlertDescription>
      </Alert>

      {/* Center Image Placeholder */}
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
        <div className="w-full max-w-2xl">
          <Carousel 
            orientation="vertical" 
            className="w-full"
            opts={{
              align: "start",
              axis: "y",
              dragFree: false,
              loop: true,
            }}
          >
            <CarouselContent className="-mt-4 h-[60vh]">
              {[1, 2, 3].map((_, index) => (
                <CarouselItem key={index} className="pt-4">
                  <div className="p-1">
                    <div className="relative flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-white">
                      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 rotate-90">
              <CarouselPrevious />
            </div>
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-90">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

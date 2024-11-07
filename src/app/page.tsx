"use client"

import { type FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Heart, Italic, Underline } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useCarouselItems } from '@/hooks/useCarouselItems'
import { ImageUpload } from '@/components/image-upload'

const Home: FC = () => {
  const { items, loading, fetchItems } = useCarouselItems()
  const [open, setOpen] = useState(false)

  const handleUploadSuccess = () => {
    setOpen(false)
    fetchItems()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Add New Image</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Add New Image</SheetTitle>
            <SheetDescription>
              Upload a new image to your carousel. Images will appear in the carousel after upload.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ImageUpload onSuccess={handleUploadSuccess} />
          </div>
        </SheetContent>
      </Sheet>

      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <div className="p-1">
                <div className="relative flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-white">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="object-cover w-full h-full rounded-md"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-white/50 hover:bg-white/75"
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="ml-1">{item.likes}</span>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="max-w-2xl mx-auto px-4">
        <Textarea 
          placeholder="Add a comment about this image..." 
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
}

export default Home;

"use client"

import { type FC, useState, useEffect } from 'react';
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
import { Bold, Heart, Italic, Underline, MessageCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useCarouselItems } from '@/hooks/useCarouselItems'
import { ImageUpload } from '@/components/image-upload'
import { CarouselControls } from '@/components/carousel-controls'
import { type CarouselApi } from "@/components/ui/carousel"
import { CommentPanel } from '@/components/comment-panel'

const Home: FC = () => {
  const { items, loading, fetchItems, handleLike, handleComment } = useCarouselItems()
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    if (!api) return
    
    api.on('select', () => {
      const newIndex = api.selectedScrollSnap()
      setCurrentIndex(newIndex)
      setComment("")
    })
  }, [api])

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
        <SheetContent side="top" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
            <SheetTitle>Add New Image</SheetTitle>
            <SheetDescription>
              Upload a new image to your carousel. Images will appear in the carousel after upload.
            </SheetDescription>
          </SheetHeader>
          <div className="pb-20">
            <ImageUpload onSuccess={handleUploadSuccess} />
          </div>
        </SheetContent>
      </Sheet>

      <Carousel className="w-full max-w-xs" setApi={setApi}>
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
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <CarouselControls 
        items={items}
        currentIndex={currentIndex}
        onLike={handleLike}
        onCommentToggle={() => setShowComments(!showComments)}
        showComments={showComments}
      />

      {showComments && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowComments(false)}
        >
          <div 
            className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
            onClick={e => e.stopPropagation()}
          >
            <CommentPanel
              comments={items[currentIndex]?.comments || []}
              comment={comment}
              onCommentChange={setComment}
              onCommentSubmit={() => {
                if (comment.trim()) {
                  handleComment(items[currentIndex].id, comment)
                  setComment("")
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

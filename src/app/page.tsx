"use client"

import { type FC, useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useCarouselItems } from '@/hooks/useCarouselItems'
import { CarouselControls } from '@/components/carousel-controls'
import { type CarouselApi } from "@/components/ui/carousel"
import { CommentPanel } from '@/components/comment-panel'

const Home: FC = () => {
  const { items, loading, fetchItems, handleLike, handleComment } = useCarouselItems()
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-16">
      <div className="relative w-full max-w-xs mx-auto">
        <Carousel className="w-full" setApi={setApi}>
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
          <div className="absolute -left-12 top-1/2 -translate-y-1/2">
            <CarouselPrevious />
          </div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2">
            <CarouselNext />
          </div>
        </Carousel>
      </div>

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
  )
}

export default Home

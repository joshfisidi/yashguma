"use client"

import { FC } from 'react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Heart, MessageCircle } from "lucide-react"
import { CarouselItem } from '@/types/database.types'
import { useLikedItems } from '@/hooks/useLikedItems'
import { useAuth } from '@/hooks/useAuth'
import { cn } from "@/lib/utils"

interface CarouselControlsProps {
  items: CarouselItem[]
  currentIndex: number
  onLike: (itemId: string) => void
  onCommentToggle: () => void
  showComments: boolean
}

export const CarouselControls: FC<CarouselControlsProps> = ({ 
  items, 
  currentIndex,
  onLike,
  onCommentToggle,
  showComments
}) => {
  const currentItem = items[currentIndex]
  const { hasLiked, addLikedItem } = useLikedItems()
  const { requireAuth } = useAuth()

  const handleLike = (id: string) => {
    requireAuth(() => {
      if (hasLiked(id)) return
      onLike(id)
      addLikedItem(id)
    })
  }

  const handleCommentToggle = () => {
    requireAuth(onCommentToggle)
  }

  return (
    <div className="flex justify-center">
      <ToggleGroup type="multiple" className="justify-center">
        <ToggleGroupItem 
          value="like" 
          aria-label="Like"
          onClick={() => handleLike(currentItem.id)}
          disabled={hasLiked(currentItem.id)}
          className={hasLiked(currentItem.id) ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Heart className={`h-4 w-4 ${hasLiked(currentItem.id) ? "fill-current text-red-500" : "text-gray-500"}`} />
          <span className="ml-1">{currentItem.likes}</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="comments" 
          aria-label="Comments"
          onClick={handleCommentToggle}
          className={cn(showComments && "bg-accent text-accent-foreground")}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="ml-1">{currentItem.comments?.length || 0}</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

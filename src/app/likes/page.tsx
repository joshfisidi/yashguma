"use client"

import { FC } from 'react'
import { Heart } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCarouselItems } from '@/hooks/useCarouselItems'
import { useLikedItems } from '@/hooks/useLikedItems'

const LikesPage: FC = () => {
  const { items, loading } = useCarouselItems()
  const { likedItems } = useLikedItems()

  // Filter items to show only liked ones
  const likedContent = items.filter(item => likedItems.includes(item.id))

  if (loading) {
    return <p className="text-center">Loading...</p>
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-destructive" />
        <h1 className="text-4xl font-bold">Liked Items</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Likes</CardTitle>
          <CardDescription>
            Items you've liked will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full pr-4">
            <div className="space-y-6">
              {likedContent.length > 0 ? (
                likedContent.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover rounded-md w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4 fill-current text-destructive" />
                        <span>{item.likes} likes</span>
                        <span>•</span>
                        <span>{item.comments?.length || 0} comments</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  You haven't liked any items yet.
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default LikesPage

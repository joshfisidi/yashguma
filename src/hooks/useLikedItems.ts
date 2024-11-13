"use client"

import { useState, useEffect } from 'react'

export function useLikedItems() {
  const [likedItems, setLikedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Load liked items from localStorage
    const storedLikes = localStorage.getItem('likedItems')
    if (storedLikes) {
      setLikedItems(JSON.parse(storedLikes))
    }
    setLoading(false)
  }, [])

  const hasLiked = (itemId: string) => likedItems.includes(itemId)

  const addLikedItem = (itemId: string) => {
    setLikedItems(prev => {
      const updated = [...prev, itemId]
      localStorage.setItem('likedItems', JSON.stringify(updated))
      return updated
    })
  }

  return { likedItems, loading, hasLiked, addLikedItem }
}

import { useState, useEffect } from 'react'

export function useLikedItems() {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load liked items from localStorage on mount
    const saved = localStorage.getItem('likedItems')
    if (saved) {
      setLikedItems(new Set(JSON.parse(saved)))
    }
  }, [])

  const addLikedItem = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev).add(id)
      localStorage.setItem('likedItems', JSON.stringify([...newSet]))
      return newSet
    })
  }

  const hasLiked = (id: string) => likedItems.has(id)

  return { addLikedItem, hasLiked }
}

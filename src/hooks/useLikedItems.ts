"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/useAuth'

export function useLikedItems() {
  const [likedItems, setLikedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { session } = useAuth()

  useEffect(() => {
    let mounted = true
    const fetchLikedItems = async () => {
      if (!mounted || !session) return
      try {
        const { data, error } = await supabase
          .from('user_likes')
          .select('item_id')
          .eq('user_id', session.user.id)
        
        if (error) throw error
        
        const likedIds = data.map(like => like.item_id)
        setLikedItems(likedIds)
        localStorage.setItem('likedItems', JSON.stringify(likedIds))
      } catch (error) {
        console.error('Error fetching liked items:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchLikedItems()
    return () => { mounted = false }
  }, [supabase, session])

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

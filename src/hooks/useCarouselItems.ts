"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CarouselItem } from '@/types/database.types'

export function useCarouselItems() {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_items')
        .select(`
          *,
          comments:carousel_item_comments(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching carousel items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id: string) => {
    try {
      const item = items.find(item => item.id === id)
      if (!item) return

      const { error } = await supabase.rpc('increment_likes', { item_id: id })
      
      if (error) throw error

      setItems(items.map(item => 
        item.id === id 
          ? { ...item, likes: item.likes + 1 }
          : item
      ))
    } catch (error) {
      console.error('Error liking item:', error)
    }
  }

  const handleComment = async (id: string, content: string) => {
    try {
      const { error } = await supabase
        .from('carousel_item_comments')
        .insert({ item_id: id, content })

      if (error) throw error

      // Refetch to get updated comments
      await fetchItems()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return { items, loading, fetchItems, handleLike, handleComment }
}

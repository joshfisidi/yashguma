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
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching carousel items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return { items, loading, fetchItems }
}

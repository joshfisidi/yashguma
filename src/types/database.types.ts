export type CarouselComment = {
  id: string
  item_id: string
  content: string
  created_at: string
}

export type CarouselItem = {
  id: string
  imageUrl: string
  likes: number
  title: string
  description?: string
  created_at: string
  comments?: CarouselComment[]
}

export type Database = {
  public: {
    tables: {
      carousel_items: {
        Row: CarouselItem
        Insert: Omit<CarouselItem, 'created_at'>
        Update: Partial<Omit<CarouselItem, 'created_at'>>
      }
    }
  }
}

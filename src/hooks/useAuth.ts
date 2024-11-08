"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname } from 'next/navigation'

export function useAuth() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const supabase = createClientComponentClient()
  const pathname = usePathname()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    getSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const requireAuth = (action: () => void) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }
    action()
  }

  return { session, loading, requireAuth, showLoginDialog, setShowLoginDialog }
} 
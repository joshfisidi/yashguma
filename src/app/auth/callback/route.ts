import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { upsertUser } from '@/lib/auth-helpers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') ?? '/'

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) throw error
      
      if (session?.user) {
        await upsertUser(session.user)
        return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        new URL(`/auth/error?message=${encodeURIComponent('Authentication failed')}`, requestUrl.origin)
      )
    }
  }

  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}

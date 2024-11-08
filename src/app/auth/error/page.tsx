"use client"

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('message') || 'Authentication failed'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

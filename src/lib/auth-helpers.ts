import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function upsertUser(user: any) {
  const supabase = createClientComponentClient()
  
  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.user_name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting user:', error)
    throw error
  }
}

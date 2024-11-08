import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Github } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
}

export function LoginDialog({ open, onOpenChange, redirectTo = '/' }: LoginDialogProps) {
  const supabase = createClientComponentClient()

  const handleGithubSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
          scopes: 'read:user user:email'
        }
      })
    } catch (error) {
      console.error('Error signing in with Github:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in to continue to your account
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={handleGithubSignIn}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with Github
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
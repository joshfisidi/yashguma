import { type FC } from 'react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CommentPanelProps {
  comments: {
    id: string
    content: string
    created_at: string
  }[]
  comment: string
  onCommentChange: (value: string) => void
  onCommentSubmit: () => void
}

export const CommentPanel: FC<CommentPanelProps> = ({
  comments,
  comment,
  onCommentChange,
  onCommentSubmit
}) => {
  return (
    <div className="w-full max-w-md space-y-4 bg-background rounded-lg shadow-lg border p-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments</h3>
      </div>

      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <p className="text-sm">{comment.content}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="space-y-2">
        <Textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px]"
        />
        
        <div className="flex items-center justify-between">
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button 
            onClick={onCommentSubmit}
            disabled={!comment.trim()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

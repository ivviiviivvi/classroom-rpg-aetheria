import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Quest, Theme, THEME_CONFIGS } from '@/lib/types'
import { PaperPlaneRight, Sparkle } from '@phosphor-icons/react'
import { LoadingOracle } from '@/components/LoadingOracle'
import { toast } from 'sonner'

interface QuestDialogProps {
  quest: Quest | null
  theme: Theme
  open: boolean
  onClose: () => void
  onSubmit: (questId: string, content: string) => Promise<void>
}

export function QuestDialog({ quest, theme, open, onClose, onSubmit }: QuestDialogProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!quest) return null

  const themeConfig = THEME_CONFIGS[theme]

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please enter your submission')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(quest.id, content)
      setContent('')
      toast.success('Submission sent to the ' + themeConfig.oracleLabel)
    } catch (error) {
      toast.error('Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Sparkle size={32} weight="fill" className="text-accent" />
            <div>
              <DialogTitle className="text-2xl">{quest.name}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {quest.type === 'boss' ? 'Boss Battle' : quest.type === 'redemption' ? 'Redemption Quest' : 'Standard Quest'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Quest Briefing</h4>
            <div className="glass-panel p-4 bg-muted/20">
              <p className="text-foreground/90 leading-relaxed">{quest.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Reward: {quest.xpValue} {themeConfig.xpLabel}
            </Badge>
            {quest.dueDate && (
              <span className="text-sm text-muted-foreground">
                Due: {new Date(quest.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Your Response</h4>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your submission here..."
              className="min-h-[200px] resize-none glass-panel text-base"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {content.length} characters
            </p>
          </div>

          {isSubmitting && (
            <LoadingOracle theme={theme} />
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="flex-1 gap-2"
              size="lg"
            >
              <PaperPlaneRight size={20} weight="fill" />
              Submit to {themeConfig.oracleLabel}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Quest, QuestType, Theme, Realm } from '@/lib/types'
import { Plus, Sparkle, FloppyDisk } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { generateId } from '@/lib/game-utils'
import { sanitizeLLMInput } from '@/lib/utils'

interface QuestCreatorProps {
  open: boolean
  theme: Theme
  realmId: string
  realm?: Realm
  onClose: () => void
  onCreate: (quest: Quest) => void
}

export function QuestCreator({ open, theme, realmId, realm, onClose, onCreate }: QuestCreatorProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [questType, setQuestType] = useState<QuestType>('standard')
  const [xpValue, setXpValue] = useState(100)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a quest name first')
      return
    }

    setIsGenerating(true)
    try {
      const sanitizedName = sanitizeLLMInput(name)
      const contextPart = realm ? ` in the realm "${realm.name}" (${realm.description})` : ''
      const promptText = `You are helping a teacher create an assignment/quest in a gamified education system with a ${theme} theme${contextPart}.

The teacher wants to create a ${questType} quest called:
<quest_name>
${sanitizedName}
</quest_name>

Generate a compelling assignment description that:
1. Matches the ${theme} theme aesthetic (use appropriate vocabulary and tone)
2. Clearly explains what the student must do
3. Makes the task sound engaging and achievable
4. Is 3-4 sentences long

Return only the description text, no quotes or extra formatting.`

      const generatedDescription = await window.spark.llm(promptText, 'gpt-4o-mini')
      setDescription(generatedDescription.trim())
      toast.success('Description generated!')
    } catch (error) {
      toast.error('Failed to generate description')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a quest name')
      return
    }
    if (!description.trim()) {
      toast.error('Please enter a description')
      return
    }
    if (xpValue < 10 || xpValue > 1000) {
      toast.error('XP value must be between 10 and 1000')
      return
    }

    const newQuest: Quest = {
      id: generateId(),
      realmId,
      name: name.trim(),
      description: description.trim(),
      type: questType,
      xpValue,
      status: 'available',
      createdAt: Date.now()
    }

    onCreate(newQuest)
    setName('')
    setDescription('')
    setQuestType('standard')
    setXpValue(100)
    toast.success('Quest created!')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Plus size={28} weight="bold" />
            Create New Quest
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="quest-name">Quest Name</Label>
            <Input
              id="quest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Pythagorean Challenge"
              className="glass-panel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quest-type">Quest Type</Label>
              <Select value={questType} onValueChange={(value) => setQuestType(value as QuestType)}>
                <SelectTrigger id="quest-type" className="glass-panel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Quest</SelectItem>
                  <SelectItem value="boss">Boss Battle (Hard)</SelectItem>
                  <SelectItem value="redemption">Redemption Quest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quest-xp">XP Reward</Label>
              <Input
                id="quest-xp"
                type="number"
                min={10}
                max={1000}
                step={10}
                value={xpValue}
                onChange={(e) => setXpValue(parseInt(e.target.value) || 100)}
                className="glass-panel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="quest-description">Description</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating || !name.trim()}
                className="gap-2"
              >
                <Sparkle size={16} weight="fill" />
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </Button>
            </div>
            <Textarea
              id="quest-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what students need to do for this quest..."
              className="glass-panel min-h-[150px] resize-none"
              disabled={isGenerating}
            />
          </div>

          {questType === 'boss' && (
            <div className="glass-panel p-4 bg-destructive/10 border-2 border-destructive">
              <p className="text-sm text-destructive-foreground">
                <strong>Boss Battle:</strong> This quest is marked as extra challenging. Students will know this is a difficult assignment.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleCreate} className="flex-1 gap-2" size="lg">
              <FloppyDisk size={20} weight="fill" />
              Create Quest
            </Button>
            <Button onClick={onClose} variant="outline" size="lg">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

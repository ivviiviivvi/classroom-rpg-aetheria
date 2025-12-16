import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Upload,
  FileText,
  ChatCircleText,
  Lightbulb,
  Plus,
  Trash,
  Flask
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import {
  Theme,
  IngestedArtifact,
  IngestedArtifactType,
  THEME_CONFIGS
} from '@/lib/types'
import { generateId } from '@/lib/game-utils'

interface IngestionZoneProps {
  theme: Theme
}

export function IngestionZone({ theme }: IngestionZoneProps) {
  const [artifacts, setArtifacts] = useKV<IngestedArtifact[]>('aetheria-ingested-artifacts', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<IngestedArtifactType>('report')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const themeConfig = THEME_CONFIGS[theme]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, we would upload this. Here we simulate reading text content.
      // For binary files, we might just store the name and a placeholder.
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setContent(text)
        if (!title) setTitle(file.name)
      }
      reader.readAsText(file)
      toast.success(`File ${file.name} selected`)
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please provide a title and content')
      return
    }

    const newArtifact: IngestedArtifact = {
      id: generateId(),
      type: uploadType,
      title: title.trim(),
      content: content,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: Date.now()
    }

    setArtifacts((current) => [newArtifact, ...(current || [])])
    toast.success('Artifact ingested successfully')
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setArtifacts((current) => (current || []).filter(a => a.id !== id))
    toast.success('Artifact removed')
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setTags('')
    setUploadType('report')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getIconForType = (type: IngestedArtifactType) => {
    switch (type) {
      case 'report': return FileText
      case 'chat': return ChatCircleText
      case 'prototype': return Lightbulb
      default: return FileText
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flask size={32} weight="fill" className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{themeConfig.ingestionLabel}</h1>
            <p className="text-muted-foreground">Upload reports, chat threads, and prototype iterations</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus size={20} weight="bold" />
          Ingest Artifact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(!artifacts || artifacts.length === 0) ? (
          <div className="col-span-full glass-panel p-12 text-center">
            <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No artifacts ingested yet</p>
            <p className="text-sm text-muted-foreground">
              Upload your research, AI chats, and prototypes to begin analysis
            </p>
          </div>
        ) : (
          artifacts.map((artifact) => {
            const Icon = getIconForType(artifact.type)
            return (
              <Card key={artifact.id} className="glass-panel p-4 flex flex-col gap-3 relative group hover:border-accent transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Icon size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-bold truncate max-w-[150px]">{artifact.title}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{artifact.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(artifact.id)}
                  >
                    <Trash size={18} />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 bg-muted/20 p-2 rounded-md font-mono">
                  {artifact.content}
                </p>

                <div className="flex flex-wrap gap-1 mt-auto">
                  {artifact.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground text-right mt-2">
                  {new Date(artifact.createdAt).toLocaleDateString()}
                </div>
              </Card>
            )
          })
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-panel max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ingest New Artifact</DialogTitle>
            <DialogDescription>
              Add research reports, AI conversations, or prototype details.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="report" onValueChange={(v) => setUploadType(v as IngestedArtifactType)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="report">Research Report</TabsTrigger>
              <TabsTrigger value="chat">AI Chat Thread</TabsTrigger>
              <TabsTrigger value="prototype">Prototype</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Q1 Research Summary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <TabsContent value="report" className="mt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                      accept=".txt,.md,.json,.csv"
                    />
                  </div>
                  <Textarea
                    id="content-report"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Or paste content here..."
                    className="min-h-[200px] font-mono text-xs"
                  />
                </TabsContent>

                <TabsContent value="chat" className="mt-0">
                  <Textarea
                    id="content-chat"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the conversation log here..."
                    className="min-h-[200px] font-mono text-xs"
                  />
                </TabsContent>

                <TabsContent value="prototype" className="mt-0">
                  <Textarea
                    id="content-proto"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe the prototype version, changes, or paste code snippets..."
                    className="min-h-[200px] font-mono text-xs"
                  />
                </TabsContent>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., v1.0, failing, performance"
                />
              </div>
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Ingest Artifact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Quest, QuestType, THEME_CONFIGS, Theme } from '@/lib/types'
import { Sword, Skull, ArrowBendUpLeft, Lock, CheckCircle, XCircle } from '@phosphor-icons/react'
import { formatTimeAgo } from '@/lib/game-utils'

interface QuestCardProps {
  quest: Quest
  theme: Theme
  onClick: () => void
  isLocked?: boolean
}

export function QuestCard({ quest, theme, onClick, isLocked }: QuestCardProps) {
  const themeConfig = THEME_CONFIGS[theme]
  
  const getQuestIcon = () => {
    if (quest.type === 'boss') return <Skull size={24} weight="fill" />
    if (quest.type === 'redemption') return <ArrowBendUpLeft size={24} />
    return <Sword size={24} />
  }

  const getStatusColor = () => {
    if (isLocked) return 'border-muted-foreground/30'
    if (quest.status === 'completed') return 'border-accent glow-border'
    if (quest.status === 'failed') return 'border-destructive'
    if (quest.type === 'boss') return 'border-destructive animate-pulse-glow'
    return 'border-primary'
  }

  const getStatusIcon = () => {
    if (quest.status === 'completed') return <CheckCircle size={20} weight="fill" className="text-accent" />
    if (quest.status === 'failed') return <XCircle size={20} weight="fill" className="text-destructive" />
    if (isLocked) return <Lock size={20} className="text-muted-foreground" />
    return null
  }

  return (
    <Card 
      className={`glass-panel p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 ${getStatusColor()} ${isLocked ? 'opacity-50' : ''}`}
      onClick={() => !isLocked && onClick()}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${quest.type === 'boss' ? 'bg-destructive/20' : 'bg-primary/20'}`}>
          {getQuestIcon()}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight">{quest.name}</h3>
            {getStatusIcon()}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{quest.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {quest.xpValue} {themeConfig.xpLabel}
            </Badge>
            {quest.type === 'boss' && (
              <Badge variant="destructive" className="text-xs">
                Boss Battle
              </Badge>
            )}
            {quest.type === 'redemption' && (
              <Badge variant="outline" className="text-xs">
                Redemption
              </Badge>
            )}
            {quest.dueDate && (
              <span className="text-xs text-muted-foreground ml-auto">
                Due {formatTimeAgo(quest.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

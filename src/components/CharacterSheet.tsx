import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UserProfile, Theme, THEME_CONFIGS, Artifact } from '@/lib/types'
import { calculateLevel, getLevelTitle, getXpForNextLevel } from '@/lib/game-utils'
import { Sparkle, Star, TrendUp } from '@phosphor-icons/react'

interface CharacterSheetProps {
  profile: UserProfile
  theme: Theme
}

export function CharacterSheet({ profile, theme }: CharacterSheetProps) {
  const themeConfig = THEME_CONFIGS[theme]
  const level = calculateLevel(profile.xp)
  const levelTitle = getLevelTitle(level, profile.role)
  const nextLevelXp = getXpForNextLevel(profile.xp)
  const xpProgress = ((profile.xp % nextLevelXp) / nextLevelXp) * 100

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-accent bg-accent/10'
      case 'epic': return 'border-secondary bg-secondary/10'
      case 'rare': return 'border-primary bg-primary/10'
      default: return 'border-muted bg-muted/10'
    }
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Badge className="bg-accent text-accent-foreground">Legendary</Badge>
      case 'epic': return <Badge className="bg-secondary text-secondary-foreground">Epic</Badge>
      case 'rare': return <Badge className="bg-primary text-primary-foreground">Rare</Badge>
      default: return <Badge variant="outline">Common</Badge>
    }
  }

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      <div className="glass-panel p-8 space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-accent bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-6xl font-bold">{profile.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-lg px-4 py-1">
                  Level {level}
                </Badge>
                <span className="text-xl text-primary font-semibold">{levelTitle}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{themeConfig.xpLabel} Progress</span>
                <span className="text-sm font-medium">{profile.xp} / {nextLevelXp}</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendUp size={16} />
                <span>{nextLevelXp - profile.xp} {themeConfig.xpLabel} to next level</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkle size={28} weight="fill" className="text-accent" />
          <h2 className="text-2xl font-bold">Artifact Collection</h2>
        </div>
        
        {profile.artifacts.length === 0 ? (
          <Card className="glass-panel p-12 text-center">
            <Star size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No artifacts yet</p>
            <p className="text-sm text-muted-foreground">
              Complete quests with high scores (90%+) to earn legendary artifacts
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.artifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className={`glass-panel p-6 border-2 hover:scale-105 transition-all cursor-pointer ${getRarityColor(artifact.rarity)}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Sparkle size={24} weight="fill" className="text-accent" />
                    {getRarityBadge(artifact.rarity)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{artifact.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {artifact.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Earned {new Date(artifact.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

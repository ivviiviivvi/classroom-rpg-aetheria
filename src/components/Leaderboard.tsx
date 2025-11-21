import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Theme, THEME_CONFIGS, UserProfile } from '@/lib/types'
import { Trophy, Medal, Star } from '@phosphor-icons/react'
import { calculateLevel, getLevelTitle } from '@/lib/game-utils'

interface LeaderboardProps {
  profiles: UserProfile[]
  theme: Theme
  currentUserId: string
}

export function Leaderboard({ profiles, theme, currentUserId }: LeaderboardProps) {
  const themeConfig = THEME_CONFIGS[theme]
  
  const sortedProfiles = [...profiles].sort((a, b) => b.xp - a.xp)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={24} weight="fill" className="text-accent" />
    if (rank === 2) return <Medal size={24} weight="fill" className="text-muted-foreground" />
    if (rank === 3) return <Medal size={24} weight="fill" className="text-destructive" />
    return <Star size={20} className="text-muted-foreground" />
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-accent bg-accent/10'
    if (rank === 2) return 'border-muted-foreground/50 bg-muted-foreground/5'
    if (rank === 3) return 'border-destructive/50 bg-destructive/5'
    return 'border-border'
  }

  return (
    <div className="space-y-6 p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Trophy size={32} weight="fill" className="text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Top heroes ranked by {themeConfig.xpLabel}</p>
        </div>
      </div>

      {sortedProfiles.length === 0 ? (
        <Card className="glass-panel p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">No heroes yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedProfiles.map((profile, index) => {
            const rank = index + 1
            const level = calculateLevel(profile.xp)
            const levelTitle = getLevelTitle(level, profile.role)
            const isCurrentUser = profile.id === currentUserId

            return (
              <Card
                key={profile.id}
                className={`glass-panel p-6 border-2 transition-all hover:scale-[1.02] ${getRankColor(rank)} ${
                  isCurrentUser ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-12">
                    {rank <= 3 ? (
                      getRankIcon(rank)
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
                    )}
                  </div>

                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">{profile.name}</h3>
                      {isCurrentUser && (
                        <Badge variant="default" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Level {level}</span>
                      <span>•</span>
                      <span>{levelTitle}</span>
                      <span>•</span>
                      <span>{profile.artifacts.length} artifacts</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-accent">{profile.xp}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {themeConfig.xpLabel}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

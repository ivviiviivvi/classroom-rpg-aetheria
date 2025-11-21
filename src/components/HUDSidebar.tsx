import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { House, User, BookOpen, Target, Sword, Brain, Shield, GraduationCap, ArrowsClockwise, Palette, Trophy, ChalkboardTeacher } from '@phosphor-icons/react'
import { Theme, Role, THEME_CONFIGS } from '@/lib/types'
import { UserProfile } from '@/lib/types'
import { calculateLevel, getLevelTitle, getXpForNextLevel } from '@/lib/game-utils'

interface HUDSidebarProps {
  profile: UserProfile
  theme: Theme
  role: Role
  currentView: string
  onNavigate: (view: string) => void
  onThemeChange: () => void
  onRoleToggle: () => void
}

export function HUDSidebar({
  profile,
  theme,
  role,
  currentView,
  onNavigate,
  onThemeChange,
  onRoleToggle
}: HUDSidebarProps) {
  const themeConfig = THEME_CONFIGS[theme]
  const level = calculateLevel(profile.xp)
  const levelTitle = getLevelTitle(level, role)
  const nextLevelXp = getXpForNextLevel(profile.xp)
  const xpProgress = ((profile.xp % nextLevelXp) / nextLevelXp) * 100

  const RoleIcon = theme === 'fantasy' ? Sword :
                   theme === 'scifi' ? Brain :
                   theme === 'medieval' ? Shield :
                   GraduationCap

  return (
    <div className="w-80 h-screen glass-panel rounded-none border-r-2 border-l-0 border-t-0 border-b-0 flex flex-col p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{profile.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Lvl {level}
              </Badge>
              <span className="text-xs text-muted-foreground">{levelTitle}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{themeConfig.xpLabel}</span>
            <span className="font-medium">{profile.xp} / {nextLevelXp}</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>
      </div>

      <Separator className="bg-border" />

      <nav className="space-y-2 flex-1">
        <Button
          variant={currentView === 'world-map' ? 'default' : 'ghost'}
          className="w-full justify-start gap-3"
          onClick={() => onNavigate('world-map')}
        >
          <House size={20} />
          World Map
        </Button>
        <Button
          variant={currentView === 'quests' ? 'default' : 'ghost'}
          className="w-full justify-start gap-3"
          onClick={() => onNavigate('quests')}
        >
          <Target size={20} />
          {themeConfig.questLabel}s
        </Button>
        <Button
          variant={currentView === 'archives' ? 'default' : 'ghost'}
          className="w-full justify-start gap-3"
          onClick={() => onNavigate('archives')}
        >
          <BookOpen size={20} />
          {themeConfig.archiveLabel}
        </Button>
        <Button
          variant={currentView === 'character' ? 'default' : 'ghost'}
          className="w-full justify-start gap-3"
          onClick={() => onNavigate('character')}
        >
          <User size={20} />
          My Hero
        </Button>
        <Button
          variant={currentView === 'leaderboard' ? 'default' : 'ghost'}
          className="w-full justify-start gap-3"
          onClick={() => onNavigate('leaderboard')}
        >
          <Trophy size={20} />
          Leaderboard
        </Button>
        {role === 'teacher' && (
          <Button
            variant={currentView === 'teacher-dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3"
            onClick={() => onNavigate('teacher-dashboard')}
          >
            <ChalkboardTeacher size={20} />
            Manage
          </Button>
        )}
      </nav>

      <Separator className="bg-border" />

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={onRoleToggle}
        >
          <RoleIcon size={20} />
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Playing as</span>
            <span className="font-medium">
              {role === 'teacher' ? themeConfig.teacherTitle : themeConfig.studentTitle}
            </span>
          </div>
          <ArrowsClockwise size={16} className="ml-auto" />
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={onThemeChange}
        >
          <Palette size={20} />
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Reality</span>
            <span className="font-medium">{themeConfig.name}</span>
          </div>
        </Button>
      </div>
    </div>
  )
}

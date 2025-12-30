import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { useTheme, useRole } from '@/hooks/use-theme'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTouchSwipe } from '@/hooks/use-touch-gestures'
import { useSandboxKV } from '@/hooks/use-sandbox-kv'
import { SandboxBanner } from '@/components/SandboxBanner'
import { HUDSidebar } from '@/components/HUDSidebar'
import { MobileNav } from '@/components/MobileNav'
import { UniverseMap } from '@/components/UniverseMap'
import { BoardGameMap } from '@/components/BoardGameMap'
import { RealmEditor } from '@/components/RealmEditor'
import { RealmCreator } from '@/components/RealmCreator'
import { QuestCreator } from '@/components/QuestCreator'
import { QuestCard } from '@/components/QuestCard'
import { QuestDialog } from '@/components/QuestDialog'
import { ConstellationView } from '@/components/ConstellationView'
import { CharacterSheet } from '@/components/CharacterSheet'
import { ArchivesView } from '@/components/ArchivesView'
import { Leaderboard } from '@/components/Leaderboard'
import { TeacherDashboard } from '@/components/TeacherDashboard'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { ParticleField } from '@/components/ParticleField'
import { LevelUpCelebration } from '@/components/LevelUpCelebration'
import { QuickStats } from '@/components/QuickStats'
import { GenerativeMusic } from '@/components/GenerativeMusic'
import { ThemeBackground3D } from '@/components/ThemeBackground3D'
import { Button } from '@/components/ui/button'
import { Plus, Sparkle } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { sanitizeHTML } from '@/lib/sanitize'
import { retryWithBackoff } from '@/lib/api-retry'
import { trackError } from '@/lib/error-tracker'
import { isSandboxMode } from '@/lib/sandbox-mode'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import type { 
  Realm, 
  Quest, 
  UserProfile, 
  Submission, 
  KnowledgeCrystal, 
  Artifact,
  Theme,
  Role,
  AvatarCustomization
} from '@/lib/types'
import { 
  generateId, 
  calculateLevel, 
  generateArtifactName, 
  getRarityFromScore 
} from '@/lib/game-utils'
import { THEME_CONFIGS } from '@/lib/types'
import { DEFAULT_AVATAR } from '@/lib/avatar-options'
import { soundEffects } from '@/lib/sound-effects'

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  name: '',
  role: 'student',
  xp: 0,
  level: 1,
  artifacts: [],
  avatar: DEFAULT_AVATAR
}

function App() {
  const [theme, setTheme] = useTheme()
  const [role, setRole] = useRole()
  const [currentView, setCurrentView] = useState('world-map')
  const [selectedRealmId, setSelectedRealmId] = useState<string | null>(null)
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null)
  const [isEditingRealms, setIsEditingRealms] = useState(false)
  const [isCreatingRealm, setIsCreatingRealm] = useState(false)
  const [isCreatingQuest, setIsCreatingQuest] = useState(false)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{ level: number; role: Role }>({ level: 1, role: 'student' })
  const mainRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  
  const [realms, setRealms] = useSandboxKV<Realm[]>('aetheria-realms', [])
  const [quests, setQuests] = useSandboxKV<Quest[]>('aetheria-quests', [])
  const [submissions, setSubmissions] = useSandboxKV<Submission[]>('aetheria-submissions', [])
  const [crystals, setCrystals] = useSandboxKV<KnowledgeCrystal[]>('aetheria-crystals', [])
  const [profile, setProfile] = useSandboxKV<UserProfile>('aetheria-profile', DEFAULT_PROFILE)
  const [allProfiles, setAllProfiles] = useSandboxKV<UserProfile[]>('aetheria-all-profiles', [])
  const [soundVolume] = useKV<number>('aetheria-sound-volume', 0.3)
  const [soundMuted] = useKV<boolean>('aetheria-sound-muted', false)

  const currentTheme = theme || 'fantasy'
  const currentRole = role || 'student'
  const themeConfig = THEME_CONFIGS[currentTheme]
  const currentProfile = profile || DEFAULT_PROFILE

  useEffect(() => {
    if (!profile?.name || profile.name === '') {
      setShowNameDialog(true)
    }
  }, [profile])

  useEffect(() => {
    soundEffects.setVolume(soundVolume ?? 0.3)
    soundEffects.setEnabled(!(soundMuted ?? false))
  }, [soundVolume, soundMuted])

  useEffect(() => {
    if (role && profile) {
      const updatedProfile: UserProfile = { ...profile, role }
      setProfile(updatedProfile)
    }
  }, [role])

  useEffect(() => {
    if (profile && allProfiles) {
      const existingIndex = allProfiles.findIndex(p => p.id === profile.id)
      if (existingIndex >= 0) {
        const updated = [...allProfiles]
        updated[existingIndex] = profile
        setAllProfiles(updated)
      } else {
        setAllProfiles([...allProfiles, profile])
      }
    }
  }, [profile])

  const handleThemeChange = () => {
    const themes: Theme[] = ['fantasy', 'scifi', 'medieval', 'modern']
    const currentIndex = themes.indexOf(currentTheme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    toast.success(`Reality shifted to ${THEME_CONFIGS[nextTheme].name}`)
  }

  const handleRoleToggle = () => {
    const newRole = currentRole === 'teacher' ? 'student' : 'teacher'
    setRole(newRole)
  }

  const handleRealmClick = (realmId: string) => {
    soundEffects.play('planet-click')
    setSelectedRealmId(realmId)
    setCurrentView('realm-detail')
  }

  const handleQuestClick = (questId: string) => {
    setSelectedQuestId(questId)
  }

  const handleQuestSubmit = async (questId: string, content: string) => {
    const quest = quests?.find(q => q.id === questId)
    if (!quest) return

    try {
      const submissionPrompt = `You are the ${themeConfig.oracleLabel} in a gamified learning system. Evaluate this student submission.

Quest: ${quest.name}
Description: ${quest.description}
Student Response: ${content}

Provide:
1. A score from 0-100
2. Constructive feedback in 2-3 sentences, speaking in character as the ${themeConfig.oracleLabel}

Format your response as JSON: {"score": number, "feedback": "string"}`

      const result = await retryWithBackoff(
        () => window.spark.llm(submissionPrompt, 'gpt-4o', true),
        3,
        2000
      )
      const evaluation = JSON.parse(result)
      
      // Sanitize all string fields from evaluation to prevent XSS
      if (evaluation.feedback) {
        evaluation.feedback = sanitizeHTML(evaluation.feedback)
      }

      const submission: Submission = {
        id: generateId(),
        questId,
        studentId: currentProfile.id,
        content,
        score: evaluation.score,
        feedback: evaluation.feedback || '',
        submittedAt: Date.now(),
        evaluatedAt: Date.now()
      }

      setSubmissions((current) => [...(current || []), submission])

      if (evaluation.score >= 70) {
        soundEffects.play('quest-complete')
        const xpGained = quest.xpValue
        const oldLevel = calculateLevel(currentProfile.xp)
        const newXp = currentProfile.xp + xpGained
        const newLevel = calculateLevel(newXp)
        const updatedProfile: UserProfile = { ...currentProfile, xp: newXp, level: newLevel }
        setProfile(updatedProfile)

        if (newLevel > oldLevel) {
          soundEffects.play('level-up')
          setLevelUpData({ level: newLevel, role: currentProfile.role })
          setShowLevelUp(true)
        }

        setQuests((current) =>
          (current || []).map(q => q.id === questId ? { ...q, status: 'completed' as const } : q)
        )

        toast.success(`Quest completed! +${xpGained} ${themeConfig.xpLabel}`, {
          description: evaluation.feedback
        })

        if (evaluation.score >= 90) {
          soundEffects.play('artifact-drop')
          const artifactName = generateArtifactName(evaluation.score, quest.name, currentTheme)
          const artifact: Artifact = {
            id: generateId(),
            name: artifactName,
            description: `Earned for exceptional performance on "${quest.name}". This legendary artifact represents your mastery.`,
            rarity: getRarityFromScore(evaluation.score),
            earnedAt: Date.now(),
            questId: quest.id
          }

          const profileWithArtifact: UserProfile = {
            ...updatedProfile,
            artifacts: [...updatedProfile.artifacts, artifact]
          }
          setProfile(profileWithArtifact)

          toast.success('Loot Drop!', {
            description: `You earned: ${artifactName}`
          })
        }
      } else {
        soundEffects.play('quest-fail')
        setQuests((current) =>
          (current || []).map(q => q.id === questId ? { ...q, status: 'failed' as const } : q)
        )

        const crystalPrompt = `Create a Knowledge Crystal (study guide) for a student who struggled with this quest.

Quest: ${quest.name}
Description: ${quest.description}
Student's Response: ${content}
Score: ${evaluation.score}

Write a 3-4 paragraph study guide that:
1. Explains the key concept they missed
2. Provides examples
3. Encourages them to try again

Keep the tone matching the ${themeConfig.oracleLabel} character.`

        const crystalContent = await retryWithBackoff(
          () => window.spark.llm(crystalPrompt, 'gpt-4o'),
          3,
          2000
        )
        
        // Sanitize crystal content to prevent XSS
        const sanitizedCrystalContent = sanitizeHTML(crystalContent)

        const crystal: KnowledgeCrystal = {
          id: generateId(),
          questId: quest.id,
          studentId: currentProfile.id,
          title: `Understanding ${quest.name}`,
          content: sanitizedCrystalContent,
          isAttuned: false,
          createdAt: Date.now()
        }

        setCrystals((current) => [...(current || []), crystal])

        const redemptionPrompt = `Create a simplified redemption quest based on the original quest.

Original Quest: ${quest.name}
Description: ${quest.description}

Create a simpler version that focuses on the core concept. Make it achievable for a struggling student.
Just provide the quest name and description as JSON: {"name": "string", "description": "string"}`

        const redemptionResult = await retryWithBackoff(
          () => window.spark.llm(redemptionPrompt, 'gpt-4o', true),
          3,
          2000
        )
        const redemptionData = JSON.parse(redemptionResult)
        
        // Sanitize quest data to prevent XSS
        redemptionData.name = sanitizeHTML(redemptionData.name)
        redemptionData.description = sanitizeHTML(redemptionData.description)

        const redemptionQuest: Quest = {
          id: generateId(),
          realmId: quest.realmId,
          name: redemptionData.name,
          description: redemptionData.description,
          type: 'redemption',
          xpValue: Math.floor(quest.xpValue * 0.5),
          status: 'locked',
          prerequisiteIds: [crystal.id],
          createdAt: Date.now()
        }

        setQuests((current) => [...(current || []), redemptionQuest])

        toast.error('Quest failed', {
          description: `But don't give up! Check the ${themeConfig.archiveLabel} for help.`
        })
      }

      setSelectedQuestId(null)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      trackError(err, {
        questId,
        studentId: currentProfile.id,
        operation: 'quest-evaluation'
      })
      toast.error('An error occurred while evaluating your submission')
      console.error(error)
    }
  }

  const handleAttuneCrystal = (crystalId: string) => {
    soundEffects.play('crystal-attune')
    setCrystals((current) =>
      (current || []).map(c => c.id === crystalId ? { ...c, isAttuned: true } : c)
    )

    setQuests((current) =>
      (current || []).map(q => 
        q.prerequisiteIds?.includes(crystalId) ? { ...q, status: 'available' as const } : q
      )
    )

    toast.success('Crystal attuned!', {
      description: 'Redemption quest unlocked'
    })
  }

  const handleUpdateRealms = (updatedRealms: Realm[]) => {
    setRealms(updatedRealms)
  }

  const handleCreateRealm = (realm: Realm) => {
    setRealms((current) => [...(current || []), realm])
    setIsCreatingRealm(false)
  }

  const handleCreateQuest = (quest: Quest) => {
    setQuests((current) => [...(current || []), quest])
    setIsCreatingQuest(false)
  }

  const handleDeleteQuest = (questId: string) => {
    setQuests((current) => (current || []).filter(q => q.id !== questId))
    setSubmissions((current) => (current || []).filter(s => s.questId !== questId))
    setCrystals((current) => (current || []).filter(c => c.questId !== questId))
  }

  const handleDeleteRealm = (realmId: string) => {
    setRealms((current) => (current || []).filter(r => r.id !== realmId))
  }

  const handleSetName = () => {
    if (!nameInput.trim()) {
      toast.error('Please enter a name')
      return
    }
    const updatedProfile: UserProfile = { 
      ...currentProfile, 
      name: nameInput.trim(),
      id: `user-${Date.now()}`,
      avatar: currentProfile.avatar || DEFAULT_AVATAR
    }
    setProfile(updatedProfile)
    setShowNameDialog(false)
    toast.success(`Welcome, ${nameInput.trim()}!`)
  }

  const handleUpdateAvatar = (avatar: AvatarCustomization) => {
    const updatedProfile: UserProfile = {
      ...currentProfile,
      avatar
    }
    setProfile(updatedProfile)
    toast.success('Avatar updated!')
  }

  const selectedRealm = realms?.find(r => r.id === selectedRealmId)
  const realmQuests = quests?.filter(q => q.realmId === selectedRealmId) || []
  const selectedQuest = quests?.find(q => q.id === selectedQuestId) || null

  const handleUpdateSubmission = (updatedSubmission: Submission) => {
    setSubmissions((current) =>
      (current || []).map(s => s.id === updatedSubmission.id ? updatedSubmission : s)
    )
  }

  const viewOrder = ['world-map', 'quests', 'archives', 'character', 'leaderboard']
  
  useTouchSwipe(mainRef.current, {
    onSwipeLeft: () => {
      if (!isMobile) return
      const currentIndex = viewOrder.indexOf(currentView)
      if (currentIndex < viewOrder.length - 1) {
        setCurrentView(viewOrder[currentIndex + 1])
      }
    },
    onSwipeRight: () => {
      if (!isMobile) return
      const currentIndex = viewOrder.indexOf(currentView)
      if (currentIndex > 0) {
        setCurrentView(viewOrder[currentIndex - 1])
      } else if (currentView === 'realm-detail') {
        setCurrentView('world-map')
      }
    }
  })

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Sandbox mode banner */}
      {isSandboxMode() && <SandboxBanner />}
      
      <ParticleField count={isMobile ? 20 : 40} speed={0.2} />
      
      {(currentView === 'realm-detail' || currentView === 'constellation') && selectedRealm && (
        <ErrorBoundary 
          fallback={<div className="hidden" />}
          onError={(error) => {
            console.error('3D Background error:', error)
          }}
        >
          <ThemeBackground3D theme={currentTheme} realmColor={selectedRealm.color} />
        </ErrorBoundary>
      )}
      
      <Dialog open={showNameDialog} onOpenChange={() => {}}>
        <DialogContent className="glass-panel" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkle size={32} weight="fill" className="text-accent" />
              </motion.div>
              <DialogTitle className="text-2xl">Welcome to Aetheria</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              Enter your hero name to begin your journey through the living classroom
            </DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <Label htmlFor="hero-name">Your Name</Label>
              <Input
                id="hero-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name..."
                className="glass-panel"
                onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
              />
            </div>
            <Button onClick={handleSetName} className="w-full gap-2" size="lg">
              <Sparkle size={20} weight="fill" />
              Begin Adventure
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      <MobileNav
        profile={currentProfile}
        theme={currentTheme}
        role={currentRole}
        currentView={currentView}
        onNavigate={setCurrentView}
        onThemeChange={handleThemeChange}
        onRoleToggle={handleRoleToggle}
      />

      <HUDSidebar
        profile={currentProfile}
        theme={currentTheme}
        role={currentRole}
        currentView={currentView}
        onNavigate={setCurrentView}
        onThemeChange={handleThemeChange}
        onRoleToggle={handleRoleToggle}
      />
      
      <div className="fixed bottom-4 left-4 z-40 md:z-50">
        <GenerativeMusic />
      </div>

      <main ref={mainRef} className="flex-1 overflow-auto pt-[60px] pb-[60px] md:pt-0 md:pb-0">
        <AnimatePresence mode="wait">
          {currentView === 'world-map' && (
            <motion.div
              key="world-map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full relative"
            >
            <ErrorBoundary
              FallbackComponent={({ resetErrorBoundary }) => (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="glass-panel p-8 text-center space-y-4">
                    <p className="text-muted-foreground">Unable to load 3D universe</p>
                    <Button onClick={resetErrorBoundary}>Retry</Button>
                  </div>
                </div>
              )}
              onReset={() => {
                setCurrentView('quests')
                setTimeout(() => setCurrentView('world-map'), 100)
              }}
            >
              <UniverseMap
                realms={realms || []}
                theme={currentTheme}
                onRealmClick={handleRealmClick}
              />
            </ErrorBoundary>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center space-y-2">
              <h1 className="text-5xl font-bold glow-text">Aetheria</h1>
              <p className="text-lg text-muted-foreground">The Living Classroom</p>
            </div>
            {(realms?.length === 0 || !realms) && currentRole === 'teacher' && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Button size="lg" className="gap-2" onClick={() => setIsCreatingRealm(true)}>
                  <Plus size={24} weight="bold" />
                  Create Your First {themeConfig.realmLabel}
                </Button>
              </div>
            )}
            {currentRole === 'teacher' && (realms?.length ?? 0) > 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Button size="lg" className="gap-2" onClick={() => setIsCreatingRealm(true)}>
                  <Plus size={24} weight="bold" />
                  Add {themeConfig.realmLabel}
                </Button>
              </div>
            )}
            </motion.div>
          )}

          {currentView === 'realm-detail' && selectedRealm && (
            <motion.div
              key="realm-detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <BoardGameMap
                quests={realmQuests}
                theme={currentTheme}
                onQuestClick={handleQuestClick}
                onBack={() => setCurrentView('world-map')}
                realmColor={selectedRealm.color}
                realmName={selectedRealm.name}
                role={currentRole}
                onCreateQuest={() => setIsCreatingQuest(true)}
              />
            </motion.div>
          )}

          {currentView === 'constellation' && selectedRealm && (
            <motion.div
              key="constellation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
            <div className="p-8 pb-0">
              <Button onClick={() => setCurrentView('realm-detail')} variant="outline" className="mb-4">
                ← Back to {themeConfig.realmLabel}
              </Button>
              <h1 className="text-3xl font-bold mb-2">Mastery Constellation</h1>
              <p className="text-muted-foreground">{selectedRealm.name}</p>
            </div>
            <div className="flex-1">
              <ConstellationView quests={realmQuests} />
            </div>
            </motion.div>
          )}

          {currentView === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 md:p-8 space-y-4 md:space-y-6"
            >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">All {themeConfig.questLabel}s</h1>
              <p className="text-sm md:text-base text-muted-foreground">Your journey across all realms</p>
            </div>

            <QuickStats
              totalQuests={quests?.length || 0}
              completedQuests={quests?.filter(q => q.status === 'completed').length || 0}
              failedQuests={quests?.filter(q => q.status === 'failed').length || 0}
              totalArtifacts={currentProfile.artifacts.length}
              theme={currentTheme}
            />

            {(!quests || quests.length === 0) ? (
              <div className="glass-panel p-8 md:p-12 text-center">
                <p className="text-muted-foreground">No quests available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {quests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    theme={currentTheme}
                    onClick={() => handleQuestClick(quest.id)}
                    isLocked={quest.status === 'locked'}
                  />
                ))}
              </div>
            )}
            </motion.div>
          )}

          {currentView === 'archives' && (
            <motion.div
              key="archives"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArchivesView
                crystals={crystals || []}
                theme={currentTheme}
                onAttune={handleAttuneCrystal}
              />
            </motion.div>
          )}

          {currentView === 'character' && (
            <motion.div
              key="character"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CharacterSheet
                profile={currentProfile}
                theme={currentTheme}
                onUpdateAvatar={handleUpdateAvatar}
              />
            </motion.div>
          )}

          {currentView === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard
                profiles={allProfiles || []}
                theme={currentTheme}
                currentUserId={currentProfile.id}
              />
            </motion.div>
          )}

          {currentView === 'teacher-dashboard' && currentRole === 'teacher' && (
            <motion.div
              key="teacher-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TeacherDashboard
                quests={quests || []}
                submissions={submissions || []}
                realms={realms || []}
                theme={currentTheme}
                onDeleteQuest={handleDeleteQuest}
                onDeleteRealm={handleDeleteRealm}
                onUpdateSubmission={handleUpdateSubmission}
                onImportRealms={(newRealms) => {
                  setRealms((current) => [...(current || []), ...newRealms])
                }}
                onImportQuests={(newQuests) => {
                  setQuests((current) => [...(current || []), ...newQuests])
                }}
              />
            </motion.div>
          )}

          {currentView === 'analytics' && currentRole === 'teacher' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsDashboard
                quests={quests || []}
                submissions={submissions || []}
                profiles={allProfiles || []}
                theme={currentTheme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <QuestDialog
        quest={selectedQuest}
        theme={currentTheme}
        open={!!selectedQuestId}
        onClose={() => setSelectedQuestId(null)}
        onSubmit={handleQuestSubmit}
      />

      {isEditingRealms && (
        <RealmEditor
          realms={realms || []}
          theme={currentTheme}
          onUpdateRealms={handleUpdateRealms}
          onClose={() => setIsEditingRealms(false)}
        />
      )}

      <RealmCreator
        open={isCreatingRealm}
        theme={currentTheme}
        onClose={() => setIsCreatingRealm(false)}
        onCreate={handleCreateRealm}
      />

      <QuestCreator
        open={isCreatingQuest}
        theme={currentTheme}
        realmId={selectedRealmId || ''}
        realm={selectedRealm}
        onClose={() => setIsCreatingQuest(false)}
        onCreate={handleCreateQuest}
      />

      <Toaster position="top-right" />
      
      <LevelUpCelebration
        show={showLevelUp}
        level={levelUpData.level}
        role={levelUpData.role}
        theme={currentTheme}
        onComplete={() => setShowLevelUp(false)}
      />
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTheme, useRole } from '@/hooks/use-theme'
import { HUDSidebar } from '@/components/HUDSidebar'
import { RealmMap } from '@/components/RealmMap'
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
import { ParticleField } from '@/components/ParticleField'
import { LevelUpCelebration } from '@/components/LevelUpCelebration'
import { QuickStats } from '@/components/QuickStats'
import { GenerativeMusic } from '@/components/GenerativeMusic'
import { ThemeBackground3D } from '@/components/ThemeBackground3D'
import { Button } from '@/components/ui/button'
import { Plus, Target, Pencil, Sparkle } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
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
  
  const [realms, setRealms] = useKV<Realm[]>('aetheria-realms', [])
  const [quests, setQuests] = useKV<Quest[]>('aetheria-quests', [])
  const [submissions, setSubmissions] = useKV<Submission[]>('aetheria-submissions', [])
  const [crystals, setCrystals] = useKV<KnowledgeCrystal[]>('aetheria-crystals', [])
  const [profile, setProfile] = useKV<UserProfile>('aetheria-profile', DEFAULT_PROFILE)
  const [allProfiles, setAllProfiles] = useKV<UserProfile[]>('aetheria-all-profiles', [])

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
      const promptParts = [
        'You are the ', themeConfig.oracleLabel, ' in a gamified learning system. Evaluate this student submission.\n\nQuest: ',
        quest.name, '\nDescription: ', quest.description, '\nStudent Response: ', content,
        '\n\nProvide:\n1. A score from 0-100\n2. Constructive feedback in 2-3 sentences, speaking in character as the ',
        themeConfig.oracleLabel, '\n\nFormat your response as JSON: {"score": number, "feedback": "string"}'
      ]
      const submissionPrompt = promptParts.join('')

      const result = await window.spark.llm(submissionPrompt, 'gpt-4o', true)
      const evaluation = JSON.parse(result)

      const submission: Submission = {
        id: generateId(),
        questId,
        studentId: currentProfile.id,
        content,
        score: evaluation.score,
        feedback: evaluation.feedback,
        submittedAt: Date.now(),
        evaluatedAt: Date.now()
      }

      setSubmissions((current) => [...(current || []), submission])

      if (evaluation.score >= 70) {
        const xpGained = quest.xpValue
        const oldLevel = calculateLevel(currentProfile.xp)
        const newXp = currentProfile.xp + xpGained
        const newLevel = calculateLevel(newXp)
        const updatedProfile: UserProfile = { ...currentProfile, xp: newXp, level: newLevel }
        setProfile(updatedProfile)

        if (newLevel > oldLevel) {
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
        setQuests((current) =>
          (current || []).map(q => q.id === questId ? { ...q, status: 'failed' as const } : q)
        )

        const crystalPromptParts = [
          'Create a Knowledge Crystal (study guide) for a student who struggled with this quest.\n\nQuest: ',
          quest.name, '\nDescription: ', quest.description, "\nStudent's Response: ", content,
          '\nScore: ', evaluation.score.toString(),
          '\n\nWrite a 3-4 paragraph study guide that:\n1. Explains the key concept they missed\n2. Provides examples\n3. Encourages them to try again\n\nKeep the tone matching the ',
          themeConfig.oracleLabel, ' character.'
        ]
        const crystalPrompt = crystalPromptParts.join('')

        const crystalContent = await window.spark.llm(crystalPrompt, 'gpt-4o')

        const crystal: KnowledgeCrystal = {
          id: generateId(),
          questId: quest.id,
          studentId: currentProfile.id,
          title: `Understanding ${quest.name}`,
          content: crystalContent,
          isAttuned: false,
          createdAt: Date.now()
        }

        setCrystals((current) => [...(current || []), crystal])

        const redemptionPromptParts = [
          'Create a simplified redemption quest based on the original quest.\n\nOriginal Quest: ',
          quest.name, '\nDescription: ', quest.description,
          '\n\nCreate a simpler version that focuses on the core concept. Make it achievable for a struggling student.\nJust provide the quest name and description as JSON: {"name": "string", "description": "string"}'
        ]
        const redemptionPrompt = redemptionPromptParts.join('')

        const redemptionData = JSON.parse(await window.spark.llm(redemptionPrompt, 'gpt-4o', true))

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
      toast.error('An error occurred while evaluating your submission')
      console.error(error)
    }
  }

  const handleAttuneCrystal = (crystalId: string) => {
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

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      <ParticleField count={40} speed={0.2} />
      
      {(currentView === 'realm-detail' || currentView === 'constellation') && selectedRealm && (
        <ThemeBackground3D theme={currentTheme} realmColor={selectedRealm.color} />
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

      <HUDSidebar
        profile={currentProfile}
        theme={currentTheme}
        role={currentRole}
        currentView={currentView}
        onNavigate={setCurrentView}
        onThemeChange={handleThemeChange}
        onRoleToggle={handleRoleToggle}
      />
      
      <div className="fixed bottom-4 left-4 z-50">
        <GenerativeMusic />
      </div>

      <main className="flex-1 overflow-auto">
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
            <RealmMap
              realms={realms || []}
              theme={currentTheme}
              onRealmClick={handleRealmClick}
            />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center space-y-2">
              <h1 className="text-5xl font-bold glow-text">Aetheria</h1>
              <p className="text-lg text-muted-foreground">The Living Classroom</p>
            </div>
            {currentRole === 'teacher' && (realms?.length ?? 0) > 0 && (
              <div className="absolute top-8 right-8">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 glass-button"
                  onClick={() => setIsEditingRealms(true)}
                >
                  <Pencil size={20} weight="bold" />
                  Edit Positions
                </Button>
              </div>
            )}
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
              className="p-8 space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-4xl font-bold mb-2">{selectedRealm.name}</h1>
                <p className="text-lg text-muted-foreground">{selectedRealm.description}</p>
              </motion.div>

            <div className="flex items-center gap-4">
              <Button onClick={() => setCurrentView('constellation')} variant="outline" className="gap-2">
                <Target size={20} />
                View Constellation
              </Button>
              {currentRole === 'teacher' && (
                <Button onClick={() => setIsCreatingQuest(true)} className="gap-2">
                  <Plus size={20} weight="bold" />
                  Create {themeConfig.questLabel}
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{themeConfig.questLabel}s</h2>
              {realmQuests.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                  <p className="text-muted-foreground">No quests available yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {realmQuests.map((quest) => (
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
            </div>
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
              className="p-8 space-y-6"
            >
            <div>
              <h1 className="text-4xl font-bold mb-2">All {themeConfig.questLabel}s</h1>
              <p className="text-muted-foreground">Your journey across all realms</p>
            </div>

            <QuickStats
              totalQuests={quests?.length || 0}
              completedQuests={quests?.filter(q => q.status === 'completed').length || 0}
              failedQuests={quests?.filter(q => q.status === 'failed').length || 0}
              totalArtifacts={currentProfile.artifacts.length}
              theme={currentTheme}
            />

            {(!quests || quests.length === 0) ? (
              <div className="glass-panel p-12 text-center">
                <p className="text-muted-foreground">No quests available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

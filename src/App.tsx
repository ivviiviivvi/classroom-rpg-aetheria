import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTheme, useRole } from '@/hooks/use-theme'
import { HUDSidebar } from '@/components/HUDSidebar'
import { RealmMap } from '@/components/RealmMap'
import { RealmEditor } from '@/components/RealmEditor'
import { QuestCard } from '@/components/QuestCard'
import { QuestDialog } from '@/components/QuestDialog'
import { ConstellationView } from '@/components/ConstellationView'
import { CharacterSheet } from '@/components/CharacterSheet'
import { ArchivesView } from '@/components/ArchivesView'
import { Button } from '@/components/ui/button'
import { Plus, Target, Pencil } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import type { 
  Realm, 
  Quest, 
  UserProfile, 
  Submission, 
  KnowledgeCrystal, 
  Artifact,
  Theme
} from '@/lib/types'
import { 
  generateId, 
  calculateLevel, 
  generateArtifactName, 
  getRarityFromScore 
} from '@/lib/game-utils'
import { THEME_CONFIGS } from '@/lib/types'

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Hero',
  role: 'student',
  xp: 0,
  level: 1,
  artifacts: []
}

function App() {
  const [theme, setTheme] = useTheme()
  const [role, setRole] = useRole()
  const [currentView, setCurrentView] = useState('world-map')
  const [selectedRealmId, setSelectedRealmId] = useState<string | null>(null)
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null)
  const [isEditingRealms, setIsEditingRealms] = useState(false)
  
  const [realms, setRealms] = useKV<Realm[]>('aetheria-realms', [])
  const [quests, setQuests] = useKV<Quest[]>('aetheria-quests', [])
  const [submissions, setSubmissions] = useKV<Submission[]>('aetheria-submissions', [])
  const [crystals, setCrystals] = useKV<KnowledgeCrystal[]>('aetheria-crystals', [])
  const [profile, setProfile] = useKV<UserProfile>('aetheria-profile', DEFAULT_PROFILE)

  const currentTheme = theme || 'fantasy'
  const currentRole = role || 'student'
  const themeConfig = THEME_CONFIGS[currentTheme]
  const currentProfile = profile || DEFAULT_PROFILE

  useEffect(() => {
    if (role && profile) {
      const updatedProfile: UserProfile = { ...profile, role }
      setProfile(updatedProfile)
    }
  }, [role])

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
        const newXp = currentProfile.xp + xpGained
        const newLevel = calculateLevel(newXp)
        const updatedProfile: UserProfile = { ...currentProfile, xp: newXp, level: newLevel }
        setProfile(updatedProfile)

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

  const selectedRealm = realms?.find(r => r.id === selectedRealmId)
  const realmQuests = quests?.filter(q => q.realmId === selectedRealmId) || []
  const selectedQuest = quests?.find(q => q.id === selectedQuestId) || null

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <HUDSidebar
        profile={currentProfile}
        theme={currentTheme}
        role={currentRole}
        currentView={currentView}
        onNavigate={setCurrentView}
        onThemeChange={handleThemeChange}
        onRoleToggle={handleRoleToggle}
      />

      <main className="flex-1 overflow-auto">
        {currentView === 'world-map' && (
          <div className="h-full relative">
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
                <Button size="lg" className="gap-2">
                  <Plus size={24} weight="bold" />
                  Create Your First {themeConfig.realmLabel}
                </Button>
              </div>
            )}
          </div>
        )}

        {currentView === 'realm-detail' && selectedRealm && (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{selectedRealm.name}</h1>
              <p className="text-lg text-muted-foreground">{selectedRealm.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={() => setCurrentView('constellation')} variant="outline" className="gap-2">
                <Target size={20} />
                View Constellation
              </Button>
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
          </div>
        )}

        {currentView === 'constellation' && selectedRealm && (
          <div className="h-full flex flex-col">
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
          </div>
        )}

        {currentView === 'quests' && (
          <div className="p-8 space-y-6">
            <h1 className="text-4xl font-bold">All {themeConfig.questLabel}s</h1>
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
          </div>
        )}

        {currentView === 'archives' && (
          <ArchivesView
            crystals={crystals || []}
            theme={currentTheme}
            onAttune={handleAttuneCrystal}
          />
        )}

        {currentView === 'character' && (
          <CharacterSheet
            profile={currentProfile}
            theme={currentTheme}
          />
        )}
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

      <Toaster position="top-right" />
    </div>
  )
}

export default App

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Quest, Submission, Realm, Theme, THEME_CONFIGS } from '@/lib/types'
import { Trash, Eye, CheckCircle, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { formatTimeAgo } from '@/lib/game-utils'

interface TeacherDashboardProps {
  quests: Quest[]
  submissions: Submission[]
  realms: Realm[]
  theme: Theme
  onDeleteQuest: (questId: string) => void
  onDeleteRealm: (realmId: string) => void
}

export function TeacherDashboard({ 
  quests, 
  submissions, 
  realms, 
  theme,
  onDeleteQuest,
  onDeleteRealm 
}: TeacherDashboardProps) {
  const [selectedSubmissions, setSelectedSubmissions] = useState<string | null>(null)
  const themeConfig = THEME_CONFIGS[theme]

  const questSubmissions = submissions.filter(s => s.questId === selectedSubmissions)
  const selectedQuest = quests.find(q => q.id === selectedSubmissions)

  const getQuestStats = (questId: string) => {
    const questSubs = submissions.filter(s => s.questId === questId)
    const completed = questSubs.filter(s => s.score && s.score >= 70).length
    const failed = questSubs.filter(s => s.score && s.score < 70).length
    const avgScore = questSubs.length > 0
      ? questSubs.reduce((sum, s) => sum + (s.score || 0), 0) / questSubs.length
      : 0
    
    return { total: questSubs.length, completed, failed, avgScore: Math.round(avgScore) }
  }

  const handleDeleteQuest = (questId: string) => {
    if (confirm('Are you sure you want to delete this quest? This action cannot be undone.')) {
      onDeleteQuest(questId)
      toast.success('Quest deleted')
    }
  }

  const handleDeleteRealm = (realmId: string) => {
    const realmQuests = quests.filter(q => q.realmId === realmId)
    if (realmQuests.length > 0) {
      toast.error('Cannot delete realm with existing quests. Delete quests first.')
      return
    }
    
    if (confirm('Are you sure you want to delete this realm? This action cannot be undone.')) {
      onDeleteRealm(realmId)
      toast.success('Realm deleted')
    }
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your realms and quests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Realms</div>
          <div className="text-4xl font-bold">{realms.length}</div>
        </Card>
        <Card className="glass-panel p-6">
          <div className="text-sm text-muted-foreground mb-2">Total {themeConfig.questLabel}s</div>
          <div className="text-4xl font-bold">{quests.length}</div>
        </Card>
        <Card className="glass-panel p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Submissions</div>
          <div className="text-4xl font-bold">{submissions.length}</div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Realms</h2>
        {realms.length === 0 ? (
          <Card className="glass-panel p-12 text-center">
            <p className="text-muted-foreground">No realms created yet</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realms.map((realm) => {
              const realmQuests = quests.filter(q => q.realmId === realm.id)
              return (
                <Card key={realm.id} className="glass-panel p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: realm.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">{realm.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {realm.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {realmQuests.length} quests
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRealm(realm.id)}
                      className="flex-shrink-0"
                    >
                      <Trash size={18} className="text-destructive" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{themeConfig.questLabel}s</h2>
        {quests.length === 0 ? (
          <Card className="glass-panel p-12 text-center">
            <p className="text-muted-foreground">No quests created yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {quests.map((quest) => {
              const stats = getQuestStats(quest.id)
              const realm = realms.find(r => r.id === quest.realmId)
              
              return (
                <Card key={quest.id} className="glass-panel p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{quest.name}</h3>
                        {quest.type === 'boss' && (
                          <Badge variant="destructive" className="text-xs">Boss</Badge>
                        )}
                        {quest.type === 'redemption' && (
                          <Badge variant="outline" className="text-xs">Redemption</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {realm?.name} • {quest.xpValue} {themeConfig.xpLabel}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Submissions:</span>
                          <span className="font-medium">{stats.total}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-accent" />
                          <span>{stats.completed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle size={16} className="text-destructive" />
                          <span>{stats.failed}</span>
                        </div>
                        {stats.total > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Avg:</span>
                            <span className="font-medium">{stats.avgScore}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedSubmissions(quest.id)}
                        disabled={stats.total === 0}
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteQuest(quest.id)}
                      >
                        <Trash size={18} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selectedSubmissions} onOpenChange={() => setSelectedSubmissions(null)}>
        <DialogContent className="glass-panel max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedQuest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedQuest.name} - Submissions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {questSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No submissions yet
                  </div>
                ) : (
                  questSubmissions.map((submission) => (
                    <Card key={submission.id} className="glass-panel p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={(submission.score || 0) >= 70 ? 'default' : 'destructive'}
                              className="text-lg px-3 py-1"
                            >
                              {submission.score}%
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatTimeAgo(submission.submittedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Student Response:</h4>
                            <p className="text-sm text-muted-foreground">{submission.content}</p>
                          </div>
                          {submission.feedback && (
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Oracle Feedback:</h4>
                              <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

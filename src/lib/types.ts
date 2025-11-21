export type Theme = 'fantasy' | 'scifi' | 'medieval' | 'modern'
export type Role = 'teacher' | 'student'

export interface ThemeConfig {
  name: string
  teacherTitle: string
  studentTitle: string
  realmLabel: string
  questLabel: string
  archiveLabel: string
  oracleLabel: string
  xpLabel: string
  geometry: 'octahedron' | 'icosahedron' | 'dodecahedron' | 'sphere'
}

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  fantasy: {
    name: 'High Fantasy',
    teacherTitle: 'Game Master',
    studentTitle: 'Adventurer',
    realmLabel: 'Realm',
    questLabel: 'Quest',
    archiveLabel: 'Archives',
    oracleLabel: 'Oracle',
    xpLabel: 'Glory',
    geometry: 'octahedron'
  },
  scifi: {
    name: 'Cyberpunk',
    teacherTitle: 'Admin',
    studentTitle: 'Operative',
    realmLabel: 'Sector',
    questLabel: 'Mission',
    archiveLabel: 'Database',
    oracleLabel: 'AI Core',
    xpLabel: 'Data',
    geometry: 'icosahedron'
  },
  medieval: {
    name: 'Royal Court',
    teacherTitle: 'Lord',
    studentTitle: 'Vassal',
    realmLabel: 'Domain',
    questLabel: 'Decree',
    archiveLabel: 'Library',
    oracleLabel: 'Council',
    xpLabel: 'Honor',
    geometry: 'dodecahedron'
  },
  modern: {
    name: 'Glass Classroom',
    teacherTitle: 'Teacher',
    studentTitle: 'Student',
    realmLabel: 'Course',
    questLabel: 'Assignment',
    archiveLabel: 'Resources',
    oracleLabel: 'Evaluator',
    xpLabel: 'Points',
    geometry: 'sphere'
  }
}

export interface Realm {
  id: string
  name: string
  description: string
  color: string
  position?: { x: number; y: number; z: number }
  createdAt: number
}

export type QuestType = 'standard' | 'boss' | 'redemption'
export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'failed'

export interface Quest {
  id: string
  realmId: string
  name: string
  description: string
  type: QuestType
  xpValue: number
  dueDate?: number
  status: QuestStatus
  prerequisiteIds?: string[]
  createdAt: number
}

export interface Submission {
  id: string
  questId: string
  studentId: string
  content: string
  score?: number
  feedback?: string
  submittedAt: number
  evaluatedAt?: number
}

export interface KnowledgeCrystal {
  id: string
  questId: string
  studentId: string
  title: string
  content: string
  isAttuned: boolean
  createdAt: number
}

export interface Artifact {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: number
  questId: string
}

export interface AvatarCustomization {
  skinTone: string
  hairStyle: string
  hairColor: string
  eyeColor: string
  bodyType: string
  outfit: string
  outfitColor: string
  accessories: string[]
}

export interface UserProfile {
  id: string
  name: string
  avatarUrl?: string
  avatar?: AvatarCustomization
  role: Role
  xp: number
  level: number
  artifacts: Artifact[]
}

export interface ConstellationNode {
  id: string
  questId: string
  x: number
  y: number
  status: 'unlit' | 'lit'
  connections: string[]
}

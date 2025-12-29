import { describe, it, expect } from 'vitest'
import { 
  calculateLevel, 
  getXpForNextLevel, 
  getRarityFromScore,
  getLevelTitle,
  generateId,
  formatTimeAgo
} from './game-utils'

describe('calculateLevel', () => {
  it('returns level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1)
  })
  
  it('returns level 2 for 100 XP', () => {
    expect(calculateLevel(100)).toBe(2)
  })
  
  it('returns level 3 for 250 XP', () => {
    expect(calculateLevel(250)).toBe(3)
  })
  
  it('returns level 4 for 500 XP', () => {
    expect(calculateLevel(500)).toBe(4)
  })
  
  it('returns correct level for edge cases', () => {
    expect(calculateLevel(99)).toBe(1)
    expect(calculateLevel(249)).toBe(2)
    expect(calculateLevel(499)).toBe(3)
  })
})

describe('getXpForNextLevel', () => {
  it('returns 100 XP needed for level 1', () => {
    expect(getXpForNextLevel(0)).toBe(100)
  })
  
  it('returns 250 XP needed for level 2', () => {
    expect(getXpForNextLevel(100)).toBe(250)
  })
  
  it('returns 500 XP needed for level 3', () => {
    expect(getXpForNextLevel(250)).toBe(500)
  })
})

describe('getRarityFromScore', () => {
  it('returns legendary for 98+', () => {
    expect(getRarityFromScore(98)).toBe('legendary')
    expect(getRarityFromScore(100)).toBe('legendary')
  })
  
  it('returns epic for 95-97', () => {
    expect(getRarityFromScore(95)).toBe('epic')
    expect(getRarityFromScore(97)).toBe('epic')
  })
  
  it('returns rare for 90-94', () => {
    expect(getRarityFromScore(90)).toBe('rare')
    expect(getRarityFromScore(94)).toBe('rare')
  })
  
  it('returns common for <90', () => {
    expect(getRarityFromScore(89)).toBe('common')
    expect(getRarityFromScore(0)).toBe('common')
    expect(getRarityFromScore(50)).toBe('common')
  })
})

describe('getLevelTitle', () => {
  it('returns correct titles for students', () => {
    expect(getLevelTitle(1, 'student')).toBe('Novice')
    expect(getLevelTitle(2, 'student')).toBe('Apprentice')
    expect(getLevelTitle(3, 'student')).toBe('Adept')
    expect(getLevelTitle(8, 'student')).toBe('Legend')
  })
  
  it('returns correct titles for teachers', () => {
    expect(getLevelTitle(1, 'teacher')).toBe('Initiate')
    expect(getLevelTitle(2, 'teacher')).toBe('Mentor')
    expect(getLevelTitle(3, 'teacher')).toBe('Master')
    expect(getLevelTitle(8, 'teacher')).toBe('Transcendent')
  })
  
  it('caps at highest title for high levels', () => {
    expect(getLevelTitle(100, 'student')).toBe('Legend')
    expect(getLevelTitle(100, 'teacher')).toBe('Transcendent')
  })
})

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
  
  it('generates IDs with expected format', () => {
    const id = generateId()
    expect(id).toMatch(/^\d+-[a-z0-9]+$/)
  })
})

describe('formatTimeAgo', () => {
  it('returns "just now" for recent timestamps', () => {
    const now = Date.now()
    expect(formatTimeAgo(now)).toBe('just now')
    expect(formatTimeAgo(now - 30000)).toBe('just now') // 30 seconds ago
  })
  
  it('returns minutes for timestamps within an hour', () => {
    const now = Date.now()
    expect(formatTimeAgo(now - 2 * 60 * 1000)).toBe('2m ago')
    expect(formatTimeAgo(now - 30 * 60 * 1000)).toBe('30m ago')
  })
  
  it('returns hours for timestamps within a day', () => {
    const now = Date.now()
    expect(formatTimeAgo(now - 2 * 60 * 60 * 1000)).toBe('2h ago')
    expect(formatTimeAgo(now - 12 * 60 * 60 * 1000)).toBe('12h ago')
  })
  
  it('returns days for older timestamps', () => {
    const now = Date.now()
    expect(formatTimeAgo(now - 2 * 24 * 60 * 60 * 1000)).toBe('2d ago')
    expect(formatTimeAgo(now - 7 * 24 * 60 * 60 * 1000)).toBe('7d ago')
  })
})

import { describe, it, expect } from 'vitest'
import {
  calculateLevel,
  getXpForNextLevel,
  getLevelTitle,
  generateArtifactName,
  getRarityFromScore,
  formatTimeAgo,
  generateId
} from './game-utils'

describe('game-utils', () => {
  describe('calculateLevel', () => {
    it('should return 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1)
    })

    it('should return correct level for thresholds', () => {
      expect(calculateLevel(99)).toBe(1)
      expect(calculateLevel(100)).toBe(2)
      expect(calculateLevel(249)).toBe(2)
      expect(calculateLevel(250)).toBe(3)
      expect(calculateLevel(7999)).toBe(7)
      expect(calculateLevel(8000)).toBe(8)
    })
  })

  describe('getXpForNextLevel', () => {
    it('should return next threshold', () => {
      expect(getXpForNextLevel(0)).toBe(100)
      expect(getXpForNextLevel(100)).toBe(250)
      expect(getXpForNextLevel(7999)).toBe(8000)
    })
  })

  describe('getLevelTitle', () => {
    it('should return correct titles for student', () => {
      expect(getLevelTitle(1, 'student')).toBe('Novice')
      expect(getLevelTitle(8, 'student')).toBe('Legend')
    })

    it('should return correct titles for teacher', () => {
      expect(getLevelTitle(1, 'teacher')).toBe('Initiate')
      expect(getLevelTitle(8, 'teacher')).toBe('Transcendent')
    })
  })

  describe('getRarityFromScore', () => {
    it('should return correct rarity', () => {
      expect(getRarityFromScore(98)).toBe('legendary')
      expect(getRarityFromScore(95)).toBe('epic')
      expect(getRarityFromScore(90)).toBe('rare')
      expect(getRarityFromScore(89)).toBe('common')
    })
  })

  describe('formatTimeAgo', () => {
    it('should format time correctly', () => {
      const now = Date.now()
      expect(formatTimeAgo(now)).toBe('just now')
      expect(formatTimeAgo(now - 61 * 1000)).toBe('1m ago')
      expect(formatTimeAgo(now - 3601 * 1000)).toBe('1h ago')
      expect(formatTimeAgo(now - 86401 * 1000)).toBe('1d ago')
    })
  })

  describe('generateArtifactName', () => {
      it('should return a string', () => {
          const name = generateArtifactName(95, 'Test Quest', 'fantasy');
          expect(typeof name).toBe('string');
          expect(name.length).toBeGreaterThan(0);
      })
  })

  describe('generateId', () => {
      it('should return a unique string', () => {
          const id1 = generateId();
          const id2 = generateId();
          expect(id1).not.toBe(id2);
          expect(typeof id1).toBe('string');
      })
  })
})

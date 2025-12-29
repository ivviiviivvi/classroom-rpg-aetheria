import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock GitHub Spark
global.window = global.window || {}
global.window.spark = {
  llm: vi.fn().mockResolvedValue('{"score": 85, "feedback": "Good work!"}')
} as any

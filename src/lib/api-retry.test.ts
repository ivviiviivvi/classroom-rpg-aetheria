import { describe, it, expect, vi } from 'vitest'
import { retryWithBackoff } from './api-retry'

describe('retryWithBackoff', () => {
  it('succeeds on first try', async () => {
    const fn = vi.fn().mockResolvedValue('success')
    const result = await retryWithBackoff(fn)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })
  
  it('retries on failure', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success')
    
    const result = await retryWithBackoff(fn, 3, 10)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })
  
  it('retries up to max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'))
    
    await expect(retryWithBackoff(fn, 3, 10)).rejects.toThrow('fail')
    expect(fn).toHaveBeenCalledTimes(3)
  })
  
  it('uses exponential backoff', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success')
    
    const startTime = Date.now()
    await retryWithBackoff(fn, 3, 10)
    const duration = Date.now() - startTime
    
    // Should have delays of 10ms and 20ms = 30ms minimum (with some tolerance)
    expect(duration).toBeGreaterThanOrEqual(25)
    expect(fn).toHaveBeenCalledTimes(3)
  })
  
  it('throws after max retries exceeded', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('persistent failure'))
    
    await expect(retryWithBackoff(fn, 2, 10)).rejects.toThrow('persistent failure')
    expect(fn).toHaveBeenCalledTimes(2)
  })
  
  it('uses custom max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'))
    
    await expect(retryWithBackoff(fn, 5, 10)).rejects.toThrow('fail')
    expect(fn).toHaveBeenCalledTimes(5)
  })
  
  it('uses custom base delay', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success')
    
    const startTime = Date.now()
    await retryWithBackoff(fn, 3, 50)
    const duration = Date.now() - startTime
    
    // Should have delay of at least 50ms
    expect(duration).toBeGreaterThanOrEqual(50)
  })
})

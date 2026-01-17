import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { SoundSettings } from './SoundSettings'

// Mock useKV
vi.mock('@github/spark/hooks', () => ({
  useKV: (key: string, initialValue: any) => {
    // Return initialValue and a setter function
    return [initialValue, vi.fn()]
  }
}))

// Mock phosphor icons
vi.mock('@phosphor-icons/react', () => ({
  SpeakerHigh: () => <span data-testid="speaker-high" />,
  SpeakerSlash: () => <span data-testid="speaker-slash" />,
}))

// Mock ResizeObserver for Radix UI
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('SoundSettings', () => {
  it('renders trigger button with accessible name', () => {
    render(<SoundSettings />)
    const trigger = screen.getByRole('button', { name: /Sound settings/i })
    expect(trigger).toBeInTheDocument()
  })

  it('shows accessible mute toggle when opened', async () => {
    render(<SoundSettings />)

    const trigger = screen.getByRole('button', { name: /Sound settings/i })
    fireEvent.click(trigger)

    // Check for mute toggle
    // Note: The text might be "Mute sound" or "Unmute sound" depending on default state.
    // Default mock returns initialValue (false for muted), so it should be "Mute sound".
    expect(await screen.findByRole('button', { name: /Mute sound/i })).toBeInTheDocument()
  })
})

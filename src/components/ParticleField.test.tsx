import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ParticleField } from './ParticleField'

describe('ParticleField', () => {
  it('renders without crashing', () => {
    const { container } = render(<ParticleField />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})

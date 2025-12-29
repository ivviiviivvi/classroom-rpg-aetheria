import { describe, it, expect } from 'vitest'
import { sanitizeHTML, sanitizePlainText } from './sanitize'

describe('sanitizeHTML', () => {
  it('allows safe HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>'
    const output = sanitizeHTML(input)
    expect(output).toContain('<p>')
    expect(output).toContain('<strong>')
    expect(output).toContain('Hello')
    expect(output).toContain('world')
  })
  
  it('removes script tags', () => {
    const input = '<p>Hello</p><script>alert("XSS")</script>'
    const output = sanitizeHTML(input)
    expect(output).not.toContain('<script>')
    expect(output).not.toContain('alert')
    expect(output).toContain('Hello')
  })
  
  it('removes event handlers', () => {
    const input = '<p onclick="alert(1)">Click me</p>'
    const output = sanitizeHTML(input)
    expect(output).not.toContain('onclick')
    expect(output).not.toContain('alert')
    expect(output).toContain('Click me')
  })
  
  it('removes iframe tags', () => {
    const input = '<p>Hello</p><iframe src="evil.com"></iframe>'
    const output = sanitizeHTML(input)
    expect(output).not.toContain('<iframe>')
    expect(output).not.toContain('evil.com')
    expect(output).toContain('Hello')
  })
  
  it('removes javascript: URLs', () => {
    const input = '<a href="javascript:alert(1)">Click</a>'
    const output = sanitizeHTML(input)
    expect(output).not.toContain('javascript:')
    expect(output).not.toContain('alert')
  })
  
  it('allows basic formatting tags', () => {
    const input = '<p>Text with <strong>bold</strong>, <em>italic</em>, and <u>underline</u></p>'
    const output = sanitizeHTML(input)
    expect(output).toContain('<strong>')
    expect(output).toContain('<em>')
    expect(output).toContain('<u>')
  })
  
  it('allows lists', () => {
    const input = '<ul><li>Item 1</li><li>Item 2</li></ul>'
    const output = sanitizeHTML(input)
    expect(output).toContain('<ul>')
    expect(output).toContain('<li>')
    expect(output).toContain('Item 1')
  })
})

describe('sanitizePlainText', () => {
  it('removes angle brackets', () => {
    const input = 'Hello <script>alert(1)</script> world'
    const output = sanitizePlainText(input)
    expect(output).not.toContain('<')
    expect(output).not.toContain('>')
    expect(output).toContain('Hello')
    expect(output).toContain('world')
  })
  
  it('keeps other characters', () => {
    const input = 'Hello, world! 123 @#$%'
    const output = sanitizePlainText(input)
    expect(output).toBe(input)
  })
  
  it('handles empty strings', () => {
    expect(sanitizePlainText('')).toBe('')
  })
  
  it('removes multiple angle brackets', () => {
    const input = '<<<test>>>'
    const output = sanitizePlainText(input)
    expect(output).toBe('test')
  })
})

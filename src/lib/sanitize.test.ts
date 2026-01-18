import { describe, it, expect } from 'vitest'
import { sanitizeHTML, sanitizePlainText, sanitizeCSS } from './sanitize'

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

describe('sanitizeCSS', () => {
  it('removes curly braces to prevent block breakouts', () => {
    const input = 'red; } body { display: none'
    const output = sanitizeCSS(input)
    expect(output).not.toContain('{')
    expect(output).not.toContain('}')
    // Note: The sanitization doesn't normalize spaces, so "red  body  display: none" is expected
    // because the ";" and "}" and "{" are replaced/removed leaving the spaces around them.
    expect(output).toContain('red')
    expect(output).toContain('body')
    expect(output).toContain('display: none')
  })

  it('removes semicolons to prevent property injection', () => {
    const input = 'red; color: blue'
    const output = sanitizeCSS(input)
    expect(output).not.toContain(';')
    expect(output).toBe('red color: blue')
  })

  it('removes angle brackets to prevent HTML injection', () => {
    const input = 'red</style><script>alert(1)</script>'
    const output = sanitizeCSS(input)
    expect(output).not.toContain('<')
    expect(output).not.toContain('>')
  })

  it('removes newlines', () => {
    const input = 'red\nblue\rgreen'
    const output = sanitizeCSS(input)
    expect(output).toBe('redbluegreen')
  })

  it('preserves safe color values', () => {
    expect(sanitizeCSS('#ff0000')).toBe('#ff0000')
    expect(sanitizeCSS('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)')
    expect(sanitizeCSS('hsl(0, 100%, 50%)')).toBe('hsl(0, 100%, 50%)')
    expect(sanitizeCSS('var(--primary)')).toBe('var(--primary)')
  })
})

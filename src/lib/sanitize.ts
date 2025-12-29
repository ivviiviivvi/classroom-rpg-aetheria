import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - Potentially unsafe HTML string
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'b', 'i', 'u'],
    ALLOWED_ATTR: []
  })
}

/**
 * Sanitizes plain text input by removing potentially dangerous characters
 * @param input - User input string
 * @returns Sanitized plain text
 */
export function sanitizePlainText(input: string): string {
  return input.replace(/[<>]/g, '')
}

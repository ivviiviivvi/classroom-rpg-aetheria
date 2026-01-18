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
  // Remove angle brackets and other potentially dangerous characters
  return input
    .replace(/[<>]/g, '')  // Remove angle brackets
    .replace(/["'\0]/g, '')  // Remove quotes and null bytes
    .trim()
}

/**
 * Sanitizes CSS values to prevent injection attacks
 * @param input - Potentially unsafe CSS value
 * @returns Sanitized CSS value
 */
export function sanitizeCSS(input: string): string {
  // Remove characters that could break out of a CSS rule or property
  return input
    .replace(/[;{}]/g, '') // Prevent breaking out of rule/block
    .replace(/[<>]/g, '')  // Prevent HTML injection
    .replace(/[\r\n]/g, '') // Remove newlines
    .trim()
}

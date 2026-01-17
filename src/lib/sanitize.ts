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
 * Sanitizes CSS values to prevent CSS injection
 * @param value - Potentially unsafe CSS value
 * @returns Sanitized CSS value
 */
export function sanitizeCSS(value: string): string {
  // Remove potentially dangerous characters for CSS injection
  // ; - separates properties
  // {} - blocks
  // <> - HTML tags (though in <style> context less relevant but good practice)
  return value.replace(/[;{}<>]/g, '').trim()
}


import { describe, it, expect } from 'vitest'
import { sanitizeLLMInput } from './utils'

describe('sanitizeLLMInput', () => {
  it('should escape closing XML tags', () => {
    const input = 'This is a test </student_response>';
    const expected = 'This is a test <\\/student_response>';
    expect(sanitizeLLMInput(input)).toBe(expected);
  });

  it('should not alter input without closing tags', () => {
    const input = 'This is a safe string';
    expect(sanitizeLLMInput(input)).toBe(input);
  });

  it('should handle multiple closing tags', () => {
    const input = '</one> and </two>';
    const expected = '<\\/one> and <\\/two>';
    expect(sanitizeLLMInput(input)).toBe(expected);
  });
});

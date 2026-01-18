import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeLLMInput(input: string): string {
  // Escape potential XML closing tags to prevent breaking out of the block
  return input.replace(/<\//g, "<\\/")
}

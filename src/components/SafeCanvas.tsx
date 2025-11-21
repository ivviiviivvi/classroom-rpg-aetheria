import { ReactNode, useEffect } from 'react'

interface SafeCanvasWrapperProps {
  children: ReactNode
}

export function SafeCanvasWrapper({ children }: SafeCanvasWrapperProps) {
  useEffect(() => {
    const originalError = console.error
    const originalWarn = console.warn
    
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      
      if (
        message.includes('R3F: Cannot set') ||
        message.includes('delete child.object.__r3f') ||
        message.includes('undefined is not an object') ||
        message.includes('data-component-loc-end')
      ) {
        return
      }
      
      originalError.apply(console, args)
    }
    
    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      
      if (
        message.includes('R3F:') ||
        message.includes('__r3f')
      ) {
        return
      }
      
      originalWarn.apply(console, args)
    }
    
    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])
  
  return <>{children}</>
}

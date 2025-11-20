import { useKV } from '@github/spark/hooks'
import { Theme, Role } from '@/lib/types'
import { useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useKV<Theme>('aetheria-theme', 'fantasy')

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  return [theme, setTheme] as const
}

export function useRole() {
  const [role, setRole] = useKV<Role>('aetheria-role', 'student')
  return [role, setRole] as const
}

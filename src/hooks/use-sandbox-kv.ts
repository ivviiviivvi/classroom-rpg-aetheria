/**
 * Sandbox-aware KV storage hook
 * 
 * Wraps the GitHub Spark useKV hook to provide sandbox-aware storage keys.
 * When in sandbox mode, all keys are prefixed with 'sandbox-' to isolate data.
 */

import { useKV as useSparkKV } from '@github/spark/hooks'
import { useEffect, useState } from 'react'
import { 
  getSandboxKey, 
  isSandboxMode, 
  needsSandboxInitialization,
  initializeSandboxData 
} from '@/lib/sandbox-mode'

/**
 * Sandbox-aware version of useKV hook
 * Automatically handles key prefixing and demo data initialization
 */
export function useSandboxKV<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const sandboxKey = getSandboxKey(key)
  const [value, setValue] = useSparkKV<T>(sandboxKey, defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize sandbox data on first mount
  useEffect(() => {
    const inSandboxMode = isSandboxMode()
    const needsInit = needsSandboxInitialization()
    
    if (inSandboxMode && !isInitialized && needsInit) {
      const demoData = initializeSandboxData()
      
      // Map keys to demo data with proper typing
      type DemoDataMap = {
        'aetheria-realms': typeof demoData.realms
        'aetheria-quests': typeof demoData.quests
        'aetheria-profile': typeof demoData.profile
        'aetheria-submissions': typeof demoData.submissions
        'aetheria-crystals': typeof demoData.crystals
        'aetheria-all-profiles': typeof demoData.profile[]
      }
      
      const keyToDataMap: Partial<DemoDataMap> = {
        'aetheria-realms': demoData.realms,
        'aetheria-quests': demoData.quests,
        'aetheria-profile': demoData.profile,
        'aetheria-submissions': demoData.submissions,
        'aetheria-crystals': demoData.crystals,
        'aetheria-all-profiles': [demoData.profile]
      }
      
      // If this key has demo data, set it
      if (key in keyToDataMap) {
        setValue(keyToDataMap[key as keyof DemoDataMap] as T)
      }
      
      setIsInitialized(true)
    }
  }, [key, isInitialized, setValue])

  return [value, setValue]
}

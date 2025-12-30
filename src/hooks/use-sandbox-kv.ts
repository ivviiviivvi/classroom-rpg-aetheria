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
} from './sandbox-mode'

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
    if (isSandboxMode() && !isInitialized && needsSandboxInitialization()) {
      const demoData = initializeSandboxData()
      
      // Map keys to demo data
      const keyToDataMap: Record<string, any> = {
        'aetheria-realms': demoData.realms,
        'aetheria-quests': demoData.quests,
        'aetheria-profile': demoData.profile,
        'aetheria-submissions': demoData.submissions,
        'aetheria-crystals': demoData.crystals,
        'aetheria-all-profiles': [demoData.profile]
      }
      
      // If this key has demo data, set it
      if (key in keyToDataMap) {
        setValue(keyToDataMap[key])
      }
      
      setIsInitialized(true)
    }
  }, [key, isInitialized, setValue])

  return [value, setValue]
}

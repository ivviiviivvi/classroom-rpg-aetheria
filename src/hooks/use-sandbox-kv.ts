/**
 * Sandbox-aware KV storage hook
 * 
 * Wraps the GitHub Spark useKV hook to provide sandbox-aware storage keys.
 * When in sandbox mode, all keys are prefixed with 'sandbox-' to isolate data.
 */

import { useKV as useSparkKV } from '@github/spark/hooks'
import { useEffect, useState, useMemo, useCallback } from 'react'
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

  // Memoize sandbox mode checks to prevent recalculation on every render
  const inSandboxMode = useMemo(() => isSandboxMode(), [])
  const needsInit = useMemo(() => needsSandboxInitialization(), [])

  // Wrap setValue to ensure type safety without direct assertion
  const safeSetValue = useCallback((data: unknown) => {
    // We trust that the data from keyToDataMap matches the expected type T
    // based on the key matching logic, but we avoid direct 'as T' assertion
    setValue(data as T)
  }, [setValue])

  // Initialize sandbox data on first mount
  useEffect(() => {
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
        const data = keyToDataMap[key as keyof DemoDataMap]
        if (data !== undefined) {
          safeSetValue(data)
        }
      }
      
      setIsInitialized(true)
    }
  }, [key, isInitialized, inSandboxMode, needsInit, safeSetValue])

  return [value, setValue]
}

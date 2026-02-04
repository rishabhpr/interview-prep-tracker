import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'interview-prep-tracker-v2'

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Combine keys to create full storage key
  const fullKey = `${STORAGE_KEY}:${key}`
  
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const stored = localStorage.getItem(fullKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log(`[Storage] Loaded ${key}:`, Object.keys(parsed).length, 'keys')
        return parsed
      }
    } catch (e) {
      console.error('[Storage] Load error:', e)
    }
    return initialValue
  })

  // Save to localStorage whenever value changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(fullKey, JSON.stringify(value))
      console.log(`[Storage] Saved ${key}:`, Object.keys(value as object).length, 'keys')
    } catch (e) {
      console.error('[Storage] Save error:', e)
      // If quota exceeded, alert user
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('Storage full! Please export and clear some data.')
      }
    }
  }, [fullKey, value])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === fullKey && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fullKey])

  return [value, setValue]
}

// Helper to export all data
export function exportData(): string {
  const data: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_KEY)) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || 'null')
      } catch {}
    }
  }
  return JSON.stringify(data, null, 2)
}

// Helper to import data
export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json)
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value))
    })
    return true
  } catch {
    return false
  }
}

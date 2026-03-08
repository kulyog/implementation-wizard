// /src/hooks/useClipboard.js
// Clipboard copy with 2-second confirmation state.

import { useState, useCallback } from 'react'

/**
 * Returns { copy(text), copied }
 * `copied` is true for 2000ms after a successful copy — use to drive button label change.
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch {
      return false
    }
  }, [])

  return { copy, copied }
}

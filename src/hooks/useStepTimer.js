// /src/hooks/useStepTimer.js
// Live elapsed time counter for In Progress steps (F-22).
// Returns formatted elapsed time string or null.

import { useState, useEffect, useRef } from 'react'

/**
 * @param {object} stepRecord - StepRecord from project state
 * @returns {string|null} formatted duration or null
 */
export function useStepTimer(stepRecord) {
  const [tick, setTick] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (stepRecord.status === 'in_progress') {
      intervalRef.current = setInterval(() => {
        setTick((t) => t + 1)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [stepRecord.status])

  if (stepRecord.status === 'in_progress' && stepRecord.started_at) {
    const elapsed =
      Math.floor((Date.now() - new Date(stepRecord.started_at).getTime()) / 1000) +
      (stepRecord.time_in_step_seconds || 0)
    return formatDuration(elapsed)
  }

  if (stepRecord.status === 'complete' && stepRecord.time_in_step_seconds > 0) {
    return formatDuration(stepRecord.time_in_step_seconds)
  }

  return null
}

function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0s'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

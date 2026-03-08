// /src/tests/stepLogic.test.js
// Vitest unit tests for step sequencing logic (BR-01 to BR-10).
// Run with: npm test

import { describe, it, expect } from 'vitest'
import {
  canMarkComplete,
  canMarkBlocked,
  deriveProjectStatus,
  detectSequenceWarning,
  getActiveStepNumber,
  countCompletedSteps,
  getProgressPercent,
} from '../utils/stepLogic'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal steps array where all steps are 'pending'. */
function makeSteps(count = 24) {
  return Array.from({ length: count }, (_, i) => ({
    step_number: i + 1,
    status: 'pending',
  }))
}

/**
 * Return a new steps array with the specified step numbers set to 'complete'.
 * @param {Array} steps
 * @param {number[]} completedNums
 */
function withComplete(steps, completedNums) {
  return steps.map((s) =>
    completedNums.includes(s.step_number) ? { ...s, status: 'complete' } : s
  )
}

/**
 * Return a new steps array with the specified step number set to given status.
 */
function withStatus(steps, stepNumber, status) {
  return steps.map((s) =>
    s.step_number === stepNumber ? { ...s, status } : s
  )
}

// ---------------------------------------------------------------------------
// BR-01: canMarkComplete — strict sequential enforcement
// ---------------------------------------------------------------------------

describe('canMarkComplete — BR-01 sequential enforcement', () => {
  it('allows step 1 to be marked complete with no prior steps', () => {
    const steps = makeSteps()
    expect(canMarkComplete(1, steps)).toBe(true)
  })

  it('blocks step 2 when step 1 is pending', () => {
    const steps = makeSteps()
    expect(canMarkComplete(2, steps)).toBe(false)
  })

  it('allows step 2 when step 1 is complete', () => {
    const steps = withComplete(makeSteps(), [1])
    expect(canMarkComplete(2, steps)).toBe(true)
  })

  it('blocks step 3 when step 2 is pending (step 1 complete)', () => {
    const steps = withComplete(makeSteps(), [1])
    expect(canMarkComplete(3, steps)).toBe(false)
  })

  it('allows step 3 when steps 1 and 2 are complete', () => {
    const steps = withComplete(makeSteps(), [1, 2])
    expect(canMarkComplete(3, steps)).toBe(true)
  })

  it('blocks step 4 when step 3 is not complete', () => {
    const steps = withComplete(makeSteps(), [1, 2])
    expect(canMarkComplete(4, steps)).toBe(false)
  })

  it('allows step 4 when steps 1–3 are complete', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3])
    expect(canMarkComplete(4, steps)).toBe(true)
  })

  it('blocks step 7 when not all of 1–6 are complete', () => {
    // Steps 1–5 complete, step 6 pending
    const steps = withComplete(makeSteps(), [1, 2, 3, 4, 5])
    expect(canMarkComplete(7, steps)).toBe(false)
  })

  it('allows step 7 when steps 1–6 are all complete', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3, 4, 5, 6])
    expect(canMarkComplete(7, steps)).toBe(true)
  })

  it('allows step 24 only when steps 1–23 are all complete', () => {
    const allButLast = Array.from({ length: 23 }, (_, i) => i + 1)
    const steps = withComplete(makeSteps(), allButLast)
    expect(canMarkComplete(24, steps)).toBe(true)
  })

  it('blocks step 24 when step 23 is not complete', () => {
    const allButLast = Array.from({ length: 22 }, (_, i) => i + 1)
    const steps = withComplete(makeSteps(), allButLast)
    expect(canMarkComplete(24, steps)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// BR-01 Exception: Steps 5 and 6 may run in parallel
// ---------------------------------------------------------------------------

describe('canMarkComplete — Steps 5 and 6 parallel exception', () => {
  it('allows step 5 to complete when steps 1–4 are complete, even if step 6 is pending', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3, 4])
    // Step 6 is still pending — should NOT block step 5
    expect(canMarkComplete(5, steps)).toBe(true)
  })

  it('allows step 6 to complete when steps 1–4 are complete, even if step 5 is pending', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3, 4])
    // Step 5 is still pending — should NOT block step 6
    expect(canMarkComplete(6, steps)).toBe(true)
  })

  it('allows step 5 to complete when step 6 is already complete (and 1–4 complete)', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3, 4, 6])
    expect(canMarkComplete(5, steps)).toBe(true)
  })

  it('allows step 6 to complete when step 5 is already complete (and 1–4 complete)', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3, 4, 5])
    expect(canMarkComplete(6, steps)).toBe(true)
  })

  it('allows step 6 to complete when step 5 is in_progress (and 1–4 complete)', () => {
    let steps = withComplete(makeSteps(), [1, 2, 3, 4])
    steps = withStatus(steps, 5, 'in_progress')
    expect(canMarkComplete(6, steps)).toBe(true)
  })

  it('allows step 5 to complete when step 6 is in_progress (and 1–4 complete)', () => {
    let steps = withComplete(makeSteps(), [1, 2, 3, 4])
    steps = withStatus(steps, 6, 'in_progress')
    expect(canMarkComplete(5, steps)).toBe(true)
  })

  it('blocks step 5 when step 4 is NOT complete (exception does not override prior steps)', () => {
    // Steps 1–3 complete, step 4 pending
    const steps = withComplete(makeSteps(), [1, 2, 3])
    expect(canMarkComplete(5, steps)).toBe(false)
  })

  it('blocks step 6 when step 4 is NOT complete (exception does not override prior steps)', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3])
    expect(canMarkComplete(6, steps)).toBe(false)
  })

  it('blocks step 5 when step 3 is NOT complete', () => {
    const steps = withComplete(makeSteps(), [1, 2])
    expect(canMarkComplete(5, steps)).toBe(false)
  })

  it('the exception is ONLY for steps 5 and 6 — step 7 still requires step 6 complete', () => {
    // Steps 1–5 complete, step 6 pending
    const steps = withComplete(makeSteps(), [1, 2, 3, 4, 5])
    // Step 6 is NOT complete — step 7 must be blocked
    expect(canMarkComplete(7, steps)).toBe(false)
  })

  it('the exception is ONLY for steps 5 and 6 — step 7 still requires step 5 complete', () => {
    // Steps 1–4 and 6 complete, step 5 pending
    const steps = withComplete(makeSteps(), [1, 2, 3, 4, 6])
    expect(canMarkComplete(7, steps)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// BR-02: deriveProjectStatus
// ---------------------------------------------------------------------------

describe('deriveProjectStatus — BR-02', () => {
  it('returns "active" when all steps are pending', () => {
    const steps = makeSteps()
    expect(deriveProjectStatus(steps)).toBe('active')
  })

  it('returns "active" when some steps are complete', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3])
    expect(deriveProjectStatus(steps)).toBe('active')
  })

  it('returns "complete" when all 24 steps are complete', () => {
    const allNums = Array.from({ length: 24 }, (_, i) => i + 1)
    const steps = withComplete(makeSteps(), allNums)
    expect(deriveProjectStatus(steps)).toBe('complete')
  })

  it('returns "active" when 23 of 24 steps are complete', () => {
    const allButLast = Array.from({ length: 23 }, (_, i) => i + 1)
    const steps = withComplete(makeSteps(), allButLast)
    expect(deriveProjectStatus(steps)).toBe('active')
  })
})

// ---------------------------------------------------------------------------
// BR-04: canMarkBlocked — requires non-empty reason
// ---------------------------------------------------------------------------

describe('canMarkBlocked — BR-04', () => {
  it('returns false for empty string', () => {
    expect(canMarkBlocked('')).toBe(false)
  })

  it('returns false for whitespace-only string', () => {
    expect(canMarkBlocked('   ')).toBe(false)
  })

  it('returns false for null', () => {
    expect(canMarkBlocked(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(canMarkBlocked(undefined)).toBe(false)
  })

  it('returns true for a non-empty reason', () => {
    expect(canMarkBlocked('Waiting for API access')).toBe(true)
  })

  it('returns true for a single non-space character', () => {
    expect(canMarkBlocked('x')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// BR-10: detectSequenceWarning — out-of-order completion detection
// ---------------------------------------------------------------------------

describe('detectSequenceWarning — BR-10', () => {
  it('returns null when no later steps are in progress or complete', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3])
    expect(detectSequenceWarning(3, steps)).toBeNull()
  })

  it('returns a warning when a later step is in_progress', () => {
    let steps = withComplete(makeSteps(), [1, 2, 3])
    steps = withStatus(steps, 5, 'in_progress')
    const warning = detectSequenceWarning(3, steps)
    expect(warning).not.toBeNull()
    expect(warning).toContain('5')
  })

  it('returns a warning when a later step is complete', () => {
    let steps = withComplete(makeSteps(), [1, 2, 3, 5])
    const warning = detectSequenceWarning(3, steps)
    expect(warning).not.toBeNull()
    expect(warning).toContain('5')
  })

  it('lists multiple affected step numbers in the warning', () => {
    let steps = withComplete(makeSteps(), [1, 2, 3])
    steps = withStatus(steps, 5, 'in_progress')
    steps = withStatus(steps, 6, 'complete')
    const warning = detectSequenceWarning(3, steps)
    expect(warning).toContain('5')
    expect(warning).toContain('6')
  })

  it('returns null when all later steps are pending or blocked', () => {
    let steps = withComplete(makeSteps(), [1, 2])
    steps = withStatus(steps, 4, 'blocked')
    expect(detectSequenceWarning(2, steps)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

describe('getActiveStepNumber', () => {
  it('returns 1 when all steps are pending', () => {
    expect(getActiveStepNumber(makeSteps())).toBe(1)
  })

  it('returns the first non-complete step number', () => {
    const steps = withComplete(makeSteps(), [1, 2, 3])
    expect(getActiveStepNumber(steps)).toBe(4)
  })

  it('returns null when all 24 steps are complete', () => {
    const allNums = Array.from({ length: 24 }, (_, i) => i + 1)
    const steps = withComplete(makeSteps(), allNums)
    expect(getActiveStepNumber(steps)).toBeNull()
  })

  it('handles in_progress step as active', () => {
    let steps = withComplete(makeSteps(), [1, 2])
    steps = withStatus(steps, 3, 'in_progress')
    expect(getActiveStepNumber(steps)).toBe(3)
  })
})

describe('countCompletedSteps', () => {
  it('returns 0 for all-pending steps', () => {
    expect(countCompletedSteps(makeSteps())).toBe(0)
  })

  it('returns correct count', () => {
    const steps = withComplete(makeSteps(), [1, 3, 5, 7])
    expect(countCompletedSteps(steps)).toBe(4)
  })

  it('returns 24 when all complete', () => {
    const allNums = Array.from({ length: 24 }, (_, i) => i + 1)
    expect(countCompletedSteps(withComplete(makeSteps(), allNums))).toBe(24)
  })
})

describe('getProgressPercent', () => {
  it('returns 0 for all-pending steps', () => {
    expect(getProgressPercent(makeSteps())).toBe(0)
  })

  it('returns 50 when 12 of 24 steps are complete', () => {
    const half = Array.from({ length: 12 }, (_, i) => i + 1)
    expect(getProgressPercent(withComplete(makeSteps(), half))).toBe(50)
  })

  it('returns 100 when all 24 complete', () => {
    const allNums = Array.from({ length: 24 }, (_, i) => i + 1)
    expect(getProgressPercent(withComplete(makeSteps(), allNums))).toBe(100)
  })

  it('returns 0 for empty array', () => {
    expect(getProgressPercent([])).toBe(0)
  })
})

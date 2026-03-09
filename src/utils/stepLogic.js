// /src/utils/stepLogic.js
// Business rule enforcement functions (BR-01 to BR-10).
// All functions are pure — they take data and return a result, no side effects.

/**
 * BR-01: Can the given step be marked Complete?
 *
 * Rules:
 *  - All steps with step_number < stepNumber must be 'complete'.
 *  - EXCEPTION: Steps 5 and 6 may run in parallel.
 *    Once step 4 is complete, either step 5 or 6 may be completed
 *    regardless of the other's status.
 *
 * @param {number} stepNumber - The step number to check (1-based).
 * @param {Array<{step_number: number, status: string}>} allSteps - All 24 step records.
 * @returns {boolean}
 */
export function canMarkComplete(stepNumber, allSteps) {
  const byNumber = Object.fromEntries(allSteps.map((s) => [s.step_number, s]))

  for (let n = 1; n < stepNumber; n++) {
    const prior = byNumber[n]
    if (!prior) continue // defensive: missing step doesn't block

    if (prior.status !== 'complete') {
      // Apply Steps 5/6 parallel exception:
      // If we're trying to complete step 5, we can ignore step 6's status (and vice versa).
      // But all steps before 5 (i.e. 1-4) must still be complete.
      if (stepNumber === 5 && n === 6) continue
      if (stepNumber === 6 && n === 5) continue
      return false
    }
  }

  return true
}

/**
 * BR-02: Derive the aggregate project status from all step statuses.
 * Returns 'complete' if all 24 steps are complete, otherwise 'active'.
 * (Archived status is managed separately; this function never returns 'archived'.)
 *
 * @param {Array<{status: string}>} steps
 * @returns {'active'|'complete'}
 */
export function deriveProjectStatus(steps) {
  if (steps.length === 24 && steps.every((s) => s.status === 'complete')) {
    return 'complete'
  }
  return 'active'
}

/**
 * BR-04: Can the step be marked Blocked?
 * Requires a non-empty blocked reason.
 *
 * @param {string} blockedReason
 * @returns {boolean}
 */
export function canMarkBlocked(blockedReason) {
  return typeof blockedReason === 'string' && blockedReason.trim().length > 0
}

/**
 * BR-10: Check if marking a step un-complete (changing away from 'complete') would
 * leave any later step in 'in_progress' or 'complete' — an out-of-sequence situation.
 *
 * @param {number} stepNumber - The step being un-completed.
 * @param {Array<{step_number: number, status: string}>} allSteps
 * @returns {string|null} - Warning message, or null if no warning needed.
 */
export function detectSequenceWarning(stepNumber, allSteps) {
  const laterSteps = allSteps.filter(
    (s) => s.step_number > stepNumber && ['in_progress', 'complete'].includes(s.status)
  )
  if (laterSteps.length === 0) return null

  const nums = laterSteps.map((s) => s.step_number).join(', ')
  return `Warning: Step${laterSteps.length > 1 ? 's' : ''} ${nums} ${
    laterSteps.length > 1 ? 'are' : 'is'
  } already in progress or complete. Review sequence carefully.`
}

/**
 * Get the current active step number for a project.
 * The active step is the lowest-numbered step that is not 'complete'.
 *
 * @param {Array<{step_number: number, status: string}>} steps
 * @returns {number|null} - Step number, or null if all steps are complete.
 */
export function getActiveStepNumber(steps) {
  const sorted = [...steps].sort((a, b) => a.step_number - b.step_number)
  const active = sorted.find((s) => s.status !== 'complete')
  return active ? active.step_number : null
}

/**
 * Get the count of completed steps.
 * @param {Array<{status: string}>} steps
 * @returns {number}
 */
export function countCompletedSteps(steps) {
  return steps.filter((s) => s.status === 'complete').length
}

/**
 * Get progress as a percentage (0–100).
 * @param {Array<{status: string}>} steps
 * @returns {number}
 */
export function getProgressPercent(steps) {
  if (!steps || steps.length === 0) return 0
  return Math.round((countCompletedSteps(steps) / steps.length) * 100)
}

/**
 * Returns a blocking reason string if Step 1 cannot be marked Complete because
 * Claude Web setup has not been confirmed. In Progress is still allowed.
 * Returns null if no block applies (different step, or setup is complete).
 *
 * @param {number} stepNumber
 * @param {boolean} claudeWebSetupComplete
 * @returns {string|null}
 */
export function getStep1Block(stepNumber, claudeWebSetupComplete) {
  if (stepNumber === 1 && !claudeWebSetupComplete) {
    return 'Complete the Claude Web setup checklist before marking Step 1 complete. Check item 2 in the setup checklist below.'
  }
  return null
}

/**
 * Returns a blocking reason string if Step 2 cannot be set to In Progress or
 * Complete because Claude Web project setup has not been confirmed.
 * Returns null if no block applies (different step, or setup is complete).
 *
 * @param {number} stepNumber
 * @param {boolean} claudeWebSetupComplete
 * @returns {string|null}
 */
export function getStep2Block(stepNumber, claudeWebSetupComplete) {
  if (stepNumber === 2 && !claudeWebSetupComplete) {
    return 'Claude Web project setup must be completed before this step. Use the Setup Checklist in Step 1 to copy all persona definitions and confirm setup.'
  }
  return null
}

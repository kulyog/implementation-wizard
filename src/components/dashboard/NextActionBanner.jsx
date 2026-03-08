// /src/components/dashboard/NextActionBanner.jsx
// Contextual "Your next action" banner (C-02).
// Displays a one-line instruction based on the active step's actor.

import { STEPS } from '../../data/steps'
import { getActiveStepNumber } from '../../utils/stepLogic'

const ACTOR_INSTRUCTIONS = {
  me: 'Open your notes and complete this step yourself.',
  claude_web: 'Open Claude Web, paste the prompt, and run this step.',
  claude_code: 'Open Claude Code and run this step.',
}

/**
 * @param {{ steps: Array }} props
 */
export default function NextActionBanner({ steps }) {
  const activeNum = getActiveStepNumber(steps)
  if (activeNum === null) {
    return (
      <div className="mt-3 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2">
        <p className="text-xs text-emerald-700 font-medium">All 24 steps complete.</p>
      </div>
    )
  }

  const staticStep = STEPS.find((s) => s.step_number === activeNum)
  if (!staticStep) return null

  const instruction = ACTOR_INSTRUCTIONS[staticStep.actor] ?? ''

  return (
    <div className="mt-3 rounded-md bg-indigo-50 border border-indigo-200 px-3 py-2">
      <p className="text-xs text-indigo-600 font-semibold mb-0.5">
        Next Action — Step {activeNum}
      </p>
      <p className="text-xs text-indigo-900 font-medium leading-snug">
        {staticStep.step_name}
      </p>
      <p className="text-xs text-indigo-700 mt-0.5">{instruction}</p>
    </div>
  )
}

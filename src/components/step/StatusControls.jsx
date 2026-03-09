// /src/components/step/StatusControls.jsx
// Status buttons with BR enforcement (F-08, F-09, F-10).
// Enforces BR-01 sequential rules, BR-03 (in_progress any time),
// BR-04 (blocked requires reason), BR-10 (sequence warning via Toast).

import { useState } from 'react'
import { canMarkComplete, canMarkBlocked, detectSequenceWarning, getStep1Block, getStep2Block } from '../../utils/stepLogic'
import { useProject } from '../../context/ProjectContext'
import BlockedReasonField from './BlockedReasonField'
import Tooltip from '../layout/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'

const STATUSES = ['pending', 'in_progress', 'complete', 'blocked']

const STATUS_TOOLTIPS = {
  pending:     TOOLTIPS.statusPending,
  in_progress: TOOLTIPS.statusInProgress,
  complete:    TOOLTIPS.statusComplete,
  blocked:     TOOLTIPS.statusBlocked,
}

const BUTTON_STYLES = {
  pending:     'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50',
  in_progress: 'border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50',
  complete:    'border-emerald-300 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50',
  blocked:     'border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50',
}

const ACTIVE_STYLES = {
  pending:     'bg-gray-100 border-gray-400 text-gray-700 font-semibold',
  in_progress: 'bg-blue-100 border-blue-500 text-blue-800 font-semibold',
  complete:    'bg-emerald-100 border-emerald-500 text-emerald-800 font-semibold',
  blocked:     'bg-red-100 border-red-500 text-red-700 font-semibold',
}

const LABELS = {
  pending:     'Pending',
  in_progress: 'In Progress',
  complete:    'Complete',
  blocked:     'Blocked',
}

/**
 * @param {{
 *   projectId: string,
 *   stepRecord: object,
 *   allSteps: Array,
 *   onWarning: function,   // (message: string) => void — for Toast BR-10
 * }} props
 */
export default function StatusControls({ projectId, stepRecord, allSteps, onWarning }) {
  const { state, dispatch } = useProject()
  const project = state.projects.find((p) => p.project_id === projectId)
  const claudeWebSetupComplete = project?.claude_web_setup_complete ?? false
  const step1Block = getStep1Block(stepRecord.step_number, claudeWebSetupComplete)
  const setupBlock = getStep2Block(stepRecord.step_number, claudeWebSetupComplete)
  const [showBlockedField, setShowBlockedField] = useState(false)
  const [blockedReason, setBlockedReason] = useState(stepRecord.blocked_reason || '')
  const [blockedError, setBlockedError] = useState('')

  const currentStatus = stepRecord.status

  function handleStatusClick(newStatus) {
    if (newStatus === currentStatus) return

    // Setup gate: Step 1 Complete blocked until Claude Web setup is confirmed
    if (step1Block && newStatus === 'complete') {
      onWarning(step1Block)
      return
    }

    // Setup gate: Step 2 blocked until Claude Web project setup is confirmed
    if (setupBlock && (newStatus === 'in_progress' || newStatus === 'complete')) {
      onWarning(setupBlock)
      return
    }

    // BR-01: enforce sequential completion
    if (newStatus === 'complete') {
      if (!canMarkComplete(stepRecord.step_number, allSteps)) {
        onWarning('Cannot mark complete — prior steps must be completed first.')
        return
      }
    }

    // BR-10: detect sequence warning when un-completing
    if (currentStatus === 'complete' && newStatus !== 'complete') {
      const warning = detectSequenceWarning(stepRecord.step_number, allSteps)
      if (warning) onWarning(warning)
    }

    if (newStatus === 'blocked') {
      setShowBlockedField(true)
      return
    }

    // All other transitions proceed immediately
    setShowBlockedField(false)
    setBlockedReason('')
    setBlockedError('')
    dispatch({
      type: 'UPDATE_STEP_STATUS',
      payload: { project_id: projectId, step_number: stepRecord.step_number, status: newStatus },
    })
  }

  function handleBlockedSubmit() {
    if (!canMarkBlocked(blockedReason)) {
      setBlockedError('Please enter a reason for blocking this step.')
      return
    }
    setBlockedError('')
    setShowBlockedField(false)
    dispatch({
      type: 'UPDATE_STEP_STATUS',
      payload: {
        project_id: projectId,
        step_number: stepRecord.step_number,
        status: 'blocked',
        blocked_reason: blockedReason.trim(),
      },
    })
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>

      {/* Setup gate warning for Step 1 (Complete only) */}
      {step1Block && (
        <div className="mb-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          {step1Block}
        </div>
      )}

      {/* Setup gate warning for Step 2 */}
      {setupBlock && (
        <div className="mb-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          {setupBlock}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const isActive = currentStatus === s
          const isDisabled =
            (s === 'complete' && !canMarkComplete(stepRecord.step_number, allSteps)) ||
            (!!step1Block && s === 'complete') ||
            (!!setupBlock && (s === 'in_progress' || s === 'complete'))

          return (
            <Tooltip key={s} text={STATUS_TOOLTIPS[s]} position="bottom">
              <button
                onClick={() => handleStatusClick(s)}
                disabled={isDisabled && !isActive}
                className={`px-3 py-1.5 rounded-md border text-xs transition-colors ${
                  isActive ? ACTIVE_STYLES[s] : BUTTON_STYLES[s]
                } ${isDisabled && !isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {LABELS[s]}
              </button>
            </Tooltip>
          )
        })}
      </div>

      {/* BR-04: Blocked reason input */}
      {showBlockedField && (
        <div>
          <BlockedReasonField
            value={blockedReason}
            onChange={(v) => { setBlockedReason(v); setBlockedError('') }}
            error={blockedError}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBlockedSubmit}
              className="text-xs font-medium px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Save Block
            </button>
            <button
              onClick={() => { setShowBlockedField(false); setBlockedError('') }}
              className="text-xs font-medium px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Show current blocked reason if blocked */}
      {currentStatus === 'blocked' && stepRecord.blocked_reason && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <span className="font-semibold">Block reason:</span> {stepRecord.blocked_reason}
        </p>
      )}
    </div>
  )
}

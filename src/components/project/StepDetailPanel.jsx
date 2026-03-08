// /src/components/project/StepDetailPanel.jsx
// Full step detail panel — all fields from Section 4.3 of functional requirements.

import { useProject } from '../../context/ProjectContext'
import { STEPS } from '../../data/steps'
import ActorBadge from '../shared/ActorBadge'
import StatusBadge from '../shared/StatusBadge'
import PromptBox from '../step/PromptBox'
import StatusControls from '../step/StatusControls'
import NotesField from '../step/NotesField'

/**
 * @param {{
 *   projectId: string,
 *   stepNumber: number,
 *   allSteps: Array,
 *   onWarning: function,
 *   onCopied: function,
 * }} props
 */
export default function StepDetailPanel({ projectId, stepNumber, allSteps, onWarning, onCopied }) {
  const { dispatch } = useProject()

  const stepRecord = allSteps.find((s) => s.step_number === stepNumber)
  const staticStep = STEPS.find((s) => s.step_number === stepNumber)

  if (!stepRecord || !staticStep) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Step not found.
      </div>
    )
  }

  function handleNotesSave(notes) {
    dispatch({ type: 'UPDATE_STEP_NOTES', payload: { project_id: projectId, step_number: stepNumber, notes } })
  }

  function formatDateTime(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  function formatDuration(seconds) {
    if (!seconds) return null
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  const duration = formatDuration(stepRecord.time_in_step_seconds)

  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-6">
      {/* Step header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Step {staticStep.step_number}
            </span>
            <ActorBadge actor={staticStep.actor} />
            {staticStep.persona && (
              <span className="text-xs text-gray-500 italic">{staticStep.persona}</span>
            )}
          </div>
          <StatusBadge status={stepRecord.status} />
        </div>
        <h2 className="text-base font-bold text-gray-900">{staticStep.step_name}</h2>
      </div>

      {/* Description */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
        <p className="text-sm text-gray-700 leading-relaxed">{staticStep.description}</p>
      </div>

      {/* Expected output */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Expected Output</p>
        <p className="text-sm text-gray-700 leading-relaxed">{staticStep.expected_output}</p>
      </div>

      {/* Linked docs */}
      {staticStep.linked_docs.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Linked Documents</p>
          <ul className="space-y-0.5">
            {staticStep.linked_docs.map((doc) => (
              <li key={doc} className="text-xs text-indigo-600 font-mono">
                /docs/{doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prompt box (read-only, BR-06) */}
      <PromptBox promptText={staticStep.prompt_text} onCopied={onCopied} />

      {/* Status controls */}
      <StatusControls
        projectId={projectId}
        stepRecord={stepRecord}
        allSteps={allSteps}
        onWarning={onWarning}
      />

      {/* Notes (auto-save on blur) */}
      <NotesField value={stepRecord.notes} onSave={handleNotesSave} />

      {/* Timestamps */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Timestamps</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 w-20 shrink-0">Started</span>
            <span>{formatDateTime(stepRecord.started_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 w-20 shrink-0">Completed</span>
            <span>{formatDateTime(stepRecord.completed_at)}</span>
          </div>
          {duration && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-20 shrink-0">Time in step</span>
              <span className="font-medium text-indigo-600">{duration}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// /src/components/project/StepDetailPanel.jsx
// Full step detail panel — all fields from Section 4.3 of functional requirements.

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'
import { STEPS } from '../../data/steps'
import { SUPPORT_PERSONAS, buildAllPersonasText } from '../../data/supportPersonas'
import ActorBadge from '../shared/ActorBadge'
import StatusBadge from '../shared/StatusBadge'
import PromptBox from '../step/PromptBox'
import StatusControls from '../step/StatusControls'
import NotesField from '../step/NotesField'
import StepTimer from '../step/StepTimer'
import Tooltip from '../layout/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'
import { useClipboard } from '../../hooks/useClipboard'

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
  const { state, dispatch } = useProject()
  const { copy, copied } = useClipboard()
  const { copy: copyAllDefs, copied: copiedAllDefs } = useClipboard()
  const [item1Checked, setItem1Checked] = useState(false)
  const project = state.projects.find((p) => p.project_id === projectId)

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

  function generateRecoveryPrompt() {
    const incompleteSteps = allSteps
      .filter((s) => s.status !== 'complete')
      .sort((a, b) => a.step_number - b.step_number)

    const completeSteps = allSteps
      .filter((s) => s.status === 'complete')
      .sort((a, b) => a.step_number - b.step_number)

    const incompleteLines = incompleteSteps.map((s) => {
      const staticSt = STEPS.find((st) => st.step_number === s.step_number)
      const name = staticSt?.step_name ?? `Step ${s.step_number}`
      let line = `- Step ${s.step_number} — ${name} — ${s.status.replace('_', ' ')}`
      if (s.status === 'blocked' && s.blocked_reason) {
        line += `\n  Block reason: ${s.blocked_reason}`
      }
      return line
    }).join('\n')

    const completeLines = completeSteps.map((s) => {
      const staticSt = STEPS.find((st) => st.step_number === s.step_number)
      const name = staticSt?.step_name ?? `Step ${s.step_number}`
      return `- Step ${s.step_number} — ${name}`
    }).join('\n')

    const projectName = project?.project_name ?? 'this project'

    return `You are Claude Code helping me resume work on my project: ${projectName}

## Incomplete Steps
${incompleteLines || 'None — all steps are complete!'}

## Completed Steps
${completeLines || 'None completed yet.'}

## Your Task
Please review the incomplete steps above and help me continue from where I left off. Start by examining any step currently In Progress, or identify the next step that should be worked on based on sequential order (Steps 5 and 6 may run in parallel once Step 4 is complete).`
  }

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

      {/* Reference notes */}
      {staticStep.notes && (
        <div className="bg-amber-50 border-l-[3px] border-amber-400 px-4 py-3 rounded-r">
          <p className="text-xs font-bold text-amber-800 mb-1">Notes</p>
          <p className="text-sm text-amber-900 leading-relaxed">{staticStep.notes}</p>
        </div>
      )}

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

      {/* Step 1 — Setup Checklist */}
      {staticStep.step_number === 1 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Setup Checklist</p>
          <div className="space-y-3">

            {/* Item 1 — local only */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={item1Checked}
                onChange={(e) => setItem1Checked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className={`text-sm leading-snug ${item1Checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                Write down your business requirements before proceeding to Step 2.
              </span>
            </label>

            {/* Item 2 — persisted via claude_web_setup_complete */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={project?.claude_web_setup_complete ?? false}
                  onChange={(e) => {
                    dispatch({
                      type: 'SET_CLAUDE_WEB_SETUP_COMPLETE',
                      payload: { projectId, value: e.target.checked },
                    })
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className={`text-sm leading-snug ${project?.claude_web_setup_complete ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  Set up Claude Web project — copy all persona definitions and paste into Project Instructions.
                </span>
              </label>

              {/* Copy All Definitions button */}
              <div className="ml-7">
                <button
                  onClick={async () => { await copyAllDefs(buildAllPersonasText()) }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                  {copiedAllDefs ? 'Copied! ✓' : `Copy All Definitions (${SUPPORT_PERSONAS.length})`}
                </button>
              </div>

              {/* Confirmation line */}
              {project?.claude_web_setup_complete && (
                <p className="ml-7 text-xs text-emerald-700 font-medium">
                  Claude Web setup confirmed. Step 2 is now unlocked.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
        <div className="space-y-2 text-xs text-gray-600">
          <StepTimer stepRecord={stepRecord} />
          <div className="flex items-center gap-2">
            <span className="text-gray-400 w-20 shrink-0">Started</span>
            <span>{formatDateTime(stepRecord.started_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 w-20 shrink-0">Completed</span>
            <span>{formatDateTime(stepRecord.completed_at)}</span>
          </div>
        </div>
      </div>

      {/* Recovery Prompt */}
      {allSteps.some((s) => s.status !== 'complete') && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recovery</p>
          <Tooltip text={TOOLTIPS.recoveryPrompt} position="top">
            <button
              onClick={() => copy(generateRecoveryPrompt())}
              className="text-xs font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
            >
              {copied ? 'Copied! ✓' : 'Copy Recovery Prompt'}
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

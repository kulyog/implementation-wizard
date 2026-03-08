// /src/components/project/StepRow.jsx
// Single row in the step checklist (used by StepChecklist).

import { STEPS } from '../../data/steps'
import StatusBadge from '../shared/StatusBadge'

/**
 * @param {{
 *   stepRecord: object,
 *   isActive: boolean,
 *   isSelected: boolean,
 *   onClick: function,
 * }} props
 */
export default function StepRow({ stepRecord, isActive, isSelected, onClick }) {
  const staticStep = STEPS.find((s) => s.step_number === stepRecord.step_number)
  if (!staticStep) return null

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 border-b border-gray-100 transition-colors ${
        isSelected
          ? 'bg-indigo-50 border-l-2 border-l-indigo-500'
          : isActive
          ? 'bg-blue-50 hover:bg-blue-100'
          : 'hover:bg-gray-50'
      }`}
    >
      {/* Step number */}
      <span
        className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
          stepRecord.status === 'complete'
            ? 'bg-emerald-500 text-white'
            : isActive
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {stepRecord.status === 'complete' ? '✓' : stepRecord.step_number}
      </span>

      {/* Step info */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium leading-tight truncate ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
          {staticStep.step_name}
        </p>
        <div className="mt-1">
          <StatusBadge status={stepRecord.status} />
        </div>
      </div>
    </button>
  )
}

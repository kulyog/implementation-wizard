// /src/components/dashboard/ProjectCard.jsx
// Displays a single project on the Dashboard.
// Shows: project name, description, progress bar, step count, status badge, next action.

import { getProgressPercent, getActiveStepNumber, countCompletedSteps } from '../../utils/stepLogic'
import NextActionBanner from './NextActionBanner'

const STATUS_STYLES = {
  active: 'bg-blue-100 text-blue-700',
  complete: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-gray-100 text-gray-500',
}

/**
 * @param {{
 *   project: object,
 *   onOpen: function,
 * }} props
 */
export default function ProjectCard({ project, onOpen }) {
  const progress = getProgressPercent(project.steps)
  const completed = countCompletedSteps(project.steps)
  const activeNum = getActiveStepNumber(project.steps)
  const statusLabel =
    project.status === 'active'
      ? 'Active'
      : project.status === 'complete'
      ? 'Complete'
      : 'Archived'

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-1 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => onOpen(project.project_id)}
          className="text-left flex-1"
        >
          <h2 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors leading-tight">
            {project.project_name}
          </h2>
        </button>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[project.status] ?? STATUS_STYLES.active}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Description */}
      {project.project_description && (
        <p className="text-xs text-gray-500 leading-snug line-clamp-2">
          {project.project_description}
        </p>
      )}

      {/* Progress bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">
            {completed} / {project.steps.length} steps complete
          </span>
          <span className="text-xs font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current step indicator */}
      {activeNum !== null && (
        <p className="text-xs text-gray-400 mt-1">
          Current step: <span className="text-gray-600 font-medium">Step {activeNum}</span>
        </p>
      )}

      {/* Next action banner */}
      <NextActionBanner steps={project.steps} />

      {/* Open button */}
      <button
        onClick={() => onOpen(project.project_id)}
        className="mt-3 w-full text-xs font-medium text-indigo-600 border border-indigo-200 rounded-md py-1.5 hover:bg-indigo-50 transition-colors"
      >
        Open Project →
      </button>
    </div>
  )
}

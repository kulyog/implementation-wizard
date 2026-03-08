// /src/components/archived/ArchivedView.jsx
// List of archived projects with restore and delete options (S2-07, BR-09).

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'
import ConfirmModal from '../shared/ConfirmModal'
import StepStripChart from '../dashboard/StepStripChart'
import { countCompletedSteps } from '../../utils/stepLogic'

/**
 * @param {{
 *   onBack: function,
 *   onOpenProject: function,
 * }} props
 */
export default function ArchivedView({ onBack, onOpenProject }) {
  const { state, dispatch } = useProject()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const archived = state.projects.filter((p) => p.status === 'archived')

  function handleRestore(projectId) {
    dispatch({ type: 'UNARCHIVE_PROJECT', payload: { project_id: projectId } })
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    dispatch({ type: 'DELETE_PROJECT', payload: { project_id: deleteTarget.project_id } })
    setDeleteTarget(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-xs text-indigo-600 hover:underline"
        >
          ← Dashboard
        </button>
        <h1 className="text-xl font-bold text-gray-900">Archived Projects</h1>
      </div>

      {archived.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400 text-sm">No archived projects.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {archived.map((project) => (
            <ArchivedProjectCard
              key={project.project_id}
              project={project}
              onRestore={() => handleRestore(project.project_id)}
              onOpen={() => onOpenProject(project.project_id)}
              onDelete={() => setDeleteTarget(project)}
            />
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Project"
          message={`Permanently delete "${deleteTarget.project_name}"? This cannot be undone.`}
          confirmLabel="Delete Permanently"
          danger
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function ArchivedProjectCard({ project, onRestore, onOpen, onDelete }) {
  const completed = countCompletedSteps(project.steps)

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">{project.project_name}</h2>
          {project.project_description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{project.project_description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{completed} / 24 steps completed</p>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
          Archived
        </span>
      </div>

      <StepStripChart steps={project.steps} />

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={onOpen}
          className="text-xs font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
        >
          Open (read)
        </button>
        <button
          onClick={onRestore}
          className="text-xs font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
        >
          Restore
        </button>
        <button
          onClick={onDelete}
          className="text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

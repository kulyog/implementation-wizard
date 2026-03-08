// /src/components/project/ProjectHeader.jsx
// Project name, description, rename, archive/delete controls (F-04, F-05).

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'
import ConfirmModal from '../shared/ConfirmModal'

const MAX_NAME = 100
const MAX_DESC = 500

/**
 * @param {{
 *   project: object,
 *   onBack: function,
 *   onArchived: function,
 *   onDeleted: function,
 *   onDuplicated?: function,
 * }} props
 */
export default function ProjectHeader({ project, onBack, onArchived, onDeleted, onDuplicated }) {
  const { dispatch } = useProject()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(project.project_name)
  const [description, setDescription] = useState(project.project_description)
  const [nameError, setNameError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)

  function handleRenameSubmit() {
    const trimmed = name.trim()
    if (!trimmed) { setNameError('Name is required.'); return }
    if (trimmed.length > MAX_NAME) { setNameError(`Max ${MAX_NAME} characters.`); return }
    dispatch({
      type: 'RENAME_PROJECT',
      payload: {
        project_id: project.project_id,
        project_name: trimmed,
        project_description: description.trim(),
      },
    })
    setEditing(false)
    setNameError('')
  }

  function handleArchive() {
    dispatch({ type: 'ARCHIVE_PROJECT', payload: { project_id: project.project_id } })
    setShowArchiveConfirm(false)
    onArchived()
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_PROJECT', payload: { project_id: project.project_id } })
    setShowDeleteConfirm(false)
    onDeleted()
  }

  function handleDuplicate() {
    dispatch({ type: 'DUPLICATE_PROJECT', payload: { project_id: project.project_id } })
    if (onDuplicated) onDuplicated()
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Back link */}
      <button
        onClick={onBack}
        className="text-xs text-indigo-600 hover:underline mb-3 block"
      >
        ← Back to Dashboard
      </button>

      {editing ? (
        <div className="space-y-2">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError('') }}
              maxLength={MAX_NAME + 10}
              className={`w-full border rounded-md px-3 py-1.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${nameError ? 'border-red-400' : 'border-gray-300'}`}
              autoFocus
            />
            {nameError && <p className="text-xs text-red-600 mt-1">{nameError}</p>}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={MAX_DESC + 10}
            rows={2}
            placeholder="Optional description…"
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRenameSubmit}
              className="text-xs font-medium px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setName(project.project_name); setDescription(project.project_description); setNameError('') }}
              className="text-xs font-medium px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">{project.project_name}</h1>
            {project.project_description && (
              <p className="text-sm text-gray-500 mt-0.5 leading-snug">{project.project_description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 rounded-md transition-colors"
            >
              Rename
            </button>
            <button
              onClick={handleDuplicate}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 rounded-md transition-colors"
            >
              Duplicate
            </button>
            <button
              onClick={() => setShowArchiveConfirm(true)}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 rounded-md transition-colors"
            >
              Archive
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-2.5 py-1.5 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {showArchiveConfirm && (
        <ConfirmModal
          title="Archive Project"
          message={`Archive "${project.project_name}"? It will be removed from the dashboard but all data is retained. You can restore it from the Archived view.`}
          confirmLabel="Archive"
          onConfirm={handleArchive}
          onCancel={() => setShowArchiveConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Project"
          message={`Permanently delete "${project.project_name}"? This cannot be undone.`}
          confirmLabel="Delete Permanently"
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}

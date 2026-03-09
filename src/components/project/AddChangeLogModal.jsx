// /src/components/project/AddChangeLogModal.jsx
// Modal for adding or editing a change log entry.

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'

const TYPE_OPTIONS = [
  { value: 'A', label: 'A — Mid-build change' },
  { value: 'B', label: 'B — Post-release bug' },
  { value: 'C', label: 'C — Post-release enhancement' },
  { value: 'D', label: 'D — Framework improvement' },
]

const STATUS_OPTIONS = ['Open', 'In Progress', 'Closed']

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * @param {{
 *   projectId: string,
 *   entry: object | null,   // null = add mode, object = edit mode
 *   onClose: function,
 * }} props
 */
export default function AddChangeLogModal({ projectId, entry, onClose }) {
  const { dispatch } = useProject()
  const isEdit = entry != null

  const [form, setForm] = useState({
    date: entry?.date ?? todayISO(),
    type: entry?.type ?? 'A',
    description: entry?.description ?? '',
    version_target: entry?.version_target ?? '',
    personas_to_rerun: entry?.personas_to_rerun ?? '',
    status: entry?.status ?? 'Open',
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSave() {
    if (!form.description.trim()) {
      setError('Description is required.')
      return
    }
    if (isEdit) {
      dispatch({
        type: 'UPDATE_CHANGE_LOG_ENTRY',
        payload: { project_id: projectId, id: entry.id, updates: { ...form } },
      })
    } else {
      dispatch({
        type: 'ADD_CHANGE_LOG_ENTRY',
        payload: { project_id: projectId, entry: { ...form } },
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Entry' : 'Add Change Log Entry'}
          </h2>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Version target */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Version Target</label>
            <input
              type="text"
              name="version_target"
              value={form.version_target}
              onChange={handleChange}
              placeholder="e.g. V1.1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Personas to re-run */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Personas to Re-run</label>
            <input
              type="text"
              name="personas_to_rerun"
              value={form.personas_to_rerun}
              onChange={handleChange}
              placeholder="e.g. Technical Architect, QC Analyst"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            {isEdit ? 'Save Changes' : 'Add Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}

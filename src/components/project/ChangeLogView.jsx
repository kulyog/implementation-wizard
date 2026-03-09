// /src/components/project/ChangeLogView.jsx
// Change Log tab content — table of change requests with add/edit/delete.

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useProject } from '../../context/ProjectContext'
import AddChangeLogModal from './AddChangeLogModal'

const TYPE_LABELS = {
  A: 'Mid-build change',
  B: 'Post-release bug',
  C: 'Post-release enhancement',
  D: 'Framework improvement',
}

const STATUS_STYLES = {
  'Open': 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Closed': 'bg-green-100 text-green-800',
}

/**
 * @param {{
 *   projectId: string,
 *   changeLog: Array,
 * }} props
 */
export default function ChangeLogView({ projectId, changeLog }) {
  const { dispatch } = useProject()
  // undefined = modal closed, null = add mode, object = edit mode
  const [modalEntry, setModalEntry] = useState(undefined)

  const sorted = [...changeLog].sort((a, b) => b.date.localeCompare(a.date))

  function handleDelete(id) {
    if (window.confirm('Delete this change log entry? This cannot be undone.')) {
      dispatch({ type: 'DELETE_CHANGE_LOG_ENTRY', payload: { project_id: projectId, id } })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">Change Log</h2>
        <button
          onClick={() => setModalEntry(null)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          Add Entry
        </button>
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No change requests logged yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                <th className="pb-2 pr-4 whitespace-nowrap">Date</th>
                <th className="pb-2 pr-4 whitespace-nowrap">Type</th>
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 pr-4 whitespace-nowrap">Version</th>
                <th className="pb-2 pr-4 whitespace-nowrap">Status</th>
                <th className="pb-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((entry) => (
                <tr key={entry.id} className="align-top">
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{entry.date}</td>
                  <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">
                    <span className="font-medium">{entry.type}</span>
                    {' — '}
                    <span className="text-gray-500">{TYPE_LABELS[entry.type] ?? entry.type}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-700">
                    <div>{entry.description}</div>
                    {entry.personas_to_rerun && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Re-run: {entry.personas_to_rerun}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                    {entry.version_target || '—'}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLES[entry.status] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalEntry(entry)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalEntry !== undefined && (
        <AddChangeLogModal
          projectId={projectId}
          entry={modalEntry}
          onClose={() => setModalEntry(undefined)}
        />
      )}
    </div>
  )
}

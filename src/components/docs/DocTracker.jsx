// /src/components/docs/DocTracker.jsx
// Per-project /docs file status tracker (F-12, F-13, F-14).
// Shows each doc file as Pending / Created / Noted with a user notes field.

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'

const STATUS_STYLES = {
  pending: 'bg-gray-100 text-gray-500',
  created: 'bg-emerald-100 text-emerald-700',
  noted:   'bg-indigo-100 text-indigo-700',
}

const STATUS_LABELS = {
  pending: 'Pending',
  created: 'Created',
  noted:   'Noted',
}

const STATUS_CYCLE = { pending: 'created', created: 'noted', noted: 'pending' }

/**
 * @param {{
 *   projectId: string,
 *   docRegistry: Array,
 * }} props
 */
export default function DocTracker({ projectId, docRegistry }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Document Registry
      </p>
      <div className="space-y-2">
        {docRegistry.map((doc) => (
          <DocRow key={doc.file_name} doc={doc} projectId={projectId} />
        ))}
      </div>
    </div>
  )
}

function DocRow({ doc, projectId }) {
  const { dispatch } = useProject()
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(doc.user_note)

  function cycleStatus() {
    const next = STATUS_CYCLE[doc.status] ?? 'pending'
    dispatch({
      type: 'UPDATE_DOC_REGISTRY',
      payload: { project_id: projectId, file_name: doc.file_name, updates: { status: next } },
    })
  }

  function saveNote() {
    dispatch({
      type: 'UPDATE_DOC_REGISTRY',
      payload: { project_id: projectId, file_name: doc.file_name, updates: { user_note: noteValue.trim() } },
    })
    setEditingNote(false)
  }

  return (
    <div className="flex items-start gap-3 text-xs">
      {/* Status badge (click to cycle) */}
      <button
        onClick={cycleStatus}
        className={`shrink-0 px-2 py-0.5 rounded-full font-medium transition-opacity hover:opacity-80 ${STATUS_STYLES[doc.status]}`}
        title="Click to cycle status: Pending → Created → Noted"
      >
        {STATUS_LABELS[doc.status]}
      </button>

      {/* File name */}
      <span className="font-mono text-gray-700 shrink-0">{doc.file_name}</span>

      {/* Linked step */}
      <span className="text-gray-400 shrink-0">Step {doc.linked_step}</span>

      {/* Note */}
      <div className="flex-1 min-w-0">
        {editingNote ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveNote(); if (e.key === 'Escape') setEditingNote(false) }}
              className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="File path or version note…"
              autoFocus
            />
            <button onClick={saveNote} className="text-indigo-600 hover:underline">Save</button>
            <button onClick={() => { setNoteValue(doc.user_note); setEditingNote(false) }} className="text-gray-400 hover:underline">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="text-gray-400 hover:text-indigo-600 truncate max-w-full text-left"
          >
            {doc.user_note || <span className="italic">Add note…</span>}
          </button>
        )}
      </div>
    </div>
  )
}

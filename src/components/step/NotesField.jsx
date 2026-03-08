// /src/components/step/NotesField.jsx
// Auto-saving free-text notes area (F-07, BR-07).
// Saves on blur. No length limit enforced.

import { useState, useEffect } from 'react'

/**
 * @param {{
 *   value: string,
 *   onSave: function,
 * }} props
 */
export default function NotesField({ value, onSave }) {
  const [local, setLocal] = useState(value)

  // Sync local state if the parent value changes (e.g. block cleared appends to notes)
  useEffect(() => {
    setLocal(value)
  }, [value])

  function handleBlur() {
    if (local !== value) {
      onSave(local)
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5" htmlFor="step-notes">
        Notes
      </label>
      <textarea
        id="step-notes"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={handleBlur}
        rows={6}
        placeholder="Paste AI output, log decisions, record observations… auto-saved on blur."
        className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
      />
    </div>
  )
}

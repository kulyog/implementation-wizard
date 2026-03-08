// /src/components/step/BlockedReasonField.jsx
// Conditional blocked reason input (F-10, BR-04).
// Shown only when the user is trying to mark a step Blocked.

/**
 * @param {{
 *   value: string,
 *   onChange: function,
 *   error?: string,
 * }} props
 */
export default function BlockedReasonField({ value, onChange, error }) {
  return (
    <div className="mt-3">
      <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="blocked-reason">
        Blocked Reason <span className="text-red-500">*</span>
      </label>
      <textarea
        id="blocked-reason"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="Describe why this step is blocked…"
        className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

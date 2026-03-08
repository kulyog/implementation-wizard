// /src/components/shared/ConfirmModal.jsx
// Reusable confirmation dialog (BR-08).
// Used for project deletion, import overwrite, etc.

/**
 * @param {{
 *   title: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   danger?: boolean,
 *   onConfirm: function,
 *   onCancel: function,
 * }} props
 */
export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onCancel()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm font-medium px-5 py-2 rounded-md transition-colors ${
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

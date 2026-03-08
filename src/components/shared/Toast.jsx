// /src/components/shared/Toast.jsx
// Transient notification that auto-dismisses after a timeout.
// Usage: pass { message, type } via props; parent controls visibility.

import { useEffect, useState } from 'react'

const TYPE_STYLES = {
  success: 'bg-emerald-600 text-white',
  error:   'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info:    'bg-indigo-600 text-white',
}

/**
 * @param {{
 *   message: string,
 *   type?: 'success'|'error'|'warning'|'info',
 *   duration?: number,
 *   onDismiss: function,
 * }} props
 */
export default function Toast({ message, type = 'info', duration = 3000, onDismiss }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      // Let the fade finish before calling onDismiss
      setTimeout(onDismiss, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onDismiss])

  const style = TYPE_STYLES[type] ?? TYPE_STYLES.info

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-opacity duration-300 ${style} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
        className="opacity-70 hover:opacity-100 transition-opacity text-base leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

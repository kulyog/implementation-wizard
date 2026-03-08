// /src/components/step/PromptBox.jsx
// Read-only prompt display + copy button (F-20, BR-06).
// Prompt text is NEVER user-editable.

import { useEffect } from 'react'
import { useClipboard } from '../../hooks/useClipboard'
import Tooltip from '../layout/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'

/**
 * @param {{
 *   promptText: string,
 *   onCopied?: function,
 * }} props
 */
export default function PromptBox({ promptText, onCopied }) {
  const { copy, copied } = useClipboard()

  // Keyboard shortcut: Ctrl+Shift+C / Cmd+Shift+C
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handleCopy()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  async function handleCopy() {
    const ok = await copy(promptText)
    if (ok && onCopied) onCopied()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          AI Prompt
        </label>
        <Tooltip text={TOOLTIPS.copyPrompt} position="top">
          <button
            onClick={handleCopy}
            className={`text-xs font-medium px-3 py-1 rounded-md border transition-colors ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {copied ? 'Copied ✓' : 'Copy Prompt'}
          </button>
        </Tooltip>
      </div>
      <pre className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto select-all">
        {promptText}
      </pre>
      <p className="text-xs text-gray-400 mt-1">
        Ctrl+Shift+C to copy · Read-only
      </p>
    </div>
  )
}

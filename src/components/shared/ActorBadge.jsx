// /src/components/shared/ActorBadge.jsx
// Coloured badge indicating who performs a step: Me, Claude Web, or Claude Code.

const CONFIG = {
  me:          { label: 'Me',          style: 'bg-violet-100 text-violet-700' },
  claude_web:  { label: 'Claude Web',  style: 'bg-sky-100 text-sky-700' },
  claude_code: { label: 'Claude Code', style: 'bg-amber-100 text-amber-700' },
}

/**
 * @param {{ actor: 'me'|'claude_web'|'claude_code', className?: string }} props
 */
export default function ActorBadge({ actor, className = '' }) {
  const { label, style } = CONFIG[actor] ?? { label: actor, style: 'bg-gray-100 text-gray-600' }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}
    >
      {label}
    </span>
  )
}

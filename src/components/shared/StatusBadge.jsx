// /src/components/shared/StatusBadge.jsx
// Coloured status pill for step statuses.

const STYLES = {
  pending:     'bg-gray-100 text-gray-500',
  in_progress: 'bg-blue-100 text-blue-700',
  complete:    'bg-emerald-100 text-emerald-700',
  blocked:     'bg-red-100 text-red-600',
}

const LABELS = {
  pending:     'Pending',
  in_progress: 'In Progress',
  complete:    'Complete',
  blocked:     'Blocked',
}

/**
 * @param {{ status: 'pending'|'in_progress'|'complete'|'blocked', className?: string }} props
 */
export default function StatusBadge({ status, className = '' }) {
  const style = STYLES[status] ?? STYLES.pending
  const label = LABELS[status] ?? status

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}
    >
      {label}
    </span>
  )
}

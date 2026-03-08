// /src/components/dashboard/StepStripChart.jsx
// 24-cell colour-coded progress strip — one cell per step, colour by status (C-06).
// Implemented as plain divs (no Recharts needed for a simple strip of coloured cells).

const STATUS_COLORS = {
  pending:     'bg-gray-200',
  in_progress: 'bg-blue-400',
  complete:    'bg-emerald-500',
  blocked:     'bg-red-400',
}

/**
 * @param {{ steps: Array<{step_number: number, status: string}> }} props
 */
export default function StepStripChart({ steps }) {
  // Sort steps by step_number to ensure correct order
  const sorted = [...steps].sort((a, b) => a.step_number - b.step_number)

  return (
    <div className="flex gap-px" title="24-step progress strip">
      {sorted.map((step) => (
        <div
          key={step.step_number}
          className={`h-2 flex-1 rounded-sm ${STATUS_COLORS[step.status] ?? STATUS_COLORS.pending}`}
          title={`Step ${step.step_number}: ${step.status.replace('_', ' ')}`}
        />
      ))}
    </div>
  )
}

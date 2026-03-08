// /src/components/step/StepTimer.jsx
// Displays live elapsed time for In Progress steps, or stored duration for Complete steps.

import { useStepTimer } from '../../hooks/useStepTimer'
import Tooltip from '../layout/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'

/**
 * @param {{ stepRecord: object }} props
 */
export default function StepTimer({ stepRecord }) {
  const duration = useStepTimer(stepRecord)
  if (!duration) return null

  const isLive = stepRecord.status === 'in_progress'

  return (
    <Tooltip text={TOOLTIPS.stepTimer}>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
        <span className={`text-sm font-mono font-medium ${isLive ? 'text-blue-600' : 'text-emerald-600'}`}>
          {duration}
        </span>
        {isLive && <span className="text-xs text-gray-400">elapsed</span>}
      </div>
    </Tooltip>
  )
}

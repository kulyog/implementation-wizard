// /src/components/project/StepChecklist.jsx
// Full 24-step checklist with status badges, active step highlight, click to select (S2-03).

import StepRow from './StepRow'
import { getActiveStepNumber } from '../../utils/stepLogic'

/**
 * @param {{
 *   steps: Array,
 *   selectedStepNumber: number|null,
 *   onSelectStep: function,
 * }} props
 */
export default function StepChecklist({ steps, selectedStepNumber, onSelectStep }) {
  const activeNum = getActiveStepNumber(steps)
  const sorted = [...steps].sort((a, b) => a.step_number - b.step_number)

  return (
    <div className="h-full overflow-y-auto">
      {sorted.map((stepRecord) => (
        <StepRow
          key={stepRecord.step_number}
          stepRecord={stepRecord}
          isActive={stepRecord.step_number === activeNum}
          isSelected={stepRecord.step_number === selectedStepNumber}
          onClick={() => onSelectStep(stepRecord.step_number)}
        />
      ))}
    </div>
  )
}

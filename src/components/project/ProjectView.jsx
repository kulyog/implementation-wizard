// /src/components/project/ProjectView.jsx
// Project detail view — side panel split layout (35% checklist / 65% detail).

import { useState, useCallback } from 'react'
import { useProject } from '../../context/ProjectContext'
import { getActiveStepNumber } from '../../utils/stepLogic'
import ProjectHeader from './ProjectHeader'
import StepChecklist from './StepChecklist'
import StepDetailPanel from './StepDetailPanel'
import DocTracker from '../docs/DocTracker'
import Toast from '../shared/Toast'
import StepStripChart from '../dashboard/StepStripChart'

/**
 * @param {{
 *   projectId: string,
 *   onBack: function,
 * }} props
 */
export default function ProjectView({ projectId, onBack }) {
  const { state } = useProject()
  const project = state.projects.find((p) => p.project_id === projectId)

  const [selectedStep, setSelectedStep] = useState(() => {
    if (!project) return null
    return getActiveStepNumber(project.steps) ?? 1
  })
  const [toast, setToast] = useState(null) // { message, type }
  const [showDocs, setShowDocs] = useState(false)

  const showToast = useCallback((message, type = 'warning') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  if (!project) {
    return (
      <div className="p-8">
        <button onClick={onBack} className="text-indigo-600 hover:underline text-sm mb-4">
          ← Back to Dashboard
        </button>
        <p className="text-gray-500">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Project header */}
      <ProjectHeader
        project={project}
        onBack={onBack}
        onArchived={onBack}
        onDeleted={onBack}
        onDuplicated={onBack}
      />

      {/* Strip chart */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center gap-3 mb-1.5">
          <StepStripChart steps={project.steps} />
          <button
            onClick={() => setShowDocs((v) => !v)}
            className="shrink-0 text-xs font-medium text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-2.5 py-1 rounded-md transition-colors"
          >
            {showDocs ? 'Hide Docs' : 'Doc Registry'}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          {project.steps.filter((s) => s.status === 'complete').length} / 24 steps complete
        </p>
      </div>

      {/* Doc tracker (collapsible) */}
      {showDocs && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <DocTracker projectId={projectId} docRegistry={project.doc_registry} />
        </div>
      )}

      {/* Main split panel */}
      <div className="flex flex-1 min-h-0">
        {/* Left: checklist (35%) */}
        <div className="w-[35%] border-r border-gray-200 bg-white flex flex-col min-h-0">
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Steps</p>
          </div>
          <StepChecklist
            steps={project.steps}
            selectedStepNumber={selectedStep}
            onSelectStep={setSelectedStep}
          />
        </div>

        {/* Right: step detail (65%) */}
        <div className="flex-1 bg-white flex flex-col min-h-0">
          {selectedStep ? (
            <StepDetailPanel
              projectId={projectId}
              stepNumber={selectedStep}
              allSteps={project.steps}
              onWarning={(msg) => showToast(msg, 'warning')}
              onCopied={() => showToast('Prompt copied to clipboard!', 'success')}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a step to view details.
            </div>
          )}
        </div>
      </div>

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}
    </div>
  )
}

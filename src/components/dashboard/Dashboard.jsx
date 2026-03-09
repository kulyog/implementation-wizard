// /src/components/dashboard/Dashboard.jsx
// Dashboard view — lists all active projects as cards.
// Contains the Create Project button that opens CreateProjectModal.

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'
import ProjectCard from './ProjectCard'
import CreateProjectModal from './CreateProjectModal'
import Tooltip from '../layout/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'
import { SUPPORT_PERSONAS } from '../../data/supportPersonas'
import { useClipboard } from '../../hooks/useClipboard'
import Toast from '../shared/Toast'

/**
 * @param {{ onOpenProject: function }} props
 */
export default function Dashboard({ onOpenProject }) {
  const { state } = useProject()
  const [showCreate, setShowCreate] = useState(false)

  // Only show active (non-archived) projects on the dashboard (BR-09)
  const activeProjects = state.projects.filter((p) => p.status !== 'archived')

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeProjects.length === 0
              ? 'No projects yet — create one to get started.'
              : `${activeProjects.length} active project${activeProjects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Tooltip text={TOOLTIPS.newProject} position="bottom">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            <span className="text-base leading-none">+</span>
            New Project
          </button>
        </Tooltip>
      </div>

      {/* Project grid */}
      {activeProjects.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeProjects.map((project) => (
            <ProjectCard
              key={project.project_id}
              project={project}
              onOpen={onOpenProject}
            />
          ))}
        </div>
      )}

      {/* Support Personas */}
      <SupportPersonasPanel />

      {/* Create Project Modal */}
      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}

function EmptyState({ onCreate }) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
      <div className="text-4xl mb-3">🧭</div>
      <h2 className="text-base font-semibold text-gray-700 mb-1">No projects yet</h2>
      <p className="text-sm text-gray-400 mb-5">
        Create your first project to start tracking your 24-step build process.
      </p>
      <button
        onClick={onCreate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
      >
        Create First Project
      </button>
    </div>
  )
}

function PersonaCard({ persona, onCopied }) {
  const { copy, copied } = useClipboard()

  async function handleCopy() {
    const ok = await copy(persona.prompt_text)
    if (ok) onCopied()
  }

  return (
    <div className="py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">{persona.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{persona.description}</p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 text-xs font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
        >
          {copied ? 'Copied! ✓' : 'Copy Definition'}
        </button>
      </div>
      {persona.example_prompt && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">How to invoke:</p>
          <pre className="text-xs text-gray-600 bg-gray-100 rounded-md px-3 py-2 whitespace-pre-wrap font-mono leading-relaxed">
            {persona.example_prompt}
          </pre>
        </div>
      )}
    </div>
  )
}

function SupportPersonasPanel() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null)

  return (
    <div className="mt-8 border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-gray-700">Support Personas</span>
          <span className="ml-2 text-xs text-gray-400">
            — Reference panel — copy individual persona definitions or view example invocation prompts.
          </span>
        </div>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-3">
          {/* Individual persona cards */}
          <div className="divide-y divide-gray-100">
            {SUPPORT_PERSONAS.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onCopied={() =>
                  setToast('Persona definition copied. Paste into Claude Web → Project Settings → Project Instructions.')
                }
              />
            ))}
          </div>
        </div>
      )}
      {toast && (
        <Toast message={toast} type="success" onDismiss={() => setToast(null)} />
      )}
    </div>
  )
}

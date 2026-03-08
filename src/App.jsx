// /src/App.jsx
// Root component. Owns top-level navigation state.
// Renders one view at a time: Dashboard, ProjectView, or ArchivedView.

import { useState } from 'react'
import { ProjectProvider, useProject } from './context/ProjectContext'
import { useStorage } from './hooks/useStorage'
import Dashboard from './components/dashboard/Dashboard'

// ---------------------------------------------------------------------------
// Inner app — consumes context (must be inside ProjectProvider)
// ---------------------------------------------------------------------------

function AppInner() {
  const { state, dispatch } = useProject()

  // currentView: 'dashboard' | 'project' | 'archived'
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentProjectId, setCurrentProjectId] = useState(null)

  // Sync state ↔ localStorage
  useStorage(state, dispatch)

  // Don't render until hydrated from localStorage
  if (!state.hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    )
  }

  function openProject(projectId) {
    setCurrentProjectId(projectId)
    setCurrentView('project')
  }

  function goToDashboard() {
    setCurrentProjectId(null)
    setCurrentView('dashboard')
  }

  function goToArchived() {
    setCurrentView('archived')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button
          onClick={goToDashboard}
          className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
        >
          Implementation Wizard
        </button>
        <nav className="flex items-center gap-4">
          <button
            onClick={goToArchived}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Archived
          </button>
        </nav>
      </header>

      {/* View rendering */}
      <main>
        {currentView === 'dashboard' && (
          <Dashboard onOpenProject={openProject} />
        )}
        {currentView === 'project' && currentProjectId && (
          <ProjectViewPlaceholder
            projectId={currentProjectId}
            onBack={goToDashboard}
          />
        )}
        {currentView === 'archived' && (
          <ArchivedViewPlaceholder onBack={goToDashboard} />
        )}
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Placeholder views — replaced in later sprints
// ---------------------------------------------------------------------------

function ProjectViewPlaceholder({ projectId, onBack }) {
  const { state } = useProject()
  const project = state.projects.find((p) => p.project_id === projectId)

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
    <div className="p-8">
      <button onClick={onBack} className="text-indigo-600 hover:underline text-sm mb-4">
        ← Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.project_name}</h1>
      <p className="text-gray-500 text-sm mb-6">{project.project_description}</p>
      <p className="text-gray-400 text-sm italic">
        ProjectView will be built in Sprint 1 tasks S1-13 to S1-17.
      </p>
    </div>
  )
}

function ArchivedViewPlaceholder({ onBack }) {
  const { state } = useProject()
  const archived = state.projects.filter((p) => p.status === 'archived')

  return (
    <div className="p-8">
      <button onClick={onBack} className="text-indigo-600 hover:underline text-sm mb-4">
        ← Back to Dashboard
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Archived Projects</h1>
      {archived.length === 0 ? (
        <p className="text-gray-500 text-sm">No archived projects.</p>
      ) : (
        <ul className="space-y-2">
          {archived.map((p) => (
            <li key={p.project_id} className="text-gray-700 text-sm">
              {p.project_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Root export — wraps everything in ProjectProvider
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <ProjectProvider>
      <AppInner />
    </ProjectProvider>
  )
}

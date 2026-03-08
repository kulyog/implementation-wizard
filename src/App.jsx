// /src/App.jsx
// Root component. Owns top-level navigation state.
// Renders one view at a time: Dashboard, ProjectView, or ArchivedView.

import { useState, useCallback } from 'react'
import { ProjectProvider, useProject } from './context/ProjectContext'
import { useStorage } from './hooks/useStorage'
import Dashboard from './components/dashboard/Dashboard'
import ProjectView from './components/project/ProjectView'
import ArchivedView from './components/archived/ArchivedView'
import Toast from './components/shared/Toast'
import Tooltip from './components/layout/Tooltip'
import { TOOLTIPS } from './constants/tooltips'

// ---------------------------------------------------------------------------
// Inner app — consumes context (must be inside ProjectProvider)
// ---------------------------------------------------------------------------

function AppInner() {
  const { state, dispatch } = useProject()

  // currentView: 'dashboard' | 'project' | 'archived'
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [toast, setToast] = useState(null) // { message, type }

  // Sync state ↔ localStorage; get export/import functions
  const { exportData, importData } = useStorage(state, dispatch)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

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

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const result = await importData(file)
      showToast(result.message, result.ok ? 'success' : 'error')
    }
    input.click()
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
        <nav className="flex items-center gap-3">
          <Tooltip text={TOOLTIPS.archivedProjects} position="bottom">
            <button
              onClick={goToArchived}
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Archived
            </button>
          </Tooltip>
          <Tooltip text={TOOLTIPS.importData} position="bottom">
            <button
              onClick={handleImport}
              className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition-colors"
            >
              Import
            </button>
          </Tooltip>
          <Tooltip text={TOOLTIPS.exportData} position="bottom">
            <button
              onClick={exportData}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-3 py-1.5 rounded-md transition-colors"
            >
              Export
            </button>
          </Tooltip>
        </nav>
      </header>

      {/* View rendering */}
      <main>
        {currentView === 'dashboard' && (
          <Dashboard onOpenProject={openProject} />
        )}
        {currentView === 'project' && currentProjectId && (
          <ProjectView
            projectId={currentProjectId}
            onBack={goToDashboard}
          />
        )}
        {currentView === 'archived' && (
          <ArchivedView onBack={goToDashboard} onOpenProject={openProject} />
        )}
      </main>

      {/* Global toast (import success/failure) */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
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

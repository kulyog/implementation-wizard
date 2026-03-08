// /src/components/dashboard/Dashboard.jsx
// Dashboard view — lists all active projects as cards.
// Contains the Create Project button that opens CreateProjectModal.

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'
import ProjectCard from './ProjectCard'
import CreateProjectModal from './CreateProjectModal'

/**
 * @param {{ onOpenProject: function }} props
 */
export default function Dashboard({ onOpenProject }) {
  const { state } = useProject()
  const [showCreate, setShowCreate] = useState(false)

  // Only show active (non-archived) projects on the dashboard (BR-09)
  const activeProjects = state.projects.filter((p) => p.status !== 'archived')

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
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
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          <span className="text-base leading-none">+</span>
          New Project
        </button>
      </div>

      {/* Project grid */}
      {activeProjects.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjects.map((project) => (
            <ProjectCard
              key={project.project_id}
              project={project}
              onOpen={onOpenProject}
            />
          ))}
        </div>
      )}

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

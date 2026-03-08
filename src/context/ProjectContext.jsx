// /src/context/ProjectContext.jsx
// Central state management for all project data.
// Uses useReducer + React Context. localStorage sync is handled by useStorage.

import { createContext, useContext, useReducer } from 'react'
import { STEPS, DEFAULT_DOC_REGISTRY } from '../data/steps'
import { deriveProjectStatus } from '../utils/stepLogic'

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState = {
  projects: [],
  hydrated: false, // true once localStorage data has been loaded
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a fresh array of 24 StepRecords (all Pending). */
function createStepRecords() {
  return STEPS.map((step) => ({
    step_number: step.step_number,
    status: 'pending',
    blocked_reason: '',
    notes: '',
    started_at: null,
    completed_at: null,
    time_in_step_seconds: 0,
  }))
}

/** Deep-clone a project (used for duplicate). */
function cloneProject(project) {
  return JSON.parse(JSON.stringify(project))
}

/** Update updated_at timestamp on a project. */
function touch(project) {
  return { ...project, updated_at: new Date().toISOString() }
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function projectReducer(state, action) {
  switch (action.type) {
    // -----------------------------------------------------------------------
    // HYDRATE — seed state from localStorage on mount (or after import)
    // -----------------------------------------------------------------------
    case 'HYDRATE': {
      const { payload } = action
      return {
        ...state,
        projects: Array.isArray(payload?.projects) ? payload.projects : [],
        hydrated: true,
      }
    }

    // -----------------------------------------------------------------------
    // CREATE_PROJECT — add a new project with 24 fresh steps
    // -----------------------------------------------------------------------
    case 'CREATE_PROJECT': {
      const { project_name, project_description = '' } = action.payload
      const now = new Date().toISOString()
      const newProject = {
        project_id: crypto.randomUUID(),
        project_name: project_name.trim(),
        project_description: project_description.trim(),
        created_at: now,
        updated_at: now,
        status: 'active',
        steps: createStepRecords(),
        doc_registry: DEFAULT_DOC_REGISTRY.map((doc) => ({ ...doc })),
      }
      return { ...state, projects: [...state.projects, newProject] }
    }

    // -----------------------------------------------------------------------
    // UPDATE_STEP_STATUS — change a step's status, enforce BR-05 (clear block)
    // -----------------------------------------------------------------------
    case 'UPDATE_STEP_STATUS': {
      const { project_id, step_number, status, blocked_reason = '' } = action.payload
      const now = new Date().toISOString()

      const projects = state.projects.map((project) => {
        if (project.project_id !== project_id) return project

        const steps = project.steps.map((step) => {
          if (step.step_number !== step_number) return step

          const updated = { ...step, status }

          // Set started_at on first transition to in_progress
          if (status === 'in_progress' && !step.started_at) {
            updated.started_at = now
          }

          // Set completed_at when marking complete; clear it if un-completing
          if (status === 'complete') {
            updated.completed_at = now
            // Accumulate time_in_step_seconds if it was in_progress
            if (step.status === 'in_progress' && step.started_at) {
              const elapsed = Math.floor(
                (new Date(now) - new Date(step.started_at)) / 1000
              )
              updated.time_in_step_seconds = (step.time_in_step_seconds || 0) + elapsed
            }
          } else {
            updated.completed_at = null
          }

          // Handle blocked status (BR-04)
          if (status === 'blocked') {
            updated.blocked_reason = blocked_reason
          }

          // Handle clearing a block (BR-05): append prior reason to notes
          if (step.status === 'blocked' && status !== 'blocked' && step.blocked_reason) {
            const ts = now.slice(0, 19).replace('T', ' ')
            const note = `[Block cleared ${ts}] Was blocked: ${step.blocked_reason}`
            updated.notes = step.notes
              ? `${step.notes}\n\n${note}`
              : note
            updated.blocked_reason = ''
          }

          return updated
        })

        // Auto-transition doc_registry when a step completes
        const doc_registry = project.doc_registry.map((doc) => {
          if (doc.linked_step === step_number && status === 'complete' && doc.status === 'pending') {
            return { ...doc, status: 'created' }
          }
          return doc
        })

        const updatedProject = touch({ ...project, steps, doc_registry })
        updatedProject.status =
          project.status === 'archived'
            ? 'archived'
            : deriveProjectStatus(steps)

        return updatedProject
      })

      return { ...state, projects }
    }

    // -----------------------------------------------------------------------
    // UPDATE_STEP_NOTES — save free-text notes for a step
    // -----------------------------------------------------------------------
    case 'UPDATE_STEP_NOTES': {
      const { project_id, step_number, notes } = action.payload

      const projects = state.projects.map((project) => {
        if (project.project_id !== project_id) return project

        const steps = project.steps.map((step) =>
          step.step_number === step_number ? { ...step, notes } : step
        )
        return touch({ ...project, steps })
      })

      return { ...state, projects }
    }

    // -----------------------------------------------------------------------
    // RENAME_PROJECT — update name and/or description (F-05)
    // -----------------------------------------------------------------------
    case 'RENAME_PROJECT': {
      const { project_id, project_name, project_description } = action.payload

      const projects = state.projects.map((project) => {
        if (project.project_id !== project_id) return project
        return touch({
          ...project,
          project_name: project_name.trim(),
          project_description:
            project_description !== undefined
              ? project_description.trim()
              : project.project_description,
        })
      })

      return { ...state, projects }
    }

    // -----------------------------------------------------------------------
    // ARCHIVE_PROJECT — set status to 'archived' (BR-09)
    // -----------------------------------------------------------------------
    case 'ARCHIVE_PROJECT': {
      const { project_id } = action.payload

      const projects = state.projects.map((project) => {
        if (project.project_id !== project_id) return project
        return touch({ ...project, status: 'archived' })
      })

      return { ...state, projects }
    }

    // -----------------------------------------------------------------------
    // UNARCHIVE_PROJECT — restore archived project to active
    // -----------------------------------------------------------------------
    case 'UNARCHIVE_PROJECT': {
      const { project_id } = action.payload

      const projects = state.projects.map((project) => {
        if (project.project_id !== project_id) return project
        return touch({ ...project, status: 'active' })
      })

      return { ...state, projects }
    }

    // -----------------------------------------------------------------------
    // DELETE_PROJECT — permanent removal (BR-08 — confirmation handled in UI)
    // -----------------------------------------------------------------------
    case 'DELETE_PROJECT': {
      const { project_id } = action.payload
      return {
        ...state,
        projects: state.projects.filter((p) => p.project_id !== project_id),
      }
    }

    // -----------------------------------------------------------------------
    // DUPLICATE_PROJECT — copy with "(Copy)" suffix, reset all steps (F-21)
    // -----------------------------------------------------------------------
    case 'DUPLICATE_PROJECT': {
      const { project_id } = action.payload
      const source = state.projects.find((p) => p.project_id === project_id)
      if (!source) return state

      const now = new Date().toISOString()
      const duplicate = {
        ...cloneProject(source),
        project_id: crypto.randomUUID(),
        project_name: `Copy of ${source.project_name}`,
        created_at: now,
        updated_at: now,
        status: 'active',
        steps: createStepRecords(),
        doc_registry: DEFAULT_DOC_REGISTRY.map((doc) => ({ ...doc })),
      }

      return { ...state, projects: [...state.projects, duplicate] }
    }

    // -----------------------------------------------------------------------
    // UPDATE_DOC_REGISTRY — update a doc registry entry (F-13, F-14)
    // -----------------------------------------------------------------------
    case 'UPDATE_DOC_REGISTRY': {
      const { project_id, file_name, updates } = action.payload

      const projects = state.projects.map((project) => {
        if (project.project_id !== project_id) return project

        const doc_registry = project.doc_registry.map((doc) =>
          doc.file_name === file_name ? { ...doc, ...updates } : doc
        )
        return touch({ ...project, doc_registry })
      })

      return { ...state, projects }
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ProjectContext = createContext(null)

/**
 * ProjectProvider — wrap the app to provide project state to all components.
 */
export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  )
}

/**
 * useProject — consume the ProjectContext in any component.
 * @returns {{ state: object, dispatch: function }}
 */
export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}

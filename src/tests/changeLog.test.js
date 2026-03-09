// /src/tests/changeLog.test.js
// Vitest unit tests for Change Log reducer actions and Claude Web setup gate.
// Tests the projectReducer directly as a pure function.

import { describe, it, expect } from 'vitest'
import { projectReducer } from '../context/ProjectContext'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProject(overrides = {}) {
  return {
    project_id: 'proj-1',
    project_name: 'Test Project',
    project_description: '',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    status: 'active',
    steps: [],
    doc_registry: [],
    change_log: [],
    claude_web_setup_complete: false,
    ...overrides,
  }
}

function makeState(projects = []) {
  return { projects, hydrated: true }
}

function makeEntry(overrides = {}) {
  return {
    date: '2026-03-09',
    type: 'A',
    description: 'Test entry',
    version_target: 'V1.1',
    personas_to_rerun: 'QC Analyst',
    status: 'Open',
    ...overrides,
  }
}

/** Run a dispatch and return the updated project from the resulting state. */
function dispatch(state, action) {
  return projectReducer(state, action)
}

function getProject(state, projectId = 'proj-1') {
  return state.projects.find((p) => p.project_id === projectId)
}

// ---------------------------------------------------------------------------
// Change Log reducer actions
// ---------------------------------------------------------------------------

describe('Change Log reducer actions', () => {
  it('Test 1 — ADD_CHANGE_LOG_ENTRY appends entry with correct fields', () => {
    const state = makeState([makeProject()])
    const next = dispatch(state, {
      type: 'ADD_CHANGE_LOG_ENTRY',
      payload: { project_id: 'proj-1', entry: makeEntry() },
    })
    const log = getProject(next).change_log
    expect(log).toHaveLength(1)
    expect(log[0].date).toBe('2026-03-09')
    expect(log[0].type).toBe('A')
    expect(log[0].description).toBe('Test entry')
    expect(log[0].version_target).toBe('V1.1')
    expect(log[0].personas_to_rerun).toBe('QC Analyst')
    expect(log[0].status).toBe('Open')
  })

  it('Test 2 — ADD_CHANGE_LOG_ENTRY generates a non-empty id', () => {
    const state = makeState([makeProject()])
    const next = dispatch(state, {
      type: 'ADD_CHANGE_LOG_ENTRY',
      payload: { project_id: 'proj-1', entry: makeEntry() },
    })
    const entry = getProject(next).change_log[0]
    expect(typeof entry.id).toBe('string')
    expect(entry.id.length).toBeGreaterThan(0)
  })

  it('Test 3 — UPDATE_CHANGE_LOG_ENTRY updates correct entry, leaves second unchanged', () => {
    const project = makeProject({
      change_log: [
        { id: 'e1', date: '2026-03-01', type: 'A', description: 'First', status: 'Open' },
        { id: 'e2', date: '2026-03-02', type: 'B', description: 'Second', status: 'Open' },
      ],
    })
    const state = makeState([project])
    const next = dispatch(state, {
      type: 'UPDATE_CHANGE_LOG_ENTRY',
      payload: { project_id: 'proj-1', id: 'e1', updates: { status: 'Closed', description: 'Updated' } },
    })
    const log = getProject(next).change_log
    expect(log[0].status).toBe('Closed')
    expect(log[0].description).toBe('Updated')
    expect(log[1].description).toBe('Second')
    expect(log[1].status).toBe('Open')
  })

  it('Test 4 — DELETE_CHANGE_LOG_ENTRY removes correct entry, leaves second', () => {
    const project = makeProject({
      change_log: [
        { id: 'e1', date: '2026-03-01', type: 'A', description: 'First', status: 'Open' },
        { id: 'e2', date: '2026-03-02', type: 'B', description: 'Second', status: 'Open' },
      ],
    })
    const state = makeState([project])
    const next = dispatch(state, {
      type: 'DELETE_CHANGE_LOG_ENTRY',
      payload: { project_id: 'proj-1', id: 'e1' },
    })
    const log = getProject(next).change_log
    expect(log).toHaveLength(1)
    expect(log[0].id).toBe('e2')
  })

  it('Test 5 — DELETE_CHANGE_LOG_ENTRY with unknown id is a no-op', () => {
    const project = makeProject({
      change_log: [
        { id: 'e1', date: '2026-03-01', type: 'A', description: 'First', status: 'Open' },
      ],
    })
    const state = makeState([project])
    const next = dispatch(state, {
      type: 'DELETE_CHANGE_LOG_ENTRY',
      payload: { project_id: 'proj-1', id: 'no-such-id' },
    })
    expect(getProject(next).change_log).toHaveLength(1)
  })
})

// ---------------------------------------------------------------------------
// Claude Web setup gate
// ---------------------------------------------------------------------------

describe('Claude Web setup gate', () => {
  it('Test 6 — SET_CLAUDE_WEB_SETUP_COMPLETE sets value to true', () => {
    const state = makeState([makeProject({ claude_web_setup_complete: false })])
    const next = dispatch(state, {
      type: 'SET_CLAUDE_WEB_SETUP_COMPLETE',
      payload: { projectId: 'proj-1', value: true },
    })
    expect(getProject(next).claude_web_setup_complete).toBe(true)
  })

  it('Test 7 — SET_CLAUDE_WEB_SETUP_COMPLETE sets value to false', () => {
    const state = makeState([makeProject({ claude_web_setup_complete: true })])
    const next = dispatch(state, {
      type: 'SET_CLAUDE_WEB_SETUP_COMPLETE',
      payload: { projectId: 'proj-1', value: false },
    })
    expect(getProject(next).claude_web_setup_complete).toBe(false)
  })

  it('Test 8 — HYDRATE migration adds claude_web_setup_complete: false to legacy projects', () => {
    const rawProject = {
      project_id: 'proj-1',
      project_name: 'Old Project',
      status: 'active',
      steps: [],
      doc_registry: [],
      change_log: [],
      // claude_web_setup_complete intentionally absent
    }
    const next = dispatch({ projects: [], hydrated: false }, {
      type: 'HYDRATE',
      payload: { projects: [rawProject] },
    })
    expect(getProject(next)).toHaveProperty('claude_web_setup_complete', false)
  })

  it('Test 9 — HYDRATE migration adds change_log: [] to legacy projects', () => {
    const rawProject = {
      project_id: 'proj-1',
      project_name: 'Old Project',
      status: 'active',
      steps: [],
      doc_registry: [],
      claude_web_setup_complete: false,
      // change_log intentionally absent
    }
    const next = dispatch({ projects: [], hydrated: false }, {
      type: 'HYDRATE',
      payload: { projects: [rawProject] },
    })
    expect(getProject(next).change_log).toEqual([])
  })
})

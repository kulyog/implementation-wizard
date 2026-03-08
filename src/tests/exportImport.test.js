// /src/tests/exportImport.test.js
// Vitest tests for parseAndValidateBackup() — valid, invalid, and version-mismatch cases.
// Uses the pure JSON-string function (no FileReader / browser APIs needed in Node).

import { describe, it, expect } from 'vitest'
import { parseAndValidateBackup } from '../utils/exportImport'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStepRecord(step_number) {
  return {
    step_number,
    status: 'pending',
    blocked_reason: '',
    notes: '',
    started_at: null,
    completed_at: null,
    time_in_step_seconds: 0,
  }
}

function makeSteps() {
  return Array.from({ length: 24 }, (_, i) => makeStepRecord(i + 1))
}

function makeDocRecord(file_name, linked_step) {
  return { file_name, linked_step, status: 'pending', user_note: '' }
}

function makeProject(overrides = {}) {
  return {
    project_id: 'test-uuid-1',
    project_name: 'Test Project',
    project_description: '',
    created_at: '2026-03-08T10:00:00.000Z',
    updated_at: '2026-03-08T10:00:00.000Z',
    status: 'active',
    steps: makeSteps(),
    doc_registry: [makeDocRecord('01-functional-requirements.md', 2)],
    ...overrides,
  }
}

function makeBackup(overrides = {}) {
  return {
    export_format: 'implementation-wizard-backup',
    schema_version: 1,
    exported_at: '2026-03-08T15:00:00.000Z',
    projects: [makeProject()],
    ...overrides,
  }
}

/** Serialize to JSON string (simulates what FileReader provides). */
function toJson(obj) {
  return JSON.stringify(obj)
}

// ---------------------------------------------------------------------------
// Valid backup
// ---------------------------------------------------------------------------

describe('parseAndValidateBackup — valid backup', () => {
  it('accepts a well-formed backup with one project', () => {
    const result = parseAndValidateBackup(toJson(makeBackup()))
    expect(result.ok).toBe(true)
    expect(result.data.projects).toHaveLength(1)
    expect(result.message).toContain('1 project')
  })

  it('accepts a backup with multiple projects', () => {
    const backup = makeBackup({
      projects: [makeProject(), makeProject({ project_id: 'uuid-2', project_name: 'Second' })],
    })
    const result = parseAndValidateBackup(toJson(backup))
    expect(result.ok).toBe(true)
    expect(result.data.projects).toHaveLength(2)
    expect(result.message).toContain('2 project')
  })

  it('accepts a backup with zero projects', () => {
    const result = parseAndValidateBackup(toJson(makeBackup({ projects: [] })))
    expect(result.ok).toBe(true)
    expect(result.data.projects).toHaveLength(0)
  })

  it('returns correct schema_version and exported_at', () => {
    const result = parseAndValidateBackup(toJson(makeBackup()))
    expect(result.data.schema_version).toBe(1)
    expect(result.data.exported_at).toBe('2026-03-08T15:00:00.000Z')
  })

  it('accepts a project with archived status', () => {
    const result = parseAndValidateBackup(toJson(makeBackup({ projects: [makeProject({ status: 'archived' })] })))
    expect(result.ok).toBe(true)
  })

  it('accepts a project with complete status', () => {
    const allComplete = makeSteps().map((s) => ({ ...s, status: 'complete' }))
    const result = parseAndValidateBackup(toJson(makeBackup({ projects: [makeProject({ status: 'complete', steps: allComplete })] })))
    expect(result.ok).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Schema validation failures
// ---------------------------------------------------------------------------

describe('parseAndValidateBackup — schema validation failures', () => {
  it('rejects if export_format is wrong', () => {
    const result = parseAndValidateBackup(toJson(makeBackup({ export_format: 'something-else' })))
    expect(result.ok).toBe(false)
    expect(result.message).toContain('schema errors')
  })

  it('rejects if export_format is missing', () => {
    const { export_format, ...backup } = makeBackup()
    expect(parseAndValidateBackup(toJson(backup)).ok).toBe(false)
  })

  it('rejects if projects array is missing', () => {
    const { projects, ...backup } = makeBackup()
    expect(parseAndValidateBackup(toJson(backup)).ok).toBe(false)
  })

  it('rejects if projects is not an array', () => {
    expect(parseAndValidateBackup(toJson(makeBackup({ projects: 'not-an-array' }))).ok).toBe(false)
  })

  it('rejects if a project has an invalid status', () => {
    expect(parseAndValidateBackup(toJson(makeBackup({ projects: [makeProject({ status: 'unknown' })] }))).ok).toBe(false)
  })

  it('rejects if a project has fewer than 24 steps', () => {
    expect(parseAndValidateBackup(toJson(makeBackup({ projects: [makeProject({ steps: makeSteps().slice(0, 10) })] }))).ok).toBe(false)
  })

  it('rejects if a step has an invalid status', () => {
    const steps = makeSteps()
    steps[0] = { ...steps[0], status: 'not-valid' }
    expect(parseAndValidateBackup(toJson(makeBackup({ projects: [makeProject({ steps })] }))).ok).toBe(false)
  })

  it('rejects if project_name is missing', () => {
    const { project_name, ...project } = makeProject()
    expect(parseAndValidateBackup(toJson(makeBackup({ projects: [project] }))).ok).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Schema version mismatch
// ---------------------------------------------------------------------------

describe('parseAndValidateBackup — schema version mismatch', () => {
  it('rejects backup with schema_version > 1', () => {
    const result = parseAndValidateBackup(toJson(makeBackup({ schema_version: 2 })))
    expect(result.ok).toBe(false)
    expect(result.message).toContain('schema version')
  })

  it('accepts backup with schema_version === 1', () => {
    expect(parseAndValidateBackup(toJson(makeBackup({ schema_version: 1 }))).ok).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Malformed / non-JSON input
// ---------------------------------------------------------------------------

describe('parseAndValidateBackup — malformed input', () => {
  it('rejects non-JSON content', () => {
    const result = parseAndValidateBackup('this is not json')
    expect(result.ok).toBe(false)
    expect(result.message).toContain('valid JSON')
  })

  it('rejects an empty string', () => {
    expect(parseAndValidateBackup('').ok).toBe(false)
  })

  it('rejects a JSON string (not an object)', () => {
    expect(parseAndValidateBackup('"just a string"').ok).toBe(false)
  })
})

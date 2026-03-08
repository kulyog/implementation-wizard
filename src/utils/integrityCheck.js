// /src/utils/integrityCheck.js
// Startup validation: inspects the parsed localStorage data and returns
// a result object indicating whether the data is safe to use.
//
// Called by useStorage on mount, after migration, before hydrating context.

/**
 * @typedef {object} IntegrityResult
 * @property {boolean} ok       - true if data is structurally sound.
 * @property {string[]} errors  - Array of error messages if ok === false.
 * @property {string[]} warnings - Non-blocking issues found.
 */

/**
 * Run a structural integrity check on the parsed localStorage data.
 * @param {object} data - The parsed root object from localStorage.
 * @returns {IntegrityResult}
 */
export function integrityCheck(data) {
  const errors = []
  const warnings = []

  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['Root data is not an object.'], warnings: [] }
  }

  if (typeof data.schema_version !== 'number') {
    errors.push('Missing or invalid schema_version field.')
  }

  if (!Array.isArray(data.projects)) {
    errors.push('Missing or invalid projects array.')
    return { ok: false, errors, warnings }
  }

  for (let i = 0; i < data.projects.length; i++) {
    const project = data.projects[i]
    const prefix = `Project[${i}]`

    if (!project || typeof project !== 'object') {
      errors.push(`${prefix}: not an object.`)
      continue
    }

    if (typeof project.project_id !== 'string' || project.project_id.trim() === '') {
      errors.push(`${prefix}: missing or empty project_id.`)
    }

    if (typeof project.project_name !== 'string' || project.project_name.trim() === '') {
      errors.push(`${prefix}: missing or empty project_name.`)
    }

    const validStatuses = ['active', 'complete', 'archived']
    if (!validStatuses.includes(project.status)) {
      errors.push(`${prefix}: invalid status '${project.status}'.`)
    }

    if (!Array.isArray(project.steps)) {
      errors.push(`${prefix}: missing or invalid steps array.`)
      continue
    }

    if (project.steps.length !== 24) {
      warnings.push(`${prefix}: steps array has ${project.steps.length} items (expected 24).`)
    }

    const validStepStatuses = ['pending', 'in_progress', 'complete', 'blocked']
    for (let j = 0; j < project.steps.length; j++) {
      const step = project.steps[j]
      const stepPrefix = `${prefix} Step[${j}]`

      if (!step || typeof step !== 'object') {
        errors.push(`${stepPrefix}: not an object.`)
        continue
      }

      if (typeof step.step_number !== 'number') {
        errors.push(`${stepPrefix}: missing or invalid step_number.`)
      }

      if (!validStepStatuses.includes(step.status)) {
        errors.push(`${stepPrefix}: invalid status '${step.status}'.`)
      }

      if (step.status === 'blocked' && !step.blocked_reason?.trim()) {
        warnings.push(`${stepPrefix}: status is 'blocked' but blocked_reason is empty.`)
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}

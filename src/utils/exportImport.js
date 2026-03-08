// /src/utils/exportImport.js
// JSON export (F-17) and validated JSON import (F-18, B-01) utilities.
//
// parseAndValidateBackup(jsonString) — pure, Node-safe, used by tests.
// importProjects(file)              — browser wrapper using FileReader.

import Ajv from 'ajv'
import { BACKUP_SCHEMA } from '../data/schema'

const ajv = new Ajv({ allErrors: true })
const validateBackup = ajv.compile(BACKUP_SCHEMA)

/**
 * Export all projects (active + archived) as a timestamped JSON backup file.
 * Triggers a browser download.
 *
 * @param {Array} projects - All project records from context state.
 */
export function exportProjects(projects) {
  const exportObj = {
    export_format: 'implementation-wizard-backup',
    schema_version: 1,
    exported_at: new Date().toISOString(),
    projects,
  }

  const json = JSON.stringify(exportObj, null, 2)
  const date = new Date().toISOString().slice(0, 10)
  const filename = `implementation-wizard-backup-${date}.json`

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Parse and Ajv-validate a raw JSON string from a backup file.
 * Pure function — no browser APIs. Safe to call in Node (Vitest).
 *
 * @param {string} jsonString
 * @returns {{ ok: boolean, data?: object, message: string }}
 */
export function parseAndValidateBackup(jsonString) {
  let parsed

  // 1. Parse JSON
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    return { ok: false, message: 'Failed to parse file — ensure it is valid JSON.' }
  }

  // 2. Schema validation (B-01)
  const valid = validateBackup(parsed)
  if (!valid) {
    const errors = validateBackup.errors
      .map((err) => `${err.instancePath || '(root)'} ${err.message}`)
      .join('; ')
    return { ok: false, message: `Import rejected — schema errors: ${errors}` }
  }

  // 3. Schema version compatibility check
  if (parsed.schema_version > 1) {
    return {
      ok: false,
      message: `Import rejected — backup uses schema version ${parsed.schema_version}, but this app supports version 1 only.`,
    }
  }

  return {
    ok: true,
    data: {
      schema_version: parsed.schema_version,
      exported_at: parsed.exported_at ?? null,
      projects: parsed.projects,
    },
    message: `Imported ${parsed.projects.length} project(s) successfully.`,
  }
}

/**
 * Read a File and validate it as a backup.
 * Browser-only (uses FileReader). Returns a Promise.
 *
 * @param {File} file
 * @returns {Promise<{ ok: boolean, data?: object, message: string }>}
 */
export function importProjects(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(parseAndValidateBackup(e.target.result))
    reader.onerror = () => resolve({ ok: false, message: 'Failed to read file.' })
    reader.readAsText(file)
  })
}

// /src/hooks/useStorage.js
// Manages all localStorage read/write for the application.
//
// Responsibilities:
//   - On mount: read 'iw-data', run migration if needed, run integrityCheck,
//     dispatch HYDRATE to seed ProjectContext.
//   - On state change: serialise state to JSON, write to 'iw-data'.
//   - Expose exportData() and importData(file) for use by AppShell.

import { useEffect, useRef } from 'react'
import { migrate, needsMigration } from '../utils/migration'
import { integrityCheck } from '../utils/integrityCheck'

const STORAGE_KEY = 'iw-data'

/**
 * Build a fresh empty root object for first-run scenarios.
 * @returns {object}
 */
function emptyRoot() {
  return {
    schema_version: 1,
    exported_at: null,
    projects: [],
  }
}

/**
 * useStorage — custom hook that bridges ProjectContext state and localStorage.
 *
 * @param {object} state    - Current ProjectContext state (projects, etc.)
 * @param {function} dispatch - ProjectContext dispatch function
 * @returns {{ exportData: function, importData: function, integrityWarnings: string[] }}
 */
export function useStorage(state, dispatch) {
  const hydrated = useRef(false)
  const integrityWarningsRef = useRef([])

  // --- Mount: read, migrate, validate, hydrate ---
  useEffect(() => {
    let root = null

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        root = JSON.parse(raw)
      }
    } catch {
      console.warn('[useStorage] Failed to parse localStorage data. Starting fresh.')
      root = null
    }

    if (!root) {
      root = emptyRoot()
    }

    // Migration
    if (needsMigration(root.schema_version)) {
      try {
        root = migrate(root)
      } catch (err) {
        console.error('[useStorage] Migration failed:', err)
        root = emptyRoot()
      }
    }

    // Integrity check
    const result = integrityCheck(root)
    if (!result.ok) {
      console.error('[useStorage] Integrity check failed:', result.errors)
      // Data is corrupt — start fresh rather than crash
      integrityWarningsRef.current = [
        'Stored data failed integrity check. Starting with empty state.',
        ...result.errors,
      ]
      root = emptyRoot()
    } else if (result.warnings.length > 0) {
      console.warn('[useStorage] Integrity warnings:', result.warnings)
      integrityWarningsRef.current = result.warnings
    }

    hydrated.current = true
    dispatch({ type: 'HYDRATE', payload: root })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- State change: serialise and write ---
  useEffect(() => {
    if (!hydrated.current) return
    try {
      const serialised = JSON.stringify({
        schema_version: 1,
        exported_at: null,
        projects: state.projects,
      })
      localStorage.setItem(STORAGE_KEY, serialised)
    } catch (err) {
      console.error('[useStorage] Failed to write to localStorage:', err)
    }
  }, [state])

  // --- Export all data as a JSON backup file ---
  function exportData() {
    const exportObj = {
      export_format: 'implementation-wizard-backup',
      schema_version: 1,
      exported_at: new Date().toISOString(),
      projects: state.projects,
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

  // --- Import from a JSON backup file ---
  // Returns a Promise that resolves with { ok: boolean, message: string }
  function importData(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result)

          // Basic format check (full Ajv validation added in Sprint 2)
          if (parsed.export_format !== 'implementation-wizard-backup') {
            resolve({ ok: false, message: 'File is not a valid Implementation Wizard backup.' })
            return
          }
          if (!Array.isArray(parsed.projects)) {
            resolve({ ok: false, message: 'Backup file has no projects array.' })
            return
          }

          // Hydrate from imported data
          const root = {
            schema_version: parsed.schema_version ?? 1,
            exported_at: parsed.exported_at ?? null,
            projects: parsed.projects,
          }
          dispatch({ type: 'HYDRATE', payload: root })
          resolve({ ok: true, message: `Imported ${parsed.projects.length} project(s) successfully.` })
        } catch {
          resolve({ ok: false, message: 'Failed to parse backup file. Ensure it is valid JSON.' })
        }
      }
      reader.onerror = () => resolve({ ok: false, message: 'Failed to read file.' })
      reader.readAsText(file)
    })
  }

  return {
    exportData,
    importData,
    integrityWarnings: integrityWarningsRef.current,
  }
}

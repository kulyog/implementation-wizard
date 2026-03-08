// /src/components/dashboard/CreateProjectModal.jsx
// Modal for creating a new project (F-01).
// Validates: name required (max 100 chars), description optional (max 500 chars).

import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'

const MAX_NAME_LENGTH = 100
const MAX_DESC_LENGTH = 500

/**
 * @param {{ onClose: function }} props
 */
export default function CreateProjectModal({ onClose }) {
  const { dispatch } = useProject()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    const trimmedName = name.trim()

    if (!trimmedName) {
      errs.name = 'Project name is required.'
    } else if (trimmedName.length > MAX_NAME_LENGTH) {
      errs.name = `Project name must be ${MAX_NAME_LENGTH} characters or fewer.`
    }

    if (description.trim().length > MAX_DESC_LENGTH) {
      errs.description = `Description must be ${MAX_DESC_LENGTH} characters or fewer.`
    }

    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    dispatch({
      type: 'CREATE_PROJECT',
      payload: {
        project_name: name.trim(),
        project_description: description.trim(),
      },
    })

    onClose()
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Name field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="project-name">
              Project name <span className="text-red-500">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
              }}
              maxLength={MAX_NAME_LENGTH + 10} // allow slightly over for better UX message
              placeholder="e.g. Budget Tracker App"
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
              autoFocus
            />
            <div className="flex items-start justify-between mt-1">
              {errors.name ? (
                <p className="text-xs text-red-600">{errors.name}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {name.trim().length}/{MAX_NAME_LENGTH}
              </span>
            </div>
          </div>

          {/* Description field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="project-desc">
              Description{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
              }}
              rows={3}
              placeholder="Short description of what this app does…"
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <div className="flex items-start justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {description.trim().length}/{MAX_DESC_LENGTH}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

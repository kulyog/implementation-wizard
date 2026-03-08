// /src/constants/tooltips.js
// Plain-English tooltip strings for all UI controls.

export const TOOLTIPS = {
  newProject: 'Create a new project and begin tracking your 24-step AI-assisted build process.',
  exportData: 'Download all your projects (active and archived) as a JSON backup file. Export regularly to avoid data loss.',
  importData: 'Restore projects from a previously exported JSON backup file. This will replace all current data.',
  archivedProjects: 'View projects you have archived. Archived projects are hidden from the dashboard but retain all data.',
  openProject: 'Open this project to view and update your 24-step progress checklist.',
  renameProject: 'Edit the project name and description.',
  duplicateProject: 'Create a copy of this project with all step statuses reset to Pending. Useful for reusing your setup for a new build.',
  archiveProject: 'Move this project to the archive. It will no longer appear on the dashboard but all data is retained.',
  deleteProject: 'Permanently delete this project and all its data. This action cannot be undone.',
  copyPrompt: 'Copy the step prompt text to your clipboard. Paste it into Claude Web or Claude Code to run this step. Shortcut: Ctrl+Shift+C.',
  statusPending: 'This step has not been started yet.',
  statusInProgress: 'This step is currently being worked on. The timer will track elapsed time.',
  statusComplete: 'This step is finished. All prior steps must be complete before this can be set (except Steps 5 and 6 which may run in parallel).',
  statusBlocked: 'This step cannot proceed. You must enter a reason. The reason will be appended to notes when unblocked.',
  notesField: 'Free-text notes for this step. Paste Claude output, record decisions, or note anything relevant. Saved automatically when you click away.',
  stepTimer: 'Time elapsed while this step has been In Progress. Accumulates across sessions.',
  docRegistry: 'Track the /docs files produced by this project. Status updates automatically when linked steps are completed.',
  recoveryPrompt: 'Generate a recovery prompt you can paste into Claude Code to resume work. Lists all incomplete steps so Claude can pick up exactly where you left off.',
  nextAction: 'The recommended next action based on your current step progress.',
  stepStripChart: 'Visual overview of all 24 steps. Green = complete, blue = in progress, red = blocked, grey = pending.',
}

# CLAUDE.md
# Project: Implementation Wizard
# Last updated: 2026-03-09 (corrected actual file locations)

## What This App Does
A personal project tracker for a solo finance professional.
Tracks progress across multiple software build projects, each
following a fixed 24-step AI-assisted development process.
Single user. No authentication. No backend. Runs entirely in
the browser.

## Technology Stack
- React 18 (Vite 5) — functional components + hooks
- Tailwind CSS 3 — utility-first styling
- JavaScript (ES2022+) — NO TypeScript in V1.0
- localStorage — sole persistence mechanism (key: 'iw-data')
- Vitest 1 — unit testing (step logic, export/import)
- Recharts 2 — step-status strip chart (Sprint 2)
- Lucide React — icons
- Ajv 8 — JSON schema validation for import (Sprint 2)
- Deployment: GitHub Pages (gh-pages branch)

## Key File Paths
- /src/data/steps.js              Static 24-step definitions (READ-ONLY, never mutated)
- /src/data/supportPersonas.js    Support persona definitions (READ-ONLY, never mutated)
- /src/data/schema.js             Ajv JSON schema for import validation
- /src/context/ProjectContext.jsx useReducer + Context provider for all project state
- /src/hooks/useStorage.js        localStorage read/write, hydrate, migrate
- /src/utils/stepLogic.js         Business rule enforcement (BR-01 to BR-10)
- /src/utils/exportImport.js      Export/import serialisation and file I/O
- /src/utils/migration.js         Schema version migration
- /src/utils/integrityCheck.js    Startup data validation
- /src/App.jsx                    Root component — currentView + currentProjectId state
- /src/components/dashboard/      Dashboard, ProjectCard, CreateProjectModal, NextActionBanner
- /src/components/project/        ProjectView, StepChecklist, StepDetailPanel
- /src/tests/                     Vitest unit tests

## Folder Responsibilities
IMPORTANT — place new files in the correct folder:
- /src/utils/   Business logic and storage utilities. Currently: stepLogic.js,
                exportImport.js, migration.js, integrityCheck.js
                Add here: pure functions that enforce domain rules (BR-xx),
                export/import I/O, migration, and startup validation
- /src/data/    Static read-only data and schemas. Currently: steps.js,
                supportPersonas.js, schema.js
                Add here: static seed data and Ajv validation schemas
- /src/hooks/   React hooks that bridge store ↔ components
- /src/context/ React context providers and reducers
- /src/store/   UNUSED — do not place files here

## Folder Structure Rule
When creating any folder or directory structure, always place
a .gitkeep file inside every folder that has no other files.
Remove .gitkeep from a folder only when a real file is added.

## localStorage Schema
Key: 'iw-data'
Root: { schema_version: 1, exported_at: null, projects: [...] }
Current schema_version: 1

## Critical Business Rules
1. Steps are strictly sequential. Step N cannot be Complete until steps 1..N-1 are Complete.
   EXCEPTION: Steps 5 (UI Expert) and 6 (QC Analyst) may run in parallel —
   either may be started/completed once Step 4 is Complete, regardless of the other.
2. Blocked status requires a non-empty blocked_reason string. Button disabled if empty.
3. In Progress may be set at any time regardless of prior step status.
4. Prompt text in steps.js is NEVER user-editable (read-only display only).
5. All DateTime fields stored as ISO 8601 strings. UUIDs via crypto.randomUUID().
6. Status enums: 'pending' | 'in_progress' | 'complete' | 'blocked'
7. Actor enums: 'me' | 'claude_web' | 'claude_code'
8. Project status: 'active' | 'complete' | 'archived'
9. Deleting a project requires confirmation. Deletion is permanent.
10. Archive removes from active dashboard but retains all data.
11. Never use dangerouslySetInnerHTML anywhere in this codebase.

## Coding Standards
- Plain JavaScript (.jsx / .js) — no TypeScript files in /src
- One component per file in /src/components/
- No hardcoded credentials. No .env files needed (no backend).
- Validate user inputs before any localStorage write.
- All Supabase references REMOVED — this app uses localStorage only.
- No React Router — view switching via currentView state in App.jsx.
- No Redux/Zustand — useState + useContext is sufficient.

## Before Every Commit
- Zero console errors
- All High priority test cases in 05-test-cases.md pass
- Commit message format: [Sprint-N] Brief description

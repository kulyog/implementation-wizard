# 02 — Technical Specifications
## Implementation Wizard

| Field | Detail |
|---|---|
| **Document Version** | 1.3 |
| **Status** | ✅ Approved — Updated for post-V1.0 features |
| **Prepared By** | Technical Architect Persona |
| **Date** | 2026-03-09 |
| **Input Documents** | 01-functional-requirements.md v1.3, 03-ai-recommendations.md v1.1 (Final) |

> **v1.2 Change Note:** v1.2 adds post-launch sprint, new components, updated data model, BR-11, and current test summary.

> **v1.3 Change Note:** v1.3 updates Step 0 architecture, removes claude_web_setup_complete field, updates BR-11 to getStep0Gate, and reflects final file structure.

---

## 1. Objective

Deliver a single-user, browser-based personal productivity application — **Implementation Wizard** — that enables a solo finance professional to track multiple concurrent software build projects across a fixed 24-step AI-assisted development process. The application must be fully functional with no backend, no authentication, no external API calls at runtime, and no dependencies that incur ongoing cost beyond the Owner's existing Claude Pro subscription.

The delivered artefact is a static web application that runs entirely in a modern desktop browser.

---

## 2. Scope

### In Scope — Version 1.0

All 22 features (F-01 through F-22) and 10 business rules (BR-01 through BR-10) as defined in `01-functional-requirements.md v1.1`. Key capabilities:

- Full project lifecycle management (create, rename, archive, delete, duplicate)
- 24-step checklist with sequential enforcement and the Steps 5/6 parallel exception
- Step detail panel with fixed prompt text, one-click copy, notes, timestamps, and live time-in-step counter
- Document registry tracking /docs file creation status per project
- localStorage persistence with schema versioning and startup integrity check
- JSON export (active + archived) and validated JSON import
- Step-status strip chart on dashboard (C-06)
- Next Action contextual banner (C-02)
- AI-written tooltip help text (C-04)

Post-V1.0 additions (now in scope):
- Per-project Change Log with add/edit/delete (F-23)
- Support Personas card with Copy Definition (F-24)
- Step 0 mandatory Claude Web setup step with Copy All Definitions button (F-26, BR-11)

### Out of Scope — Version 1.0

Per `01-functional-requirements.md` Section 8, and Owner decisions in `03-ai-recommendations.md`:

- Authentication, multi-user access, cloud/server persistence
- Claude API integration at runtime
- "Open in Claude" deep-link button (C-03 — deferred V1.1)
- Markdown progress report export (C-05 — deferred V1.1)
- Mobile layout optimisation
- Custom step editing at runtime

---

## 3. Tech Stack

### 3.1 Stack Decisions

| Layer | Technology | Version | Justification |
|---|---|---|---|
| **UI Framework** | React | 18.x | Approved in AI recommendations (A-01, A-04). Component model suits the panel-based UI. Hooks provide clean state management without Redux overhead for this scale. Large ecosystem for Claude Artifacts and v0.dev compatibility. |
| **Build Tool** | Vite | 5.x | Fast cold starts, zero-config React setup, native ES modules. Produces a `/dist` folder of static files deployable anywhere with no server. Lighter than Create React App (deprecated). |
| **Styling** | Tailwind CSS | 3.x | Required for v0.dev (A-04) compatibility. Utility-first approach suits rapid iteration with Claude Code. No custom CSS file maintenance required. |
| **Language** | JavaScript (ES2022+) | — | No TypeScript for V1.0 — sole developer, solo project, time-to-delivery priority. TypeScript adds build complexity with limited benefit at this team size. Revisit for V1.1. |
| **Persistence** | Browser localStorage | Native | Mandated by Owner decision (OQ-03). Sufficient for single-user data volume. No backend, no cost, no network dependency. |
| **Schema Validation** | Ajv | 8.x | Recommended B-01. Validates JSON import files against a strict schema before any write. Lightweight (~50KB). Open source, no cost. |
| **Unit Testing** | Vitest | 1.x | Recommended B-02. Vitest integrates natively with Vite (same config, same runner). Faster than Jest for Vite projects. Used to test BR-01 sequencing logic. |
| **Icons** | Lucide React | 0.263.x | Consistent with Claude Artifacts default library. Lightweight, tree-shakeable. No additional cost. |
| **Charts** | Recharts | 2.x | Used for step-status strip chart (C-06). React-native, declarative API, composable. Open source. |
| **UUID Generation** | `crypto.randomUUID()` | Native | Built into all modern browsers. No library needed. |
| **Deployment** | Static file hosting | — | `/dist` output from Vite. Can be served from any static host (GitHub Pages, Netlify free tier, or simply opened as a local file). No server required. |

### 3.2 Explicitly Excluded

- No Node.js backend, Express, or any server-side runtime
- No database (PostgreSQL, SQLite, Firebase, Supabase, etc.)
- No React Router (single-page app with view state managed in React state)
- No Redux or Zustand (React `useState` + `useContext` is sufficient)
- No TypeScript (V1.0 only)
- No GitHub Copilot (rejected A-05 — Claude Code is sole development tool)

---

## 4. Application Architecture

The application is a **single-page application (SPA)** with no routing library. Navigation between views (Dashboard, Project View, Archived Projects) is controlled by a single `currentView` state variable in the root `App` component.

### 4.1 Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────────┐
│                     Browser Tab                         │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                   App.jsx                        │   │
│  │  (Root — owns currentView, currentProjectId)     │   │
│  │                                                  │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────┐  │   │
│  │  │ Dashboard  │  │ ProjectView │  │ Archived │  │   │
│  │  │  View      │  │             │  │  View    │  │   │
│  │  └────────────┘  └─────────────┘  └──────────┘  │   │
│  │        (only one rendered at a time)             │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                               │
│           ┌─────────────▼──────────────┐               │
│           │   ProjectContext (React)    │               │
│           │  projects[], dispatch()     │               │
│           └─────────────┬──────────────┘               │
│                         │                               │
│           ┌─────────────▼──────────────┐               │
│           │      useStorage hook        │               │
│           │  (read/write localStorage)  │               │
│           └─────────────┬──────────────┘               │
│                         │                               │
│           ┌─────────────▼──────────────┐               │
│           │  localStorage               │               │
│           │  key: 'iw-data'            │               │
│           │  { schema_version,          │               │
│           │    projects: [...] }        │               │
│           └────────────────────────────┘               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  /src/data/steps.js  (READ-ONLY static data)     │   │
│  │  STEPS array — 25 objects, never mutated         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 State Management Pattern

| State | Location | Mechanism |
|---|---|---|
| All project data (projects, steps, notes, statuses) | `ProjectContext` | `useReducer` — actions dispatched by UI components |
| Current view (Dashboard / ProjectView / Archived) | `App.jsx` | `useState` |
| Currently open project ID | `App.jsx` | `useState` |
| Currently open step number (within ProjectView) | `ProjectView.jsx` | `useState` |
| localStorage sync | `useStorage` custom hook | Fires on every `ProjectContext` state change via `useEffect` |
| Static step definitions | `/src/data/steps.js` | Module constant — never stored in state |

### 4.3 Data Flow

1. On app load: `useStorage` reads `localStorage['iw-data']`, runs schema version check and migration if needed, runs startup integrity validation (B-05), seeds `ProjectContext` with stored data (or empty state if first run).
2. User actions dispatch to `ProjectContext` reducer.
3. Reducer returns new state.
4. `useEffect` in `useStorage` detects state change, serialises to JSON, writes to `localStorage['iw-data']`.
5. UI re-renders from new context state.

All writes to localStorage are **synchronous** and happen on every state change. No debounce required at this data volume.

---

## 5. File and Folder Structure

```
implementation-wizard/
│
├── CLAUDE.md                          # Claude Code context file (A-02)
├── index.html                         # Vite entry point
├── vite.config.js                     # Vite configuration
├── package.json
├── tailwind.config.js
├── postcss.config.js
│
├── /src
│   ├── App.jsx                        # Root component — view router, top-level state
│   ├── main.jsx                       # React DOM entry point
│   ├── index.css                      # Tailwind base imports only
│   │
│   ├── /data
│   │   ├── steps.js                   # STEPS array — 25 static step definitions, Step 0–24 (READ-ONLY)
│   │   ├── schema.js                  # Ajv JSON schema for export/import validation (B-01)
│   │   └── supportPersonas.js         # SUPPORT_PERSONAS array — 8 persona definitions with prompt_text and example_prompt (F-24)
│   │
│   ├── /context
│   │   └── ProjectContext.jsx         # useReducer + Context provider for all project state
│   │
│   ├── /hooks
│   │   ├── useStorage.js              # localStorage read/write + schema migration (B-03)
│   │   ├── useClipboard.js            # Clipboard copy + confirmation state
│   │   └── useStepTimer.js            # Live elapsed time counter for In Progress steps (F-22)
│   │
│   ├── /utils
│   │   ├── stepLogic.js               # Business rule enforcement functions (BR-01 to BR-11)
│   │   ├── exportImport.js            # JSON export/import + Ajv validation (F-17, F-18)
│   │   ├── migration.js               # localStorage schema version migration (B-03)
│   │   └── integrityCheck.js          # Startup data validation (B-05)
│   │
│   ├── /components
│   │   │
│   │   ├── /layout
│   │   │   ├── AppShell.jsx           # Top nav bar, app title, global actions (export/import)
│   │   │   └── Tooltip.jsx            # Reusable tooltip wrapper (C-04)
│   │   │
│   │   ├── /dashboard
│   │   │   ├── Dashboard.jsx          # Dashboard view — project card grid + Support Personas panel
│   │   │   ├── ProjectCard.jsx        # Single project card with strip chart + next action
│   │   │   ├── StepStripChart.jsx     # 24-cell colour-coded status strip (C-06)
│   │   │   ├── NextActionBanner.jsx   # Contextual next-step instruction (C-02)
│   │   │   └── CreateProjectModal.jsx # New project form (F-01)
│   │   │
│   │   ├── /project
│   │   │   ├── ProjectView.jsx        # Project detail view — tab bar (Steps / Change Log)
│   │   │   ├── ProjectHeader.jsx      # Project name, description, rename, archive/delete (F-04, F-05)
│   │   │   ├── StepChecklist.jsx      # Step 0 + 24-step list with status badges and active highlight (F-06)
│   │   │   ├── StepRow.jsx            # Single row in the checklist
│   │   │   ├── StepDetailPanel.jsx    # Full step detail — all F-07 fields; Step 0 Copy All Definitions button
│   │   │   ├── AddChangeLogModal.jsx  # Modal for adding/editing change log entries (F-23)
│   │   │   └── ChangeLogView.jsx      # Change log tab view with table and actions (F-23)
│   │   │
│   │   ├── /step
│   │   │   ├── PromptBox.jsx          # Read-only prompt display + copy button (F-20)
│   │   │   ├── StatusControls.jsx     # Status buttons with BR enforcement (F-08, F-09, F-10, BR-11)
│   │   │   ├── BlockedReasonField.jsx # Conditional blocked reason input (F-10)
│   │   │   ├── NotesField.jsx         # Auto-saving free text notes area (F-07)
│   │   │   └── StepTimer.jsx          # Elapsed time display (F-22)
│   │   │
│   │   ├── /docs
│   │   │   └── DocTracker.jsx         # /docs file registry panel (F-12, F-13, F-14)
│   │   │
│   │   └── /shared
│   │       ├── StatusBadge.jsx        # Coloured status pill component
│   │       ├── ActorBadge.jsx         # Me / Claude Web / Claude Code badge
│   │       ├── ConfirmModal.jsx       # Reusable confirmation dialog (F-04, F-08)
│   │       ├── ErrorBoundary.jsx      # React error boundary — prevents blank screen on runtime error
│   │       └── Toast.jsx              # Transient notification (copy confirmed, import success, etc.)
│   │
│   ├── /constants
│   │   └── tooltips.js                # Tooltip text strings (C-04)
│   │
│   └── /tests
│       ├── stepLogic.test.js          # Vitest unit tests for BR-01 to BR-11 (B-02)
│       ├── exportImport.test.js       # Import validation and export shape tests
│       └── changeLog.test.js          # Vitest tests for Change Log reducer and Step 0 gate
│
├── /docs                              # Project documentation (these spec files)
│   ├── 01-functional-requirements.md
│   ├── 02-technical-specifications.md
│   ├── 03-ai-recommendations.md
│   ├── 04-wireframes.md
│   └── 05-test-cases.md
│
└── /dist                              # Vite build output (git-ignored)
```

---

## 6. Data Model — localStorage Schema

### 6.1 Root Object

```json
{
  "schema_version": 1,
  "exported_at": null,
  "projects": [ ...ProjectRecord ]
}
```

The `schema_version` integer is incremented whenever the data shape changes. The migration function in `/src/utils/migration.js` reads this value on startup and upgrades the stored data to the current shape before hydrating context state (B-03).

**localStorage key:** `iw-data`

---

### 6.2 ProjectRecord

```json
{
  "project_id": "uuid-v4-string",
  "project_name": "My App Build",
  "project_description": "Optional short description",
  "created_at": "2026-03-08T10:00:00.000Z",
  "updated_at": "2026-03-08T14:23:00.000Z",
  "status": "active",
  "steps": [ ...StepRecord × 25 ],
  "doc_registry": [ ...DocRegistryRecord ],
  "change_log": []
}
```

| Field | Type | Constraints |
|---|---|---|
| `project_id` | String (UUID) | `crypto.randomUUID()`. Immutable after creation. |
| `project_name` | String | Required. Max 100 chars. |
| `project_description` | String | Optional. Max 500 chars. Empty string if omitted. |
| `created_at` | String (ISO 8601) | Set once on creation. Never mutated. |
| `updated_at` | String (ISO 8601) | Updated on every project or step change. |
| `status` | Enum String | `'active'` \| `'complete'` \| `'archived'` |
| `steps` | Array | Always exactly 25 StepRecord objects. Step 0 through Step 24. Fixed order. |
| `doc_registry` | Array | Fixed set of DocRegistryRecord objects per project. |
| `change_log` | Array | Per-project change log entries. Initialised as []. Migrated by HYDRATE if missing. |

---

### 6.3 StepRecord

```json
{
  "step_number": 2,
  "status": "complete",
  "blocked_reason": "",
  "notes": "Pasted output from Claude here...",
  "started_at": "2026-03-08T10:05:00.000Z",
  "completed_at": "2026-03-08T10:47:00.000Z",
  "time_in_step_seconds": 2520
}
```

| Field | Type | Constraints |
|---|---|---|
| `step_number` | Integer | 0–24. Immutable. Used as key to look up static STEPS data. |
| `status` | Enum String | `'pending'` \| `'in_progress'` \| `'complete'` \| `'blocked'` |
| `blocked_reason` | String | Required (non-empty) when `status === 'blocked'`. Empty string otherwise. |
| `notes` | String | Free text. No length limit enforced. |
| `started_at` | String (ISO 8601) \| `null` | Set when status first transitions to `'in_progress'`. Never reset. |
| `completed_at` | String (ISO 8601) \| `null` | Set when status transitions to `'complete'`. Cleared if un-completed. |
| `time_in_step_seconds` | Integer | Cumulative elapsed seconds while `in_progress`. Computed and saved on each status change. |

> **Architecture note:** Static step data (name, actor, persona, description, prompt_text, expected_output, linked_docs) lives exclusively in `/src/data/steps.js` and is **never stored in localStorage**. StepRecord stores only mutable user data. The two are merged at render time using `step_number` as the join key.

---

### 6.4 Static Step Definition (steps.js shape)

```javascript
// /src/data/steps.js — NOT stored in localStorage
export const STEPS = [
  {
    step_number: 0,
    step_name: "Set Up Claude Web Project",
    actor: "me",
    persona: "",
    description: "One-time setup before starting the 24-step process. Copy all 8 persona definitions and paste them into Claude Web Project Settings → Project Instructions.",
    prompt_text: "",
    expected_output: "Claude Web project created with all 8 persona definitions in Project Instructions.",
    linked_docs: []
  },
  {
    step_number: 1,
    step_name: "Define Business Requirements",
    actor: "me",
    persona: "",
    description: "...",          // Plain-English — generated via C-01
    prompt_text: "[PLACEHOLDER — Prompt for Step 1 to be authored post-testing]",
    expected_output: "...",
    linked_docs: []
  },
  // ... 23 more
]
```

---

### 6.5 DocRegistryRecord

```json
{
  "file_name": "01-functional-requirements.md",
  "linked_step": 2,
  "status": "created",
  "user_note": "/docs/01-functional-requirements.md — v1.1 Final"
}
```

| Field | Type | Constraints |
|---|---|---|
| `file_name` | String | Fixed. System-defined per project template. |
| `linked_step` | Integer | The step number that produces this file. |
| `status` | Enum String | `'pending'` \| `'created'` \| `'noted'` |
| `user_note` | String | Optional. User-entered free text (file path, version note). |

**Status auto-transition rule:** When a step's status changes to `'complete'`, all `DocRegistryRecord` entries whose `linked_step` matches that step number automatically transition from `'pending'` to `'created'`. The user may further update to `'noted'` manually.

---

### 6.6 ChangeLogRecord

```json
{
  "id": "uuid-v4-string",
  "date": "2026-03-09",
  "type": "C",
  "description": "Add support personas card",
  "version_target": "V1.1",
  "personas_to_rerun": "UI Expert, QC Analyst",
  "status": "Closed"
}
```

| Field | Type | Constraints |
|---|---|---|
| `id` | String (UUID) | Generated on creation |
| `date` | String | ISO 8601 date |
| `type` | Enum String | `'A'` \| `'B'` \| `'C'` \| `'D'` |
| `description` | String | Required |
| `version_target` | String | Optional |
| `personas_to_rerun` | String | Optional |
| `status` | Enum String | `'Open'` \| `'In Progress'` \| `'Closed'` |

---

### 6.7 Export File Shape

The JSON backup file produced by F-17 wraps the root object with export metadata:

```json
{
  "export_format": "implementation-wizard-backup",
  "schema_version": 1,
  "exported_at": "2026-03-08T15:00:00.000Z",
  "projects": [ ...all ProjectRecords, active and archived ]
}
```

This shape is what the Ajv schema (B-01) validates on import. If `export_format` is missing or `schema_version` is incompatible, the import is rejected before any write occurs.

---

## 7. Business Rule Implementation

The following table maps each business rule to the specific function and component that enforces it.

| Rule | Implementation Location | Notes |
|---|---|---|
| **BR-01** Sequential completion + Steps 5/6 parallel exception | `stepLogic.js → canMarkComplete(stepNumber, allSteps)` | Returns `true` / `false`. Called by `StatusControls.jsx` before allowing Complete transition. Steps 5 and 6 special-cased explicitly. |
| **BR-02** Project Complete when all 24 steps complete | `stepLogic.js → deriveProjectStatus(steps)` | Called by reducer on every step status change. Auto-sets `project.status = 'complete'`. |
| **BR-03** In Progress allowed at any time | `StatusControls.jsx` | No guard on In Progress transition. |
| **BR-04** Blocked requires non-empty reason | `stepLogic.js → canMarkBlocked(blockedReason)` | Returns `false` if `blockedReason.trim() === ''`. Button disabled. |
| **BR-05** Blocked → Pending/In Progress clears block | Reducer `CLEAR_BLOCK` action | Sets `blocked_reason = ''`, appends prior reason to `notes` with timestamp prefix. |
| **BR-06** Prompt text is read-only | `PromptBox.jsx` | Rendered as `<pre>` or read-only `<textarea>`. No edit handler attached. |
| **BR-07** Notes are free-text | `NotesField.jsx` | Plain `<textarea>`. No validation. |
| **BR-08** Delete requires confirmation | `ConfirmModal.jsx` | Modal fires before `DELETE_PROJECT` action. |
| **BR-09** Archive removes from dashboard | Dashboard filter: `projects.filter(p => p.status !== 'archived')` | Archived view shows `projects.filter(p => p.status === 'archived')`. |
| **BR-10** Warning on out-of-sequence un-complete | `stepLogic.js → detectSequenceWarning(stepNumber, allSteps)` | If a later step is In Progress or Complete, returns warning string displayed in `Toast.jsx`. Does not block the action. |
| **BR-11** Step 1 blocked until Step 0 is complete | `stepLogic.js → getStep0Gate(stepNumber, allSteps)` | Returns blocking reason string when step 1 is attempted with Step 0 incomplete. `StatusControls.jsx` displays amber warning banner and disables In Progress and Complete buttons on Step 1. |

---

## 8. Component Hierarchy

```
App.jsx
│
├── AppShell.jsx
│   └── [export button, import button, app title]
│
├── Dashboard.jsx  [view: 'dashboard']
│   ├── CreateProjectModal.jsx
│   ├── ProjectCard.jsx  [× n projects]
│   │   ├── StepStripChart.jsx
│   │   └── NextActionBanner.jsx
│   └── SupportPersonasPanel
│       └── PersonaCard  [× 8 personas]
│
├── ProjectView.jsx  [view: 'project']
│   ├── ProjectHeader.jsx
│   │   └── ConfirmModal.jsx  [archive / delete]
│   ├── [Tab bar: Steps | Change Log]
│   ├── [Steps tab]
│   │   ├── StepChecklist.jsx
│   │   │   └── StepRow.jsx  [× 25: Step 0 + Steps 1–24]
│   │   │       └── StatusBadge.jsx
│   │   └── StepDetailPanel.jsx  [when step selected]
│   │       ├── [Step 0 only: Copy All Definitions button]
│   │       ├── ActorBadge.jsx
│   │       ├── PromptBox.jsx
│   │       │   └── [copy button → useClipboard]
│   │       ├── StatusControls.jsx
│   │       │   ├── BlockedReasonField.jsx
│   │       │   └── ConfirmModal.jsx  [if needed]
│   │       ├── NotesField.jsx
│   │       └── StepTimer.jsx  [useStepTimer]
│   ├── [Change Log tab]
│   │   └── ChangeLogView.jsx
│   │       └── AddChangeLogModal.jsx
│   └── DocTracker.jsx
│
└── ArchivedView.jsx  [view: 'archived']
    └── ProjectCard.jsx  [× n archived]  (read-only mode)
```

---

## 9. Key Custom Hooks

### `useStorage(state, dispatch)`
- On mount: reads `localStorage['iw-data']`, runs `integrityCheck()`, runs `migrate()` if `schema_version` is old, dispatches `HYDRATE` action to seed context.
- On state change (`useEffect` on `state`): serialises state to JSON, writes to localStorage.
- Exposes `exportData()` and `importData(file)` functions used by `AppShell`.

### `useClipboard()`
- Accepts text string.
- Calls `navigator.clipboard.writeText()`.
- Returns `{ copy(text), copied: bool }` where `copied` is `true` for 2000ms after successful copy (drives button label change to "Copied ✓").
- Keyboard shortcut (F-20): `Ctrl+Shift+C` / `Cmd+Shift+C` bound in `StepDetailPanel.jsx` via `useEffect` on `keydown`.

### `useStepTimer(step)`
- Accepts a StepRecord.
- If `status === 'in_progress'`: starts a `setInterval` (1s), computes `elapsed = now - started_at + time_in_step_seconds`, returns live formatted string.
- If `status === 'complete'`: returns static formatted duration from stored `time_in_step_seconds`.
- If `status === 'pending'` or `'blocked'`: returns `null`.
- Clears interval on unmount or status change.

---

## 10. Sprint Plan

Each sprint is a focused delivery unit. The Owner works with Claude Code to implement each sprint's tasks, using Claude Artifacts (A-01) and v0.dev (A-04) to accelerate UI generation. Vitest unit tests (B-02) are written for Sprint 1 business logic before or alongside implementation.

---

### Sprint 1 — Foundation, Data Layer, and Core Step Tracker

**Goal:** A working application where the Owner can create projects, navigate the 24-step checklist, open step details, update statuses with business rule enforcement, and have all data persist across browser sessions. No polish required.

**Duration estimate:** 3–5 focused Claude Code sessions.

| Task ID | Task | AI Tool | Output |
|---|---|---|---|
| S1-01 | Initialise Vite + React + Tailwind project | Claude Code | `/` project scaffold |
| S1-02 | Create `CLAUDE.md` from Appendix 1 of 03-ai-recommendations | Manual (Owner) | `CLAUDE.md` |
| S1-03 | Generate `steps.js` static seed data (all 24 steps with placeholders) | Claude Web (A-03) | `/src/data/steps.js` |
| S1-04 | Build `ProjectContext` + `useReducer` with full action set | Claude Code | `/src/context/ProjectContext.jsx` |
| S1-05 | Build `useStorage` hook — read, write, HYDRATE | Claude Code | `/src/hooks/useStorage.js` |
| S1-06 | Build `migration.js` + `schema_version` pattern (B-03) | Claude Code | `/src/utils/migration.js` |
| S1-07 | Build `integrityCheck.js` — startup validation (B-05) | Claude Code | `/src/utils/integrityCheck.js` |
| S1-08 | Write Vitest unit tests for `stepLogic.js` (B-02) — all BR-01 cases including parallel exception | Claude Code | `/src/tests/stepLogic.test.js` |
| S1-09 | Build `stepLogic.js` — all business rule functions | Claude Code | `/src/utils/stepLogic.js` |
| S1-10 | Build `App.jsx` — view state router | Claude Code / Artifacts | `/src/App.jsx` |
| S1-11 | Build `Dashboard.jsx` + `ProjectCard.jsx` (basic, no strip chart yet) | Claude Code / v0.dev (A-04) | Dashboard view |
| S1-12 | Build `CreateProjectModal.jsx` (F-01) | Claude Code / v0.dev | Create project flow |
| S1-13 | Build `ProjectView.jsx` + `StepChecklist.jsx` + `StepRow.jsx` | Claude Code / v0.dev | Checklist view |
| S1-14 | Build `StepDetailPanel.jsx` — all fields, read-only prompt, status controls | Claude Code / v0.dev | Step detail panel |
| S1-15 | Build `StatusControls.jsx` + `BlockedReasonField.jsx` with BR enforcement | Claude Code | Status update with rules |
| S1-16 | Build `NotesField.jsx` — auto-save on blur | Claude Code | Notes persistence |
| S1-17 | Build `useClipboard.js` + `PromptBox.jsx` + keyboard shortcut (F-20) | Claude Code | Copy prompt feature |
| S1-18 | Run Vitest suite — all BR-01 tests must pass | Owner + Claude Code | Green test suite |
| S1-19 | Manual smoke test — create project, progress through steps 1–7, verify localStorage | Owner | Tested foundation |

**Sprint 1 Exit Criteria:** Projects can be created; 24-step checklist is navigable; step statuses update with correct enforcement; notes save; prompt copy works; data persists on browser close/reopen; all unit tests green.

---

### Sprint 2 — Dashboard, Document Tracker, Project Management, and Visualisation

**Goal:** Complete all project management features (rename, archive, delete, duplicate), the document tracker, the step-status strip chart, and the next action banner. The application becomes fully featured for core daily use.

**Duration estimate:** 3–4 focused Claude Code sessions.

| Task ID | Task | AI Tool | Output |
|---|---|---|---|
| S2-01 | Build `StepStripChart.jsx` — 24-cell Recharts strip (C-06) | Claude Code + Recharts | Strip chart component |
| S2-02 | Build `NextActionBanner.jsx` — contextual instruction logic (C-02) | Claude Code | Next action display |
| S2-03 | Enhance `ProjectCard.jsx` — integrate strip chart + next action | Claude Code | Full project card |
| S2-04 | Build `ProjectHeader.jsx` — rename (F-05), archive (F-04), delete (F-04) | Claude Code / v0.dev | Project header controls |
| S2-05 | Build `ConfirmModal.jsx` — reusable for delete and import (BR-08) | Claude Code | Confirm modal |
| S2-06 | Implement duplicate project (F-21) — with "(Copy)" suffix, reset steps | Claude Code | Duplicate feature |
| S2-07 | Build `ArchivedView.jsx` — list of archived projects (BR-09) | Claude Code | Archived view |
| S2-08 | Build `DocTracker.jsx` + `DocRegistryRecord` auto-transition logic (F-12, F-13, F-14) | Claude Code | Docs tracker panel |
| S2-09 | Build `AppShell.jsx` — nav bar with export + import buttons | Claude Code / v0.dev | App shell |
| S2-10 | Build `exportImport.js` — JSON export with timestamp filename (F-17) | Claude Code | Export function |
| S2-11 | Build Ajv schema in `schema.js` + import validation (B-01, F-18) | Claude Code | Import validation |
| S2-12 | Write Vitest tests for `exportImport.js` — valid, invalid, version-mismatch (B-01) | Claude Code | Import tests |
| S2-13 | Build `Toast.jsx` — transient notifications (copy, import success, sequence warning) | Claude Code | Toast component |
| S2-14 | Implement BR-10 sequence warning via `Toast.jsx` | Claude Code | Warning on un-complete |
| S2-15 | Build `StatusBadge.jsx` + `ActorBadge.jsx` shared components | Claude Code / v0.dev | Shared badges |
| S2-16 | Manual smoke test — all project management flows, export/import cycle, doc tracker | Owner | Tested full feature set |

**Sprint 2 Exit Criteria:** All 22 features (F-01 to F-22) are implemented; export/import works with schema validation; duplicate project works; archived view works; document tracker auto-transitions correctly; all unit tests green.

---

### Sprint 3 — UX Polish, AI-Generated Content, Tooltips, and Deployment

**Goal:** Apply all AI-generated content (step descriptions, tooltip text), complete visual polish, run final integration testing, and deploy the application. The app is ready for daily use.

**Duration estimate:** 2–3 focused Claude Code sessions + 1 Claude Web content generation session.

| Task ID | Task | AI Tool | Output |
|---|---|---|---|
| S3-01 | Generate all 24 plain-English step descriptions (C-01) | Claude Web | 24 `description` strings → `steps.js` |
| S3-02 | Generate all tooltip text strings (C-04) | Claude Web | 25–30 tooltip strings → constants file |
| S3-03 | Integrate `Tooltip.jsx` wrapper across all relevant UI controls | Claude Code | Tooltips on all controls |
| S3-04 | Build `useStepTimer.js` + `StepTimer.jsx` — live elapsed time (F-22) | Claude Code | Time-in-step metric |
| S3-05 | Apply confirmed Tailwind colour palette — light base, indigo accent (TQ-02) — across all components | Claude Code / v0.dev | Visual consistency pass |
| S3-06 | Add `Active Step Highlight` (F-11) — visual emphasis on current step in checklist | Claude Code | Step highlight |
| S3-07 | Responsive layout check — ensure usable at 1280px, 1440px, 1920px widths (F-19) | Owner + Claude Code | Desktop layout verified |
| S3-08 | Run Vitest full suite — all tests must pass | Owner | Clean test run |
| S3-09 | Full integration test against `05-test-cases.md` (when available) | Owner | Test log |
| S3-10 | Prompt integrity check on all 24 placeholder texts (B-04) | Claude Web | Confirmed prompt shape |
| S3-11 | `vite build` — produce `/dist` output | Claude Code | Static build artefact |
| S3-12 | Deploy to **GitHub Pages** — push `/dist` to `gh-pages` branch via `gh-pages` npm package or manual push; confirm public URL | Claude Code | Live GitHub Pages URL |
| S3-13 | Post-deploy smoke test — open in clean browser, create project, complete steps 1–3 | Owner | Deployment verified |

**Sprint 3 Exit Criteria:** Application is deployed to GitHub Pages with a live URL; all 24 step descriptions are meaningful (not placeholders in descriptions — only in `prompt_text`); tooltips present on all controls; time-in-step counter working; full test suite green; Vitest tests all pass.

---

### Post-Launch Sprint — Support Personas, Change Log, and Setup Gate

**Goal:** Extend the released V1.0 application with operational workflow support features.

| Task ID | Task | Output |
|---|---|---|
| PL-01 | Add all 24 real prompt texts to steps.js | steps.js — all prompts populated |
| PL-02 | Build supportPersonas.js with 8 persona definitions | supportPersonas.js |
| PL-03 | Build Support Personas card on Dashboard with Copy Definition buttons | Dashboard.jsx updated |
| PL-04 | Build Change Log data model — change_log field, reducer actions, HYDRATE migration | ProjectContext.jsx updated |
| PL-05 | Build ChangeLogView.jsx and AddChangeLogModal.jsx | Change Log tab |
| PL-06 | Add tab bar to ProjectView (Steps / Change Log) | ProjectView.jsx updated |
| PL-07 | Build Step 0 setup gate — getStep0Gate(), Step 1 blocking, Copy All Definitions in Step 0 panel, remove setup checklist from Step 1 | stepLogic.js, StatusControls.jsx, StepDetailPanel.jsx updated |
| PL-08 | Update schema.js — add explicit validation for change_log | schema.js updated |
| PL-09 | Add regression tests — changeLog.test.js (9 tests), exportImport new field tests | 89 total tests passing |
| PL-10 | Remove stale TypeScript files and empty placeholder directories, update CLAUDE.md | Clean file structure |

---

## 11. Test Summary (Current)

| Test File | Tests | Coverage |
|---|---|---|
| stepLogic.test.js | 57 | BR-01 to BR-10, BR-11 (getStep0Gate) |
| changeLog.test.js | 9 | Change Log reducer, HYDRATE migration, Step 0 migration |
| exportImport.test.js | 23 | Import validation, new field validation |
| **Total** | **89** | All passing as of 2026-03-09 |

---

## 12. Security Considerations

This is a single-user, local browser application with no network connectivity, no authentication, and no server. The security surface is minimal. The following considerations apply regardless.

| Concern | Risk Level | Mitigation |
|---|---|---|
| **localStorage data accessible to any script on the same origin** | Low | Application is served from its own origin (local file or dedicated subdomain). No third-party scripts included in V1.0. No sensitive financial data is stored — only project tracking metadata and notes. |
| **Malicious JSON import file** | Medium | Ajv schema validation (B-01) rejects any import file that does not conform exactly to the expected schema before any data is written. The import function operates on a parsed object, not eval'd code. |
| **XSS via user-entered notes** | Low-Medium | React's JSX rendering escapes all strings by default. Notes content is rendered in a `<textarea>` (not `innerHTML`). No `dangerouslySetInnerHTML` to be used anywhere in the codebase. This must be enforced in Claude Code sessions — flag it in `CLAUDE.md`. |
| **Prompt text injection** | Low | Prompt text is read-only static data from `steps.js`. Users cannot modify it. The copy-to-clipboard action copies plain text only — no code execution. |
| **Data loss on browser clear** | Medium | Mitigated by export feature (F-17). User should be advised (via tooltip or help text) to export regularly. Not preventable beyond this without a backend. |
| **localStorage storage quota exceeded** | Very Low | localStorage quota is typically 5–10MB per origin. At the expected data volume (25 steps × N projects × notes text), this is effectively unlimited for realistic use. Monitor if notes become very large. |

---

## 13. Constraints

| ID | Constraint | Source |
|---|---|---|
| C-01 | No backend, no server, no database. Static files only. | Owner (OQ-03 decision, out-of-scope list) |
| C-02 | No runtime calls to Claude API or any external API. | Owner (FR Section 8) |
| C-03 | No additional monthly subscription costs. Claude Code is sole development tool. | Owner (A-05 rejection) |
| C-04 | localStorage is the only persistence mechanism. | Owner (OQ-03) |
| C-05 | The 24-step process definition is fixed and cannot be modified at runtime. | FR (BR-06, Section 8) |
| C-06 | Static prompt texts are placeholders in V1.0. Real prompts authored post-testing. | Owner (OQ-01) |
| C-07 | Application must function without internet access (after initial load / install). | Implied by architecture — no external API calls |
| C-08 | No TypeScript in V1.0. Plain JavaScript (ES2022+) only. | Technical Architect decision — delivery speed |
| C-09 | Deployment target is **GitHub Pages** (free static hosting). Build output is Vite `/dist`. Deployment via `gh-pages` branch. Requires a GitHub account and basic git workflow. | Owner (TQ-01) |

---

## 14. Decisions Log

All open questions from v1.0 have been resolved by the Owner. No open questions remain. This document is final and build may commence.

| ID | Question | Decision | Impact on Document |
|---|---|---|---|
| TQ-01 | Preferred deployment target? | **GitHub Pages.** Free static hosting via `gh-pages` branch. Requires GitHub account and basic git workflow. | C-09 updated. S3-12 updated to specify GitHub Pages deployment steps. Sprint 3 exit criteria updated. |
| TQ-02 | Colour palette / visual theme? | **Light with indigo accent** (white/light-grey base + indigo-600 highlights). Professional, low visual fatigue — consistent with finance tool aesthetic. | S3-05 updated to reference confirmed palette. Passed to UI Expert (Step 5) for wireframes. |
| TQ-03 | Step detail panel layout — side panel or full-width? | **Side panel split view: checklist 35% left / detail 65% right.** Already the documented default — confirmed. | `ProjectView.jsx` layout specification confirmed at 35/65 split. No change to component design. |
| TQ-04 | Keyboard shortcut for copy prompt? | **`Ctrl+Shift+C` / `Cmd+Shift+C` confirmed.** Avoids conflict with standard clipboard shortcut. | `useClipboard.js` implementation uses this binding. Referenced in `CLAUDE.md`. |
| TQ-05 | Maximum note length enforcement? | **No enforced limit. Textarea grows to content.** Large Claude output pastes (potentially thousands of characters) are expected and must not be truncated. | `NotesField.jsx` — no `maxLength` attribute, auto-grow textarea. No change to localStorage schema (unbounded String already specified). |

---

## 15. AI Tool Integration Summary

This section records which approved AI tools from `03-ai-recommendations.md` are integrated into the build process and where.

| Rec ID | Tool | When Used | Sprint |
|---|---|---|---|
| A-01 | Claude Artifacts | Initial UI scaffolding for Dashboard, ProjectView, StepDetailPanel | Sprint 1–2 |
| A-02 | CLAUDE.md | First task of Sprint 1. Maintained throughout. | Sprint 1 (S1-02) |
| A-03 | Claude Web — Seed Data | Generate `steps.js` with 24 step objects | Sprint 1 (S1-03) |
| A-04 | v0.dev | UI component generation for modal, cards, panels | Sprint 1–2 |
| B-01 | Ajv JSON Schema | Import validation in `exportImport.js` | Sprint 2 (S2-11) |
| B-02 | Vitest Unit Tests | `stepLogic.test.js` — all BR-01 cases | Sprint 1 (S1-08) |
| B-03 | localStorage Migration | `migration.js` + `schema_version` | Sprint 1 (S1-06) |
| B-04 | Claude Web — Prompt QA | Review 24 prompt texts before embedding real prompts | Post V1.0 testing |
| B-05 | Startup Integrity Check | `integrityCheck.js` called in `useStorage` on mount | Sprint 1 (S1-07) |
| C-01 | Claude Web — Step Descriptions | Generate 24 `description` strings for `steps.js` | Sprint 3 (S3-01) |
| C-02 | Next Action Banner | `NextActionBanner.jsx` + template string logic | Sprint 2 (S2-02) |
| C-04 | Claude Web — Tooltip Text | Generate tooltip strings, integrate via `Tooltip.jsx` | Sprint 3 (S3-02, S3-03) |
| C-06 | Recharts Strip Chart | `StepStripChart.jsx` — 24-cell progress visual | Sprint 2 (S2-01) |

**Deferred to V1.1 (not in this build):** C-03 (Open in Claude deep link), C-05 (Markdown export).

---

*End of Document — 02-technical-specifications.md v1.3*

# 01 — Functional Requirements
## Implementation Wizard

| Field | Detail |
|---|---|
| **Document Version** | 1.3 |
| **Status** | ✅ Approved — Updated for post-V1.0 features |
| **Prepared By** | Domain Expert Persona |
| **Date** | 2026-03-09 |
| **Owner** | Finance Professional / Solo User |

> **v1.2 Change Note:** v1.2 adds F-23, F-24, F-25, BR-11, and updated data model to reflect post-launch enhancements.

> **v1.3 Change Note:** v1.3 adds Step 0, updates F-24, replaces F-25 with F-26, updates BR-11, and removes claude_web_setup_complete from data model.

---

## 1. Project Name

**Implementation Wizard**

---

## 2. Business Objective

The Implementation Wizard is a personal productivity web application for a solo finance professional who builds software applications using an AI-assisted development framework. Every software project follows a fixed, repeatable 24-step process. The application exists to:

1. Track progress across multiple simultaneous software build projects.
2. Serve as a guided checklist — ensuring steps are completed in the correct sequence.
3. Eliminate the need to remember or manually retrieve the correct AI prompt for each step.
4. Provide a persistent, auditable log of decisions, outputs, and notes per step.
5. Reduce cognitive overhead by surfacing the right action, the right tool, and the right prompt at exactly the right moment.

The application is a **personal operations hub** — not a team tool, not a project management platform for others.

---

## 3. User Roles

There is a single user role for this application.

| Role | Description | Access Level |
|---|---|---|
| **Owner** | The finance professional who builds and manages all projects | Full access to all features — create, edit, view, delete |

> **Note:** No authentication, login screen, or multi-user access is required at this stage. The application is intended for single-user, single-device use with browser-persisted data. This should be revisited if the application is later shared or hosted remotely.

---

## 4. Core Features

### 4.1 Project Management

| # | Feature | Description |
|---|---|---|
| F-01 | Create Project | User can create a new project by entering a project name and an optional short description. On creation, all 24 steps are auto-populated in Pending status. |
| F-02 | View All Projects (Dashboard) | A dashboard lists all projects showing: Project Name, Current Step Number, Current Step Name, Overall Status (Active / Complete / Blocked), and a visual progress indicator (e.g. progress bar or step count). |
| F-03 | Switch Between Projects | User can navigate to any project from the dashboard or via a persistent project selector. |
| F-04 | Archive / Delete Project | User can archive a completed project (removes from active view, retains data) or permanently delete a project with a confirmation prompt. |
| F-05 | Project Rename | User can rename a project at any time. |

### 4.2 Step Tracker

| # | Feature | Description |
|---|---|---|
| F-06 | 24-Step Checklist View | Each project displays its full 24-step checklist. Each step shows: Step Number, Step Name, Status badge, Assigned Actor, and a visual indicator of the current active step. |
| F-07 | Step Detail Panel | Clicking a step opens a detail panel showing all step information (see Section 4.3). |
| F-08 | Step Status Update | User can change a step's status subject to business rules (see Section 5). Valid statuses: Pending / In Progress / Complete / Blocked. |
| F-09 | Sequential Enforcement | The system enforces step sequencing — a step cannot be marked Complete until all prior steps are Complete. |
| F-10 | Blocked Step Reason | When marking a step Blocked, the user is required to enter a reason before the status is saved. |
| F-11 | Active Step Highlight | The checklist visually highlights the current active step (the lowest-numbered non-Complete step). |

### 4.3 Step Detail Content

Every step must surface the following information:

| Field | Description |
|---|---|
| **Step Number** | 1 through 24 |
| **Step Name** | Short title (e.g. "Define Functional Requirements") |
| **Persona / Actor** | Who performs this step: *Me*, *Claude Web*, or *Claude Code* |
| **Plain-English Description** | A clear explanation of what needs to be done and why — written for the user, not a developer |
| **AI Prompt Text** | The exact, pre-authored prompt to paste into Claude Web or Claude Code to trigger this step. Fixed — not user-editable. |
| **Copy Prompt Button** | One-click copy of the full prompt text to clipboard. Provides visual confirmation on copy (e.g. button text changes to "Copied ✓"). |
| **Output / Notes Field** | A free-text area where the user can paste AI-generated outputs, log decisions, paste file paths, or record observations. Editable. Auto-saved. |
| **Expected Output** | A brief description of what a successful output looks like (e.g. "Produces 01-functional-requirements.md in /docs folder") |
| **Linked Doc File(s)** | Which /docs file(s) this step produces or depends on (see Feature F-13) |
| **Status Control** | Buttons or dropdown to change status (respecting business rules) |
| **Blocked Reason Field** | Appears only when status is Blocked. Required before saving. |
| **Timestamps** | Date/time when step was started and when it was completed |

### 4.4 Document Tracker

| # | Feature | Description |
|---|---|---|
| F-12 | /docs File Registry | Each project maintains a registry of the expected /docs output files (e.g. 01-functional-requirements.md, 02-technical-specifications.md, etc.). |
| F-13 | File Status Indicators | Each expected file is shown as: Pending (step not yet complete), Created (step complete — file should exist), or Noted (user has manually confirmed file exists). |
| F-14 | File Notes | User can add a note against each file (e.g. file path, version, location). |

### 4.5 Data Persistence

| # | Feature | Description |
|---|---|---|
| F-15 | Session Persistence | All project data — projects, step statuses, notes, timestamps, blocked reasons — must persist across browser sessions using browser **localStorage**. No external server or database is required for Version 1.0. |
| F-16 | No Data Loss on Refresh | Closing and reopening the browser must not result in loss of any data. |
| F-17 | Data Export | User can export all project data — including both active and archived projects — as a single JSON file for backup purposes. The exported filename should include a timestamp (e.g. `implementation-wizard-backup-2026-03-08.json`). |
| F-18 | Data Import | User can import a previously exported JSON backup to restore project data. The user is warned that import will overwrite all current data, and must confirm before proceeding. |

### 4.6 Usability

| # | Feature | Description |
|---|---|---|
| F-19 | Responsive Layout | The application must be usable on a desktop browser. Mobile-friendliness is desirable but not required. |
| F-20 | Keyboard Shortcut — Copy Prompt | Pressing a defined keyboard shortcut while a step is open copies the prompt to clipboard. |
| F-21 | Duplicate Project | User can duplicate any existing project (active or archived). The duplicate creates a new project with the same name suffixed "(Copy)", copies the description, and resets all 24 steps to Pending status. Notes, timestamps, and blocked reasons are **not** copied. The user may rename the duplicate immediately on creation. |
| F-22 | Time-in-Step Metric | Each step in the detail panel displays elapsed time from when the step was first set to In Progress. For completed steps, the fixed elapsed duration between started_at and completed_at is displayed. For In Progress steps, the counter runs live. |

### 4.7 Post-Launch Features

These features were added after V1.0 release.

| # | Feature | Description |
|---|---|---|
| F-23 | Change Log | Each project maintains a per-project change log. The user can add, edit, and delete change request entries. Each entry records: Date, Type (A=Mid-build, B=Post-release bug, C=Post-release enhancement, D=Framework improvement), Description, Version Target, Personas to Re-run, and Status (Open / In Progress / Closed). The Change Log is accessible via a dedicated tab within the Project View. |
| F-24 | Support Personas Card | The Dashboard includes a Support Personas reference panel listing all 8 persona definitions (Domain Expert, AI Expert, Technical Architect, UI Expert, QC Analyst, Auditor, Trainer, Technical Expert). Each persona has a Copy Definition button. A How to Invoke section shows a read-only example prompt for each persona. This panel is a reference tool during the build process — not a setup action. |
| F-26 | Step 0 — Set Up Claude Web Project | A mandatory Step 0 sits before the 24-step build process. Its sole purpose is Claude Web project setup. The Step 0 detail panel contains a Copy All Definitions button that copies all 8 persona definitions in one click. The user pastes these into Claude Web Project Settings → Project Instructions. Step 1 cannot be started until Step 0 is marked Complete. Step 0 is a one-time setup action per project. |

---

## 5. Business Rules

| ID | Rule |
|---|---|
| BR-01 | Steps must be completed in strict sequence. Step N cannot be marked **Complete** until steps 1 through N−1 are all marked Complete. **Exception:** Steps 5 (UI Expert) and 6 (QC Analyst) may run in parallel — either may be started and completed once Step 4 is Complete, regardless of the other's status. |
| BR-02 | A project is considered **Complete** only when all 24 steps have status = Complete. |
| BR-03 | A step can be marked **In Progress** at any time, regardless of prior step status, to allow the user to flag work has begun. |
| BR-04 | A step can be marked **Blocked** at any time, but a non-empty Blocked Reason must be provided and saved before the status change is committed. |
| BR-05 | A step can be moved from Blocked back to Pending or In Progress by the user, clearing the block. The blocked reason is retained in the notes history. |
| BR-06 | The AI Prompt Text for each step is fixed and system-defined. It cannot be edited by the user. (The user may copy and manually modify it in their clipboard before pasting.) |
| BR-07 | Step Notes are entirely user-controlled, free-text, and have no format restriction. |
| BR-08 | Deleting a project requires an explicit confirmation step. Deletion is permanent. |
| BR-09 | Archiving a project removes it from the active dashboard view but preserves all data. Archived projects must be accessible via a separate view. |
| BR-10 | If a step is marked Complete and a subsequent step has already been started, the completion timestamp is recorded but no rollback of subsequent steps is triggered automatically. The user is shown a warning if any earlier step is un-completed. |
| BR-11 | Step 1 cannot be set to In Progress or Complete until Step 0 (Set Up Claude Web Project) is marked Complete. An amber warning banner is displayed on Step 1 when this condition is not met. The gate resets automatically if Step 0 is un-completed. |

---

## 6. The 24-Step Process — Master Reference

The following is the master step register. Step 0 is a mandatory one-time setup step that must be completed before the 24-step build process begins. Steps 1–24 follow the fixed build sequence.

| Step | Name | Actor | Persona Triggered | Expected /docs Output |
|---|---|---|---|---|
| 0 | Set Up Claude Web Project | Me | — | — |
| 1 | Define Business Requirements | Me | — | — |
| 2 | Run Domain Expert Persona | Claude Web | Domain Expert | 01-functional-requirements.md |
| 3 | Run AI Expert Persona | Claude Web | AI Expert | 03-ai-recommendations.md |
| 4 | Run Technical Architect Persona | Claude Web | Technical Architect | 02-technical-specifications.md |
| 5 | Run UI Expert Persona | Claude Web | UI Expert | 04-wireframes.md |
| 6 | Run QC Analyst Persona | Claude Web | QC Analyst | 05-test-cases.md |
| 7 | Review All Docs | Me | — | — |
| 8 | Scaffold Project (Claude Code) | Claude Code | Technical Expert | /src project structure |
| 9 | Build Sprint 1 | Claude Code | Technical Expert | Sprint 1 code |
| 10 | Test Sprint 1 | Me | — | Sprint 1 test log |
| 11 | Build Sprint 2 | Claude Code | Technical Expert | Sprint 2 code |
| 12 | Test Sprint 2 | Me | — | Sprint 2 test log |
| 13 | Build Sprint 3 | Claude Code | Technical Expert | Sprint 3 code |
| 14 | Test Sprint 3 | Me | — | Sprint 3 test log |
| 15 | Run Auditor Persona | Claude Web | Auditor | audit-report.md |
| 16 | Review Audit Report | Me | — | — |
| 17 | Resolve Critical Findings | Claude Code | Technical Expert | Updated /src |
| 18 | Resolve Major Findings | Claude Code | Technical Expert | Updated /src |
| 19 | Re-run Auditor Persona | Claude Web | Auditor | audit-report-v2.md |
| 20 | Final Review & Sign-Off | Me | — | — |
| 21 | Run Trainer Persona | Claude Web | Trainer | final-documentation.md, user-faq.md, user-communication.md |
| 22 | Prepare Release Package | Me | — | /releases/ folder |
| 23 | Deploy / Publish | Claude Code | Technical Expert | Live URL or local deployment |
| 24 | Post-Launch Review | Me | — | — |

---

## 7. Data Requirements

### 7.1 Project Record

| Field | Type | Notes |
|---|---|---|
| project_id | UUID | System-generated |
| project_name | String | Required. Max 100 characters. |
| project_description | String | Optional. Max 500 characters. |
| created_date | DateTime | Auto-set on creation |
| status | Enum | Active / Complete / Archived |
| steps | Array | Array of 25 StepRecord objects (Step 0 through Step 24) |
| change_log | Array | Array of ChangeLogRecord objects. Initialised as empty array on project creation. |

### 7.2 Step Record

| Field | Type | Notes |
|---|---|---|
| step_number | Integer | 1–24. Fixed. |
| step_name | String | Fixed. System-defined. |
| actor | Enum | Me / Claude Web / Claude Code |
| persona | String | Name of persona triggered, or blank |
| description | String | Fixed. System-defined plain-English description. |
| prompt_text | String | Fixed. System-defined. Not user-editable. |
| expected_output | String | Fixed. System-defined. |
| linked_docs | Array of Strings | Fixed. System-defined file names. |
| status | Enum | Pending / In Progress / Complete / Blocked |
| blocked_reason | String | Required when status = Blocked. |
| notes | String | User-entered free text. |
| started_at | DateTime | Nullable. Set when status first changes to In Progress. |
| completed_at | DateTime | Nullable. Set when status changes to Complete. |
| time_in_step_seconds | Integer | Computed. Running total of elapsed seconds while status = In Progress. Updated on each status save. Used to display time-in-step metric (F-22). |

### 7.3 Document Registry Record

| Field | Type | Notes |
|---|---|---|
| file_name | String | e.g. "01-functional-requirements.md" |
| linked_step | Integer | Step number that produces this file |
| status | Enum | Pending / Created / Noted |
| user_note | String | Optional. User-entered file path or comment. |

### 7.4 Change Log Record

| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | System-generated on entry creation |
| date | String (ISO 8601) | Entry date. Defaults to today on creation. |
| type | Enum | A=Mid-build change, B=Post-release bug, C=Post-release enhancement, D=Framework improvement |
| description | String | Required. User-entered description of the change. |
| version_target | String | Optional. Target version for the change (e.g. V1.1). |
| personas_to_rerun | String | Optional. Comma-separated list of personas to re-run for this change. |
| status | Enum | Open / In Progress / Closed |

---

## 8. Out of Scope (Version 1.0)

The following items are explicitly excluded from the first version:

- Multi-user access or any authentication mechanism
- Cloud storage or server-side persistence
- Real-time collaboration
- Integration with Claude API (prompts are copied manually by the user)
- Mobile app (web browser on desktop is sufficient)
- Custom step creation or editing of the 24-step process
- Notifications or reminders
- Editing or extending the 24-step process definition at runtime

---

## 9. Decisions Log

All open questions from v1.0 have been resolved by the Owner. No open questions remain. This document is final.

| ID | Question | Decision | Impact on Document |
|---|---|---|---|
| OQ-01 | Placeholder prompts vs. finalised prompts at build time? | **Build first with placeholders.** Real prompts to be authored after app is tested. | Section 6 updated. Prompt fields labelled as placeholders in static data. |
| OQ-02 | Multiple simultaneous independent projects confirmed? | **Confirmed.** Each project runs its own independent 24-step process. | No change required — design already supported this. |
| OQ-03 | localStorage vs. IndexedDB? | **localStorage is sufficient for Version 1.0.** | F-15 updated to specify localStorage explicitly. |
| OQ-04 | Include archived projects in JSON export? | **Yes — export includes all projects (active and archived).** | F-17 updated accordingly. |
| OQ-05 | Parallel execution of any steps? | **Steps 5 and 6 may run in parallel** once Step 4 is complete. All other steps remain strictly sequential. | BR-01 updated with explicit exception for Steps 5 and 6. |
| OQ-06 | Display time-in-step metric? | **Yes — include live elapsed time counter per step.** | F-22 added. time_in_step_seconds field added to Step Record (Section 7.2). |
| OQ-07 | Duplicate project feature? | **Yes — include duplicate project capability.** | F-21 added. |

---

*End of Document — 01-functional-requirements.md v1.3*

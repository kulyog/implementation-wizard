# 03 — AI Recommendations
## Implementation Wizard

| Field | Detail |
|---|---|
| **Document Version** | 1.1 — Final |
| **Status** | ✅ Approved — All Owner Decisions Recorded |
| **Prepared By** | AI Expert Persona |
| **Date** | 2026-03-08 |
| **Input Document** | 01-functional-requirements.md v1.1 (Final) |

---

## Preamble

This document identifies AI tools, techniques, and integrations that can accelerate delivery of the Implementation Wizard, strengthen its data controls, and improve the user experience. It does **not** modify functional requirements. All recommendations are advisory — acceptance, rejection, or deferral is a decision for the Technical Architect and Owner.

Recommendations are organised by the three evaluation criteria: **(a) Speed of Delivery**, **(b) Controls & Data Integrity**, and **(c) User Experience**. A consolidated summary table appears at the end.

---

## Section A — Speed of Delivery

These recommendations reduce the time required to build, scaffold, and populate the application.

---

### A-01 — Use Claude (Sonnet) via Artifacts for Full UI Scaffolding

| Attribute | Detail |
|---|---|
| **Tool** | Claude claude-sonnet-4-6 — Artifacts (React/JSX) |
| **Applies To** | Steps 8, 9, 10, 11, 12, 13, 14 of the 24-step process |
| **Purpose** | Generate the entire front-end React component tree — dashboard, project view, step checklist, step detail panel — as a single working Artifact. This can produce a functional prototype in one session rather than many incremental Claude Code sessions. |
| **Cost** | Included in existing Claude Pro subscription. No additional cost. |
| **Complexity** | Low. Owner already uses Claude Web for persona steps. Same workflow. |
| **Recommendation** | **Adopt.** Use Claude Artifacts to generate the initial React scaffold before handing to Claude Code for refinement. Cuts Sprint 1 build time significantly. |

---

### A-02 — Use Claude Code with a Pre-Written CLAUDE.md Project Brief

| Attribute | Detail |
|---|---|
| **Tool** | Claude Code — CLAUDE.md context file |
| **Applies To** | Steps 8–14, 17, 18, 23 |
| **Purpose** | Claude Code performs significantly better when a `CLAUDE.md` file in the project root summarises the app's purpose, tech stack, file structure, and conventions. Writing this file once (from the approved specs) eliminates repetitive context-setting across all Code sessions, reducing token waste and improving output consistency. |
| **Cost** | No additional cost. |
| **Complexity** | Low. One-time setup task, ~30 minutes. |
| **Recommendation** | **Adopt.** Produce `CLAUDE.md` as the very first output of Step 8 (Scaffold). Template provided in Appendix 1. |

---

### A-03 — AI-Generated Static Seed Data File for the 24 Steps

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web (any model) |
| **Applies To** | Step 8 (Scaffold) — static data population |
| **Purpose** | The application requires a static JSON/JS data file defining all 24 steps (name, actor, persona, description, expected output, linked docs, placeholder prompt). This file is mechanical and repetitive to write by hand. A single well-crafted Claude prompt can generate the complete, correctly structured static seed data file in one pass, ready to import directly into the codebase. |
| **Cost** | No additional cost. |
| **Complexity** | Low. Single prompt task. |
| **Recommendation** | **Adopt.** Generate seed data file during Step 8. Saves 2–3 hours of manual authoring. Prompt template provided in Appendix 2. |

---

### A-04 — v0.dev for Rapid UI Component Generation

| Attribute | Detail |
|---|---|
| **Tool** | v0.dev (Vercel) |
| **Applies To** | Steps 8, 9 — UI scaffolding |
| **Purpose** | v0.dev generates production-quality React + Tailwind UI components from natural language or wireframe descriptions. The UI Expert persona (Step 5) already produces v0.dev prompts per screen. Using those prompts directly in v0.dev can generate polished, copy-pasteable component code for the dashboard, project view, and step detail panel — bypassing significant styling effort in Claude Code. |
| **Cost** | Free tier available. Paid plans from $20/month USD for higher usage. For a single project build, the free tier is likely sufficient. |
| **Complexity** | Low. Browser-based tool. No installation required. |
| **Recommendation** | **Adopt for Sprint 1 UI work.** Use v0.dev output as base; refine in Claude Code. |

---

### A-05 — GitHub Copilot for Boilerplate and localStorage Utility Functions

| Attribute | Detail |
|---|---|
| **Tool** | GitHub Copilot (VS Code extension) |
| **Applies To** | Steps 8–14 |
| **Purpose** | For repetitive boilerplate — localStorage read/write helpers, UUID generation, date formatting, export/import JSON utilities (F-15 to F-18) — Copilot autocomplete is faster than switching to Claude Code for every small function. Keeps the developer in flow. |
| **Cost** | $10/month USD (Individual). Free tier available for verified students and open-source maintainers. |
| **Complexity** | Low. VS Code extension install. |
| **Recommendation** | ~~**Adopt if using VS Code.**~~ **❌ REJECTED by Owner.** Claude Code is the sole development tool for this project. No additional monthly subscription cost is acceptable. All boilerplate and utility functions will be generated via Claude Code sessions. |

---

## Section B — Controls & Data Integrity

These recommendations strengthen the reliability, consistency, and correctness of the application's data and behaviour.

---

### B-01 — AI-Assisted JSON Schema Validation for Export/Import

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web — used at development time, not runtime |
| **Applies To** | F-17 (Data Export), F-18 (Data Import) |
| **Purpose** | The import feature (F-18) accepts user-supplied JSON. Importing a malformed or incompatible file could silently corrupt all project data. Use Claude to generate a strict JSON Schema (draft-07 or later) for the export file format, then embed an Ajv (or equivalent) validator in the import routine. Any import file that fails schema validation is rejected with a clear error message before any data is written. |
| **Cost** | Ajv is open source. No runtime cost. Claude used once at build time. |
| **Complexity** | Low-Medium. Schema generation is fast; embedding Ajv adds ~1 sprint task. |
| **Recommendation** | **Adopt.** Data loss on bad import is a High-risk scenario for a single-user, localStorage-only application. This is the primary safety net. |

---

### B-02 — Claude-Generated Unit Tests for Business Rule Logic

| Attribute | Detail |
|---|---|
| **Tool** | Claude Code — test generation |
| **Applies To** | BR-01 (sequential enforcement), BR-04 (blocked reason required), BR-10 (warning on un-complete) |
| **Purpose** | The sequencing logic (BR-01 with the Steps 5/6 parallel exception) is the most complex business rule in the application and the most likely source of regression bugs. Prompt Claude Code to generate a Jest (or Vitest) unit test suite specifically for step-status transition logic before or alongside Sprint 1 build. Tests become the specification the code must satisfy. |
| **Cost** | Jest/Vitest are open source. No additional cost. |
| **Complexity** | Low. Claude Code handles test generation well with clear business rule inputs. |
| **Recommendation** | **Adopt.** Especially important for BR-01's parallel exception — a subtle rule easily broken during later sprints. |

---

### B-03 — AI-Reviewed localStorage Data Migration Strategy

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web — used at design time |
| **Applies To** | F-15, F-16, future versioning |
| **Purpose** | localStorage data has no automatic schema migration. If the application is updated (e.g. a new field added to the Step Record), existing saved data from the old schema will be silently incompatible. Use Claude to design a lightweight versioning and migration pattern at the outset — embedding a `schema_version` field in the localStorage root object and a migration function that upgrades old data on app load. Prevents data corruption across app updates. |
| **Cost** | No additional cost. Design-time Claude Web session. |
| **Complexity** | Low-Medium. One-time architectural decision. |
| **Recommendation** | **Adopt at Sprint 1.** Retrofitting this later is painful. Costs less than 2 hours to design and implement upfront. |

---

### B-04 — Automated Prompt Integrity Check via Claude

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web — used at content authoring time (post-testing) |
| **Applies To** | Step prompt population (post V1.0 testing, per OQ-01 decision) |
| **Purpose** | When the Owner authors the 24 real prompt texts to replace placeholders, there is a risk that prompts are incomplete, reference the wrong persona, or omit required input documents. Before embedding prompts in the static data file, run all 24 draft prompts through a single Claude review session with a structured checklist: (1) Does the prompt correctly invoke the intended persona? (2) Does it reference the correct input documents? (3) Is the expected output clearly specified? This is a quality gate, not automation. |
| **Cost** | No additional cost. Single Claude Web session. |
| **Complexity** | Very Low. One review session per prompt authoring cycle. |
| **Recommendation** | **Adopt at prompt authoring stage.** Low effort, high value quality gate. |

---

### B-05 — Claude Code for Automated localStorage Corruption Detection

| Attribute | Detail |
|---|---|
| **Tool** | Claude Code — defensive coding pattern |
| **Applies To** | F-15, F-16 (Data Persistence) |
| **Purpose** | Prompt Claude Code to implement a startup integrity check: on app load, parse the localStorage data and validate it against expected structure (project array, 24 steps per project, required fields present). If corruption is detected, display a clear warning to the user and offer to either reset to empty state or attempt recovery — rather than silently crashing or displaying blank data. |
| **Cost** | No additional cost. |
| **Complexity** | Low. Part of Sprint 1 app initialisation code. |
| **Recommendation** | **Adopt.** Startup validation is a standard defensive pattern and takes one focused Claude Code session to implement. |

---

## Section C — User Experience

These recommendations improve the clarity, efficiency, and delight of using the application day-to-day.

---

### C-01 — AI-Generated Plain-English Step Descriptions

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web |
| **Applies To** | Section 4.3 Step Detail Content — Plain-English Description field |
| **Purpose** | Each of the 24 steps requires a plain-English description explaining what the user must do and why. These are fixed, system-defined texts (not user-editable per BR-06). Rather than writing 24 descriptions manually, use Claude Web with a single batch prompt to generate all 24 in one session, in a consistent voice, at the right reading level. Output is reviewed by the Owner and pasted into the static seed data file (see A-03). |
| **Cost** | No additional cost. |
| **Complexity** | Very Low. Single Claude Web session. |
| **Recommendation** | **Adopt during Step 8 (Scaffold).** Consistent, well-written descriptions improve usability significantly. |

---

### C-02 — Smart "Next Action" Banner Using Deterministic Logic

| Attribute | Detail |
|---|---|
| **Tool** | No external AI tool required — logic authored with Claude Code assistance |
| **Applies To** | F-02 (Dashboard), F-11 (Active Step Highlight) |
| **Purpose** | Rather than just highlighting the current step number, the dashboard and project view can display a contextual "Your next action" banner that combines the step name, actor, and a one-line instruction. Example: *"Step 9 — Build Sprint 1 · Open Claude Code and paste the prompt below."* This is deterministic logic (no live AI call needed) but is best designed with Claude's help to produce natural, varied phrasing for each of the three actor types (Me / Claude Web / Claude Code). |
| **Cost** | No additional cost. |
| **Complexity** | Low. Template strings per actor type. |
| **Recommendation** | **Adopt.** Dramatically reduces cognitive load — the user never has to work out what to do next. |

---

### C-03 — Claude Web Integration — Pre-Formatted "Open in Claude" Deep Link

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web (claude.ai) — URL parameter feature |
| **Applies To** | All Claude Web steps (Steps 2–6, 15, 19, 21) |
| **Purpose** | Claude.ai supports pre-filling a new conversation via URL query parameters (e.g. `https://claude.ai/new?q=<encoded prompt>`). Instead of only offering a copy-to-clipboard button, each Claude Web step could also offer an **"Open in Claude"** button that launches a new claude.ai tab with the prompt pre-filled and ready to submit. Eliminates the copy-paste step entirely for Claude Web actions. |
| **Cost** | No additional cost. Uses existing Claude subscription. |
| **Complexity** | Low. URL encoding of prompt text. One additional button per step. |
| **Recommendation** | ~~**Adopt.**~~ **🔵 DEFERRED to V1.1 by Owner.** Manual copy-paste to Claude Web is sufficient for V1.0. Deep-link integration to be implemented in the next version once core functionality is proven. |

---

### C-04 — AI-Written Tooltip Help Text for Each Feature

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web |
| **Applies To** | All UI screens — hover tooltips and help icons |
| **Purpose** | Small help tooltips on status badges, the blocked reason field, the document tracker icons, and the export/import controls reduce confusion without requiring a separate help screen. Use Claude to batch-generate 20–30 concise tooltip strings (max 2 sentences each) in a single session. These are embedded as static text in the UI. |
| **Cost** | No additional cost. |
| **Complexity** | Very Low. Content generation, not engineering work. |
| **Recommendation** | **Adopt during Sprint 3 or UI polish phase.** Low effort, material improvement to first-time usability. |

---

### C-05 — AI-Assisted Export Summary Report

| Attribute | Detail |
|---|---|
| **Tool** | Claude Web — used on-demand by the Owner |
| **Applies To** | F-17 (Data Export) |
| **Purpose** | The JSON export (F-17) is a backup file, not a readable report. As a lightweight enhancement, the application could offer a second export format: a **Markdown progress report** per project, listing completed steps, timestamps, time-in-step durations, and any notes flagged by the user. This Markdown file can then be pasted into Claude Web to generate a human-readable project summary or post-mortem. No live AI call in the app — purely a formatted text export. |
| **Cost** | No additional cost. |
| **Complexity** | Low-Medium. Additional export function. |
| **Recommendation** | **🔵 CONFIRMED DEFERRED to V1.1 by Owner.** Not required for V1.0 launch. To be picked up as the first enhancement in the next version alongside C-03. |

---

### C-06 — Progress Visualisation — AI-Suggested Micro-Chart

| Attribute | Detail |
|---|---|
| **Tool** | Claude Code + Recharts or Chart.js (open source) |
| **Applies To** | F-02 (Dashboard progress indicator) |
| **Purpose** | The dashboard progress indicator (F-02) can be richer than a plain progress bar. A small horizontal step-status strip — 24 coloured cells, one per step, colour-coded by status — gives the Owner an at-a-glance health view across all projects. Claude Code can generate this component in one session using Recharts or a simple SVG approach. Across multiple simultaneous projects, this becomes a genuinely useful portfolio view. |
| **Cost** | Recharts / Chart.js are open source. No additional cost. |
| **Complexity** | Low. Single reusable React component. |
| **Recommendation** | **Adopt for Sprint 2.** Relatively low effort with high visual impact for a multi-project dashboard. |

---

## Section D — Techniques Not Recommended

The following AI capabilities were considered and are **not recommended** for Version 1.0, with reasons.

| Tool / Technique | Reason Not Recommended |
|---|---|
| **Live Claude API calls at runtime** (e.g. in-app AI assistant) | Adds API key management, cost per call, and network dependency. The app is designed to work offline. Adds complexity with minimal V1.0 benefit. Reconsider for V2.0. |
| **AI-powered natural language step search** | The app has only 24 fixed steps. A simple text filter is sufficient. NLP search is over-engineered for this scale. |
| **Auto-summarisation of step notes** | Notes are short, user-entered text. Summarisation adds no value at this volume. |
| **Vector embeddings / semantic similarity** | No use case at V1.0 scale. The data is structured and the retrieval model is deterministic. |
| **AI-generated test data / project simulation** | The Owner is the sole user and will populate real data immediately. Synthetic data generation is unnecessary. |
| **Voice input for notes** | Out of scope for V1.0. Browser speech APIs are inconsistent across environments. |

---

## Consolidated Summary Table

| ID | Tool / Technique | Category | Purpose (one line) | Cost | Complexity | Recommendation |
|---|---|---|---|---|---|---|
| A-01 | Claude Artifacts (React) | Speed | Scaffold full UI in one session | Included | Low | ✅ Adopt |
| A-02 | Claude Code + CLAUDE.md | Speed | Persistent project context for all Code sessions | Included | Low | ✅ Adopt |
| A-03 | Claude Web — Seed Data Generation | Speed | Generate all 24-step static data in one prompt | Included | Low | ✅ Adopt |
| A-04 | v0.dev | Speed | AI-generated React/Tailwind UI components | Free / $20pm | Low | ✅ Adopt |
| A-05 | GitHub Copilot | Speed | Autocomplete for utility/boilerplate functions | $10/month | Low | ❌ Rejected |
| B-01 | JSON Schema + Ajv | Controls | Validate import files before writing to localStorage | Free (OSS) | Low-Med | ✅ Adopt |
| B-02 | Claude Code — Unit Tests | Controls | Test BR-01 sequencing logic + parallel exception | Included | Low | ✅ Adopt |
| B-03 | localStorage Migration Strategy | Controls | Schema versioning to survive app updates | Included | Low-Med | ✅ Adopt |
| B-04 | Claude Web — Prompt QA Review | Controls | Quality gate before embedding real prompts | Included | Very Low | ✅ Adopt |
| B-05 | Claude Code — Startup Integrity Check | Controls | Detect and handle localStorage corruption on load | Included | Low | ✅ Adopt |
| C-01 | Claude Web — Step Descriptions | UX | Batch-generate all 24 plain-English descriptions | Included | Very Low | ✅ Adopt |
| C-02 | Next Action Banner | UX | Contextual one-line instruction on dashboard | Included | Low | ✅ Adopt |
| C-03 | "Open in Claude" Deep Link | UX | Pre-fill Claude Web with step prompt in one click | Included | Low | 🔵 V1.1 |
| C-04 | AI-Written Tooltip Text | UX | Batch-generate help tooltips for all UI controls | Included | Very Low | ✅ Adopt |
| C-05 | Markdown Progress Report Export | UX | Human-readable per-project export for retrospectives | Included | Low-Med | 🔵 V1.1 |
| C-06 | Step-Status Strip Chart | UX | 24-cell colour-coded progress visualisation per project | Free (OSS) | Low | ✅ Adopt Sprint 2 |

**Legend:** ✅ Adopt | ❌ Rejected | 🔵 Defer to V1.1

---

## Owner Decisions Log

All recommendations have been reviewed by the Owner. The document is now final. Three decisions deviate from the original draft recommendation.

| ID | Original Recommendation | Owner Decision | Reason |
|---|---|---|---|
| A-05 | Optional (if using VS Code) | **❌ Rejected** | Claude Code is the sole development tool. No additional monthly subscription cost is acceptable for V1.0. All utility and boilerplate code will be generated via Claude Code sessions. |
| C-03 | Adopt | **🔵 Deferred to V1.1** | Manual copy-paste to Claude Web is sufficient for V1.0. Deep-link integration adds complexity without being essential at launch. To be implemented in V1.1 alongside C-05. |
| C-05 | Deferred to V1.1 (draft) | **🔵 Confirmed Deferred to V1.1** | Already flagged as non-critical in draft. Owner confirms: not required for V1.0. Scheduled for V1.1 alongside C-03. |

All other recommendations rated ✅ Adopt are **approved for implementation** in the sprint plan.

---

## Appendix 1 — CLAUDE.md Template (for A-02)

```markdown
# CLAUDE.md — Implementation Wizard

## What This App Does
A personal project tracker for a solo finance professional. 
Tracks progress across multiple software build projects, each 
following a fixed 24-step AI-assisted development process.

## Tech Stack
- React (functional components + hooks)
- Tailwind CSS for styling
- localStorage for all persistence (no backend)
- No build tool required for V1.0 (or Vite if scaffolded)

## Key Files
- /src/data/steps.js     — Static 24-step definitions (read-only)
- /src/store/            — localStorage read/write helpers
- /src/components/       — React UI components
- /src/App.jsx           — Root component

## Critical Business Rules
1. Steps are sequential. Step N cannot be Complete until N-1 is Complete.
   EXCEPTION: Steps 5 and 6 may complete in either order once Step 4 is Complete.
2. Blocked status requires a non-empty blocked_reason string.
3. Prompt text in steps.js is NEVER user-editable.
4. All data lives in localStorage key: 'implementation-wizard-data'
5. localStorage root object must include schema_version field.

## Conventions
- UUIDs via crypto.randomUUID()
- All DateTime fields stored as ISO 8601 strings
- Status enums: 'pending' | 'in_progress' | 'complete' | 'blocked'
- Actor enums: 'me' | 'claude_web' | 'claude_code'
```

---

## Appendix 2 — Seed Data Generation Prompt (for A-03)

The following prompt, pasted into Claude Web, will generate the complete static step data file:

```
You are generating a JavaScript data file for a web application 
called Implementation Wizard. 

Produce a complete ES module export called STEPS — an array of 
exactly 24 objects. Each object must have these fields:

{
  step_number: <integer 1-24>,
  step_name: <string — short title>,
  actor: <'me' | 'claude_web' | 'claude_code'>,
  persona: <string — persona name, or '' if none>,
  description: <string — 2-3 sentence plain English explanation 
                of what the user must do in this step and why>,
  prompt_text: <string — '[PLACEHOLDER — Prompt for Step N 
                to be authored post-testing]'>,
  expected_output: <string — one sentence describing the 
                   deliverable>,
  linked_docs: <array of strings — filenames produced or 
               consumed, or []>
}

Use this master step register as your source of truth:
[PASTE Section 6 table from 01-functional-requirements.md here]

Output only the JavaScript file. No explanation. No markdown fences.
```

---

*End of Document — 03-ai-recommendations.md v1.1 (Final)*

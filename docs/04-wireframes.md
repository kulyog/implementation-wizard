# 04 — Wireframes & UI Specification
## Implementation Wizard

| Field | Detail |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Draft — For Owner Review |
| **Prepared By** | UI Expert Persona |
| **Date** | 2026-03-08 |
| **Input Document** | 02-technical-specifications.md v1.1 (Final) |

---

## Design Language

| Token | Value | Usage |
|---|---|---|
| **Background** | `white` / `gray-50` | Page and panel backgrounds |
| **Surface** | `white` with `border border-gray-200` | Cards, panels, modals |
| **Primary Accent** | `indigo-600` | Buttons, active states, links, highlights |
| **Primary Hover** | `indigo-700` | Button hover state |
| **Primary Light** | `indigo-50` | Active step background, selected row tint |
| **Primary Border** | `indigo-200` | Active step border, focus rings |
| **Text Primary** | `gray-900` | Headings, labels |
| **Text Secondary** | `gray-500` | Subtitles, metadata, hints |
| **Text Muted** | `gray-400` | Placeholders, disabled states |
| **Success** | `emerald-500` / `emerald-100` | Complete status |
| **Warning** | `amber-500` / `amber-100` | Blocked status |
| **Info** | `blue-500` / `blue-100` | In Progress status |
| **Neutral** | `gray-300` / `gray-100` | Pending status |
| **Danger** | `red-600` | Delete actions |
| **Font** | System UI / Inter | Clean, legible at all sizes |
| **Border Radius** | `rounded-lg` (cards), `rounded-md` (inputs), `rounded-full` (badges) | Consistent softness |
| **Shadow** | `shadow-sm` (cards), `shadow-lg` (modals) | Depth hierarchy |

**Design Principles:**
- Clarity over decoration. Every element earns its place.
- Information density appropriate for a power user working daily. No unnecessary white space.
- Finance-tool aesthetic: structured, trustworthy, precise — not consumer-app playful.
- The indigo accent is reserved for interactive and active states only. It is not decorative.

---

## Screen Inventory

| # | Screen / Modal | Component | View State |
|---|---|---|---|
| S-01 | Dashboard | `Dashboard.jsx` | `currentView = 'dashboard'` |
| S-02 | Project View (No Step Selected) | `ProjectView.jsx` | `currentView = 'project'`, no step open |
| S-03 | Project View (Step Selected — Step Detail Panel) | `ProjectView.jsx` + `StepDetailPanel.jsx` | `currentView = 'project'`, step selected |
| S-04 | Archived Projects View | `ArchivedView.jsx` | `currentView = 'archived'` |
| M-01 | Create New Project Modal | `CreateProjectModal.jsx` | Overlay on Dashboard |
| M-02 | Delete Confirmation Modal | `ConfirmModal.jsx` | Overlay on Dashboard or ProjectView |
| M-03 | Blocked Reason Modal | `BlockedReasonField.jsx` (within StatusControls) | Within StepDetailPanel |
| M-04 | Export / Import Panel | `AppShell.jsx` controls | Overlay on any view |

---

## Global Shell — AppShell.jsx

**Appears on all screens. Always visible.**

```
┌──────────────────────────────────────────────────────────────────────┐
│  AppShell — Top Navigation Bar                                       │
│  bg-white border-b border-gray-200 shadow-sm  h-14                  │
│                                                                      │
│  ┌──────────────────────┐          ┌─────────────────────────────┐  │
│  │  ⚡ Implementation   │          │  [↑ Export]  [↓ Import]     │  │
│  │     Wizard           │          │  [← Dashboard] (if in       │  │
│  │  text-indigo-600     │          │   project/archived view)    │  │
│  │  font-semibold       │          └─────────────────────────────┘  │
│  └──────────────────────┘                                            │
└──────────────────────────────────────────────────────────────────────┘
```

**Components:**
- App name / logo text — `text-indigo-600 font-semibold text-lg` — clicking returns to Dashboard
- `[↑ Export]` button — `variant: outline, size: sm` — triggers JSON download
- `[↓ Import]` button — `variant: outline, size: sm` — opens file picker
- `[← Dashboard]` breadcrumb link — visible only when `currentView !== 'dashboard'`
- Tooltip on Export: *"Download all project data as a JSON backup file"*
- Tooltip on Import: *"Restore project data from a JSON backup. This will overwrite all current data."*

---

---

## S-01 — Dashboard View

### Layout Description

The dashboard is a two-zone page: a top summary bar showing aggregate status, and a responsive card grid (2 columns on 1440px, 3 columns on 1920px) showing all active projects. An empty state is shown when no projects exist.

```
┌──────────────────────────────────────────────────────────────────────┐
│  AppShell (top nav — always present)                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DASHBOARD                              [+ New Project]  [Archived] │
│  text-2xl font-bold text-gray-900       btn-indigo       btn-outline │
│                                                                      │
│  ── Summary Bar ─────────────────────────────────────────────────── │
│  │ 3 Active Projects  │  1 Complete  │  0 Blocked  │               │
│  │ text-sm text-gray-500 with indigo/emerald/amber dot indicators   │
│  ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  ── Project Card Grid (2 cols @ 1440px) ─────────────────────────── │
│  ┌──────────────────────────┐  ┌──────────────────────────┐         │
│  │  PROJECT CARD            │  │  PROJECT CARD            │         │
│  │  (see card spec below)   │  │                          │         │
│  └──────────────────────────┘  └──────────────────────────┘         │
│  ┌──────────────────────────┐  ┌──────────────────────────┐         │
│  │  PROJECT CARD            │  │  EMPTY PLACEHOLDER CARD  │         │
│  │                          │  │  (+ New Project)         │         │
│  └──────────────────────────┘  └──────────────────────────┘         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Project Card Anatomy

```
┌──────────────────────────────────────────────────────────┐
│  PROJECT CARD — bg-white border border-gray-200           │
│  rounded-lg shadow-sm p-5 hover:shadow-md cursor-pointer  │
│                                                           │
│  ┌──────────────────────────────────────────┐  [⋮ Menu]  │
│  │  Implementation Wizard                   │  (kebab)   │
│  │  text-base font-semibold text-gray-900   │            │
│  └──────────────────────────────────────────┘            │
│  "Track my AI-assisted web app build"                     │
│  text-sm text-gray-500 truncate                          │
│                                                           │
│  ── Status Strip Chart ─────────────────────────────────  │
│  24 small cells in a single row — each 1/24 width        │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐    │
│  │█│█│█│█│█│░│░│░│░│░│░│░│░│░│░│░│░│░│░│░│░│░│░│░│    │
│  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘    │
│  emerald=complete, blue=in_progress,                     │
│  amber=blocked, gray=pending                             │
│  "5 / 24 steps complete"  text-xs text-gray-500         │
│                                                           │
│  ── Next Action Banner ──────────────────────────────── │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ ▶  Step 6 — Run QC Analyst Persona                  │ │
│  │    Open Claude Web and paste the prompt below.      │ │
│  │    bg-indigo-50 border-l-4 border-indigo-400        │ │
│  │    text-sm text-indigo-800 p-3 rounded-r-md         │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ── Footer ─────────────────────────────────────────── │
│  Created 08 Mar 2026          [● Active]                 │
│  text-xs text-gray-400        badge-emerald              │
└──────────────────────────────────────────────────────────┘
```

**Card kebab menu [⋮] items:**
- Open Project
- Rename Project
- Duplicate Project
- Archive Project
- Delete Project (red text)

### Empty State (No Projects)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              ⚡                                          │
│     No projects yet.                                     │
│     Start your first AI-assisted build.                  │
│     text-gray-500 text-center py-16                      │
│                                                          │
│          [+ Create Your First Project]                   │
│          btn-indigo-600 rounded-lg px-6 py-3             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Key Components
- `AppShell` — global nav bar
- `Dashboard` — page container, summary bar, card grid
- `ProjectCard` × N — one per active project
- `StepStripChart` — inside each card
- `NextActionBanner` — inside each card
- `CreateProjectModal` — triggered by `[+ New Project]`

### Navigation Flow
- Click project card body → `currentView = 'project'`, `currentProjectId = id`
- Click `[+ New Project]` → opens M-01 (Create Project Modal)
- Click `[Archived]` → `currentView = 'archived'`
- Click `[⋮] → Open Project` → same as clicking card body
- Click `[⋮] → Archive` → confirm then update project status

---

### v0.dev Prompt — S-01 Dashboard

```
Create a React dashboard page using Tailwind CSS for a personal 
project tracker app called "Implementation Wizard". 

Design language: white background, gray-50 page background, 
indigo-600 as the primary accent colour, clean professional 
finance aesthetic, no decorative elements.

The page has:

1. A top navigation bar (h-14, bg-white, border-b border-gray-200, 
   shadow-sm) containing:
   - Left: App name "⚡ Implementation Wizard" in text-indigo-600 
     font-semibold text-lg (clickable, returns to dashboard)
   - Right: Two small outline buttons "↑ Export" and "↓ Import" 
     with Lucide icons (Upload, Download)

2. A page header section (px-8 pt-6 pb-4) with:
   - Left: Page title "Dashboard" in text-2xl font-bold text-gray-900
   - Right: "Archived Projects" outline button (Archive icon) and 
     "+ New Project" filled indigo-600 button (Plus icon)
   - Below title: a summary bar showing three pills: 
     "3 Active" (indigo dot), "1 Complete" (emerald dot), 
     "0 Blocked" (amber dot) — text-sm text-gray-500

3. A card grid (px-8 pb-8, grid grid-cols-2 gap-5) showing two 
   sample project cards. Each card is:
   bg-white border border-gray-200 rounded-lg shadow-sm p-5 
   hover:shadow-md cursor-pointer

   Card contents (top to bottom):
   a) Header row: project name in font-semibold text-gray-900 
      on left, a kebab menu icon button (MoreVertical from Lucide) 
      on right
   b) Description in text-sm text-gray-500 truncate
   c) Step status strip: a row of exactly 24 small equal-width 
      rectangular cells (height 8px, gap 2px, rounded-sm). 
      First 5 cells bg-emerald-500, next 1 cell bg-blue-400, 
      remaining 18 cells bg-gray-200. Below: 
      "5 / 24 steps complete" text-xs text-gray-500
   d) Next action banner: bg-indigo-50 border-l-4 border-indigo-400 
      rounded-r-md p-3 flex items-start gap-2. 
      Left: ChevronRight icon text-indigo-500. 
      Right: two lines — step name in text-sm font-medium 
      text-indigo-900, instruction in text-sm text-indigo-700
   e) Card footer row: created date text-xs text-gray-400 on left, 
      status badge on right (bg-emerald-100 text-emerald-700 
      text-xs font-medium px-2 py-0.5 rounded-full)

Use Lucide React icons throughout. Add a third card showing an 
"empty" placeholder card with a dashed border, centered 
"+ New Project" link text, for when the grid has an odd number 
of projects. Make it look production-ready and polished.
```

---

---

## S-02 — Project View (No Step Selected)

### Layout Description

The project view replaces the dashboard. The AppShell gains a breadcrumb. The page is split vertically into a left checklist panel (35%) and a right placeholder panel (65%). The right panel shows a welcome/instruction state when no step is selected.

```
┌──────────────────────────────────────────────────────────────────────┐
│  AppShell — [← Dashboard]  /  Implementation Wizard                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ── Project Header ──────────────────────────────────────────────── │
│  Implementation Wizard                  [Rename] [Duplicate]         │
│  text-xl font-bold text-gray-900        [Archive] [Delete↗]          │
│  "Track my AI-assisted web app build"   btn-outline btn-ghost        │
│  text-sm text-gray-500                                               │
│                                                                      │
│  ── Progress Bar ────────────────────────────────────────────────── │
│  [█████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 5 / 24  21%     │
│  indigo-600 bar on gray-100 track h-2 rounded-full                  │
│                                                                      │
├──────────────────────────┬───────────────────────────────────────────┤
│  STEP CHECKLIST  35%     │  STEP DETAIL PANEL  65%                   │
│  border-r border-gray-200│                                           │
│  overflow-y-auto         │                                           │
│                          │                                           │
│  Search/filter bar       │    ┌─────────────────────────────┐       │
│  [🔍 Filter steps...]    │    │                             │       │
│                          │    │   Select a step from the    │       │
│  [STEP LIST — see S-03]  │    │   checklist to view its     │       │
│                          │    │   details and prompt.       │       │
│  Step 1  ✓ Complete      │    │                             │       │
│  Step 2  ✓ Complete      │    │   ⚡ text-gray-400          │       │
│  Step 3  ✓ Complete      │    │   text-center p-12          │       │
│  Step 4  ✓ Complete      │    │                             │       │
│  Step 5  ● In Progress ← │    └─────────────────────────────┘       │
│  Step 6  ○ Pending       │                                           │
│  Step 7  ○ Pending       │                                           │
│  ...                     │                                           │
│  Step 24 ○ Pending       │                                           │
│                          │                                           │
│  ── Doc Tracker ─────── │                                           │
│  (collapsible section    │                                           │
│   at bottom of left pane)│                                           │
└──────────────────────────┴───────────────────────────────────────────┘
```

### Step Row Anatomy (within checklist)

```
┌──────────────────────────────────────────────────────────┐
│  ACTIVE STEP ROW (bg-indigo-50 border-l-4 border-indigo-400)
│                                                          │
│  ●  Step 5 — Run UI Expert Persona          [Claude Web] │
│  ↑                                          badge-blue   │
│  status dot                                              │
│  indigo-600 (active)                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  COMPLETE STEP ROW (bg-white hover:bg-gray-50)           │
│                                                          │
│  ✓  Step 4 — Run Technical Architect        [Claude Web] │
│  checkmark icon text-emerald-500            badge-gray   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  PENDING STEP ROW (bg-white hover:bg-gray-50 text-gray-400)
│                                                          │
│  ○  Step 7 — Review All Docs                [Me]         │
│  circle icon text-gray-300                  badge-gray   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  BLOCKED STEP ROW (bg-amber-50)                          │
│                                                          │
│  ⚠  Step 6 — Run QC Analyst Persona         [Claude Web] │
│  warning icon text-amber-500                badge-amber  │
└──────────────────────────────────────────────────────────┘
```

**Status dot legend (shown as small pills at top of checklist):**
`● Pending` `● In Progress` `✓ Complete` `⚠ Blocked`

### Doc Tracker Panel (collapsible, bottom of left pane)

```
┌──────────────────────────────────────────┐
│  /docs FILES  [▼ collapse]               │
│  border-t border-gray-200 pt-3           │
│                                          │
│  ✓ 01-functional-requirements.md  noted  │
│  ✓ 02-technical-specifications.md created│
│  ✓ 03-ai-recommendations.md       created│
│  ○ 04-wireframes.md               pending│
│  ○ 05-test-cases.md               pending│
│  ○ audit-report.md                pending│
│                                          │
│  Each row: filename truncated + status   │
│  badge + edit note icon                  │
└──────────────────────────────────────────┘
```

### Key Components
- `AppShell` (with breadcrumb)
- `ProjectHeader` — name, description, action buttons
- Progress bar (inline, not a component — computed from step statuses)
- `StepChecklist` — full 24-step list
- `StepRow` × 24 — each with status icon, step name, actor badge
- `DocTracker` — collapsible at bottom of left pane
- Right pane empty state placeholder

### Navigation Flow
- Click step row → opens S-03 (Step Detail Panel in right pane)
- Click `[← Dashboard]` in AppShell → returns to Dashboard
- Click `[Rename]` → inline edit of project name
- Click `[Duplicate]` → creates copy project, navigates to it
- Click `[Archive]` → M-02 confirmation, then → Dashboard
- Click `[Delete]` → M-02 confirmation (destructive), then → Dashboard

---

### v0.dev Prompt — S-02 Project View (No Step Selected)

```
Create a React project view page using Tailwind CSS for a project 
tracker called "Implementation Wizard".

Design language: white background, gray-50 page background, 
indigo-600 primary accent, professional finance aesthetic.

The page layout:

1. Top nav bar (h-14 bg-white border-b border-gray-200 shadow-sm):
   - Left: "⚡ Implementation Wizard" text-indigo-600 font-semibold
   - Middle: breadcrumb "← Dashboard / Implementation Wizard" 
     text-sm text-gray-500 (← is a clickable link text-indigo-600)
   - Right: "↑ Export" and "↓ Import" small outline buttons

2. Project header (px-8 pt-5 pb-4 border-b border-gray-100):
   - Left: Project name "Implementation Wizard" text-xl font-bold 
     text-gray-900, below it description "Track my AI build" 
     text-sm text-gray-500
   - Right: row of small buttons: "Rename" (Pencil icon), 
     "Duplicate" (Copy icon), "Archive" (Archive icon), 
     "Delete" (Trash2 icon, text-red-600) — all outline size-sm
   - Below header: a thin progress bar full-width, bg-gray-100 h-2 
     rounded-full with an indigo-600 filled portion at ~21%. 
     Right-aligned label "5 / 24 steps  21%" text-xs text-gray-500

3. Main content area: flex row, full remaining height

   LEFT PANEL — w-[35%] border-r border-gray-200 overflow-y-auto 
   flex-col:
   
   a) Search bar at top: 
      input with Search icon placeholder "Filter steps..." 
      text-sm border border-gray-200 rounded-md mx-4 my-3

   b) Step list: 24 step rows. Each row is px-4 py-3 flex 
      items-center gap-3 border-b border-gray-100 cursor-pointer 
      hover:bg-gray-50. Contents of each row:
      - Status icon (left, w-5 h-5): CheckCircle2 text-emerald-500 
        for complete, Circle text-gray-300 for pending, 
        Loader2 text-blue-400 for in-progress, 
        AlertTriangle text-amber-500 for blocked
      - Step info: step number text-xs text-gray-400, 
        step name text-sm font-medium text-gray-800
      - Actor badge (right, ml-auto): small pill rounded-full 
        text-xs px-2 py-0.5. "Me" = bg-gray-100 text-gray-600. 
        "Claude Web" = bg-blue-100 text-blue-700. 
        "Claude Code" = bg-violet-100 text-violet-700.
      
      Show step 5 as the ACTIVE step: 
      bg-indigo-50 border-l-4 border-indigo-500 (override left 
      border) text-indigo-900 font-semibold
      
      Show steps 1-4 as complete (CheckCircle2 emerald).
      Show steps 5 as in-progress (Loader2 blue), highlighted.
      Show steps 6-24 as pending (Circle gray).

   c) At the very bottom of the left panel, a collapsible 
      "/docs Files" section: border-t border-gray-200 p-4.
      Title "/docs Files" text-xs font-semibold text-gray-500 
      uppercase tracking-wide with ChevronDown icon.
      Below: 6 rows each showing a filename text-xs text-gray-600 
      and a status badge (text-xs rounded-full):
      "noted" bg-emerald-100 text-emerald-700,
      "created" bg-blue-100 text-blue-700,
      "pending" bg-gray-100 text-gray-500.

   RIGHT PANEL — flex-1 bg-gray-50 flex items-center 
   justify-center:
   Empty state: centered column, Lightning icon w-12 h-12 
   text-gray-300, then "Select a step" text-lg font-medium 
   text-gray-400, then "Click any step in the checklist to view 
   its details and prompt." text-sm text-gray-400 text-center 
   max-w-xs

Make it look production-ready. Use Lucide React icons.
```

---

---

## S-03 — Project View (Step Detail Panel Open)

### Layout Description

The left checklist pane is identical to S-02. The right pane (65%) renders the full step detail panel with all 12 fields from the functional requirements Section 4.3. The selected step row in the checklist is highlighted with indigo.

```
┌──────────────────────────────────────────────────────────────────────┐
│  AppShell — [← Dashboard]  /  Implementation Wizard                  │
│  Project Header + Progress Bar (same as S-02)                        │
├──────────────────────────┬───────────────────────────────────────────┤
│  STEP CHECKLIST  35%     │  STEP DETAIL PANEL  65%                   │
│  (same as S-02)          │  bg-white overflow-y-auto px-7 py-6       │
│                          │                                           │
│  Step 5 highlighted ─────┼──►                                        │
│  indigo accent           │  ── Step Header ─────────────────────── │
│                          │  Step 5 of 24                            │
│                          │  text-xs text-gray-400 uppercase         │
│                          │                                           │
│                          │  Run UI Expert Persona                   │
│                          │  text-xl font-bold text-gray-900         │
│                          │                                           │
│                          │  [Claude Web] [● In Progress]            │
│                          │  actor badge  status badge               │
│                          │                                           │
│                          │  ── Timestamps + Timer ──────────────── │
│                          │  Started: 08 Mar 2026, 14:10             │
│                          │  Elapsed: ⏱ 0h 14m 32s (live counter)   │
│                          │  text-xs text-gray-500                   │
│                          │                                           │
│                          │  ── Description ─────────────────────── │
│                          │  bg-gray-50 rounded-md p-4               │
│                          │  "Read the completed wireframes from     │
│                          │  Step 4. Using the UI Expert persona,    │
│                          │  produce 04-wireframes.md covering..."   │
│                          │  text-sm text-gray-700                   │
│                          │                                           │
│                          │  ── Expected Output ─────────────────── │
│                          │  label: text-xs font-semibold uppercase  │
│                          │  text-gray-500 tracking-wide             │
│                          │  "Produces 04-wireframes.md in /docs"   │
│                          │  text-sm text-gray-700                   │
│                          │                                           │
│                          │  ── Linked Docs ─────────────────────── │
│                          │  [📄 02-technical-specifications.md]     │
│                          │  pill badges text-xs text-indigo-700     │
│                          │  bg-indigo-50 rounded-full px-2 py-0.5  │
│                          │                                           │
│                          │  ── AI Prompt ───────────────────────── │
│                          │  ┌──────────────────────────────────┐   │
│                          │  │ [PLACEHOLDER — Prompt for Step 5 │   │
│                          │  │  to be authored post-testing]    │   │
│                          │  │                                  │   │
│                          │  │ bg-gray-900 text-gray-100        │   │
│                          │  │ font-mono text-xs rounded-md p-4 │   │
│                          │  │ overflow-y-auto max-h-40         │   │
│                          │  └──────────────────────────────────┘   │
│                          │  [📋 Copy Prompt]  Ctrl+Shift+C hint    │
│                          │  btn-indigo, full-width, mt-2           │
│                          │  → changes to [✓ Copied!] for 2s       │
│                          │                                           │
│                          │  ── Status Controls ─────────────────── │
│                          │  Update Status:                          │
│                          │  [Pending] [● In Progress] [✓ Complete]  │
│                          │  [⚠ Blocked]                             │
│                          │  Active status = indigo-600 filled       │
│                          │  Others = outline gray                   │
│                          │                                           │
│                          │  ── Notes ───────────────────────────── │
│                          │  Your Notes                              │
│                          │  text-xs font-semibold uppercase         │
│                          │  text-gray-500 tracking-wide             │
│                          │  ┌──────────────────────────────────┐   │
│                          │  │ Paste Claude output here, log    │   │
│                          │  │ decisions, note file paths...    │   │
│                          │  │                                  │   │
│                          │  │ textarea — border border-gray-200│   │
│                          │  │ rounded-md p-3 text-sm min-h-32  │   │
│                          │  │ resize-y w-full focus:ring-2     │   │
│                          │  │ focus:ring-indigo-500            │   │
│                          │  └──────────────────────────────────┘   │
│                          │  Auto-saved • text-xs text-gray-400     │
│                          │  (shows after last keystroke)            │
└──────────────────────────┴───────────────────────────────────────────┘
```

### Blocked Step State — Right Panel Variation

When a step is Blocked, the status badge turns amber and a required reason field appears below the status buttons:

```
│  ── Blocked Reason (required) ─────────────────────── │
│  ┌──────────────────────────────────────────────┐     │
│  │ Reason for blocking this step (required)     │     │
│  │ border-2 border-amber-400 rounded-md p-3     │     │
│  │ text-sm bg-amber-50                          │     │
│  └──────────────────────────────────────────────┘     │
│  [Save Blocked Reason]  btn-amber w-full              │
```

### Complete Step State — Right Panel Variation

When a step is Complete, the prompt copy area is still visible but the status controls show only `[✓ Complete]` active and a smaller `[Undo Complete]` ghost link. Timestamps show both started and completed.

### Key Components
- Everything from S-02 left pane
- `StepDetailPanel` (right pane) containing:
  - Step number, name, actor badge, status badge
  - Timestamp row + `StepTimer` (live counter)
  - Description block (read-only, `bg-gray-50`)
  - Expected output (read-only text)
  - Linked docs (badge pills)
  - `PromptBox` (dark `bg-gray-900` code block + copy button)
  - `StatusControls` (4 status buttons with BR enforcement)
  - `BlockedReasonField` (conditional — only when Blocked)
  - `NotesField` (auto-grow textarea with auto-save indicator)

### Navigation Flow
- Click different step row in checklist → detail panel updates to that step
- Click `[Copy Prompt]` → copies to clipboard, button text changes 2s
- Click `Ctrl+Shift+C` → same as copy button
- Click status button → updates step status (with BR enforcement)
- Click `[⚠ Blocked]` → `BlockedReasonField` appears inline (not a modal)
- Notes textarea → auto-saves on every keystroke (debounced 500ms)

---

### v0.dev Prompt — S-03 Step Detail Panel

```
Create a React step detail panel component using Tailwind CSS for 
"Implementation Wizard". This is the right panel (65% width) of a 
split-view project page.

Design language: white background, indigo-600 primary accent, 
professional finance aesthetic, dense information layout.

The panel is a scrollable column (overflow-y-auto h-full px-7 py-6 
bg-white) with these sections in order:

1. STEP HEADER:
   - "Step 5 of 24" text-xs font-medium text-gray-400 uppercase 
     tracking-wide
   - "Run UI Expert Persona" text-xl font-bold text-gray-900 mt-1
   - Row of two badges (mt-2 flex gap-2):
     Actor badge "Claude Web" bg-blue-100 text-blue-700 text-xs 
     font-medium px-2.5 py-1 rounded-full
     Status badge "● In Progress" bg-blue-50 text-blue-700 text-xs 
     font-medium px-2.5 py-1 rounded-full border border-blue-200

2. TIMESTAMPS (mt-4 flex items-center gap-4 text-xs text-gray-500):
   - "Started: 08 Mar 2026, 14:10"
   - ⏱ Timer "0h 14m 32s" with Clock icon, text-indigo-600 
     font-medium (live counter)

3. DESCRIPTION (mt-5):
   - Label: "What to do" text-xs font-semibold uppercase 
     tracking-wide text-gray-500
   - Body: bg-gray-50 rounded-md p-4 mt-1 text-sm text-gray-700 
     leading-relaxed. Sample text: "Read the technical 
     specifications from Step 4. Using the UI Expert persona, 
     produce 04-wireframes.md covering all screens with layout 
     descriptions, component lists, and v0.dev prompts."

4. EXPECTED OUTPUT (mt-4):
   - Label: "Expected Output" same style as above
   - Body: text-sm text-gray-700 "Produces 04-wireframes.md 
     saved to /docs folder"

5. LINKED DOCS (mt-4):
   - Label: "Linked Documents" same style
   - Row of pill badges: bg-indigo-50 text-indigo-700 text-xs 
     px-2.5 py-1 rounded-full border border-indigo-100 
     with FileText icon. Show: "02-technical-specifications.md"

6. AI PROMPT (mt-5):
   - Label: "AI Prompt" same style as labels above, 
     plus a small "read-only" text-gray-400 label on the right
   - Code block: bg-gray-900 text-gray-100 font-mono text-xs 
     rounded-md p-4 mt-1 overflow-y-auto max-h-40 leading-relaxed.
     Text: "[PLACEHOLDER — Prompt for Step 5 to be authored 
     post-testing]"
   - Below code block: full-width button 
     "📋 Copy Prompt  Ctrl+Shift+C" 
     bg-indigo-600 hover:bg-indigo-700 text-white rounded-md 
     py-2.5 text-sm font-medium mt-2 flex items-center 
     justify-center gap-2 (Copy icon from Lucide)

7. STATUS CONTROLS (mt-6):
   - Label: "Update Status" text-xs font-semibold uppercase 
     tracking-wide text-gray-500
   - Row of 4 buttons (mt-2 grid grid-cols-2 gap-2):
     "Pending" — outline gray rounded-md py-2 text-sm
     "● In Progress" — bg-blue-600 text-white rounded-md py-2 
     text-sm (active state)
     "✓ Complete" — outline gray rounded-md py-2 text-sm
     "⚠ Blocked" — outline gray rounded-md py-2 text-sm

8. NOTES (mt-6 pb-8):
   - Label: "Your Notes" same label style + 
     "Auto-saved" text-xs text-gray-400 on right
   - Textarea: w-full min-h-32 border border-gray-200 rounded-md 
     p-3 text-sm text-gray-700 placeholder-gray-400 resize-y 
     focus:outline-none focus:ring-2 focus:ring-indigo-500 
     focus:border-transparent mt-1
     Placeholder: "Paste Claude output here, log decisions, 
     note file paths or observations..."

Add a thin divider (border-t border-gray-100) between each major 
section. Use Lucide React icons. Make it production-ready.
```

---

---

## S-04 — Archived Projects View

### Layout Description

A simple full-width list view. The AppShell is identical. No split panel. Projects are shown as compact rows in a table-like list, each with restore and delete options.

```
┌──────────────────────────────────────────────────────────────────────┐
│  AppShell — [← Dashboard]                                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ARCHIVED PROJECTS                          [← Back to Dashboard]   │
│  text-2xl font-bold text-gray-900           text-sm text-indigo-600 │
│  "Projects removed from your active dashboard."                      │
│  text-sm text-gray-500                                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Project Name          Steps   Archived On    Actions       │   │
│  │  text-xs font-semibold uppercase text-gray-500 px-5 py-2    │   │
│  │  bg-gray-50 border-b border-gray-200                        │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  Stock Screener MVP    18/24   05 Mar 2026   [Restore][Del]  │   │
│  │  text-sm font-medium   text-xs text-gray-500  btn-outline   │   │
│  │  text-gray-900         text-gray-400          btn-danger-sm │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  Trading Dashboard v1  24/24   01 Feb 2026   [Restore][Del]  │   │
│  │                        ✓ Complete                            │   │
│  │                        badge-emerald                         │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  [Empty State if no archived projects]                       │   │
│  │  "No archived projects yet."                                 │   │
│  │  text-sm text-gray-400 text-center py-12                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Components
- `AppShell` (with Dashboard breadcrumb)
- `ArchivedView` — page container
- Archived project table/list
- Per-row: `[Restore]` button (outline indigo), `[Delete]` button (outline red)
- Empty state

### Navigation Flow
- Click `[← Back to Dashboard]` or AppShell breadcrumb → Dashboard
- Click project name → opens `ProjectView` in read-only mode (can still view steps/notes, cannot change status)
- Click `[Restore]` → project moves back to active, navigates to Dashboard
- Click `[Delete]` → M-02 confirmation modal, then removes permanently

---

### v0.dev Prompt — S-04 Archived Projects View

```
Create a React archived projects view using Tailwind CSS for 
"Implementation Wizard".

Design language: white/gray-50 background, indigo-600 accent, 
professional finance aesthetic.

Layout:

1. Top nav bar (h-14 bg-white border-b border-gray-200 shadow-sm):
   - Left: "⚡ Implementation Wizard" text-indigo-600 font-semibold
   - Middle: "← Dashboard" clickable breadcrumb text-sm 
     text-indigo-600 flex items-center gap-1 (ChevronLeft icon)
   - Right: "↑ Export" and "↓ Import" small outline buttons

2. Page header (px-8 pt-6 pb-5):
   - "Archived Projects" text-2xl font-bold text-gray-900
   - "Projects removed from your active dashboard. 
     Restore to resume work." text-sm text-gray-500 mt-1

3. Main content (px-8 pb-8):
   A card bg-white border border-gray-200 rounded-lg shadow-sm 
   overflow-hidden.
   
   Inside: a table-like structure.
   
   Header row: bg-gray-50 border-b border-gray-200 px-5 py-3
   Columns: "Project" | "Progress" | "Archived On" | "Actions"
   All text-xs font-semibold uppercase tracking-wide text-gray-500
   
   Data rows (show 2 sample rows):
   Each row: px-5 py-4 border-b border-gray-100 flex items-center 
   hover:bg-gray-50
   
   Row 1:
   - Project: "Stock Screener MVP" text-sm font-medium text-gray-900, 
     below it "18 of 24 steps complete" text-xs text-gray-400
   - Progress: small step strip (18 emerald cells + 6 gray cells, 
     height 6px) or "18/24" text-sm text-gray-600
   - Archived On: "05 Mar 2026" text-sm text-gray-500
   - Actions: "Restore" outline button indigo-600 size-sm (RotateCcw 
     icon), then "Delete" outline button red-600 size-sm (Trash2 
     icon), gap-2
   
   Row 2:
   - Project: "Trading Dashboard v1" with 
     "✓ Complete" badge bg-emerald-100 text-emerald-700 text-xs 
     rounded-full px-2 py-0.5 ml-2
   - "24 of 24 steps complete" text-xs text-gray-400
   - "01 Feb 2026"
   - Same action buttons
   
   Empty state (shown when no archived projects):
   py-16 flex flex-col items-center justify-center text-center
   Archive icon w-10 h-10 text-gray-300
   "No archived projects" text-base font-medium text-gray-400 mt-3
   "Projects you archive will appear here." text-sm text-gray-400

Use Lucide React icons. Make it production-ready.
```

---

---

## M-01 — Create New Project Modal

### Layout Description

Centred overlay modal on a dimmed background. Simple form — project name (required) and optional description. Created on submit with all 24 steps auto-populated.

```
┌──── Overlay (bg-black/50 fixed inset-0) ────────────────────────────┐
│                                                                      │
│         ┌──────────────────────────────────────────┐                │
│         │  Create New Project                    ✕ │                │
│         │  bg-white rounded-xl shadow-lg p-6 w-[480px]              │
│         │                                          │                │
│         │  Project Name *                          │                │
│         │  ┌────────────────────────────────────┐  │                │
│         │  │ e.g. Implementation Wizard v2      │  │                │
│         │  └────────────────────────────────────┘  │                │
│         │  border border-gray-200 rounded-md        │                │
│         │  focus:ring-2 focus:ring-indigo-500       │                │
│         │                                          │                │
│         │  Description (optional)                  │                │
│         │  ┌────────────────────────────────────┐  │                │
│         │  │ A short description of this        │  │                │
│         │  │ project...                         │  │                │
│         │  └────────────────────────────────────┘  │                │
│         │  textarea rows-3, same border style       │                │
│         │  Max 500 characters. text-xs text-gray-400│                │
│         │                                          │                │
│         │  ┌──────────────────┐ ┌────────────────┐ │                │
│         │  │     Cancel       │ │ Create Project │ │                │
│         │  │ btn-outline-gray │ │ btn-indigo-600 │ │                │
│         │  └──────────────────┘ └────────────────┘ │                │
│         └──────────────────────────────────────────┘                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Components
- `CreateProjectModal` — modal shell
- Project name input (required, max 100 chars)
- Description textarea (optional, max 500 chars, char counter)
- `[Cancel]` → closes modal, no action
- `[Create Project]` → dispatches `CREATE_PROJECT` action, closes modal, navigates to new ProjectView

### v0.dev Prompt — M-01 Create Project Modal

```
Create a React modal dialog using Tailwind CSS for creating a new 
project in "Implementation Wizard".

Design: white modal bg-white rounded-xl shadow-xl on a 
semi-transparent overlay bg-black/50 fixed inset-0 
flex items-center justify-center z-50.

Modal content (w-[480px] p-6):

1. Header: flex justify-between items-center mb-5
   - "Create New Project" text-lg font-semibold text-gray-900
   - X icon button (text-gray-400 hover:text-gray-600)

2. Divider: border-t border-gray-100 mb-5

3. Form fields (space-y-4):
   
   Field 1 — Project Name:
   - Label: "Project Name" text-sm font-medium text-gray-700 
     with a small red asterisk text-red-500
   - Input: w-full border border-gray-200 rounded-md px-3 py-2 
     text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
     focus:border-transparent
     placeholder="e.g. Stock Screener MVP"
   
   Field 2 — Description (Optional):
   - Label: "Description" text-sm font-medium text-gray-700 + 
     "(optional)" text-xs text-gray-400 ml-1
   - Textarea: w-full border border-gray-200 rounded-md px-3 py-2 
     text-sm rows=3 resize-none focus:ring-2 focus:ring-indigo-500
     placeholder="A short description of this project..."
   - Below textarea: character counter "0 / 500" 
     text-xs text-gray-400 text-right

4. Info note (bg-indigo-50 rounded-md p-3 text-xs text-indigo-700 
   flex items-start gap-2):
   Info icon + "All 24 steps will be created automatically in 
   Pending status. You can start tracking immediately."

5. Footer (mt-6 flex justify-end gap-3):
   - "Cancel" button: border border-gray-200 rounded-md px-4 py-2 
     text-sm text-gray-700 hover:bg-gray-50
   - "Create Project" button: bg-indigo-600 hover:bg-indigo-700 
     text-white rounded-md px-4 py-2 text-sm font-medium 
     flex items-center gap-2 (Plus icon)

Make it production-ready. Use Lucide React icons.
```

---

---

## M-02 — Delete Confirmation Modal

### Layout Description

Minimal destructive action confirmation. Reused for both Project delete and Import overwrite confirmation (wording changes).

```
┌──── Overlay ────────────────────────────────────────────────────────┐
│                                                                      │
│         ┌──────────────────────────────────────────┐                │
│         │  bg-white rounded-xl shadow-lg p-6 w-[400px]              │
│         │                                          │                │
│         │  [🗑 Trash icon — text-red-500 w-10 h-10]│                │
│         │  centered, mb-4                          │                │
│         │                                          │                │
│         │  Delete "Implementation Wizard"?         │                │
│         │  text-lg font-semibold text-gray-900     │                │
│         │  text-center                             │                │
│         │                                          │                │
│         │  This action is permanent and cannot be  │                │
│         │  undone. All project data, step notes,   │                │
│         │  and progress will be lost.              │                │
│         │  text-sm text-gray-500 text-center mt-2  │                │
│         │                                          │                │
│         │  ┌──────────────────┐ ┌────────────────┐ │                │
│         │  │     Cancel       │ │  Delete Project│ │                │
│         │  │ btn-outline-gray │ │ btn-red-600    │ │                │
│         │  └──────────────────┘ └────────────────┘ │                │
│         └──────────────────────────────────────────┘                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Import overwrite variant** — same modal, different copy:
- Icon: `AlertTriangle` amber instead of Trash red
- Title: *"Overwrite all project data?"*
- Body: *"Importing this file will replace all current projects and data. This cannot be undone. Make sure you have a current export backup before proceeding."*
- Confirm button: `bg-amber-600` "Yes, Import and Overwrite"

### v0.dev Prompt — M-02 Delete Confirmation Modal

```
Create a React confirmation modal using Tailwind CSS for a 
destructive delete action in "Implementation Wizard".

Overlay: bg-black/50 fixed inset-0 flex items-center 
justify-center z-50

Modal: bg-white rounded-xl shadow-xl p-6 w-[400px] 
flex flex-col items-center text-center

Contents:
1. Icon container: w-14 h-14 bg-red-100 rounded-full 
   flex items-center justify-center mb-4
   Inside: Trash2 icon w-7 h-7 text-red-600

2. Title: "Delete Project?" text-lg font-semibold text-gray-900

3. Project name: the quoted project name in font-medium 
   text-gray-700 (e.g. "Implementation Wizard")

4. Warning text (mt-2 text-sm text-gray-500 max-w-sm leading-relaxed):
   "This action is permanent and cannot be undone. All project 
   data, step notes, and progress will be lost forever."

5. Buttons (mt-6 flex gap-3 w-full):
   - Cancel: flex-1 border border-gray-200 rounded-md py-2.5 
     text-sm font-medium text-gray-700 hover:bg-gray-50
   - Delete: flex-1 bg-red-600 hover:bg-red-700 text-white 
     rounded-md py-2.5 text-sm font-medium 
     flex items-center justify-center gap-2 (Trash2 icon)

Also create a second variant of the same modal for import 
overwrite confirmation:
- Replace Trash2 icon container with amber bg-amber-100 
  and AlertTriangle icon text-amber-600
- Title: "Overwrite all project data?"
- Body: "Importing this file will replace all current projects 
  and data. Ensure you have a recent export backup before 
  proceeding."
- Confirm button: bg-amber-600 hover:bg-amber-700 
  "Yes, Import and Overwrite" (with Upload icon)

Show both variants side by side. Use Lucide React icons.
```

---

---

## M-03 — Blocked Reason Entry

### Layout Description

This is **not a modal** — it is an inline field that appears within the Step Detail Panel (S-03) when the user clicks `[⚠ Blocked]`. It slides in below the status buttons.

```
── Status Controls ────────────────────────────────────────────
  [Pending]  [● In Progress]  [✓ Complete]  [⚠ Blocked] ← active

── Blocked Reason (required) ──────────────────────────────────
  ┌──────────────────────────────────────────────────────────┐
  │ bg-amber-50 rounded-lg border border-amber-200 p-4 mt-3  │
  │                                                          │
  │  ⚠ Reason for blocking this step                        │
  │  text-sm font-medium text-amber-800                      │
  │  "A reason is required before this step can be           │
  │   marked as blocked."                                    │
  │  text-xs text-amber-600 mt-1                             │
  │                                                          │
  │  ┌──────────────────────────────────────────────────┐   │
  │  │ e.g. "Waiting for client to provide access to    │   │
  │  │ the repository before scaffolding can begin."    │   │
  │  │                                                  │   │
  │  │ textarea border border-amber-300 bg-white        │   │
  │  │ rounded-md p-3 text-sm rows-3 w-full             │   │
  │  │ focus:ring-2 focus:ring-amber-500                │   │
  │  └──────────────────────────────────────────────────┘   │
  │                                                          │
  │  [Cancel]          [Save & Mark Blocked]                 │
  │  btn-ghost-sm      btn-amber-600 w-auto                  │
  └──────────────────────────────────────────────────────────┘
```

**Behaviour:** `[Save & Mark Blocked]` button is disabled (grayed out) until at least one character is entered. `[Cancel]` reverts status selection to prior state.

### v0.dev Prompt — M-03 Blocked Reason Inline Field

```
Create a React inline blocked-reason form component using 
Tailwind CSS for "Implementation Wizard". This appears inside 
a step detail panel after a user selects "Blocked" status.

Component: appears below the status buttons with a smooth 
slide-down animation (use a div with transition-all).

Structure: bg-amber-50 border border-amber-200 rounded-lg 
p-4 mt-3

Contents:
1. Header row (flex items-start gap-2):
   AlertTriangle icon w-4 h-4 text-amber-500 mt-0.5
   Column: 
     "Reason for blocking" text-sm font-semibold text-amber-800
     "A reason is required before this step can be marked blocked." 
     text-xs text-amber-600 mt-0.5

2. Textarea (mt-3):
   w-full border border-amber-300 bg-white rounded-md px-3 py-2.5 
   text-sm text-gray-700 rows=3 resize-none
   focus:outline-none focus:ring-2 focus:ring-amber-400 
   focus:border-transparent
   placeholder="Describe what is blocking this step..."

3. Buttons (mt-3 flex justify-end gap-2):
   Cancel: text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5
   Save: bg-amber-600 hover:bg-amber-700 text-white text-sm 
   font-medium px-4 py-1.5 rounded-md 
   flex items-center gap-1.5 (Save icon)
   
   The Save button should appear DISABLED (opacity-50 
   cursor-not-allowed bg-amber-400) when the textarea is empty, 
   and ENABLED when text is present.

Show two states: empty (Save disabled) and with text entered 
(Save enabled). Use Lucide React icons.
```

---

---

## M-04 — Export / Import Controls

### Layout Description

Export is triggered directly from the `[↑ Export]` AppShell button — no modal needed. A toast notification confirms success.

Import triggers a file picker. After file selection, the schema is validated. If valid, M-02 (import overwrite variant) is shown. If invalid, an error toast is shown.

```
── Export Flow ────────────────────────────────────────────────────
  Click [↑ Export] in AppShell
  → JSON file downloads immediately
  → Toast (bottom-right): 
    ┌──────────────────────────────────────────────┐
    │ ✓  Backup downloaded                         │
    │    implementation-wizard-backup-             │
    │    2026-03-08.json                           │
    │    text-sm text-gray-700                     │
    │    bg-white border border-gray-200           │
    │    shadow-lg rounded-lg p-4 w-80             │
    └──────────────────────────────────────────────┘
    Auto-dismisses after 4 seconds.

── Import Flow ────────────────────────────────────────────────────
  Click [↓ Import] in AppShell
  → Hidden <input type="file" accept=".json"> triggered
  → File selected by user
  → Schema validation runs (Ajv)
  
  If VALID:
  → M-02 (Import overwrite variant) shown
  → User confirms → data imported → success toast
    ┌──────────────────────────────────────────────┐
    │ ✓  Data imported successfully                │
    │    3 projects restored.                      │
    └──────────────────────────────────────────────┘

  If INVALID (schema mismatch or corrupted):
  → Error toast (no modal needed):
    ┌──────────────────────────────────────────────┐
    │ ✗  Import failed                             │
    │    This file is not a valid backup.          │
    │    Please check the file and try again.      │
    │    bg-red-50 border border-red-200           │
    │    text-red-700                              │
    └──────────────────────────────────────────────┘
```

### Toast Component Specification

All toasts appear bottom-right, stack vertically (newest on top), auto-dismiss after 4 seconds, with an `✕` close button.

| Type | Icon | Background | Border | Text |
|---|---|---|---|---|
| Success | `CheckCircle2` emerald | `bg-white` | `border-emerald-200` | `text-gray-900` |
| Error | `XCircle` red | `bg-red-50` | `border-red-200` | `text-red-700` |
| Warning | `AlertTriangle` amber | `bg-amber-50` | `border-amber-200` | `text-amber-800` |
| Info | `Info` blue | `bg-blue-50` | `border-blue-200` | `text-blue-800` |

### v0.dev Prompt — M-04 Toast Notification System

```
Create a React toast notification system using Tailwind CSS for 
"Implementation Wizard".

Design: toasts appear in the bottom-right corner of the viewport 
(fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end).

Each toast is: bg-white border rounded-lg shadow-lg p-4 
w-80 flex items-start gap-3 min-h-16 
animate-in (slide-in-from-right) duration-300.

Show four toast variants:

1. SUCCESS toast (border-emerald-200):
   - Icon container: w-8 h-8 bg-emerald-100 rounded-full 
     flex items-center justify-center flex-shrink-0
     CheckCircle2 icon w-4 h-4 text-emerald-600
   - Content: "Backup downloaded" text-sm font-semibold 
     text-gray-900, "implementation-wizard-backup-2026-03-08.json" 
     text-xs text-gray-500 mt-0.5 truncate
   - X close button: ml-auto text-gray-400 hover:text-gray-600 
     flex-shrink-0 (X icon w-4 h-4)

2. ERROR toast (border-red-200 bg-red-50):
   - XCircle icon bg-red-100 text-red-600
   - "Import failed" text-sm font-semibold text-red-900
   - "This file is not a valid backup." text-xs text-red-700 mt-0.5

3. WARNING / INFO toast for the BR-10 sequence warning 
   (border-amber-200 bg-amber-50):
   - AlertTriangle icon bg-amber-100 text-amber-600
   - "Sequence warning" text-sm font-semibold text-amber-900
   - "Step 6 was In Progress when Step 5 was marked complete. 
     Review the checklist." text-xs text-amber-700 mt-0.5

4. COPY CONFIRMED toast (border-blue-200 bg-blue-50):
   - Copy icon bg-blue-100 text-blue-600
   - "Prompt copied" text-sm font-semibold text-blue-900
   - "Ready to paste into Claude Web." text-xs text-blue-700 mt-0.5

Add a thin progress bar at the bottom of each toast 
(h-1 bg-gray-200 rounded-full mt-2) with a filled portion 
(bg-indigo-400) animating from 100% to 0% over 4 seconds to 
indicate auto-dismiss timing.

Use Lucide React icons. Make it production-ready.
```

---

---

## Navigation Flow — Complete Map

```
App Launch
    │
    ▼
Dashboard (S-01) ◄───────────────────────────────────┐
    │                                                 │
    ├── [+ New Project] → M-01 Create Modal ──────────┤
    │       └── [Create] → ProjectView (S-02/S-03)    │
    │                                                 │
    ├── [Click Project Card] → ProjectView (S-02) ────┤
    │       └── [Click Step Row] → S-03 (Step Detail) │
    │           └── [← Dashboard] → Dashboard ────────┤
    │                                                 │
    ├── [Archived] → ArchivedView (S-04) ─────────────┤
    │       └── [Restore] → Dashboard ────────────────┤
    │       └── [Delete] → M-02 → Dashboard ──────────┘
    │
    ├── [Export] → Direct download + Toast
    └── [Import] → File picker → M-02 → Toast
```

---

## Colour Reference — Tailwind Classes

| Purpose | Class |
|---|---|
| Primary button | `bg-indigo-600 hover:bg-indigo-700 text-white` |
| Primary outline | `border border-indigo-600 text-indigo-600 hover:bg-indigo-50` |
| Active step row | `bg-indigo-50 border-l-4 border-indigo-500` |
| Active step text | `text-indigo-900 font-semibold` |
| Complete status | `bg-emerald-100 text-emerald-700` |
| In Progress status | `bg-blue-100 text-blue-700` |
| Blocked status | `bg-amber-100 text-amber-700` |
| Pending status | `bg-gray-100 text-gray-500` |
| Danger button | `bg-red-600 hover:bg-red-700 text-white` |
| Card surface | `bg-white border border-gray-200 rounded-lg shadow-sm` |
| Page background | `bg-gray-50` |
| Section label | `text-xs font-semibold uppercase tracking-wide text-gray-500` |
| Prompt code block | `bg-gray-900 text-gray-100 font-mono text-xs` |

---

*End of Document — 04-wireframes.md v1.0*

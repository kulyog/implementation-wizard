# Implementation Wizard
## Final Documentation — Version 1.0

| Field | Detail |
|---|---|
| **Document** | final-documentation.md |
| **Prepared By** | Trainer Persona — Step 21 of 24 |
| **Date** | 2026-03-08 |
| **App URL** | https://kulyog.github.io/implementation-wizard/ |
| **Audience** | Owner — solo finance professional |

---

## What Is Implementation Wizard?

Implementation Wizard is a personal productivity tool you built for yourself. It solves one specific problem: when you are building multiple software applications using AI assistance, it is easy to lose track of where you are, which AI tool to use next, and what the right prompt is for the current step.

The app gives you a single place to manage every project you are building — one screen per project, a clear 24-step checklist, and (once prompts are authored) the exact text to paste into Claude at every stage.

**What it is not:** It is not a project management tool for teams, not a task tracker for your freelance work, and not connected to any server or subscription. Everything lives in your browser. It is yours completely.

---

## Accessing the App

Open your browser and go to:

**https://kulyog.github.io/implementation-wizard/**

Bookmark this URL. That is the only way to access the app — there is no login, no account, no app to install. It opens and is ready immediately.

The app works on any modern desktop browser. Chrome is recommended. It is not optimised for mobile phones or tablets.

> **One important habit to build from day one:** Export your data regularly. The app stores everything in your browser's local storage. If you clear your browser data, use a different browser, or switch computers, your projects will not be there. Export is your backup. See the Backup section below.

---

## The Dashboard — Your Starting Point

When you open the app, you see the Dashboard. This is your command centre — one card per active project.

Each project card shows you:

- **Project name and description** — what you called it and what it is
- **Step strip** — a row of 24 coloured blocks showing the status of every step at a glance (grey = not started, blue = in progress, green = complete, amber = blocked)
- **Next action banner** — a sentence telling you exactly what to do next on this project
- **Created date and overall status** — when you started it and whether it is Active or Complete

At the top right of the Dashboard you have two important buttons: **Export** (saves a backup file to your computer) and **Import** (restores from a backup file). These are always visible no matter which view you are in.

---

## Managing Your Projects

### Creating a Project

Click **+ New Project** on the Dashboard. Enter a project name (required, up to 100 characters) and an optional short description (up to 500 characters). Click **Create Project**. The app immediately creates the project with all 24 steps ready and waiting in Pending status.

Give projects clear, specific names. "Stock Screener MVP" is better than "Project 1" — you will thank yourself in three months when you have six projects on the board.

### Switching Between Projects

Click any project card on the Dashboard to open it. To return to the Dashboard from inside a project, click **← Dashboard** in the top navigation bar, or click the **⚡ Implementation Wizard** title on the far left.

### Renaming a Project

Inside any project, click **Rename** in the project header. Type the new name and save. The new name appears everywhere immediately.

### Duplicating a Project

If you want to use one project as a template for another, open it and click **Duplicate**. A new project is created with the same name (with "(Copy)" added) and the same description, but all 24 steps are reset to Pending. Notes, timestamps, and blocked reasons are not copied — you start fresh.

### Archiving a Project

When a project is done and you want it off your active Dashboard without deleting it, click **Archive**. The project disappears from the Dashboard but all its data is preserved. You can view archived projects by clicking **Archived** on the Dashboard, and you can restore any archived project back to active at any time.

### Deleting a Project

Click **Delete** inside a project. You will be asked to confirm — this is permanent. There is no undo. If in doubt, archive instead of delete.

---

## Working Through a Project — The Step Tracker

### The Split-Screen Layout

When you open a project, the screen divides into two panels:

- **Left panel (35%)** — the 24-step checklist. Every step is listed here with its current status shown by colour and icon.
- **Right panel (65%)** — the step detail panel. Click any step in the left panel to open its full details here.

The **active step** — the one you should be working on now — is highlighted in indigo with a left border. That highlight tells you immediately where to focus.

### Understanding Step Statuses

Every step has one of four statuses, shown as coloured badges:

| Status | Colour | Meaning |
|---|---|---|
| **Pending** | Grey | Not started yet |
| **In Progress** | Blue | You have begun working on this step |
| **Complete** | Green | This step is done |
| **Blocked** | Amber | Something is stopping you — a reason is required |

### Updating a Step's Status

Click a step in the left panel to open it. In the right panel, you will see four buttons under **Update Status**. Click the status that applies. The only rule: you cannot mark a step **Complete** until all the steps before it are also Complete (with one exception — see Steps 5 and 6 below).

You can mark any step **In Progress** at any time without restriction. This is useful for flagging that you have started thinking about something even if the prior step is not quite done.

### The Steps 5 and 6 Parallel Exception

Steps 5 (UI Expert) and 6 (QC Analyst) are the only two steps in the entire process that can be done simultaneously. Once Step 4 is Complete, you can complete Step 5 and Step 6 in any order — you do not have to wait for one before starting the other. This is intentional: the wireframes and test cases can be produced in parallel sessions.

### Blocking a Step

If something outside your control is stopping you from progressing a step, mark it **Blocked**. The app will ask you for a reason — you must enter at least a few words before the status is saved. This forces you to record *why* you are stuck, which is useful when you come back to it later.

When you unblock a step (by changing it back to Pending or In Progress), the blocked reason is automatically moved into the step's Notes so you have a permanent record of what happened.

### The Step Detail Panel — Everything in One Place

When you click a step, the right panel shows you everything you need:

- **Step number and name** — where you are in the 24-step sequence
- **Actor badge** — whether this step is done by *You*, *Claude Web*, or *Claude Code*
- **Status badge** — the current status
- **Timestamps** — when you started and when you completed
- **Elapsed time** — a live counter for steps In Progress; a fixed duration for completed steps
- **Description** — a plain-English explanation of what this step involves
- **Expected output** — what a successful result looks like
- **Linked documents** — which /docs files this step produces or uses
- **AI Prompt** — the prompt to paste into Claude (once real prompts are authored — currently showing placeholders)
- **Copy Prompt button** — one click copies the full prompt to your clipboard. Keyboard shortcut: **Ctrl+Shift+C** (Windows) or **Cmd+Shift+C** (Mac)
- **Notes** — a free-text area for you to paste Claude's output, record decisions, note file paths, or write anything relevant. Auto-saves as you type.

### The Notes Field — Your Most Important Habit

The Notes field is where the real value accumulates. Use it to:

- Paste the full output from each Claude session so you have it permanently recorded
- Note any decisions you made and why
- Record the file path where you saved a document
- Flag anything that will matter when you review this project later

There is no length limit. Paste as much as you like.

---

## The Document Tracker

At the bottom of the left panel inside any project is the **Document Tracker**. This shows you the status of the key specification files that your project produces — things like `01-functional-requirements.md`, `02-technical-specifications.md`, and so on.

Each file shows one of three statuses:

- **Pending** — the step that produces this file has not been completed yet
- **Created** — the step is complete, so the file should exist in your /docs folder
- **Noted** — you have manually confirmed the file exists and added a note (like the file path)

When you complete a step, its linked documents automatically move from Pending to Created. You do not need to update them manually. You can click a file entry to add a note — for example, the exact file path or the version number.

---

## Backing Up and Restoring Your Data

### Why This Matters

All your project data lives in your browser's local storage. This is convenient — no account needed, no server, instant access — but it has one limitation: if you clear your browser cache, switch browsers, or use a different computer, your data will not be there. **Export is your only safety net.**

Make it a habit to export after every working session. The file is small and takes two seconds to create.

### How to Export

Click **↑ Export** in the top navigation bar. Your browser immediately downloads a file named something like `implementation-wizard-backup-2026-03-08.json`. Save it somewhere safe — a folder in your Google Drive, Dropbox, or a dedicated backups folder on your computer.

The export includes every project — active and archived — with all steps, notes, timestamps, and statuses fully preserved.

### How to Import (Restore)

Click **↓ Import** in the top navigation bar. Select the backup JSON file from your computer. The app will show a warning that importing will replace all current data. Confirm, and your projects are restored exactly as they were when the backup was made.

> **Important:** Import overwrites everything. If you have made progress since your last backup and you import an older file, you will lose the progress made since that backup. Always export before importing if you want to keep recent work.

### Recommended Backup Routine

- Export at the end of every working session.
- Keep the last three backup files (rename them with a date if needed).
- Before switching computers or clearing browser data, always export first.

---

## The 24-Step Process — Complete Reference

Every project you build using this framework follows the same 24 steps. The sequence is fixed and enforced by the app. Here is what each step involves and who does it.

---

### Phase 1 — Define and Specify (Steps 1–6)

**Step 1 — Define Business Requirements** *(You)*
You write down in plain language what the software should do, who will use it, and why you are building it. This is a personal narrative, not a technical document. No AI involved at this stage.

**Step 2 — Run Domain Expert Persona** *(Claude Web)*
You open Claude Web and use the Domain Expert persona prompt. Claude takes your requirements narrative and produces a structured functional requirements document (`01-functional-requirements.md`) covering features, business rules, user roles, and data needs.

**Step 3 — Run AI Expert Persona** *(Claude Web)*
You run the AI Expert persona. Claude reviews the functional requirements and produces a set of recommendations (`03-ai-recommendations.md`) for which AI tools to use during the build — covering speed, quality controls, and user experience improvements.

**Step 4 — Run Technical Architect Persona** *(Claude Web)*
You run the Technical Architect persona. Claude reads both previous documents and produces the full technical specification (`02-technical-specifications.md`) — tech stack decisions, database schema, sprint plan, security considerations.

**Step 5 — Run UI Expert Persona** *(Claude Web)*  ⟵ *Can run parallel with Step 6*
You run the UI Expert persona. Claude reads the technical specification and produces detailed wireframes and screen designs (`04-wireframes.md`), including ready-to-use prompts for v0.dev to generate the actual component code.

**Step 6 — Run QC Analyst Persona** *(Claude Web)*  ⟵ *Can run parallel with Step 5*
You run the QC Analyst persona. Claude produces the complete test case document (`05-test-cases.md`) covering functional, business rule, edge case, negative, UI, and data integrity tests.

---

### Phase 2 — Review (Step 7)

**Step 7 — Review All Docs** *(You)*
You read through all five specification documents. You look for gaps, contradictions, and anything that does not match your original intention. You raise any corrections before a single line of code is written. This step is the last chance to change course cheaply.

---

### Phase 3 — Build (Steps 8–14)

**Step 8 — Scaffold Project** *(Claude Code)*
Claude Code sets up the project structure — creating all folders, installing dependencies, creating the initial files. The output is a working, empty shell of the application that builds without errors.

**Step 9 — Build Sprint 1** *(Claude Code)*
Claude Code builds the core foundation: data persistence, business rule enforcement, step navigation, and the basic UI. At the end of this sprint the app is functional but unstyled.

**Step 10 — Test Sprint 1** *(You)*
You manually test everything that was built in Sprint 1 against the relevant test cases. You record any failures. You either fix them before Sprint 2 or add them to a known issues list.

**Step 11 — Build Sprint 2** *(Claude Code)*
Claude Code builds the remaining features: project management (rename, archive, delete, duplicate), the document tracker, visual polish, export/import.

**Step 12 — Test Sprint 2** *(You)*
Manual test of Sprint 2 output. Same approach as Step 10.

**Step 13 — Build Sprint 3** *(Claude Code)*
Claude Code completes the final layer: tooltips, the step-status strip chart, the next action banner, live timer, and deployment preparation.

**Step 14 — Test Sprint 3** *(You)*
Final pre-audit manual test. You verify the complete application against the full test case document.

---

### Phase 4 — Quality and Audit (Steps 15–20)

**Step 15 — Run Auditor Persona** *(Claude Web)*
You run the Auditor persona. Claude reviews all specification documents and the delivered code structure and produces `audit-report.md` — a critical assessment of every gap between the specification and the delivered application.

**Step 16 — Review Audit Report** *(You)*
You read the audit report and decide which findings to fix, which to accept, and in what order.

**Step 17 — Resolve Critical Findings** *(Claude Code)*
Claude Code fixes everything flagged as Critical in the audit. No deployment can happen until this step is complete.

**Step 18 — Resolve Major Findings** *(Claude Code)*
Claude Code addresses the Major findings — either fixing them or formally accepting them with documented rationale.

**Step 19 — Re-run Auditor Persona** *(Claude Web)*
You run the Auditor persona again. Claude produces `audit-report-v2.md`. The target is a score of 80 or above and a GO or Conditional GO verdict.

**Step 20 — Final Review and Sign-Off** *(You)*
You review the re-audit report, confirm all mandatory conditions are met, and make the personal decision to proceed to deployment.

---

### Phase 5 — Release (Steps 21–24)

**Step 21 — Run Trainer Persona** *(Claude Web)*
You run the Trainer persona. Claude produces the three documents in the /releases/ folder: this document, the FAQ, and the personal completion note.

**Step 22 — Prepare Release Package** *(You)*
You collect all the documents, confirm the /releases/ folder is complete, and prepare the final build artefact for deployment.

**Step 23 — Deploy** *(Claude Code)*
Claude Code executes the deployment — building the application and pushing it to GitHub Pages. A live URL is confirmed.

**Step 24 — Post-Launch Review** *(You)*
One to two weeks after launch, you sit with the live application and review what worked well, what you would do differently next time, and what to build next. You then mark the project Complete.

---

## Known Limitations in Version 1.0

These are intentional limitations — not bugs. They may be addressed in a future version.

**Prompts are currently placeholders.** The AI Prompt field in every step currently shows placeholder text. Real prompts need to be authored and embedded in the code before the app delivers its full value. This is the single most important task after deployment.

**Data lives only in your browser.** If you clear browser data or use a different device, your projects are gone unless you have a backup. Export regularly.

**Desktop only.** The app is designed for a desktop browser at 1280px width or wider. It is not optimised for phone or tablet use.

**No undo.** Delete is permanent. Archive is reversible. When in doubt, archive.

**Single user only.** The app has no login and no concept of multiple users. It is built entirely for you.

---

*End of final-documentation.md — Implementation Wizard v1.0*

# 05 — Test Cases
## Implementation Wizard

| Field | Detail |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Draft — For Owner Review |
| **Prepared By** | QC Analyst Persona |
| **Date** | 2026-03-08 |
| **Input Documents** | 02-technical-specifications.md v1.1 (Final), 04-wireframes.md v1.0 |

---

## Test Case Structure

Each test case contains:

| Field | Description |
|---|---|
| **Test ID** | Unique identifier (category prefix + sequence number) |
| **Category** | FN = Functional, BR = Business Rule, EC = Edge Case, NG = Negative, UI = UI Validation, DI = Data Integrity |
| **Test Name** | Short descriptive title |
| **Preconditions** | State the system must be in before execution |
| **Steps** | Numbered actions to perform |
| **Expected Result** | What must be true for the test to pass |
| **Priority** | High / Medium / Low |

---

## Priority Rules

- All **Data Integrity** (DI) tests: **High** — mandatory, per QC constraints
- All **Business Rule** (BR) tests: **High** — mandatory, per QC constraints
- **Functional** tests for core workflow: **High**
- **Functional** tests for secondary features: **Medium**
- **Edge Case** tests: **Medium** unless data-safety-related
- **Negative** tests: **High** for data-destructive paths, **Medium** otherwise
- **UI Validation** tests: **Medium** unless accessibility/clarity-critical

---

## Summary Count

| Category | Count |
|---|---|
| Functional (FN) | 22 |
| Business Rule (BR) | 14 |
| Edge Case (EC) | 12 |
| Negative (NG) | 12 |
| UI Validation (UI) | 12 |
| Data Integrity (DI) | 10 |
| **Total** | **82** |

---

---

# CATEGORY 1 — FUNCTIONAL TESTS

*One test per feature F-01 through F-22.*

---

### FN-01 — Create New Project

| Field | Detail |
|---|---|
| **Test ID** | FN-01 |
| **Category** | Functional |
| **Feature** | F-01 — Create Project |
| **Priority** | High |

**Preconditions:** Application is open on the Dashboard. No projects exist.

**Steps:**
1. Click the `[+ New Project]` button.
2. In the Create Project modal (M-01), enter the name `"Stock Screener MVP"`.
3. Enter the description `"A stock screener built with AI assistance"`.
4. Click `[Create Project]`.

**Expected Result:**
- Modal closes.
- Dashboard shows a new project card for `"Stock Screener MVP"`.
- Navigating to the project shows exactly 24 steps, all in `Pending` status.
- The project's `status` is `active`.
- `created_at` is set to the current timestamp.
- localStorage key `iw-data` contains the new project record.

---

### FN-02 — View All Projects on Dashboard

| Field | Detail |
|---|---|
| **Test ID** | FN-02 |
| **Category** | Functional |
| **Feature** | F-02 — View All Projects (Dashboard) |
| **Priority** | High |

**Preconditions:** Three active projects exist with varying step progress.

**Steps:**
1. Navigate to the Dashboard.
2. Observe the project card grid.
3. Observe the summary bar above the cards.

**Expected Result:**
- All three active projects are shown as individual cards.
- Each card displays: project name, description, step-status strip chart, next action banner, created date, and status badge.
- Summary bar correctly shows `3 Active`, the count of Complete, and the count of Blocked projects.
- No archived projects appear on the Dashboard.

---

### FN-03 — Switch Between Projects

| Field | Detail |
|---|---|
| **Test ID** | FN-03 |
| **Category** | Functional |
| **Feature** | F-03 — Switch Between Projects |
| **Priority** | High |

**Preconditions:** Two projects exist — `"Project Alpha"` (3 steps complete) and `"Project Beta"` (0 steps complete). Currently viewing `"Project Alpha"`.

**Steps:**
1. Click `[← Dashboard]` in the AppShell breadcrumb.
2. Click the `"Project Beta"` card on the Dashboard.

**Expected Result:**
- Dashboard renders correctly after returning from Project Alpha.
- Clicking Project Beta loads `ProjectView` showing Project Beta's name, description, and its own 24-step checklist (all Pending).
- No data from Project Alpha is visible in Project Beta's view.

---

### FN-04 — Archive and Delete Project

| Field | Detail |
|---|---|
| **Test ID** | FN-04 |
| **Category** | Functional |
| **Feature** | F-04 — Archive / Delete Project |
| **Priority** | High |

**Preconditions:** Two projects exist — `"Archive Me"` and `"Delete Me"`. Both are active.

**Steps (Archive):**
1. Open `"Archive Me"` project.
2. Click `[Archive]` in the project header.
3. Confirm in the confirmation modal.
4. Observe the Dashboard.

**Steps (Delete):**
5. Open `"Delete Me"` project.
6. Click `[Delete]` in the project header.
7. Confirm in the delete confirmation modal (M-02).
8. Observe the Dashboard.

**Expected Result:**
- `"Archive Me"` no longer appears on the Dashboard. It appears in the Archived Projects view. Its data is fully preserved.
- `"Delete Me"` no longer appears on the Dashboard or in the Archived view. It is permanently removed from localStorage.

---

### FN-05 — Rename Project

| Field | Detail |
|---|---|
| **Test ID** | FN-05 |
| **Category** | Functional |
| **Feature** | F-05 — Project Rename |
| **Priority** | Medium |

**Preconditions:** A project named `"Old Name"` exists and is open.

**Steps:**
1. Click `[Rename]` in the project header.
2. Clear the existing name and type `"New Name"`.
3. Confirm the rename (press Enter or click a save button).
4. Navigate back to the Dashboard.

**Expected Result:**
- The project header displays `"New Name"`.
- The Dashboard card shows `"New Name"`.
- localStorage reflects the updated `project_name`.
- The `project_id` and all step data are unchanged.

---

### FN-06 — View 24-Step Checklist

| Field | Detail |
|---|---|
| **Test ID** | FN-06 |
| **Category** | Functional |
| **Feature** | F-06 — 24-Step Checklist View |
| **Priority** | High |

**Preconditions:** A project exists with steps 1–4 Complete, step 5 In Progress, steps 6–24 Pending.

**Steps:**
1. Open the project.
2. Observe the left-panel step checklist.

**Expected Result:**
- Exactly 24 step rows are displayed.
- Steps 1–4 show a `✓` (emerald) complete icon and `Complete` badge.
- Step 5 shows a `●` (blue) in-progress icon and `In Progress` badge.
- Steps 6–24 show a `○` (gray) pending icon and `Pending` badge.
- Step 5 row is visually highlighted with `bg-indigo-50` and a left border in `indigo-500`.
- Each row shows the step number, step name, and actor badge.

---

### FN-07 — Open Step Detail Panel

| Field | Detail |
|---|---|
| **Test ID** | FN-07 |
| **Category** | Functional |
| **Feature** | F-07 — Step Detail Panel |
| **Priority** | High |

**Preconditions:** A project is open. No step is currently selected.

**Steps:**
1. Click on Step 3 row in the checklist.
2. Observe the right panel.

**Expected Result:**
- The right panel transitions from the empty/placeholder state to the Step Detail Panel.
- The panel shows all required fields: step number `"Step 3 of 24"`, step name, actor badge, status badge, timestamps, description, expected output, linked docs, prompt box, copy button, status controls, and notes textarea.
- The Step 3 row in the checklist becomes visually selected (indigo highlight).

---

### FN-08 — Update Step Status

| Field | Detail |
|---|---|
| **Test ID** | FN-08 |
| **Category** | Functional |
| **Feature** | F-08 — Step Status Update |
| **Priority** | High |

**Preconditions:** Steps 1–4 are Complete. Step 5 is Pending. Step 5 is open in the detail panel.

**Steps:**
1. Click `[● In Progress]` status button for Step 5.
2. Observe the step row and detail panel.
3. Click `[✓ Complete]` status button for Step 5.
4. Observe the step row and detail panel.

**Expected Result:**
- After step 1: Step 5 status badge changes to `In Progress` (blue). Step row reflects the change. `started_at` is populated with the current timestamp. Timer starts.
- After step 3: Step 5 status badge changes to `Complete` (emerald). `completed_at` is populated. Timer shows the fixed elapsed duration.
- All changes persist on browser refresh.

---

### FN-09 — Sequential Step Enforcement

| Field | Detail |
|---|---|
| **Test ID** | FN-09 |
| **Category** | Functional |
| **Feature** | F-09 — Sequential Enforcement |
| **Priority** | High |

**Preconditions:** A new project exists with all steps Pending. Step 3 is open in the detail panel.

**Steps:**
1. Attempt to click `[✓ Complete]` on Step 3 while steps 1 and 2 are Pending.
2. Observe whether the action is permitted.

**Expected Result:**
- The `[✓ Complete]` button is disabled (grayed out / non-clickable) for Step 3.
- A tooltip or inline message explains that prior steps must be completed first.
- No status change occurs in the data.

---

### FN-10 — Blocked Step Requires Reason

| Field | Detail |
|---|---|
| **Test ID** | FN-10 |
| **Category** | Functional |
| **Feature** | F-10 — Blocked Step Reason |
| **Priority** | High |

**Preconditions:** A project is open. Step 1 is Pending. Step 1 is open in the detail panel.

**Steps:**
1. Click `[⚠ Blocked]` status button.
2. Observe the blocked reason field that appears.
3. Leave the reason field empty and attempt to click `[Save & Mark Blocked]`.
4. Enter `"Waiting for client feedback"` in the reason field.
5. Click `[Save & Mark Blocked]`.

**Expected Result:**
- After step 3: The `[Save & Mark Blocked]` button remains disabled. The step status has not changed.
- After step 5: The step status changes to `Blocked`. The amber reason field disappears. The `blocked_reason` field in localStorage contains `"Waiting for client feedback"`.

---

### FN-11 — Active Step Highlight

| Field | Detail |
|---|---|
| **Test ID** | FN-11 |
| **Category** | Functional |
| **Feature** | F-11 — Active Step Highlight |
| **Priority** | Medium |

**Preconditions:** A project has steps 1–5 Complete and steps 6–24 Pending.

**Steps:**
1. Open the project view.
2. Observe which step row is highlighted in the checklist.

**Expected Result:**
- Step 6 (the lowest-numbered non-Complete step) is highlighted with `bg-indigo-50` background and an indigo left border.
- No other step rows have the active highlight styling.
- Steps 1–5 show complete styling. Steps 7–24 show pending styling.

---

### FN-12 — Docs File Registry Display

| Field | Detail |
|---|---|
| **Test ID** | FN-12 |
| **Category** | Functional |
| **Feature** | F-12 — /docs File Registry |
| **Priority** | Medium |

**Preconditions:** A project exists with step 2 Complete and all other steps Pending.

**Steps:**
1. Open the project view.
2. Scroll to the Doc Tracker section at the bottom of the left panel.

**Expected Result:**
- The Doc Tracker shows the expected /docs files for the project.
- `01-functional-requirements.md` shows a `created` status badge (because step 2 is linked to it and step 2 is Complete).
- All other listed files show `pending` status.

---

### FN-13 — File Status Indicator Transitions

| Field | Detail |
|---|---|
| **Test ID** | FN-13 |
| **Category** | Functional |
| **Feature** | F-13 — File Status Indicators |
| **Priority** | Medium |

**Preconditions:** A project exists with step 4 Pending (linked to `02-technical-specifications.md`).

**Steps:**
1. Open step 4 and mark it as Complete.
2. Observe the Doc Tracker.
3. Find the `02-technical-specifications.md` entry and manually change its status to `noted`.
4. Enter a note: `"/docs/02-technical-specifications.md — v1.1 Final"`.

**Expected Result:**
- After step 1: `02-technical-specifications.md` auto-transitions from `pending` to `created`.
- After step 3–4: Status shows `noted` and the note text is saved.
- Changes persist on refresh.

---

### FN-14 — File Notes Entry

| Field | Detail |
|---|---|
| **Test ID** | FN-14 |
| **Category** | Functional |
| **Feature** | F-14 — File Notes |
| **Priority** | Low |

**Preconditions:** A project exists. `01-functional-requirements.md` has `created` status.

**Steps:**
1. Open the Doc Tracker.
2. Click the edit/note icon next to `01-functional-requirements.md`.
3. Enter the note: `"v1.1 Final — saved to /docs folder"`.
4. Save the note.
5. Refresh the browser.

**Expected Result:**
- The note is displayed next to the file entry.
- After refresh, the note is still present (persisted to localStorage).

---

### FN-15 — Session Persistence

| Field | Detail |
|---|---|
| **Test ID** | FN-15 |
| **Category** | Functional |
| **Feature** | F-15 — Session Persistence |
| **Priority** | High |

**Preconditions:** A project exists with steps 1–6 Complete and notes entered on step 3.

**Steps:**
1. Close the browser tab completely.
2. Reopen the browser and navigate to the application URL.
3. Open the project and check step 3.

**Expected Result:**
- All projects are present exactly as before the tab was closed.
- Step statuses (steps 1–6 Complete) are preserved.
- Notes on step 3 are preserved.
- `started_at` and `completed_at` timestamps are preserved.

---

### FN-16 — No Data Loss on Refresh

| Field | Detail |
|---|---|
| **Test ID** | FN-16 |
| **Category** | Functional |
| **Feature** | F-16 — No Data Loss on Refresh |
| **Priority** | High |

**Preconditions:** A project is open with a step In Progress and a partial note being typed.

**Steps:**
1. Type a note in the notes textarea: `"Working on this..."`.
2. Wait 1 second (for auto-save debounce).
3. Press F5 / Cmd+R to hard refresh the browser.
4. Navigate back to the same project and step.

**Expected Result:**
- The project is present and the step is still `In Progress`.
- The note `"Working on this..."` is preserved in the notes field.
- No data loss of any kind.

---

### FN-17 — Data Export

| Field | Detail |
|---|---|
| **Test ID** | FN-17 |
| **Category** | Functional |
| **Feature** | F-17 — Data Export |
| **Priority** | High |

**Preconditions:** Two active projects and one archived project exist with varied step progress.

**Steps:**
1. Click `[↑ Export]` in the AppShell.
2. Observe the browser download prompt and the downloaded file.
3. Open the JSON file in a text editor.

**Expected Result:**
- A file downloads automatically with a name matching the pattern `implementation-wizard-backup-YYYY-MM-DD.json`.
- The file is valid JSON.
- The JSON contains `export_format: "implementation-wizard-backup"`, `schema_version`, `exported_at`, and a `projects` array.
- All three projects (2 active + 1 archived) are present in the export.
- A success toast notification appears confirming the download.

---

### FN-18 — Data Import

| Field | Detail |
|---|---|
| **Test ID** | FN-18 |
| **Category** | Functional |
| **Feature** | F-18 — Data Import |
| **Priority** | High |

**Preconditions:** The application has 1 project. A valid export file from a previous session containing 3 different projects is available on disk.

**Steps:**
1. Click `[↓ Import]` in the AppShell.
2. Select the valid export file from the file picker.
3. Observe the confirmation modal (M-02 import variant).
4. Click `[Yes, Import and Overwrite]`.
5. Observe the Dashboard.

**Expected Result:**
- The overwrite confirmation modal appears with a warning before any data is changed.
- After confirming, the original 1 project is replaced by the 3 projects from the backup file.
- A success toast confirms: `"Data imported successfully. 3 projects restored."`.
- All step data, notes, statuses, and timestamps from the backup file are correctly loaded.

---

### FN-19 — Responsive Layout

| Field | Detail |
|---|---|
| **Test ID** | FN-19 |
| **Category** | Functional |
| **Feature** | F-19 — Responsive Layout |
| **Priority** | Medium |

**Preconditions:** Application is running. At least 2 projects exist.

**Steps:**
1. Open the Dashboard at 1280px viewport width.
2. Resize to 1440px.
3. Resize to 1920px.
4. Open a project at each width and verify the 35/65 split panel is usable.

**Expected Result:**
- At all three widths the Dashboard is usable without horizontal scrolling.
- At 1440px the dashboard shows 2-column card grid.
- At 1920px the dashboard shows 3-column card grid.
- The 35/65 split in ProjectView is functional at all widths.
- No content is clipped or inaccessible.

---

### FN-20 — Keyboard Shortcut — Copy Prompt

| Field | Detail |
|---|---|
| **Test ID** | FN-20 |
| **Category** | Functional |
| **Feature** | F-20 — Keyboard Shortcut |
| **Priority** | Medium |

**Preconditions:** A project is open. Step 2 is selected in the detail panel. The prompt text is a non-empty string.

**Steps:**
1. Click anywhere in the Step Detail Panel to ensure it has focus.
2. Press `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac).
3. Open a text editor and paste with `Ctrl+V`.

**Expected Result:**
- The copy button in the UI changes to `"✓ Copied!"` for approximately 2 seconds, then reverts.
- The pasted text in the text editor exactly matches the prompt text from the Step Detail Panel.
- No browser default action is triggered by the shortcut.

---

### FN-21 — Duplicate Project

| Field | Detail |
|---|---|
| **Test ID** | FN-21 |
| **Category** | Functional |
| **Feature** | F-21 — Duplicate Project |
| **Priority** | Medium |

**Preconditions:** A project named `"Base Project"` exists with steps 1–8 Complete, notes on step 3, and a blocked reason on step 6.

**Steps:**
1. Open `"Base Project"`.
2. Click `[Duplicate]` in the project header.
3. Observe the newly created project.
4. Check step 3 notes. Check step 6 status. Check step 1 status.

**Expected Result:**
- A new project is created named `"Base Project (Copy)"`.
- The new project has the same description as the original.
- All 24 steps are reset to `Pending` status.
- Notes on step 3 are **empty** (not copied).
- `started_at`, `completed_at`, `blocked_reason`, and `time_in_step_seconds` are all null / empty / 0.
- The original `"Base Project"` is unchanged.
- The duplicate has a new unique `project_id`.

---

### FN-22 — Time-in-Step Metric

| Field | Detail |
|---|---|
| **Test ID** | FN-22 |
| **Category** | Functional |
| **Feature** | F-22 — Time-in-Step Metric |
| **Priority** | Medium |

**Preconditions:** A project is open. Step 1 is Pending.

**Steps:**
1. Mark Step 1 as `In Progress`.
2. Open Step 1 in the detail panel.
3. Wait 5 seconds and observe the timer.
4. Mark Step 1 as `Complete`.
5. Observe the timer display.
6. Close and reopen Step 1.

**Expected Result:**
- After step 3: A live elapsed timer is visible (e.g. `"0h 0m 5s"`), incrementing every second.
- After step 4: The timer freezes and shows the fixed total elapsed time.
- After step 6: The completed elapsed duration is still displayed (static, not counting).
- For a Pending step: no timer is shown.
- For a Blocked step: no timer is shown.

---

---

# CATEGORY 2 — BUSINESS RULE TESTS

*All Business Rule tests are High priority.*

---

### BR-T01 — Sequential Completion: Step N Blocked by Incomplete N-1

| Field | Detail |
|---|---|
| **Test ID** | BR-T01 |
| **Category** | Business Rule |
| **Rule** | BR-01 — Sequential enforcement |
| **Priority** | High |

**Preconditions:** New project. All 24 steps Pending.

**Steps:**
1. Open Step 7 in the detail panel.
2. Attempt to click `[✓ Complete]`.

**Expected Result:**
- The `[✓ Complete]` button is disabled or produces no action.
- Step 7 remains Pending.
- No `completed_at` value is set.

---

### BR-T02 — Sequential Completion: Step N Completable When N-1 is Complete

| Field | Detail |
|---|---|
| **Test ID** | BR-T02 |
| **Category** | Business Rule |
| **Rule** | BR-01 — Sequential enforcement |
| **Priority** | High |

**Preconditions:** Steps 1–6 are all Complete. Step 7 is Pending.

**Steps:**
1. Open Step 7 in the detail panel.
2. Click `[✓ Complete]`.

**Expected Result:**
- Step 7 transitions to Complete without any error or blocking.
- `completed_at` is set for Step 7.

---

### BR-T03 — Steps 5 and 6 Parallel Exception: Complete Step 6 Before Step 5

| Field | Detail |
|---|---|
| **Test ID** | BR-T03 |
| **Category** | Business Rule |
| **Rule** | BR-01 — Parallel exception for Steps 5 and 6 |
| **Priority** | High |

**Preconditions:** Steps 1–4 are Complete. Step 5 is Pending. Step 6 is Pending.

**Steps:**
1. Open Step 6 in the detail panel.
2. Click `[✓ Complete]` on Step 6.
3. Observe the result.

**Expected Result:**
- Step 6 transitions to Complete successfully.
- The system does **not** require Step 5 to be Complete first.
- Step 5 remains Pending.
- Step 7 remains locked (step 5 must now be completed before step 7 can be completed).

---

### BR-T04 — Steps 5 and 6 Parallel Exception: Step 7 Still Locked Until Both 5 and 6 Complete

| Field | Detail |
|---|---|
| **Test ID** | BR-T04 |
| **Category** | Business Rule |
| **Rule** | BR-01 — Parallel exception boundary |
| **Priority** | High |

**Preconditions:** Steps 1–4 Complete. Step 5 Pending. Step 6 Complete (per BR-T03).

**Steps:**
1. Open Step 7 in the detail panel.
2. Attempt to click `[✓ Complete]`.

**Expected Result:**
- `[✓ Complete]` is disabled for Step 7 because Step 5 is still Pending.
- Only after Step 5 is also Complete will Step 7 become completable.

---

### BR-T05 — Project Status Auto-Set to Complete

| Field | Detail |
|---|---|
| **Test ID** | BR-T05 |
| **Category** | Business Rule |
| **Rule** | BR-02 — Project complete only when all 24 steps done |
| **Priority** | High |

**Preconditions:** Steps 1–23 are Complete. Step 24 is Pending.

**Steps:**
1. Open Step 24 and mark it as Complete.
2. Navigate to the Dashboard.
3. Observe the project card.

**Expected Result:**
- The project `status` field in localStorage is updated to `'complete'`.
- The Dashboard card shows a `Complete` status badge (emerald).
- The summary bar increments the Complete count.

---

### BR-T06 — In Progress Allowed at Any Time

| Field | Detail |
|---|---|
| **Test ID** | BR-T06 |
| **Category** | Business Rule |
| **Rule** | BR-03 — In Progress allowed without sequence |
| **Priority** | High |

**Preconditions:** A new project exists. All steps Pending.

**Steps:**
1. Open Step 10 in the detail panel (steps 1–9 are all Pending).
2. Click `[● In Progress]`.

**Expected Result:**
- Step 10 transitions to `In Progress` without any restriction.
- `started_at` is populated.
- The timer begins.
- Steps 1–9 remain Pending — no cascading effect.

---

### BR-T07 — Blocked Requires Non-Empty Reason

| Field | Detail |
|---|---|
| **Test ID** | BR-T07 |
| **Category** | Business Rule |
| **Rule** | BR-04 — Blocked reason required |
| **Priority** | High |

**Preconditions:** A project is open. Step 1 is open in the detail panel.

**Steps:**
1. Click `[⚠ Blocked]`.
2. Observe the inline reason field.
3. Leave the field empty and attempt to save.
4. Enter a single space `" "` and attempt to save.
5. Enter `"Actual reason"` and save.

**Expected Result:**
- After step 3: Save button remains disabled. Status unchanged.
- After step 4: Save button remains disabled (whitespace-only fails `.trim() === ''` check). Status unchanged.
- After step 5: Status changes to Blocked. `blocked_reason` = `"Actual reason"` in localStorage.

---

### BR-T08 — Clearing a Block Preserves Reason in Notes

| Field | Detail |
|---|---|
| **Test ID** | BR-T08 |
| **Category** | Business Rule |
| **Rule** | BR-05 — Blocked → Pending/In Progress clears block, retains reason in notes |
| **Priority** | High |

**Preconditions:** Step 3 is Blocked with reason `"API keys not available yet"`.

**Steps:**
1. Open Step 3 in the detail panel.
2. Click `[Pending]` to clear the block.
3. Observe the status, blocked reason field, and notes field.

**Expected Result:**
- Step 3 status changes to Pending.
- The `blocked_reason` field in localStorage is cleared (empty string).
- The notes field contains a system-appended entry including the previous blocked reason and a timestamp prefix, e.g. `"[Unblocked 2026-03-08 14:30] Previously blocked: API keys not available yet"`.
- The inline blocked reason field is no longer displayed.

---

### BR-T09 — Prompt Text is Read-Only

| Field | Detail |
|---|---|
| **Test ID** | BR-T09 |
| **Category** | Business Rule |
| **Rule** | BR-06 — Prompt text not user-editable |
| **Priority** | High |

**Preconditions:** A project is open. Step 2 is open in the detail panel.

**Steps:**
1. Locate the AI Prompt code block in the detail panel.
2. Attempt to click into the prompt text area and type `"Modified text"`.
3. Attempt to select the text and delete it.

**Expected Result:**
- The prompt text area does not accept keyboard input.
- The prompt text is unchanged.
- The field is rendered as a non-editable display element (`<pre>` or `readonly` textarea).
- The Copy button and keyboard shortcut still work correctly.

---

### BR-T10 — Notes Accept Free Text Without Restriction

| Field | Detail |
|---|---|
| **Test ID** | BR-T10 |
| **Category** | Business Rule |
| **Rule** | BR-07 — Notes are free-text, no restriction |
| **Priority** | High |

**Preconditions:** A project is open. Step 1 is open in the detail panel.

**Steps:**
1. Click the notes textarea.
2. Type a very long string (2,000+ characters — simulate pasting a Claude output).
3. Type special characters: `<script>alert('xss')</script>`, `"quotes"`, `& ampersand`, emoji: `🎯`.
4. Navigate away and return to Step 1.

**Expected Result:**
- All characters including HTML, special characters, and emoji are accepted and saved without truncation.
- On return, the notes field displays the exact text entered — including all special characters.
- No XSS execution occurs. The `<script>` tag is rendered as plain text.
- No length validation error is shown.

---

### BR-T11 — Delete Requires Confirmation

| Field | Detail |
|---|---|
| **Test ID** | BR-T11 |
| **Category** | Business Rule |
| **Rule** | BR-08 — Delete requires explicit confirmation |
| **Priority** | High |

**Preconditions:** A project named `"Important Project"` exists.

**Steps:**
1. Open `"Important Project"`.
2. Click `[Delete]` in the project header.
3. Observe the modal that appears.
4. Click `[Cancel]` in the modal.
5. Click `[Delete]` again.
6. This time click `[Delete Project]` in the modal.

**Expected Result:**
- After step 3: A confirmation modal appears with the project name and a destructive warning.
- After step 4: The modal closes. `"Important Project"` is still present. No data changed.
- After step 6: `"Important Project"` is permanently removed from the Dashboard and from localStorage.

---

### BR-T12 — Archived Project Removed from Dashboard

| Field | Detail |
|---|---|
| **Test ID** | BR-T12 |
| **Category** | Business Rule |
| **Rule** | BR-09 — Archive removes from dashboard, preserves data |
| **Priority** | High |

**Preconditions:** Three active projects exist. One named `"Archive Test"`.

**Steps:**
1. Archive `"Archive Test"` via the project header.
2. Confirm in the modal.
3. Observe the Dashboard.
4. Navigate to Archived Projects view.

**Expected Result:**
- `"Archive Test"` is absent from the Dashboard (only 2 active projects shown).
- `"Archive Test"` is present in the Archived Projects view.
- All step data, notes, and statuses for `"Archive Test"` are fully preserved in localStorage.
- Summary bar on Dashboard correctly shows 2 Active.

---

### BR-T13 — Warning Shown When Earlier Step Un-Completed

| Field | Detail |
|---|---|
| **Test ID** | BR-T13 |
| **Category** | Business Rule |
| **Rule** | BR-10 — Warning on out-of-sequence un-complete |
| **Priority** | High |

**Preconditions:** Steps 1–8 are all Complete.

**Steps:**
1. Open Step 3 in the detail panel.
2. Click `[Pending]` to un-complete Step 3.
3. Observe any notifications.

**Expected Result:**
- A warning toast notification appears, e.g. *"Sequence warning: Steps 4–8 were In Progress or Complete when Step 3 was un-completed. Review the checklist."*
- Step 3 status changes to Pending (the action is **not** blocked — only warned).
- Steps 4–8 statuses are **not** automatically changed.
- `completed_at` for Step 3 is cleared.

---

### BR-T14 — Restore Archived Project Returns to Dashboard

| Field | Detail |
|---|---|
| **Test ID** | BR-T14 |
| **Category** | Business Rule |
| **Rule** | BR-09 — Archive is reversible via Restore |
| **Priority** | High |

**Preconditions:** `"Archive Test"` is in the Archived Projects view.

**Steps:**
1. Navigate to the Archived Projects view.
2. Click `[Restore]` next to `"Archive Test"`.
3. Navigate to the Dashboard.

**Expected Result:**
- `"Archive Test"` disappears from the Archived view.
- `"Archive Test"` reappears on the Dashboard with `active` status.
- All step data and progress are preserved intact.

---

---

# CATEGORY 3 — EDGE CASE TESTS

---

### EC-01 — Create Project with Maximum Name Length

| Field | Detail |
|---|---|
| **Test ID** | EC-01 |
| **Category** | Edge Case |
| **Priority** | Medium |

**Preconditions:** Application is on the Dashboard.

**Steps:**
1. Open the Create Project modal.
2. Enter exactly 100 characters as the project name.
3. Click `[Create Project]`.

**Expected Result:**
- The project is created successfully with the 100-character name.
- The name is displayed (possibly truncated in the card but fully stored in localStorage).

---

### EC-02 — Create Project with Maximum Description Length

| Field | Detail |
|---|---|
| **Test ID** | EC-02 |
| **Category** | Edge Case |
| **Priority** | Low |

**Preconditions:** Application is on the Dashboard.

**Steps:**
1. Open Create Project modal.
2. Enter exactly 500 characters in the description field.
3. Click `[Create Project]`.

**Expected Result:**
- The project is created successfully.
- The full 500-character description is stored in localStorage.
- Character counter shows `500 / 500`.

---

### EC-03 — Duplicate a Completed Project

| Field | Detail |
|---|---|
| **Test ID** | EC-03 |
| **Category** | Edge Case |
| **Priority** | Medium |

**Preconditions:** A project with all 24 steps Complete exists and has `status = 'complete'`.

**Steps:**
1. Open the completed project.
2. Click `[Duplicate]`.
3. Inspect the duplicate.

**Expected Result:**
- The duplicate is created with status `active`, not `complete`.
- All 24 steps are reset to Pending.
- The original project's Complete status and data are untouched.

---

### EC-04 — Duplicate an Archived Project

| Field | Detail |
|---|---|
| **Test ID** | EC-04 |
| **Category** | Edge Case |
| **Priority** | Medium |

**Preconditions:** An archived project exists.

**Steps:**
1. Navigate to the Archived Projects view.
2. Duplicate the archived project (via kebab menu or project header if available in archived view).
3. Navigate to the Dashboard.

**Expected Result:**
- A new `active` project is created on the Dashboard with `"(Copy)"` suffix.
- The archived project remains archived and unchanged.
- The duplicate has all 24 steps reset to Pending.

---

### EC-05 — Steps 5 and 6 Both Completed Out of Order (6 then 5)

| Field | Detail |
|---|---|
| **Test ID** | EC-05 |
| **Category** | Edge Case |
| **Priority** | High |

**Preconditions:** Steps 1–4 Complete. Steps 5 and 6 Pending.

**Steps:**
1. Mark Step 6 as Complete.
2. Mark Step 5 as Complete.
3. Attempt to mark Step 7 as Complete.

**Expected Result:**
- Both Step 5 and Step 6 can be marked Complete in any order after Step 4.
- Once both are Complete, Step 7 becomes completable.
- All transitions succeed without errors.

---

### EC-06 — Very Large Notes Field (5,000+ Characters)

| Field | Detail |
|---|---|
| **Test ID** | EC-06 |
| **Category** | Edge Case |
| **Priority** | Medium |

**Preconditions:** A step is open in the detail panel.

**Steps:**
1. Paste 5,000 characters into the notes textarea (simulate a long Claude output).
2. Navigate away and return to the step.
3. Export and reimport the data.

**Expected Result:**
- All 5,000 characters are saved to localStorage without truncation.
- On return, the full notes content is displayed.
- The export file contains the full notes.
- After reimport, notes are still intact.

---

### EC-07 — Mark All 24 Steps Complete in Sequence

| Field | Detail |
|---|---|
| **Test ID** | EC-07 |
| **Category** | Edge Case |
| **Priority** | High |

**Preconditions:** A new project with all 24 steps Pending.

**Steps:**
1. Complete steps 1 through 24 in order (marking each Complete before moving to the next). Note: complete steps 5 and 6 in either order.
2. After step 24 is marked Complete, observe the project status.

**Expected Result:**
- All 24 steps show Complete (emerald) in the checklist.
- The project status auto-transitions to `complete`.
- The Dashboard shows the project as Complete with an emerald badge.
- The step-status strip chart on the Dashboard shows all 24 cells in emerald.

---

### EC-08 — Multiple Projects Open Simultaneously (Data Isolation)

| Field | Detail |
|---|---|
| **Test ID** | EC-08 |
| **Category** | Edge Case |
| **Priority** | High |

**Preconditions:** Two projects exist — `"Project A"` and `"Project B"` — both with different step progress.

**Steps:**
1. Open `"Project A"` and mark Step 1 as Complete.
2. Navigate back to the Dashboard without saving explicitly.
3. Open `"Project B"` and verify Step 1 status.

**Expected Result:**
- Step 1 in `"Project B"` is Pending (unaffected by changes to `"Project A"`).
- Step 1 in `"Project A"` shows Complete when revisited.
- Project data is fully isolated — no cross-contamination between projects.

---

### EC-09 — Rename a Project with the Same Name as an Existing Project

| Field | Detail |
|---|---|
| **Test ID** | EC-09 |
| **Category** | Edge Case |
| **Priority** | Low |

**Preconditions:** Two projects exist: `"Project A"` and `"Project B"`.

**Steps:**
1. Open `"Project A"` and rename it to `"Project B"`.

**Expected Result:**
- The system allows two projects to have the same name (no uniqueness constraint is required per specs).
- Both projects are distinguishable by their `project_id`.
- No data is lost or merged.

---

### EC-10 — Export with No Projects

| Field | Detail |
|---|---|
| **Test ID** | EC-10 |
| **Category** | Edge Case |
| **Priority** | Low |

**Preconditions:** The application has no projects (empty state).

**Steps:**
1. Click `[↑ Export]`.
2. Inspect the downloaded file.

**Expected Result:**
- A valid JSON file downloads.
- The `projects` array in the file is empty: `[]`.
- No error occurs.

---

### EC-11 — Start Timer, Close Browser, Reopen — Timer State

| Field | Detail |
|---|---|
| **Test ID** | EC-11 |
| **Category** | Edge Case |
| **Priority** | Medium |

**Preconditions:** Step 3 is In Progress with a timer showing 5 minutes elapsed.

**Steps:**
1. Note the `time_in_step_seconds` value (e.g. 300).
2. Close the browser.
3. Wait 2 minutes.
4. Reopen the application and view Step 3.

**Expected Result:**
- The timer resumes from the saved `time_in_step_seconds` value (300s) plus the elapsed time since `started_at`.
- The timer does **not** reset to zero.
- The timer does **not** add the 2 minutes the browser was closed (only active time counts — time is computed from `started_at + time_in_step_seconds` at the moment of last save).

---

### EC-12 — Import a Backup That Contains an Archived Project

| Field | Detail |
|---|---|
| **Test ID** | EC-12 |
| **Category** | Edge Case |
| **Priority** | Medium |

**Preconditions:** A valid backup file exists that contains 1 active project and 1 archived project.

**Steps:**
1. Click `[↓ Import]` and select the backup file.
2. Confirm the overwrite.
3. Navigate to the Dashboard and Archived view.

**Expected Result:**
- The active project appears on the Dashboard.
- The archived project appears in the Archived view (not on the Dashboard).
- Both projects' data is fully preserved.

---

---

# CATEGORY 4 — NEGATIVE TESTS

---

### NG-01 — Create Project with Empty Name

| Field | Detail |
|---|---|
| **Test ID** | NG-01 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** Application is on the Dashboard.

**Steps:**
1. Open the Create Project modal.
2. Leave the project name field empty.
3. Click `[Create Project]`.

**Expected Result:**
- The `[Create Project]` button is disabled (or a validation error is shown: `"Project name is required"`).
- No project is created.
- The modal remains open.

---

### NG-02 — Create Project with Name Exceeding 100 Characters

| Field | Detail |
|---|---|
| **Test ID** | NG-02 |
| **Category** | Negative |
| **Priority** | Medium |

**Preconditions:** Application is on the Dashboard.

**Steps:**
1. Open the Create Project modal.
2. Paste 101 characters into the project name field.
3. Attempt to create the project.

**Expected Result:**
- Either: input is capped at 100 characters and the 101st character is not accepted.
- Or: a validation error is shown preventing creation.
- No project with a >100-character name is created.

---

### NG-03 — Import a Non-JSON File

| Field | Detail |
|---|---|
| **Test ID** | NG-03 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** A `.txt` file and a `.csv` file are available on disk.

**Steps:**
1. Click `[↓ Import]`.
2. Select a `.txt` file.
3. Observe the result.
4. Repeat with a `.csv` file.

**Expected Result:**
- An error toast is displayed: `"Import failed. This file is not a valid backup."` (or similar).
- No overwrite confirmation modal appears.
- Existing project data is completely unchanged.

---

### NG-04 — Import a Valid JSON File With Wrong Schema

| Field | Detail |
|---|---|
| **Test ID** | NG-04 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** A valid JSON file exists but it is a generic JSON object (e.g. `{"name": "test", "value": 123}`), not an Implementation Wizard backup.

**Steps:**
1. Click `[↓ Import]` and select the invalid JSON file.
2. Observe the result.

**Expected Result:**
- Ajv schema validation fails.
- Error toast: `"Import failed. This file is not a valid Implementation Wizard backup."`.
- No overwrite confirmation modal appears.
- No data is written to localStorage. Existing projects are untouched.

---

### NG-05 — Import a Corrupted JSON File

| Field | Detail |
|---|---|
| **Test ID** | NG-05 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** A file exists named `backup.json` but its content is truncated/malformed (e.g. `{"export_format": "implementation-wizard-backup", "projects": [`).

**Steps:**
1. Click `[↓ Import]` and select the corrupted file.
2. Observe the result.

**Expected Result:**
- JSON parsing fails gracefully.
- Error toast is displayed.
- No crash, no white screen.
- Existing data is completely unchanged.

---

### NG-06 — Mark Step Complete When Previous Step is Blocked

| Field | Detail |
|---|---|
| **Test ID** | NG-06 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** Steps 1–4 Complete. Step 5 is Blocked. Step 6 is Pending.

**Steps:**
1. Open Step 6 in the detail panel.
2. Attempt to click `[✓ Complete]` on Step 6.

**Expected Result:**
- `[✓ Complete]` is disabled for Step 6 (Step 5 is not Complete — it is Blocked).
- The parallel exception for Steps 5 and 6 only applies to completion order, not to bypassing blocked dependencies.

> **Note to Developer:** Confirm whether the parallel exception (BR-01) allows Step 6 to be completed when Step 5 is Blocked (not Complete). This test assumes Blocked ≠ Complete. Clarify in `stepLogic.js` implementation.

---

### NG-07 — Delete a Project and Cancel — Data Preserved

| Field | Detail |
|---|---|
| **Test ID** | NG-07 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** A project `"Do Not Delete"` exists with 12 steps complete.

**Steps:**
1. Open `"Do Not Delete"`.
2. Click `[Delete]` in the project header.
3. In the confirmation modal, click `[Cancel]`.
4. Observe the project state.

**Expected Result:**
- The modal closes.
- `"Do Not Delete"` is still present with all 12 steps Complete.
- No data has changed.

---

### NG-08 — Attempt to Edit Prompt Text Directly

| Field | Detail |
|---|---|
| **Test ID** | NG-08 |
| **Category** | Negative |
| **Priority** | Medium |

**Preconditions:** A step is open in the detail panel.

**Steps:**
1. Right-click the prompt box and inspect the DOM element.
2. Attempt to use browser DevTools to change the prompt text in the DOM.
3. Refresh the page.

**Expected Result:**
- Any DOM manipulation does not affect the underlying `steps.js` static data or localStorage.
- After refresh, the prompt text reverts to the original value from `steps.js`.
- The application does not persist DOM-level edits to prompt text.

---

### NG-09 — Mark Blocked with Whitespace-Only Reason

| Field | Detail |
|---|---|
| **Test ID** | NG-09 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** A step is open in the detail panel. The Blocked reason field is visible.

**Steps:**
1. Click `[⚠ Blocked]` to show the reason field.
2. Enter `"     "` (five spaces) in the reason textarea.
3. Attempt to click `[Save & Mark Blocked]`.

**Expected Result:**
- The `[Save & Mark Blocked]` button remains disabled.
- `blocked_reason.trim() === ''` evaluates to true — whitespace is rejected.
- The step status remains unchanged.

---

### NG-10 — Import Overwrites Without Backup Warning

| Field | Detail |
|---|---|
| **Test ID** | NG-10 |
| **Category** | Negative |
| **Priority** | High |

**Preconditions:** The user has 5 projects with significant progress. A different backup file is available.

**Steps:**
1. Click `[↓ Import]` and select a backup file containing 2 different projects.
2. At the confirmation modal, observe the warning message.
3. Click `[Cancel]` at the confirmation modal.
4. Observe the project data.

**Expected Result:**
- The warning modal clearly states that all current data will be overwritten.
- After cancelling: all 5 original projects are still present and unchanged.
- No data is modified or lost when the user cancels the import.

---

### NG-11 — Attempt to Navigate to Archived Step View

| Field | Detail |
|---|---|
| **Test ID** | NG-11 |
| **Category** | Negative |
| **Priority** | Medium |

**Preconditions:** An archived project exists with several steps Complete.

**Steps:**
1. Navigate to the Archived Projects view.
2. Click the archived project name to open it.
3. Attempt to change a step status.

**Expected Result:**
- Archived projects are opened in a read-only view.
- Status controls are disabled or absent.
- No status change is possible on an archived project without first restoring it.

---

### NG-12 — Rename Project to Empty String

| Field | Detail |
|---|---|
| **Test ID** | NG-12 |
| **Category** | Negative |
| **Priority** | Medium |

**Preconditions:** A project named `"Valid Name"` exists.

**Steps:**
1. Open the project rename control.
2. Clear the name field entirely.
3. Attempt to save the empty name.

**Expected Result:**
- The save action is disabled or a validation error is shown: `"Project name cannot be empty"`.
- The project name remains `"Valid Name"`.
- No blank-name project is created in localStorage.

---

---

# CATEGORY 5 — UI VALIDATION TESTS

---

### UI-01 — Status Badge Colours Match Design Language

| Field | Detail |
|---|---|
| **Test ID** | UI-01 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** A project exists with steps in all four statuses: Pending, In Progress, Complete, Blocked.

**Steps:**
1. Open the project checklist.
2. Observe the status badges on each step row.

**Expected Result:**
- `Pending` badge: `bg-gray-100 text-gray-500` (neutral grey).
- `In Progress` badge: `bg-blue-100 text-blue-700` (blue).
- `Complete` badge: `bg-emerald-100 text-emerald-700` (emerald green).
- `Blocked` badge: `bg-amber-100 text-amber-700` (amber/warning).
- All badges are `rounded-full` pill style per the design language.

---

### UI-02 — Active Step Highlight Styling

| Field | Detail |
|---|---|
| **Test ID** | UI-02 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** A project has steps 1–3 Complete, step 4 as the current active step.

**Steps:**
1. Open the project.
2. Observe step 4 row in the checklist.
3. Compare step 4 styling to steps 1–3 and steps 5–24.

**Expected Result:**
- Step 4 has `bg-indigo-50` background and a left border in `border-indigo-500` (4px wide).
- Step 4 text is `text-indigo-900 font-semibold`.
- Steps 1–3 have emerald complete styling. Steps 5–24 have gray pending styling.
- No other step has the indigo active highlight.

---

### UI-03 — Copy Button Feedback (2-Second State Change)

| Field | Detail |
|---|---|
| **Test ID** | UI-03 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** A step is open in the detail panel with a non-empty prompt.

**Steps:**
1. Click the `[📋 Copy Prompt]` button.
2. Observe the button text immediately.
3. Wait 2 seconds and observe the button text again.

**Expected Result:**
- Immediately after click: button label changes to `"✓ Copied!"` (or similar confirmed state).
- After 2 seconds: button label reverts to `"📋 Copy Prompt"`.
- No more than 2 seconds in the confirmed state.

---

### UI-04 — Actor Badges Display Correctly

| Field | Detail |
|---|---|
| **Test ID** | UI-04 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** A project is open with several steps visible (including Me, Claude Web, and Claude Code steps).

**Steps:**
1. Observe step rows in the checklist.
2. Click steps with different actor values to see the actor badge in the detail panel.

**Expected Result:**
- `"Me"` actor: `bg-gray-100 text-gray-600` badge.
- `"Claude Web"` actor: `bg-blue-100 text-blue-700` badge.
- `"Claude Code"` actor: `bg-violet-100 text-violet-700` badge.
- All actor badges are `rounded-full` and appear both in the step row (right side) and in the step detail panel header.

---

### UI-05 — Step-Status Strip Chart Renders All 24 Cells

| Field | Detail |
|---|---|
| **Test ID** | UI-05 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** A project exists with a mix of step statuses.

**Steps:**
1. Navigate to the Dashboard.
2. Observe the step-status strip chart inside a project card.

**Expected Result:**
- Exactly 24 cells are rendered in a single horizontal row.
- Cell colours correspond to step statuses: emerald (Complete), blue (In Progress), amber (Blocked), grey (Pending).
- The cells are equal width, with small gaps between them.
- Hovering over a cell (if implemented) shows the step number as a tooltip.

---

### UI-06 — Next Action Banner Text Logic

| Field | Detail |
|---|---|
| **Test ID** | UI-06 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** Three projects exist with different active steps — one with a "Me" step active, one with "Claude Web", one with "Claude Code".

**Steps:**
1. Observe the Next Action banner on each Dashboard card.

**Expected Result:**
- For a "Me" step: banner shows `"Step X — [Step Name]"` with instruction text appropriate for a manual user action.
- For a "Claude Web" step: banner shows instruction to open Claude Web and paste the prompt.
- For a "Claude Code" step: banner shows instruction referencing Claude Code.
- All banners use `bg-indigo-50 border-l-4 border-indigo-400` styling.

---

### UI-07 — Blocked Reason Field Appears Inline (Not as Modal)

| Field | Detail |
|---|---|
| **Test ID** | UI-07 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** A step is open in the detail panel.

**Steps:**
1. Click `[⚠ Blocked]` in the status controls.
2. Observe where the reason field appears.

**Expected Result:**
- The blocked reason field appears **inline** below the status buttons within the step detail panel.
- No separate modal or dialog box is triggered.
- The inline field uses amber styling: `bg-amber-50 border border-amber-200 rounded-lg`.
- The `[Save & Mark Blocked]` button is disabled when the field is empty.

---

### UI-08 — Dashboard Empty State Displays Correctly

| Field | Detail |
|---|---|
| **Test ID** | UI-08 |
| **Category** | UI Validation |
| **Priority** | Low |

**Preconditions:** Application has no projects (first run or all deleted).

**Steps:**
1. Navigate to the Dashboard.
2. Observe the main content area.

**Expected Result:**
- The card grid is empty.
- A centred empty state is displayed with an icon, heading `"No projects yet"`, and a `[+ Create Your First Project]` button.
- The `[+ New Project]` button in the header is also visible.
- No error, no blank white space without explanation.

---

### UI-09 — AppShell Breadcrumb Visible Only in Non-Dashboard Views

| Field | Detail |
|---|---|
| **Test ID** | UI-09 |
| **Category** | UI Validation |
| **Priority** | Low |

**Preconditions:** Application is running.

**Steps:**
1. Observe the AppShell on the Dashboard view.
2. Navigate to a project view.
3. Observe the AppShell again.
4. Navigate to the Archived view.
5. Observe the AppShell again.

**Expected Result:**
- On Dashboard: No `[← Dashboard]` breadcrumb link is visible.
- On Project view and Archived view: `[← Dashboard]` breadcrumb link is visible.
- Clicking the breadcrumb from any view returns to the Dashboard.

---

### UI-10 — Toast Notifications Appear and Auto-Dismiss

| Field | Detail |
|---|---|
| **Test ID** | UI-10 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** Application is running.

**Steps:**
1. Click `[↑ Export]`.
2. Observe the toast notification position, content, and duration.
3. Copy a prompt and observe the copy toast.
4. Allow toasts to auto-dismiss.

**Expected Result:**
- Toasts appear in the bottom-right corner of the viewport.
- Export success toast: success icon, appropriate message, auto-dismisses after ~4 seconds.
- Copy toast: copy icon, `"Prompt copied"` message.
- Each toast has an `✕` close button that dismisses it immediately.
- Multiple toasts stack vertically without overlapping.

---

### UI-11 — Step Detail Panel Shows All 12 Required Fields

| Field | Detail |
|---|---|
| **Test ID** | UI-11 |
| **Category** | UI Validation |
| **Priority** | High |

**Preconditions:** A project is open. Step 4 is selected in the detail panel.

**Steps:**
1. Inspect the Step Detail Panel for Step 4.

**Expected Result:**
The following 12 elements must all be present and populated:
1. Step number (`"Step 4 of 24"`)
2. Step name (`"Run Technical Architect Persona"`)
3. Actor badge (`"Claude Web"`)
4. Status badge (current status)
5. Timestamps section (started_at or null; completed_at or null)
6. Timer / elapsed time display
7. Plain-English description (non-empty text block)
8. Expected output text
9. Linked docs badges
10. Prompt text box (dark code block)
11. `[Copy Prompt]` button
12. Status control buttons (4 options)
13. Notes textarea

---

### UI-12 — Prompt Box Uses Dark Code Block Styling

| Field | Detail |
|---|---|
| **Test ID** | UI-12 |
| **Category** | UI Validation |
| **Priority** | Medium |

**Preconditions:** A step is open in the detail panel.

**Steps:**
1. Observe the AI Prompt section.
2. Verify the prompt container styling.

**Expected Result:**
- The prompt is displayed in a `bg-gray-900` container with `text-gray-100` text.
- Font is `font-mono` (monospace).
- The container has a maximum height with `overflow-y-auto` scrolling for long prompts.
- The `[Copy Prompt]` button is directly below the dark code block.
- The prompt text is visually distinct from all other text on the page.

---

---

# CATEGORY 6 — DATA INTEGRITY TESTS

*All Data Integrity tests are High priority.*

---

### DI-01 — localStorage Key and Root Schema Structure

| Field | Detail |
|---|---|
| **Test ID** | DI-01 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** Application has been opened and one project created.

**Steps:**
1. Open browser DevTools → Application → Local Storage.
2. Find the key `iw-data`.
3. Inspect the value.

**Expected Result:**
- The key `iw-data` exists.
- The value is valid JSON containing: `schema_version` (integer), `projects` (array), and optionally `exported_at`.
- `schema_version` is `1` for V1.0.
- The `projects` array contains the created project with a valid UUID `project_id`.
- Each project contains exactly 24 StepRecord objects.

---

### DI-02 — Step Record Separation from Static Data

| Field | Detail |
|---|---|
| **Test ID** | DI-02 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** A project exists.

**Steps:**
1. Open DevTools and inspect the `iw-data` localStorage value.
2. Examine the step objects within a project's `steps` array.

**Expected Result:**
- Step objects in localStorage contain **only** mutable fields: `step_number`, `status`, `blocked_reason`, `notes`, `started_at`, `completed_at`, `time_in_step_seconds`.
- Static fields (`step_name`, `actor`, `persona`, `description`, `prompt_text`, `expected_output`, `linked_docs`) are **not** stored in localStorage.
- These static fields are sourced exclusively from `steps.js` at render time.

---

### DI-03 — Export File Contains All Projects (Active + Archived)

| Field | Detail |
|---|---|
| **Test ID** | DI-03 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** 2 active projects and 1 archived project exist.

**Steps:**
1. Click `[↑ Export]`.
2. Parse the downloaded JSON file.
3. Count the projects in the `projects` array.
4. Check the `status` field of each project.

**Expected Result:**
- `projects` array contains exactly 3 entries.
- 2 projects have `status: 'active'`.
- 1 project has `status: 'archived'`.
- All step data, notes, timestamps, and statuses are present for all 3 projects.
- `export_format` is `"implementation-wizard-backup"`.
- `schema_version` matches the current app schema version.
- `exported_at` is a valid ISO 8601 timestamp.

---

### DI-04 — Full Export / Import Round-Trip Preserves All Data

| Field | Detail |
|---|---|
| **Test ID** | DI-04 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** A project `"Round Trip Test"` exists with: steps 1–5 Complete, step 6 Blocked with reason `"Test block reason"`, notes on step 3 `"Test note content"`, step 7 In Progress.

**Steps:**
1. Export all data to a backup file.
2. Delete all data by clearing localStorage manually (DevTools → Application → Local Storage → Clear).
3. Refresh the application — verify empty state.
4. Import the backup file.
5. Open `"Round Trip Test"` and check all step data.

**Expected Result:**
- After import: `"Round Trip Test"` exists.
- Steps 1–5 are Complete with original `completed_at` timestamps preserved.
- Step 6 is Blocked with `blocked_reason = "Test block reason"`.
- Step 3 notes contain `"Test note content"`.
- Step 7 is In Progress with original `started_at` preserved.
- `time_in_step_seconds` values for all steps are preserved.

---

### DI-05 — Schema Version Migration Does Not Lose Data

| Field | Detail |
|---|---|
| **Test ID** | DI-05 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** This test simulates a schema version upgrade. Manually set `schema_version: 0` in localStorage (using DevTools) while leaving existing project data intact.

**Steps:**
1. Using DevTools, edit the `iw-data` localStorage value to set `schema_version` to `0`.
2. Refresh the application.
3. Observe whether the app loads normally.
4. Check all project data.

**Expected Result:**
- The migration function detects `schema_version: 0` and runs the migration routine.
- After migration, `schema_version` is updated to `1` in localStorage.
- All existing project data is preserved — no projects, steps, notes, or timestamps are lost.
- The application renders normally without error.

---

### DI-06 — Startup Integrity Check on Corrupted Data

| Field | Detail |
|---|---|
| **Test ID** | DI-06 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** Application has project data. Using DevTools, manually corrupt the localStorage value (e.g. set `iw-data` to `"CORRUPTED_STRING_NOT_JSON"`).

**Steps:**
1. Set `localStorage['iw-data']` to a non-JSON string via DevTools.
2. Refresh the application.
3. Observe the application behaviour.

**Expected Result:**
- The startup integrity check (`integrityCheck.js`) catches the parsing failure.
- The application does **not** crash or show a blank white screen.
- A clear warning is displayed to the user explaining that data appears corrupted.
- The user is offered options: reset to empty state (clearing the corrupt data) or cancel (staying on the warning screen).
- If reset is chosen, the app loads cleanly with an empty project list.

---

### DI-07 — DocRegistry Auto-Transition on Step Completion

| Field | Detail |
|---|---|
| **Test ID** | DI-07 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** A project exists. Step 2 is Pending. `01-functional-requirements.md` DocRegistry entry has `status: 'pending'`.

**Steps:**
1. Mark Step 2 as Complete.
2. Immediately inspect the DocRegistry in localStorage (or via the Doc Tracker UI).

**Expected Result:**
- The `01-functional-requirements.md` DocRegistry entry auto-transitions to `status: 'created'` synchronously with the step completion.
- The transition is recorded in localStorage in the same write operation as the step status change.
- No manual user action is required to trigger the transition.

---

### DI-08 — time_in_step_seconds Accumulates Correctly Across Sessions

| Field | Detail |
|---|---|
| **Test ID** | DI-08 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** Step 5 is In Progress.

**Steps:**
1. Note the current `time_in_step_seconds` value for Step 5 (e.g. 120 seconds).
2. Change Step 5 to Pending (pausing the timer — saves accumulated time).
3. Reload the browser.
4. Set Step 5 back to In Progress.
5. Wait 10 seconds.
6. Check the timer display.

**Expected Result:**
- After step 2: `time_in_step_seconds` = 120 is saved to localStorage.
- After step 6: The timer shows `120 + 10 = 130` seconds (or the equivalent formatted time), not a reset to 10 seconds.
- Elapsed time is cumulative across status changes and browser sessions.

---

### DI-09 — Import Schema Validation Rejects Incompatible Version

| Field | Detail |
|---|---|
| **Test ID** | DI-09 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** A JSON backup file exists with valid structure but `schema_version: 99` (a future/incompatible version).

**Steps:**
1. Click `[↓ Import]` and select the version-99 file.
2. Observe the result.

**Expected Result:**
- The Ajv validator (or a version check pre-validation) rejects the file due to incompatible `schema_version`.
- Error toast: `"Import failed. This backup was created with an incompatible version of Implementation Wizard."` (or similar).
- No overwrite modal appears.
- Existing data is unchanged.

---

### DI-10 — Completed_at Cleared When Step Un-Completed

| Field | Detail |
|---|---|
| **Test ID** | DI-10 |
| **Category** | Data Integrity |
| **Priority** | High |

**Preconditions:** Step 4 is Complete. `completed_at` for Step 4 has a recorded timestamp.

**Steps:**
1. Open Step 4 in the detail panel.
2. Click `[Pending]` to un-complete the step.
3. Inspect the `completed_at` field in localStorage for Step 4.

**Expected Result:**
- `completed_at` for Step 4 is set to `null` in localStorage.
- `started_at` remains set (it is never reset per specs).
- `time_in_step_seconds` retains its accumulated value (not reset).
- The step status in the UI updates to Pending with the correct visual treatment.

---

---

## Test Execution Notes

### Pre-Execution Setup
- Clear `localStorage['iw-data']` before each independent test run where stated.
- Use browser DevTools (Application → Local Storage) for DI tests requiring direct data inspection.
- Tests EC-05, BR-T03, and BR-T04 must be executed as a sequence.

### Test Environment
- Browser: Chrome latest stable (primary), Firefox latest (secondary).
- Viewport: 1440px × 900px unless otherwise specified.
- Operating System: Desktop only. Mobile not in scope for V1.0.

### Regression Priority Order
When re-testing after a code change, execute in this order:
1. All **DI** tests (data never lost)
2. All **BR** tests (business rules enforced)
3. All **FN** High-priority tests (core workflow)
4. All **NG** High-priority tests (destructive action safeguards)
5. Remaining **FN**, **EC**, **UI**, **NG** tests

### Known Items Requiring Developer Clarification
- **NG-06**: Confirm whether BR-01 parallel exception permits Step 6 to be completed when Step 5 is Blocked (not merely Pending). Recommend: Blocked ≠ Complete; exception should not apply.
- **EC-11**: Timer behaviour on browser close needs explicit implementation decision — does `time_in_step_seconds` save on every second, or only on status change? Recommend: save on status change and on `beforeunload` event.

---

*End of Document — 05-test-cases.md v1.0*

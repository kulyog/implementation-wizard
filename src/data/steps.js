// /src/data/steps.js — READ-ONLY static step definitions.
// This array is NEVER stored in localStorage and NEVER mutated at runtime.
// Each step's mutable data (status, notes, timestamps) lives in StepRecord in localStorage.
// The two are merged at render time using step_number as the join key.

export const STEPS = [
  {
    step_number: 1,
    step_name: 'Define Business Requirements',
    actor: 'me',
    persona: '',
    description:
      'Define what problem your software needs to solve, who it is for, and what it must do. ' +
      'Write down your goals, the core features you need, and any constraints or preferences ' +
      'you have before involving AI tools. This step is entirely your own thinking — no AI yet.',
    prompt_text: '',
    expected_output: 'A clear written summary of your business requirements, ready to hand to the Domain Expert persona.',
    linked_docs: [],
    notes: '',
  },
  {
    step_number: 2,
    step_name: 'Run Domain Expert Persona',
    actor: 'claude_web',
    persona: 'Domain Expert',
    description:
      'Paste the Domain Expert prompt into Claude Web. Claude will act as a domain expert ' +
      'to analyse your requirements and produce a structured functional requirements document ' +
      'covering all features, business rules, data requirements, and out-of-scope items.',
    prompt_text: `PERSONA: Domain Expert

Refer to any existing project files already uploaded.

I want to build a web application called [PROJECT NAME].
Here is what I need it to do in plain business language:

PURPOSE
[Describe what the application is for and who uses it]

WHAT THE APP SHOULD DO
[List the key things the app must do, numbered]

USERS
[Describe who will use the app and their technical level]

BUSINESS RULES
[List any rules the app must enforce]

Please refine these requirements, ask clarifying
questions if needed, and produce the complete
01-functional-requirements.md file.`,
    expected_output: 'Produces 01-functional-requirements.md in the /docs folder.',
    linked_docs: ['01-functional-requirements.md'],
    notes:
      'When Claude Web returns open questions, answer each one before asking Claude to produce the final document. ' +
      'Use this decision guide: (1) If the question is about scope — default to simpler, defer extras to V1.1. ' +
      '(2) If about users — base on your most typical user. ' +
      '(3) If about data — prefer localStorage unless you need multi-device access. ' +
      '(4) If unsure — pick the option with the least rework if you change your mind later.',
  },
  {
    step_number: 3,
    step_name: 'Run AI Expert Persona',
    actor: 'claude_web',
    persona: 'AI Expert',
    description:
      'Paste the AI Expert prompt into Claude Web along with your functional requirements. ' +
      'Claude will identify which AI tools and techniques best accelerate your build, ' +
      'and document recommendations with justifications and cost implications.',
    prompt_text: `PERSONA: AI Expert

Refer to project file 01-functional-requirements.md
already uploaded.

Please read the functional requirements and identify
AI tools, techniques, or integrations that can:
(a) Speed up delivery of this application
(b) Improve controls or data integrity
(c) Improve the user experience

Produce the complete 03-ai-recommendations.md file
covering: tool, purpose, cost, complexity, and
recommendation for each item.`,
    expected_output: 'Produces 03-ai-recommendations.md in the /docs folder.',
    linked_docs: ['03-ai-recommendations.md'],
    notes:
      'When Claude Web returns open questions or recommendations, decide each one before producing the final document. ' +
      'Use this guide: (1) Adopt — only if the tool is free or low cost and adds clear value. ' +
      '(2) Defer — use V1.1 label for good ideas that add complexity now. ' +
      '(3) Reject — if the tool requires a paid plan or significant setup for marginal benefit.',
  },
  {
    step_number: 4,
    step_name: 'Run Technical Architect Persona',
    actor: 'claude_web',
    persona: 'Technical Architect',
    description:
      'Paste the Technical Architect prompt into Claude Web along with the functional ' +
      'requirements and AI recommendations. Claude will produce a complete technical ' +
      'specification covering stack decisions, architecture, data models, and sprint plan.',
    prompt_text: `PERSONA: Technical Architect

Refer to project files 01-functional-requirements.md
and 03-ai-recommendations.md already uploaded.

Please read both documents and produce the complete
02-technical-specifications.md covering:
- Objective and Scope
- Tech Stack with justification for each choice
- Application architecture
- File and folder structure
- Data model and schema
- Component hierarchy
- Sprint plan (max 3 sprints) with specific tasks
- Security considerations
- Constraints
- Open questions before build begins`,
    expected_output: 'Produces 02-technical-specifications.md in the /docs folder.',
    linked_docs: ['02-technical-specifications.md'],
    notes:
      'When Claude Web returns open questions, answer each one before asking for the final document. ' +
      'Use this guide: (1) Tech stack questions — prefer the option already in your stack. ' +
      '(2) Architecture questions — prefer simpler over clever. ' +
      '(3) Sprint split questions — each sprint should be independently testable. ' +
      '(4) If genuinely unsure — state your constraint and ask Claude to recommend.',
  },
  {
    step_number: 5,
    step_name: 'Run UI Expert Persona',
    actor: 'claude_web',
    persona: 'UI Expert',
    description:
      'Paste the UI Expert prompt into Claude Web. Claude will design wireframes and a UI ' +
      'specification for every screen in your application, including layout, colour palette, ' +
      'and component descriptions. This step may run in parallel with Step 6.',
    prompt_text: `PERSONA: UI Expert

Refer to project file 02-technical-specifications.md
already uploaded.

Please read the technical specifications and produce
the complete 04-wireframes.md file covering all
screens defined in the spec. For each screen provide:
- Layout description
- Key components listed
- Navigation flow
- A ready-to-use v0.dev prompt

Design language: Light background, indigo accent
colour, professional finance aesthetic, clean
and minimal.`,
    expected_output: 'Produces 04-wireframes.md in the /docs folder.',
    linked_docs: ['04-wireframes.md'],
    notes:
      'When Claude Web returns open questions about layout or design, answer each one before producing wireframes. ' +
      'Use this guide: (1) Layout questions — prefer the option that shows the most important information without scrolling. ' +
      '(2) Colour questions — indigo accent on white background is the project default. ' +
      '(3) Navigation questions — prefer fewer clicks to reach core actions.',
  },
  {
    step_number: 6,
    step_name: 'Run QC Analyst Persona',
    actor: 'claude_web',
    persona: 'QC Analyst',
    description:
      'Paste the QC Analyst prompt into Claude Web. Claude will analyse all specification ' +
      'documents and produce a comprehensive test case document covering functional, ' +
      'business rule, edge case, and negative tests. This step may run in parallel with Step 5.',
    prompt_text: `PERSONA: QC Analyst

Refer to project files 02-technical-specifications.md
and 04-wireframes.md already uploaded.

Please read both documents and produce the complete
05-test-cases.md covering:
1. Functional Tests — one test per feature
2. Business Rule Tests — one test per rule
3. Edge Case Tests — boundary conditions
4. Negative Tests — invalid inputs, wrong sequences
5. UI Validation Tests — layout, badges, controls
6. Data Integrity Tests — persistence, export/import

For each test case provide:
- Test ID, Category, Test Name
- Preconditions, Steps, Expected Result
- Priority (High / Medium / Low)

All Data Integrity and Business Rule tests must be
High priority.`,
    expected_output: 'Produces 05-test-cases.md in the /docs folder.',
    linked_docs: ['05-test-cases.md'],
    notes:
      'When Claude Web returns open questions, answer each one before producing test cases. ' +
      'Use this guide: (1) Coverage questions — always include at least one negative test per business rule. ' +
      '(2) Priority questions — Data Integrity and Business Rule tests are always High priority. ' +
      '(3) Scope questions — include edge cases for any field that accepts free-form input.',
  },
  {
    step_number: 7,
    step_name: 'Review All Docs',
    actor: 'me',
    persona: '',
    description:
      'Read through all documents produced in Steps 2–6. Verify they accurately reflect ' +
      'your intentions, check for gaps or contradictions, and make any corrections before ' +
      'handing to Claude Code. This is your last checkpoint before implementation begins.',
    prompt_text: '',
    expected_output: 'All /docs files reviewed and approved by the Owner. Build may begin.',
    linked_docs: [
      '01-functional-requirements.md',
      '02-technical-specifications.md',
      '03-ai-recommendations.md',
      '04-wireframes.md',
      '05-test-cases.md',
    ],
    notes: '',
  },
  {
    step_number: 8,
    step_name: 'Scaffold Project (Claude Code)',
    actor: 'claude_code',
    persona: 'Technical Expert',
    description:
      'Open Claude Code and instruct it to scaffold the project — create the folder structure, ' +
      'install dependencies, set up configuration files, and build the foundational code ' +
      'layers (data, context, hooks, utilities) before any UI is built.',
    prompt_text: `Please scaffold this project by doing
the following in order:

1. Read ALL files in /docs/ before doing anything

2. Update CLAUDE.md with full project context
   from the approved specs

3. Create the complete folder structure as defined
   in 02-technical-specifications.md. Place a
   .gitkeep file inside every empty folder —
   Git does not track empty folders and without
   .gitkeep the structure will not appear on GitHub

4. Set up the React + Vite environment:
   - Install all dependencies from the tech stack
   - Configure Tailwind CSS
   - Configure path aliases
   - Create the entry point files
   - Confirm dev server runs at localhost:5173

5. Create the static seed data file (e.g. steps.js
   or equivalent) with all fixed application data

6. Commit with message: [Setup] Scaffold project
   structure and dev environment

Confirm each task before moving to the next.`,
    expected_output: 'Complete /src project structure with all configuration, data, and utility files in place.',
    linked_docs: [],
    notes:
      'IMPORTANT: Ask Claude Code to place a .gitkeep file inside every empty folder during scaffolding. ' +
      'Git does not track empty folders — without .gitkeep the folder structure will not appear on GitHub after the first push. ' +
      'The scaffold prompt already includes this instruction. ' +
      'See Reference Card §14.2 — Claude Code Quick Start in AI_Dev_Framework_v2.docx.',
  },
  {
    step_number: 9,
    step_name: 'Build Sprint 1',
    actor: 'claude_code',
    persona: 'Technical Expert',
    description:
      'Work with Claude Code to implement all Sprint 1 features as defined in the technical ' +
      'specifications. Sprint 1 covers the foundation: project creation, 24-step checklist, ' +
      'step detail panel, status updates, notes, and localStorage persistence.',
    prompt_text: `Please read ALL files in /docs/
before writing any code.

Implement Sprint 1 as defined in
02-technical-specifications.md.

After each task confirm it is complete before
moving to the next. Commit after every 3-4 tasks
with message: [Sprint-1] Description of work done.

Do not start Sprint 2 tasks. When Sprint 1 is
complete, provide a summary table of all tasks
completed with status and output file names.`,
    expected_output: 'Sprint 1 code complete. Projects can be created and steps tracked with data persisting across sessions.',
    linked_docs: [],
    notes:
      'See Reference Card §14.1 — Git Quick Reference for the standard 3-command commit sequence. ' +
      'If Claude Code session limit is reached mid-sprint, see §7.4 — Sprint Recovery Process. ' +
      'The Recovery Prompt button in this panel generates the resume prompt automatically.',
  },
  {
    step_number: 10,
    step_name: 'Test Sprint 1',
    actor: 'me',
    persona: '',
    description:
      'Manually test all Sprint 1 features against the test cases in 05-test-cases.md. ' +
      'Run the Vitest unit test suite. Log any failures and hand back to Claude Code ' +
      'for fixes before proceeding to Sprint 2.',
    prompt_text: '',
    expected_output: 'Sprint 1 test log. All High priority tests pass. Unit tests green.',
    linked_docs: ['05-test-cases.md'],
    notes: '',
  },
  {
    step_number: 11,
    step_name: 'Build Sprint 2',
    actor: 'claude_code',
    persona: 'Technical Expert',
    description:
      'Work with Claude Code to implement all Sprint 2 features: project management controls ' +
      '(rename, archive, delete, duplicate), document tracker, step-status strip chart, ' +
      'next action banner, export/import, and the app shell with navigation.',
    prompt_text: `Sprint 1 is complete and verified.
The app loads correctly at localhost:5173.

Please implement Sprint 2 as defined in
02-technical-specifications.md.

After each task confirm it is complete before
moving to the next. Commit after every 3-4 tasks
with message: [Sprint-2] Description of work done.

Do not start Sprint 3 tasks. When Sprint 2 is
complete, provide a summary table of all tasks
completed with status and output file names.`,
    expected_output: 'Sprint 2 code complete. All 22 features implemented and functional.',
    linked_docs: [],
    notes:
      'See Reference Card §14.1 — Git Quick Reference for the standard 3-command commit sequence. ' +
      'If Claude Code session limit is reached mid-sprint, see §7.4 — Sprint Recovery Process.',
  },
  {
    step_number: 12,
    step_name: 'Test Sprint 2',
    actor: 'me',
    persona: '',
    description:
      'Manually test all Sprint 2 features against 05-test-cases.md. Verify export/import ' +
      'round-trip, archive/restore flow, duplicate project, and document tracker auto-transitions. ' +
      'Log failures and return to Claude Code for fixes.',
    prompt_text: '',
    expected_output: 'Sprint 2 test log. All High priority tests pass.',
    linked_docs: ['05-test-cases.md'],
    notes: '',
  },
  {
    step_number: 13,
    step_name: 'Build Sprint 3',
    actor: 'claude_code',
    persona: 'Technical Expert',
    description:
      'Work with Claude Code to complete Sprint 3: integrate AI-generated step descriptions ' +
      'and tooltips, apply the confirmed colour palette, add the live step timer, ' +
      'ensure responsive layout, and produce the final static build.',
    prompt_text: `Sprints 1 and 2 are complete and
verified. All tests passing.

Please implement Sprint 3 as defined in
02-technical-specifications.md.

Sprint 3 should include:
- All AI-generated content (descriptions, tooltips)
- Visual polish — consistent colour palette
- Responsive layout verification
- Full test suite run — all tests must pass
- vite build — must complete with zero errors

Commit after every 3-4 tasks with message:
[Sprint-3] Description of work done.

When Sprint 3 is complete, confirm:
1. All tests passing (count)
2. vite build zero errors
3. /dist folder ready`,
    expected_output: 'Sprint 3 code complete. Application polished and ready for deployment.',
    linked_docs: [],
    notes:
      'See Reference Card §14.1 — Git Quick Reference for the standard 3-command commit sequence. ' +
      'Sprint 3 must end with npm run build confirming zero errors and all tests passing before moving to the audit.',
  },
  {
    step_number: 14,
    step_name: 'Test Sprint 3',
    actor: 'me',
    persona: '',
    description:
      'Run the full test suite against 05-test-cases.md. Verify all UI polish items: ' +
      'tooltips present, colour palette consistent, time-in-step counter running, ' +
      'layout correct at 1280/1440/1920px. Log and fix any remaining issues.',
    prompt_text: '',
    expected_output: 'Sprint 3 test log. Full Vitest suite green. Application ready for audit.',
    linked_docs: ['05-test-cases.md'],
    notes: '',
  },
  {
    step_number: 15,
    step_name: 'Run Auditor Persona',
    actor: 'claude_web',
    persona: 'Auditor',
    description:
      'Paste the Auditor prompt into Claude Web with a summary of your completed application. ' +
      'Claude will perform a structured audit of the build against the original specifications, ' +
      'identifying Critical, Major, and Minor findings to resolve before launch.',
    prompt_text: `PERSONA: Auditor

Please conduct a full audit of this application
before deployment.

All specification documents are available as
project files. Please refer to them directly.

Please also review the source code folder
structure provided below:

[PASTE YOUR /src FOLDER STRUCTURE HERE —
run: find src -type f | sort
in the VS Code terminal and paste the output]

Current test status:
[PASTE: X/X tests passing]

Build status:
[PASTE: vite build result]

Produce the complete audit-report.md covering:
- All findings as Critical / Major / Minor
- Each finding: ID, Category, File, Description,
  Risk, Recommended Fix
- Readiness score (0-100)
- Go / No-Go verdict

Be critical. Do not soften findings. Where source
code cannot be inspected directly, flag findings
as Unverifiable rather than Critical — the owner
will confirm file existence separately.`,
    expected_output: 'Produces audit-report.md in the /docs folder.',
    linked_docs: ['audit-report.md'],
    notes:
      'IMPORTANT — Auditor source visibility: Before running the audit, paste your current /src folder structure into the prompt ' +
      '(run: find src -type f | sort in VS Code terminal). ' +
      'Where the Auditor cannot verify source code directly, findings will be flagged as Unverifiable — ' +
      'confirm these manually before treating them as genuine. See §4.2 in AI_Dev_Framework_v2.docx.',
  },
  {
    step_number: 16,
    step_name: 'Review Audit Report',
    actor: 'me',
    persona: '',
    description:
      'Read the audit report in full. Prioritise findings by severity. Decide which ' +
      'Critical and Major findings will be resolved before launch and which (if any) ' +
      'Minor findings will be deferred. Document your decisions.',
    prompt_text: '',
    expected_output: 'Audit findings triaged. Resolution plan agreed. Critical and Major items queued for Claude Code.',
    linked_docs: ['audit-report.md'],
    notes: '',
  },
  {
    step_number: 17,
    step_name: 'Resolve Critical Findings',
    actor: 'claude_code',
    persona: 'Technical Expert',
    description:
      'Work with Claude Code to resolve all Critical findings from the audit report. ' +
      'Critical issues are blockers — they must be fixed before launch. ' +
      'Commit each fix separately with a clear reference to the finding ID.',
    prompt_text: `Please fix all Critical findings
from docs/audit-report.md.

Read the audit report carefully. For each
Critical finding:
1. Confirm whether the issue is genuine or
   a false alarm due to limited auditor visibility
2. If genuine — implement the recommended fix
3. If false alarm — confirm the file/function
   exists and note its actual location

After all Critical findings are addressed,
run the full test suite and confirm all tests
still pass.

Commit with message: [Audit] Fix Critical findings`,
    expected_output: 'Updated /src with all Critical findings resolved. Audit items closed.',
    linked_docs: ['audit-report.md'],
    notes:
      'See Reference Card §14.1 — Git Quick Reference. ' +
      'Commit after all Critical findings are resolved with message: [Audit] Fix Critical findings.',
  },
  {
    step_number: 18,
    step_name: 'Resolve Major Findings',
    actor: 'claude_code',
    persona: 'Technical Expert',
    description:
      'Work with Claude Code to resolve all Major findings from the audit report. ' +
      'Major issues significantly affect quality or user experience and should be ' +
      'fixed before launch where possible.',
    prompt_text: `Please fix all Major findings from
docs/audit-report.md that have not already been
addressed.

For each Major finding assess:
- Is this a genuine issue or limited visibility?
- Is the fix straightforward or does it risk
  breaking existing functionality?
- Implement fixes that are safe and clear
- Flag any fix that seems risky for owner review
  before implementing

After all fixes, run the full test suite and
confirm all tests still pass.

Commit with message: [Audit] Fix Major findings`,
    expected_output: 'Updated /src with Major findings resolved. Audit items closed.',
    linked_docs: ['audit-report.md'],
    notes:
      'See Reference Card §14.1 — Git Quick Reference. ' +
      'Commit after all Major findings are resolved with message: [Audit] Fix Major findings.',
  },
  {
    step_number: 19,
    step_name: 'Re-run Auditor Persona',
    actor: 'claude_web',
    persona: 'Auditor',
    description:
      'Run the Auditor persona again to verify that all Critical and Major findings ' +
      'have been resolved and that no new issues have been introduced. ' +
      'A clean second audit confirms the application is ready for final sign-off.',
    prompt_text: `PERSONA: Auditor

This is a re-audit following resolution of
findings from audit-report.md v1.0.

All specification documents are available as
project files. Please refer to them directly.

Summary of fixes applied since v1.0:
[PASTE SUMMARY OF WHAT WAS FIXED]

Current build state:
- Tests: [X/X passing]
- vite build: [zero errors / errors]
- Manual test log: docs/test-log-v1.md

Current folder structure:
[PASTE UPDATED /src FOLDER STRUCTURE]

Please produce the complete audit-report-v2.md.
Target re-audit score is 80 or above for GO
verdict. Be critical. Do not soften findings.
Where source code is not available for inspection,
flag as Unverifiable rather than Critical.`,
    expected_output: 'Produces audit-report-v2.md in the /docs folder. Zero Critical findings.',
    linked_docs: ['audit-report-v2.md'],
    notes:
      'Paste your updated /src folder structure into the re-audit prompt. ' +
      'Target score is 80 or above for GO verdict. ' +
      'Unverifiable findings from v1.0 should be confirmed or closed based on your manual verification. ' +
      'See §4.2 in AI_Dev_Framework_v2.docx.',
  },
  {
    step_number: 20,
    step_name: 'Final Review & Sign-Off',
    actor: 'me',
    persona: '',
    description:
      'Do a final end-to-end walkthrough of the application yourself. Verify it meets ' +
      'your original business requirements. If satisfied, formally sign off on the build ' +
      'before proceeding to documentation and deployment.',
    prompt_text: '',
    expected_output: 'Application approved by Owner. Ready for trainer persona and deployment.',
    linked_docs: ['audit-report-v2.md'],
    notes: '',
  },
  {
    step_number: 21,
    step_name: 'Run Trainer Persona',
    actor: 'claude_web',
    persona: 'Trainer',
    description:
      'Paste the Trainer prompt into Claude Web. Claude will produce end-user documentation ' +
      'for the application — a user guide, FAQ, and any stakeholder communication needed. ' +
      'These materials travel with the delivered software.',
    prompt_text: `PERSONA: Trainer

The application has been built, audited, and
deployed. Please produce the three release
documents for the /releases/ folder.

All specification documents are available as
project files. Please refer to them directly.

Additional context:
- Application is deployed at: [LIVE URL]
- Users: [describe who will use the app]

Please produce all three documents:

1. final-documentation.md
   - What the app does and why it exists
   - How to use each feature
   - Data backup and restore instructions
   - How to access the app

2. user-faq.md
   - Common questions during daily use
   - Troubleshooting common issues
   - What to do if data is lost

3. user-communication.md
   - Announcement or handover message
     for the intended users
   - Written in plain, non-technical language`,
    expected_output: 'Produces final-documentation.md, user-faq.md, and user-communication.md.',
    linked_docs: ['final-documentation.md', 'user-faq.md', 'user-communication.md'],
    notes: '',
  },
  {
    step_number: 22,
    step_name: 'Prepare Release Package',
    actor: 'me',
    persona: '',
    description:
      'Assemble the release package: final build output, documentation files, and a ' +
      'changelog. Place all artefacts in the /releases folder. ' +
      'Confirm the package is complete before deploying.',
    prompt_text: '',
    expected_output: 'Complete release package in /releases folder. Ready for deployment.',
    linked_docs: [],
    notes: '',
  },
  {
    step_number: 23,
    step_name: 'Deploy / Publish',
    actor: 'claude_code',
    persona: 'Technical Expert',
    description:
      'Work with Claude Code to deploy the application to GitHub Pages. ' +
      'Build the Vite /dist output, push to the gh-pages branch, ' +
      'and confirm the live public URL is accessible.',
    prompt_text: `Please deploy this application
to GitHub Pages.

Steps required:
1. Install gh-pages as a dev dependency
2. Add to package.json scripts:
   "predeploy": "npm run build"
   "deploy": "gh-pages -d dist"
3. Confirm vite.config.js has the correct
   base path: /[REPO-NAME]/
   If not, add it now.
4. Run: npm run deploy
5. Confirm gh-pages branch is created
   and pushed to GitHub

After deployment confirm the expected live URL:
https://[github-username].github.io/[repo-name]/

Note: After Claude Code deploys, you must
manually enable GitHub Pages in repository
Settings → Pages → Source → gh-pages branch.
Then wait 2-5 minutes for the URL to go live.`,
    expected_output: 'Application live at GitHub Pages URL. Deployment verified in clean browser.',
    linked_docs: [],
    notes:
      'Follow Reference Card §14.4 — GitHub Pages Deployment Checklist in AI_Dev_Framework_v2.docx. ' +
      'Key steps: (1) Confirm base path in vite.config.js. ' +
      '(2) Run npm run deploy from VS Code terminal — not inside Claude Code. ' +
      '(3) Manually enable Pages in GitHub Settings after deploy. ' +
      '(4) Wait 2-5 minutes. ' +
      '(5) Smoke test at live URL.',
  },
  {
    step_number: 24,
    step_name: 'Post-Launch Review',
    actor: 'me',
    persona: '',
    description:
      'Use the application in real work for the first time. Note any friction points, ' +
      'missing features, or bugs encountered in actual use. Document your observations ' +
      'as the starting point for Version 1.1 planning.',
    prompt_text: '',
    expected_output: 'Post-launch observations documented. V1.1 backlog seeded.',
    linked_docs: [],
    notes: '',
  },
]

// Default doc_registry template for new projects.
// Derived from linked_docs across all STEPS.
export const DEFAULT_DOC_REGISTRY = [
  { file_name: '01-functional-requirements.md', linked_step: 2, status: 'pending', user_note: '' },
  { file_name: '02-technical-specifications.md', linked_step: 4, status: 'pending', user_note: '' },
  { file_name: '03-ai-recommendations.md', linked_step: 3, status: 'pending', user_note: '' },
  { file_name: '04-wireframes.md', linked_step: 5, status: 'pending', user_note: '' },
  { file_name: '05-test-cases.md', linked_step: 6, status: 'pending', user_note: '' },
  { file_name: 'audit-report.md', linked_step: 15, status: 'pending', user_note: '' },
  { file_name: 'audit-report-v2.md', linked_step: 19, status: 'pending', user_note: '' },
  { file_name: 'final-documentation.md', linked_step: 21, status: 'pending', user_note: '' },
  { file_name: 'user-faq.md', linked_step: 21, status: 'pending', user_note: '' },
  { file_name: 'user-communication.md', linked_step: 21, status: 'pending', user_note: '' },
]

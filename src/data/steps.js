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
    prompt_text: '[PLACEHOLDER — Prompt for Step 1 to be authored post-testing]',
    expected_output: 'A clear written summary of your business requirements, ready to hand to the Domain Expert persona.',
    linked_docs: [],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 2 to be authored post-testing]',
    expected_output: 'Produces 01-functional-requirements.md in the /docs folder.',
    linked_docs: ['01-functional-requirements.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 3 to be authored post-testing]',
    expected_output: 'Produces 03-ai-recommendations.md in the /docs folder.',
    linked_docs: ['03-ai-recommendations.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 4 to be authored post-testing]',
    expected_output: 'Produces 02-technical-specifications.md in the /docs folder.',
    linked_docs: ['02-technical-specifications.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 5 to be authored post-testing]',
    expected_output: 'Produces 04-wireframes.md in the /docs folder.',
    linked_docs: ['04-wireframes.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 6 to be authored post-testing]',
    expected_output: 'Produces 05-test-cases.md in the /docs folder.',
    linked_docs: ['05-test-cases.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 7 to be authored post-testing]',
    expected_output: 'All /docs files reviewed and approved by the Owner. Build may begin.',
    linked_docs: [
      '01-functional-requirements.md',
      '02-technical-specifications.md',
      '03-ai-recommendations.md',
      '04-wireframes.md',
      '05-test-cases.md',
    ],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 8 to be authored post-testing]',
    expected_output: 'Complete /src project structure with all configuration, data, and utility files in place.',
    linked_docs: [],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 9 to be authored post-testing]',
    expected_output: 'Sprint 1 code complete. Projects can be created and steps tracked with data persisting across sessions.',
    linked_docs: [],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 10 to be authored post-testing]',
    expected_output: 'Sprint 1 test log. All High priority tests pass. Unit tests green.',
    linked_docs: ['05-test-cases.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 11 to be authored post-testing]',
    expected_output: 'Sprint 2 code complete. All 22 features implemented and functional.',
    linked_docs: [],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 12 to be authored post-testing]',
    expected_output: 'Sprint 2 test log. All High priority tests pass.',
    linked_docs: ['05-test-cases.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 13 to be authored post-testing]',
    expected_output: 'Sprint 3 code complete. Application polished and ready for deployment.',
    linked_docs: [],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 14 to be authored post-testing]',
    expected_output: 'Sprint 3 test log. Full Vitest suite green. Application ready for audit.',
    linked_docs: ['05-test-cases.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 15 to be authored post-testing]',
    expected_output: 'Produces audit-report.md in the /docs folder.',
    linked_docs: ['audit-report.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 16 to be authored post-testing]',
    expected_output: 'Audit findings triaged. Resolution plan agreed. Critical and Major items queued for Claude Code.',
    linked_docs: ['audit-report.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 17 to be authored post-testing]',
    expected_output: 'Updated /src with all Critical findings resolved. Audit items closed.',
    linked_docs: ['audit-report.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 18 to be authored post-testing]',
    expected_output: 'Updated /src with Major findings resolved. Audit items closed.',
    linked_docs: ['audit-report.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 19 to be authored post-testing]',
    expected_output: 'Produces audit-report-v2.md in the /docs folder. Zero Critical findings.',
    linked_docs: ['audit-report-v2.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 20 to be authored post-testing]',
    expected_output: 'Application approved by Owner. Ready for trainer persona and deployment.',
    linked_docs: ['audit-report-v2.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 21 to be authored post-testing]',
    expected_output: 'Produces final-documentation.md, user-faq.md, and user-communication.md.',
    linked_docs: ['final-documentation.md', 'user-faq.md', 'user-communication.md'],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 22 to be authored post-testing]',
    expected_output: 'Complete release package in /releases folder. Ready for deployment.',
    linked_docs: [],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 23 to be authored post-testing]',
    expected_output: 'Application live at GitHub Pages URL. Deployment verified in clean browser.',
    linked_docs: [],
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
    prompt_text: '[PLACEHOLDER — Prompt for Step 24 to be authored post-testing]',
    expected_output: 'Post-launch observations documented. V1.1 backlog seeded.',
    linked_docs: [],
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

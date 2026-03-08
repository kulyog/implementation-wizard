# CLAUDE.md
# Project: Implementation Wizard
# Last updated: March 2026

## Project Context
A React web application that tracks AI-assisted software
development projects through a 24-step framework.
Human owner: kulyo
Current sprint: Not started
Current status: Setup phase

## Documentation
Read ALL files in /docs/ before writing any code.
If any specification is unclear, stop and ask.
Do not assume. Do not modify specs — request a spec update.
Follow the sprint plan in 02-technical-specifications.md exactly.

## Technology Stack
Frontend : React (Vite) + Tailwind CSS + shadcn/ui + Recharts
Backend  : Supabase (PostgreSQL)
Hosting  : Vercel
Repo     : GitHub

## Folder Structure Rule
When creating any folder or directory structure, always place 
a .gitkeep file inside every folder that has no other files.
This ensures Git tracks all folders correctly.
Example: docs/.gitkeep, releases/.gitkeep, src/components/.gitkeep
Remove .gitkeep from a folder only when a real file is added to it.

## Coding Standards
- TypeScript for all files
- One component per file in /src/components/
- All Supabase calls in /src/lib/supabase.ts only
- No hardcoded credentials — use .env variables only
- Validate all user inputs before any database write
- Never delete data — use soft delete (is_deleted flag)

## Before Every Commit
- Zero console errors
- All High priority test cases in 05-test-cases.md pass
- Commit message format: [Sprint-N] Brief description

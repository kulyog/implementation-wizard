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

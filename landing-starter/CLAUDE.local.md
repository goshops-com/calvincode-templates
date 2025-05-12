# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dependencies
- If a new dependency is added, run `npm install`

## Code Style Guidelines
- **Components**: Use function components with TypeScript
- **Client Components**: Add 'use client' directive at top of file
- **Imports**: Use absolute imports with @ alias (e.g., `@/components/`)
- **Formatting**: Use 2-space indentation
- **Styling**: Use Tailwind CSS for styling (className approach)
- **TypeScript**: Strict mode enabled, use proper type annotations
- **Naming**: PascalCase for components, camelCase for variables/functions
- **State Management**: React hooks (useState, useEffect)
- **File Structure**: Components in /components directory, pages in /app
- **Error Handling**: Use try/catch for async operations

## Important Notes
- `dev-inspector.tsx` is not to be modified.
- Do not run `npm run dev` automatically as there is another process running it.
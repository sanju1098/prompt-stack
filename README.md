# PromptStack

PromptStack is an AI prompt management platform built with Next.js, React, and MongoDB. It helps developers, prompt engineers, and creators store reusable prompt templates, run live prompt experiments, and manage curated templates from one workspace.

## What PromptStack does

PromptStack lets you:

- Create, save, and manage reusable prompt templates
- Auto-detect dynamic variables with `{{variable}}` syntax
- Search and filter prompts by category, title, or description
- Run prompts live using Gemini or Groq providers
- Add optional system instructions per prompt
- View prompt details, execution count, and integration code snippets
- Fork public templates into your personal prompt library
- Track workspace stats for prompts, templates, runs, and providers

## Key features

- Prompt library with live search, category filters, and skeleton loading states
- Built-in templates marketplace with featured templates and fork support
- Prompt detail pages with hydrated template preview and code snippets
- Dynamic variable extraction and interactive input generation
- Multi-provider support for Gemini and Groq models
- Workspace analytics for total prompts, templates, runs, and provider count
- Theme toggle and responsive UI with shadcn/ui components

## Supported routes

- `/` — Prompt library dashboard
- `/templates` — Curated template marketplace
- `/help` — Documentation and feature guides
- `/:id/prompt` — Prompt detail page with integration snippets
- `/:id/template` — Template detail page and fork action

## Tech stack

- Next.js 16.2.12
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui
- MongoDB + Mongoose
- `@google/genai` for Gemini
- `groq-sdk` for Groq
- Sonner for toast notifications

## Getting started

### Prerequisites

- Node.js 20 or newer
- MongoDB instance or MongoDB Atlas cluster
- Gemini API key and/or Groq API key

### Required environment variables

Create a `.env.local` file in the project root with:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### Install dependencies and start development server

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Available scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — build the app for production
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npm run format` — format sources with Prettier

## Project structure

- `app/` — page routes, server components, and route actions
- `src/components/` — reusable UI components and dialogs
- `src/global/` — shared types, constants, and provider configuration
- `src/lib/` — helpers, parser utilities, database connection, and client code
- `src/models/` — Mongoose schemas for prompts and templates
- `src/public/` — static assets and favicon

## Notes

- Prompt templates can include `{{variableName}}` placeholders. The app auto-extracts these variables and exposes them as interactive inputs.
- Public templates can be forked into the user prompt library, incrementing the template's usage counter.
- Workspace stats are computed from MongoDB aggregates and include prompts, templates, runs, and active providers.

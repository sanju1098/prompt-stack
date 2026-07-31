# PromptStack

PromptStack is a modern AI prompt library and playground built for developers, prompt engineers, and creators who want to organize, test, and reuse prompts in one place. Instead of keeping prompts scattered across notes, chats, or text files, PromptStack gives you a centralized workspace to build reusable templates, inject variables, choose models, and run them live.

## What PromptStack can do

PromptStack helps you:

- Create and save reusable prompt templates
- Use dynamic placeholders such as `{{topic}}`, `{{audience}}`, or `{{tone}}`
- Search and filter prompts by category or keyword
- Run prompts directly in the browser against Gemini or Groq
- Add system instructions and model settings for each prompt
- Store prompts in MongoDB for fast reuse and iteration
- Test and refine prompts without switching between multiple tools

## Core features

- Prompt library with search and category filters
- Dynamic variable detection from template syntax
- Live playground for filling values and executing prompts
- Provider and model selection for Gemini and Groq
- Structured prompt storage with metadata and execution tracking
- Clean, modern UI built with Next.js and shadcn/ui

## Why it exists

PromptStack makes prompt development feel more like working with a real product. It is useful for:

- Developers prototyping prompts for AI apps
- Prompt engineers comparing outputs across models
- Content teams reusing prompt templates safely
- Anyone who wants a faster, cleaner workflow for LLM testing

## Tech stack

- Next.js
- React
- MongoDB + Mongoose
- Tailwind CSS
- shadcn/ui
- Gemini API and Groq API

## Getting started

### Prerequisites

- Node.js 20 or newer
- A MongoDB instance
- API keys for Gemini and/or Groq

### Environment variables

Create a `.env.local` file in the project root with the following values:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### Install and run

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project structure

- `app/` - pages, layout, and server actions
- `components/` - UI and interactive prompt features
- `lib/` - database, parsing, and helper utilities
- `models/` - MongoDB schema for prompts
- `global/` - shared types, providers, and constants

## Use cases

- Rapid prompt prototyping
- Reusable prompt templates for projects and teams
- Testing prompts before integrating them into apps
- Managing prompt versions and execution experiments in one place

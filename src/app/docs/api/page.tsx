'use client';

import { Terminal } from 'lucide-react';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  actionName: string;
  description: string;
}

const endpoints: Endpoint[] = [
  {
    id: 'get-prompts',
    method: 'GET',
    path: '/api/prompts',
    actionName: 'getPromptsAction(searchQuery?, category?)',
    description: 'Fetches all saved prompts with optional search query and category filters.',
  },
  {
    id: 'get-prompt-by-id',
    method: 'GET',
    path: '/api/prompts/:id',
    actionName: 'getPromptById(id)',
    description: 'Retrieves a single prompt document by its MongoDB ObjectId.',
  },
  {
    id: 'create-prompt',
    method: 'POST',
    path: '/api/prompts',
    actionName: 'createPromptAction(input)',
    description:
      'Creates a new prompt and automatically extracts variable placeholders from the template.',
  },
  {
    id: 'update-prompt',
    method: 'PUT',
    path: '/api/prompts/:id',
    actionName: 'updatePromptAction(id, input)',
    description: 'Updates an existing prompt document by ID and re-extracts variables.',
  },
  {
    id: 'run-prompt',
    method: 'POST',
    path: '/api/prompts/:id/run',
    actionName: 'runPromptAction(promptId, variableValues)',
    description: 'Hydrates variables and executes the prompt against Gemini or Groq.',
  },
  {
    id: 'get-stats',
    method: 'GET',
    path: '/api/stats',
    actionName: 'getWorkspaceStatsAction()',
    description:
      'Returns workspace metrics: prompt counts, template counts, total runs, and connected providers.',
  },
  {
    id: 'get-templates',
    method: 'GET',
    path: '/api/templates',
    actionName: 'getTemplatesAction(searchQuery?, category?)',
    description: 'Fetches public templates with optional search and category filters.',
  },
  {
    id: 'get-template-by-id',
    method: 'GET',
    path: '/api/templates/:id',
    actionName: 'getTemplateById(id)',
    description: 'Retrieves a single public template document by ID.',
  },
  {
    id: 'fork-template',
    method: 'POST',
    path: '/api/templates/:id/fork',
    actionName: 'forkTemplateAction(templateId)',
    description: 'Forks a public template into your prompt library and increments usage stats.',
  },
  {
    id: 'create-template',
    method: 'POST',
    path: '/api/templates',
    actionName: 'createTemplateAction(data)',
    description: 'Saves a new template to the community repository.',
  },
  {
    id: 'seed-templates',
    method: 'POST',
    path: '/api/templates/seed',
    actionName: 'seedTemplatesAction(initialTemplates)',
    description: 'Seeds the database with initial templates if the collection is empty.',
  },
];

export default function ApiDocsPage() {
  const getMethodBadge = (method: Endpoint['method']) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'POST':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PUT':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <Terminal className="size-4 text-brand" /> API Overview
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">API Endpoints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Available endpoints and Server Actions in PromptStack.
          </p>
        </div>

        {/* Endpoints List */}
        <div className="mt-8 space-y-3">
          {endpoints.map((ep) => (
            <div
              key={ep.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border-strong sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3 font-mono">
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-bold ${getMethodBadge(ep.method)}`}
                >
                  {ep.method}
                </span>
                <span className="text-sm font-semibold text-foreground">{ep.path}</span>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-sm text-foreground">{ep.description}</span>
                {/* <span className="font-mono text-[11px] text-muted-foreground/80">{ep.actionName}</span> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

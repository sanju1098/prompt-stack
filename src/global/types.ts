// ─── Base & Shared Primitives ───────────────────────────────────────────────

export type Provider = 'gemini' | 'groq' | 'openai';

export type Category = 'Coding' | 'Writing' | 'Marketing' | 'Summarization' | 'General';

export type Theme = 'light' | 'dark';

// ─── LLM Provider Configuration ────────────────────────────────────────────

export interface LLMProviderConfig {
  id: Provider;
  label: string;
  models: string[];
}

// ─── Model Configuration ───────────────────────────────────────────────────

export interface ModelConfig {
  provider: Provider;
  modelName: string;
  temperature: number;
  maxTokens: number;
}

// ─── Prompt Types ──────────────────────────────────────────────────────────

/** Server-side prompt representation matching the MongoDB/Mongoose schema. */
export interface Prompt {
  _id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  template: string;
  variables: string[];
  systemInstruction?: string;
  modelConfig: ModelConfig;
  executionCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Community / curated template prompt (static data, not from MongoDB). */
export interface TemplatePrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  provider: Provider;
  model: string;
  template: string;
  uses: number;
  author: string;
}

// ─── Action / API Types ────────────────────────────────────────────────────

/** Input shape for creating a prompt via the server action. */
export interface CreatePromptAPIInput {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  template: string;
  systemInstruction?: string;
  modelConfig: ModelConfig;
}

/** Generic server-action result wrapper. */
export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

// ─── Component Prop Types ──────────────────────────────────────────────────

export interface CreatePromptDialogProps {
  open: boolean;
  close: () => void;
  onSuccessHandler?: () => void;
}

export interface PromptFormData {
  title: string;
  category: Category;
  description: string;
  system: string;
  template: string;
  provider: Provider;
  model: string;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface PromptCardProps {
  prompt: Prompt;
  onOpen: (p: Prompt) => void;
}

export interface PlaygroundSheetProps {
  prompt: Prompt | null;
  onOpenChange: (open: boolean) => void;
}

/** Playground execution status. */
export type PlaygroundStatus = 'idle' | 'loading' | 'done' | 'error';

/** Input shape for running a prompt via server action. */
export interface RunPromptResult {
  success: boolean;
  output?: string;
  hydratedPrompt?: string;
  executionTimeMs?: number;
  error?: string;
}

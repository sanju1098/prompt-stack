// ─── Base & Shared Primitives ───────────────────────────────────────────────

export type Provider = 'gemini' | 'groq' | string;

export type Category = 'Coding' | 'Writing' | 'Marketing' | 'Summarization' | 'General' | string;

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

// ─── Shared Base Prompt Interface ──────────────────────────────────────────

export interface BasePromptItem {
  _id: string;
  title: string;
  description?: string;
  category: Category;
  tags?: string[];
  template: string;
  variables?: string[];
  systemInstruction?: string;
  modelConfig: ModelConfig;
  createdAt?: string | { $date: string };
  updatedAt?: string | { $date: string };
}

/** Workspace Prompt saved by the user */
export interface Prompt extends BasePromptItem {
  executionCount: number;
}

/** Curated / Public Template Document */
export interface ITemplateDocument extends BasePromptItem {
  author?: string;
  uses?: number;
  isFeatured?: boolean;
}

// ─── Discriminated Card Props for Reusability ──────────────────────────────

export interface PromptCardProps {
  item: BasePromptItem;
  topBadge?: React.ReactNode;
  metric: React.ReactNode;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

// ─── Action / API Types ────────────────────────────────────────────────────

export interface CreatePromptAPIInput {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  template: string;
  systemInstruction?: string;
  modelConfig: ModelConfig;
}

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

export interface PlaygroundSheetProps {
  prompt: Prompt | null;
  onOpenChange: (open: boolean) => void;
}

export type PlaygroundStatus = 'idle' | 'loading' | 'done' | 'error';

export interface RunPromptResult {
  success: boolean;
  output?: string;
  hydratedPrompt?: string;
  executionTimeMs?: number;
  error?: string;
}

// ----------------------- Stats -----------------------
export interface WorkspaceStats {
  totalPrompts: number;
  totalTemplates: number;
  totalRuns: number;
  totalTemplateUses: number;
  providersCount: number;
  // Future extensions
  totalFavorites?: number;
  totalUsers?: number;
}

export type GetStatsResult =
  { success: true; stats: WorkspaceStats } | { success: false; error: string };

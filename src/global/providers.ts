import type { LLMProviderConfig } from './types';

export const LLM_PROVIDERS: LLMProviderConfig[] = [
  { id: 'gemini', label: 'Gemini', models: ['gemini-flash-latest'] },
  { id: 'groq', label: 'Groq', models: ['llama-3.3-70b-versatile'] },
];

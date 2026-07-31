import type { TemplatePrompt } from './types';

export const TEMPLATES: TemplatePrompt[] = [
  {
    id: 't1',
    title: 'Pull Request Reviewer',
    description: 'Reviews a diff for correctness, readability, and missing tests.',
    category: 'Coding',
    provider: 'openai',
    model: 'gpt-4.1',
    template:
      'Review this pull request diff for {{repo}}:\n\n{{diff}}\n\nList blocking issues, then nits, then missing tests.',
    uses: 1840,
    author: 'PromptStack',
  },
  {
    id: 't2',
    title: 'Cold Outreach Sequence',
    description: 'Three-touch email sequence tuned to a persona and offer.',
    category: 'Marketing',
    provider: 'gemini',
    model: 'gemini-2.5-pro',
    template:
      'Write a 3-email cold sequence for {{persona}} selling {{offer}}. Vary the angle in each email.',
    uses: 1210,
    author: 'Growth team',
  },
  {
    id: 't3',
    title: 'Release Notes Writer',
    description: 'Turns a changelog into customer-facing release notes.',
    category: 'Writing',
    provider: 'groq',
    model: 'llama-3.3-70b',
    template: 'Turn this changelog into friendly release notes for {{audience}}:\n\n{{changelog}}',
    uses: 902,
    author: 'PromptStack',
  },
  {
    id: 't4',
    title: 'Research Digest',
    description: 'Condenses long documents into a decision-ready brief.',
    category: 'Summarization',
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    template: 'Summarise {{document}} into: TL;DR, key findings, risks, and recommended next step.',
    uses: 745,
    author: 'Research guild',
  },
  {
    id: 't5',
    title: 'Support Reply Drafter',
    description: 'Writes an empathetic, on-brand support response.',
    category: 'General',
    provider: 'openai',
    model: 'gpt-4.1-mini',
    template:
      'Customer message: {{message}}\nTone: {{tone}}\n\nDraft a reply that resolves the issue and sets expectations.',
    uses: 638,
    author: 'Support team',
  },
  {
    id: 't6',
    title: 'SQL From Plain English',
    description: 'Converts a question into a validated SQL query with notes.',
    category: 'Coding',
    provider: 'groq',
    model: 'mixtral-8x7b',
    template:
      'Schema:\n{{schema}}\n\nQuestion: {{question}}\n\nReturn one SQL query plus a one-line explanation.',
    uses: 512,
    author: 'Data platform',
  },
];

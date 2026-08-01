import { BookOpen, KeyRound, Rocket, Variable, Wand2 } from 'lucide-react';

export const metadata = {
  title: 'Help & Documentation | PromptStack',
  description:
    'Find guides, tutorials, and answers to help you organize, run, and scale your AI prompt workflows with PromptVault.',
};

export default function Help() {
  const GUIDES = [
    {
      icon: Rocket,
      title: 'Getting started',
      body: 'Create your first prompt, pick a provider, and save it to the library in under a minute.',
    },
    {
      icon: Variable,
      title: 'Dynamic variables',
      body: 'Wrap a token in {{double braces}} and PromptStack detects it automatically as an input.',
    },
    {
      icon: Wand2,
      title: 'Playground runs',
      body: 'Fill in variables, execute against any provider, and copy the output straight into your work.',
    },
    {
      icon: KeyRound,
      title: 'Keys & workspaces',
      body: 'Switch workspaces from the top-left menu; each one keeps its own prompts and API keys.',
    },
  ];

  const FAQ = [
    {
      q: 'How do variables work?',
      a: 'Any {{token}} in a template becomes a labelled input in the playground. Repeat the same token to reuse the value everywhere it appears.',
    },
    {
      q: 'Can I share prompts with my team?',
      a: 'Every prompt lives inside a workspace. Invite teammates from Workspace settings and they get access to the whole library instantly.',
    },
    {
      q: 'Which providers are supported?',
      a: 'Gemini, Groq, and OpenAI models are selectable per prompt, so you can benchmark the same template across providers.',
    },
    {
      q: 'How do I switch themes?',
      a: 'Use the sun/moon button in the navbar. Your choice is remembered on this device.',
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="animate-rise">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs2">
          <BookOpen className="size-3.5 text-brand" aria-hidden />
          Documentation
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Help & docs</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Everything you need to get productive with PromptStack.
        </p>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {GUIDES.map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="rounded-2xl surface-panel p-5 transition-shadow hover:shadow-lift"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft">
              <Icon className="size-5 text-brand" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-semibold tracking-tight">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

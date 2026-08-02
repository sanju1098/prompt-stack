import {
  BarChart3,
  BookOpen,
  Code2,
  Grid,
  Layers,
  Play,
  Rocket,
  Sparkles,
  Variable,
  Wand2,
} from 'lucide-react';

export const metadata = {
  title: 'Help & Documentation | PromptStack',
  description:
    'Find guides, tutorials, and answers to help you organize, run, and scale your AI prompt workflows with PromptStack.',
};

export default function Help() {
  const GUIDES = [
    {
      icon: Rocket,
      title: 'Getting Started',
      body: 'Create your first prompt template, choose between Gemini or Groq providers, and publish it to your workspace library.',
    },
    {
      icon: Variable,
      title: 'Dynamic Variables',
      body: 'Wrap tokens in {{double_braces}}. PromptStack automatically extracts them into interactive input fields.',
    },
    {
      icon: Wand2,
      title: 'Playground Side-Sheet',
      body: 'Test prompts live without leaving your grid view. Fill in dynamic parameters and execute immediately.',
    },
    {
      icon: Layers,
      title: 'Versioned Prompt Detail',
      body: 'Deep-dive into prompt details via "View in detail" to inspect template code, execution counts, and version history.',
    },
    {
      icon: BarChart3,
      title: 'Workspace Analytics',
      body: 'Track total prompts, execution runs, and model provider distribution through unfiltered workspace aggregate stats.',
    },
    {
      icon: Grid,
      title: 'Card Previews & Tooltips',
      body: 'Cards are formatted with standardized heights for clean layout alignment. Hover over truncated text to reveal full titles and descriptions.',
    },
  ];

  const FAQ = [
    {
      q: 'Which AI model providers are supported?',
      a: 'PromptStack currently supports Gemini and Groq models. You can select your target provider per prompt to benchmark outputs across providers.',
    },
    {
      q: 'How do dynamic variables work in templates?',
      a: 'Any token formatted as {{variableName}} within a prompt template is detected automatically. Reusing the exact same variable name auto-populates its value everywhere across the prompt.',
    },
    {
      q: 'Why do global stats stay the same when I filter or search prompts?',
      a: 'Workspace stats (Total Prompts, Total Runs, Providers) measure your entire library aggregates server-side, so they remain consistent even when applying local category filters or search queries.',
    },
    {
      q: 'How do I inspect prompts with long code or descriptions?',
      a: 'Cards feature truncated previews with a 3-line code limit to maintain grid structure. Hover over short titles or descriptions to see tooltips, or click "View in detail" for full inspect mode.',
    },
    {
      q: 'Can I copy prompt code without opening the playground?',
      a: 'Yes, every prompt card includes a quick-copy button directly on the code snippet block.',
    },
    {
      q: 'How do I switch themes?',
      a: 'Use the sun/moon toggle in the top navbar. Your appearance setting persists across device sessions.',
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header Hero */}
      <div className="animate-rise">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs2">
          <BookOpen className="size-3.5 text-brand" aria-hidden />
          Documentation & Help
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Everything you need to build with <span className="text-gradient-brand">PromptStack</span>
          .
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Learn how to author variable templates, test with Gemini and Groq in the interactive
          playground, and manage workspace metrics.
        </p>
      </div>

      {/* Feature Guides Grid */}
      <section
        aria-label="Feature guides"
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {GUIDES.map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="flex flex-col rounded-2xl surface-panel p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft">
              <Icon className="size-5 text-brand" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      {/* Frequently Asked Questions */}
      <section aria-label="Frequently asked questions" className="mt-16">
        <div className="border-t border-border pt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick answers to common questions about features, models, and workflows.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {FAQ.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl surface-panel p-6 border border-border/60 bg-surface/50"
              >
                <h3 className="text-base font-medium tracking-tight text-foreground">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

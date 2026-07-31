import { Copy, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PromptCardProps } from '@/global/types';
import { cn } from '@/lib/utils';

const providerStyles: Record<string, string> = {
  gemini: 'bg-[oklch(0.95_0.04_255)] text-[oklch(0.42_0.16_260)]',
  groq: 'bg-[oklch(0.95_0.05_50)] text-[oklch(0.48_0.16_45)]',
  openai: 'bg-[oklch(0.95_0.04_165)] text-[oklch(0.42_0.11_165)]',
};

export function PromptCard({ prompt, onOpen }: PromptCardProps) {
  const vars = prompt.variables ?? [];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl surface-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:-translate-y-1">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge
            variant="secondary"
            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {prompt.category}
          </Badge>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide',
              providerStyles[prompt.modelConfig.provider]
            )}
          >
            {prompt.modelConfig.provider}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight">
              {prompt.title}
            </h3>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {prompt.description || 'No description provided.'}
          </p>
        </div>

        <pre className="mt-1 line-clamp-3 whitespace-pre-wrap wrap-break-word rounded-xl border border-border bg-surface-raised p-3 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
          {prompt.template}
        </pre>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {vars.length === 0 ? (
            <span className="text-xs text-muted-foreground">No dynamic variables</span>
          ) : (
            vars.map((v) => (
              <code
                key={v}
                className="rounded-md border border-border bg-brand-soft px-1.5 py-0.5 font-mono text-[11px] text-foreground"
              >
                {`{{${v}}}`}
              </code>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-raised/60 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{prompt.executionCount ?? 0}</span> runs
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Copy ${prompt.title} template`}
            onClick={() => {
              void navigator.clipboard?.writeText(prompt.template);
              toast.success('Template copied to clipboard');
            }}
          >
            <Copy aria-hidden />
          </Button>
          <Button size="sm" onClick={() => onOpen(prompt)}>
            <Play aria-hidden />
            Playground
          </Button>
        </div>
      </div>
    </article>
  );
}

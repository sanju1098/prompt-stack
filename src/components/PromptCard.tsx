'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PromptCardProps } from '@/global/types';
import { cn } from '@/lib/utils';

const providerStyles: Record<string, string> = {
  gemini:
    'bg-[oklch(0.95_0.04_255)] text-[oklch(0.42_0.16_260)] dark:bg-[oklch(0.25_0.08_255)] dark:text-[oklch(0.85_0.12_255)]',
  groq: 'bg-[oklch(0.95_0.05_50)] text-[oklch(0.48_0.16_45)] dark:bg-[oklch(0.28_0.08_50)] dark:text-[oklch(0.85_0.12_50)]',
};

export function PromptCard({
  item,
  topBadge,
  metric,
  primaryAction,
  secondaryAction,
}: PromptCardProps) {
  const vars = item.variables ?? [];
  const provider = item.modelConfig?.provider;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl surface-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:-translate-y-1">
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <Badge
            variant="secondary"
            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {item.category}
          </Badge>

          {/* Right Slot: Custom Badge (e.g. Featured) + Provider Pill */}
          <div className="flex items-center gap-1.5">
            {topBadge}
            {provider && (
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide',
                  providerStyles[provider] || 'bg-muted text-muted-foreground'
                )}
              >
                {provider}
              </span>
            )}
          </div>
        </div>

        {/* Title & Description with Title Props for Hover Tooltips */}
        <div className="min-w-0">
          <h3
            title={item.title}
            className="truncate text-lg font-semibold leading-snug tracking-tight text-foreground"
          >
            {item.title}
          </h3>
          <p
            title={item.description || 'No description provided.'}
            className="mt-1 line-clamp-2 h-10 text-sm leading-relaxed text-muted-foreground"
          >
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Code Box: Always reserved to 3 lines height */}
        <div className="relative mt-1 rounded-xl border border-border bg-surface-raised p-3 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Copy ${item.title} template`}
            onClick={() => {
              void navigator.clipboard?.writeText(item.template);
              toast.success('Template copied to clipboard');
            }}
            className="absolute right-2 top-2 h-7 w-7 rounded-md p-0"
          >
            <Copy className="size-3.5" aria-hidden="true" />
          </Button>
          <p className="line-clamp-3 overflow-hidden whitespace-pre-wrap wrap-break-word pr-7">
            {item.template}
          </p>
        </div>

        {/* Dynamic Variables Cloud: Aligned at bottom */}
        <div className="mt-auto flex min-h-7 flex-wrap items-center gap-1.5 pt-1">
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

      {/* Footer Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-raised/60 px-5 py-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{metric}</div>

        <div className="flex items-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
    </article>
  );
}

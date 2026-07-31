'use client';

import { useState } from 'react';
import { Search, Sparkles, Users } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/global/constants';
import { TEMPLATES } from '@/global/templates';
import type { Category } from '@/global/types';
import { cn } from '@/lib/utils';

export default function Templates() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'All'>('All');

  const q = query.trim().toLowerCase();
  const visible = TEMPLATES.filter(
    (template) =>
      (filter === 'All' || template.category === filter) &&
      (!q ||
        template.title.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q))
  );
  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="animate-rise">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs2">
          <Sparkles className="size-3.5 text-brand" aria-hidden />
          {TEMPLATES.length} curated templates
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Start from a <span className="text-gradient-brand">proven template</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Fork a template into your library, tweak the variables, and ship it.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            aria-label="Search templates"
            className="h-10 rounded-xl border-border bg-surface pl-9 shadow-xs2"
          />
        </div>
        <div
          role="tablist"
          aria-label="Filter templates by category"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {(['All', ...CATEGORIES] as const).map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={filter === category}
              onClick={() => setFilter(category)}
              className={cn(
                'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 focus-ring',
                filter === category
                  ? 'border-transparent bg-primary text-primary-foreground shadow-soft'
                  : 'border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.length === 0 ? (
          <EmptyState
            title="No templates match"
            description="Try another category or a broader search term."
          />
        ) : (
          visible.map((t) => (
            <article
              key={t.id}
              className="group flex flex-col rounded-2xl surface-panel p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold tracking-tight">{t.title}</h2>
                <Badge variant="secondary" className="shrink-0 rounded-full">
                  {t.category}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
              <pre className="mt-4 line-clamp-3 whitespace-pre-wrap rounded-xl bg-muted/60 p-3 font-mono text-xs text-muted-foreground">
                {t.template}
              </pre>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5" aria-hidden />
                  {t.uses.toLocaleString()} uses · {t.author}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="brand"
                    onClick={() => toast.success('Template forked', { description: t.title })}
                  >
                    Use
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

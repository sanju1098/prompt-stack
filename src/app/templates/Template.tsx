'use client';

import { useState } from 'react';
import { ExternalLink, GitFork, Loader2, Plus, Search, Sparkles, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { forkTemplateAction } from '@/app/actions/templateActions';
import { CreateTemplateDialog } from '@/components/CreateTemplateDialog';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/global/constants';
import type { Category } from '@/global/types';
import { cn } from '@/lib/utils';

export interface ITemplateDocument {
  _id: string;
  title: string;
  description?: string;
  template: string;
  category: Category | string;
  author: string;
  uses: number;
  tags?: string[];
  isFeatured?: boolean;
}

interface TemplatesProps {
  initialTemplates: ITemplateDocument[];
}

export function Templates({ initialTemplates }: TemplatesProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [forkingId, setForkingId] = useState<string | null>(null);
  const [isTemplateDialog, setIsTemplateDialog] = useState(false);

  // Client-side search and category filtering
  const q = query.trim().toLowerCase();
  const visibleTemplates = initialTemplates.filter(
    (template) =>
      (filter === 'All' || template.category === filter) &&
      (!q ||
        template.title.toLowerCase().includes(q) ||
        (template.description && template.description.toLowerCase().includes(q)))
  );

  // Forking action handler
  const handleFork = async (templateId: string, title: string) => {
    setForkingId(templateId);
    try {
      const res = await forkTemplateAction(templateId);
      if (res.success) {
        toast.success('Template forked into your library!', {
          description: `"${title} - Forked" has been added to your prompts.`,
        });
        router.refresh();
      } else {
        toast.error(res.error || 'Failed to fork template.');
      }
    } catch (err) {
      toast.error('An error occurred while forking the template.');
    } finally {
      setForkingId(null);
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header Section with Top-Right Create Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-rise">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs2">
            <Sparkles className="size-3.5 text-brand" aria-hidden />
            {initialTemplates.length} curated templates
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Start from a <span className="text-gradient-brand">proven template</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Fork a template into your library, tweak the variables, and execute it instantly.
          </p>
        </div>

        {/* Primary Action Button */}
        <Button
          variant="outline"
          onClick={() => setIsTemplateDialog(true)}
          className="shrink-0 rounded-xl shadow-xs2 sm:mt-2"
        >
          <Plus className="mr-1.5 size-4" aria-hidden />
          Create Template
        </Button>
      </div>

      {/* Toolbar: Search and Filter Tabs */}
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

      {/* Grid List */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visibleTemplates.length === 0 ? (
          <EmptyState
            title="No templates match"
            description="Try selecting another category or typing a broader search term."
          />
        ) : (
          visibleTemplates.map((t) => {
            const isForking = forkingId === t._id;

            return (
              <article
                key={t._id}
                className={cn(
                  'group flex flex-col justify-between rounded-2xl surface-panel p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift',
                  t.isFeatured &&
                    'border-amber-500/35 bg-linear-to-b from-amber-500/5 via-surface to-surface shadow-xs2'
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold tracking-tight">{t.title}</h2>
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      {t.isFeatured && (
                        <Badge
                          variant="outline"
                          className="gap-1 rounded-full border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                        >
                          <Star className="size-3 fill-amber-500 text-amber-500" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="secondary" className="rounded-full">
                        {t.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight">
                        {t.title}
                      </h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {t.description || 'No description provided.'}
                    </p>
                  </div>

                  <pre className="mt-4 line-clamp-3 whitespace-pre-wrap rounded-xl bg-muted/60 p-3 font-mono text-xs text-muted-foreground">
                    {t.template}
                  </pre>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" aria-hidden />
                    {(t.uses || 0).toLocaleString()} uses
                  </span>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isForking}
                      onClick={() => handleFork(t._id, t.title)}
                    >
                      {isForking ? (
                        <>
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden />
                          Forking...
                        </>
                      ) : (
                        <>
                          <GitFork className="size-3.5" aria-hidden="true" />
                          <span>Fork Template</span>
                        </>
                      )}
                    </Button>
                    <Link
                      href={`/${t._id}/template`}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2')}
                    >
                      <ExternalLink aria-hidden />
                      View in detail
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Template Creation Modal */}
      <CreateTemplateDialog
        open={isTemplateDialog}
        close={() => setIsTemplateDialog(false)}
        onSuccessHandler={() => router.refresh()}
      />
    </div>
  );
}

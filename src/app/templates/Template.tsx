'use client';

import { useState } from 'react';
import { ExternalLink, GitFork, Loader2, Plus, Search, Sparkles, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { forkTemplateAction } from '@/app/actions/templateActions';
import { CreateTemplateDialog } from '@/components/CreateTemplateDialog';
import { EmptyState } from '@/components/EmptyState';
import { PromptCard } from '@/components/PromptCard';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/global/constants';
import type { Category, ITemplateDocument } from '@/global/types';
import { cn } from '@/lib/utils';

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
        {/* <Button
          variant="outline"
          onClick={() => setIsTemplateDialog(true)}
          className="shrink-0 rounded-xl shadow-xs2 sm:mt-2"
        >
          <Plus className="mr-1.5 size-4" aria-hidden />
          Create Template
        </Button> */}
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
            actionLabel="New Template"
            onAction={() => setIsTemplateDialog(true)}
          />
        ) : (
          visibleTemplates.map((template) => {
            const isForking = forkingId === template._id;

            return (
              <PromptCard
                key={template._id}
                item={template}
                topBadge={
                  template.isFeatured ? (
                    <Badge
                      variant="outline"
                      className="gap-1 rounded-full border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10.5px] font-medium text-amber-600 dark:text-amber-400"
                    >
                      <Star className="size-3 fill-amber-500 text-amber-500" aria-hidden="true" />
                      <span>Featured</span>
                    </Badge>
                  ) : null
                }
                metric={
                  <>
                    <Users className="size-3.5" aria-hidden="true" />
                    <p>
                      <span className="font-semibold text-foreground">
                        {(template.uses ?? 0).toLocaleString()}
                      </span>{' '}
                      uses
                    </p>
                  </>
                }
                primaryAction={
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={isForking}
                    onClick={() => handleFork(template._id, template.title)}
                    className="gap-1.5"
                  >
                    {isForking ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                        <span>Forking…</span>
                      </>
                    ) : (
                      <>
                        <GitFork className="size-3.5" aria-hidden="true" />
                        <span>Use Template</span>
                      </>
                    )}
                  </Button>
                }
                secondaryAction={
                  <Link
                    href={`/${template._id}/template/`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    View in detail
                  </Link>
                }
              />
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

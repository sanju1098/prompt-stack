'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Brain, ExternalLink, Layers, Play, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getPromptsAction } from '@/app/actions/promptActions';
import { getWorkspaceStatsAction } from '@/app/actions/statsActions';
import { CreatePromptDialog } from '@/components/CreatePromptDialog';
import { EmptyState } from '@/components/EmptyState';
import { PromptCard } from '@/components/PromptCard';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORIES } from '@/global/constants';
import type { Category, Prompt, WorkspaceStats } from '@/global/types';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

const SKELETON_COUNT = 6;
const FILTER_OPTIONS = ['All', ...CATEGORIES] as const;

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [createOpen, setCreateOpen] = useState(false);

  // Stats State
  const [statsData, setStatsData] = useState<WorkspaceStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPromptsAction(debouncedSearchQuery, filter);
      if (res.success) {
        setPrompts(res.prompts as Prompt[]);
      } else {
        toast.error(res.error || 'Failed to load prompts.');
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      toast.error('An error occurred while fetching prompts.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, filter]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getWorkspaceStatsAction();
      if (res.success) {
        setStatsData(res.stats);
      } else {
        toast.error(res.error || 'Failed to load statistics.');
      }
    } catch (error) {
      console.error('Failed to fetch workspace stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleRefreshAll = useCallback(() => {
    void fetchPrompts();
    void fetchStats();
  }, [fetchPrompts, fetchStats]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const handlePromptCreated = () => {
      handleRefreshAll();
    };

    window.addEventListener('prompt-created', handlePromptCreated);
    return () => window.removeEventListener('prompt-created', handlePromptCreated);
  }, [handleRefreshAll]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrompts();
  };

  const stats = useMemo(
    () => [
      {
        label: 'Total Prompts',
        value: statsLoading || !statsData ? '…' : statsData.totalPrompts.toLocaleString(),
        icon: Layers,
      },
      {
        label: 'Total Templates',
        value: statsLoading || !statsData ? '…' : statsData.totalTemplates.toLocaleString(),
        icon: Play,
      },
      {
        label: 'Total runs',
        value: statsLoading || !statsData ? '…' : statsData.totalRuns.toLocaleString(),
        icon: Play,
      },
      {
        label: 'Providers',
        value: statsLoading || !statsData ? '…' : statsData.providersCount.toLocaleString(),
        icon: Brain,
      },
    ],
    [statsLoading, statsData]
  );

  const emptyDescription =
    searchQuery || filter !== 'All'
      ? 'Try adjusting your search query or filter category.'
      : 'Get started by creating your first AI prompt template.';

  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 grid-backdrop"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header Hero */}
        <section className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs2">
            <Sparkles className="size-3.5 text-brand" aria-hidden />
            v1.0 · Workspace
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            Your team's <span className="text-gradient-brand">prompt library</span>, versioned and
            testable.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Save reusable templates with dynamic variables, target any provider, and run them live
            in the playground — all inside Prompt Stack.
          </p>
        </section>

        {/* Stats Row */}
        <section
          aria-label="Workspace stats"
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl surface-panel p-5 transition-shadow hover:shadow-lift"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft">
                <Icon className="size-5 text-brand" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
                <p className="truncate text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Filters & Search */}
        <section className="mt-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">All prompts</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {loading ? '…' : prompts.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 rounded-xl text-sm"
                  aria-label="Search prompts"
                />
              </form>

              <div
                role="tablist"
                aria-label="Filter by category"
                className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 scrollbar-hide"
              >
                {FILTER_OPTIONS.map((filterOpt) => (
                  <button
                    key={filterOpt}
                    role="tab"
                    aria-selected={filter === filterOpt}
                    onClick={() => setFilter(filterOpt as Category | 'All')}
                    className={cn(
                      'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 focus-ring',
                      filter === filterOpt
                        ? 'border-transparent bg-primary text-primary-foreground shadow-soft'
                        : 'border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground'
                    )}
                  >
                    {filterOpt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompts Grid */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div className="flex flex-col gap-3 rounded-2xl surface-panel p-5" key={i}>
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-2/3 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-14 rounded-md" />
                    <Skeleton className="h-8 w-28 rounded-lg" />
                  </div>
                </div>
              ))
            ) : prompts.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  title="No prompts found"
                  description={emptyDescription}
                  // actionLabel="New prompt"
                  // onAction={() => setCreateOpen(true)}
                />
              </div>
            ) : (
              prompts.map((p) => (
                <PromptCard
                  key={p._id}
                  item={p}
                  metric={
                    <p>
                      <span className="font-semibold text-foreground">
                        {(p.executionCount ?? 0).toLocaleString()}
                      </span>{' '}
                      runs
                    </p>
                  }
                  primaryAction={
                    <Link
                      href={`/${p._id}/playground`}
                      className={cn(
                        buttonVariants({ variant: 'secondary', size: 'sm' }),
                        'gap-1.5'
                      )}
                    >
                      <Play className="size-3.5 mr-1.5" aria-hidden="true" />
                      Playground
                    </Link>
                  }
                  secondaryAction={
                    <Link
                      href={`/${p._id}/prompt`}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
                    >
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                      View in detail
                    </Link>
                  }
                />
              ))
            )}
          </div>
        </section>
      </div>

      <CreatePromptDialog
        open={createOpen}
        close={() => setCreateOpen(false)}
        onSuccessHandler={handleRefreshAll}
      />
    </>
  );
}

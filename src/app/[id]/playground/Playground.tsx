'use client';

import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { runPromptAction } from '@/app/actions/promptActions';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { PlaygroundStatus, Prompt } from '@/global/types';
import { extractVariables } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface PlaygroundClientProps {
  prompt: Prompt;
}

export function PlaygroundClient({ prompt }: PlaygroundClientProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<PlaygroundStatus>('idle');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Extract variables from prompt object or fallback to template string parsing
  const vars = useMemo(() => {
    if (prompt.variables && prompt.variables.length > 0) {
      return prompt.variables;
    }
    return extractVariables(prompt.template || '');
  }, [prompt]);

  const providerName = prompt.modelConfig?.provider || 'AI';
  const modelName = prompt.modelConfig?.modelName || '';

  // Server Action call
  async function run() {
    if (!prompt._id) {
      toast.error('Invalid prompt ID');
      return;
    }

    setStatus('loading');
    setError('');
    setOutput('');

    try {
      const res = await runPromptAction(prompt._id, values);

      if (res.success && res.output) {
        setOutput(res.output);
        setStatus('done');
        setExecutionTime(res.executionTimeMs || 0);

        toast.success('Prompt executed successfully!');
      } else {
        const errorMessage = res.error || 'Execution failed.';
        setError(errorMessage);
        setStatus('error');
        toast.error(errorMessage);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      setStatus('error');
      toast.error(errorMessage);
    }
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'group -ml-2 text-muted-foreground hover:text-foreground hover:bg-surface-raised hover:underline transition-all duration-200'
            )}
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />{' '}
            <span className="text-sm font-medium tracking-tight">Back to Prompt Library</span>
          </Link>

          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{prompt.title}</h1>
            <Link
              href={`/${prompt._id}/prompt`}
              className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-ring"
              title="View prompt details"
              aria-label="View prompt details"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-sm font-semibold uppercase tracking-wide text-foreground">
              {providerName}
            </span>
            <span className="font-mono text-sm text-muted-foreground">{modelName}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Panel: Variable Inputs & Action */}
        <div className="flex flex-col gap-6 lg:col-span-5 rounded-2xl surface-panel p-6 border border-border">
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Variables & Inputs</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Fill in the parameters below to evaluate the prompt template.
              </p>
            </div>

            {/* Template Code Card */}
            <div className="overflow-hidden rounded-xl border border-border bg-surface-raised shadow-xs">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2 text-[11px] font-medium text-muted-foreground">
                <span>Prompt Template</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                  Read-only
                </span>
              </div>

              <pre className="whitespace-pre-wrap wrap-break-word p-4 font-mono text-xs leading-relaxed text-foreground">
                {prompt?.template}
              </pre>
            </div>
          </div>

          {vars.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border-strong bg-surface-raised px-4 py-6 text-center text-xs text-muted-foreground">
              This prompt has no dynamic variable placeholders (`{'{{variable}}'}`). Run it as-is.
            </p>
          ) : (
            <div className="grid gap-4">
              {vars.map((v) => (
                <div key={v} className="grid gap-2">
                  <Label htmlFor={`var-${v}`} className="font-mono text-xs">
                    {`{{${v}}}`}
                  </Label>
                  <Input
                    id={`var-${v}`}
                    value={values[v] ?? ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
                    placeholder={`Value for ${v}…`}
                    className="rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            variant="brand"
            size="lg"
            className="w-full"
            onClick={run}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Running execution…
              </>
            ) : (
              <>
                <Play aria-hidden />
                Execute Prompt
              </>
            )}
          </Button>
        </div>

        {/* Right Panel: Rendered Markdown Output */}
        <div className="flex flex-col gap-4 lg:col-span-7 rounded-2xl surface-panel border border-border min-h-100">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight">Output Result</h2>

              {Boolean(executionTime && executionTime > 0) && (
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised px-2 py-0.5 font-mono text-[11px] font-normal text-muted-foreground">
                  <Clock className="size-3 text-brand" aria-hidden="true" />
                  {executionTime}ms
                </span>
              )}
            </div>
            {status === 'done' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigator.clipboard?.writeText(output);
                  toast.success('Output copied to clipboard');
                }}
              >
                <Copy className="size-3.5 mr-1.5" />
                Copy Output
              </Button>
            )}
          </div>

          <div className="flex-1 p-6">
            {status === 'idle' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Sparkles className="size-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click <strong className="text-foreground">Execute Prompt</strong> to run this
                  template and view formatted markdown results here.
                </p>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-11/12" />
              </div>
            )}

            {status === 'error' && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-destructive">Run failed</p>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={run}>
                    <RotateCcw className="size-3.5 mr-1.5" /> Retry
                  </Button>
                </div>
              </div>
            )}

            {status === 'done' && (
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

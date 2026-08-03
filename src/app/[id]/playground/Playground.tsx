'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  CornerDownLeft,
  ExternalLink,
  Loader2,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { runPromptAction } from '@/app/actions/promptActions';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [copied, setCopied] = useState(false);

  const vars = useMemo(() => {
    if (prompt.variables && prompt.variables.length > 0) {
      return prompt.variables;
    }
    return extractVariables(prompt.template || '');
  }, [prompt]);

  const providerName = prompt.modelConfig?.provider || 'AI';
  const modelName = prompt.modelConfig?.modelName || 'Default Model';

  // Computed live preview with filled variables
  const compiledPrompt = useMemo(() => {
    let result = prompt.template || '';
    Object.entries(values).forEach(([key, val]) => {
      if (val) {
        result = result.replaceAll(`{{${key}}}`, val);
      }
    });
    return result;
  }, [prompt.template, values]);

  const run = useCallback(async () => {
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
  }, [prompt._id, values]);

  // Keyboard shortcut: Cmd/Ctrl + Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (status !== 'loading') {
          void run();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [run, status]);

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Output copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Workbench Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'text-muted-foreground hover:text-foreground'
              )}
            >
              <ArrowLeft className="size-3.5 mr-1" /> Back
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
              Playground
            </Badge>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {prompt.title}
            </h1>
            <Link
              href={`/${prompt._id}/prompt`}
              className="inline-flex size-6 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="View prompt details"
            >
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs">
            <span className="font-semibold text-foreground uppercase">{providerName}</span>
            <span className="mx-2 text-muted-foreground/40">•</span>
            <span className="font-mono text-muted-foreground">{modelName}</span>
          </div>
        </div>
      </div>

      {/* Main Split Workbench Layout */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Input Panel & Prompt Template (5 cols) */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          {/* Template & Compiled View Tabs */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Tabs defaultValue="template" className="w-full">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Code2 className="size-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">Prompt Definition</span>
                </div>
                <TabsList className="h-7 bg-background p-0.5 border border-border">
                  <TabsTrigger value="template" className="h-6 px-2.5 text-[11px]">
                    Template
                  </TabsTrigger>
                  <TabsTrigger value="compiled" className="h-6 px-2.5 text-[11px]">
                    Live Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="template" className="m-0 p-4">
                <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed text-foreground">
                  {prompt?.template}
                </pre>
              </TabsContent>

              <TabsContent value="compiled" className="m-0 p-4">
                <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed text-muted-foreground">
                  {compiledPrompt}
                </pre>
              </TabsContent>
            </Tabs>
          </div>

          {/* Dynamic Variables Input Form */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-brand" />
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Variables & Arguments
                </h2>
              </div>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {vars.length} {vars.length === 1 ? 'Variable' : 'Variables'}
              </Badge>
            </div>

            {vars.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                No dynamic placeholders (`{'{{variable}}'}`) found in this template. Ready to run.
              </div>
            ) : (
              <div className="space-y-4">
                {vars.map((v) => (
                  <div key={v} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`var-${v}`} className="font-mono text-xs text-foreground">
                        {`{{${v}}}`}
                      </Label>
                      <span className="text-[10px] text-muted-foreground">Dynamic input</span>
                    </div>

                    {/* Container-based focus state to eliminate highlight gap artifacts */}
                    <div className="rounded-lg border border-input bg-background p-1 transition-all focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                      <textarea
                        id={`var-${v}`}
                        value={values[v] ?? ''}
                        onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
                        placeholder={`Enter ${v}...`}
                        rows={5}
                        className="w-full resize-y bg-transparent px-2 py-1.5 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Run Trigger Section */}
            <div className="mt-5 pt-3 border-t border-border">
              <Button
                variant="brand"
                size="lg"
                className="w-full gap-2 shadow-sm"
                onClick={run}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Executing Prompt...
                  </>
                ) : (
                  <>
                    <Play className="size-4 fill-current" />
                    <span>Run Playground</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Output Console (7 cols) */}
        <div className="flex min-h-150 flex-col rounded-xl border border-border bg-card shadow-xs lg:col-span-7">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Execution Output
              </h2>

              {Boolean(executionTime && executionTime > 0) && (
                <Badge variant="outline" className="gap-1 font-mono text-[10px]">
                  <Clock className="size-3 text-brand" />
                  {executionTime}ms
                </Badge>
              )}
            </div>

            {status === 'done' && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-1.5 text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy Response
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Console Output Body */}
          <div className="flex flex-1 flex-col justify-between p-6">
            {status === 'idle' && (
              <div className="my-auto flex flex-col items-center justify-center text-center">
                <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted/30">
                  <Sparkles className="size-6 text-muted-foreground/60" />
                </div>
                <h3 className="mt-3 text-sm font-medium text-foreground">Ready for Execution</h3>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  Fill in your template variables on the left and hit{' '}
                  <strong className="text-foreground">Run Playground</strong> or press{' '}
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                    ⌘ + Enter
                  </kbd>
                  .
                </p>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin text-brand" />
                  <span>Generating response from {modelName}...</span>
                </div>
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-destructive">Execution Failed</p>
                    <p className="text-xs text-muted-foreground">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-1.5 text-xs"
                      onClick={run}
                    >
                      <RotateCcw className="size-3" /> Retry Run
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {status === 'done' && (
              <div className="prose prose-xs dark:prose-invert max-w-none text-foreground leading-relaxed">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}

            {/* Bottom Status Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'size-2 rounded-full',
                    status === 'done'
                      ? 'bg-emerald-500'
                      : status === 'loading'
                        ? 'bg-amber-500 animate-pulse'
                        : status === 'error'
                          ? 'bg-destructive'
                          : 'bg-muted-foreground/40'
                  )}
                />
                Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <CornerDownLeft className="size-3" /> Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

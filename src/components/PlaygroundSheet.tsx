'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Copy, Loader2, Play, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { runPromptAction } from '@/app/actions/promptActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import type { PlaygroundSheetProps, PlaygroundStatus } from '@/global/types';
import { extractVariables } from '@/lib/helpers';

export function PlaygroundSheet({ prompt, onOpenChange }: PlaygroundSheetProps) {
  // Extract dynamic variables from prompt.variables array, fallback to template parsing
  const vars = useMemo(() => {
    if (!prompt) return [];
    if (prompt.variables && prompt.variables.length > 0) {
      return prompt.variables;
    }
    return extractVariables(prompt.template || '');
  }, [prompt]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<PlaygroundStatus>('idle');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Extract provider & model from the modelConfig object
  const providerName = prompt?.modelConfig?.provider || 'AI';
  const modelName = prompt?.modelConfig?.modelName || '';

  // Reset internal sheet state whenever active prompt changes
  useEffect(() => {
    setValues({});
    setStatus('idle');
    setOutput('');
    setError('');
  }, [prompt?._id]);

  // Execute prompt action
  async function run() {
    if (!prompt) return;

    const promptId = prompt._id;
    if (!promptId) {
      toast.error('Invalid prompt ID');
      return;
    }

    setStatus('loading');
    setError('');
    setOutput('');

    try {
      const res = await runPromptAction(promptId, values);

      if (res.success && res.output) {
        setOutput(res.output);
        setStatus('done');
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
    <Sheet open={!!prompt} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto border-l border-border p-0 shadow-overlay sm:max-w-lg">
        {prompt && (
          <>
            <SheetHeader className="space-y-2 border-b border-border px-6 py-5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-foreground">
                  {providerName}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{modelName}</span>
              </div>
              <SheetTitle className="text-xl tracking-tight">{prompt.title}</SheetTitle>
              <SheetDescription>
                Fill in the variable values below to test this prompt live.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 px-6 py-6">
              {vars.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border-strong bg-surface-raised px-4 py-5 text-center text-sm text-muted-foreground">
                  This prompt has no variable placeholders. Run it as-is.
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
                    Running…
                  </>
                ) : (
                  <>
                    <Play aria-hidden />
                    Execute prompt
                  </>
                )}
              </Button>

              {/* Skeleton loading animation */}
              {status === 'loading' && (
                <div className="space-y-2.5 rounded-2xl surface-panel p-5">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-4 w-11/12" />
                </div>
              )}

              {/* Error Alert Box */}
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
                      <RotateCcw aria-hidden />
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              {/* Successful Output Box */}
              {status === 'done' && (
                <div className="animate-rise overflow-hidden rounded-2xl surface-panel">
                  <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                    <p className="text-xs font-medium text-muted-foreground">Output</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        void navigator.clipboard?.writeText(output);
                        toast.success('Output copied to clipboard');
                      }}
                    >
                      <Copy aria-hidden />
                      Copy
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap wrap-break-word px-4 py-4 font-mono text-[12.5px] leading-relaxed">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

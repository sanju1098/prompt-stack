import { AlertTriangle, ArrowLeft, Code2, Cpu, FileX, Layers } from 'lucide-react';
import Link from 'next/link';
import { getPromptById } from '@/app/actions/promptActions';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { nodeSnippet, pythonSnippet } from '../../../lib/codeSnippet';

export default async function PromptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const promptID = resolvedParams.id || 'Unknown ID';
  const result = await getPromptById(promptID);

  if (!result?.success || !result?.data) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center animate-rise">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          {result?.isInvalidId ? (
            <AlertTriangle className="h-8 w-8" />
          ) : (
            <FileX className="h-8 w-8" />
          )}
        </div>

        <Badge variant="outline" className="mb-2 border-destructive/30 text-destructive">
          {result?.isInvalidId ? 'Invalid ID Format' : '404 Not Found'}
        </Badge>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {result?.isInvalidId ? 'Invalid Prompt Identifier' : 'Prompt Not Found'}
        </h1>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {result?.error || 'Could not retrieve prompt specifications.'}
        </p>

        <Link href="/" className={cn(buttonVariants({ variant: 'default' }), 'mt-6')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  const {
    category,
    modelConfig = {},
    title,
    description,
    template,
    systemInstruction,
    variables = [],
    executionCount = 0,
  } = result.data;

  const tsCode = nodeSnippet(modelConfig.provider, result.data);
  const pyCode = pythonSnippet(modelConfig.provider, result.data);

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10 space-y-8 animate-rise">
      {/* Navigation Header */}
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
      </div>

      {/* Main Metadata Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-border pb-8">
        <div className="space-y-3 max-w-2xl">
          {/* Category & Provider Badges */}
          <div className="flex items-center gap-2.5">
            <Badge
              variant="secondary"
              className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {category}
            </Badge>

            <span className="rounded-full border px-3 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide bg-success text-success-foreground border-border">
              {modelConfig.provider} {modelConfig.provider && `• ${modelConfig.modelName}`}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            {description || 'No description provided for this prompt template.'}
          </p>
        </div>

        <div className="rounded-2xl border border-border surface-panel p-5 shadow-xs2">
          <div className="flex items-start gap-5">
            {/* Left: Variables Tag Cloud */}
            <div className="flex-1 space-y-2 pr-5 border-r border-border/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Variables{' '}
                <span className="font-mono text-xs text-muted-foreground">
                  ({variables.length})
                </span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {variables.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No variables.</p>
                ) : (
                  variables.map((val: string) => (
                    <code
                      key={val}
                      className="rounded-md border border-border bg-brand-soft px-2 py-1 font-mono text-xs text-foreground"
                    >
                      {`{{${val}}}`}
                    </code>
                  ))
                )}
              </div>
            </div>

            {/* Right: Total Runs Stat */}
            <div className="flex flex-col items-center justify-center min-w-24 text-center py-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {executionCount ?? 0}
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Runs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-md font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Prompt Template
            </h2>
          </div>

          <pre className="whitespace-pre-wrap wrap-break-word rounded-2xl border border-border bg-surface-raised p-5 font-mono text-sm leading-relaxed text-foreground shadow-xs2">
            {template}
          </pre>
        </div>
      </div>

      {systemInstruction && (
        <>
          <hr />
          <div className="grid grid-cols-1 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-md font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  System Instruction
                </h2>
              </div>

              <pre className="whitespace-pre-wrap wrap-break-word rounded-2xl border border-border bg-surface-raised p-5 font-mono text-sm leading-relaxed text-foreground shadow-xs2">
                {systemInstruction}
              </pre>
            </div>
          </div>
        </>
      )}

      <hr />

      <div className="space-y-1.5 mb-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-md font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Code2 className="h-4 w-4 " />
            Integration Snippets
          </h2>
          <span className="rounded-md border border-border bg-surface-raised px-2 py-0.5 font-mono text-xs text-muted-foreground">
            Pre-configured SDK Code
          </span>
        </div>

        {/* Description Subtitle */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          Copy ready-to-use boilerplate code for{' '}
          <strong className="font-semibold text-foreground">{title}</strong> using the target SDK.
        </p>
      </div>
      {/* Code Integration Section */}
      <Tabs defaultValue="typescript" className="w-full space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="typescript">TypeScript / Node.js</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="typescript" className="relative mt-0 w-full">
          <pre className="p-5 rounded-2xl border border-border bg-surface-raised font-mono text-[13px] leading-relaxed text-foreground overflow-x-auto shadow-xs2">
            {tsCode}
          </pre>
        </TabsContent>

        <TabsContent value="python" className="relative mt-0 w-full">
          <pre className="p-5 rounded-2xl border border-border bg-surface-raised font-mono text-[13px] leading-relaxed text-foreground overflow-x-auto shadow-xs2">
            {pyCode}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}

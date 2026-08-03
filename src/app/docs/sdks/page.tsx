'use client';

import { useState } from 'react';
import { Check, Copy, Package } from 'lucide-react';

export default function SdksDocsPage() {
  const [activeTab, setActiveTab] = useState<'node' | 'python' | 'curl'>('node');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const nodeCode = `import { PromptStack } from '@promptstack/sdk';

const client = new PromptStack({
  apiKey: process.env.PROMPTSTACK_API_KEY!,
});

async function main() {
  const promptId = 'YOUR_PROMPT_ID';

  // Execute prompt using Google Gemini or Groq
  const result = await client.prompts.run(promptId, {
    variableValues: {
      user_request: 'Your template variable value here',
    },
  });

  if (result.success) {
    console.log('Output:', result.output);
    console.log('Execution Time:', result.executionTimeMs, 'ms');
  }
}

main();`;

  const pythonCode = `from promptstack import PromptStack
import os

client = PromptStack(
    api_key=os.environ.get("PROMPTSTACK_API_KEY")
)

# Run prompt (backed by Google Gemini or Groq)
response = client.prompts.run(
    prompt_id="YOUR_PROMPT_ID",
    variable_values={
        "user_request": "Your template variable value here"
    }
)

if response.get("success"):
    print("Output:", response["output"])
    print("Latency:", response["executionTimeMs"], "ms")`;

  const curlCode = `curl -X POST "https://api.promptstack.dev/v1/prompts/YOUR_PROMPT_ID/run" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "variableValues": {
      "user_request": "Your template variable value here"
    }
  }'`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <Package className="size-4 text-brand" /> SDK Integration
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Client SDKs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Execute prompts programmatically powered by Google Gemini and Groq inference models.
          </p>

          {/* Connected Providers */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Supported Inference Engines:</span>
            <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs text-foreground">
              Google Gemini
            </span>
            <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs text-foreground">
              Groq
            </span>
          </div>
        </div>

        {/* Installation */}
        <div className="mt-8 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            1. Installation
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground">TypeScript / Node.js</span>
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs">
                <code>npm install @promptstack/sdk</code>
                <button
                  onClick={() => copyToClipboard('npm install @promptstack/sdk', 'npm')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === 'npm' ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground">Python</span>
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs">
                <code>pip install promptstack</code>
                <button
                  onClick={() => copyToClipboard('pip install promptstack', 'pip')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === 'pip' ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              2. Dynamic Execution
            </h2>

            {/* Language Switcher */}
            <div className="flex rounded-md border border-border bg-muted/60 p-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab('node')}
                className={`rounded px-2.5 py-1 transition-all ${
                  activeTab === 'node'
                    ? 'bg-background text-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setActiveTab('python')}
                className={`rounded px-2.5 py-1 transition-all ${
                  activeTab === 'python'
                    ? 'bg-background text-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveTab('curl')}
                className={`rounded px-2.5 py-1 transition-all ${
                  activeTab === 'curl'
                    ? 'bg-background text-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                cURL
              </button>
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="relative mt-4">
            <button
              onClick={() =>
                copyToClipboard(
                  activeTab === 'node' ? nodeCode : activeTab === 'python' ? pythonCode : curlCode,
                  'code'
                )
              }
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded border border-border bg-background/80 px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
            >
              {copiedKey === 'code' ? (
                <Check className="size-3 text-emerald-500" />
              ) : (
                <Copy className="size-3" />
              )}
              <span>{copiedKey === 'code' ? 'Copied' : 'Copy'}</span>
            </button>

            <pre className="overflow-x-auto rounded-md border border-border bg-slate-950 p-4 font-mono text-xs text-slate-100 leading-relaxed">
              <code>
                {activeTab === 'node' ? nodeCode : activeTab === 'python' ? pythonCode : curlCode}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

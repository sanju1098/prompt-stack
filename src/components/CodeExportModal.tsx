'use client';

import { useState } from 'react';
import { Check, Code2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Prompt } from '@/global/types';

interface CodeExportModalProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CodeExportModal({ prompt, open, onOpenChange }: CodeExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const isGemini = prompt.modelConfig.provider === 'gemini';

  // Generate Node.js / TypeScript code snippet
  const nodeSnippet = isGemini
    ? `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runPrompt(variables: Record<string, string>) {
  // Hydrate template
  let promptText = \`${prompt.template.replace(/`/g, '\\`')}\`;
  Object.entries(variables).forEach(([key, val]) => {
    promptText = promptText.replace(new RegExp(\`{{\\\\s*\${key}\\\\s*}}\`, 'g'), val);
  });

  const response = await ai.models.generateContent({
    model: '${prompt.modelConfig.modelName}',
    contents: promptText,
    config: {
      temperature: ${prompt.modelConfig.temperature},
      ${prompt.systemInstruction ? `systemInstruction: \`${prompt.systemInstruction}\`,` : ''}
    },
  });

  return response.text;
}`
    : `import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runPrompt(variables: Record<string, string>) {
  let promptText = \`${prompt.template.replace(/`/g, '\\`')}\`;
  Object.entries(variables).forEach(([key, val]) => {
    promptText = promptText.replace(new RegExp(\`{{\\\\s*\${key}\\\\s*}}\`, 'g'), val);
  });

  const completion = await groq.chat.completions.create({
    messages: [
      ${prompt.systemInstruction ? `{ role: 'system', content: \`${prompt.systemInstruction}\` },` : ''}
      { role: 'user', content: promptText }
    ],
    model: '${prompt.modelConfig.modelName}',
    temperature: ${prompt.modelConfig.temperature},
  });

  return completion.choices[0]?.message?.content;
}`;

  // Generate Python code snippet
  const pythonSnippet = isGemini
    ? `import os
from google import genai

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def run_prompt(variables: dict):
    template = """${prompt.template}"""
    for key, val in variables.items():
        template = template.replace(f"{{{{{key}}}}}", str(val))
        
    response = client.models.generate_content(
        model="${prompt.modelConfig.modelName}",
        contents=template,
        config={
            "temperature": ${prompt.modelConfig.temperature},
            ${prompt.systemInstruction ? `"system_instruction": """${prompt.systemInstruction}""",` : ''}
        }
    )
    return response.text`
    : `import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def run_prompt(variables: dict):
    template = """${prompt.template}"""
    for key, val in variables.items():
        template = template.replace(f"{{{{{key}}}}}", str(val))
        
    messages = []
    ${prompt.systemInstruction ? `messages.append({"role": "system", "content": """${prompt.systemInstruction}"""})` : ''}
    messages.append({"role": "user", "content": template})

    completion = client.chat.completions.create(
        model="${prompt.modelConfig.modelName}",
        messages=messages,
        temperature=${prompt.modelConfig.temperature}
    )
    return completion.choices[0].message.content`;

  const handleCopy = (code: string) => {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
    toast.success('Code snippet copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <DialogTitle>Export Integration Code</DialogTitle>
          </div>
          <DialogDescription>
            Copy ready-to-use boilerplate code for <strong>{prompt.title}</strong> using the target
            SDK.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="typescript" className="w-full pt-2">
          <div className="flex items-center justify-between pb-2">
            <TabsList>
              <TabsTrigger value="typescript">TypeScript / Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="typescript" className="relative space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(nodeSnippet)}
              className="absolute right-3 top-3 z-10 h-8 gap-1.5 bg-background text-xs"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <pre className="p-4 rounded-lg bg-muted font-mono text-xs overflow-x-auto border max-h-90 leading-relaxed">
              {nodeSnippet}
            </pre>
          </TabsContent>

          <TabsContent value="python" className="relative space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(pythonSnippet)}
              className="absolute right-3 top-3 z-10 h-8 gap-1.5 bg-background text-xs"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <pre className="p-4 rounded-lg bg-muted font-mono text-xs overflow-x-auto border max-h-90 leading-relaxed">
              {pythonSnippet}
            </pre>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { ArrowUpRight, Code2 } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-background/50 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Info & Operational Status */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5 font-semibold text-lg tracking-tight text-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
                <Code2 className="size-4" />
              </div>
              <span>PromptStack</span>
              <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-normal text-muted-foreground">
                v1.0.0
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              The high-performance prompt engineering playground for AI teams. Test, version, and
              deploy LLM prompts seamlessly into production.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-all duration-200 hover:border-border-strong hover:text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-medium text-emerald-500">All systems operational</span>
            </div>
          </div>

          {/* Column 2: Developers */}
          {/* Column 2: Developers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Developers
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/docs/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  <span>API Reference</span>
                  <ArrowUpRight className="size-3 text-muted-foreground/70" />
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/sdks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  <span>SDK Integration</span>
                  <ArrowUpRight className="size-3 text-muted-foreground/70" />
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/sanju1098/prompt-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  <span>GitHub Repo</span>
                  <ArrowUpRight className="size-3 text-muted-foreground/70" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Modals */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              {/* Terms of Service Modal */}
              <li>
                <Dialog>
                  <DialogTrigger className="text-left text-sm text-muted-foreground cursor-pointer transition-colors hover:text-foreground">
                    Terms of Service
                  </DialogTrigger>
                  <DialogContent className="max-w-xl sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Terms of Service</DialogTitle>
                      <DialogDescription>Last updated: August 2026</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-muted-foreground">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                          1. Acceptance & Accounts
                        </h4>
                        <p>
                          By using PromptStack, you agree to these Terms. You are responsible for
                          maintaining the security of your account, API keys, and workspace.
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                          2. Data Ownership & Privacy
                        </h4>
                        <p>
                          You retain 100% ownership of your prompt templates, variables, and
                          outputs. PromptStack never uses your private data to train public AI
                          models.
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">3. Acceptable Use</h4>
                        <p>
                          Malicious acts, prompt injection attacks targeting safety filters,
                          rate-limit evasion, and infrastructure reverse-engineering are strictly
                          prohibited.
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                          4. Third-Party Integrations
                        </h4>
                        <p>
                          Executions route to third-party providers. PromptStack is provided "as is"
                          and is not liable for upstream provider outages.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>

              {/* Privacy Policy Modal */}
              <li>
                <Dialog>
                  <DialogTrigger className="text-left text-sm text-muted-foreground cursor-pointer transition-colors hover:text-foreground">
                    Privacy Policy
                  </DialogTrigger>
                  <DialogContent className="max-w-xl sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                      <DialogDescription>
                        How PromptStack handles and protects your data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-muted-foreground">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                          1. Data Collection
                        </h4>
                        <p>
                          We collect minimal information necessary to operate PromptStack, including
                          account credentials, prompt metadata, and platform usage analytics.
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                          2. AI Model Training
                        </h4>
                        <p>
                          Your prompts, dynamic variable inputs, and LLM outputs are private.
                          PromptStack never sells your data or uses it to train public AI models.
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                          3. Security & Key Storage
                        </h4>
                        <p>
                          Third-party API keys are encrypted at rest. Decryption occurs strictly in
                          volatile memory during active prompt execution runs.
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                          4. Third-Party Services
                        </h4>
                        <p>
                          Prompt execution requests pass directly to designated LLM providers
                          (Google, Groq) under standard API encryption standards.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/60 pt-8 text-xs text-muted-foreground">
          <p>© {currentYear} PromptStack, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

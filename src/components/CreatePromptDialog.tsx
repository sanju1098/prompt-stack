import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { createPromptAction } from '@/app/actions/promptActions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/global/constants';
import { LLM_PROVIDERS } from '@/global/providers';
import type { Category, CreatePromptDialogProps, PromptFormData, Provider } from '@/global/types';
import { extractVariables } from '@/lib/helpers';

export function CreatePromptDialog({ open, close, onSuccessHandler }: CreatePromptDialogProps) {
  const INITIAL_FORM_DATA: PromptFormData = {
    title: '',
    category: 'Coding',
    description: '',
    system: '',
    template: '',
    provider: 'gemini',
    model: 'gemini-2.5-flash',
  };

  const [formData, setFormData] = useState<PromptFormData>(INITIAL_FORM_DATA);
  const [showErrors, setShowErrors] = useState(false);
  const [isFormSaving, setIsFormSaving] = useState(false);

  // Reset form state whenever the dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_FORM_DATA);
      setShowErrors(false);
      setIsFormSaving(false);
    }
  }, [open]);

  const templateVariables = useMemo(() => extractVariables(formData.template), [formData.template]);

  const availableModels = useMemo(
    () => LLM_PROVIDERS.find((p) => p.id === formData.provider)?.models ?? [],
    [formData.provider]
  );

  // Validation checks
  const isTitleInvalid = !formData.title.trim();
  const isTemplateInvalid = !formData.template.trim();

  const titleError = showErrors && isTitleInvalid ? 'A title is required.' : '';
  const templateError = showErrors && isTemplateInvalid ? 'A template is required.' : '';

  function handleFieldChange(field: keyof PromptFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleProviderChange(selectedProvider: Provider) {
    const defaultModel =
      LLM_PROVIDERS.find((llmProvider) => llmProvider.id === selectedProvider)?.models[0] ?? '';

    setFormData((prev) => ({
      ...prev,
      provider: selectedProvider,
      model: defaultModel,
    }));
  }

  // Form submission handler with try/catch
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isTitleInvalid || isTemplateInvalid) {
      setShowErrors(true);
      return;
    }

    setIsFormSaving(true);

    try {
      const res = await createPromptAction({
        title: formData?.title,
        description: formData?.description,
        category: formData?.category,
        template: formData?.template,
        systemInstruction: formData?.system,
        modelConfig: {
          provider: formData?.provider,
          modelName: formData?.model,
          temperature: 0.7,
          maxTokens: 1024,
        },
      });

      if (res?.success) {
        toast.success('Prompt created successfully!');
        setFormData(INITIAL_FORM_DATA);
        close();
        if (onSuccessHandler) {
          onSuccessHandler();
        }
      } else {
        toast.error(res?.error || 'Failed to create prompt.');
      }
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsFormSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && close()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-overlay sm:max-w-2xl">
        <DialogHeader className="shrink-0 space-y-1 border-b border-border px-6 py-4 text-left">
          <DialogTitle className="text-xl tracking-tight">Create new prompt</DialogTitle>
          <DialogDescription>
            Use{' '}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              {'{{variable}}'}
            </code>{' '}
            syntax to create dynamic input fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid flex-1 gap-3.5 overflow-y-auto px-6 py-4">
            {/* Row 1: Title & Category */}
            <div className="grid gap-3.5 sm:grid-cols-[minmax(0,1fr)_180px]">
              <div className="grid gap-1.5">
                <Label htmlFor="prompt-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prompt-title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Code Refactor & Explain"
                  aria-invalid={!!titleError}
                  className="rounded-xl"
                />
                {titleError && <p className="text-xs text-destructive">{titleError}</p>}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="prompt-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => {
                    if (val) handleFieldChange('category', val as Category);
                  }}
                >
                  <SelectTrigger id="prompt-category" className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" className="rounded-xl">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Short description & System instruction */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="prompt-desc">Short description</Label>
                <Input
                  id="prompt-desc"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="What does this prompt do?"
                  className="rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="prompt-system">System instruction (optional)</Label>
                <Input
                  id="prompt-system"
                  value={formData.system}
                  onChange={(e) => handleFieldChange('system', e.target.value)}
                  placeholder="e.g. You are a senior engineer."
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Row 3: Template */}
            <div className="grid gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="prompt-template">
                  Prompt template <span className="text-destructive">*</span>
                </Label>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-brand" aria-hidden />
                  Auto-detects variables
                </span>
              </div>

              {/* 5. Added max-h-48 and min-h-[100px] to constrain the Textarea */}
              <Textarea
                id="prompt-template"
                value={formData.template}
                onChange={(e) => handleFieldChange('template', e.target.value)}
                placeholder="Explain {{concept}} in simple terms for a {{audience}}."
                rows={4}
                aria-invalid={!!templateError}
                className="min-h-25 max-h-48 rounded-xl font-mono text-[13px] leading-relaxed"
              />

              {templateError ? (
                <p className="text-xs text-destructive">{templateError}</p>
              ) : templateVariables.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {templateVariables.map((variable) => (
                    <code
                      key={variable}
                      className="rounded-md border border-border bg-brand-soft px-1.5 py-0.5 font-mono text-[11px]"
                    >
                      {`{{${variable}}}`}
                    </code>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No variables detected yet.</p>
              )}
            </div>

            {/* Row 4: AI Provider & Model Target */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="prompt-provider">AI provider</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(val) => {
                    if (val) handleProviderChange(val as Provider);
                  }}
                >
                  <SelectTrigger id="prompt-provider" className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" className="rounded-xl">
                    {LLM_PROVIDERS.map((llmProvider) => (
                      <SelectItem key={llmProvider.id} value={llmProvider.id}>
                        {llmProvider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="prompt-model">Model target</Label>
                <Select
                  value={formData.model}
                  onValueChange={(val) => {
                    if (val) handleFieldChange('model', val);
                  }}
                >
                  <SelectTrigger id="prompt-model" className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" className="rounded-xl">
                    {availableModels.map((mod) => (
                      <SelectItem key={mod} value={mod} className="text-sm">
                        {mod}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 6. Added shrink-0 to keep footer locked at bottom */}
          <DialogFooter className="m-0 shrink-0 flex justify-start border-t border-border bg-surface-raised/60 px-6 py-3.5 gap-2 md:items-center md:justify-end">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={isFormSaving}>
              {isFormSaving ? 'Saving…' : 'Save prompt'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createTemplateAction } from '@/app/actions/templateActions';
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
import type { Category, Provider } from '@/global/types';
import { extractVariables } from '@/lib/parser';

interface CreateTemplateDialogProps {
  open: boolean;
  close: () => void;
  onSuccessHandler?: () => void;
}

interface TemplateFormData {
  title: string;
  category: Category;
  description: string;
  system: string;
  template: string;
  author: string;
  isFeatured: boolean;
  provider: Provider;
  model: string;
}

const INITIAL_FORM_DATA: TemplateFormData = {
  title: '',
  category: 'Coding',
  description: '',
  system: '',
  template: '',
  author: 'PromptVault',
  isFeatured: false,
  provider: 'gemini',
  model: 'gemini-2.5-flash',
};

export function CreateTemplateDialog({ open, close, onSuccessHandler }: CreateTemplateDialogProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<TemplateFormData>(INITIAL_FORM_DATA);
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_FORM_DATA);
      setShowErrors(false);
      setIsSaving(false);
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

  function handleFieldChange(field: keyof TemplateFormData, value: any) {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isTitleInvalid || isTemplateInvalid) {
      setShowErrors(true);
      return;
    }

    setIsSaving(true);

    try {
      const res = await createTemplateAction({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        template: formData.template,
        systemInstruction: formData.system,
        author: formData.author || 'PromptVault',
        isFeatured: formData.isFeatured,
        variables: templateVariables,
        modelConfig: {
          provider: formData.provider,
          modelName: formData.model,
          temperature: 0.7,
          maxTokens: 1024,
        },
      });

      if (res.success) {
        toast.success('Public template published successfully!');
        setFormData(INITIAL_FORM_DATA);
        close();

        // Refresh route automatically to show newly added template
        router.refresh();
        if (onSuccessHandler) {
          onSuccessHandler();
        }
      } else {
        toast.error(res.error || 'Failed to publish template.');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && close()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-overlay sm:max-w-2xl">
        <DialogHeader className="shrink-0 space-y-1 border-b border-border px-6 py-4 text-left">
          <DialogTitle className="text-xl tracking-tight">Add Curated Template</DialogTitle>
          <DialogDescription>
            Publish a public template to the template marketplace. Use{' '}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              {'{{variable}}'}
            </code>{' '}
            syntax for dynamic variables.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid flex-1 gap-3.5 overflow-y-auto px-6 py-4">
            {/* Row 1: Title & Category */}
            <div className="grid gap-3.5 sm:grid-cols-[minmax(0,1fr)_180px]">
              <div className="grid gap-1.5">
                <Label htmlFor="tpl-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tpl-title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Next.js Code Reviewer"
                  aria-invalid={!!titleError}
                  className="rounded-xl"
                />
                {titleError && <p className="text-xs text-destructive">{titleError}</p>}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="tpl-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => val && handleFieldChange('category', val as Category)}
                >
                  <SelectTrigger id="tpl-category" className="rounded-xl">
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

            {/* Row 2: Author & Featured */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="tpl-author">Author</Label>
                <Input
                  id="tpl-author"
                  value={formData.author}
                  onChange={(e) => handleFieldChange('author', e.target.value)}
                  placeholder="e.g. PromptVault Team"
                  className="rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="tpl-featured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleFieldChange('isFeatured', e.target.checked)}
                  className="size-4 rounded border-border text-brand focus:ring-brand"
                />
                <Label htmlFor="tpl-featured" className="cursor-pointer">
                  Feature on marketplace top list
                </Label>
              </div>
            </div>

            {/* Row 3: Description (Full Row) */}
            <div className="grid gap-1.5">
              <Label htmlFor="tpl-desc">Description</Label>
              <Textarea
                id="tpl-desc"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Overview of what this template does..."
                rows={2}
                className="min-h-16 rounded-xl text-sm"
              />
            </div>

            {/* Row 4: System Instruction (Full Row) */}
            <div className="grid gap-1.5">
              <Label htmlFor="tpl-system">System Instruction (optional)</Label>
              <Textarea
                id="tpl-system"
                value={formData.system}
                onChange={(e) => handleFieldChange('system', e.target.value)}
                placeholder="e.g. You are a senior software architect..."
                rows={2}
                className="min-h-16 rounded-xl text-sm"
              />
            </div>

            {/* Row 5: Prompt Template */}
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="tpl-template">
                  Prompt Template <span className="text-destructive">*</span>
                </Label>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-brand" aria-hidden />
                  Auto-detects variables
                </span>
              </div>
              <Textarea
                id="tpl-template"
                value={formData.template}
                onChange={(e) => handleFieldChange('template', e.target.value)}
                placeholder="Analyze this code snippet: {{code}}"
                rows={4}
                aria-invalid={!!templateError}
                className="min-h-25 max-h-48 rounded-xl font-mono text-[13px]"
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

            {/* Row 6: AI Provider & Target Model */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="tpl-provider">AI Provider</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(val) => val && handleProviderChange(val as Provider)}
                >
                  <SelectTrigger id="tpl-provider" className="w-full rounded-xl">
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
                <Label htmlFor="tpl-model">Model Target</Label>
                <Select
                  value={formData.model}
                  onValueChange={(val) => val && handleFieldChange('model', val)}
                >
                  <SelectTrigger id="tpl-model" className="w-full rounded-xl">
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

          <DialogFooter className="m-0 shrink-0 border-t border-border bg-surface-raised/60 px-6 py-3.5">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={isSaving}>
              {isSaving ? 'Publishing…' : 'Publish Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

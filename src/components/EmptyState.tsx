import { FileSearch, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EmptyStateProps } from '@/global/types';

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft">
        <FileSearch className="size-6 text-brand" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button variant="brand" className="mt-6" onClick={onAction}>
        <Plus aria-hidden />
        {actionLabel}
      </Button>
    </div>
  );
}

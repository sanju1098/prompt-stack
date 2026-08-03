import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 p-6 animate-rise">
      <div className="relative flex items-center justify-center">
        {/* Subtle background pulse aura */}
        <span className="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-brand/20" />

        {/* Main spinner */}
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>

      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}

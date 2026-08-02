import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getPromptById } from '@/app/actions/promptActions';
import { Button } from '@/components/ui/button';
import type { Prompt } from '@/global/types';
import { PlaygroundClient } from './Playground';

export default async function PlaygroundPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const promptID = resolvedParams.id || '';
  const result = await getPromptById(promptID);

  if (!result?.success || !result?.data) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center animate-rise">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-xl font-semibold">Prompt not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The requested prompt could not be found or has been removed.
          </p>
          <Link href="/" className="mt-4 inline-flex">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" /> Back to Library
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <PlaygroundClient prompt={result?.data} />;
}

'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreatePromptDialog } from '@/components/CreatePromptDialog';
import { Button } from '@/components/ui/button';
import type { Prompt } from '@/global/types';

interface EditPromptButtonProps {
  prompt: Prompt;
}

export function EditPromptButton({ prompt }: EditPromptButtonProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditOpen(true)}
        className="rounded-xl gap-1.5"
      >
        <Pencil className="size-3.5" />
        Edit Prompt
      </Button> */}

      <CreatePromptDialog
        open={isEditOpen}
        promptToEdit={prompt}
        close={() => setIsEditOpen(false)}
        onSuccessHandler={() => {
          router.refresh(); // Refresh Server Component data on successful edit
        }}
      />
    </>
  );
}

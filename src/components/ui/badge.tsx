import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'group/badge inline-flex shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        destructive:
          'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20',
      },
      size: {
        sm: 'h-5 px-2 text-[11px] [&>svg]:size-3',
        md: 'h-6 px-2.5 text-xs [&>svg]:size-3.5',
        lg: 'h-7 px-3 text-sm font-semibold [&>svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

function Badge({
  className,
  variant,
  size,
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props
    ),
    state: {
      slot: 'badge',
      variant,
      size,
    },
  });
}

export { Badge, badgeVariants };

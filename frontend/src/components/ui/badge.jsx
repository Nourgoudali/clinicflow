import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'border-transparent bg-primary text-primary-foreground hover:bg-teal-700',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive/10 text-destructive border border-destructive/20',
  outline: 'text-foreground border border-border',
  success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  warning: 'border-transparent bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
  info: 'border-transparent bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
};

function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

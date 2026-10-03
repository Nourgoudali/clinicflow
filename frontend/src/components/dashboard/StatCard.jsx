import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  colorScheme = 'default'
}) => {
  const schemeClasses = {
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    default: 'bg-primary/10 text-primary'
  };

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md border-border/70', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <h4 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</h4>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', schemeClasses[colorScheme] || schemeClasses.default)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {description && (
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            {trend && <span className="mr-1.5 font-medium text-emerald-600 dark:text-emerald-400">{trend}</span>}
            <span>{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

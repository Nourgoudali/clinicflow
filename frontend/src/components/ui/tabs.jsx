import * as React from 'react';
import { cn } from '@/lib/utils';

const Tabs = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { currentValue: value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ className, children, currentValue, onValueChange }) => {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { currentValue, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger = ({
  value,
  children,
  currentValue,
  onValueChange,
  className,
  ...props
}) => {
  const isSelected = currentValue === value;
  return (
    <button
      type="button"
      onClick={() => onValueChange && onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSelected
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:text-foreground text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, currentValue, children, className }) => {
  if (value !== currentValue) return null;
  return <div className={cn('mt-4 focus-visible:outline-none', className)}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

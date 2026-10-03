import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      {/* Content wrapper */}
      <div className="relative z-50 w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 my-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ className, children, onClose, ...props }) => (
  <div
    className={cn(
      'relative w-full rounded-xl border bg-background p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto',
      className
    )}
    {...props}
  >
    {children}
    {onClose && (
      <button
        onClick={onClose}
        className="absolute right-3.5 top-3.5 rounded-sm p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    )}
  </div>
);

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 text-left mb-4 pr-6', className)} {...props} />
);

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold leading-tight tracking-tight', className)} {...props} />
);

const DialogDescription = ({ className, ...props }) => (
  <p className={cn('text-xs sm:text-sm text-muted-foreground mt-1', className)} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 pt-2 border-t sm:border-t-0', className)} {...props} />
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
};

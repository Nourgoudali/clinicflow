import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md max-h-[90vh] flex flex-col animate-in zoom-in-95 my-auto">
        <div className="rounded-xl border bg-background p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 text-left', className)} {...props} />
);

const AlertDialogTitle = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold text-foreground', className)} {...props} />
);

const AlertDialogDescription = ({ className, ...props }) => (
  <p className={cn('text-xs sm:text-sm text-muted-foreground', className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 gap-2 pt-2 border-t sm:border-t-0', className)} {...props} />
);

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <Button ref={ref} variant="destructive" className={cn('w-full sm:w-auto', className)} {...props} />
));
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialogCancel = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    onClick={onClick}
    className={cn('w-full sm:w-auto', className)}
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
};
